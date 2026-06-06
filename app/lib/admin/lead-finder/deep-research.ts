import type { SupabaseClient } from "@supabase/supabase-js";
import { isBlockedUrl } from "./blocked-domains";
import { extractContactsFromHtml, fetchPublicPage } from "./extract";
import { searchPublicWeb } from "./search";
import { resolveFinderStatus } from "./status";
import type { LeadFinderResultRow } from "./types";

function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function mergeContacts(
  existing: { emails: string[]; phones: string[]; whatsapp: string[] },
  found: { emails: string[]; phones: string[]; whatsapp: string[] },
) {
  return {
    emails: [...new Set([...existing.emails, ...found.emails])],
    phones: [...new Set([...existing.phones, ...found.phones])],
    whatsapp: [...new Set([...existing.whatsapp, ...found.whatsapp])],
  };
}

export async function runDeepResearchContact(
  supabase: SupabaseClient,
  resultId: string,
): Promise<LeadFinderResultRow> {
  const { data: result, error } = await supabase
    .from("lead_finder_results")
    .select("*")
    .eq("id", resultId)
    .single();

  if (error || !result) {
    throw new Error("Result not found");
  }

  const name =
    result.property_name ?? result.page_title ?? "Boracay property";
  const domain = extractDomain(result.source_url);

  const queries = [
    `${name} email Boracay`,
    `${name} contact Boracay`,
    `${name} Facebook Boracay`,
    `${name} WhatsApp Boracay`,
    domain ? `${domain} contact email` : null,
    domain ? `${name} site:${domain} email` : null,
  ].filter(Boolean) as string[];

  let contacts = {
    emails: result.contact_email ? [result.contact_email] : [],
    phones: result.contact_phone ? [result.contact_phone] : [],
    whatsapp: result.whatsapp ? [result.whatsapp] : [],
  };

  let evidence = result.extraction_evidence ?? "";
  const searchedUrls = new Set<string>();

  for (const query of queries.slice(0, 6)) {
    const { hits } = await searchPublicWeb(query);

    for (const hit of hits.slice(0, 4)) {
      if (isBlockedUrl(hit.url) || searchedUrls.has(hit.url)) continue;
      searchedUrls.add(hit.url);

      const snippetContacts = extractContactsFromHtml(hit.snippet ?? "");
      contacts = mergeContacts(contacts, snippetContacts);

      const page = await fetchPublicPage(hit.url);
      if (page) {
        const pageContacts = extractContactsFromHtml(page.html);
        contacts = mergeContacts(contacts, pageContacts);
        if (pageContacts.evidence) {
          evidence = [evidence, pageContacts.evidence].filter(Boolean).join("\n---\n");
        }
      }

      if (contacts.emails.length > 0 || contacts.phones.length > 0) {
        break;
      }
    }

    if (contacts.emails.length > 0 || contacts.phones.length > 0) {
      break;
    }
  }

  const hasContact =
    contacts.emails.length > 0 ||
    contacts.phones.length > 0 ||
    contacts.whatsapp.length > 0;

  const deepResearchNote = hasContact
    ? "Deep research found public contact details."
    : "Deep research completed — no public email/phone found. Continue manual research per next action.";

  const nextAction = hasContact
    ? "Contact found via deep research. Review and draft outreach."
    : [
        result.next_action,
        "Deep research queries run:",
        ...queries.map((q) => `- ${q}`),
        "Try: website contact page, Facebook, Instagram, Google Maps listing.",
      ]
        .filter(Boolean)
        .join("\n");

  const finderStatus = resolveFinderStatus({
    hasContact,
    entityType: result.entity_type ?? "irrelevant",
    worthManualResearch: true,
    duplicateId: result.duplicate_of_lead_id,
    arayaFitScore: result.araya_fit_score ?? 0,
  });

  const { data: updated, error: updateError } = await supabase
    .from("lead_finder_results")
    .update({
      contact_email: contacts.emails[0] ?? result.contact_email,
      contact_phone: contacts.phones[0] ?? result.contact_phone,
      whatsapp: contacts.whatsapp[0] ?? result.whatsapp,
      has_contact: hasContact,
      finder_status: result.imported ? "imported" : finderStatus,
      extraction_evidence: evidence.slice(0, 2000),
      next_action: nextAction,
      fit_rationale: [result.fit_rationale, deepResearchNote]
        .filter(Boolean)
        .join("\n"),
    })
    .eq("id", resultId)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw new Error(updateError?.message ?? "Failed to update result");
  }

  return updated as LeadFinderResultRow;
}
