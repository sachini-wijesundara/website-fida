"use client";

import React from "react";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          if (typeof (window as any).openCookieBanner === "function") {
            (window as any).openCookieBanner();
          } else if (typeof (window as any).openCookieSettings === "function") {
            (window as any).openCookieSettings();
          }
          window.dispatchEvent(new CustomEvent("open-cookie-banner"));
        }
      }}
      className="text-[#0047e1] font-bold underline underline-offset-2 hover:text-[#0037b0] cursor-pointer"
    >
      Cookie Settings
    </button>
  );
}
