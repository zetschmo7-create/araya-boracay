"use client";

import { useState, useTransition } from "react";
import {
  ENTITY_TYPE_LABELS,
  FINDER_STATUS_BADGE,
  FINDER_STATUS_LABELS,
} from "@/app/lib/admin/lead-finder/constants";
import type {
  LeadFinderResultRow,
  LeadFinderSearchStats,
} from "@/app/lib/admin/lead-finder/types";
import { CopyButton } from "../components/CopyButton";
import {
  deepResearchContactAction,
  generateDraftAction,
  getLeadFinderResultsAction,
  importSelectedLeadsAction,
  searchLeadsAction,
} from "./actions";

function FinderStatusBadge({ status }: { status: LeadFinderResultRow["finder_status"] }) {
  if (!status) return <span className="text-[var(--admin-text-muted)]">—</span>;
  return (
    <span className={`admin-badge ${FINDER_STATUS_BADGE[status]}`}>
      {FINDER_STATUS_LABELS[status]}
    </span>
  );
}

function SearchStatsBanner({ stats }: { stats: LeadFinderSearchStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-[var(--admin-text-muted)]">
          Search results found
        </p>
        <p className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl text-[var(--admin-accent-warm)]">
          {stats.resultsSaved}
        </p>
      </div>
      <div className="rounded border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-[var(--admin-text-muted)]">
          Contacts found
        </p>
        <p className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl text-[var(--admin-success)]">
          {stats.contactsFound}
        </p>
      </div>
      <div className="rounded border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-[var(--admin-text-muted)]">
          Research needed
        </p>
        <p className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl text-[var(--admin-ocean)]">
          {stats.researchNeeded}
        </p>
      </div>
    </div>
  );
}

