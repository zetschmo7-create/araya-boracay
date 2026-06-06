"use server";

import { generateFinderOutreachDraft } from "@/app/lib/admin/lead-finder/classify";
import { importLeadFinderResults } from "@/app/lib/admin/lead-finder/import-results";
import { checkSearchRateLimit } from "@/app/lib/admin/lead-finder/rate-limit";
import { runLeadFinderSearch } from "@/app/lib/admin/lead-finder/run-search";
import type { LeadFinderResultRow } from "@/app/lib/admin/lead-finder/types";
import { getAdminSession } from "@/app/lib/admin/session";
import { requireAdmin } from "@/app/lib/supabase/server";

export type LeadFinderActionState = {
  error?: string;
  success?: string;
  provider?: string;
  count?: number;
};

async function assertAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) throw new Error("Unauthorized");

  return { session, supabase };
}

export async function getLeadFinderResultsAction(): Promise<LeadFinderResultRow[]> {
  const { supabase } = await assertAdmin();

  const { data, error } = await supabase
    .from("lead_finder_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return (data ?? []) as LeadFinderResultRow[];
}

export async function searchLeadsAction(
  keywords: string,
  useDefaults: boolean,
): Promise<LeadFinderActionState & { results?: LeadFinderResultRow[] }> {
  try {
    const { session, supabase } = await assertAdmin();

    const rate = checkSearchRateLimit(session.email);
    if (!rate.allowed) {
      const minutes = Math.ceil((rate.retryAfterMs ?? 0) / 60000);
      return {
        error: `Search rate limit reached. Try again in ${minutes} minutes.`,
      };
    }

    const { results, provider, count } = await runLeadFinderSearch(supabase, {
      keywords,
      useDefaults,
    });

    return {
      success: `Found ${count} new leads with public contact details.`,
      provider,
      count,
      results,
    };
  } catch (err) {
    console.error("searchLeadsAction:", err);
    return {
      error: err instanceof Error ? err.message : "Lead finder search failed",
    };
  }
}

export async function importSelectedLeadsAction(
  ids: string[],
): Promise<LeadFinderActionState & { importedCount?: number }> {
  try {
    if (!ids.length) return { error: "Select at least one lead to import." };

    const { supabase } = await assertAdmin();
    const { imported, skipped } = await importLeadFinderResults(supabase, ids);

    return {
      success: `Imported ${imported.length} leads. Skipped ${skipped.length}.`,
      importedCount: imported.length,
    };
  } catch (err) {
    console.error("importSelectedLeadsAction:", err);
    return {
      error: err instanceof Error ? err.message : "Import failed",
    };
  }
}

export async function generateDraftAction(
  id: string,
): Promise<LeadFinderActionState & { draft?: string }> {
  try {
    const { supabase } = await assertAdmin();

    const { data: result } = await supabase
      .from("lead_finder_results")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!result) return { error: "Result not found" };

    const draft = await generateFinderOutreachDraft({
      property_name: result.property_name,
      page_title: result.page_title,
      source_url: result.source_url,
      contact_email: result.contact_email,
      page_summary: result.page_summary,
      outreach_angle: result.outreach_angle,
      fit_rationale: result.fit_rationale,
    });

    await supabase
      .from("lead_finder_results")
      .update({ ai_email_draft: draft })
      .eq("id", id);

    return { success: "Draft generated.", draft };
  } catch (err) {
    console.error("generateDraftAction:", err);
    return {
      error: err instanceof Error ? err.message : "Draft generation failed",
    };
  }
}
