"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/leads", label: "Leads", exact: false },
  { href: "/admin/leads/new", label: "Add Lead", exact: true },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="border-b border-[var(--admin-border)] px-6 py-8">
        <p className="font-[family-name:var(--font-cormorant)] text-2xl font-light tracking-[0.12em] text-[var(--admin-accent-warm)]">
          ARAYA
        </p>
        <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
          Lead Engine
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded px-3 py-2.5 text-sm transition-colors ${
              isActive(item.href, item.exact)
                ? "bg-[rgba(228,196,160,0.1)] text-[var(--admin-accent-warm)]"
                : "text-[var(--admin-text-muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--admin-text)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-[var(--admin-border)] p-4">
        <form action="/api/admin/auth/logout" method="POST">
          <button type="submit" className="admin-btn admin-btn-ghost w-full text-left">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
