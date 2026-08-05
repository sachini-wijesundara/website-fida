/**
 * src/lib/rate-limit.ts
 *
 * In-memory sliding-window rate limiter for API routes.
 * Works per IP address. Resets after the configured window expires.
 *
 * Usage in an API route:
 *   const ip = request.headers.get("x-forwarded-for") ?? "unknown";
 *   const { allowed, remaining } = rateLimit(ip, { limit: 5, windowMs: 60_000 });
 *   if (!allowed) return NextResponse.json({ message: "Too many requests" }, { status: 429 });
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // epoch ms when the window resets
}

/** In-memory store — resets if the server restarts (acceptable for single-instance dev) */
const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** Maximum allowed requests within the window */
  limit: number;
  /** Window size in milliseconds (default: 60 000 ms = 1 minute) */
  windowMs?: number;
}

interface RateLimitResult {
  /** Whether the request is within the allowed limit */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Epoch ms when the window resets */
  resetAt: number;
}

/**
 * Check and increment rate-limit counter for a given key (usually an IP).
 */
export function rateLimit(
  key: string,
  { limit, windowMs = 60_000 }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();

  let entry = store.get(key);

  // Create or reset expired window
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count++;

  const allowed = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);

  return { allowed, remaining, resetAt: entry.resetAt };
}

/**
 * Periodically purge expired entries to prevent unbounded memory growth.
 * Call this once at startup or use a cron-style cleanup.
 */
export function purgeExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) {
      store.delete(key);
    }
  }
}
