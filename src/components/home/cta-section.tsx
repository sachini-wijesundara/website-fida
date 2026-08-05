"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-green opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <div className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full inline-flex">
            Ready to Transform?
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.05]">
            Let&apos;s Build Your{" "}
            <span className="text-primary italic">Digital</span>
            <br />
            Future Together
          </h2>

          <p className="text-xl text-muted leading-relaxed max-w-2xl mx-auto">
            Join 500+ enterprises already accelerating their growth with FIDA Global&apos;s
            intelligent IT ecosystem.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <Link
              href="/contact"
              className="gradient-green text-white px-12 py-5 rounded-full font-bold text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-smooth"
            >
              Start a Conversation
            </Link>
            <Link
              href="/solutions"
              className="glass border border-border hover:border-primary/40 text-[var(--text-primary)] px-12 py-5 rounded-full font-bold text-lg transition-smooth"
            >
              View Solutions
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
