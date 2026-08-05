"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Server, Shield, Cloud, Terminal, Database, Cpu, Network, Settings, Loader2 } from "lucide-react";
import Link from "next/link";

const iconMap: { [key: string]: any } = {
  Server, Shield, Cloud, Terminal, Database, Cpu, Network, Settings
};

const colors = ["var(--green)", "var(--blue)", "var(--grey)"];

export default function ServicesClient() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setServices(data.filter((s: any) => s.status === "Published"));
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium tracking-widest uppercase">Loading Services...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-[var(--text-secondary)]">No services found. Add some from the admin panel.</p>
      </div>
    );
  }

  return (
    <section className="py-24 container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-8">
        {services.map((s, i) => {
          const Icon = iconMap[s.icon_name] || Terminal;
          const color = colors[i % colors.length];
          const features = s.features ? s.features.split("\n").filter((f: string) => f.trim() !== "") : [];
          
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: "easeOut" }}
              className="glass rounded-3xl p-10 group hover:-translate-y-1 transition-smooth card-hover-blue relative overflow-hidden h-full flex flex-col"
            >
              {/* Accent bg */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: color }} />

              <div className="flex items-start gap-6 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                  <Icon className="w-7 h-7" style={{ color: color }} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${color}15`, color: color }}>{s.label}</span>
                  <h3 className="text-xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                </div>
              </div>

              <p className="leading-relaxed mb-6 text-sm flex-grow" style={{ color: "var(--text-secondary)" }}>{s.description}</p>

              {features.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {features.map((f: string) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-smooth mt-auto"
                style={{ color: color }}
              >
                Enquire Now →
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
