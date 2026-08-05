"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard exception captured:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center gap-6 w-full">
      <div className="p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
        <AlertCircle size={40} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Dashboard Load Failure</h2>
        <p className="text-[var(--text-secondary)] mt-2 text-sm max-w-md mx-auto">
          An error occurred while loading this admin panel module. Try refreshing or contact database support.
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-smooth"
      >
        <RotateCcw size={16} />
        Try reloading view
      </button>
    </div>
  );
}
