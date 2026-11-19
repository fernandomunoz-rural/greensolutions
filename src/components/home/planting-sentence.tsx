"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MONTHS, cropsFor } from "@/lib/calendar";

/**
 * The hero sentence: "Plant [plate] callaloo / in November." The crop is
 * what goes in the ground this month in The Bahamas (src/data/crops.ts), the
 * frame shows its botanical plate, and the sentence steps through this
 * month's crops. Visitors can move to another month. Without script it
 * shows the server's month and first crop, and the list stays readable.
 */
export function PlantingSentence({ initialMonth }: { initialMonth: number }) {
  const [month, setMonth] = useState(initialMonth);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const list = cropsFor(month);
  const crop = list[i % Math.max(list.length, 1)];

  // Step through this month's crops; stop for reduced motion, hover or focus.
  useEffect(() => {
    if (paused || list.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % list.length), 3200);
    return () => window.clearInterval(t);
  }, [paused, list.length, month]);

  const go = (d: number) => {
    setMonth((m) => (m + d + 12) % 12);
    setI(0);
  };

  if (!crop) return null;

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <p className="display text-[length:var(--text-display)] text-ink" aria-live="polite">
        <span className="block">
          Plant{" "}
          <span
            className="relative isolate mx-[0.08em] hidden h-[0.78em] w-[2.3em] overflow-hidden rounded-[4px] bg-ground-2 align-[-0.04em] sm:inline-block"
            aria-hidden="true"
          >
            {list.map((c, n) => (
              <Image
                key={c.slug}
                src={c.plate.image}
                alt=""
                fill
                sizes="(min-width: 640px) 22vw, 90vw"
                priority={n === 0}
                className="object-cover mix-blend-multiply transition-[opacity,transform] duration-700 ease-[var(--ease-out)]"
                style={{
                  objectPosition: c.plate.focus,
                  opacity: c.slug === crop.slug ? 1 : 0,
                  transform: c.slug === crop.slug ? "none" : "scale(1.08)",
                }}
              />
            ))}
          </span>
          <span key={crop.slug} className="animate-fade-in inline-block">
            {crop.short}
          </span>
        </span>
        {/* On a phone the frame gets its own line between the halves. */}
        <span className="relative isolate my-[0.12em] block aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-ground-2 sm:hidden" aria-hidden="true">
          <Image
            src={crop.plate.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover mix-blend-multiply"
            style={{ objectPosition: crop.plate.focus }}
          />
        </span>
        <span className="block text-right">in {MONTHS[month]}.</span>
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[length:var(--text-small)] sm:text-[length:var(--text-body)]">
        <div className="flex items-center gap-1" role="group" aria-label="Choose a month">
          <button type="button" onClick={() => go(-1)} className="press h-11 rounded-[4px] bg-ground-2 px-4 text-ink hover:bg-ink hover:text-ground" aria-label={`Show ${MONTHS[(month + 11) % 12]}`}>
            ← {MONTHS[(month + 11) % 12].slice(0, 3)}
          </button>
          <button type="button" onClick={() => go(1)} className="press h-11 rounded-[4px] bg-ground-2 px-4 text-ink hover:bg-ink hover:text-ground" aria-label={`Show ${MONTHS[(month + 1) % 12]}`}>
            {MONTHS[(month + 1) % 12].slice(0, 3)} →
          </button>
        </div>
        <p className="text-ink">
          {crop.name} is ready in {crop.daysToHarvest}.{" "}
          {list.length > 1 ? (
            <span className="text-ink-soft">
              Also in {MONTHS[month]}:{" "}
              {list
                .filter((c) => c.slug !== crop.slug)
                .map((c, n, arr) => (
                  <span key={c.slug}>
                    <button
                      type="button"
                      onClick={() => setI(list.findIndex((x) => x.slug === c.slug))}
                      className="underline decoration-1 underline-offset-4 hover:text-ink"
                    >
                      {c.short}
                    </button>
                    {n < arr.length - 1 ? ", " : "."}
                  </span>
                ))}
            </span>
          ) : null}
        </p>
      </div>
      <p className="mt-3 text-[length:var(--text-small)] text-ink-soft">Plate: {crop.plate.caption}</p>
    </div>
  );
}
