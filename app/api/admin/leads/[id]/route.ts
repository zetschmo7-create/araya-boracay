import {
  getLead,
  getLeadActivities,
  updateLead,
} from "@/app/lib/admin/leads";
import { requireAdmin } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
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

  const activities = await getLeadActivities(supabase, id);
  return NextResponse.json({ lead, activities });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { activity, ...updates } = body;

  const allowedFields = [
    "status",
    "priority",
    "notes",
    "last_contacted_at",
    "next_follow_up_at",
    "owner_name",
    "contact_email",
    "contact_phone",
    "whatsapp",
    "instagram",
    "property_name",
    "location",
    "araya_fit_score",
  ];

  const sanitized: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) sanitized[key] = updates[key];
  }

  if (Object.keys(sanitized).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  try {
    const lead = await updateLead(
      supabase,
      id,
      sanitized,
      undefined,
      activity ?? "Lead updated",
    );
    const activities = await getLeadActivities(supabase, id);
    return NextResponse.json({ lead, activities });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 },
    );
  }
}
