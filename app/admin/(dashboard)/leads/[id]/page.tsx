export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { PriorityBadge, StatusBadge } from "../../../components/StatusBadge";
import { LeadDetailClient } from "./LeadDetailClient";
import { getLead, getLeadActivities } from "@/app/lib/admin/leads";
import { requireAdmin } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) redirect("/admin/login");

  const [lead, activities] = await Promise.all([
    getLead(supabase, id),
    getLeadActivities(supabase, id),
  ]);

  if (!lead) notFound();

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/leads"
          className="text-xs uppercase tracking-[0.12em] text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]"
        >
          ← Back to Leads
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
              {lead.property_name || "Untitled Lead"}
            </h1>
            <p className="mt-2 text-sm text-[var(--admin-text-muted)]">
              {lead.owner_name && `${lead.owner_name} · `}
              {lead.location || "Boracay"}
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={lead.status} />
            <PriorityBadge priority={lead.priority} />
            {lead.araya_fit_score != null && (
              <span className="admin-badge border-[var(--admin-accent)] text-[var(--admin-accent-warm)]">
                Fit {lead.araya_fit_score}
              </span>
            )}
          </div>
        </div>
      </header>

      <LeadDetailClient lead={lead} activities={activities} />
    </div>
  );
}
