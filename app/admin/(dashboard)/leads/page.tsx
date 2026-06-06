export const dynamic = "force-dynamic";

import Link from "next/link";
import { LeadFilters } from "../../components/LeadFilters";
import { PriorityBadge, StatusBadge } from "../../components/StatusBadge";
import { getLeads } from "@/app/lib/admin/leads";
import { requireAdmin } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";
import type { LeadFilter } from "@/app/lib/admin/types";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = (params.filter ?? "all") as LeadFilter;
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) redirect("/admin/login");

  const leads = await getLeads(supabase, filter);

  return (
    <div>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">
            CRM
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl font-light">
            Leads
          </h1>
        </div>
        <Link href="/admin/leads/new" className="admin-btn admin-btn-primary">
          Add Lead
        </Link>
      </header>

      <div className="mb-6">
        <LeadFilters active={filter} />
      </div>

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Fit Score</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Follow-up</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[var(--admin-text-muted)]">
                  No leads found.{" "}
                  <Link href="/admin/leads/new" className="text-[var(--admin-accent)] underline">
                    Add your first lead
                  </Link>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-[var(--admin-accent-warm)] hover:underline"
                    >
                      {lead.property_name || "Untitled"}
                    </Link>
                  </td>
                  <td className="text-[var(--admin-text-muted)]">
                    {lead.owner_name || "—"}
                  </td>
                  <td className="text-[var(--admin-text-muted)]">
                    {lead.location || "—"}
                  </td>
                  <td>
                    {lead.araya_fit_score != null ? (
                      <span className="font-[family-name:var(--font-cormorant)] text-lg">
                        {lead.araya_fit_score}
                      </span>
                    ) : (
                      <span className="text-[var(--admin-text-muted)]">—</span>
                    )}
                  </td>
                  <td>
                    <PriorityBadge priority={lead.priority} />
                  </td>
                  <td>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="text-[var(--admin-text-muted)]">
                    {formatDate(lead.next_follow_up_at)}
                  </td>
                  <td className="text-[var(--admin-text-muted)]">
                    {formatDate(lead.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
