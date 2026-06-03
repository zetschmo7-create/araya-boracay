export type LegalSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type LegalPageContent = {
  metaTitle: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
};

export type LegalPageId = "privacy" | "terms" | "cookies";

export type LegalBundle = Record<LegalPageId, LegalPageContent>;
