import { statusLabel } from "@/app/lib/admin/constants";
import type { LeadPriority, LeadStatus } from "@/app/lib/admin/types";

export function StatusBadge({ status }: { status: LeadStatus }) {
  const variant =
    status === "won"
      ? "admin-badge-won"
      : status === "lost" || status === "not_suitable"
        ? "admin-badge-lost"
        : status === "new"
          ? "admin-badge-new"
          : "";

  return (
    <span className={`admin-badge ${variant}`}>{statusLabel(status)}</span>
  );
}

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  if (priority !== "high") {
    return (
      <span className="admin-badge capitalize text-[var(--admin-text-muted)]">
        {priority}
      </span>
    );
  }
  return <span className="admin-badge admin-badge-high">High</span>;
}
