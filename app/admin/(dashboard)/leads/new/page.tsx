import { NewLeadForm } from "./NewLeadForm";

export default function NewLeadPage() {
  return (
    <div>
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">
          New Lead
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl font-light">
          Add Lead
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[var(--admin-text-muted)]">
          Enter a listing URL, paste listing text, upload a screenshot, or fill
          in details manually.
        </p>
      </header>
      <NewLeadForm />
    </div>
  );
}
