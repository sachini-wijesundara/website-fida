"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type Season = "None" | "NewYear" | "Christmas" | "Vesak";

// ── Pre-computed stable data (no Math.random in render) ──────────────────────

const SNOWFLAKES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: (i * 5.83) % 100,
  size: 36 + (i * 11) % 44,
  duration: 10 + (i * 3.7) % 14,
  delay: (i * 2.3) % 12,
  opacity: 0.55 + (i * 0.025) % 0.4,
  sway: ((i % 5) - 2) * 3,
}));

const LANTERNS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 4 + (i * 12.3) % 84,
  duration: 22 + (i * 2.9) % 16,
  delay: (i * 2.8) % 16,
  scale: 0.72 + (i * 0.038) % 0.46,
  colorSet: i % 3,
}));

const FLOWERS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  x: (i * 10.7) % 92,
  duration: 13 + (i * 2.1) % 9,
  delay: (i * 1.9) % 11,
  scale: 0.65 + (i * 0.055) % 0.5,
}));

const SWEETS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: (i * 9.3) % 90,
  duration: 14 + (i * 2.3) % 10,
  delay: (i * 2.1) % 12,
  type: i % 2,
}));

const SPARKLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: (i * 3.57) % 97,
  y: (i * 6.13) % 88,
  size: 5 + (i % 4) * 2,
  duration: 2 + (i * 0.31) % 2,
  delay: (i * 0.53) % 6,
}));

const VESAK_PALETTES = [
  { top: "#3B5BDB", topAlt: "#FFD43B", diamond: "#E8450A", diamondInner: "#FF8C42", trim: "#FFD43B" },
  { top: "#5C2D91", topAlt: "#FFD43B", diamond: "#CC1010", diamondInner: "#FF5555", trim: "#FFD43B" },
  { top: "#1864AB", topAlt: "#E67700", diamond: "#2B8A3E", diamondInner: "#69DB7C", trim: "#E67700" },
];

// ── Main Component ────────────────────────────────────────────────────────────

import { seasonalConfig } from "@/config/seasonal-themes";

export default function SeasonalDecor() {
  const [season, setSeason] = useState<Season>("None");
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    if (!seasonalConfig.enabled) {
      setShouldAnimate(false);
      return;
    }

    const now = new Date();
    const start = new Date(seasonalConfig.startAt);
    const end = new Date(seasonalConfig.endAt);
    if (now < start || now > end) {
      setShouldAnimate(false);
      return;
    }

    const isMobile = window.innerWidth < 768;
    if (isMobile && !seasonalConfig.mobileEnabled) {
      setShouldAnimate(false);
      return;
    }

    if (seasonalConfig.respectReducedMotion) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setShouldAnimate(false);
        return;
      }
    }

    async function fetchSeason() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.active_season) setSeason(data.active_season as Season);
      } catch (err) {
        console.error("Failed to fetch season:", err);
      }
    }
    fetchSeason();
  }, []);

  if (!shouldAnimate || season === "None") return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[50]">
      {season === "Christmas" && <ChristmasDecor />}
      {season === "NewYear" && <SinhalaNewYearDecor />}
      {season === "Vesak" && <VesakDecor />}
    </div>
  );
}

// =============================================================================
// CHRISTMAS  — Large snowflakes + animated Santa
// =============================================================================

