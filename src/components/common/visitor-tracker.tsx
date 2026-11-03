"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  hasStatisticsConsent,
  getOrCreateVisitorId,
  getOrCreateSessionId,
  createPageViewId,
  sendTrackingEvent,
  TrackEventData,
} from "@/lib/tracking/client-tracker";

interface PageViewState {
  viewId: string;
  sessionId: string;
  visitorId: string;
  landingPage: string;
  pagePath: string;
  pageTitle: string;
  referrer: string;
  dwellSeconds: number;
  lastPingSeconds: number;
  maxScrollPercent: number;
  totalScrollDistance: number;
  activeScrollTimeMs: number;
  lastScrollTop: number;
  lastScrollTimestamp: number;
  lastUserInteractionTimestamp: number;
  nextPingThreshold: number;
  sectionTimes: Record<string, number>;
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasConsent, setHasConsent] = useState<boolean>(false);

  const activeViewRef = useRef<PageViewState | null>(null);
  const visibleSectionsRef = useRef<Set<string>>(new Set());

  // 1. Consent State & Listener
  useEffect(() => {
    setHasConsent(hasStatisticsConsent());

    const onConsentChange = () => {
      setHasConsent(hasStatisticsConsent());
    };

    window.addEventListener("fida-cookie-consent-updated", onConsentChange);
    window.addEventListener("cookie-consent-updated", onConsentChange);

    return () => {
      window.removeEventListener("fida-cookie-consent-updated", onConsentChange);
      window.removeEventListener("cookie-consent-updated", onConsentChange);
    };
  }, []);

  // 2. Dispatch helper with Scroll Velocity & Pace
  const flushCurrentView = useCallback(
    (action: "ping" | "page_leave", useBeacon = false) => {
      const state = activeViewRef.current;
      if (!state) return;

      const incremental = Math.max(0, state.dwellSeconds - state.lastPingSeconds);
      state.lastPingSeconds = state.dwellSeconds;

      const sections = Object.entries(state.sectionTimes).map(([sectionId, timeVisibleSeconds]) => ({
        sectionId,
        timeVisibleSeconds,
      }));

      // Calculate scroll velocity (pixels per second) and reading engagement pace
      const activeScrollSeconds = Math.max(0.3, state.activeScrollTimeMs / 1000);
      const scrollSpeed = state.totalScrollDistance > 0
        ? Math.round(state.totalScrollDistance / activeScrollSeconds)
        : 0;

      let scrollPace: "reading" | "skimming" | "rapid" | "static" = "static";
      if (state.totalScrollDistance > 120) {
        if (scrollSpeed < 380) {
          scrollPace = "reading"; // Slow deliberate reading pace
        } else if (scrollSpeed < 1200) {
          scrollPace = "skimming"; // Moderate / scanning headings
        } else {
          scrollPace = "rapid"; // Quick flick / jumping to footer
        }
      }

      const payload: TrackEventData = {
        action,
        sessionId: state.sessionId,
        visitorId: state.visitorId,
        viewId: state.viewId,
        pagePath: state.pagePath,
        pageTitle: state.pageTitle,
        referrer: state.referrer,
        landingPage: state.landingPage,
        durationSeconds: state.dwellSeconds,
        incrementalSeconds: incremental,
        maxScrollPercent: state.maxScrollPercent,
        scrollSpeed,
        scrollPace,
        totalScrolledPx: Math.round(state.totalScrollDistance),
        sections: sections.length > 0 ? sections : undefined,
      };

      sendTrackingEvent(payload, useBeacon);
    },
    []
  );
