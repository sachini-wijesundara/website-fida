"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface PageLoaderProps {
  isLoading: boolean;
}

const SMOOTH = [0.16, 1, 0.3, 1] as const;

function DottedWorldGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const map = new Image();
    let animationFrame = 0;
    let disposed = false;

    map.onload = () => {
      if (disposed) return;
      const mapCanvas = document.createElement("canvas");
      mapCanvas.width = 990;
      mapCanvas.height = 532;
      const mapContext = mapCanvas.getContext("2d", { willReadFrequently: true });
      if (!mapContext) return;
      mapContext.drawImage(map, 0, 0, mapCanvas.width, mapCanvas.height);
      const pixels = mapContext.getImageData(0, 0, mapCanvas.width, mapCanvas.height).data;

      const size = canvas.width;
      const center = size / 2;
      const radius = size * 0.43;
      const spacing = 12;
      const start = performance.now();

      const draw = (now: number) => {
        context.clearRect(0, 0, size, size);
        const rotation = -0.48 + Math.min((now - start) / 1800, 1) * 0.12;

        for (let y = -radius; y <= radius; y += spacing) {
          const row = Math.round((y + radius) / spacing);
          for (let x = -radius; x <= radius; x += spacing) {
            const shiftedX = x + (row % 2 ? spacing / 2 : 0);
            const nx = shiftedX / radius;
            const ny = y / radius;
            const distance = nx * nx + ny * ny;
            if (distance >= 1) continue;

            const z = Math.sqrt(1 - distance);
            const longitude = Math.atan2(nx, z) + rotation;
            const latitude = Math.asin(-ny);
            const wrappedLongitude = ((longitude + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            const mapX = Math.min(mapCanvas.width - 1, Math.floor((wrappedLongitude / (Math.PI * 2)) * mapCanvas.width));
            const mapY = Math.min(mapCanvas.height - 1, Math.floor(((Math.PI / 2 - latitude) / Math.PI) * mapCanvas.height));
            const alpha = pixels[(mapY * mapCanvas.width + mapX) * 4 + 3];
            if (alpha < 40) continue;

            const edgeFade = 0.25 + z * 0.75;
            context.beginPath();
            context.arc(center + shiftedX, center + y, 2.1 + z * 0.55, 0, Math.PI * 2);
            context.fillStyle = `rgba(5,44,101,${0.07 + edgeFade * 0.18})`;
            context.fill();
          }
        }

        context.beginPath();
        context.arc(center, center, radius + 7, 0, Math.PI * 2);
        context.strokeStyle = "rgba(5,44,101,.11)";
        context.lineWidth = 1.4;
        context.stroke();

        animationFrame = requestAnimationFrame(draw);
      };

      animationFrame = requestAnimationFrame(draw);
    };

    map.src = "/world-map.svg";
    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} width={640} height={640} className="fida-loader__globe-dots" aria-hidden="true" />;
}

export default function PageLoader({ isLoading }: PageLoaderProps) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isLoading) {
      setCount(0);
      return;
    }

    const startedAt = performance.now();
    const duration = reduceMotion ? 150 : 1550;
    let frame = 0;

    const update = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));
      if (progress < 1) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [isLoading, reduceMotion]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          className="fida-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.5, ease: SMOOTH }}
        >
          <div className="fida-loader__wash fida-loader__wash--one" />
          <div className="fida-loader__wash fida-loader__wash--two" />
          <motion.div
            className="fida-loader__globe"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.12 }}
            transition={{ duration: 1, ease: SMOOTH }}
          >
            <DottedWorldGlobe />
          </motion.div>

          <motion.div
            className="fida-loader__content"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: SMOOTH }}
          >
            <div className="fida-loader__ring">
              <img src="/Fidalong.png" alt="FIDA Global" />
            </div>

            <p className="fida-loader__label">Preparing your optimum experience</p>
            <div className="fida-loader__bar" aria-hidden="true">
              <span style={{ width: `${count}%` }} />
            </div>
            <p className="fida-loader__count">{String(count).padStart(3, "0")}%</p>
          </motion.div>

          <p className="fida-loader__footer">Business partner for success and beyond</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
