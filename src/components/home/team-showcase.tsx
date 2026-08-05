"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";



const EXPO = [0.86, 0, 0.07, 1] as const;
const SMOOTH = [0.16, 1, 0.3, 1] as const;
const AUTO_INTERVAL = 4500; // ms

export default function TeamShowcase() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("/api/teams");
        if (res.ok) {
          const data = await res.json();
          // Map API data to the component's format
          const formatted = data.map((m: any, idx: number) => ({
            name: m.name,
            role: m.position,
            tag: m.position.split(' ').pop()?.toUpperCase() || "TEAM",
            image: m.image_url || "/team-placeholder.jpg",
            accent: m.accent || (idx % 2 === 0 ? "#76c442" : "#38a3f5"),
            index: (idx + 1).toString().padStart(2, '0')
          }));
          setTeam(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch team:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  const go = useCallback(
    (nextIndex: number) => {
      const dir = nextIndex > active ? 1 : -1;
      setDirection(dir);
      setActive(nextIndex);
    },
    [active]
  );

  /* Auto-advance */
  useEffect(() => {
    if (paused || team.length === 0) return;
    const id = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % team.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [paused, team.length]);

  if (loading) {
    return (
      <section className="h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (team.length === 0) return null;

  const member = team[active];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", background: "var(--bg-base)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Full-bleed background image ───────────────────── */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`bg-${active}`}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 1.1, ease: EXPO }}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
        >
          {/* Blurred Background to fill space */}
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-center blur-3xl opacity-40"
          />
          {/* Main Image fitting the screen */}
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-contain object-center"
            style={{ filter: "brightness(0.6) saturate(0.9)" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlays ─────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(to right, rgba(20,30,48,0.92) 0%, rgba(20,30,48,0.4) 50%, rgba(20,30,48,0.1) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(to top, rgba(20,30,48,1) 0%, transparent 100%)",
        }}
      />

      {/* ── Accent color glow from active member ─────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{
            zIndex: 2,
            background: `radial-gradient(ellipse at 80% 30%, ${member.accent}18 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* ── Large "TEAM" word — top right ─────────────────── */}
      <div
        className="absolute top-0 right-0 pointer-events-none select-none"
        style={{ zIndex: 3 }}
      >
        <span
          className="font-black uppercase tracking-[0.15em]"
          style={{
            fontSize: "clamp(80px, 14vw, 200px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
            lineHeight: 1,
          }}
        >
          TEAM
        </span>
      </div>

      {/* ── Index number ──────────────────────────────────── */}
      <div
        className="absolute top-10 left-10 select-none"
        style={{ zIndex: 5 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={`idx-${active}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: SMOOTH }}
            className="font-black tabular-nums"
            style={{
              fontSize: "clamp(14px, 1.5vw, 18px)",
              color: member.accent,
              letterSpacing: "0.1em",
            }}
          >
            {member.index} / {String(team.length).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Corner crosshair marks ────────────────────────── */}
      {[
        { top: 80, left: 40 },
        { top: 80, right: 40 },
        { bottom: 100, left: 40 },
        { bottom: 100, right: 40 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ zIndex: 4, ...pos }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0 V6 M10 20 V14 M0 10 H6 M20 10 H14"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          </svg>
        </div>
      ))}

      {/* ── Member info — bottom left ─────────────────────── */}
      <div
        className="absolute bottom-0 left-0 p-10 lg:p-16 max-w-2xl"
        style={{ zIndex: 5 }}
      >
        {/* Tag pill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`tag-${active}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.45, ease: SMOOTH }}
            className="flex items-center gap-3 mb-5"
          >
            <span
              className="w-2 h-2 rounded-full block"
              style={{ background: member.accent }}
            />
            <span
              className="text-xs font-black uppercase tracking-[0.35em]"
              style={{ color: member.accent }}
            >
              {member.tag}
            </span>
            <span
              className="h-[1px] w-8 block"
              style={{ background: `${member.accent}60` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Name — big masking reveal */}
        <div className="overflow-hidden mb-3">
          <AnimatePresence mode="wait">
            <motion.h2
              key={`name-${active}`}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-110%" }}
              transition={{ duration: 0.65, ease: EXPO }}
              className="font-black leading-none"
              style={{
                fontSize: "clamp(32px, 5vw, 68px)",
                color: "var(--text-primary)",
              }}
            >
              {member.name}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Role */}
        <div className="overflow-hidden mb-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={`role-${active}`}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-110%" }}
              transition={{ duration: 0.65, ease: EXPO, delay: 0.05 }}
              className="font-semibold uppercase tracking-[0.2em]"
              style={{
                fontSize: "clamp(11px, 1.1vw, 14px)",
                color: "var(--text-secondary)",
              }}
            >
              {member.role}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Thin divider */}
        <motion.div
          key={`line-${active}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: SMOOTH }}
          style={{
            originX: 0,
            height: 1,
            width: 128,
            marginBottom: 40,
            background: `linear-gradient(90deg, ${member.accent}, transparent)`,
          }}
        />

        {/* Navigation dots */}
        <div className="flex items-center gap-3">
          {team.map((m, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to ${m.name}`}
              className="relative group"
            >
              <motion.div
                animate={{
                  width: i === active ? 32 : 6,
                  opacity: i === active ? 1 : 0.35,
                }}
                transition={{ duration: 0.4, ease: SMOOTH }}
                className="h-[2px] rounded-full"
                style={{
                  background:
                    i === active ? member.accent : "var(--grey)",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Auto-progress strip — bottom edge ────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ zIndex: 6, background: "rgba(255,255,255,0.06)" }}
      >
        {!paused && (
          <motion.div
            key={`progress-${active}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTO_INTERVAL / 1000, ease: "linear" }}
            className="h-full"
            style={{
              background: `linear-gradient(90deg, ${member.accent}, #38a3f5)`,
            }}
          />
        )}
      </div>

      {/* ── Prev / Next arrow buttons ─────────────────────── */}
      <div
        className="absolute bottom-10 right-10 lg:right-16 flex items-center gap-4"
        style={{ zIndex: 6 }}
      >
        <button
          onClick={() =>
            go((active - 1 + team.length) % team.length)
          }
          aria-label="Previous"
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-white/40 hover:scale-110 transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M11 4L6 9L11 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() => go((active + 1) % team.length)}
          aria-label="Next"
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-white/40 hover:scale-110 transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M7 4L12 9L7 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Right side thumbnail strip ───────────────────── */}
      <div
        className="absolute right-10 lg:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3"
        style={{ zIndex: 6 }}
      >
        {team.map((m, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="relative overflow-hidden rounded-xl transition-all duration-500"
            style={{
              width: 52,
              height: i === active ? 72 : 52,
              opacity: i === active ? 1 : 0.4,
              border: `1px solid ${i === active ? m.accent + "80" : "rgba(255,255,255,0.1)"}`,
              transform: i === active ? "scale(1.05)" : "scale(1)",
            }}
          >
            <img
              src={m.image}
              alt={m.name}
              className="w-full h-full object-cover object-center"
              style={{ filter: i === active ? "brightness(1)" : "brightness(0.5)" }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
