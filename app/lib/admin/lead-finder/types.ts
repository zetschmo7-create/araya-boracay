import type { LeadPriority } from "../types";

export type LeadFinderEntityType =
  | "villa_owner_operator"
  | "condo_owner_operator"
  | "real_estate_agent"
  | "property_manager"
  | "hotel_resort"
  | "irrelevant";

export interface WebSearchHit {
  title: string;
  url: string;
  snippet?: string;
  source: string;
}

export interface ExtractedContact {
  emails: string[];
  phones: string[];
  whatsapp: string[];
  evidence: string;
}

export interface LeadFinderClassification {
  entity_type: LeadFinderEntityType;
  araya_fit_score: number;
  priority: LeadPriority;
  fit_rationale: string;
  outreach_angle: string;
  page_summary: string;
  property_name: string | null;
  source_platform: string;
}

export interface LeadFinderResultRow {
  id: string;
  run_id: string;
  page_title: string | null;
  source_url: string;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp: string | null;
  property_name: string | null;
  source_platform: string | null;
  page_summary: string | null;
  extraction_evidence: string | null;
  entity_type: LeadFinderEntityType | null;
  araya_fit_score: number | null;
  priority: LeadPriority | null;
  fit_rationale: string | null;
  outreach_angle: string | null;
  ai_email_draft: string | null;
  imported: boolean;
  imported_lead_id: string | null;
  duplicate_of_lead_id: string | null;
  created_at: string;
}

export interface LeadFinderRunRow {
  id: string;
  search_query: string;
  provider: string | null;
  result_count: number;
  created_at: string;
}

export const DEFAULT_SEARCH_QUERIES = [
  "Boracay villa rental owner email",
  "Boracay condo rental contact",
  "Boracay luxury villa for rent contact",
  "Boracay property owner contact",
  "Boracay villa website email",
  "Boracay condo for rent owner",
  "Boracay property management",
  "Boracay vacation rental contact",
  "Boracay real estate agent villa condo",
  "Lamudi Boracay villa contact",
] as const;
