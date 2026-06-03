"use client";

import { ACTIVE_LOCALE_IDS, LOCALES } from "@/app/lib/i18n/config";
import { useLocale } from "@/app/context/LocaleProvider";

type LanguageToggleProps = {
  /** Light typography on dark hero */
  light?: boolean;
};

export function LanguageToggle({ light = false }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale();

  const idle = light ? "text-coconut/45" : "text-espresso-whisper";
  const hover = light ? "hover:text-coconut/85" : "hover:text-teak-deep";
  const active = light ? "text-coconut" : "text-espresso";
  const divider = light ? "text-coconut/25" : "text-sand-warm/80";

  return (
    <div
      className="flex items-center gap-2.5 text-[10px] font-light tracking-[0.32em] uppercase"
      role="group"
      aria-label="Language"
    >
      {ACTIVE_LOCALE_IDS.map((id, index) => (
        <span key={id} className="flex items-center gap-2.5">
          {index > 0 && (
            <span className={divider} aria-hidden>
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => setLocale(id)}
            className={`transition-colors duration-700 ease-[cubic-bezier(0.22,0.03,0.26,1)] ${
              locale === id ? active : `${idle} ${hover}`
            }`}
            aria-pressed={locale === id}
            aria-label={LOCALES[id].name}
          >
            {LOCALES[id].label}
          </button>
        </span>
      ))}
    </div>
  );
}
