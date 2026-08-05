"use client";

import { motion } from "framer-motion";
import { Users, Globe, Award, Lightbulb, Shield, Zap } from "lucide-react";
import { AnimatedCounter } from "@/components/home/animated-counter";
import TeamShowcase from "@/components/home/team-showcase";

const values = [
  { icon: Lightbulb, color: "var(--green)", title: "Innovation First", desc: "We relentlessly pursue new ideas and technology to keep our clients ahead of the curve." },
  { icon: Shield, color: "var(--blue)", title: "Security at Core", desc: "Every solution we build embeds security from day one — not as a feature, but as a foundation." },
  { icon: Zap, color: "var(--green)", title: "Speed & Precision", desc: "We deliver with unmatched speed without compromising on quality or reliability." },
  { icon: Globe, color: "var(--blue)", title: "Global Reach", desc: "Operating across 12 countries, our expertise is local and our scale is international." },
  { icon: Users, color: "var(--grey)", title: "People-Centric", desc: "We invest in relationships — with our clients, our partners, and our people." },
  { icon: Award, color: "var(--grey)", title: "Award-Winning", desc: "15+ industry awards recognise our commitment to excellence in IT service delivery." },
];

import { useState, useEffect } from "react";

const team = [
  { name: "Ahmed Al-Rashid", role: "Chief Executive Officer", initials: "AR", color: "var(--green)" },
  { name: "Sarah Mitchell", role: "Chief Technology Officer", initials: "SM", color: "var(--blue)" },
  { name: "James Okonkwo", role: "VP — Infrastructure", initials: "JO", color: "var(--grey)" },
  { name: "Priya Nair", role: "Head of Cybersecurity", initials: "PN", color: "var(--green)" },
  { name: "Lars Eriksson", role: "Director — Cloud Services", initials: "LE", color: "var(--blue)" },
  { name: "Maria Santos", role: "Chief Operating Officer", initials: "MS", color: "var(--grey)" },
];

export default function AboutClient() {

  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchTimeline();
    fetchSettings();
  }, []);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/timeline");
      const data = await res.json();
      if (data.success) {
        setMilestones(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Stats */}
      <section className="section-alt py-20">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--grey-dark)]">
          {[
            { val: parseInt(settings?.clients_count || "500"), suf: "+", label: "Enterprise Clients", color: "var(--green)" },
            { val: parseInt(settings?.experience_years || "15"), suf: "+", label: "Years Experience", color: "var(--blue)" },
            { val: parseInt(settings?.countries_count || "12"), suf: "", label: "Countries", color: "var(--grey-light)" },
            { val: 99, suf: ".9%", label: "Uptime SLA", color: "var(--green)" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className="p-10 text-center space-y-2"
            >
              <div className="text-5xl font-black" style={{ color: s.color }}>
                <AnimatedCounter target={s.val} suffix={s.suf} />
              </div>
              <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-28 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <span className="badge-green px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Our Mission</span>
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
              Empowering enterprises to{" "}
              <span style={{ color: "var(--green)" }} className="italic">thrive</span>{" "}
              through intelligent technology
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              We believe that technology should be an enabler, not a burden. Our mission is to remove the complexity of modern IT and replace it with clarity, security, and speed — so your business can focus on what it does best.
            </p>
            <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
              From a team of 8 in Dubai to 500+ engineers across 12 countries, FIDA Global has stayed true to one principle: deliver measurable impact for every client, every time.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-[3rem] blur-[80px] opacity-20" style={{ background: "var(--blue)" }} />
            <div className="relative glass rounded-[3rem] p-10 space-y-6 min-h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full py-10">
                  <div className="w-8 h-8 rounded-full border-4 border-[var(--green)] border-t-transparent animate-spin mx-auto"></div>
                </div>
              ) : milestones.length === 0 ? (
                 <p className="text-center text-[var(--text-muted)] py-10">Company history currently unavailable.</p>
              ) : (
                milestones.map((m, i) => (
                  <div key={m.TimelineId || i} className="flex gap-6 items-start">
                    <div className="text-xs font-black uppercase tracking-widest pt-1 w-12 flex-shrink-0" style={{ color: i % 2 === 0 ? "var(--green)" : "var(--blue)" }}>{m.Year}</div>
                    <div className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{m.Text}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-alt py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <span className="badge-blue px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Our Values</span>
            <h2 className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>What Drives Everything We Do</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="glass rounded-3xl p-8 group hover:-translate-y-2 transition-smooth card-hover-green"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${v.color}18` }}>
                    <Icon className="w-6 h-6" style={{ color: v.color }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team — Lusion-style full-screen showcase */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <span className="badge-grey px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Leadership</span>
          <h2 className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>The Team Behind the Vision</h2>
        </motion.div>
        <TeamShowcase />
      </section>
    </>
  );
}
