"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, ChevronDown, ChevronUp, X, Check } from "lucide-react";

interface CookieConsent {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  timestamp: number;
}

const STORAGE_KEY = "fida_cookie_consent";

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Categories state
  const [preferences, setPreferences] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Show banner after brief delay for smooth appearance
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      } else {
        const parsed: CookieConsent = JSON.parse(stored);
        setPreferences(Boolean(parsed.preferences));
        setStatistics(Boolean(parsed.statistics));
        setMarketing(Boolean(parsed.marketing));
      }
    } catch {
      setIsVisible(true);
    }

    // Allow reopening cookie banner from footer or anywhere
    const handleReopen = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: CookieConsent = JSON.parse(stored);
          setPreferences(Boolean(parsed.preferences));
          setStatistics(Boolean(parsed.statistics));
          setMarketing(Boolean(parsed.marketing));
        }
      } catch {}
      setIsVisible(true);
    };

    window.addEventListener("open-cookie-banner", handleReopen);
    return () => window.removeEventListener("open-cookie-banner", handleReopen);
  }, []);

  const saveConsent = (prefs: { preferences: boolean; statistics: boolean; marketing: boolean }) => {
    try {
      const consentData: CookieConsent = {
        necessary: true,
        preferences: prefs.preferences,
        statistics: prefs.statistics,
        marketing: prefs.marketing,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
    } catch {}
    setIsVisible(false);
  };

  const handleAllowAll = () => {
    setPreferences(true);
    setStatistics(true);
    setMarketing(true);
    saveConsent({ preferences: true, statistics: true, marketing: true });
  };

  const handleAllowSelection = () => {
    saveConsent({ preferences, statistics, marketing });
  };

  const handleDeny = () => {
    setPreferences(false);
    setStatistics(false);
    setMarketing(false);
    saveConsent({ preferences: false, statistics: false, marketing: false });
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-x-0 bottom-0 z-[99999] p-3 sm:p-5 pointer-events-none flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-[#052c65]/10 shadow-[0_25px_65px_rgba(5,44,101,0.18)] p-5 sm:p-7 relative overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={handleDeny}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Dismiss cookie notice"
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
                      href="/privacy"
                      className="text-[#0047e1] font-bold underline underline-offset-2 hover:text-[#0037b0] transition-colors"
                    >
                      Privacy Policy
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
                  className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#0047e1] to-[#167fa8] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:brightness-110 active:scale-[0.98] transition-all text-center whitespace-nowrap"
                >
                  Allow all
                </button>
                <button
                  type="button"
                  onClick={handleAllowSelection}
                  className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-[#052c65]/15 bg-white text-[#052c65] text-xs sm:text-sm font-bold hover:bg-[#052c65]/5 active:scale-[0.98] transition-all text-center whitespace-nowrap"
                >
                  Allow selection
                </button>
                <button
                  type="button"
                  onClick={handleDeny}
                  className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-100 active:scale-[0.98] transition-all text-center whitespace-nowrap"
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
                {/* Necessary */}
                <label className="flex items-center gap-2 cursor-not-allowed select-none">
                  <div className="w-9 h-5 rounded-full bg-[#167fa8] p-0.5 flex items-center justify-end shadow-inner cursor-not-allowed">
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Check size={10} className="text-[#167fa8] stroke-[3]" />
                    </div>
                  </div>
                  <span>Necessary</span>
                </label>

                {/* Preferences */}
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences}
                    onClick={() => setPreferences((v) => !v)}
                    className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors shadow-inner ${
                      preferences ? "bg-[#167fa8] justify-end" : "bg-slate-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                  </button>
                  <span className="group-hover:text-[#052c65] transition-colors">Preferences</span>
                </label>

                {/* Statistics */}
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={statistics}
                    onClick={() => setStatistics((v) => !v)}
                    className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors shadow-inner ${
                      statistics ? "bg-[#167fa8] justify-end" : "bg-slate-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                  </button>
                  <span className="group-hover:text-[#052c65] transition-colors">Statistics</span>
                </label>

                {/* Marketing */}
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={marketing}
                    onClick={() => setMarketing((v) => !v)}
                    className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors shadow-inner ${
                      marketing ? "bg-[#167fa8] justify-end" : "bg-slate-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                  </button>
                  <span className="group-hover:text-[#052c65] transition-colors">Marketing</span>
                </label>
              </div>

              {/* Show / Hide Details Toggle */}
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0047e1] hover:text-[#0037b0] transition-colors self-start sm:self-auto"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4 mt-4 border-t border-slate-100 text-xs text-slate-600">
                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                      <div className="font-bold text-[#052c65] mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#167fa8]" />
                        Necessary Cookies (Always Active)
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        Essential technical cookies required for secure navigation, session authenticity, and core enterprise application functions.
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

                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                      <div className="font-bold text-[#052c65] mb-1 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${marketing ? "bg-[#167fa8]" : "bg-slate-300"}`} />
                        Marketing & Communication Cookies
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        Used to deliver relevant business software insights, product launch announcements, and measure campaign effectiveness across networks.
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
  );
}
