const WINDOW_MS = 60 * 60 * 1000;
const MAX_SEARCHES_PER_WINDOW = 8;

const buckets = new Map<string, number[]>();

export function checkSearchRateLimit(key: string): {
  allowed: boolean;
  retryAfterMs?: number;
} {
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter(
    (t) => now - t < WINDOW_MS,
  );

  if (timestamps.length >= MAX_SEARCHES_PER_WINDOW) {
    const oldest = timestamps[0];
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - oldest) };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true };
}
