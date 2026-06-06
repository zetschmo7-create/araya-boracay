import type { FinderStatus, LeadFinderEntityType } from "./types";

export const FINDER_STATUS_LABELS: Record<FinderStatus, string> = {
  contact_found: "Contact Found",
  research_needed: "Research Needed",
  no_contact_found: "No Contact Found",
  imported: "Imported",
  duplicate: "Duplicate",
  irrelevant: "Irrelevant",
};

export const FINDER_STATUS_BADGE: Record<FinderStatus, string> = {
  contact_found: "admin-badge-won",
  research_needed: "admin-badge-new",
  no_contact_found: "admin-badge-high",
  imported: "admin-badge-won",
  duplicate: "admin-badge-lost",
  irrelevant: "admin-badge-lost",
};

export const ENTITY_TYPE_LABELS: Record<LeadFinderEntityType, string> = {
  villa_owner_operator: "Villa Owner/Operator",
  condo_owner_operator: "Condo Owner/Operator",
  real_estate_agent: "Real Estate Agent",
  property_manager: "Property Manager",
  hotel_resort: "Hotel/Resort",
  irrelevant: "Irrelevant",
};
