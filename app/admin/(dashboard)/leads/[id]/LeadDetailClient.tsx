"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CopyButton } from "../../../components/CopyButton";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/app/lib/admin/constants";
import type { Lead, LeadActivity } from "@/app/lib/admin/types";

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null || value === "") return null;
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-[var(--admin-border)] py-3 text-sm last:border-0">
      <dt className="text-[var(--admin-text-muted)]">{label}</dt>
      <dd className="col-span-2 text-[var(--admin-text)]">{value}</dd>
    </div>
  );
}

function DraftBlock({
  title,
  content,
  copyLabel,
}: {
  title: string;
  content: string | null;
  copyLabel: string;
}) {
  if (!content) return null;
  return (
    <div className="admin-card-raised p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.1em] text-[var(--admin-text-muted)]">
          {title}
        </h3>
        <CopyButton text={content} label={copyLabel} />
      </div>
      <p className="admin-prose text-sm">{content}</p>
      <p className="mt-3 text-[0.6875rem] text-[var(--admin-text-muted)]">
        Draft only — requires human approval before sending.
      </p>
    </div>
  );
}

export function LeadDetailClient({
  lead: initialLead,
  activities: initialActivities,
}: {
  lead: Lead;
  activities: LeadActivity[];
}) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [activities, setActivities] = useState(initialActivities);
  const [analysing, setAnalysing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [followUpDate, setFollowUpDate] = useState(
    lead.next_follow_up_at?.slice(0, 10) ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyse() {
    setAnalysing(true);
    setError(null);
    const res = await fetch(`/api/admin/leads/${lead.id}/analyse`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Analysis failed");
      setAnalysing(false);
      return;
    }
    setLead(data.lead);
    setActivities(data.activities);
    setAnalysing(false);
    router.refresh();
  }

  async function patchLead(
    updates: Record<string, unknown>,
    activity?: string,
  ) {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updates, activity }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Update failed");
      setSaving(false);
      return;
    }
    setLead(data.lead);
    setActivities(data.activities);
    setSaving(false);
    router.refresh();
  }

  async function handleMarkContacted() {
    await patchLead(
      {
        status: lead.status === "new" || lead.status === "qualified" || lead.status === "drafted"
          ? "contacted"
          : lead.status,
        last_contacted_at: new Date().toISOString(),
      },
      "Marked as contacted",
    );
  }

  async function handleSaveNotes() {
    await patchLead({ notes }, "Notes updated");
  }

  async function handleScheduleFollowUp() {
    await patchLead(
      {
        next_follow_up_at: followUpDate
          ? new Date(followUpDate).toISOString()
          : null,
      },
      followUpDate ? `Follow-up scheduled for ${followUpDate}` : "Follow-up cleared",
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Actions */}
        <div className="admin-card flex flex-wrap gap-3 p-5">
          <button
            type="button"
            onClick={handleAnalyse}
            disabled={analysing}
            className="admin-btn admin-btn-primary"
          >
            {analysing ? "Analysing…" : "Analyse Lead"}
          </button>
          <button
            type="button"
            onClick={handleMarkContacted}
            disabled={saving}
            className="admin-btn admin-btn-secondary"
          >
            Mark as Contacted
          </button>
          {lead.listing_url && (
            <a
              href={lead.listing_url}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-ghost"
            >
              View Listing
            </a>
          )}
        </div>

        {error && (
          <p className="text-sm text-[var(--admin-danger)]">{error}</p>
        )}

        {/* AI Assessment */}
        {lead.ai_analysed_at && (
          <section className="admin-card space-y-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
                AI Assessment
              </h2>
              <span className="text-xs text-[var(--admin-text-muted)]">
                {formatDateTime(lead.ai_analysed_at)}
              </span>
            </div>

            {lead.ai_summary && (
              <p className="text-sm leading-relaxed">{lead.ai_summary}</p>
            )}

            {lead.ai_fit_rationale && (
              <div>
                <h3 className="admin-label">Fit Rationale</h3>
                <p className="text-sm leading-relaxed text-[var(--admin-text-muted)]">
                  {lead.ai_fit_rationale}
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {lead.ai_strengths.length > 0 && (
                <div>
                  <h3 className="admin-label">Strengths</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {lead.ai_strengths.map((s) => (
                      <li key={s} className="text-[var(--admin-success)]">
                        + {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lead.ai_weaknesses.length > 0 && (
                <div>
                  <h3 className="admin-label">Weaknesses</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {lead.ai_weaknesses.map((w) => (
                      <li key={w} className="text-[var(--admin-warning)]">
                        − {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {lead.ai_presentation_weaknesses && (
              <div>
                <h3 className="admin-label">Presentation Weaknesses</h3>
                <p className="text-sm text-[var(--admin-text-muted)]">
                  {lead.ai_presentation_weaknesses}
                </p>
              </div>
            )}

            {lead.ai_operational_weaknesses && (
              <div>
                <h3 className="admin-label">Operational Weaknesses</h3>
                <p className="text-sm text-[var(--admin-text-muted)]">
                  {lead.ai_operational_weaknesses}
                </p>
              </div>
            )}

            {lead.ai_opportunity && (
              <div>
                <h3 className="admin-label">Opportunity</h3>
                <p className="text-sm text-[var(--admin-text-muted)]">
                  {lead.ai_opportunity}
                </p>
              </div>
            )}

            {lead.ai_outreach_angle && (
              <div>
                <h3 className="admin-label">Suggested Outreach Angle</h3>
                <p className="text-sm italic text-[var(--admin-accent-warm)]">
                  {lead.ai_outreach_angle}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Outreach drafts */}
        {(lead.ai_email_draft ||
          lead.ai_whatsapp_draft ||
          lead.ai_follow_up_1 ||
          lead.ai_follow_up_2) && (
          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
              Outreach Drafts
            </h2>
            <DraftBlock
              title="Email"
              content={lead.ai_email_draft}
              copyLabel="Copy Email"
            />
            <DraftBlock
              title="WhatsApp / Instagram DM"
              content={lead.ai_whatsapp_draft}
              copyLabel="Copy DM"
            />
            <DraftBlock
              title="Follow-up 1"
              content={lead.ai_follow_up_1}
              copyLabel="Copy"
            />
            <DraftBlock
              title="Follow-up 2"
              content={lead.ai_follow_up_2}
              copyLabel="Copy"
            />
          </section>
        )}

        {/* Lead info */}
        <section className="admin-card p-6">
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-2xl font-light">
            Lead Information
          </h2>
          <dl>
            <InfoRow label="Owner" value={lead.owner_name} />
            <InfoRow label="Email" value={lead.contact_email} />
            <InfoRow label="Phone" value={lead.contact_phone} />
            <InfoRow label="WhatsApp" value={lead.whatsapp} />
            <InfoRow label="Instagram" value={lead.instagram} />
            <InfoRow label="Platform" value={lead.source_platform} />
            <InfoRow label="Type" value={lead.property_type} />
            <InfoRow label="Bedrooms" value={lead.bedrooms} />
            <InfoRow label="Nightly Rate" value={lead.nightly_rate ? `₱${lead.nightly_rate}` : null} />
            <InfoRow label="Rating" value={lead.rating} />
            <InfoRow label="Reviews" value={lead.review_count} />
            <InfoRow label="Last Contacted" value={formatDateTime(lead.last_contacted_at)} />
            <InfoRow label="Next Follow-up" value={formatDateTime(lead.next_follow_up_at)} />
          </dl>
          {lead.property_description && (
            <div className="mt-4 border-t border-[var(--admin-border)] pt-4">
              <h3 className="admin-label">Description</h3>
              <p className="mt-2 text-sm leading-relaxed">{lead.property_description}</p>
            </div>
          )}
          {lead.listing_text && (
            <div className="mt-4 border-t border-[var(--admin-border)] pt-4">
              <h3 className="admin-label">Listing Text</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text-muted)]">
                {lead.listing_text}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Sidebar controls */}
      <div className="space-y-6">
        <section className="admin-card space-y-4 p-5">
          <h2 className="text-sm uppercase tracking-[0.1em] text-[var(--admin-text-muted)]">
            Status
          </h2>
          <select
            value={lead.status}
            onChange={(e) => patchLead({ status: e.target.value }, `Status changed to ${e.target.value}`)}
            className="admin-input"
            disabled={saving}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <h2 className="pt-2 text-sm uppercase tracking-[0.1em] text-[var(--admin-text-muted)]">
            Priority
          </h2>
          <select
            value={lead.priority}
            onChange={(e) => patchLead({ priority: e.target.value }, `Priority changed to ${e.target.value}`)}
            className="admin-input"
            disabled={saving}
          >
            {LEAD_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </section>

        <section className="admin-card space-y-4 p-5">
          <h2 className="text-sm uppercase tracking-[0.1em] text-[var(--admin-text-muted)]">
            Schedule Follow-up
          </h2>
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="admin-input"
          />
          <button
            type="button"
            onClick={handleScheduleFollowUp}
            disabled={saving}
            className="admin-btn admin-btn-secondary w-full"
          >
            Save Follow-up Date
          </button>
        </section>

        <section className="admin-card space-y-4 p-5">
          <h2 className="text-sm uppercase tracking-[0.1em] text-[var(--admin-text-muted)]">
            Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="admin-input resize-y"
          />
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={saving}
            className="admin-btn admin-btn-secondary w-full"
          >
            Save Notes
          </button>
        </section>

        <section className="admin-card p-5">
          <h2 className="mb-4 text-sm uppercase tracking-[0.1em] text-[var(--admin-text-muted)]">
            Activity Timeline
          </h2>
          {activities.length === 0 ? (
            <p className="text-sm text-[var(--admin-text-muted)]">No activity yet.</p>
          ) : (
            <ul className="space-y-4">
              {activities.map((a) => (
                <li key={a.id} className="border-l border-[var(--admin-border)] pl-4">
                  <p className="text-sm">{a.description}</p>
                  <p className="mt-1 text-[0.6875rem] text-[var(--admin-text-muted)]">
                    {formatDateTime(a.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
