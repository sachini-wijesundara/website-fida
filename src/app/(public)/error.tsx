"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route exception captured:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
      <div className="p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
        <AlertTriangle size={48} />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Something went wrong</h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm max-w-md mx-auto">
          An unexpected error occurred while loading this page. Our technical team has been notified.
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#052c65]/10 hover:bg-[#edf8fa] text-[var(--text-primary)] font-medium shadow-lg transition-smooth"
      >
        <RotateCcw size={16} />
        Try again
      </button>
    </div>
  );
}
