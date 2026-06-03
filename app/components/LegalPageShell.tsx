"use client";

import { LegalDocument } from "@/app/components/LegalDocument";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteNavbar } from "@/app/components/SiteNavbar";
import { getLegalPage } from "@/app/content/legal";
import type { LegalPageId } from "@/app/content/legal/types";
import { useLocale } from "@/app/context/LocaleProvider";

type LegalPageShellProps = {
  page: LegalPageId;
};

export function LegalPageShell({ page }: LegalPageShellProps) {
  const { locale } = useLocale();
  const content = getLegalPage(page, locale);

  return (
    <main className="min-h-screen bg-ivory-warm font-sans text-espresso">
      <SiteNavbar scrolled variant="minimal" />
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-32 md:px-10 md:pb-28 md:pt-36 lg:px-14">
        <LegalDocument content={content} />
      </div>
      <SiteFooter />
    </main>
  );
}
