"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Server, Shield, Cloud, Terminal, Cpu, Users, Zap,
  Database, Code, Award, Loader2, Search, Building2, Layout, Briefcase, Globe,
  ArrowUpRight
} from "lucide-react";

// Helper to map icon names from DB to components
const IconMap: { [key: string]: any } = {
  Server, Shield, Cloud, Terminal, Cpu, Users, Zap, Database, Code, Award,
  Building2, Layout, Briefcase, Globe
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function ExpertiseSection() {
  const [expertise, setExpertise] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpertise() {
      try {
        const res = await fetch("/api/expertise");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        // Filter published and map colors/numbers
        const published = list.filter((ex: any) => ex.status === 'Published').map((ex: any, idx: number) => ({
          ...ex,
          number: (idx + 1).toString().padStart(2, '0'),
          color: idx % 2 === 0 ? "from-blue-500/20 to-blue-500/5" : "from-primary/20 to-primary/5",
          border: idx % 2 === 0 ? "hover:border-blue-500/40" : "hover:border-primary/40",
        }));
        setExpertise(published);
      } catch (err) {
        console.error("Error fetching expertise:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpertise();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium tracking-widest uppercase">Initializing Core Capabilities...</p>
      </div>
    );
  }

  // If no expertise yet, don't show the section or show a minimal version
  if (expertise.length === 0) return null;

  const getIcon = (title: string) => {
    const key = title.split(' ')[0] as keyof typeof IconMap;
    const Icon = IconMap[key] || Server;
    return <Icon size={28} strokeWidth={1.5} />;
  };

  return (
    <section className="py-32 public-themed-section overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%]     rounded-full" style={{ background: "radial-gradient(circle, var(--tw-gradient-stops, rgba(56, 189, 248, 0.15)), transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4 flex items-center gap-2"
          >
            <div className="w-8 h-[1px] bg-primary" />
            Core Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-tight"
          >
            Sovereign Technology <br />
            <span className="text-[#167fa8] italic">Redefined</span>
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertise.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative h-[380px] perspective-1000"
            >
              <div
                className="relative h-full w-full rounded-[2.5rem] public-card p-10 
                transition-all duration-500 overflow-hidden group-hover:border-[#43bfd5]/50 group-hover:-translate-y-1"
              >


                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-16 h-16 rounded-3xl bg-[#e2f7fa] flex items-center justify-center mb-8 border border-[#052c65]/8 
                    group-hover:bg-primary group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl">
                    <span className="text-[#052c65] group-hover:text-white transition-colors">
                      {getIcon(exp.title || "")}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-4 group-hover:text-[#167fa8] transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-auto transition-colors">
                    {exp.description}
                  </p>

                  <div className="relative z-10 pt-8 flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    Discover Capabilities
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
