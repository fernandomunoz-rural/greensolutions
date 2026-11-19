"use client";

import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import { ALL_CROPS } from "@/lib/calendar";

const COPIES = 4;
/** Percent of one copy per second at rest. */
const BASE_SPEED = -2.2;

/** Keep v inside [min, max) by wrapping round. */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function Row({ hidden }: { hidden: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-[clamp(2.5rem,4vw,4.5rem)] pr-[clamp(2.5rem,4vw,4.5rem)]" aria-hidden={hidden || undefined}>
      {ALL_CROPS.map((c, i) => (
        <li key={c.slug} className="flex shrink-0 items-center gap-5">
          <span className="relative block h-[clamp(3.5rem,2.6rem+2.6vw,5.5rem)] w-[clamp(3.5rem,2.6rem+2.6vw,5.5rem)] shrink-0 overflow-hidden rounded-full bg-ground">
            <Image
              src={c.plate.image}
              alt=""
              fill
              sizes="88px"
              className="scale-[1.35] object-cover mix-blend-multiply"
              style={{ objectPosition: c.plate.focus }}
            />
          </span>
          <span className="flex flex-col">
            <span
              className={`whitespace-nowrap text-[clamp(1.75rem,1.2rem+2vw,3.25rem)] leading-none text-ink ${
                i % 2 ? "font-serif italic" : "font-medium tracking-[-0.045em]"
              }`}
            >
              {c.name}
            </span>
            <span className="mt-2 whitespace-nowrap text-[length:var(--text-small)] text-ink-soft">Ready in {c.daysToHarvest}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The crops that grow here, drifting past on a white band. Scrolling the
 * page speeds it up, scrolling back up reverses it, and hovering pauses it.
 * With reduced motion it simply stands still.
 */
export function CropCarousel() {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);
  const direction = useRef(1);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduce || paused.current) return;
    let move = direction.current * BASE_SPEED * (delta / 1000);
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    move += direction.current * move * b;
    baseX.set(baseX.get() + move);
  });

  return (
    <section
      aria-label="Crops that grow well in The Bahamas"
      className="overflow-hidden bg-white py-[clamp(1.75rem,3vw,2.75rem)]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <motion.div className="flex w-max" style={{ x: reduce ? 0 : x }}>
        {Array.from({ length: COPIES }, (_, i) => (
          <Row key={i} hidden={i > 0} />
        ))}
      </motion.div>
    </section>
  );
}
