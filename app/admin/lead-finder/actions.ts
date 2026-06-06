"use server";

import { generateFinderOutreachDraft } from "@/app/lib/admin/lead-finder/classify";
import { runDeepResearchContact } from "@/app/lib/admin/lead-finder/deep-research";
import { importLeadFinderResults } from "@/app/lib/admin/lead-finder/import-results";
import { checkSearchRateLimit } from "@/app/lib/admin/lead-finder/rate-limit";
import { runLeadFinderSearch } from "@/app/lib/admin/lead-finder/run-search";
import type {
  LeadFinderResultRow,
  LeadFinderSearchStats,
} from "@/app/lib/admin/lead-finder/types";
import { getAdminSession } from "@/app/lib/admin/session";
import { requireAdmin } from "@/app/lib/supabase/server";

export type LeadFinderActionState = {
  error?: string;
  success?: string;
  provider?: string;
  stats?: LeadFinderSearchStats;
};

async function assertAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) throw new Error("Unauthorized");

  return { session, supabase };
}

function formatSearchSummary(stats: LeadFinderSearchStats): string {
  return `Found ${stats.resultsSaved} search results. ${stats.contactsFound} contacts found. ${stats.researchNeeded} require research.`;
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

    const { results, provider, stats } = await runLeadFinderSearch(supabase, {
      keywords,
      useDefaults,
    });

    console.log("[lead-finder] searchLeadsAction complete:", stats);

    return {
      success: formatSearchSummary(stats),
      provider,
      stats,
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
  researchNeeded = false,
): Promise<LeadFinderActionState & { importedCount?: number }> {
  try {
    if (!ids.length) return { error: "Select at least one lead to import." };

    const { supabase } = await assertAdmin();
    const { imported, skipped } = await importLeadFinderResults(supabase, ids, {
      researchNeeded,
    });

    const label = researchNeeded ? "research leads" : "leads";
    return {
      success: `Imported ${imported.length} ${label}. Skipped ${skipped.length}.`,
      importedCount: imported.length,
    };
  } catch (err) {
    console.error("importSelectedLeadsAction:", err);
    return {
      error: err instanceof Error ? err.message : "Import failed",
    };
  }
}

export async function deepResearchContactAction(
  id: string,
): Promise<LeadFinderActionState> {
  try {
    const { session, supabase } = await assertAdmin();

    const rate = checkSearchRateLimit(`${session.email}:deep`);
    if (!rate.allowed) {
      const minutes = Math.ceil((rate.retryAfterMs ?? 0) / 60000);
      return {
        error: `Research rate limit reached. Try again in ${minutes} minutes.`,
      };
    }

    const updated = await runDeepResearchContact(supabase, id);

    const found = updated.has_contact ? "Contact found." : "No public contact found yet.";
    return { success: `Deep research complete. ${found}` };
  } catch (err) {
    console.error("deepResearchContactAction:", err);
    return {
      error: err instanceof Error ? err.message : "Deep research failed",
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
