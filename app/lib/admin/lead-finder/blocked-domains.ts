/** Platforms that hide owner contact details — excluded from lead finder. */
const BLOCKED_DOMAINS = [
  "airbnb.com",
  "airbnb.com.ph",
  "booking.com",
  "agoda.com",
  "vrbo.com",
];

export function isBlockedUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return BLOCKED_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`),
    );
  } catch {
    return false;
  }
}

export function inferSourcePlatform(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    if (hostname.includes("facebook.com")) return "Facebook";
    if (hostname.includes("instagram.com")) return "Instagram";
    if (hostname.includes("lamudi")) return "Lamudi";
    if (hostname.includes("dotproperty")) return "DotProperty";
    if (hostname.includes("google.")) return "Google";
    if (hostname.includes("maps")) return "Google Maps";
    return hostname;
  } catch {
    return "Web";
  }
}
