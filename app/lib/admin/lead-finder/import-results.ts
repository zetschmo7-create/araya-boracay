import type { SupabaseClient } from "@supabase/supabase-js";
import { createLead } from "../leads";
import { findExistingLeadDuplicate } from "./duplicates";

export async function importLeadFinderResults(
  supabase: SupabaseClient,
  ids: string[],
): Promise<{
  imported: string[];
  skipped: { id: string; reason: string }[];
}> {
  const imported: string[] = [];
  const skipped: { id: string; reason: string }[] = [];

  for (const id of ids.slice(0, 50)) {
    const { data: result } = await supabase
      .from("lead_finder_results")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!result) {
      skipped.push({ id, reason: "Not found" });
      continue;
    }

    if (result.imported) {
      skipped.push({ id, reason: "Already imported" });
      continue;
    }

    const duplicateId =
      result.duplicate_of_lead_id ??
      (await findExistingLeadDuplicate(supabase, {
        contact_email: result.contact_email,
        contact_phone: result.contact_phone,
        source_url: result.source_url,
      }));

    if (duplicateId) {
      await supabase
        .from("lead_finder_results")
        .update({ duplicate_of_lead_id: duplicateId })
        .eq("id", id);
      skipped.push({ id, reason: "Duplicate lead exists" });
      continue;
    }

    if (!result.contact_email && !result.contact_phone) {
      skipped.push({ id, reason: "No contact details" });
      continue;
    }

    const propertyType =
      result.entity_type === "condo_owner_operator"
        ? "Condo"
        : result.entity_type === "villa_owner_operator"
          ? "Villa"
          : null;

    const lead = await createLead(supabase, {
      property_name: result.property_name ?? result.page_title ?? "Boracay Lead",
      contact_email: result.contact_email,
      contact_phone: result.contact_phone,
      whatsapp: result.whatsapp,
      source_platform: result.source_platform,
      listing_url: result.source_url,
      listing_text: result.page_summary,
      property_type: propertyType,
      location: "Boracay",
      notes: [
        result.fit_rationale,
        result.extraction_evidence
          ? `Evidence: ${result.extraction_evidence}`
          : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
      araya_fit_score: result.araya_fit_score,
      priority: result.priority ?? "medium",
      status: "new",
      ai_summary: result.page_summary,
      ai_fit_rationale: result.fit_rationale,
      ai_outreach_angle: result.outreach_angle,
      ai_email_draft: result.ai_email_draft,
    });

    await supabase
      .from("lead_finder_results")
      .update({ imported: true, imported_lead_id: lead.id })
      .eq("id", id);

    imported.push(lead.id);
  }

  return { imported, skipped };
}
