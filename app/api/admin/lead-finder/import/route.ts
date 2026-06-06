import { importLeadFinderResults } from "@/app/lib/admin/lead-finder/import-results";
import { requireAdmin } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids, researchNeeded } = await request.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No results selected" }, { status: 400 });
  }

  try {
    const { imported, skipped } = await importLeadFinderResults(supabase, ids, {
      researchNeeded: Boolean(researchNeeded),
    });
    return NextResponse.json({
      imported,
      skipped,
      importedCount: imported.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Import failed" },
      { status: 500 },
    );
  }
}
