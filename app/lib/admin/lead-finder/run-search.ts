import type { SupabaseClient } from "@supabase/supabase-js";
import { classifyLeadFinderResult } from "./classify";
import { inferSourcePlatform, isBlockedUrl } from "./blocked-domains";
import { extractContactsFromHtml, fetchPublicPage } from "./extract";
import { findExistingLeadDuplicate } from "./duplicates";
import { searchPublicWeb } from "./search";
import { DEFAULT_SEARCH_QUERIES } from "./types";
import type { LeadFinderResultRow } from "./types";

export async function runLeadFinderSearch(
  supabase: SupabaseClient,
  options: { keywords?: string; useDefaults?: boolean },
): Promise<{ results: LeadFinderResultRow[]; provider: string; count: number }> {
  const keywords = options.keywords?.trim();
  const queries = keywords
    ? [keywords]
    : options.useDefaults
      ? [...DEFAULT_SEARCH_QUERIES]
      : [...DEFAULT_SEARCH_QUERIES.slice(0, 3)];

  const allResults: LeadFinderResultRow[] = [];
  let lastProvider = "none";

  for (const query of queries.slice(0, 5)) {
    const { hits, provider } = await searchPublicWeb(query);
    lastProvider = provider;

    const { data: run, error: runError } = await supabase
      .from("lead_finder_runs")
      .insert({ search_query: query, provider, result_count: 0 })
      .select("id")
      .single();

    if (runError || !run) {
      console.error("lead_finder_runs insert:", runError);
      continue;
    }

    let runCount = 0;

    for (const hit of hits) {
      if (isBlockedUrl(hit.url)) continue;

      let pageTitle = hit.title;
      let contacts = extractContactsFromHtml(hit.snippet ?? "");
      let evidence = contacts.evidence;

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

      if (contacts.emails.length === 0 && contacts.phones.length === 0) {
        continue;
      }

      const sourcePlatform = inferSourcePlatform(hit.url);

      let classification;
      try {
        classification = await classifyLeadFinderResult({
          title: pageTitle,
          url: hit.url,
          snippet: hit.snippet,
          emails: contacts.emails,
          phones: contacts.phones,
          evidence,
          sourcePlatform,
        });
      } catch (err) {
        console.error("classification error:", err);
        continue;
      }

      if (classification.entity_type === "irrelevant") continue;

      const duplicateId = await findExistingLeadDuplicate(supabase, {
        contact_email: contacts.emails[0] ?? null,
        contact_phone: contacts.phones[0] ?? null,
        source_url: hit.url,
      });

      const { data: row, error: insertError } = await supabase
        .from("lead_finder_results")
        .insert({
          run_id: run.id,
          page_title: pageTitle,
          source_url: hit.url,
          contact_email: contacts.emails[0] ?? null,
          contact_phone: contacts.phones[0] ?? null,
          whatsapp: contacts.whatsapp[0] ?? null,
          property_name: classification.property_name,
          source_platform: classification.source_platform,
          page_summary: classification.page_summary,
          extraction_evidence: evidence,
          entity_type: classification.entity_type,
          araya_fit_score: classification.araya_fit_score,
          priority: classification.priority,
          fit_rationale: classification.fit_rationale,
          outreach_angle: classification.outreach_angle,
          duplicate_of_lead_id: duplicateId,
        })
        .select("*")
        .single();

      if (!insertError && row) {
        allResults.push(row as LeadFinderResultRow);
        runCount++;
      }
    }

    await supabase
      .from("lead_finder_runs")
      .update({ result_count: runCount })
      .eq("id", run.id);
  }

  return {
    results: allResults,
    provider: lastProvider,
    count: allResults.length,
  };
}
