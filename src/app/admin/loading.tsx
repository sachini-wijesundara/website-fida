"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 w-full">
      <Loader2 size={32} className="animate-spin text-[var(--green)]" />
      <p className="text-[var(--text-secondary)] text-sm font-medium tracking-wide">Loading dashboard data...</p>
    </div>
  );
}