function SnowflakeSVG({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100" fill="none"
      style={{ opacity, filter: "drop-shadow(0 0 6px rgba(255,255,255,0.85))" }}
    >
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 50 50)`}>
          <line x1="50" y1="8" x2="50" y2="92" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <line x1="50" y1="28" x2="36" y2="20" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="28" x2="64" y2="20" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="42" x2="34" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="42" x2="66" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="10" r="4" fill="white" />
        </g>
      ))}
      <circle cx="50" cy="50" r="8" fill="white" />
    </svg>
  );
}

function SantaSVG() {
  return (
    <svg width="180" height="130" viewBox="0 0 180 130" fill="none">
      {[0, 38].map((ox) => (
        <g key={ox} transform={`translate(${ox},0)`}>
          <ellipse cx="22" cy="72" rx="14" ry="8" fill="#A0714F" />
          <line x1="13" y1="78" x2="10" y2="95" stroke="#7A5230" strokeWidth="3" strokeLinecap="round" />
          <line x1="19" y1="80" x2="17" y2="97" stroke="#7A5230" strokeWidth="3" strokeLinecap="round" />
          <line x1="25" y1="80" x2="27" y2="97" stroke="#7A5230" strokeWidth="3" strokeLinecap="round" />
          <line x1="31" y1="78" x2="34" y2="95" stroke="#7A5230" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="65" x2="22" y2="55" stroke="#A0714F" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="22" cy="50" rx="8" ry="7" fill="#A0714F" />
          <line x1="18" y1="44" x2="10" y2="30" stroke="#7A5230" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="30" x2="5" y2="24" stroke="#7A5230" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="30" x2="13" y2="22" stroke="#7A5230" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="44" x2="34" y2="30" stroke="#7A5230" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="34" y1="30" x2="39" y2="24" stroke="#7A5230" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="30" x2="31" y2="22" stroke="#7A5230" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="49" r="2" fill="#2C1810" />
          {ox === 0 && <circle cx="15" cy="51" r="3" fill="#FF3333" />}
        </g>
      ))}
      <path d="M36 65 Q80 60 95 68" stroke="#DAA520" strokeWidth="2" fill="none" />
      <path d="M36 65 Q55 55 95 68" stroke="#DAA520" strokeWidth="1.5" fill="none" />
      <path d="M88 60 Q100 52 155 56 L162 70 Q125 78 88 70Z" fill="#8B2500" />
      <path d="M86 68 Q125 80 165 72" stroke="#C0392B" strokeWidth="3" fill="none" />
      <path d="M82 76 Q125 88 170 78" stroke="#C0C0C0" strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="95" y1="70" x2="92" y2="78" stroke="#8B2500" strokeWidth="3" />
      <line x1="125" y1="72" x2="123" y2="80" stroke="#8B2500" strokeWidth="3" />
      <line x1="155" y1="70" x2="153" y2="78" stroke="#8B2500" strokeWidth="3" />
      <path d="M90 62 Q122 54 154 58" stroke="#DAA520" strokeWidth="2.5" fill="none" strokeDasharray="4 3" />
      <ellipse cx="98" cy="52" rx="14" ry="16" fill="#8B4513" />
      <ellipse cx="98" cy="38" rx="8" ry="5" fill="#6B3410" />
      <line x1="90" y1="42" x2="106" y2="42" stroke="#DAA520" strokeWidth="1.5" />
      <ellipse cx="132" cy="48" rx="20" ry="18" fill="#CC0000" />
      <rect x="114" y="56" width="38" height="7" rx="2" fill="#1A0A00" />
      <rect x="127" y="55" width="10" height="9" rx="1.5" fill="#DAA520" />
      <circle cx="132" cy="26" r="14" fill="#FFD5A8" />
      <path d="M120 30 Q120 48 132 50 Q144 48 144 30 Q138 36 132 37 Q126 36 120 30Z" fill="white" />
      <path d="M126 32 Q132 36 138 32" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="127" cy="24" r="2.5" fill="#2C1810" />
      <circle cx="137" cy="24" r="2.5" fill="#2C1810" />
      <circle cx="132" cy="29" r="3" fill="#E8967A" />
      <path d="M120 18 L128 -4 L144 18Z" fill="#CC0000" />
      <rect x="118" y="16" width="28" height="6" rx="3" fill="white" />
      <circle cx="128" cy="-2" r="4" fill="white" />
      <path d="M113 46 Q104 56 110 62" stroke="#CC0000" strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="110" cy="64" rx="5" ry="4" fill="#FFD5A8" />
    </svg>
  );
}

function ChristmasDecor() {
  return (
    <>
      <motion.div
        initial={{ x: "110vw", y: "8vh" }}
        animate={{ x: "-20vw" }}
        transition={{ duration: 18, repeat: Infinity, repeatDelay: 10, ease: "linear" }}
        className="absolute top-0 left-0"
      >
        <SantaSVG />
      </motion.div>

      {SNOWFLAKES.map((sf) => (
        <motion.div
          key={sf.id}
          initial={{ y: -100, x: sf.x + "vw" }}
          animate={{
            y: "110vh",
            x: [sf.x + "vw", (sf.x + sf.sway) + "vw", sf.x + "vw"],
          }}
          transition={{
            y: { duration: sf.duration, repeat: Infinity, ease: "linear", delay: sf.delay },
            x: { duration: sf.duration / 2, repeat: Infinity, ease: "easeInOut", delay: sf.delay },
          }}
          style={{ position: "absolute", top: 0 }}
        >
          <SnowflakeSVG size={sf.size} opacity={sf.opacity} />
        </motion.div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-100/20 to-transparent" />
    </>
  );
}

// =============================================================================
// SINHALA & TAMIL NEW YEAR  — Erabadu flowers, Kavum, Kokis, Asian Koel
// =============================================================================

/** Erabadu (Erythrina variegata) — curved claw-like tubular red petals + round veined leaves */
function ErabaduFlowerSVG({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      width={88 * scale} height={96 * scale} viewBox="0 0 88 96" fill="none"
      style={{ filter: "drop-shadow(0 0 8px rgba(200,10,40,0.45))" }}
    >
      {/* Main stem */}
      <path d="M44 92 Q42 74 40 58" stroke="#4A2800" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Round leaves with veins */}
      {([
        { cx: 22, cy: 70, rx: 18, ry: 14, rot: -35 },
        { cx: 64, cy: 66, rx: 16, ry: 13, rot: 30 },
        { cx: 16, cy: 52, rx: 15, ry: 12, rot: -50 },
        { cx: 68, cy: 50, rx: 14, ry: 11, rot: 45 },
        { cx: 38, cy: 82, rx: 14, ry: 11, rot: -10 },
      ] as { cx: number; cy: number; rx: number; ry: number; rot: number }[]).map((l, i) => (
        <g key={i} transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}>
          <ellipse cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} fill="#4CAF50" />
          <ellipse cx={l.cx} cy={l.cy} rx={l.rx * 0.58} ry={l.ry * 0.58} fill="#66BB6A" opacity="0.45" />
          <line x1={l.cx - l.rx * 0.72} y1={l.cy} x2={l.cx + l.rx * 0.72} y2={l.cy}
            stroke="#81C784" strokeWidth="0.9" opacity="0.7" />
          <line x1={l.cx} y1={l.cy - l.ry * 0.72} x2={l.cx} y2={l.cy + l.ry * 0.72}
            stroke="#81C784" strokeWidth="0.9" opacity="0.7" />
        </g>
      ))}

      {/* Curved tubular petals (Erabadu shape — like red claws) */}
      {/* Up-left */}
      <path d="M42 56 Q28 42 18 28 Q16 22 21 20 Q26 24 28 32 Q33 46 42 56Z" fill="#CC0000" />
      <path d="M42 56 Q29 43 20 30 Q18 24 22 22 Q24 26 26 33 Q31 47 42 56Z" fill="#FF1744" opacity="0.32" />
      {/* Straight up */}
      <path d="M44 54 Q40 38 39 22 Q39 16 44 16 Q49 16 48 22 Q46 38 44 54Z" fill="#CC0000" />
      <path d="M44 54 Q41 39 40 24 Q40 18 44 18 Q45 20 45 26 Q44 40 44 54Z" fill="#FF1744" opacity="0.32" />
      {/* Up-right */}
      <path d="M46 56 Q58 42 68 28 Q71 22 66 20 Q61 24 59 32 Q54 46 46 56Z" fill="#CC0000" />
      <path d="M46 56 Q57 43 66 30 Q68 24 64 22 Q62 26 60 33 Q55 47 46 56Z" fill="#FF1744" opacity="0.32" />
      {/* Right */}
      <path d="M47 60 Q62 56 72 48 Q77 43 74 39 Q69 42 65 48 Q56 56 47 60Z" fill="#AA0000" />
      {/* Down-left */}
      <path d="M41 62 Q30 66 22 72 Q18 76 21 79 Q26 77 30 72 Q36 66 41 62Z" fill="#AA0000" />

      {/* Small secondary bud branch */}
      <path d="M56 62 Q68 55 76 50" stroke="#4A2800" strokeWidth="2" fill="none" />
      <path d="M73 48 Q78 43 75 40 Q72 43 71 48Z" fill="#CC0000" />
      <path d="M76 46 Q80 41 77 38 Q74 41 73 46Z" fill="#BB0000" />

      {/* Calyx / centre */}
      <ellipse cx="44" cy="58" rx="7" ry="6" fill="#5C0000" />
      <ellipse cx="44" cy="58" rx="4" ry="3.5" fill="#880000" />
    </svg>
  );
}

/** Kavum — traditional Sri Lankan oil cake (deep-fried, dark, oval-diamond) */
function KavumSVG() {
  return (
    <svg width="52" height="60" viewBox="0 0 52 60" fill="none"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.42))" }}
    >
      <path d="M26 3 Q42 16 44 30 Q42 44 26 57 Q10 44 8 30 Q10 16 26 3Z" fill="#3E1F00" />
      <path d="M26 8 Q39 19 40 30 Q38 42 26 52 Q14 42 12 30 Q14 19 26 8Z" fill="#6B3200" />
      <path d="M26 10 Q36 19 37 28 Q26 16 18 22 Q19 14 26 10Z" fill="#8B4500" opacity="0.5" />
      <path d="M18 24 Q26 20 34 24" stroke="#5A2800" strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d="M16 30 Q26 26 36 30" stroke="#5A2800" strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d="M18 36 Q26 32 34 36" stroke="#5A2800" strokeWidth="1.2" fill="none" opacity="0.55" />
      <circle cx="26" cy="30" r="5.5" fill="#2E1600" />
      <circle cx="26" cy="30" r="2.5" fill="#1A0A00" />
    </svg>
  );
}

/** Kokis — traditional rosette crispy cookie (flower shape, golden-brown) */
function KokisSVG() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 28 28)`}>
          <ellipse cx="28" cy="15" rx="6.5" ry="11" fill={i % 2 === 0 ? "#C8750A" : "#DAA020"} />
          <line x1="28" y1="18" x2="28" y2="10" stroke="#A05808" strokeWidth="0.8" opacity="0.6" />
        </g>
      ))}
      <circle cx="28" cy="28" r="9.5" fill="#B06008" />
      <circle cx="28" cy="28" r="5" fill="#6B3800" />
      <circle cx="28" cy="28" r="2.5" fill="#3A1E00" />
      {[0, 72, 144, 216, 288].map((a, i) => (
        <circle
          key={i}
          cx={28 + Math.cos(a * Math.PI / 180) * 6.5}
          cy={28 + Math.sin(a * Math.PI / 180) * 6.5}
          r="1.2" fill="#8B4A00" opacity="0.7"
        />
      ))}
    </svg>
  );
}

