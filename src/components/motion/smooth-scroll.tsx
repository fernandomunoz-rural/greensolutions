"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Smooth, weighted scrolling for the public site (Lenis). Off in the admin
 * and for visitors who ask for reduced motion. Native scroll events still
 * fire, so everything that listens to scroll keeps working.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const inAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    if (inAdmin) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      anchors: { offset: -80 },
      // Let menus, dialogs and anything marked as its own scroller scroll natively.
      prevent: (node) => node.closest?.("[data-lenis-prevent], dialog, [role=dialog]") != null,
    });
    return () => lenis.destroy();
  }, [inAdmin]);

  return null;
}
