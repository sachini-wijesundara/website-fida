type CacheEntry<T> = {
  expiresAt: number;
  value: Promise<T>;
};

type CacheGlobal = typeof globalThis & {
  __fidaRequestCache?: Map<string, CacheEntry<unknown>>;
};

const cacheGlobal = globalThis as CacheGlobal;
const requestCache = cacheGlobal.__fidaRequestCache ?? new Map<string, CacheEntry<unknown>>();
cacheGlobal.__fidaRequestCache = requestCache;

/** Coalesces duplicate requests and briefly reuses remote DB results. */
export function cachedRequest<T>(key: string, load: () => Promise<T>, ttlMs = 30_000): Promise<T> {
  const now = Date.now();
  const cached = requestCache.get(key) as CacheEntry<T> | undefined;

  if (cached && cached.expiresAt > now) return cached.value;

  const value = load().catch((error) => {
    requestCache.delete(key);
    throw error;
  });

  requestCache.set(key, { value, expiresAt: now + ttlMs });
  return value;
}

export function invalidateRequestCache(key: string) {
  requestCache.delete(key);
}
