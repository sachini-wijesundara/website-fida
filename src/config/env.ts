/**
 * src/config/env.ts
 *
 * Centralized, typed access to all environment variables used across the project.
 * Variables are read once at startup. Missing required values throw early so the
 * server never starts in a misconfigured state.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: "${name}". ` +
      `Add it to .env.local or the hosting environment.`
    );
  }
  return value;
}

function optionalEnv(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

// ─── Database ────────────────────────────────────────────────────────────────
export const DB_SERVER   = requireEnv("DB_SERVER");
export const DB_USER     = requireEnv("DB_USER");
export const DB_PASSWORD = requireEnv("DB_PASSWORD");
export const DB_NAME     = requireEnv("DB_NAME");
export const DB_PORT     = parseInt(optionalEnv("DB_PORT", "1433"), 10);

// ─── SMTP / Email ─────────────────────────────────────────────────────────────
export const SMTP_HOST    = optionalEnv("SMTP_HOST", "smtp.gmail.com");
export const SMTP_PORT    = parseInt(optionalEnv("SMTP_PORT", "587"), 10);
export const EMAIL_USER   = optionalEnv("EMAIL_USER");
export const EMAIL_PASS   = optionalEnv("EMAIL_PASS");
export const EMAIL_TO     = optionalEnv("EMAIL_TO", "info@fidaglobal.com");

// ─── App ──────────────────────────────────────────────────────────────────────
export const NODE_ENV          = optionalEnv("NODE_ENV", "development");
export const USE_SECURE_COOKIES = optionalEnv("USE_SECURE_COOKIES", "false") === "true";
export const IS_PRODUCTION     = NODE_ENV === "production";
