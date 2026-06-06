import type { SupabaseClient } from "@supabase/supabase-js";
import { classifyLeadFinderResult } from "./classify";
import { inferSourcePlatform, isBlockedUrl } from "./blocked-domains";
import { extractContactsFromHtml, fetchPublicPage } from "./extract";
import { findExistingLeadDuplicate } from "./duplicates";
import { searchPublicWeb } from "./search";
import { DEFAULT_SEARCH_QUERIES } from "./types";
import type { LeadFinderResultRow, LeadFinderSearchStats } from "./types";

function normalizeUrl(url: string): string {
  return url.split("#")[0].replace(/\/$/, "");
}

async function existsFinderResult(
  supabase: SupabaseClient,
  url: string,
): Promise<boolean> {
  const normalized = normalizeUrl(url);
  const { data } = await supabase
    .from("lead_finder_results")
    .select("id")
    .eq("source_url", normalized)
    .maybeSingle();
  return !!data;
}

type InsertPayload = Record<string, unknown>;

async function insertFinderResult(
  supabase: SupabaseClient,
  payload: InsertPayload,
): Promise<{ row: LeadFinderResultRow | null; error: string | null }> {
  const { data: row, error } = await supabase
    .from("lead_finder_results")
    .insert(payload)
    .select("*")
    .single();

  if (!error && row) {
    return { row: row as LeadFinderResultRow, error: null };
  }

  const fallback: InsertPayload = {
    run_id: payload.run_id,
    page_title: payload.page_title,
    source_url: payload.source_url,
    property_name: payload.property_name,
    source_platform: payload.source_platform,
    page_summary: payload.page_summary,
    contact_email: payload.contact_email ?? null,
    contact_phone: payload.contact_phone ?? null,
    whatsapp: payload.whatsapp ?? null,
    extraction_evidence: payload.extraction_evidence ?? null,
    entity_type: payload.entity_type ?? null,
    araya_fit_score: payload.araya_fit_score ?? null,
    priority: payload.priority ?? null,
    fit_rationale: payload.fit_rationale ?? null,
    outreach_angle: payload.outreach_angle ?? null,
    duplicate_of_lead_id: payload.duplicate_of_lead_id ?? null,
  };

  const { data: fallbackRow, error: fallbackError } = await supabase
    .from("lead_finder_results")
    .insert(fallback)
    .select("*")
    .single();

  if (fallbackError || !fallbackRow) {
    return {
      row: null,
      error: fallbackError?.message ?? error?.message ?? "Insert failed",
    };
  }

  console.warn(
    "[lead-finder] Insert used fallback (migration 004 columns may be missing):",
    error?.message,
  );

  return { row: fallbackRow as LeadFinderResultRow, error: null };
}

