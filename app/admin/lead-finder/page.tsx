export const dynamic = "force-dynamic";

import type { LeadFinderResultRow } from "@/app/lib/admin/lead-finder/types";
import { getLeadFinderResultsAction } from "./actions";
import { LeadFinderClient } from "./LeadFinderClient";

export default async function LeadFinderPage() {
  let initialResults: LeadFinderResultRow[] = [];
  let loadError: string | null = null;

  try {
    initialResults = await getLeadFinderResultsAction();
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Failed to load lead finder results";
  }

  return (
    <div>
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">
          Discovery
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl font-light">
          Public Lead Finder
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--admin-text-muted)]">
          Finds publicly displayed contact details from villa websites,
          directories, and business listings. Airbnb and Booking.com are excluded.
          All outreach requires human approval.
        </p>
      </header>
      <LeadFinderClient
        initialResults={initialResults}
        initialLoadError={loadError}
      />
    </div>
  );
}
