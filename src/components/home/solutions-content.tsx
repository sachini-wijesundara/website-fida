"use client";

import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Cloud, Lock, ShieldCheck, BadgeCheck, Zap, Wifi } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { runDirectionalPageTransition } from "@/lib/directional-page-transition";

const EASE = [0.16, 1, 0.3, 1] as const;

const SOLUTIONS = [
  {
    slug: "smart-hris",
    dbSlug: "smart-hris",
    id: "smart-hris",
    title: "Smart HRIS",
    desc: "The foundation: 13+ years of enterprise HR intelligence, unified into a single source of truth.",
    details: "15+ years of enterprise HR intelligence, unified into a single source of truth. Employee profiles, automated payroll, attendance, and document management form the core — while self-service portals, performance tracking, and recruitment tools turn Smart HRIS into the engine behind how your workforce actually grows.",
    image: "/api/images/solutions_images/smarthris.png",
    category: "HR",
  },
  {
    slug: "attendance",
    dbSlug: "access-control-attendance",
    id: "access-control",
    title: "Access Control & Attendance",
    desc: "The ground-truth layer: secure access, accurate time tracking, and biometrically verified presence.",
    details: "Secure access, accurate time tracking, and biometrically verified presence — the layer everything else stands on.\n\nPowered by ZKTeco hardware, fingerprint and facial recognition, turnstiles, and gate systems pair with security guard patrol tracking, all installed and supported by FIDA's own team.",
    image: "/api/images/solutions_images/attendance.png",
    category: "Operations",
  },
  {
    slug: "consultancy",
    dbSlug: "business-consultancy",
    id: "bpo",
    title: "BPO Services",
    desc: "The strategic layer: human-led guidance when you need more than just software to solve enterprise puzzles.",
    details: "Beyond software, FIDA offers human-led business consultancy for organizations facing challenges that technology alone cannot solve.\n\nOur team works directly with your business to assess operational gaps, recommend process improvements, and guide enterprise-level decision-making.",
    image: "/api/images/solutions_images/bpo&services.png",
    category: "Services",
  },
  {
    slug: "task-manager",
    dbSlug: "task-manager",
    id: "task-manager",
    title: "FIDA Task Manager",
    desc: "The operations layer: do more, stress less. Automate workflows and track team efficiency in real-time.",
    details: "FIDA Task Manager organizes team workflows through a visual, Kanban-style taskboard with four stages — To Do, In Progress, Review, and Done.\n\nBuilt-in commenting, file attachments, and team tagging keep collaboration and context in one place.",
    image: "/api/images/solutions_images/taskmanager.png",
    category: "Operations",
  },
  {
    slug: "helpdesk",
    dbSlug: "helpdesk",
    id: "helpdesk",
    title: "Helpdesk System",
    desc: "The support layer: every ticket tracked, every response fast. Enterprise-grade resolution for internal requests.",
    details: "FIDA Helpdesk is a cloud-based ticketing and support management system designed for teams handling high volumes of customer or internal requests.\n\nBy combining transparency with data-backed insights, teams resolve issues accurately on the first attempt and build stronger trust.",
    image: "/api/images/solutions_images/helpdesk.png",
    category: "Operations",
  },
];

interface SolutionImageRecord {
  slug?: string;
  detail_image_1?: string;
  detail_image_2?: string;
}

const HIGHLIGHTS = [
  "Unified payroll",
  "Real-time attendance",
  "Employee self-service",
  "Workforce analytics",
];

const STATS = [
  { icon: Lock,       value: "Data Encryption",   label: "Isolated at rest & in transit" },
  { icon: ShieldCheck,value: "Local Compliance",  label: "Region-first data residency" },
  { icon: BadgeCheck, value: "Certified Standards", label: "Audited security controls" },
  { icon: Zap,        value: "99.9% Uptime SLA",  label: "Always-on availability" },
];