export async function runLeadFinderSearch(
  supabase: SupabaseClient,
  options: { keywords?: string; useDefaults?: boolean },
): Promise<{
  results: LeadFinderResultRow[];
  provider: string;
  stats: LeadFinderSearchStats;
}> {
  const keywords = options.keywords?.trim();
  const queries = keywords
    ? [keywords]
    : options.useDefaults
      ? [...DEFAULT_SEARCH_QUERIES]
      : [...DEFAULT_SEARCH_QUERIES.slice(0, 3)];

  const allResults: LeadFinderResultRow[] = [];
  let lastProvider = "none";
  const stats: LeadFinderSearchStats = {
    serpApiReturned: 0,
    resultsSaved: 0,
    contactsFound: 0,
    researchNeeded: 0,
    blockedUrls: 0,
    skippedDuplicates: 0,
  };

  for (const query of queries.slice(0, 5)) {
    const { hits, provider } = await searchPublicWeb(query);
    lastProvider = provider;
    stats.serpApiReturned += hits.length;

    console.log(`[lead-finder] Query "${query}" — SerpAPI returned ${hits.length} hits`);

    const { data: run, error: runError } = await supabase
      .from("lead_finder_runs")
      .insert({ search_query: query, provider, result_count: 0 })
      .select("id")
      .single();

    if (runError || !run) {
      console.error("[lead-finder] lead_finder_runs insert failed:", runError);
      continue;
    }

    let runCount = 0;

    for (const hit of hits) {
      if (!hit.url) continue;

      if (isBlockedUrl(hit.url)) {
        stats.blockedUrls++;
        console.log("[lead-finder] Blocked URL:", hit.url);
        continue;
      }

      const sourceUrl = normalizeUrl(hit.url);

      if (await existsFinderResult(supabase, sourceUrl)) {
        stats.skippedDuplicates++;
        console.log("[lead-finder] Skipped duplicate URL:", sourceUrl);
        continue;
      }

      const sourcePlatform = inferSourcePlatform(hit.url);

      const { row, error: insertError } = await insertFinderResult(supabase, {
        run_id: run.id,
        page_title: hit.title || "Untitled",
        source_url: sourceUrl,
        property_name: hit.title || null,
        source_platform: sourcePlatform,
        source_type: hit.source,
        page_summary: hit.snippet ?? null,
        has_contact: false,
        finder_status: "research_needed",
        next_action: "Research contact details manually",
      });

      if (!row) {
        console.error("[lead-finder] Failed to save result:", sourceUrl, insertError);
        continue;
      }

      stats.resultsSaved++;
      stats.researchNeeded++;
      console.log("[lead-finder] Saved result immediately:", sourceUrl);

      let pageTitle = hit.title;
      let contacts = extractContactsFromHtml(hit.snippet ?? "");
      let evidence = contacts.evidence;

      try {
        const page = await fetchPublicPage(hit.url);
        if (page) {
          pageTitle = page.title ?? pageTitle;
          const pageContacts = extractContactsFromHtml(page.html);
          contacts = {
            emails: [...new Set([...contacts.emails, ...pageContacts.emails])],
            phones: [...new Set([...contacts.phones, ...pageContacts.phones])],
            whatsapp: [
              ...new Set([...contacts.whatsapp, ...pageContacts.whatsapp]),
            ],
            evidence: pageContacts.evidence || evidence,
          };
          evidence = pageContacts.evidence || evidence;
        }
      } catch (err) {
        console.warn("[lead-finder] Page fetch failed:", hit.url, err);
      }

      const hasContact =
        contacts.emails.length > 0 ||
        contacts.phones.length > 0 ||
        contacts.whatsapp.length > 0;

      const updatePayload: InsertPayload = {
        page_title: pageTitle,
        contact_email: contacts.emails[0] ?? null,
        contact_phone: contacts.phones[0] ?? null,
        whatsapp: contacts.whatsapp[0] ?? null,
        extraction_evidence: evidence || null,
        has_contact: hasContact,
        finder_status: hasContact ? "contact_found" : "research_needed",
        next_action: hasContact
          ? "Review contact and draft outreach"
          : "Research contact details manually",
      };

      if (hasContact) {
        stats.contactsFound++;
        stats.researchNeeded--;
        console.log("[lead-finder] Contact found for:", sourceUrl);
      }

      const duplicateId = await findExistingLeadDuplicate(supabase, {
        contact_email: contacts.emails[0] ?? null,
        contact_phone: contacts.phones[0] ?? null,
        source_url: sourceUrl,
      });

      if (duplicateId) {
        updatePayload.duplicate_of_lead_id = duplicateId;
        updatePayload.finder_status = "duplicate";
      }

      try {
        const classification = await classifyLeadFinderResult({
          title: pageTitle,
          url: hit.url,
          snippet: hit.snippet,
          emails: contacts.emails,
          phones: contacts.phones,
          evidence,
          sourcePlatform,
        });

        updatePayload.property_name =
          classification.property_name ?? hit.title ?? null;
        updatePayload.source_platform = classification.source_platform;
        updatePayload.source_type =
          classification.source_type ?? hit.source;
        updatePayload.page_summary = classification.page_summary;
        updatePayload.entity_type = classification.entity_type;
        updatePayload.araya_fit_score = classification.araya_fit_score;
        updatePayload.priority = classification.priority;
        updatePayload.fit_rationale = classification.fit_rationale;
        updatePayload.outreach_angle = classification.outreach_angle;

        if (!hasContact && classification.next_action) {
          updatePayload.next_action = classification.next_action;
        }
      } catch (err) {
        console.warn("[lead-finder] AI classification skipped:", hit.url, err);
      }

      const { data: updated, error: updateError } = await supabase
        .from("lead_finder_results")
        .update(updatePayload)
        .eq("id", row.id)
        .select("*")
        .single();

      if (updateError) {
        console.warn(
          "[lead-finder] Enrichment update failed (row still saved):",
          row.id,
          updateError.message,
        );
        allResults.push(row);
      } else if (updated) {
        allResults.push(updated as LeadFinderResultRow);
      } else {
        allResults.push(row);
      }

      runCount++;
    }

    await supabase
      .from("lead_finder_runs")
      .update({ result_count: runCount })
      .eq("id", run.id);
  }

  console.log("[lead-finder] Search complete:", {
    serpApiReturned: stats.serpApiReturned,
    resultsSaved: stats.resultsSaved,
    contactsFound: stats.contactsFound,
    researchNeeded: stats.researchNeeded,
    blockedUrls: stats.blockedUrls,
    skippedDuplicates: stats.skippedDuplicates,
  });

  return {
    results: allResults,
    provider: lastProvider,
    stats,
  };
}
