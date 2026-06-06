import { generateFinderOutreachDraft } from "@/app/lib/admin/lead-finder/classify";
import { requireAdmin } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Result id required" }, { status: 400 });
  }

  const { data: result } = await supabase
    .from("lead_finder_results")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
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

    return NextResponse.json({ draft });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Draft generation failed" },
      { status: 500 },
    );
  }
}
