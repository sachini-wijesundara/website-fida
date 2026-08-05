"use client";

import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-6">
      <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <FileQuestion size={48} />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Page Not Found</h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm max-w-md mx-auto">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--blue)] to-[var(--blue-dark)] text-white font-medium transition-smooth hover:scale-[1.02]"
      >
        Go back home
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
