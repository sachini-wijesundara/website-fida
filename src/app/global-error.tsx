"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col items-center justify-center bg-[#f7fcfd] text-[#052c65] font-sans px-6 text-center gap-6">
        <div className="p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
          <AlertCircle size={48} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#052c65]">Critical System Error</h1>
          <p className="text-[#637892] mt-2 text-sm max-w-md mx-auto">
            A critical error occurred at the root level of the application. Please reload or try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#052c65]/10 hover:bg-[#edf8fa] text-[#052c65] font-medium shadow-lg transition-smooth"
        >
          <RotateCcw size={16} />
          Reload Application
        </button>
      </body>
    </html>
  );
}
