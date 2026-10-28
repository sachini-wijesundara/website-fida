export interface TrackEventData {
  action: "session_start" | "page_enter" | "ping" | "page_leave" | "section_view";
  sessionId: string;
  visitorId: string;
  viewId?: string | null;
  pagePath: string;
  pageTitle?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
  durationSeconds?: number;
  incrementalSeconds?: number;
  maxScrollPercent?: number;
  sections?: Array<{
    sectionId: string;
    timeVisibleSeconds: number;
  }>;
  timezone?: string;
}

const VISITOR_ID_KEY = "fida_visitor_id";
const SESSION_ID_KEY = "fida_session_id";
const SESSION_ACTIVE_KEY = "fida_session_last_active";
const LANDING_PAGE_KEY = "fida_landing_page";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function generateId(prefix: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${ts}_${rand}`;
}

/**
 * Checks whether user has consented to statistics/analytics cookies
 */
export function hasStatisticsConsent(): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (typeof (window as any).hasConsent === "function") {
      return Boolean((window as any).hasConsent("statistics"));
    }

    const raw = localStorage.getItem("fida_cookie_consent");
    if (raw) {
      const parsed = JSON.parse(raw);
      return Boolean(parsed.statistics);
    }
  } catch {}

  return false;
}

/**
 * Gets or creates a persistent visitor UUID (stored in localStorage)
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";

  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id || id.length < 5) {
      id = generateId("v");
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return generateId("v");
  }
}

/**
 * Gets or creates a session ID (stored in sessionStorage, expires after 30 mins inactivity)
 */
export function getOrCreateSessionId(currentPath: string): { sessionId: string; landingPage: string } {
  if (typeof window === "undefined") {
    return { sessionId: "", landingPage: currentPath };
  }

  const now = Date.now();
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  const lastActiveStr = sessionStorage.getItem(SESSION_ACTIVE_KEY);
  let landingPage = sessionStorage.getItem(LANDING_PAGE_KEY);

  const isExpired = lastActiveStr ? now - parseInt(lastActiveStr, 10) > SESSION_TIMEOUT_MS : true;

  if (!sessionId || isExpired) {
    sessionId = generateId("s");
    landingPage = currentPath;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    sessionStorage.setItem(LANDING_PAGE_KEY, landingPage);
  }

  sessionStorage.setItem(SESSION_ACTIVE_KEY, now.toString());

  return { sessionId, landingPage: landingPage || currentPath };
}

/**
 * Creates a unique page view ID
 */
export function createPageViewId(): string {
  return generateId("pv");
}

/**
 * Transmits tracking payload via navigator.sendBeacon (ideal for exit events) or fetch with keepalive
 */
export function sendTrackingEvent(data: TrackEventData, useBeacon = false): void {
  if (typeof window === "undefined") return;

  const payload = {
    ...data,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const json = JSON.stringify(payload);

  if (useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([json], { type: "text/plain" });
      const queued = navigator.sendBeacon("/api/track", blob);
      if (queued) return;
    } catch {
      // Fallback to fetch if sendBeacon fails
    }
  }

  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
      keepalive: true,
    }).catch(() => {
      // Ignore background network errors
    });
  } catch {}
}
