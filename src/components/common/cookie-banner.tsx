"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ChevronUp, X, Check, ShieldCheck } from "lucide-react";

export interface CookieConsent {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing?: boolean;
  timestamp: number;
}

const STORAGE_KEY = "fida_cookie_consent";

const ESSENTIAL_COOKIE_NAMES = new Set([
  STORAGE_KEY,
  "auth_session",
  "admin_session",
  "admin_token",
  "__Host-auth_session",
  "__Secure-auth_session",
]);

export function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}

  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${STORAGE_KEY}=([^;]+)`));
    if (match && match[1]) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
  } catch {}

  return null;
}

function clearNonEssentialCookies(prefs: { preferences: boolean; statistics: boolean }) {
  if (typeof document === "undefined") return;
  try {
    const rawCookies = document.cookie.split(";");
    const host = window.location.hostname;
    const baseHost = host.replace(/^www\./, "");
    const domains = [
      "",
      host,
      `.${host}`,
      baseHost,
      `.${baseHost}`,
    ];

    for (const raw of rawCookies) {
      const eqIdx = raw.indexOf("=");
      const name = (eqIdx > -1 ? raw.substring(0, eqIdx) : raw).trim();
      if (!name || ESSENTIAL_COOKIE_NAMES.has(name)) continue;

      const isAnalytics = /^_g(a|id|at|cl|_)|_pk_|_hj|amp_/i.test(name);
      const isMarketing = /^_fb|fr|_fbp|_pin|test_cookie|IDE/i.test(name);
      const isPreference = /^pref|theme|lang|density/i.test(name);

      const shouldRemove =
        (!prefs.statistics && isAnalytics) ||
        isMarketing || // Marketing cookies are never permitted
        (!prefs.preferences && isPreference) ||
        (!prefs.statistics && !prefs.preferences);

      if (shouldRemove) {
        for (const d of domains) {
          const domainAttr = d ? `; domain=${d}` : "";
          document.cookie = `${name}=; path=/${domainAttr}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
          document.cookie = `${name}=; path=${domainAttr}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
        }
      }
    }
  } catch (err) {
    console.warn("Could not clear non-essential cookies:", err);
  }
}

function persistConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;
  const json = JSON.stringify(consent);

  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch {}

  try {
    // Stored as a strictly necessary 1-year cookie so the user preference persists
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(json)}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}

  // Purge any cookies that the user did not consent to
  clearNonEssentialCookies({
    preferences: consent.preferences,
    statistics: consent.statistics,
  });

  // Expose global consent status for DevTools, Google Analytics, or third-party scripts
  try {
    (window as any).fidaConsent = consent;
    (window as any).hasConsent = (category: "preferences" | "statistics") =>
      Boolean(consent[category]);
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }));
    window.dispatchEvent(new CustomEvent("fida-cookie-consent-updated", { detail: consent }));
  } catch {}
}

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Categories state
  const [preferences, setPreferences] = useState(false);
  const [statistics, setStatistics] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredConsent();
    if (!stored) {
      // First visit: show banner after brief delay
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    } else {
      setPreferences(Boolean(stored.preferences));
      setStatistics(Boolean(stored.statistics));

      // Re-hydrate global consent object
      if (typeof window !== "undefined") {
        (window as any).fidaConsent = stored;
        (window as any).hasConsent = (category: "preferences" | "statistics") =>
          Boolean(stored[category]);
      }
    }

    // Reopen cookie banner from footer or settings button
    const handleReopen = () => {
      const current = getStoredConsent();
      if (current) {
        setPreferences(Boolean(current.preferences));
        setStatistics(Boolean(current.statistics));
      } else {
        setPreferences(false);
        setStatistics(false);
      }
      setIsVisible(true);
    };

    window.addEventListener("open-cookie-banner", handleReopen);
    return () => window.removeEventListener("open-cookie-banner", handleReopen);
  }, []);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const t = setTimeout(() => setToastMessage(null), 3800);
    return () => clearTimeout(t);
  }, []);

  const saveConsent = (prefs: { preferences: boolean; statistics: boolean }, feedback: string) => {
    const consentData: CookieConsent = {
      necessary: true,
      preferences: prefs.preferences,
      statistics: prefs.statistics,
      marketing: false,
      timestamp: Date.now(),
    };
    persistConsent(consentData);
    setIsVisible(false);
    triggerToast(feedback);
  };

  const handleAllowAll = () => {
    setPreferences(true);
    setStatistics(true);
    saveConsent(
      { preferences: true, statistics: true },
      "All cookies accepted. Thank you!"
    );
  };

  const handleAllowSelection = () => {
    const anyAllowed = preferences || statistics;
    saveConsent(
      { preferences, statistics },
      anyAllowed
        ? "Your cookie preferences have been saved."
        : "Optional cookies declined. Only necessary cookies active."
    );
  };

  const handleDeny = () => {
    setPreferences(false);
    setStatistics(false);
    saveConsent(
      { preferences: false, statistics: false },
      "Non-essential cookies declined. Only necessary cookies remain active."
    );
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── Toast Confirmation ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-[100000] max-w-md bg-[#052c65] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md"
            role="status"
            aria-live="polite"
          >
            <div className="w-6 h-6 rounded-full bg-[#167fa8] flex items-center justify-center shrink-0">
              <Check size={14} className="stroke-[3] text-white" />
            </div>
            <span className="flex-1 leading-snug">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Cookie Banner Modal ── */}
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-x-0 bottom-0 z-[99999] p-3 sm:p-5 pointer-events-none flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-[#052c65]/10 shadow-[0_25px_65px_rgba(5,44,101,0.18)] p-5 sm:p-7 relative overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Cookie consent banner"
            >
              {/* Top Close Button (acts as Deny) */}
              <button
                type="button"
                onClick={handleDeny}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Decline non-essential cookies and close"
                title="Decline non-essential cookies"
              >
                <X size={18} />
              </button>

              {/* Main Content Area */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Branding & Message */}
                <div className="flex items-start gap-4 sm:gap-5 flex-1 pr-6 lg:pr-0">
                  <div className="shrink-0 pt-0.5">
                    <img src="/logo.png" alt="FIDA Global" className="h-8 sm:h-9 w-auto object-contain" />
                  </div>

                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#052c65] tracking-tight">
                        This website uses cookies
                      </h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                      We use cookies to improve your browsing experience, analyze site traffic, and deliver personalized content. By continuing to use this website, you agree to our use of cookies in accordance with our{" "}
                      <Link
                        href="/terms"
                        className="text-[#0047e1] font-bold underline underline-offset-2 hover:text-[#0037b0] transition-colors"
                      >
                        Terms & Conditions
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={handleAllowAll}
                    className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#0047e1] to-[#167fa8] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:brightness-110 active:scale-[0.98] transition-all text-center whitespace-nowrap cursor-pointer"
                  >
                    Allow all
                  </button>
                  <button
                    type="button"
                    onClick={handleAllowSelection}
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-[#052c65]/15 bg-white text-[#052c65] text-xs sm:text-sm font-bold hover:bg-[#052c65]/5 active:scale-[0.98] transition-all text-center whitespace-nowrap cursor-pointer"
                  >
                    Allow selection
                  </button>
                  <button
                    type="button"
                    onClick={handleDeny}
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] transition-all text-center whitespace-nowrap cursor-pointer"
                  >
                    Deny
                  </button>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-slate-100 my-4 sm:my-5" />

              {/* Category Toggles & Details Expander */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-700">
                  {/* Necessary (Always active) */}
                  <div className="flex items-center gap-2 cursor-not-allowed select-none" title="Strictly necessary cookies cannot be disabled">
                    <div className="w-9 h-5 rounded-full bg-[#167fa8] p-0.5 flex items-center justify-end shadow-inner cursor-not-allowed">
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <Check size={10} className="text-[#167fa8] stroke-[3]" />
                      </div>
                    </div>
                    <span className="text-slate-800 font-bold">Necessary</span>
                  </div>

                  {/* Preferences */}
                  <div
                    onClick={() => setPreferences((v) => !v)}
                    className="flex items-center gap-2 cursor-pointer select-none group"
                  >
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreferences((v) => !v);
                      }}
                      className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors shadow-inner cursor-pointer ${
                        preferences ? "bg-[#167fa8] justify-end" : "bg-slate-300 justify-start"
                      }`}
                      aria-label="Toggle Preferences cookies"
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                    </button>
                    <span className="group-hover:text-[#052c65] transition-colors">Preferences</span>
                  </div>

                  {/* Statistics */}
                  <div
                    onClick={() => setStatistics((v) => !v)}
                    className="flex items-center gap-2 cursor-pointer select-none group"
                  >
                    <button
                      type="button"
                      role="switch"
                      aria-checked={statistics}
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatistics((v) => !v);
                      }}
                      className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors shadow-inner cursor-pointer ${
                        statistics ? "bg-[#167fa8] justify-end" : "bg-slate-300 justify-start"
                      }`}
                      aria-label="Toggle Statistics cookies"
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                    </button>
                    <span className="group-hover:text-[#052c65] transition-colors">Statistics</span>
                  </div>
                </div>

                {/* Show / Hide Details Toggle */}
                <button
                  type="button"
                  onClick={() => setShowDetails((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0047e1] hover:text-[#0037b0] transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span>{showDetails ? "Hide details" : "Show details"}</span>
                  {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Expandable Details Panel */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 mt-4 border-t border-slate-100 text-xs text-slate-600">
                      <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                        <div className="font-bold text-[#052c65] mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#167fa8]" />
                          Necessary Cookies (Always Active)
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500">
                          Essential technical cookies required for secure navigation, session authenticity, and storing your consent preferences.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                        <div className="font-bold text-[#052c65] mb-1 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${preferences ? "bg-[#167fa8]" : "bg-slate-300"}`} />
                          Preferences Cookies
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500">
                          Enable the website to remember user preferences such as your chosen language, display density, and customized interface parameters.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                        <div className="font-bold text-[#052c65] mb-1 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${statistics ? "bg-[#167fa8]" : "bg-slate-300"}`} />
                          Statistics / Analytics Cookies
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500">
                          Help us collect aggregated, anonymous usage metrics to evaluate page performance, visitor flow, and improve platform ergonomics.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
