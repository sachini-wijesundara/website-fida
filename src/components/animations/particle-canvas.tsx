"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  alpha: number;
  color: string;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animId: number;

    const colors = ["rgba(118,196,66,", "rgba(56,163,245,", "rgba(255,255,255,"];
    const particleCount = 120;
    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      // Initialize in a spherical distribution
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 250 + Math.random() * 50;

      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        baseX: 0, 
        baseY: 0,
        baseZ: 0,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    // Update their individual base positions to store the spherical shape
    particles.forEach(p => {
      p.baseX = p.x;
      p.baseY = p.y;
      p.baseZ = p.z;
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;

      // Rotate based on mouse
      const rotationX = (mouse.current.y / height - 0.5) * 0.05;
      const rotationY = (mouse.current.x / width - 0.5) * 0.05;

      particles.forEach((p) => {
        // Apply 3D rotation
        let { x, y, z } = p;

        // Y rotation
        let nx = x * Math.cos(rotationY) - z * Math.sin(rotationY);
        let nz = x * Math.sin(rotationY) + z * Math.cos(rotationY);
        x = nx;
        z = nz;

        // X rotation
        let ny = y * Math.cos(rotationX) - z * Math.sin(rotationX);
        nz = y * Math.sin(rotationX) + z * Math.cos(rotationX);
        y = ny;
        z = nz;

        p.x = x;
        p.y = y;
        p.z = z;

        // Simple perspective projection
        const perspective = 800 / (800 + z);
        const px = x * perspective + centerX;
        const py = y * perspective + centerY;

        ctx.beginPath();
        ctx.arc(px, py, p.size * perspective, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha * perspective * 0.8})`;
        ctx.fill();
      });

      // Draw connections for the 'Neural' look
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dz = particles[i].z - particles[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 120) {
            const perspI = 800 / (800 + particles[i].z);
            const perspJ = 800 / (800 + particles[j].z);
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x * perspI + centerX, particles[i].y * perspI + centerY);
            ctx.lineTo(particles[j].x * perspJ + centerX, particles[j].y * perspJ + centerY);
            ctx.strokeStyle = `rgba(118,196,66,${0.08 * (1 - dist / 120) * perspI})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}
