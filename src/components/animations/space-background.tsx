"use client";

import React, { useEffect, useRef } from "react";

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Dot {
  x: number; y: number; baseX: number; baseY: number;
  r: number; baseAlpha: number; alpha: number;
  twinkleSpeed: number; twinklePhase: number;
  color: [number, number, number]; parallaxFactor: number;
}
interface Orbit {
  cx: number; cy: number; rx: number; ry: number;
  angle: number; speed: number; r: number; color: string;
  moonAngle: number; moonSpeed: number; moonR: number;
  hasMoon: boolean; hasRing: boolean; ringColor: string;
  atmosphereColor?: string; craterCount?: number;
}
interface Streak {
  x: number; y: number; baseX: number; baseY: number;
  len: number; angle: number; alpha: number; speed: number;
  active: boolean; timer: number; cooldown: number;
  maxCooldown: number; color: string; parallaxFactor: number;
}
interface ConLine { x1p: number; y1p: number; x2p: number; y2p: number; }
interface ConDot { xp: number; yp: number; parallaxFactor: number; }
interface DustPt {
  x: number; y: number; baseX: number; baseY: number;
  r: number; alpha: number; vx: number; vy: number; parallaxFactor: number;
}
interface Comet {
  x: number; y: number; vx: number; vy: number;
  tailLength: number; active: boolean; respawnTimer: number;
}
interface Nebula {
  x: number; y: number; baseX: number; baseY: number;
  r: number; c: string; a: number; pulseSpeed: number; parallaxFactor: number;
}

