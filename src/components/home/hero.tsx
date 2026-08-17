"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import SeasonalDecor from "@/components/animations/seasonal-decor";

const dots = Array.from({ length: 13 * 21 }, (_, index) => {
  const row = Math.floor(index / 21);
  const column = index % 21;
  const x = (column - 10) / 10;
  const y = (row - 6) / 6;
  const inside = x * x + y * y < 0.94;
  const longitude = Math.sin(column * 1.63 + row * 0.71) > -0.18;
  const latitude = Math.cos(row * 1.8 - column * 0.21) > -0.48;
  return { index, row, column, visible: inside && longitude && latitude };
});

function DottedGlobe() {
  return (
    <div
      aria-hidden="true"
      className="hero-globe"
    >
      <div className="hero-globe__dots">
        {dots.map((dot) =>
          dot.visible ? (
            <span
              key={dot.index}
              style={{ left: `${dot.column * 5}%`, top: `${dot.row * 8}%` }}
            />
          ) : null,
        )}
      </div>
      <div className="hero-globe__shine" />
    </div>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 24,
    mass: 0.38,
    restDelta: 0.001,
  });
  const copyY = useTransform(smoothProgress, [0, 0.42], [0, -190]);
  const copyOpacity = useTransform(smoothProgress, [0, 0.32], [1, 0]);
  const sceneScale = useTransform(smoothProgress, [0, 0.58], [1, 1.07]);
  const sceneY = useTransform(smoothProgress, [0.06, 0.58], [0, -640]);
  const cueOpacity = useTransform(smoothProgress, [0, 0.18], [1, 0]);
  const colorOpacity = useTransform(smoothProgress, [0.08, 0.62], [0, 1]);

  return (
    <section ref={stageRef} className="home-hero-stage">
      <div className="home-hero">
        <SeasonalDecor />
        <motion.div
          className="home-hero__color-shift"
          style={reduceMotion ? { opacity: 0 } : { opacity: colorOpacity }}
        />
        <motion.div
          className="home-hero__scene"
          style={reduceMotion ? undefined : { scale: sceneScale, y: sceneY }}
        >
          <div className="home-hero__wash home-hero__wash--left" />
          <div className="home-hero__wash home-hero__wash--right" />
          <div className="home-hero__arc" />
          <DottedGlobe />
        </motion.div>

        <motion.div
          className="home-hero__content"
          style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
        >
        <p className="home-hero__eyebrow">
          <span />
          Business partner for success and beyond
        </p>

        <h1>
          Enterprise <span>GLOBAL</span>
          <br />
          Optimum
        </h1>

        <p className="home-hero__intro">
          Empowering organizations with intelligent technology, global expertise,
          and sustainable solutions built for optimum performance.
        </p>

        <div className="home-hero__actions">
          <Link href="/solutions" className="hero-button hero-button--primary">
            Explore solutions
            <ArrowUpRight size={17} />
          </Link>
          <Link
            href="https://www.fidaglobal.com/FIDAGlobalProfile2024.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-button hero-button--secondary"
          >
            Company profile
          </Link>
        </div>
        </motion.div>

        <motion.div
          className="home-hero__foot"
          style={reduceMotion ? undefined : { opacity: cueOpacity }}
        >
          <p>Technology that moves business forward.</p>
          <a href="#home-content" aria-label="Scroll to explore">
            Scroll to explore <ArrowDown size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
