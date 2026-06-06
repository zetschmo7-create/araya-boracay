"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SOURCE_PLATFORMS } from "@/app/lib/admin/constants";

export function NewLeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const screenshot = form.get("screenshot") as File | null;

    const body = new FormData();
    for (const [key, value] of form.entries()) {
      if (key === "screenshot") continue;
      if (typeof value === "string" && value.trim()) {
        body.append(key, value.trim());
      }
    }
    if (screenshot && screenshot.size > 0) {
      body.append("screenshot", screenshot);
    }

    const res = await fetch("/api/admin/leads", { method: "POST", body });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to create lead");
      setLoading(false);
      return;
    }

    router.push(`/admin/leads/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <section className="admin-card space-y-5 p-6">
        <h2 className="text-sm uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
          Quick Import
        </h2>
        <div>
          <label htmlFor="listing_url" className="admin-label">
            Listing URL
          </label>
          <input
            id="listing_url"
            name="listing_url"
            type="url"
            className="admin-input"
            placeholder="https://airbnb.com/rooms/..."
          />
        </div>
        <div>
          <label htmlFor="listing_text" className="admin-label">
            Copied Listing Text
          </label>
          <textarea
            id="listing_text"
            name="listing_text"
            rows={5}
            className="admin-input resize-y"
            placeholder="Paste listing title, description, amenities, reviews..."
          />
        </div>
        <div>
          <label htmlFor="screenshot" className="admin-label">
            Screenshot Upload
          </label>
          <input
            id="screenshot"
            name="screenshot"
            type="file"
            accept="image/*"
            className="admin-input file:mr-4 file:rounded file:border-0 file:bg-[var(--admin-surface-raised)] file:px-3 file:py-1 file:text-sm file:text-[var(--admin-accent)]"
          />
        </div>
      </section>

      <section className="admin-card space-y-5 p-6">
        <h2 className="text-sm uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
          Property Details
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="property_name" className="admin-label">
              Property Name *
            </label>
            <input
              id="property_name"
              name="property_name"
              required
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="owner_name" className="admin-label">
              Owner Name
            </label>
            <input id="owner_name" name="owner_name" className="admin-input" />
          </div>
          <div>
            <label htmlFor="property_type" className="admin-label">
              Property Type
            </label>
            <input
              id="property_type"
              name="property_type"
              className="admin-input"
              placeholder="Villa, Condo, Penthouse..."
            />
          </div>
          <div>
            <label htmlFor="location" className="admin-label">
              Location
            </label>
            <input
              id="location"
              name="location"
              className="admin-input"
              placeholder="Station 1, Boracay"
            />
          </div>
          <div>
            <label htmlFor="bedrooms" className="admin-label">
              Bedrooms
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min={0}
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="nightly_rate" className="admin-label">
              Nightly Rate (PHP)
            </label>
            <input
              id="nightly_rate"
              name="nightly_rate"
              type="number"
              min={0}
              step="0.01"
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="rating" className="admin-label">
              Rating
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              min={0}
              max={5}
              step="0.1"
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="review_count" className="admin-label">
              Review Count
            </label>
            <input
              id="review_count"
              name="review_count"
              type="number"
              min={0}
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="source_platform" className="admin-label">
              Source Platform
            </label>
            <select
              id="source_platform"
              name="source_platform"
              className="admin-input"
              defaultValue=""
            >
              <option value="">Select...</option>
              {SOURCE_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="admin-label">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="admin-input"
              defaultValue="medium"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="property_description" className="admin-label">
            Property Description
          </label>
          <textarea
            id="property_description"
            name="property_description"
            rows={3}
            className="admin-input resize-y"
          />
        </div>
      </section>

      <section className="admin-card space-y-5 p-6">
        <h2 className="text-sm uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
          Contact
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact_email" className="admin-label">
              Email
            </label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="contact_phone" className="admin-label">
              Phone
            </label>
            <input id="contact_phone" name="contact_phone" className="admin-input" />
          </div>
          <div>
            <label htmlFor="whatsapp" className="admin-label">
              WhatsApp
            </label>
            <input id="whatsapp" name="whatsapp" className="admin-input" />
          </div>
          <div>
            <label htmlFor="instagram" className="admin-label">
              Instagram
            </label>
            <input id="instagram" name="instagram" className="admin-input" />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="admin-label">
            Notes
          </label>
          <textarea id="notes" name="notes" rows={3} className="admin-input resize-y" />
        </div>
      </section>

      {error && (
        <p className="text-sm text-[var(--admin-danger)]">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="admin-btn admin-btn-primary"
        >
          {loading ? "Creating…" : "Create Lead"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="admin-btn admin-btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
