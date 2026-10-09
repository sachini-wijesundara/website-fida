"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useMemo } from "react";
import SeasonalDecor from "@/components/animations/seasonal-decor";

import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import globeData from "./globe-dots.json";

function InstancedDots() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Set up the instanced mesh once
  useEffect(() => {
    if (!meshRef.current) return;
    
    const matrix = new THREE.Matrix4();
    const radius = 2.0;
    
    globeData.forEach((d, i) => {
      // Apply radius to the normalized coordinates
      matrix.setPosition(d[0] * radius, d[1] * radius, d[2] * radius);
      meshRef.current!.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  // Spin the entire globe group
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const customMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#E5E5E5") }, // Much lighter ash
      },
      vertexShader: `
        varying float vZ;
        void main() {
          vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vZ = worldPos.z;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vZ;
        void main() {
          if (vZ < 0.0) discard;
          // Smoothly fade the dots as they approach the edge (z = 0)
          float alpha = smoothstep(0.0, 1.5, vZ) * 0.9;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
    });
  }, []);

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, globeData.length]} material={customMaterial}>
        <circleGeometry args={[0.009, 5]} />
      </instancedMesh>
    </group>
  );
}

function DottedGlobe() {
  return (
    <div className="hero-globe">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        style={{ background: 'transparent', pointerEvents: 'none' }}
        dpr={[1, 1.25]}
        gl={{ 
          powerPreference: "high-performance", 
          antialias: false, 
          alpha: true,
          depth: false,
          stencil: false,
          precision: "mediump"
        }}
        performance={{ min: 0.5 }}
      >
        <InstancedDots />
      </Canvas>
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
    stiffness: 200,
    damping: 30,
    mass: 0.05,
    restDelta: 0.0001,
  });
  const copyY = useTransform(smoothProgress, [0, 0.42], [0, -190]);
  const copyOpacity = useTransform(smoothProgress, [0, 0.32], [1, 0]);
  const sceneY = useTransform(smoothProgress, [0.03, 0.58], [0, -640]);
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
          Empowering organizations with intelligent technology, global expertise,
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
