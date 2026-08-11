"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const PUSH_TRANSITION = {
  duration: 1.15,
  ease: [0.65, 0, 0.35, 1],
} as const;

const pageVariants = {
  initial: (push: boolean) => push ? { opacity: 1, x: "100%" } : { opacity: 1, x: 0 },
  animate: { opacity: 1, x: 0 },
  exit: (push: boolean) => push ? { opacity: 1, x: "-100%" } : { opacity: 1, x: 0 },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const previousPathname = useRef(pathname);
  const isFragmentationPush =
    pathname === "/solutions" &&
    typeof window !== "undefined" &&
    sessionStorage.getItem("fida:fragmentation-to-solutions") === "true";

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousScrollBehavior;
  }, [pathname]);

  useEffect(() => {
    if (pathname === previousPathname.current) return;
    previousPathname.current = pathname;

    if (isFragmentationPush) {
      sessionStorage.removeItem("fida:fragmentation-to-solutions");
    }
  }, [isFragmentationPush, pathname]);

  const usePushMotion = isFragmentationPush && !reduceMotion;

  return (
    <div className="grid w-full min-w-0 flex-1 overflow-x-clip bg-white">
      <AnimatePresence initial={false} mode="sync" custom={usePushMotion}>
        <motion.div
          key={pathname}
          custom={usePushMotion}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={usePushMotion ? PUSH_TRANSITION : { duration: 0 }}
          className="col-start-1 row-start-1 flex w-full min-w-0 flex-col [will-change:transform]"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
