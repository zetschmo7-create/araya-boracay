interface StatCardProps {
  label: string;
  value: number;
  accent?: "default" | "warm" | "ocean" | "success" | "warning";
}

const ACCENT: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "var(--admin-accent-warm)",
  warm: "var(--admin-accent-warm)",
  ocean: "var(--admin-ocean)",
  success: "var(--admin-success)",
  warning: "var(--admin-warning)",
};

export function StatCard({ label, value, accent = "default" }: StatCardProps) {
  return (
    <div className="admin-card p-6">
      <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
        {label}
      </p>
      <p
        className="admin-stat-value mt-3"
        style={{ color: ACCENT[accent] }}
      >
        {value}
      </p>
    </div>
  );
}
