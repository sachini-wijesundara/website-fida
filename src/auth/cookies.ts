export const COOKIE_NAME = "auth_session";

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  process.env.DB_PASSWORD ||
  "fida-global-secure-session-key-2026-antigravity";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: "/",
};

// ── Pure Edge-Safe HMAC-SHA256 (Runs in Edge Runtime & Node without node:crypto) ──
function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function sha256Bytes(ascii: string): string {
  const maxWord = Math.pow(2, 32);
  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;
  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = candidate * 2; i < 312; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  let formatted = ascii + "\x80";
  while (formatted.length % 64 !== 56) formatted += "\x00";

  for (let i = 0; i < formatted.length; i++) {
    const j = formatted.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength | 0;

  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = [...hash];

    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = hash[7] + s1h + ch + k[i] + w[i];
      const s0h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = s0h + maj;

      hash = [(temp1 + temp2) | 0, ...hash.slice(0, 7)];
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  const bytes: number[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j >= 0; j--) {
      bytes.push((hash[i] >> (8 * j)) & 255);
    }
  }
  return String.fromCharCode.apply(null, bytes);
}

function edgeHmacSha256(key: string, message: string): string {
  const blockSize = 64;
  let normalizedKey = key;
  if (normalizedKey.length > blockSize) {
    normalizedKey = sha256Bytes(normalizedKey);
  }
  while (normalizedKey.length < blockSize) {
    normalizedKey += "\x00";
  }

  let oKeyPad = "";
  let iKeyPad = "";
  for (let i = 0; i < blockSize; i++) {
    const code = normalizedKey.charCodeAt(i);
    oKeyPad += String.fromCharCode(code ^ 0x5c);
    iKeyPad += String.fromCharCode(code ^ 0x36);
  }

  const innerHash = sha256Bytes(iKeyPad + message);
  const outerHash = sha256Bytes(oKeyPad + innerHash);

  let hex = "";
  for (let i = 0; i < outerHash.length; i++) {
    const b = outerHash.charCodeAt(i);
    hex += (b < 16 ? "0" : "") + b.toString(16);
  }
  return hex;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str).toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64url").toString("utf8");
  }
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return atob(base64);
}

/**
 * Creates a cryptographically signed session token: {payload}.{signature}
 */
export function createSignedToken(userId: string | number = "admin"): string {
  const timestamp = Date.now();
  const payload = base64UrlEncode(JSON.stringify({ u: userId, t: timestamp }));
  const signature = edgeHmacSha256(SESSION_SECRET, payload);
  return `${payload}.${signature}`;
}

/**
 * Verifies a cryptographically signed session token against tampering and expiration
 */
export function verifySignedToken(token: string): { isValid: boolean; userId?: string } {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { isValid: false };
  }

  const parts = token.split(".");
  if (parts.length !== 2) return { isValid: false };
  const [payload, signature] = parts;

  const expectedSignature = edgeHmacSha256(SESSION_SECRET, payload);

  if (!constantTimeEqual(signature, expectedSignature)) {
    return { isValid: false };
  }

  try {
    const data = JSON.parse(base64UrlDecode(payload));
    const age = Date.now() - (data.t || 0);

    // Expire token after 24 hours (with 1-minute clock drift margin)
    if (age > 24 * 60 * 60 * 1000 || age < -60000) {
      return { isValid: false };
    }

    return { isValid: true, userId: String(data.u) };
  } catch {
    return { isValid: false };
  }
}

export function setSessionCookie(cookies: any, userId?: string | number) {
  const token = createSignedToken(userId || "admin");
  cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export function clearSessionCookie(cookies: any) {
  cookies.set(COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });
}
