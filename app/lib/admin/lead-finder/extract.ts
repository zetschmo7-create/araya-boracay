import type { ExtractedContact } from "./types";

const EMAIL_REGEX =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const PHONE_REGEX =
  /(?:\+63|0)[\s.-]?(?:9\d{2}|[2-9]\d{1,2})[\s.-]?\d{3}[\s.-]?\d{4}|\+?\d{10,15}/g;

const JUNK_EMAIL_PATTERNS = [
  /noreply/i,
  /no-reply/i,
  /example\.com$/i,
  /sentry\.io$/i,
  /wixpress\.com$/i,
  /wordpress\.com$/i,
  /schema\.org/i,
  /png$/i,
  /jpg$/i,
  /jpeg$/i,
  /gif$/i,
  /webp$/i,
];

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isValidEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return !JUNK_EMAIL_PATTERNS.some((p) => p.test(lower));
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s.-]/g, "").trim();
}

export function extractContactsFromHtml(
  html: string,
  maxEvidence = 800,
): ExtractedContact {
  const text = stripHtml(html);
  const mailtoMatches = [
    ...html.matchAll(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi),
  ].map((m) => m[1]);

  const bodyEmails = [...text.matchAll(EMAIL_REGEX)].map((m) => m[0]);
  const emails = [...new Set([...mailtoMatches, ...bodyEmails])]
    .map((e) => e.toLowerCase())
    .filter(isValidEmail)
    .slice(0, 5);

  const phones = [...new Set([...text.matchAll(PHONE_REGEX)].map((m) => m[0]))]
    .map(normalizePhone)
    .filter((p) => p.length >= 10 && p.length <= 15)
    .slice(0, 5);

  const whatsapp = phones.filter((p) =>
    p.startsWith("+639") || p.startsWith("09") || p.startsWith("639"),
  );

  const evidenceSnippets: string[] = [];
  for (const email of emails) {
    const idx = text.toLowerCase().indexOf(email);
    if (idx >= 0) {
      evidenceSnippets.push(text.slice(Math.max(0, idx - 40), idx + email.length + 40));
    }
  }

  return {
    emails,
    phones,
    whatsapp,
    evidence: evidenceSnippets.join("\n---\n").slice(0, maxEvidence),
  };
}

export function extractPageTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() ?? null;
}

export async function fetchPublicPage(url: string): Promise<{
  html: string;
  title: string | null;
} | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "ArayaLeadFinder/1.0 (+https://www.arayaboracay.com; compliant public contact research)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;

    const html = await res.text();
    if (html.length > 2_000_000) return null;

    return { html, title: extractPageTitle(html) };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
