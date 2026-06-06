export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured. Add it to .env.local or Vercel environment variables.",
    );
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. Add it to .env.local or Vercel environment variables.",
    );
  }
  return key;
}

export function formatAuthError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    const lower = message.toLowerCase();

    if (
      lower.includes("failed to fetch") ||
      lower.includes("network") ||
      lower.includes("fetch failed")
    ) {
      return "Unable to reach the authentication server. Verify Supabase environment variables are set in production and your Supabase project is active.";
    }

    if (lower.includes("not configured")) {
      return message;
    }

    if (lower.includes("invalid login credentials")) {
      return "Invalid email or password. Please try again.";
    }

    return message;
  }

  return "An unexpected error occurred. Please try again.";
}
