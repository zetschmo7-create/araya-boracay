export type LeadStatus =
  | "new"
  | "qualified"
  | "drafted"
  | "contacted"
  | "replied"
  | "interested"
  | "call_booked"
  | "won"
  | "lost"
  | "not_suitable";

export type LeadPriority = "low" | "medium" | "high";

export type LeadFilter =
  | "all"
  | LeadStatus
  | "follow_up_due"
  | "high_priority";

export interface Lead {
  id: string;
  property_name: string | null;
  owner_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  source_platform: string | null;
  listing_url: string | null;
  listing_text: string | null;
  property_type: string | null;
  location: string | null;
  bedrooms: number | null;
  nightly_rate: number | null;
  rating: number | null;
  review_count: number | null;
  property_description: string | null;
  notes: string | null;
  presentation_quality: string | null;
  photography_quality: string | null;
  guest_review_issues: string | null;
  self_managed_likelihood: string | null;
  araya_fit_score: number | null;
  priority: LeadPriority;
  status: LeadStatus;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  screenshot_url: string | null;
  ai_summary: string | null;
  ai_fit_rationale: string | null;
  ai_strengths: string[];
  ai_weaknesses: string[];
  ai_presentation_weaknesses: string | null;
  ai_operational_weaknesses: string | null;
  ai_opportunity: string | null;
  ai_outreach_angle: string | null;
  ai_email_draft: string | null;
  ai_whatsapp_draft: string | null;
  ai_follow_up_1: string | null;
  ai_follow_up_2: string | null;
  ai_analysed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  description: string;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
}

export interface LeadAnalysisResult {
  summary: string;
  araya_fit_score: number;
  fit_rationale: string;
  strengths: string[];
  weaknesses: string[];
  presentation_weaknesses: string;
  operational_weaknesses: string;
  opportunity: string;
  outreach_angle: string;
  email_draft: string;
  whatsapp_draft: string;
  follow_up_1: string;
  follow_up_2: string;
}

export interface DashboardStats {
  total: number;
  new: number;
  high_priority: number;
  follow_ups_due: number;
  contacted: number;
  replied: number;
  won: number;
  lost: number;
}

export type LeadInsert = Partial<Omit<Lead, "id" | "created_at" | "updated_at">> & {
  property_name?: string;
};
