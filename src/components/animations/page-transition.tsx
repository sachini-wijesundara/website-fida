"use client";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-w-0 flex-1 overflow-x-clip" style={{ background: "linear-gradient(135deg,#f0fafb 0%,#fff 48%,#e9fbfd 100%)" }}>
      {children}
    </div>
  );
}
