import { runLeadFinderSearch } from "@/app/lib/admin/lead-finder/run-search";
import { checkSearchRateLimit } from "@/app/lib/admin/lead-finder/rate-limit";
import { getAdminSession } from "@/app/lib/admin/session";
import { requireAdmin } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export const maxDuration = 120;

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = checkSearchRateLimit(session.email);
  if (!rate.allowed) {
    const minutes = Math.ceil((rate.retryAfterMs ?? 0) / 60000);
    return NextResponse.json(
      { error: `Search rate limit reached. Try again in ${minutes} minutes.` },
      { status: 429 },
    );
  }

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const result = await runLeadFinderSearch(supabase, {
      keywords: body.keywords,
      useDefaults: body.useDefaults,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("lead-finder search:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Lead finder search failed",
      },
      { status: 500 },
    );
  }
}
