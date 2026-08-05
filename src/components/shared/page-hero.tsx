"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeroProps {
  badge: string;
  badgeColor?: "green" | "blue" | "grey";
  title: ReactNode;
  subtitle?: string;
  accent?: "green" | "blue";
}

export default function PageHero({ badge, badgeColor = "green", title, subtitle, accent = "green" }: PageHeroProps) {
  const badgeClass =
    badgeColor === "blue" ? "badge-blue" :
    badgeColor === "grey" ? "badge-grey" :
    "badge-green";

  return (
    <section className="public-page-hero relative min-h-[58vh] flex items-center justify-center overflow-hidden pt-40 pb-24">
      {/* Glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20 ${
          accent === "blue" ? "bg-blue" : "bg-green"
        }`}
      />
      <div className="public-page-hero__orb" aria-hidden="true" />
      <div className="public-page-hero__sweep" aria-hidden="true" />
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(139,160,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,160,184,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="container mx-auto px-6 text-center relative z-10 space-y-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${badgeClass}`}
        >
          {badge}
        </motion.div>

        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </motion.div>
        </div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
