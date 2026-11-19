"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { MONTHS, cropsFor } from "@/lib/calendar";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * What goes in the ground in a given month in The Bahamas (from
 * src/data/crops.ts). Visitors pick a month; the crop cards rearrange
 * themselves. It opens on the current month in Nassau.
 */
export function PlantingCalendar({ initialMonth }: { initialMonth: number }) {
  const [month, setMonth] = useState(initialMonth);
  const reduce = useReducedMotion();
  const list = cropsFor(month);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Month"
        data-lenis-prevent
        className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
      >
        {MONTHS.map((m, i) => {
          const on = i === month;
          return (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setMonth(i)}
              className={`press relative h-11 shrink-0 rounded-full px-5 text-[length:var(--text-small)] font-medium transition-colors ${
                on ? "text-ink" : "text-on-field-soft hover:text-white"
              }`}
            >
              {on ? (
                <motion.span
                  layoutId="month-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : (
                <span className="absolute inset-0 rounded-full bg-white/[0.06]" />
              )}
              <span className="relative">{m.slice(0, 3)}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {list.length} crops to plant in {MONTHS[month]}: {list.map((c) => c.name).join(", ")}.
      </p>

      <motion.ul layout={!reduce} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((c, i) => (
            <motion.li
              key={c.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease, delay: reduce ? 0 : i * 0.05 }}
              className="group overflow-hidden rounded-[20px] bg-field-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-tile">
                <Image
                  src={c.plate.image}
                  alt={`Botanical plate of ${c.name.toLowerCase()}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover mix-blend-multiply transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.06]"
                  style={{ objectPosition: c.plate.focus }}
                />
                <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1.5 text-[length:var(--text-small)] font-medium text-accent backdrop-blur">
                  Ready in {c.daysToHarvest}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-[length:var(--text-lead)] font-medium tracking-[-0.02em] text-white">{c.name}</h3>
                <p className="mt-1 text-[length:var(--text-small)] text-on-field-soft">
                  Plant {c.season === "Year-round" ? "all year" : c.season.replace("–", "to")}
                </p>
                <p className="mt-4 text-on-field-soft">{c.summary}</p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
