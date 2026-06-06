import type { FinderStatus, LeadFinderEntityType } from "./types";

export function resolveFinderStatus(params: {
  hasContact: boolean;
  entityType: LeadFinderEntityType;
  worthManualResearch?: boolean;
  duplicateId: string | null;
  imported?: boolean;
  arayaFitScore: number;
}): FinderStatus {
  if (params.imported) return "imported";
  if (params.duplicateId) return "duplicate";
  if (params.entityType === "irrelevant") return "irrelevant";
  if (params.hasContact) return "contact_found";
  if (params.worthManualResearch || params.arayaFitScore >= 45) {
    return "research_needed";
  }
  return "no_contact_found";
}

export function hasPublicContact(row: {
  contact_email?: string | null;
  contact_phone?: string | null;
  whatsapp?: string | null;
}): boolean {
  return !!(row.contact_email || row.contact_phone || row.whatsapp);
}
