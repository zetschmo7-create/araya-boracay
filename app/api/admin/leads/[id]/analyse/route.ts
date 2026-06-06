import { analyseLead } from "@/app/lib/admin/ai";
import {
  getLead,
  getLeadActivities,
  updateLead,
} from "@/app/lib/admin/leads";
import { requireAdmin } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const lead = await getLead(supabase, id);
  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const analysis = await analyseLead(lead);

    const priority =
      analysis.araya_fit_score >= 75
        ? "high"
        : analysis.araya_fit_score >= 50
          ? "medium"
          : "low";

    const updated = await updateLead(
      supabase,
      id,
      {
        araya_fit_score: analysis.araya_fit_score,
        priority,
        status: lead.status === "new" ? "qualified" : lead.status,
        ai_summary: analysis.summary,
        ai_fit_rationale: analysis.fit_rationale,
        ai_strengths: analysis.strengths,
        ai_weaknesses: analysis.weaknesses,
        ai_presentation_weaknesses: analysis.presentation_weaknesses,
        ai_operational_weaknesses: analysis.operational_weaknesses,
        ai_opportunity: analysis.opportunity,
        ai_outreach_angle: analysis.outreach_angle,
        ai_email_draft: analysis.email_draft,
        ai_whatsapp_draft: analysis.whatsapp_draft,
        ai_follow_up_1: analysis.follow_up_1,
        ai_follow_up_2: analysis.follow_up_2,
        ai_analysed_at: new Date().toISOString(),
      },
      undefined,
      `AI analysis completed — fit score ${analysis.araya_fit_score}`,
    );

    const activities = await getLeadActivities(supabase, id);
    return NextResponse.json({ lead: updated, activities });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 },
    );
  }
}
