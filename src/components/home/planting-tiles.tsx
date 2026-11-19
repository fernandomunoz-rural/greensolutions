"use client";

import Image from "next/image";
import { useState } from "react";
import { MONTHS, cropsFor } from "@/lib/calendar";

/**
 * Two tiles that work together: what goes in the ground this month in The
 * Bahamas (from src/data/crops.ts), and the botanical plate of the crop
 * picked from that list. Visitors can step to another month. Without
 * script the server's month and its first crop show, fully readable.
 */
export function PlantingTiles({
  initialMonth,
  listClass = "",
  plateClass = "",
}: {
  initialMonth: number;
  listClass?: string;
  plateClass?: string;
}) {
  const [month, setMonth] = useState(initialMonth);
  const [picked, setPicked] = useState<string | null>(null);
  const list = cropsFor(month);
  const crop = list.find((c) => c.slug === picked) ?? list[0];

  const go = (d: number) => {
    setMonth((m) => (m + d + 12) % 12);
    setPicked(null);
  };

  const stepBtn =
    "press flex h-10 w-10 items-center justify-center rounded-[8px] bg-field text-accent transition-colors hover:bg-ink";

  return (
    <>
      <section
        data-reveal
        aria-labelledby="plant-now"
        className={`relative flex flex-col rounded-[8px] bg-accent p-6 text-field ${listClass}`}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="plant-now" className="display text-[length:var(--text-lead)] leading-tight" aria-live="polite">
            Plant in {MONTHS[month]}
          </h2>
          <div className="flex gap-1" role="group" aria-label="Choose a month">
            <button type="button" onClick={() => go(-1)} className={stepBtn} aria-label={`Show ${MONTHS[(month + 11) % 12]}`}>
              ←
            </button>
            <button type="button" onClick={() => go(1)} className={stepBtn} aria-label={`Show ${MONTHS[(month + 1) % 12]}`}>
              →
            </button>
          </div>
        </div>

        <ul className="mt-5 grid gap-1">
          {list.map((c) => {
            const on = crop?.slug === c.slug;
            return (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => setPicked(c.slug)}
                  onMouseEnter={() => setPicked(c.slug)}
                  aria-pressed={on}
                  className={`press flex w-full items-baseline justify-between gap-4 rounded-[8px] px-3 py-2 text-left transition-colors ${
                    on ? "bg-field text-on-field" : "hover:bg-accent-2"
                  }`}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-[length:var(--text-small)]">ready in {c.daysToHarvest}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {crop ? <p className="mt-auto max-w-[48ch] pt-5 text-[length:var(--text-small)]">{crop.summary}</p> : null}
      </section>

      <figure data-reveal className={`relative isolate overflow-hidden rounded-[8px] bg-tile ${plateClass}`}>
        {list.map((c) => (
          <Image
            key={c.slug}
            src={c.plate.image}
            alt={c.slug === crop?.slug ? `Botanical plate of ${c.name.toLowerCase()}` : ""}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover mix-blend-multiply transition-opacity duration-500"
            style={{ objectPosition: c.plate.focus, opacity: c.slug === crop?.slug ? 1 : 0 }}
          />
        ))}
        {crop ? (
          <figcaption className="absolute inset-x-0 bottom-0 z-10 flex min-h-8 items-center bg-ground-2 px-4 py-1.5 text-[length:var(--text-small)] leading-tight text-ink">
            <span className="truncate">{crop.plate.caption}</span>
          </figcaption>
        ) : null}
      </figure>
    </>
  );
}
