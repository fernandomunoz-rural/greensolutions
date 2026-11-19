"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

// The first page a visitor lands on is shown at once (no hidden content
// before scripts load); only later navigations animate.
let firstLoad = true;

/**
 * Page transition: a template remounts on every navigation, so each new
 * page rises and fades in. It never waits on anything, so it cannot hold a
 * navigation up. The admin is left still.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const animateIn = !firstLoad;
  useEffect(() => {
    firstLoad = false;
  }, []);
  if (reduce || pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;
  return (
    <motion.div initial={animateIn ? { opacity: 0, y: 28 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
