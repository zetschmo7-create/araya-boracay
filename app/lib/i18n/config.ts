/** Active locales render in the language toggle; inactive locales are reserved for future launch. */

export const LOCALE_COOKIE = "araya-locale";

export const LOCALES = {
  en: {
    id: "en",
    label: "EN",
    htmlLang: "en",
    name: "English",
    active: true,
  },
  fil: {
    id: "fil",
    label: "FIL",
    htmlLang: "fil",
    name: "Filipino",
    active: true,
  },
  ko: {
    id: "ko",
    label: "KO",
    htmlLang: "ko",
    name: "Korean",
    active: false,
  },
  ja: {
    id: "ja",
    label: "JA",
    htmlLang: "ja",
    name: "Japanese",
    active: false,
  },
  zh: {
    id: "zh",
    label: "ZH",
    htmlLang: "zh",
    name: "Chinese",
    active: false,
  },
  de: {
    id: "de",
    label: "DE",
    htmlLang: "de",
    name: "German",
    active: false,
  },
} as const;

export type LocaleId = keyof typeof LOCALES;

export type ActiveLocale = "en" | "fil";

export const ACTIVE_LOCALE_IDS = (
  Object.keys(LOCALES) as LocaleId[]
).filter((id) => LOCALES[id].active) as ActiveLocale[];

export const DEFAULT_LOCALE: ActiveLocale = "en";

export function isActiveLocale(value: string | undefined): value is ActiveLocale {
  return ACTIVE_LOCALE_IDS.includes(value as ActiveLocale);
}

export function resolveLocale(value: string | undefined): ActiveLocale {
  return isActiveLocale(value) ? value : DEFAULT_LOCALE;
}