const CLIENTS = [
  { name: "Sarah Jenkins",   role: "CEO",              company: "Good Company", initial: "S", quote: "FIDA gave us a single source of truth across payroll, HR, and operations." },
  { name: "Chamindu",        role: "CTO",              company: "Good Company", initial: "C", quote: "Their platform handled our access control and attendance at global scale." },
  { name: "Alex Thompson",   role: "COO",              company: "Good Company", initial: "A", quote: "Borderless talent, one dependable layer. That is what FIDA delivers." },
];

export default function SolutionsContent() {
  const rm = useReducedMotion();
  const router = useRouter();
  const [expandedSlug, setExpandedSlug] = useState("smart-hris");
  const [solutionImages, setSolutionImages] = useState<Record<string, SolutionImageRecord>>({});
  const [smartHrisLogo, setSmartHrisLogo] = useState<string | null>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    fetch('/api/solutions/smart-hris')
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        if (data?.template_data?.hero?.logo_image) {
          setSmartHrisLogo(data.template_data.hero.logo_image);
        }
      })
      .catch(err => console.error("Failed to fetch Smart HRIS logo:", err));
  }, []);

  useEffect(() => {
    fetch("/api/solutions")
      .then((response) => response.ok ? response.json() : [])
      .then((rows: SolutionImageRecord[]) => {
        setSolutionImages(Object.fromEntries(rows.filter((row) => row.slug).map((row) => [row.slug!, row])));
      })
      .catch(() => setSolutionImages({}));
  }, []);





  const expandSolution = (slug: string, index: number) => {
    activeIndexRef.current = index;
    setExpandedSlug(slug);
  };

  return (
    <main className="solutions-page smart-hris-page min-h-screen">

      {/* ── Smart HRIS Hero: scroll-reveal animation ── */}
      <motion.section
        id="smart-hris-hero"
        className="sol-target-hero !rounded-none !shadow-none !pt-20"
        initial={false}
      >
        <div className="sol-target-hero__content">
          <motion.div
            className="flex flex-col mb-20 self-start lg:ml-[6vw] xl:ml-[8vw]"
            initial={rm ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
          >
            <div className="flex items-center flex-wrap mb-4">
              <span className="text-[#5BA3C7] font-semibold text-[28px] lg:text-[32px]">One ecosystem.</span>
              <img src={smartHrisLogo || "/api/images/FIDA%20Global%20logos.png"} alt="Smart HRIS Logo" className="h-[40px] lg:h-[52px] ml-3 object-contain" style={{ transform: 'translateY(-8%)' }} />
            </div>
            <h1 className="leading-[1.15] max-w-[850px] mb-6 text-[#1a2b4d] font-black text-[48px] lg:text-[60px] tracking-tight">
              Every layer of your workforce, covered.
            </h1>
            <p className="text-[#637892] text-[17px] lg:text-[19px] leading-[1.7] max-w-[700px]">
              FIDA Global orchestrates your entire enterprise ecosystem. From strategic consultancy
              to ground-truth operational management, we provide a unified intelligence layer.
            </p>
          </motion.div>
          <div className="sol-target-stage">
            <motion.div className="sol-target-dashboard" initial={rm ? false : { opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, delay: 0.25, ease: EASE }}>
              <img src="/api/images/homepageimages/image5.png" alt="Smart HRIS dashboard" />
            </motion.div>
            <motion.div className="sol-target-mobile" initial={rm ? false : { opacity: 0, x: -30, y: 30 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, delay: 0.4, ease: EASE }}>
              <img src="/api/images/homepageimages/IMG_8542.PNG" alt="Smart HRIS mobile app" />
            </motion.div>
            <div className="sol-target-robot sol-target-robot--left" aria-hidden="true"><img src="/api/images/stylus_left.png" alt="" /></div>
            <div className="sol-target-robot sol-target-robot--right" aria-hidden="true"><img src="/api/images/stylus_right.png" alt="Robotic hand with stylus" /></div>
          </div>
        </div>
      </motion.section>

      {/* ── Our Solutions list ──────────────────────────── */}
      <section className="sol-list-section">
        <motion.h2
          className="sol-list-section__heading"
          initial={rm ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Our Solutions
        </motion.h2>

        <div className="sol-list-section__grid">
          {SOLUTIONS.map((sol, i) => {
            const expanded = expandedSlug === sol.slug;
            const databaseImages = solutionImages[sol.dbSlug || sol.slug];
            const detailImage = sol.slug === "smart-hris"
              ? "/api/images/homepageimages/image5.png"
              : databaseImages?.detail_image_1 || sol.image;

            return (
            <motion.article
              key={sol.slug}
              className={`sol-list-item${expanded ? " sol-list-item--featured" : ""}`}
              initial={rm ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.06, ease: EASE }}
              onClick={() => expandSolution(sol.slug, i)}
              onMouseEnter={() => expandSolution(sol.slug, i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  expandSolution(sol.slug, i);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={expanded}
              layout
              whileHover={{ y: -2 }}
            >
              <div className="sol-list-item__body">
                <h3 className="sol-list-item__title">{sol.title}</h3>
                <motion.p layout="position" className="sol-list-item__desc">
                  {expanded ? sol.details : sol.desc}
                </motion.p>
              </div>
              <Link href={`/solutions/${(i + 1).toString().padStart(2, '0')}`} className="sol-list-item__link" onClick={(event) => event.stopPropagation()}>
                Learn more <ArrowRight size={14} />
              </Link>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    className="sol-list-item__thumb"
                    initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <img src={detailImage} alt={`${sol.title} solution preview`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )})}
        </div>
      </section>

      {/* ── Platform + Stats ───────────────────────────── */}
      <section className="sol-platform-section">
        <div className="sol-platform-section__inner">
          <motion.div
            initial={rm ? false : { opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <h2 className="sol-platform-section__h2">
              <span>Platforms that carry the load,</span>
              <span>connect everything,</span>
              <span>and never stop.</span>
            </h2>
          </motion.div>
          <motion.div
            className="sol-platform-section__img"
            initial={rm ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
          >
            <img src="/api/images/solutions_images/homeLAST.png" alt="Business leaders reviewing enterprise analytics" />
          </motion.div>
        </div>

        <motion.p
          className="sol-platform-section__sub"
          initial={rm ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          We understand that for global enterprises, security isn't just a feature — it's
          the foundation. FIDA Global employs a multi-layered security architecture that
          isolates data at rest and in transit.
        </motion.p>

        <div className="sol-stats">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              className="sol-stat"
              initial={rm ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            >
              <span className="sol-stat__icon"><Icon size={26} strokeWidth={1.6} /></span>
              <strong className="sol-stat__value">{value}</strong>
              <span className="sol-stat__label">{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <motion.section
        className="sol-cta-section"
        initial={rm ? false : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <h2 className="sol-cta-section__h2">
          Ready to bring every layer of your<br />
          workforce onto one system?
        </h2>
        <p className="sol-cta-section__sub">
          Talk to our team about what FIDA Global can take off your plate. We've built the
          infrastructure so you can focus on the innovation.
        </p>
        <div className="sol-cta-section__btns">
          <Link href="/contact" className="sol-cta-section__btn sol-cta-section__btn--primary">
            Book a Consultation
          </Link>
          <Link href="/about" className="sol-cta-section__btn sol-cta-section__btn--outline">
            Company Profile
          </Link>
        </div>
      </motion.section>

      {/* ── Trusted by Visionaries ─────────────────────── */}
      <section className="sol-clients-section">
        <motion.div
          className="sol-clients-section__header"
          initial={rm ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h2 className="sol-clients-section__h2">
            Trusted by <span>Visionaries</span><span className="sol-clients-section__star">”</span>
          </h2>
        </motion.div>
        <div className="sol-clients-section__logos">
          {CLIENTS.map((c, i) => (
            <motion.div
              key={c.name}
              className="sol-client-card"
              initial={rm ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
            >
              <strong className="sol-client-card__name">{c.name}</strong>
              <p className="sol-client-card__quote">"{c.quote}"</p>
              <span className="sol-client-card__stars" aria-label="5 out of 5 stars">☆☆☆☆☆</span>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}