/** Asian Koel (Koha) — glossy black body, vivid red eye, long tail */
function AsianKoelSVG({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      width="90" height="65" viewBox="0 0 90 65" fill="none"
      style={{ transform: flipped ? "scaleX(-1)" : undefined }}
    >
      {/* Branch */}
      <path d="M0 52 Q45 47 90 50" stroke="#5C3317" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Tail */}
      <path d="M65 40 Q74 44 82 56 Q70 52 65 46 Q66 43 65 40Z" fill="#111" />
      <path d="M63 41 Q72 43 79 53 Q68 50 63 45Z" fill="#222" />
      {/* Body */}
      <ellipse cx="44" cy="39" rx="22" ry="13" fill="#181818" />
      <path d="M28 35 Q44 30 62 37" stroke="#333" strokeWidth="2.5" fill="none" />
      {/* Neck */}
      <path d="M26 34 Q21 27 23 20" stroke="#181818" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Head */}
      <circle cx="21" cy="17" r="11" fill="#181818" />
      {/* Red eye (signature feature of Asian Koel) */}
      <circle cx="25" cy="14" r="4.5" fill="#CC0000" />
      <circle cx="26" cy="13" r="2" fill="#880000" />
      <circle cx="26.5" cy="12.5" r="0.8" fill="white" />
      {/* Beak */}
      <path d="M32 15 Q42 13 40 17 Q37 19 32 17Z" fill="#888" />
      <path d="M32 15 Q41 14 39 16 Q37 17 32 16Z" fill="#AAA" />
      {/* Feet */}
      {([[38, 48], [47, 48]] as [number, number][]).map(([fx, fy], fi) => (
        <g key={fi}>
          <line x1={fx} y1={fy - 2} x2={fx - 1} y2={fy + 4} stroke="#666" strokeWidth="1.8" strokeLinecap="round" />
          <line x1={fx - 1} y1={fy + 4} x2={fx - 6} y2={fy + 7} stroke="#666" strokeWidth="1.4" strokeLinecap="round" />
          <line x1={fx - 1} y1={fy + 4} x2={fx - 1} y2={fy + 8} stroke="#666" strokeWidth="1.4" strokeLinecap="round" />
          <line x1={fx - 1} y1={fy + 4} x2={fx + 4} y2={fy + 7} stroke="#666" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

function SinhalaNewYearDecor() {
  return (
    <>
      {/* Warm golden glow */}
      <div
        className="absolute top-0 left-0 right-0 h-44"
        style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(255,185,0,0.22) 0%, transparent 72%)" }}
      />

      {/* Perched Koel — bottom-left */}
      <motion.div
        className="absolute"
        style={{ bottom: "14%", left: "2%" }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <AsianKoelSVG />
      </motion.div>

      {/* Perched Koel — bottom-right (mirrored) */}
      <motion.div
        className="absolute"
        style={{ bottom: "12%", right: "4%" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <AsianKoelSVG flipped />
      </motion.div>

      {/* Flying Koel crosses screen every ~32s */}
      <motion.div
        className="absolute"
        style={{ top: "22%" }}
        initial={{ x: "-15vw" }}
        animate={{ x: "115vw" }}
        transition={{ duration: 10, repeat: Infinity, repeatDelay: 22, ease: "easeInOut" }}
      >
        <AsianKoelSVG />
      </motion.div>

      {/* Floating Erabadu flowers */}
      {FLOWERS.map((fl) => (
        <motion.div
          key={fl.id}
          initial={{ y: "106vh", x: fl.x + "vw", opacity: 0 }}
          animate={{
            y: "-14vh",
            opacity: [0, 1, 1, 0],
            rotate: [0, fl.id % 2 === 0 ? 6 : -6, 0],
          }}
          transition={{ duration: fl.duration, repeat: Infinity, ease: "easeInOut", delay: fl.delay }}
          style={{ position: "absolute" }}
        >
          <ErabaduFlowerSVG scale={fl.scale} />
        </motion.div>
      ))}

      {/* Floating Kavum & Kokis */}
      {SWEETS.map((sw) => (
        <motion.div
          key={sw.id}
          initial={{ y: "106vh", x: sw.x + "vw", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.92, 0.92, 0],
            rotate: [0, sw.type === 0 ? 12 : -18, 0],
          }}
          transition={{ duration: sw.duration, repeat: Infinity, ease: "easeInOut", delay: sw.delay }}
          style={{ position: "absolute" }}
        >
          {sw.type === 0 ? <KavumSVG /> : <KokisSVG />}
        </motion.div>
      ))}

      {/* Gold sparkles */}
      {SPARKLES.map((sp) => (
        <motion.div
          key={sp.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
          transition={{ duration: sp.duration, repeat: Infinity, delay: sp.delay }}
          style={{
            position: "absolute",
            left: sp.x + "%",
            top: sp.y + "%",
            width: sp.size,
            height: sp.size,
            borderRadius: "50%",
            background: "#FFD700",
            boxShadow: "0 0 10px #FFD700, 0 0 4px #FFF9",
          }}
        />
      ))}
    </>
  );
}

// =============================================================================
// VESAK  — Authentic cube vesak koodu matching reference photo
// =============================================================================

/** Pyramid-top cube lantern with coloured diamond panel and long cream tassels */
function VesakKooduSVG({ colorSet }: { colorSet: number }) {
  const c = VESAK_PALETTES[colorSet];
  const TASSEL_COUNT = 16;

  return (
    <svg
      width="110" height="240" viewBox="0 0 110 240" fill="none"
      style={{ filter: `drop-shadow(0 0 20px ${c.diamond}99)` }}
    >
      <defs>
        <radialGradient id={`cg${colorSet}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEF88" stopOpacity="1" />
          <stop offset="100%" stopColor={c.diamond} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Hanging string */}
      <line x1="55" y1="0" x2="55" y2="16" stroke="#9B7722" strokeWidth="2" />

      {/* Pyramid top */}
      <polygon points="55,16 20,46 55,54" fill={c.top} />
      <polygon points="55,16 90,46 55,54" fill={c.topAlt} />
      <polygon points="55,16 20,46 24,58 55,54" fill={c.top} opacity="0.65" />
      <polygon points="55,16 90,46 86,58 55,54" fill={c.topAlt} opacity="0.65" />
      <line x1="20" y1="46" x2="90" y2="46" stroke="#FFD700" strokeWidth="1.5" opacity="0.55" />

      {/* Cube body */}
      <rect x="20" y="46" width="70" height="70" fill={c.top} />
      <polygon points="90,46 104,58 104,128 90,116" fill={c.top} opacity="0.4" />
      <polygon points="20,46 55,54 90,46 55,38" fill={c.topAlt} opacity="0.72" />

      {/* Diamond centrepiece */}
      <polygon points="55,54 80,81 55,108 30,81" fill={c.diamond} />
      <polygon points="55,60 75,81 55,102 35,81" fill={c.diamondInner} opacity="0.65" />

      {/* Candle glow */}
      <circle cx="55" cy="81" r="18" fill={`url(#cg${colorSet})`} />
      <circle cx="55" cy="81" r="7" fill="#FFE566" opacity="0.98" />
      <circle cx="55" cy="81" r="3" fill="white" opacity="0.8" />

      {/* Corner dots */}
      {([[20, 46], [90, 46], [20, 116], [90, 116]] as [number, number][]).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#FFD700" />
      ))}

      {/* Trim bars */}
      <rect x="18" y="43" width="74" height="5" rx="2.5" fill="#FFD700" />
      <rect x="18" y="113" width="74" height="5" rx="2.5" fill="#FFD700" />

      {/* Fringe bar */}
      <rect x="16" y="116" width="78" height="9" rx="4" fill="#E8C96A" />

      {/* Long cream tassels — like the photo */}
      {Array.from({ length: TASSEL_COUNT }, (_, i) => {
        const tx = 20 + i * (70 / (TASSEL_COUNT - 1));
        const len = 82 + (i % 5) * 14;
        const wave = ((i % 4) - 1.5) * 4;
        return (
          <path
            key={i}
            d={`M${tx} 125 Q${tx + wave * 0.4} ${125 + len * 0.5} ${tx + wave} ${125 + len}`}
            stroke={i % 3 === 0 ? "#F0DDAA" : "#F5E8C8"}
            strokeWidth={i % 2 === 0 ? 2.4 : 1.8}
            strokeLinecap="round"
            opacity={0.78 + (i % 3) * 0.07}
            fill="none"
          />
        );
      })}
    </svg>
  );
}

function VesakDecor() {
  return (
    <>
      {/* Amber glow overhead */}
      <div
        className="absolute top-0 left-0 right-0 h-56"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,160,0,0.18) 0%, transparent 70%)" }}
      />

      {/* Floating lanterns */}
      {LANTERNS.map((ln) => (
        <motion.div
          key={ln.id}
          initial={{ y: "110vh", x: ln.x + "vw", opacity: 0 }}
          animate={{
            y: "-22vh",
            opacity: [0, 1, 1, 0],
            x: [ln.x + "vw", (ln.x + 2.2) + "vw", ln.x + "vw"],
          }}
          transition={{ duration: ln.duration, repeat: Infinity, ease: "easeInOut", delay: ln.delay }}
          style={{
            position: "absolute",
            transformOrigin: "top center",
            transform: `scale(${ln.scale})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -22,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${VESAK_PALETTES[ln.colorSet].diamond}44 0%, transparent 70%)`,
            }}
          />
          <VesakKooduSVG colorSet={ln.colorSet} />
        </motion.div>
      ))}

      {/* Fireflies */}
      {Array.from({ length: 22 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.75, 0] }}
          transition={{ duration: 3 + (i * 0.37) % 3, repeat: Infinity, delay: (i * 0.71) % 9 }}
          style={{
            position: "absolute",
            left: ((i * 4.63) % 97) + "%",
            top: ((i * 6.37) % 90) + "%",
            width: 5, height: 5,
            borderRadius: "50%",
            background: "#FFE566",
            boxShadow: "0 0 10px #FFD700, 0 0 4px #FFF8",
          }}
        />
      ))}
    </>
  );
}