export interface ClientInfo {
  ip: string;
  country: string | null;
  city: string | null;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  isBot: boolean;
}

const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /sogou/i,
  /exabot/i,
  /facebot/i,
  /ia_archiver/i,
  /lighthouse/i,
  /headless/i,
  /ptst/i,
  /ahrefsbot/i,
  /semrushbot/i,
  /bytespider/i,
  /petalbot/i,
];

export function detectClientInfo(request: Request, clientTimezone?: string | null): ClientInfo {
  const headers = request.headers;

  // 1. IP Detection
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "127.0.0.1";

  // 2. User Agent
  const userAgent = headers.get("user-agent") || "";

  // 3. Bot Check
  const isBot = BOT_PATTERNS.some((pattern) => pattern.test(userAgent));

  // 4. Device Type
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    deviceType = "tablet";
  } else if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      userAgent
    )
  ) {
    deviceType = "mobile";
  }

  // 5. Browser Detection
  let browser = "Other";
  if (/edg([ea]|ios)?\/([0-9.]+)/i.test(userAgent)) {
    browser = "Edge";
  } else if (/opr\/|opera/i.test(userAgent)) {
    browser = "Opera";
  } else if (/samsungbrowser\/([0-9.]+)/i.test(userAgent)) {
    browser = "Samsung Internet";
  } else if (/chrome|crios/i.test(userAgent) && !/edg|opr|opera/i.test(userAgent)) {
    browser = "Chrome";
  } else if (/safari/i.test(userAgent) && !/chrome|crios|android/i.test(userAgent)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(userAgent)) {
    browser = "Firefox";
  }

  // 6. OS Detection
  let os = "Other";
  if (/windows nt 10\.0/i.test(userAgent)) {
    os = "Windows 10/11";
  } else if (/windows nt/i.test(userAgent)) {
    os = "Windows";
  } else if (/mac os x/i.test(userAgent) && !/iphone|ipad|ipod/i.test(userAgent)) {
    os = "macOS";
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = "iOS";
  } else if (/android/i.test(userAgent)) {
    os = "Android";
  } else if (/cros/i.test(userAgent)) {
    os = "Chrome OS";
  } else if (/linux/i.test(userAgent)) {
    os = "Linux";
  }

  // 7. Geo Country & City Resolution
  const countryHeader =
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("x-country-code") ||
    headers.get("x-country") ||
    headers.get("cloudfront-viewer-country") ||
    null;

  const cityHeader =
    headers.get("cf-ipcity") ||
    headers.get("x-vercel-ip-city") ||
    headers.get("x-city") ||
    headers.get("cloudfront-viewer-city") ||
    null;

  let country = countryHeader ? getFullCountryName(countryHeader) : null;
  let city = cityHeader ? decodeURIComponent(cityHeader) : null;

  // Infer city from IANA timezone if not provided in CDN headers (e.g., "Asia/Colombo" -> "Colombo")
  if (!city && clientTimezone && clientTimezone.includes("/")) {
    const tzParts = clientTimezone.split("/");
    city = tzParts[tzParts.length - 1].replace(/_/g, " ");
  }

  // Infer country from client timezone
  if (!country && clientTimezone) {
    const code = inferCountryFromTimezone(clientTimezone);
    if (code) {
      country = getFullCountryName(code);
    }
  }

  // Fallback for localhost / intranet testing
  if (!country || country === "Local") {
    if (clientTimezone?.includes("Colombo")) {
      country = "Sri Lanka";
      city = city || "Colombo";
    } else if (clientTimezone) {
      const code = inferCountryFromTimezone(clientTimezone);
      country = code ? getFullCountryName(code) : "Sri Lanka";
    } else {
      country = "Sri Lanka";
      city = city || "Colombo";
    }
  }

  return {
    ip,
    country: country ? country.substring(0, 100) : "Sri Lanka",
    city: city ? city.substring(0, 100) : "Colombo",
    deviceType,
    browser,
    os,
    isBot,
  };
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function getFullCountryName(codeOrName: string | null): string | null {
  if (!codeOrName) return null;
  const clean = codeOrName.trim();
  if (clean.length === 2) {
    try {
      return regionNames.of(clean.toUpperCase()) || clean;
    } catch {
      return clean;
    }
  }
  return clean;
}

function inferCountryFromTimezone(tz: string): string | null {
  const map: Record<string, string> = {
    "Asia/Colombo": "LK",
    "Asia/Kolkata": "IN",
    "Asia/Calcutta": "IN",
    "Asia/Singapore": "SG",
    "Asia/Dubai": "AE",
    "Asia/Bangkok": "TH",
    "Asia/Tokyo": "JP",
    "Asia/Hong_Kong": "HK",
    "Asia/Kuala_Lumpur": "MY",
    "Asia/Dhaka": "BD",
    "Asia/Karachi": "PK",
    "Asia/Muscat": "OM",
    "Asia/Riyadh": "SA",
    "Asia/Qatar": "QA",
    "America/New_York": "US",
    "America/Chicago": "US",
    "America/Denver": "US",
    "America/Los_Angeles": "US",
    "America/Toronto": "CA",
    "America/Vancouver": "CA",
    "Europe/London": "GB",
    "Europe/Paris": "FR",
    "Europe/Berlin": "DE",
    "Europe/Rome": "IT",
    "Europe/Madrid": "ES",
    "Europe/Amsterdam": "NL",
    "Australia/Sydney": "AU",
    "Australia/Melbourne": "AU",
    "Australia/Perth": "AU",
    "Pacific/Auckland": "NZ",
  };
  return map[tz] || null;
}
