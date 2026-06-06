export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="admin-card w-full max-w-md p-10">
        <div className="mb-10 text-center">
          <p className="font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-[0.14em] text-[var(--admin-accent-warm)]">
            ARAYA
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">
            {subtitle ?? "Admin Lead Engine"}
          </p>
          {title && (
            <p className="mt-4 text-sm text-[var(--admin-text)]">{title}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
