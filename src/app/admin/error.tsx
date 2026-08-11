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
    <section className="flex min-h-[72vh] w-full items-center justify-center px-4 py-12">
      <div className="glass w-full max-w-xl rounded-[2rem] border border-[var(--grey-dark)] p-8 text-center shadow-2xl md:p-12">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400">
          <AlertCircle size={38} />
        </div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--green)]">FIDA Admin</p>
        <h2 className="text-xl font-bold text-white tracking-tight">Dashboard Load Failure</h2>
        <p className="text-[var(--text-secondary)] mt-2 text-sm max-w-md mx-auto">
          An error occurred while loading this admin panel module. Try refreshing or contact database support.
        </p>
        <button
          onClick={reset}
          className="mx-auto mt-8 flex items-center gap-2 rounded-xl bg-[var(--green)] px-6 py-3 font-bold text-white transition-smooth hover:brightness-110"
        >
          <RotateCcw size={16} />
          Try reloading view
        </button>
      </div>
    </section>
  );
}
