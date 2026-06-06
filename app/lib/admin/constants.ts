import type { LeadFilter, LeadPriority, LeadStatus } from "./types";

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "qualified", label: "Qualified" },
  { value: "drafted", label: "Drafted" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "interested", label: "Interested" },
  { value: "call_booked", label: "Call Booked" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "not_suitable", label: "Not Suitable" },
];

export const LEAD_FILTERS: { value: LeadFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...LEAD_STATUSES,
  { value: "follow_up_due", label: "Follow-up Due" },
  { value: "high_priority", label: "High Priority" },
];

export const LEAD_PRIORITIES: { value: LeadPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const SOURCE_PLATFORMS = [
  "Airbnb",
  "Booking.com",
  "Agoda",
  "VRBO",
  "Facebook",
  "Instagram",
  "Referral",
  "Manual",
  "Other",
] as const;

export function statusLabel(status: LeadStatus): string {
  return LEAD_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function priorityLabel(priority: LeadPriority): string {
  return LEAD_PRIORITIES.find((p) => p.value === priority)?.label ?? priority;
}
