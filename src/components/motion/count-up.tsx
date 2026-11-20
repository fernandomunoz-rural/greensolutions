"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * A figure like "90%", "700+" or "1,200" that counts up from zero the first
 * time it scrolls into view. The server renders the final value, so it reads
 * correctly without script. Anything that is not a number is shown as is.
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const m = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);

  useEffect(() => {
    if (!m || !inView || reduce || !ref.current) return;
    const [, pre, num, post] = m;
    const target = Number(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const el = ref.current;
    const controls = animate(0, target, {
      duration: Math.min(2.2, 0.9 + target / 600),
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${pre}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${post}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when it first comes into view
  }, [inView, reduce]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
