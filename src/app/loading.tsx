"use client";

import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Loading() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <main className="admin-theme admin-shell flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-6 text-[var(--text-primary)]">
        <div className="glass flex w-full max-w-md flex-col items-center rounded-[2rem] border border-[var(--grey-dark)] px-8 py-12 text-center shadow-2xl">
          <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-[var(--green)]/20 bg-[var(--green-glow)]">
            <Loader2 size={36} className="animate-spin text-[var(--green)]" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--green)]">FIDA Admin</p>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-white">Loading module</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="public-theme public-pastel-page flex min-h-screen items-center justify-center px-6 text-[#052c65]">
      <div className="flex w-full max-w-md flex-col items-center rounded-[2rem] border border-[#052c65]/10 bg-white/70 px-8 py-12 text-center shadow-[0_24px_70px_rgba(5,44,101,.10)] backdrop-blur-xl">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-[#61d5e5]/35 bg-[#dff8fb]/70">
          <Loader2 size={36} className="animate-spin text-[#159bb4]" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#159bb4]">FIDA Global</p>
        <h2 className="mt-3 text-xl font-extrabold tracking-tight">Loading page</h2>
      </div>
    </main>
  );
}
