"use client";

import { BrandMark } from "@/app/components/BrandMark";
import { SectionReveal } from "@/app/components/SectionReveal";
import { useLocale } from "@/app/context/LocaleProvider";
import Link from "next/link";

const COPYRIGHT_YEAR = 2026;

export function SiteFooter() {
  const { t } = useLocale();
  const rights = t.footer.rights.replace("{year}", String(COPYRIGHT_YEAR));

  return (
    <footer className="border-t border-espresso-soft/30 bg-espresso py-16 md:py-20">
      <SectionReveal className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <BrandMark showDescriptor light />

          <nav
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-end"
            aria-label="Legal"
          >
            <Link
              href="/privacy"
              className="text-[10px] font-light tracking-[0.28em] text-coconut/45 uppercase transition-colors duration-700 hover:text-coconut/80"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href="/terms"
              className="text-[10px] font-light tracking-[0.28em] text-coconut/45 uppercase transition-colors duration-700 hover:text-coconut/80"
            >
              {t.footer.terms}
            </Link>
            <Link
              href="/cookies"
              className="text-[10px] font-light tracking-[0.28em] text-coconut/45 uppercase transition-colors duration-700 hover:text-coconut/80"
            >
              {t.footer.cookies}
            </Link>
          </nav>
        </div>

        <p className="mx-auto mt-12 max-w-md text-center text-[10px] leading-[2] font-light tracking-[0.16em] text-coconut/50 md:mt-14 md:text-left">
          {rights}
        </p>
      </SectionReveal>
    </footer>
  );
}
