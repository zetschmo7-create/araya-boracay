"use client";

import Link from "next/link";
import { LEAD_FILTERS } from "@/app/lib/admin/constants";
import type { LeadFilter } from "@/app/lib/admin/types";

export function LeadFilters({ active }: { active: LeadFilter }) {
  return (
    <div className="flex flex-wrap gap-2">
      {LEAD_FILTERS.map((f) => (
        <Link
          key={f.value}
          href={f.value === "all" ? "/admin/leads" : `/admin/leads?filter=${f.value}`}
          className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
            active === f.value
              ? "border-[var(--admin-accent)] bg-[rgba(201,184,162,0.1)] text-[var(--admin-accent-warm)]"
              : "border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-text)]"
          }`}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}
