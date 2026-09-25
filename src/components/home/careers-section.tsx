"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

interface Job {
  id: number;
  title: string;
  dept: string;
  type: string;
  location: string;
  color?: string;
  is_active?: boolean;
}

export default function CareersSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareers() {
      try {
        const res = await fetch("/api/careers");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setJobs(data.data.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Failed to fetch careers for home section:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-[#f7fcfd] via-white to-[#f4f9fd]">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-[-5%] w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] bg-blue-50 text-[#0047e1] border border-blue-100/80 shadow-sm">
              <Briefcase className="w-3.5 h-3.5 text-[#0047e1]" />
              <span>Career Opportunities</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#052c65] uppercase tracking-tight leading-[1.08]">
              Build the Future of <br className="hidden sm:block" />
              <span className="text-[#0047e1] italic font-serif normal-case">Enterprise Tech</span>
            </h2>
            <p className="text-[#536b8a] text-base md:text-lg font-medium leading-relaxed max-w-xl">
              Join a high-performance team delivering scalable, mission-critical digital systems to enterprises worldwide.
            </p>
          </div>

          <Link
            href="/careers"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#0047e1] border border-blue-200 text-xs font-black uppercase tracking-widest shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-300 group self-start md:self-end"
          >
            <span>View All Openings</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Roles Grid / List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-44 bg-white/70 rounded-2xl border border-gray-100 animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, idx) => {
              const accentColor = job.color && job.color.startsWith("var(") ? "#0047e1" : (job.color || "#0047e1");
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href="/careers"
                    className="group block relative bg-white/90 backdrop-blur-md rounded-2xl p-7 border border-slate-100 shadow-[0_10px_30px_rgba(5,44,101,0.04)] hover:shadow-[0_20px_45px_rgba(0,71,225,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top gradient highlight strip */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0047e1] via-[#38a3f5] to-[#76c442] opacity-70 group-hover:opacity-100 transition-opacity"
                    />

                    <div className="flex flex-col h-full justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0047e1] border border-blue-100">
                            <Sparkles className="w-3 h-3 text-[#0047e1]" />
                            {job.dept || "Engineering"}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            Immediate Opening
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-[#052c65] group-hover:text-[#0047e1] transition-colors leading-snug">
                          {job.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-[#536b8a] font-medium">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#0047e1]" />
                            {job.type || "Full-time"}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#76c442]" />
                            {job.location || "Colombo / Remote"}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 font-bold text-[#0047e1] group-hover:translate-x-1 transition-transform">
                          Apply Now <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 md:p-14 text-center border border-slate-100 shadow-sm max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0047e1] flex items-center justify-center mx-auto mb-2">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#052c65]">We Are Always Looking for Builders</h3>
            <p className="text-[#536b8a] text-sm md:text-base max-w-md mx-auto">
              No open roles right now? Send us your credentials and tell us where you can make an impact.
            </p>
            <div className="pt-2">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0047e1] text-white text-xs font-black uppercase tracking-widest hover:bg-[#0037b0] transition-colors shadow-[0_12px_24px_-6px_rgba(0,71,225,0.3)]"
              >
                Send Open Application
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
