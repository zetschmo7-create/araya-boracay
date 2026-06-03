import { LegalPageShell } from "@/app/components/LegalPageShell";
import { getLegalPage } from "@/app/content/legal";
import { getServerLocale } from "@/app/lib/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const content = getLegalPage("cookies", locale);
  return {
    title: content.metaTitle,
    description: content.subtitle,
  };
}

export default function CookiesPage() {
  return <LegalPageShell page="cookies" />;
}
