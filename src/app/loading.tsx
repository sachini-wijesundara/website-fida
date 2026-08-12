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

  // Public routes use prefetched page-to-page transitions. Rendering a loading
  // screen here would become an unwanted third panel between those two pages.
  return null;
}