export function LeadFinderClient({
  initialResults,
  initialLoadError,
}: {
  initialResults: LeadFinderResultRow[];
  initialLoadError: string | null;
}) {
  const [keywords, setKeywords] = useState("");
  const [results, setResults] = useState(initialResults);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(initialLoadError);
  const [message, setMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<LeadFinderSearchStats | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [draftingId, setDraftingId] = useState<string | null>(null);
  const [researchingId, setResearchingId] = useState<string | null>(null);
  const [isSearching, startSearch] = useTransition();
  const [isImporting, startImport] = useTransition();
  const [isRefreshing, startRefresh] = useTransition();

  const selectableResults = results.filter(
    (r) => !r.imported && !r.duplicate_of_lead_id,
  );

  function needsResearch(row: LeadFinderResultRow): boolean {
    return (
      row.finder_status === "research_needed" ||
      (!row.has_contact && row.finder_status !== "contact_found")
    );
  }

  async function refreshResults() {
    const data = await getLeadFinderResultsAction();
    setResults(data);
  }

  function handleSearch(useDefaults: boolean) {
    setError(null);
    setMessage(null);
    setStats(null);

    startSearch(async () => {
      try {
        const data = await searchLeadsAction(keywords, useDefaults);

        if (data.error) {
          setError(data.error);
          return;
        }

        setProvider(data.provider ?? null);
        setMessage(data.success ?? null);
        if (data.stats) setStats(data.stats);
        await refreshResults();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Search failed unexpectedly",
        );
      }
    });
  }

  function handleImport(researchNeeded: boolean) {
    if (selected.size === 0) {
      setError("Select at least one result to import.");
      return;
    }

    setError(null);

    startImport(async () => {
      try {
        const data = await importSelectedLeadsAction([...selected], researchNeeded);

        if (data.error) {
          setError(data.error);
          return;
        }

        setMessage(data.success ?? null);
        setSelected(new Set());
        await refreshResults();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Import failed unexpectedly",
        );
      }
    });
  }

  async function handleDeepResearch(id: string) {
    setResearchingId(id);
    setError(null);

    try {
      const data = await deepResearchContactAction(id);
      setResearchingId(null);

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage(data.success ?? "Deep research complete.");
      await refreshResults();
    } catch (err) {
      setResearchingId(null);
      setError(
        err instanceof Error ? err.message : "Deep research failed unexpectedly",
      );
    }
  }

  async function handleDraft(id: string) {
    setDraftingId(id);
    setError(null);

    try {
      const data = await generateDraftAction(id);
      setDraftingId(null);

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage(data.success ?? "Draft generated.");
      await refreshResults();
    } catch (err) {
      setDraftingId(null);
      setError(
        err instanceof Error ? err.message : "Draft failed unexpectedly",
      );
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === selectableResults.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(selectableResults.map((r) => r.id)));
    }
  }

  const isLoading = isSearching || isImporting || isRefreshing;

  return (
    <div className="space-y-8">
      <section className="admin-card space-y-5 p-6">
        <div>
          <label htmlFor="keywords" className="admin-label">
            Search keywords
          </label>
          <input
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="admin-input"
            placeholder="e.g. Boracay luxury villa contact"
            disabled={isSearching}
          />
          <p className="mt-2 text-xs text-[var(--admin-text-muted)]">
            Discovers public web results via SerpAPI — with or without visible
            contact details. Airbnb and Booking.com are excluded. Only public
            data; no login or captcha bypass.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleSearch(false)}
            disabled={isLoading}
            className="admin-btn admin-btn-primary"
          >
            {isSearching ? "Searching…" : "Find Leads"}
          </button>
          <button
            type="button"
            onClick={() => handleSearch(true)}
            disabled={isLoading}
            className="admin-btn admin-btn-secondary"
          >
            {isSearching ? "Running…" : "Run Default Queries"}
          </button>
          <button
            type="button"
            onClick={() => handleImport(false)}
            disabled={isLoading || selected.size === 0}
            className="admin-btn admin-btn-secondary"
          >
            {isImporting
              ? "Importing…"
              : `Import Selected (${selected.size})`}
          </button>
          <button
            type="button"
            onClick={() => handleImport(true)}
            disabled={isLoading || selected.size === 0}
            className="admin-btn admin-btn-secondary"
          >
            Import as Research Needed
          </button>
        </div>

        {isSearching && (
          <p className="text-sm text-[var(--admin-text-muted)]">
            Searching public web sources, analysing pages with AI, and saving
            all qualifying results — even without email or phone. This may take
            1–3 minutes…
          </p>
        )}

        {provider && (
          <p className="text-xs text-[var(--admin-text-muted)]">
            Search provider: {provider}
          </p>
        )}

        {stats && <SearchStatsBanner stats={stats} />}

        {error && (
          <p className="rounded border border-[rgba(184,107,92,0.3)] bg-[rgba(184,107,92,0.08)] px-4 py-3 text-sm text-[var(--admin-danger)]">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded border border-[rgba(107,158,138,0.3)] bg-[rgba(107,158,138,0.08)] px-4 py-3 text-sm text-[var(--admin-success)]">
            {message}
          </p>
        )}
      </section>

      <div className="admin-card overflow-x-auto">
        {isRefreshing && !isSearching && (
          <p className="border-b border-[var(--admin-border)] px-4 py-2 text-xs text-[var(--admin-text-muted)]">
            Refreshing results…
          </p>
        )}
        <table className="admin-table min-w-[1400px]">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  disabled={isLoading || selectableResults.length === 0}
                  checked={
                    selectableResults.length > 0 &&
                    selected.size === selectableResults.length
                  }
                  aria-label="Select all"
                />
              </th>
              <th>Property / Page</th>
              <th>Source URL</th>
              <th>Source Type</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Phone</th>
              <th>AI Fit</th>
              <th>Outreach Angle</th>
              <th>Next Action</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="py-12 text-center text-[var(--admin-text-muted)]"
                >
                  No results yet. Run a search to discover potential leads.
                </td>
              </tr>
            ) : (
              results.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      disabled={
                        isLoading || row.imported || !!row.duplicate_of_lead_id
                      }
                      onChange={() => toggleSelect(row.id)}
                      aria-label={`Select ${row.property_name ?? row.page_title}`}
                    />
                  </td>
                  <td>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-[var(--admin-accent-warm)]">
                        {row.property_name ?? row.page_title ?? "Untitled"}
                      </p>
                      {needsResearch(row) && !row.imported && (
                        <span className="admin-badge admin-badge-new">
                          Research Needed
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                      {row.entity_type
                        ? ENTITY_TYPE_LABELS[row.entity_type]
                        : "—"}
                    </p>
                    {row.page_summary && (
                      <p className="mt-1 max-w-xs text-xs text-[var(--admin-text-muted)] line-clamp-2">
                        {row.page_summary}
                      </p>
                    )}
                  </td>
                  <td>
                    <a
                      href={row.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block max-w-[180px] truncate text-xs text-[var(--admin-ocean)] hover:underline"
                      title={row.source_url}
                    >
                      {row.source_url}
                    </a>
                    {row.source_platform && (
                      <span className="mt-1 block text-[0.65rem] uppercase tracking-wider text-[var(--admin-text-muted)]">
                        {row.source_platform}
                      </span>
                    )}
                  </td>
                  <td className="text-xs text-[var(--admin-text-muted)]">
                    {row.source_type ?? "—"}
                  </td>
                  <td>
                    {row.has_contact ? (
                      <span className="admin-badge admin-badge-won">Yes</span>
                    ) : (
                      <span className="admin-badge admin-badge-high">No</span>
                    )}
                  </td>
                  <td className="text-sm">
                    {row.contact_email ?? (
                      <span className="text-[var(--admin-text-muted)]">—</span>
                    )}
                  </td>
                  <td className="text-sm text-[var(--admin-text-muted)]">
                    {row.contact_phone ?? row.whatsapp ?? "—"}
                  </td>
                  <td>
                    {row.araya_fit_score != null ? (
                      <span className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--admin-accent-warm)]">
                        {row.araya_fit_score}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="max-w-[180px] text-xs italic text-[var(--admin-text-muted)]">
                    {row.outreach_angle ?? "—"}
                  </td>
                  <td className="max-w-[220px] whitespace-pre-line text-xs text-[var(--admin-text-muted)]">
                    {row.next_action ?? "—"}
                  </td>
                  <td>
                    <FinderStatusBadge status={row.finder_status} />
                  </td>
                  <td>
                    <div className="flex min-w-[140px] flex-col gap-2">
                      {!row.has_contact && !row.imported && (
                        <button
                          type="button"
                          onClick={() => handleDeepResearch(row.id)}
                          disabled={researchingId === row.id || isLoading}
                          className="admin-btn admin-btn-ghost text-xs"
                        >
                          {researchingId === row.id
                            ? "Researching…"
                            : "Deep Research Contact"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDraft(row.id)}
                        disabled={draftingId === row.id || isLoading}
                        className="admin-btn admin-btn-ghost text-xs"
                      >
                        {draftingId === row.id ? "Drafting…" : "Generate draft"}
                      </button>
                      {row.ai_email_draft && (
                        <CopyButton text={row.ai_email_draft} label="Copy draft" />
                      )}
                    </div>
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
