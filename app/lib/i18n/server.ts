import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  resolveLocale,
  type ActiveLocale,
} from "@/app/lib/i18n/config";

export async function getServerLocale(): Promise<ActiveLocale> {
  const store = await cookies();
  return resolveLocale(store.get(LOCALE_COOKIE)?.value);
}

export function localeCookieValue(locale: ActiveLocale): string {
  return `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}
