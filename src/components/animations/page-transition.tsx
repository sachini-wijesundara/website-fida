"use client";

import { useEffect } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleChunkError = (event: any) => {
      const reason = event?.reason || event?.error;
      const msg = event?.message || reason?.message || "";
      if (
        msg.includes("Loading chunk") ||
        msg.includes("ChunkLoadError") ||
        reason?.name === "ChunkLoadError" ||
        msg.includes("failed to fetch dynamically imported module")
      ) {
        if (event.preventDefault) event.preventDefault();
        const key = `chunk_retry_${window.location.pathname}`;
        const last = sessionStorage.getItem(key);
        const now = Date.now();
        if (!last || now - parseInt(last, 10) > 6000) {
          sessionStorage.setItem(key, String(now));
          window.location.reload();
        }
      }
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handleChunkError);
    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handleChunkError);
    };
  }, []);

  return (
    <div className="w-full min-w-0 flex-1 overflow-x-clip">
      {children}
    </div>
  );
}
