"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <section className="flex min-h-[72vh] w-full items-center justify-center px-4 py-12">
      <div className="glass flex w-full max-w-md flex-col items-center rounded-[2rem] border border-[var(--grey-dark)] px-8 py-12 text-center shadow-2xl">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-[var(--green)]/20 bg-[var(--green-glow)]">
          <Loader2 size={36} className="animate-spin text-[var(--green)]" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--green)]">FIDA Admin</p>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-white">Loading module</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Preparing your dashboard data…</p>
      </div>
    </section>
  );
}
