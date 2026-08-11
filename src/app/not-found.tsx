"use client";

import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowRight, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <main className="admin-theme admin-shell flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-6 text-[var(--text-primary)]">
        <div className="glass w-full max-w-xl rounded-[2rem] border border-[var(--grey-dark)] p-10 text-center shadow-2xl">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-[var(--green)]/25 bg-[var(--green-glow)] text-[var(--green)]">
            <FileQuestion size={38} />
          </div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--green)]">FIDA Admin</p>
          <h1 className="text-3xl font-black tracking-tight text-white">Admin page not found</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">The requested admin module does not exist or has been moved.</p>
          <Link href="/admin" className="mx-auto mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--green)] px-6 py-3 font-bold text-white transition hover:brightness-110">
            <LayoutDashboard size={17} /> Return to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="public-theme public-pastel-page flex min-h-screen items-center justify-center px-6 text-center text-[#052c65]">
      <div className="w-full max-w-xl rounded-[2rem] border border-[#052c65]/10 bg-white/70 p-10 shadow-[0_24px_70px_rgba(5,44,101,.10)] backdrop-blur-xl">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-[#61d5e5]/35 bg-[#dff8fb]/70 text-[#159bb4]">
          <FileQuestion size={40} />
        </div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#159bb4]">FIDA Global</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#637892]">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="mx-auto mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#61d5e5] to-[#167fa8] px-6 py-3 font-bold text-white transition hover:scale-[1.02]"
        >
          Go back home
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
