"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PageLoader from "./page-loader";

const SMOOTH = [0.16, 1, 0.3, 1] as const;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef<string>(pathname);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedPathname, setDisplayedPathname] = useState(pathname);

  useEffect(() => {
    // Only trigger on actual page changes (not the first paint, handled above)
    if (pathname === prevPathname.current) return;

    prevPathname.current = pathname;

    // 1. Show loader
    setIsLoading(true);

    // 2. After the loader's enter anim (~700ms), swap the page
    const swapTimer = setTimeout(() => {
      setDisplayedPathname(pathname);
    }, 650);

    // 3. After page is swapped + a brief pause, hide loader
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1250);

    return () => {
      clearTimeout(swapTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  return (
    <>
      {/* Full-screen cinematic loader overlay */}
      <PageLoader isLoading={isLoading} />

      {/* Page content — keyed to displayedPathname so it only remounts after swap */}
      <AnimatePresence mode="wait">
        <motion.div
          key={displayedPathname}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: SMOOTH, delay: 0.05 }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
