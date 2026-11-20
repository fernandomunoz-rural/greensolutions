"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Staggered entrances: every element with `data-reveal` rises in once as it
 * enters the viewport. Siblings stagger via `--i`, set in markup. Elements
 * added later (client renders, refreshes) are picked up too. CSS only hides
 * elements while `html.js` is set, so with no script nothing is hidden.
 */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
