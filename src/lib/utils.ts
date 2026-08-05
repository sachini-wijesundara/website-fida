/**
 * src/lib/utils.ts
 *
 * Shared utility functions used across the codebase.
 * Keep functions pure, small, and well-documented.
 */

// ─── String Utilities ─────────────────────────────────────────────────────────

/**
 * Converts a string to a URL-safe slug.
 * Example: "Hello World!" → "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")          // spaces/underscores → hyphens
    .replace(/[^\w-]+/g, "")          // remove non-word chars
    .replace(/--+/g, "-")             // collapse double hyphens
    .replace(/^-+|-+$/g, "");         // strip leading/trailing hyphens
}

/**
 * Truncates a string to a maximum character length, appending "…" if cut.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + "…";
}

/**
 * Escapes HTML entities in a string to prevent XSS in raw HTML contexts.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/**
 * Formats a Date or ISO string to a human-readable form.
 * Example: "4 Aug 2026"
 */
export function formatDate(date: Date | string, locale = "en-GB"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Returns a relative time string such as "3 days ago" or "just now".
 */
export function relativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60)  return "just now";
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} min ago`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)} hr ago`;
  if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)} days ago`;
  return formatDate(d);
}

// ─── Numeric Utilities ────────────────────────────────────────────────────────

/**
 * Clamps a number between min and max boundaries.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a number with comma-separated thousands.
 * Example: 1500000 → "1,500,000"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

// ─── Array Utilities ──────────────────────────────────────────────────────────

/**
 * Returns a new array with duplicate values removed.
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Splits an array into chunks of a given size.
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ─── Object Utilities ─────────────────────────────────────────────────────────

/**
 * Strips `undefined` and `null` keys from a shallow object.
 */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<T>;
}
