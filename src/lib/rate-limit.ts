/**
 * src/lib/rate-limit.ts
 *
 * In-memory sliding-window rate limiter for API routes against brute-force and DDoS attacks.
 * Works per IP address. Resets after the configured window expires.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // epoch ms when the window resets
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  /** Maximum allowed requests within the window */
  limit: number;
  /** Window size in milliseconds (default: 60 000 ms = 1 minute) */
  windowMs?: number;
}

export interface RateLimitResult {
  /** Whether the request is within the allowed limit */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Epoch ms when the window resets */
  resetAt: number;
}

/**
 * Extract client IP reliably from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
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

  // Prune expired entries periodically to prevent memory leaks
  if (store.size > 5000) {
    purgeExpiredEntries();
  }

  return { allowed, remaining, resetAt: entry.resetAt };
}

/**
 * Periodically purge expired entries to prevent unbounded memory growth.
 */
export function purgeExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) {
      store.delete(key);
    }
  }
}
