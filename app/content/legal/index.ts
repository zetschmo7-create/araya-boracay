import { legalEn } from "@/app/content/legal/en";
import { legalFil } from "@/app/content/legal/fil";
import type { ActiveLocale } from "@/app/lib/i18n/config";
import type { LegalBundle, LegalPageId } from "@/app/content/legal/types";

const bundles: Record<ActiveLocale, LegalBundle> = {
  en: legalEn,
  fil: legalFil,
};

export function getLegalPage(
  page: LegalPageId,
  locale: ActiveLocale,
) {
  return bundles[locale][page];
}

export function getLegalBundle(locale: ActiveLocale): LegalBundle {
  return bundles[locale];
}
