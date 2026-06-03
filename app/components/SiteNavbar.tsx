"use client";

import { BrandMark } from "@/app/components/BrandMark";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { useLocale } from "@/app/context/LocaleProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type SiteNavbarProps = {
  scrolled: boolean;
  onHero?: boolean;
  /** Legal and interior pages — simplified nav */
  variant?: "home" | "minimal";
};

export function SiteNavbar({
  scrolled,
  onHero = false,
  variant = "home",
}: SiteNavbarProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();
  const heroNav = onHero && !scrolled;
  const minimal = variant === "minimal";

  const homeLinks = [
    { label: t.nav.stewardship, href: "/#services" },
    { label: t.nav.arayaWay, href: "/#signature" },
    { label: t.nav.ownership, href: "/#ownership" },
    { label: t.nav.connect, href: "/#contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled || minimal
          ? "border-b border-espresso-soft/20 glass-warm shadow-[var(--shadow-lift)]"
          : heroNav
            ? "bg-transparent"
            : "glass-warm"
      }`}
    >
      <nav className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-6 md:px-10 lg:px-14">
        <Link href="/">
          <BrandMark showDescriptor={!minimal} light={heroNav} />
        </Link>

        {!minimal && (
          <ul className="hidden items-center gap-10 xl:gap-12 lg:flex">
            {homeLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-[10px] font-light tracking-[0.3em] uppercase transition-colors duration-700 ease-[cubic-bezier(0.22,0.03,0.26,1)] ${
                    heroNav
                      ? "text-coconut/75 hover:text-coconut"
                      : "text-espresso-muted hover:text-teak-deep"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="hidden items-center gap-8 lg:flex">
          <LanguageToggle light={heroNav} />
          {!minimal && (
            <a
              href="/#contact"
              className={`text-[10px] font-light tracking-[0.3em] uppercase transition-all duration-700 ease-[cubic-bezier(0.22,0.03,0.26,1)] ${
                heroNav
                  ? "border-b border-coconut/40 pb-1 text-coconut/90 hover:border-coconut"
                  : "border-b border-teak/50 pb-1 text-espresso-soft hover:border-teak-deep"
              }`}
            >
              {t.nav.privateInquiry}
            </a>
          )}
          {minimal && (
            <Link
              href="/"
              className="border-b border-teak/50 pb-1 text-[10px] font-light tracking-[0.3em] text-espresso-soft uppercase transition-colors duration-700 hover:border-teak-deep hover:text-teak-deep"
            >
              {t.legal.backHome}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-6 lg:hidden">
          <LanguageToggle light={heroNav && !minimal} />
          <button
            type="button"
            aria-label="Menu"
            className="flex flex-col gap-1.5"
            onClick={() => setOpen(!open)}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-px w-6 transition-all duration-500 ${
                  heroNav && !minimal ? "bg-coconut/80" : "bg-espresso/60"
                } ${
                  open && i === 0
                    ? "translate-y-[7px] rotate-45"
                    : open && i === 1
                      ? "opacity-0"
                      : open && i === 2
                        ? "-translate-y-[7px] -rotate-45"
                        : ""
                }`}
              />
            ))}
          </button>
        </div>
      </nav>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden border-t border-sand/30 glass-warm lg:hidden"
      >
        <ul className="flex flex-col gap-8 px-5 py-10">
          {(minimal
            ? [{ label: t.legal.backHome, href: "/" }]
            : homeLinks
          ).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-[11px] tracking-[0.28em] text-espresso-soft uppercase"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </header>
  );
}
