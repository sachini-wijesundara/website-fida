"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";

export default function StatsSection() {
  const [stats, setStats] = useState([
    { value: 360, suffix: "+", prefix: "", label: "Total Projects", desc: "Successfully delivered" },
    { value: 13, suffix: "+", prefix: "", label: "Years Exp.", desc: "Innovation & R&D" },
    { value: 28862, suffix: "+", prefix: "", label: "Cloud Users", desc: "On FIDA HR Platform" },
    { value: 45, suffix: "+", prefix: "", label: "Happy Clients", desc: "Global Enterprises" },
  ]);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStats([
            { value: 360, suffix: "+", prefix: "", label: "Total Projects", desc: "Successfully delivered" },
            { value: parseInt(data.experience_years) || 13, suffix: "+", prefix: "", label: "Years Exp.", desc: "Innovation & R&D" },
            { value: 28862, suffix: "+", prefix: "", label: "Cloud Users", desc: "On FIDA HR Platform" },
            { value: parseInt(data.clients_count) || 45, suffix: "+", prefix: "", label: "Happy Clients", desc: "Global Enterprises" },
          ]);
        }
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-zinc-50">
      {/* Background line */}
      <div className="absolute inset-0 border-y border-zinc-200" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y lg:divide-y-0 divide-zinc-200">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 text-center space-y-2 group"
            >
              <div className="text-5xl lg:text-6xl font-bold text-primary tracking-tight group-hover:scale-105 transition-transform">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-base font-bold text-zinc-900">
                {stat.label}
              </div>
              <div className="text-sm text-zinc-500">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
