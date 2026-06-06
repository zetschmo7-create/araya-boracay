export const dynamic = "force-dynamic";

import Link from "next/link";
import { StatCard } from "../components/StatCard";
import { getDashboardStats } from "@/app/lib/admin/leads";
import { requireAdmin } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin || !supabase) redirect("/admin/login");

  const stats = await getDashboardStats(supabase);

  return (
    <div>
      <header className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">
            Overview
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[var(--admin-text)]">
            Lead Dashboard
          </h1>
        </div>
        <Link href="/admin/leads/new" className="admin-btn admin-btn-primary">
          Add Lead
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Leads" value={stats.total} />
        <StatCard label="New Leads" value={stats.new} accent="ocean" />
        <StatCard label="High Priority" value={stats.high_priority} accent="warning" />
        <StatCard label="Follow-ups Due" value={stats.follow_ups_due} accent="warning" />
        <StatCard label="Contacted" value={stats.contacted} />
        <StatCard label="Replied" value={stats.replied} accent="ocean" />
        <StatCard label="Won" value={stats.won} accent="success" />
        <StatCard label="Lost" value={stats.lost} accent="default" />
      </div>

      <div className="admin-card mt-10 p-8">
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
          Pipeline
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--admin-text-muted)]">
          Review new Boracay villa and condo owner leads, run AI assessment, draft
          personalised outreach, and track follow-ups — all with human approval
          before any contact is made.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/admin/leads" className="admin-btn admin-btn-secondary">
            View All Leads
          </Link>
          <Link
            href="/admin/leads?filter=follow_up_due"
            className="admin-btn admin-btn-ghost"
          >
            Follow-ups Due
          </Link>
        </div>
      </div>
    </div>
  );
}