// 3. Page View Initializer & Teardown
  useEffect(() => {
    // Exclude internal admin dashboard
    if (!pathname || pathname.startsWith("/admin") || !hasConsent) {
      return;
    }

    const fullPath = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    const visitorId = getOrCreateVisitorId();
    const { sessionId, landingPage } = getOrCreateSessionId(fullPath);
    const viewId = createPageViewId();

    const nowTs = typeof performance !== "undefined" ? performance.now() : Date.now();
    const initialState: PageViewState = {
      viewId,
      sessionId,
      visitorId,
      landingPage,
      pagePath: fullPath,
      pageTitle: typeof document !== "undefined" ? document.title : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      dwellSeconds: 0,
      lastPingSeconds: 0,
      maxScrollPercent: 0,
      totalScrollDistance: 0,
      activeScrollTimeMs: 0,
      lastScrollTop: typeof window !== "undefined" ? window.scrollY || document.documentElement.scrollTop : 0,
      lastScrollTimestamp: nowTs,
      lastUserInteractionTimestamp: Date.now(),
      nextPingThreshold: 30, // Initial heartbeat at 30s active dwell
      sectionTimes: {},
    };

    activeViewRef.current = initialState;
    visibleSectionsRef.current.clear();

    // User activity listener for idle suppression
    const onUserInteraction = () => {
      if (activeViewRef.current) {
        activeViewRef.current.lastUserInteractionTimestamp = Date.now();
      }
    };
    window.addEventListener("pointerdown", onUserInteraction, { passive: true });
    window.addEventListener("keydown", onUserInteraction, { passive: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true });

    // Initial page enter payload
    const enterPayload: TrackEventData = {
      action: "page_enter",
      sessionId,
      visitorId,
      viewId,
      pagePath: fullPath,
      pageTitle: initialState.pageTitle,
      referrer: initialState.referrer,
      landingPage,
      durationSeconds: 0,
      incrementalSeconds: 0,
      maxScrollPercent: 0,
      scrollSpeed: 0,
      scrollPace: "static",
      totalScrolledPx: 0,
    };
    sendTrackingEvent(enterPayload);

    // Initial Scroll calculation
    const calculateScroll = () => {
      const state = activeViewRef.current;
      if (!state) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const winHeight = window.innerHeight;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      const scrollable = docHeight - winHeight;
      const percent = scrollable > 0 ? Math.round((scrollTop / scrollable) * 100) : 100;
      state.maxScrollPercent = Math.max(state.maxScrollPercent, Math.min(100, Math.max(0, percent)));

      // Measure dynamic scroll velocity & distance
      const now = performance.now();
      const deltaY = Math.abs(scrollTop - state.lastScrollTop);
      const deltaT = now - state.lastScrollTimestamp;

      if (deltaY > 2) {
        state.totalScrollDistance += deltaY;
        if (deltaT > 0 && deltaT < 450) {
          state.activeScrollTimeMs += deltaT;
        } else {
          state.activeScrollTimeMs += 60;
        }
      }

      state.lastScrollTop = scrollTop;
      state.lastScrollTimestamp = now;
    };

    calculateScroll();

    let scrollRaf: number | null = null;
    const handleScroll = () => {
      if (activeViewRef.current) {
        activeViewRef.current.lastUserInteractionTimestamp = Date.now();
      }
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(() => {
        calculateScroll();
        scrollRaf = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Section Visibility Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const sectionId =
            el.getAttribute("data-track-section") ||
            el.id ||
            el.getAttribute("aria-label") ||
            el.className.split(" ")[0] ||
            "section";

          if (entry.isIntersecting) {
            visibleSectionsRef.current.add(sectionId);
          } else {
            visibleSectionsRef.current.delete(sectionId);
          }
        });
      },
      { threshold: 0.25 }
    );

    // Observe standard sections
    const trackableElements = document.querySelectorAll(
      "section, [data-track-section], [id^='section-'], main > div"
    );
    trackableElements.forEach((el) => observer.observe(el));

    // Adaptive Dwell Time Timer (counts seconds only when tab is active and visible)
    const interval = setInterval(() => {
      if (document.visibilityState !== "visible" || !activeViewRef.current) {
        return;
      }

      const state = activeViewRef.current;
      state.dwellSeconds += 1;

      // Accumulate visible section seconds
      visibleSectionsRef.current.forEach((secId) => {
        state.sectionTimes[secId] = (state.sectionTimes[secId] || 0) + 1;
      });

      // Adaptive Heartbeat with Idle Suppression (reduces DB & network load by 85%+)
      // Only fire scheduled pings if user is actively interacting (not AFK)
      if (state.dwellSeconds >= state.nextPingThreshold) {
        const isUserActive = Date.now() - state.lastUserInteractionTimestamp < 45000;
        if (isUserActive) {
          flushCurrentView("ping");

          // Staggered backoff: 30s -> 90s -> 210s -> every 180s thereafter
          if (state.dwellSeconds < 60) {
            state.nextPingThreshold = 90;
          } else if (state.dwellSeconds < 180) {
            state.nextPingThreshold = 210;
          } else {
            state.nextPingThreshold = state.dwellSeconds + 180;
          }
        }
      }
    }, 1000);

    // Unload / visibility handlers
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushCurrentView("ping", true);
      }
    };

    const handleBeforeUnload = () => {
      flushCurrentView("page_leave", true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Teardown when route changes or component unmounts (ensures exact page-to-page tracking)
    return () => {
      clearInterval(interval);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("keydown", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      observer.disconnect();

      flushCurrentView("page_leave", true);
      activeViewRef.current = null;
    };
  }, [pathname, searchParams, hasConsent, flushCurrentView]);

  return null;
}
