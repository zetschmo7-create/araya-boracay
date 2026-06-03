"use client";

import { UI_COPY, type UiCopy } from "@/app/lib/i18n/ui";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  resolveLocale,
  type ActiveLocale,
} from "@/app/lib/i18n/config";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LocaleContextValue = {
  locale: ActiveLocale;
  setLocale: (locale: ActiveLocale) => void;
  t: UiCopy;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: ActiveLocale;
}) {
  const [locale, setLocaleState] = useState<ActiveLocale>(
    initialLocale ?? DEFAULT_LOCALE,
  );

  const setLocale = useCallback((next: ActiveLocale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang =
      next === "fil" ? "fil" : "en";
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: UI_COPY[locale],
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useLocaleOptional(): LocaleContextValue | null {
  return useContext(LocaleContext);
}

export function hydrateLocaleFromCookie(): ActiveLocale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`));
  if (!match) return DEFAULT_LOCALE;
  return resolveLocale(match.split("=")[1]);
}
