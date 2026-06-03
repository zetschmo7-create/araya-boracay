/**
 * ARAYA Media Command Centre
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all local imagery and hero video on the site.
 * Drop generated assets at the paths below; components probe files at runtime
 * and show luxury gradient fallbacks when a file is not yet present.
 *
 * HERO (exclusive — never reuse elsewhere):
 *   /public/images/hero/araya-hero.jpg
 *   /public/videos/araya-hero.mp4
 *
 * SECTIONS (homepage imagery):
 *   /public/images/sections/residence-care.jpg
 *   /public/images/sections/guest-experience.jpg
 *   /public/images/sections/hospitality-operations.jpg
 *   /public/images/sections/owner-intelligence.jpg
 *   /public/images/sections/sanctuary-living.jpg
 *   /public/images/sections/private-inquiry.jpg
 *
 * OCEAN:
 *   /public/images/ocean/ocean-aerial.jpg
 *
 * SUNSET:
 *   /public/images/sunset/signature-moment.jpg
 *   /public/images/sunset/terrace-evening.jpg
 *   /public/images/sunset/sunset-cta.jpg
 *
 * AI prompt briefs: /ARAYA_MEDIA_PROMPTS.md
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type MediaCategory =
  | "hero"
  | "section"
  | "interior"
  | "lifestyle"
  | "ocean"
  | "sunset"
  | "video";

export type MediaAsset = {
  id: string;
  /** Public URL (file under /public) */
  path: string;
  alt: string;
  gradient: string;
  category: MediaCategory;
  suggestedUsage: string;
};

/** Homepage hero still — used ONLY by HeroBackground */
export const HERO_IMAGE: MediaAsset = {
  id: "hero-image",
  path: "/images/hero/araya-hero.jpg",
  alt: "Luxury Boracay villa at golden hour — infinity pool, turquoise water, quiet tropical sanctuary",
  gradient:
    "linear-gradient(165deg, #3d6b6a 0%, #5a8a88 22%, #8eb5b3 42%, #d4a574 62%, #2a241f 100%)",
  category: "hero",
  suggestedUsage:
    "Full-viewport homepage hero still. Exclusive asset — do not reference this path in any other section.",
};

export const HERO_VIDEO: MediaAsset = {
  id: "hero-video",
  path: "/videos/araya-hero.mp4",
  alt: "Cinematic aerial approach to a private Boracay villa at golden hour",
  gradient: HERO_IMAGE.gradient,
  category: "video",
  suggestedUsage:
    "Looping muted hero background. Poster: /images/hero/araya-hero.jpg. Enable via HERO_MEDIA_MODE and HERO_AUTO_VIDEO_WHEN_AVAILABLE in HeroBackground.tsx.",
};

/** "video" = cinematic MP4 hero (primary). "image" = still only. */
export type HeroMediaMode = "image" | "video";

/** Homepage hero uses /public/videos/araya-hero.mp4 */
export const HERO_MEDIA_MODE: HeroMediaMode = "video";

/** @deprecated Video hero is always attempted when HERO_MEDIA_MODE is "video" */
export const HERO_AUTO_VIDEO_WHEN_AVAILABLE = true;

export const HERO_VIDEO_SRC = HERO_VIDEO.path;

/** Keys referenced by SanctuaryImage and page sections */
export type ArayaMediaKey =
  | "signature"
  | "serviceResidence"
  | "serviceGuest"
  | "serviceOperations"
  | "serviceYield"
  | "lifestyleSanctuary"
  | "ctaSanctuary"
  | "oceanAerial"
  | "ownershipStewardship";

