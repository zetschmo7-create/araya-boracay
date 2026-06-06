import { createLead, getLeads } from "@/app/lib/admin/leads";
import { requireAdmin } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import type { LeadFilter } from "@/app/lib/admin/types";

const NUMERIC_FIELDS = ["bedrooms", "review_count"] as const;
const DECIMAL_FIELDS = ["nightly_rate", "rating"] as const;

function parseFormLead(formData: FormData) {
  const lead: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (key === "screenshot" || typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;

    if ((NUMERIC_FIELDS as readonly string[]).includes(key)) {
      lead[key] = parseInt(trimmed, 10);
    } else if ((DECIMAL_FIELDS as readonly string[]).includes(key)) {
      lead[key] = parseFloat(trimmed);
    } else {
      lead[key] = trimmed;
    }
  }

  return lead;
}

export async function GET(request: Request) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filter = (searchParams.get("filter") ?? "all") as LeadFilter;

  try {
    const leads = await getLeads(supabase, filter);
    return NextResponse.json({ leads });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch leads" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    let leadData: Record<string, unknown>;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      leadData = parseFormLead(formData);

      const screenshot = formData.get("screenshot") as File | null;
      if (screenshot && screenshot.size > 0) {
        const ext = screenshot.name.split(".").pop() ?? "jpg";
        const path = `admin/${Date.now()}.${ext}`;
        const buffer = Buffer.from(await screenshot.arrayBuffer());

        const { error: uploadError } = await supabase.storage
          .from("lead-screenshots")
          .upload(path, buffer, { contentType: screenshot.type });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("lead-screenshots")
            .getPublicUrl(path);
          leadData.screenshot_url = urlData.publicUrl;
        }
      }
    } else {
      leadData = await request.json();
    }

    if (!leadData.property_name) {
      return NextResponse.json(
        { error: "Property name is required" },
        { status: 400 },
      );
    }

    const lead = await createLead(supabase, leadData);
    return NextResponse.json(lead, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create lead" },
      { status: 500 },
    );
  }
}
