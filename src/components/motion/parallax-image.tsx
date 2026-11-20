"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * A picture that drifts slower than the page as it scrolls past, inside a
 * frame that crops it. `strength` is how far it travels, as a share of the
 * frame's height.
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  position,
  strength = 0.12,
  intro = false,
  children,
}: {
  src: StaticImageData | string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
  strength?: number;
  /** Settle from a slow zoom on first paint (for heroes). */
  intro?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pct = strength * 100;
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : [`${-pct}%`, `${pct}%`]);

  const img =
    typeof src === "string" ? (
      // eslint-disable-next-line @next/next/no-img-element -- uploaded storage URL
      <img src={src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: position }} />
    ) : (
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
    );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-x-0"
        style={{ y, top: `${-pct}%`, bottom: `${-pct}%` }}
        initial={intro && !reduce ? { scale: 1.18 } : false}
        animate={intro && !reduce ? { scale: 1 } : undefined}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {img}
      </motion.div>
      {children}
    </div>
  );
}
