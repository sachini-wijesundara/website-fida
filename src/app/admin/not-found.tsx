"use client";

import Link from "next/link";
import { ArrowLeft, FileQuestion, LayoutDashboard } from "lucide-react";

export default function AdminNotFound() {
  return (
    <section className="flex min-h-[72vh] items-center justify-center px-4 py-12">
      <div className="glass w-full max-w-xl rounded-[2rem] border border-[var(--grey-dark)] p-8 text-center shadow-2xl md:p-12">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-[var(--green)]/25 bg-[var(--green-glow)] text-[var(--green)]">
          <FileQuestion size={38} />
        </div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--green)]">FIDA Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-white">Admin page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
          This admin module does not exist or its address has changed. Return to the dashboard and choose a module from the sidebar.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110">
            <LayoutDashboard size={17} /> Dashboard
          </Link>
          <button type="button" onClick={() => history.back()} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            <ArrowLeft size={17} /> Go back
          </button>
        </div>
      </div>
    </section>
  );
}