// ─── Build scene data (once) ──────────────────────────────────────────────────
function buildScene(W: number, H: number) {
  const R = rng(42);
  const cx = W / 2, cy = H / 2;

  const palette: Array<[number, number, number]> = [
    [255, 255, 255], [200, 225, 255], [255, 220, 190],
    [200, 255, 215], [255, 210, 255], [255, 240, 170],
  ];

  // Reduced star count
  const stars: Dot[] = Array.from({ length: 180 }, () => {
    const base = 0.15 + R() * 0.75;
    const x = R() * W, y = R() * H;
    return {
      x, y, baseX: x, baseY: y,
      r: R() * 2.0 + 0.3,
      baseAlpha: base, alpha: base,
      twinkleSpeed: 0.003 + R() * 0.012,
      twinklePhase: R() * Math.PI * 2,
      color: palette[Math.floor(R() * palette.length)],
      parallaxFactor: 0.02 + R() * 0.07,
    };
  });

  const orbitDefs = [
    { rx: 140, ry: 40,  speed: 0.0006,  r: 5, color: "#60a5fa", atmosphereColor: "rgba(96,165,250,0.3)",  moonR: 2, hasMoon: true,  hasRing: false, ringColor: "", craterCount: 0 },
    { rx: 210, ry: 60,  speed: 0.0004,  r: 7, color: "#34d399", atmosphereColor: "rgba(52,211,153,0.25)", moonR: 2, hasMoon: true,  hasRing: false, ringColor: "", craterCount: 3 },
    { rx: 290, ry: 82,  speed: 0.00025, r: 9, color: "#fb923c", atmosphereColor: "",                      moonR: 0, hasMoon: false, hasRing: true,  ringColor: "#fbbf24", craterCount: 0 },
    { rx: 370, ry: 105, speed: 0.00015, r: 5, color: "#94a3b8", atmosphereColor: "",                      moonR: 2, hasMoon: true,  hasRing: false, ringColor: "", craterCount: 4 },
    { rx: 450, ry: 128, speed: 0.0001,  r: 7, color: "#67e8f9", atmosphereColor: "rgba(103,232,249,0.2)", moonR: 0, hasMoon: false, hasRing: true,  ringColor: "#22d3ee", craterCount: 0 },
  ];
  const orbits: Orbit[] = orbitDefs.map((o, i) => ({
    cx, cy, rx: o.rx, ry: o.ry,
    angle: (i / orbitDefs.length) * Math.PI * 2,
    speed: o.speed * (i % 2 === 0 ? 1 : -1),
    r: o.r, color: o.color, atmosphereColor: o.atmosphereColor,
    moonAngle: R() * Math.PI * 2, moonSpeed: 0.006, moonR: o.moonR,
    hasMoon: o.hasMoon, hasRing: o.hasRing, ringColor: o.ringColor,
    craterCount: o.craterCount,
  }));

  const streakColors = ["rgba(255,255,255,", "rgba(200,240,255,", "rgba(255,220,200,"];
  const streaks: Streak[] = Array.from({ length: 7 }, (_, i) => ({
    x: 0, y: 0, baseX: 0, baseY: 0,
    len: 80 + R() * 140, angle: 0.38 + R() * 0.35,
    alpha: 0, speed: 5 + R() * 10,
    active: false, timer: 0, cooldown: 0,
    maxCooldown: 150 + i * 80 + R() * 350,
    color: streakColors[Math.floor(R() * streakColors.length)],
    parallaxFactor: 0.03 + R() * 0.05,
  }));

  const constellations = [
    [[0.08,0.12],[0.11,0.08],[0.15,0.14],[0.12,0.18],[0.08,0.12]],
    [[0.72,0.08],[0.76,0.05],[0.8,0.1],[0.77,0.15],[0.73,0.12],[0.72,0.08]],
    [[0.2,0.75],[0.24,0.7],[0.28,0.74],[0.25,0.8]],
    [[0.55,0.22],[0.58,0.18],[0.62,0.24],[0.65,0.2],[0.6,0.28],[0.55,0.22]],
  ];
  const conLines: ConLine[] = [];
  const conDots: ConDot[] = [];
  for (const pts of constellations) {
    for (let i = 0; i < pts.length - 1; i++)
      conLines.push({ x1p: pts[i][0], y1p: pts[i][1], x2p: pts[i+1][0], y2p: pts[i+1][1] });
    for (const p of pts)
      conDots.push({ xp: p[0], yp: p[1], parallaxFactor: 0.01 + R() * 0.03 });
  }

  // Reduced asteroid count
  const R2 = rng(77);
  const asteroids: { x: number; y: number; r: number; alpha: number }[] =
    Array.from({ length: 70 }, (_, i) => {
      const a = (i / 70) * Math.PI * 2 + (R2() - 0.5) * 0.2;
      const dist = 320 + (R2() - 0.5) * 65;
      return { x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist * 0.28, r: 0.4 + R2() * 1.8, alpha: 0.12 + R2() * 0.45 };
    });

  // Reduced dust count
  const R3 = rng(99);
  const dust: DustPt[] = Array.from({ length: 35 }, () => {
    const x = R3() * W, y = R3() * H;
    return {
      x, y, baseX: x, baseY: y,
      r: 0.6 + R3() * 2.2, alpha: 0.04 + R3() * 0.12,
      vx: (R3() - 0.5) * 0.2, vy: (R3() - 0.5) * 0.14,
      parallaxFactor: 0.05 + R3() * 0.12,
    };
  });

  const R4 = rng(123);
  const comets: Comet[] = Array.from({ length: 2 }, () => ({
    x: R4() * W, y: -50,
    vx: (R4() - 0.5) * 2, vy: 1.5 + R4() * 2,
    tailLength: 40 + R4() * 60,
    active: false, respawnTimer: R4() * 600,
  }));

  // Reduced to 3 nebulae, no swirl
  const nebulae: Nebula[] = [
    { x: W*0.08, y: H*0.1,  baseX: W*0.08, baseY: H*0.1,  r: W*0.28, c: "rgba(56,189,248,",  a: 0.05,  pulseSpeed: 0.003,  parallaxFactor: 0.03 },
    { x: W*0.78, y: H*0.55, baseX: W*0.78, baseY: H*0.55, r: W*0.25, c: "rgba(20,184,166,",  a: 0.04,  pulseSpeed: 0.0025, parallaxFactor: 0.025 },
    { x: W*0.5,  y: H*0.08, baseX: W*0.5,  baseY: H*0.08, r: W*0.2,  c: "rgba(139,92,246,", a: 0.032, pulseSpeed: 0.004,  parallaxFactor: 0.04 },
  ];

  return { stars, orbits, streaks, conLines, conDots, asteroids, dust, comets, nebulae, cx, cy };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tickRef = useRef<number>(0);
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    let scene = buildScene(W(), H());
    window.addEventListener("resize", () => { scene = buildScene(W(), H()); });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current = {
        x: ((e.clientX - rect.left) / W() - 0.5) * 2,
        y: ((e.clientY - rect.top)  / H() - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Cache vignette gradient (rebuilt only on resize)
    let vigGrad: CanvasGradient | null = null;
    let vigW = 0, vigH = 0;

    let sunPulse = 0;
    let solarFlareTimer = 0;

    function drawCircle(x: number, y: number, r: number, color: string, alpha: number) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawGlow(x: number, y: number, r: number, color: string, alpha: number) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawOrbitEllipse(cx: number, cy: number, rx: number, ry: number) {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = "rgba(148,163,184,1)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function frame() {
      tickRef.current++;
      const t = tickRef.current;

      // ~30 fps
      if (t % 2 !== 0) { frameRef.current = requestAnimationFrame(frame); return; }

      const w = W(), h = H();

      // Smooth mouse
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.05;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.05;
      const mouseX = currentMouseRef.current.x;
      const mouseY = currentMouseRef.current.y;

      ctx.fillStyle = "#010610";
      ctx.fillRect(0, 0, w, h);

      // ── 1. Nebulae (no ctx.filter blur — use large soft gradient instead) ──
      for (const n of scene.nebulae) {
        const pulse = Math.sin(t * n.pulseSpeed + n.baseX * 0.01) * 0.012 + n.a;
        n.x = n.baseX - mouseX * n.parallaxFactor * 50;
        n.y = n.baseY - mouseY * n.parallaxFactor * 50;

        ctx.save();
        ctx.globalAlpha = 1;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0,   n.c + pulse + ")");
        g.addColorStop(0.5, n.c + pulse * 0.4 + ")");
        g.addColorStop(1,   "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── 2. Constellation lines ──
      ctx.save();
      ctx.strokeStyle = "rgba(200,220,255,0.18)";
      ctx.lineWidth = 0.6;
      ctx.setLineDash([3, 5]);
      for (const l of scene.conLines) {
        const x1 = l.x1p * w - mouseX * 0.02 * 20;
        const y1 = l.y1p * h - mouseY * 0.02 * 20;
        const x2 = l.x2p * w - mouseX * 0.02 * 20;
        const y2 = l.y2p * h - mouseY * 0.02 * 20;
        ctx.globalAlpha = 0.12 + Math.sin(t * 0.008 + l.x1p * 10) * 0.06;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      for (const d of scene.conDots) {
        const pulse = 0.55 + Math.sin(t * 0.01 + d.xp * 20) * 0.35;
        const dx = d.xp * w - mouseX * d.parallaxFactor * 40;
        const dy = d.yp * h - mouseY * d.parallaxFactor * 40;
        drawGlow(dx, dy, 5, "rgba(210,230,255,1)", pulse * 0.25);
        drawCircle(dx, dy, 1.6, "rgba(210,230,255,1)", pulse);
      }

      // ── 3. Stars ──
      for (const s of scene.stars) {
        s.x = s.baseX - mouseX * s.parallaxFactor * 100;
        s.y = s.baseY - mouseY * s.parallaxFactor * 100;
        s.alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * (s.baseAlpha * 0.5);

        ctx.save();
        ctx.globalAlpha = Math.max(0.05, s.alpha);
        ctx.fillStyle = `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (s.r > 1.5) {
          drawGlow(s.x, s.y, s.r * 4, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},1)`, s.alpha * 0.2);
        }

        // Cross-flare only for largest stars
        if (s.r > 1.9 && s.alpha > 0.65) {
          ctx.save();
          ctx.globalAlpha = s.alpha * 0.25;
          ctx.strokeStyle = `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`;
          ctx.lineWidth = 0.5;
          const fl = s.r * 3;
          ctx.beginPath();
          ctx.moveTo(s.x - fl, s.y); ctx.lineTo(s.x + fl, s.y);
          ctx.moveTo(s.x, s.y - fl); ctx.lineTo(s.x, s.y + fl);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ── 4. Floating dust ──
      for (const d of scene.dust) {
        d.baseX += d.vx; d.baseY += d.vy;
        if (d.baseX < 0) d.baseX = w; if (d.baseX > w) d.baseX = 0;
        if (d.baseY < 0) d.baseY = h; if (d.baseY > h) d.baseY = 0;
        d.x = d.baseX - mouseX * d.parallaxFactor * 80;
        d.y = d.baseY - mouseY * d.parallaxFactor * 80;
        drawCircle(d.x, d.y, d.r, "rgba(180,210,255,1)", d.alpha);
      }

      // ── 5. Orbit ellipses ──
      const { cx: baseCx, cy: baseCy } = scene;
      const cx = baseCx - mouseX * 0.01 * 15;
      const cy = baseCy - mouseY * 0.01 * 15;
      for (const o of scene.orbits) { o.cx = cx; o.cy = cy; drawOrbitEllipse(cx, cy, o.rx, o.ry); }
      drawOrbitEllipse(cx, cy, 320, 90);

      // ── 6. Asteroids ──
      for (const a of scene.asteroids) {
        const ax = a.x - mouseX * 0.015 * 20;
        const ay = a.y - mouseY * 0.015 * 20;
        drawCircle(ax, ay, a.r, "rgba(148,163,184,1)", a.alpha);
      }

      // ── 7. Sun ──
      sunPulse = Math.sin(t * 0.025) * 0.15 + 0.85;
      drawGlow(cx, cy, 120 * sunPulse, "rgba(251,191,36,1)", 0.05);
      drawGlow(cx, cy,  60 * sunPulse, "rgba(251,191,36,1)", 0.1);
      drawGlow(cx, cy,  28 * sunPulse, "rgba(253,224,71,1)", 0.5);
      drawCircle(cx, cy, 11 * sunPulse, "#fef08a", 1);

      solarFlareTimer++;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + t * 0.003;
        const len = 20 + Math.sin(t * 0.02 + i) * 9;
        ctx.save();
        ctx.globalAlpha = 0.15 + Math.sin(t * 0.018 + i * 0.5) * 0.08;
        ctx.strokeStyle = "rgba(253,224,71,1)";
        ctx.lineWidth = i % 2 === 0 ? 1.8 : 1.1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 13 * sunPulse, cy + Math.sin(a) * 13 * sunPulse);
        ctx.lineTo(cx + Math.cos(a) * (13 + len),    cy + Math.sin(a) * (13 + len));
        ctx.stroke();
        ctx.restore();
      }

      // ── 8. Orbit planets ──
      for (const o of scene.orbits) {
        o.angle += o.speed;
        const px = o.cx + Math.cos(o.angle) * o.rx;
        const py = o.cy + Math.sin(o.angle) * o.ry;

        if (o.atmosphereColor) drawGlow(px, py, o.r * 3, o.atmosphereColor, 0.35);

        if (o.hasRing) {
          ctx.save();
          ctx.globalAlpha = 0.32;
          ctx.strokeStyle = o.ringColor;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.ellipse(px, py, o.r * 2.2, o.r * 0.55, o.angle + 0.4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        drawGlow(px, py, o.r * 4.5, o.color, 0.25);
        drawCircle(px, py, o.r, o.color, 1);

        if (o.craterCount && o.craterCount > 0) {
          ctx.save();
          ctx.globalAlpha = 0.22;
          ctx.fillStyle = "rgba(0,0,0,0.4)";
          for (let i = 0; i < o.craterCount; i++) {
            const ca = (i / o.craterCount) * Math.PI * 2 + o.angle;
            ctx.beginPath();
            ctx.arc(px + Math.cos(ca) * o.r * 0.5, py + Math.sin(ca) * o.r * 0.5, o.r * 0.14, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Highlight
        drawCircle(px - o.r * 0.3, py - o.r * 0.3, o.r * 0.3, "rgba(255,255,255,1)", 0.35);

        if (o.hasMoon && o.moonR > 0) {
          o.moonAngle += o.moonSpeed;
          const md = o.r * 2.8;
          const mx2 = px + Math.cos(o.moonAngle) * md;
          const my2 = py + Math.sin(o.moonAngle) * md * 0.5;
          drawGlow(mx2, my2, o.moonR * 2.5, "rgba(203,213,225,0.5)", 0.25);
          drawCircle(mx2, my2, o.moonR, "rgba(203,213,225,1)", 0.85);
        }
      }

      // ── 9. Comets ──
      for (const c of scene.comets) {
        if (!c.active) {
          c.respawnTimer++;
          if (c.respawnTimer > 600) {
            c.active = true; c.respawnTimer = 0;
            c.x = Math.random() * w; c.y = -50;
            c.vx = (Math.random() - 0.5) * 2; c.vy = 1.5 + Math.random() * 2;
          }
        } else {
          c.x += c.vx; c.y += c.vy;
          if (c.y > h + 100) { c.active = false; continue; }

          ctx.save();
          const tg = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 20, c.y - c.vy * 20);
          tg.addColorStop(0, "rgba(200,220,255,0.7)");
          tg.addColorStop(0.5, "rgba(150,200,255,0.3)");
          tg.addColorStop(1, "transparent");
          ctx.strokeStyle = tg;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x - c.vx * c.tailLength, c.y - c.vy * c.tailLength);
          ctx.stroke();
          ctx.restore();
          drawGlow(c.x, c.y, 10, "rgba(200,240,255,1)", 0.6);
          drawCircle(c.x, c.y, 2.5, "rgba(230,245,255,1)", 1);
        }
      }

      // ── 10. Black hole ──
      const bhX = w * 0.82 - mouseX * 0.02 * 25;
      const bhY = h * 0.18 - mouseY * 0.02 * 25;
      drawGlow(bhX, bhY, 38, "rgba(251,191,36,1)", 0.18);
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.globalAlpha = 0.28 - i * 0.1;
        ctx.strokeStyle = i % 2 === 0 ? "#fbbf24" : "#fb923c";
        ctx.lineWidth = 1.8 - i * 0.4;
        ctx.beginPath();
        ctx.ellipse(bhX, bhY, 28 + i * 6, 7 + i * 2, t * 0.012 + i * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      drawCircle(bhX, bhY, 11, "#000", 1);

      // ── 11. Pulsars (reduced to 2) ──
      const pulsars = [
        { x: w * 0.88, y: h * 0.52, parallax: 0.025 },
        { x: w * 0.31, y: h * 0.87, parallax: 0.03 },
      ];
      for (const [i, p] of pulsars.entries()) {
        const px = p.x - mouseX * p.parallax * 35;
        const py = p.y - mouseY * p.parallax * 35;
        const beat = (Math.sin(t * (0.14 + i * 0.05)) + 1) / 2;
        drawCircle(px, py, 3, "rgb(199,210,254)", beat);
        drawGlow(px, py, 16 + beat * 18, "rgba(129,140,248,1)", beat * 0.35);
        const ring = (t * 0.08 + i * 2) % 1;
        ctx.save();
        ctx.globalAlpha = (1 - ring) * 0.35;
        ctx.strokeStyle = "rgba(199,210,254,1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, ring * 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // ── 12. Wormhole ──
      const whX = w * 0.11 - mouseX * 0.035 * 40;
      const whY = h * 0.64 - mouseY * 0.035 * 40;
      for (const [i, r] of [30, 22, 14, 7].entries()) {
        const spin = t * 0.008 * (i % 2 === 0 ? 1 : -1);
        ctx.save();
        ctx.globalAlpha = 0.3 - i * 0.05;
        ctx.strokeStyle = i % 2 === 0 ? "rgba(139,92,246,1)" : "rgba(56,189,248,1)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(whX, whY, r, spin, spin + Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      drawGlow(whX, whY, 16, "rgba(167,139,250,1)", 0.45 + Math.sin(t * 0.02) * 0.15);
      drawCircle(whX, whY, 4, "rgba(196,181,253,1)", 0.9);

      // ── 13. Shooting streaks ──
      for (const s of scene.streaks) {
        if (!s.active) {
          s.cooldown++;
          if (s.cooldown >= s.maxCooldown) {
            s.active = true; s.cooldown = 0; s.timer = 0;
            s.baseX = Math.random() * w * 0.85;
            s.baseY = Math.random() * h * 0.55;
            s.alpha = 1;
          }
        } else {
          s.timer += s.speed;
          s.alpha = Math.max(0, 1 - s.timer / s.len);
          s.x = s.baseX - mouseX * s.parallaxFactor * 60;
          s.y = s.baseY - mouseY * s.parallaxFactor * 60;

          const ex = s.x + Math.cos(s.angle) * s.timer;
          const ey = s.y + Math.sin(s.angle) * s.timer;

          ctx.save();
          const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.4, s.color + s.alpha * 0.4 + ")");
          grad.addColorStop(1, "rgba(255,255,255," + s.alpha + ")");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey);
          ctx.stroke();
          ctx.restore();

          drawGlow(ex, ey, 7, "rgba(255,255,255,1)", s.alpha * 0.5);
          if (s.alpha <= 0) { s.active = false; s.maxCooldown = 200 + Math.random() * 400; }
        }
      }

      // ── 14. Vignette (cached) ──
      if (!vigGrad || vigW !== w || vigH !== h) {
        vigW = w; vigH = h;
        vigGrad = ctx.createRadialGradient(w/2, h/2, h * 0.2, w/2, h/2, h * 0.95);
        vigGrad.addColorStop(0, "transparent");
        vigGrad.addColorStop(0.7, "rgba(0,2,10,0.3)");
        vigGrad.addColorStop(1,   "rgba(0,2,10,0.85)");
      }
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      frameRef.current = requestAnimationFrame(frame);
    }

    frameRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}