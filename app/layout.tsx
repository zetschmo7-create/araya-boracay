import { LocaleProvider } from "@/app/context/LocaleProvider";
import { getServerLocale } from "@/app/lib/i18n/server";
import { LOCALES } from "@/app/lib/i18n/config";
import type { Metadata } from "next";
import { Cormorant_Garamond, Libre_Franklin } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const libre = Libre_Franklin({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["300"],
});

export const metadata: Metadata = {
  title: "ARAYA | Luxury Villa & Condo Management — Boracay",
  description:
    "ARAYA manages luxury villas and condominiums in Boracay for discerning owners—villa stewardship, guest experience, and elevated hospitality operations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const htmlLang = LOCALES[locale].htmlLang;

  return (
    <html
      lang={htmlLang}
      className={`${cormorant.variable} ${libre.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-ivory">
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
