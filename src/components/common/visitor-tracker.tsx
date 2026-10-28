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

  // 2. Dispatch helper
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
      sectionTimes: {},
    };

    activeViewRef.current = initialState;
    visibleSectionsRef.current.clear();

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
    };
    sendTrackingEvent(enterPayload);

    // Initial Scroll calculation
    const calculateScroll = () => {
      if (!activeViewRef.current) return;
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
      activeViewRef.current.maxScrollPercent = Math.max(
        activeViewRef.current.maxScrollPercent,
        Math.min(100, Math.max(0, percent))
      );
    };

    calculateScroll();

    let scrollRaf: number | null = null;
    const handleScroll = () => {
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

    // Active Dwell Time Timer (counts seconds only when tab is active)
    const interval = setInterval(() => {
      if (document.visibilityState !== "visible" || !activeViewRef.current) {
        return;
      }

      activeViewRef.current.dwellSeconds += 1;

      // Accumulate visible section seconds
      visibleSectionsRef.current.forEach((secId) => {
        if (!activeViewRef.current) return;
        activeViewRef.current.sectionTimes[secId] = (activeViewRef.current.sectionTimes[secId] || 0) + 1;
      });

      // Send periodic heartbeat every 15 active seconds
      if (activeViewRef.current.dwellSeconds - activeViewRef.current.lastPingSeconds >= 15) {
        flushCurrentView("ping");
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

    // Teardown when route changes or component unmounts
    return () => {
      clearInterval(interval);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      observer.disconnect();

      flushCurrentView("page_leave", true);
      activeViewRef.current = null;
    };
  }, [pathname, searchParams, hasConsent, flushCurrentView]);

  return null;
}
