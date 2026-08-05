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
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col items-center justify-center bg-[#090D16] text-[#E2E8F0] font-sans px-6 text-center gap-6">
        <div className="p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
          <AlertCircle size={48} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Critical System Error</h1>
          <p className="text-[#94A3B8] mt-2 text-sm max-w-md mx-auto">
            A critical error occurred at the root level of the application. Please reload or try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-smooth"
        >
          <RotateCcw size={16} />
          Reload Application
        </button>
      </body>
    </html>
  );
}