export const SECTION_MEDIA: Record<ArayaMediaKey, MediaAsset> = {
  signature: {
    id: "signature-moment",
    path: "/images/sunset/signature-moment.jpg",
    alt: "Golden hour Boracay coastline — the ARAYA arrival moment",
    gradient:
      "linear-gradient(180deg, #f2dcc0 0%, #c9956a 30%, #5a8a88 55%, #1f1b17 100%)",
    category: "sunset",
    suggestedUsage:
      "Full-bleed #signature editorial moment — quote overlay, cinematic parallax.",
  },
  serviceResidence: {
    id: "residence-care",
    path: "/images/sections/residence-care.jpg",
    alt: "Interior sanctuary — warm ivory linen, limestone, teak, soft morning light",
    gradient:
      "linear-gradient(150deg, #f5efe6 0%, #e8dfd3 35%, #b8a48a 65%, #3a332c 100%)",
    category: "section",
    suggestedUsage:
      "Stewardship card — Private Residence Care. Editorial interior, Aman-calibre calm.",
  },
  serviceGuest: {
    id: "guest-experience",
    path: "/images/sections/guest-experience.jpg",
    alt: "Curated guest experience — pool terrace, teak, linen, tropical dusk calm",
    gradient:
      "linear-gradient(155deg, #5a8a88 0%, #9a7d5c 38%, #2a241f 78%)",
    category: "section",
    suggestedUsage:
      "Stewardship card — Guest Experience Design. Pool terrace, not crowded beach tourism.",
  },
  serviceOperations: {
    id: "hospitality-operations",
    path: "/images/sections/hospitality-operations.jpg",
    alt: "Open-air tropical pavilion with calm pool and discreet luxury operations",
    gradient:
      "linear-gradient(145deg, #8eb5b3 0%, #d4c4b0 40%, #5c4832 75%)",
    category: "section",
    suggestedUsage:
      "Stewardship card — Luxury Hospitality Operations. Pavilion / service calm.",
  },
  serviceYield: {
    id: "owner-intelligence",
    path: "/images/sections/owner-intelligence.jpg",
    alt: "Owner terrace at evening golden hour — intelligence, yield, refined restraint",
    gradient:
      "linear-gradient(160deg, #e4c4a0 0%, #8eb5b3 40%, #1f1b17 85%)",
    category: "section",
    suggestedUsage:
      "Stewardship card — Owner Intelligence & Yield. Evening terrace, refined restraint.",
  },
  lifestyleSanctuary: {
    id: "sanctuary-living",
    path: "/images/sections/sanctuary-living.jpg",
    alt: "Sanctuary living — luxury villa, pool, tropical stillness, white sand air",
    gradient:
      "linear-gradient(145deg, #c9b8a2 0%, #6eb8b4 35%, #2a241f 80%)",
    category: "section",
    suggestedUsage:
      "Island Living grid — villa sanctuary half. Guest experience, not rental listing energy.",
  },
  ctaSanctuary: {
    id: "private-inquiry",
    path: "/images/sections/private-inquiry.jpg",
    alt: "Private inquiry — warm sanctuary interior inviting confidential consultation",
    gradient:
      "linear-gradient(150deg, #ebe3d6 0%, #9a7d5c 50%, #1f1b17 100%)",
    category: "section",
    suggestedUsage:
      "Final CTA #contact — left panel image. Warm, intimate, stewardship invitation.",
  },
  oceanAerial: {
    id: "ocean-aerial",
    path: "/images/ocean/ocean-aerial.jpg",
    alt: "Aerial turquoise shallows and white sand — Boracay from sanctuary altitude",
    gradient:
      "linear-gradient(160deg, #8eb5b3 0%, #5a8a88 45%, #3d6b6a 70%, #1f1b17 100%)",
    category: "ocean",
    suggestedUsage:
      "Reserved for future ocean editorial (manifest only — no filler section on homepage).",
  },
  ownershipStewardship: {
    id: "ownership-stewardship",
    path: "/images/lifestyle/ownership-stewardship.jpg",
    alt: "Private residence stewardship — owner peace, villa held in sanctuary stillness",
    gradient:
      "linear-gradient(155deg, #f2ebe3 0%, #c4a882 40%, #5a8a88 65%, #2a241f 100%)",
    category: "lifestyle",
    suggestedUsage:
      "Optional ownership editorial — manifest ready for future section accent (not on homepage layout today).",
  },
};

/** Grouped catalogues for asset production workflows */
export const INTERIOR_ASSETS: MediaAsset[] = [
  SECTION_MEDIA.serviceResidence,
  {
    id: "contact-sanctuary",
    path: "/images/interiors/contact-sanctuary.jpg",
    alt: "Warm sanctuary interior — limestone and linen for private consultation",
    gradient:
      "linear-gradient(150deg, #ebe3d6 0%, #9a7d5c 50%, #1f1b17 100%)",
    category: "interior",
    suggestedUsage:
      "Alternate CTA / consultation interior if sunset-cta is not used.",
  },
];

export const LIFESTYLE_ASSETS: MediaAsset[] = [
  SECTION_MEDIA.serviceGuest,
  SECTION_MEDIA.serviceOperations,
  SECTION_MEDIA.lifestyleSanctuary,
  SECTION_MEDIA.ownershipStewardship,
];

export const OCEAN_ASSETS: MediaAsset[] = [SECTION_MEDIA.oceanAerial];

export const SUNSET_ASSETS: MediaAsset[] = [
  SECTION_MEDIA.signature,
  SECTION_MEDIA.serviceYield,
  SECTION_MEDIA.ctaSanctuary,
];

export const ARAYA_MEDIA_MANIFEST = {
  hero: HERO_IMAGE,
  heroVideo: HERO_VIDEO,
  interiors: INTERIOR_ASSETS,
  lifestyle: LIFESTYLE_ASSETS,
  ocean: OCEAN_ASSETS,
  sunset: SUNSET_ASSETS,
  sections: SECTION_MEDIA,
} as const;

/** @deprecated Use ArayaMediaKey — kept for gradual migration */
export type ArayaImageKey = ArayaMediaKey;

/** @deprecated Use SECTION_MEDIA — kept for gradual migration */
export const ARAYA_IMAGES = SECTION_MEDIA;

/** @deprecated Use HERO_IMAGE — kept for gradual migration */
export const HERO_ASSET = {
  path: HERO_IMAGE.path,
  alt: HERO_IMAGE.alt,
  gradient: HERO_IMAGE.gradient,
} as const;
