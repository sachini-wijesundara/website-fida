"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import SeasonalDecor from "@/components/animations/seasonal-decor";

const DottedGlobe = dynamic(() => import("./dotted-globe"), {
  ssr: false,
  loading: () => <div className="hero-globe" />,
});

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 22,
    mass: 0.2,
    restDelta: 0.001,
  });
  const copyY = useTransform(smoothProgress, [0, 0.42], [0, -190]);
  const copyOpacity = useTransform(smoothProgress, [0, 0.32], [1, 0]);
  const sceneY = useTransform(smoothProgress, [0, 0.55], [0, -640]);
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
          style={reduceMotion ? undefined : { y: sceneY }}
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
            GLOBAL <span>Enterprise</span>
            <br />
            Optimum
          </h1>

          <p className="home-hero__intro">
            Empowering organizations worldwide with intelligent HRIS technology from Sri Lanka, global expertise,
            and sustainable solutions built for optimum performance.
          </p>

          <div className="home-hero__actions">
            <Link href="/solutions" className="hero-button hero-button--primary">
              Explore solutions
              <ArrowUpRight size={17} />
            </Link>
            <Link
              href="/contact"
              className="hero-button hero-button--secondary"
            >
              Contact us
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
