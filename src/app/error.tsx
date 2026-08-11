"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    console.error("Route exception captured:", error);
  }, [error]);

  return (
    <main className={`${isAdminRoute ? "admin-theme admin-shell bg-[var(--bg-base)] text-white" : "public-theme public-pastel-page text-[#052c65]"} flex min-h-screen items-center justify-center px-6 text-center`}>
      <div className={`w-full max-w-xl rounded-[2rem] border p-10 shadow-2xl backdrop-blur-xl ${isAdminRoute ? "glass border-[var(--grey-dark)]" : "border-[#052c65]/10 bg-white/70"}`}>
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-red-500/20 bg-red-500/10 text-red-500">
          <AlertTriangle size={40} />
        </div>
        <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.28em] ${isAdminRoute ? "text-[var(--green)]" : "text-[#159bb4]"}`}>{isAdminRoute ? "FIDA Admin" : "FIDA Global"}</p>
        <h1 className="text-2xl font-extrabold tracking-tight">Something went wrong</h1>
        <p className={`mx-auto mt-3 max-w-md text-sm leading-6 ${isAdminRoute ? "text-[var(--text-secondary)]" : "text-[#637892]"}`}>
          An unexpected error occurred while loading this page. Our technical team has been notified.
        </p>
        <button
          onClick={reset}
          className={`mx-auto mt-8 flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition hover:brightness-110 ${isAdminRoute ? "bg-[var(--green)]" : "bg-gradient-to-r from-[#61d5e5] to-[#167fa8]"}`}
        >
          <RotateCcw size={16} />
          Try again
        </button>
      </div>
    </main>
  );
}
