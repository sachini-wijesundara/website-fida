"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // If we're on the admin page, we don't want the custom cursor logic at all.
    // The CSS in globals.css handles restoring the native cursor via !important.
    if (isAdmin) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      animId = requestAnimationFrame(animate);
    };

    const onMouseEnterLink = () => {
      ring.style.width = "50px";
      ring.style.height = "50px";
      ring.style.borderColor = "var(--primary)";
      ring.style.background = "rgba(130,188,38,0.08)";
    };

    const onMouseLeaveLink = () => {
      ring.style.width = "40px";
      ring.style.height = "40px";
      ring.style.borderColor = "rgba(130,188,38,0.5)";
      ring.style.background = "transparent";
    };

    document.addEventListener("mousemove", onMouseMove);
    animId = requestAnimationFrame(animate);

    const links = document.querySelectorAll("a, button, [data-cursor]");
    links.forEach(el => {
      el.addEventListener("mouseenter", onMouseEnterLink);
      el.addEventListener("mouseleave", onMouseLeaveLink);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isAdmin]);

  // Don't render the custom cursor elements if we're in the admin panel
  if (isAdmin) return null;

  return (
    <>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transition: "none" }}
      />
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 pointer-events-none z-[9998]"
        style={{
          borderColor: "rgba(130,188,38,0.5)",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background 0.3s ease",
        }}
      />
    </>
  );
}
