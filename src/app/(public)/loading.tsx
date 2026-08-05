"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 size={40} className="animate-spin text-[var(--blue)]" />
      <p className="text-[var(--text-secondary)] text-sm tracking-wide">Loading content...</p>
    </div>
  );
}
