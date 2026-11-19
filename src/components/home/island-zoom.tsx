"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type Point = { title: string; body: string };

// Where the frame moves in to, one per stage, on the Staniel Cay aerial:
// the whole island, then the sea and cays, the white limestone ground, the
// yards between the houses, the scrub along the road.
const STOPS = [
  { scale: 1, origin: "50% 50%" },
  { scale: 2.1, origin: "62% 8%" },
  { scale: 2.6, origin: "78% 42%" },
  { scale: 2.8, origin: "28% 30%" },
  { scale: 2.3, origin: "40% 82%" },
];

/**
 * "One frame, three distances": a pinned stage holds one photograph of the
 * islands; as the reader scrolls it moves in to a new detail and the caption
 * beside it changes to the next point of what Green Solutions does.
 * Without script (or with reduced motion) the points are a plain list.
 */
export function IslandZoom({
  first,
  second,
  intro,
  points,
  image,
  credit,
}: {
  first: string;
  second: string;
  intro: string;
  points: Point[];
  image: StaticImageData | string;
  credit: string;
}) {
  // Two points per step keeps the pinned run short (about two and a half screens).
  const groups: Point[][] = [];
  for (let n = 0; n < points.length; n += 2) groups.push(points.slice(n, n + 2));
  const stages = Math.min(groups.length, STOPS.length - 1) + 1; // the whole view first
  const [stage, setStage] = useState(0);
  const markers = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setStage(Number((e.target as HTMLElement).dataset.stage));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    markers.current.forEach((m) => m && io.observe(m));
    return () => io.disconnect();
  }, [stages]);

  const stop = STOPS[Math.min(stage, STOPS.length - 1)];
  const group = stage > 0 ? groups[stage - 1] : null;

  return (
    <section aria-labelledby="what-we-do" className="relative" style={{ height: `${stages * 58 + 30}svh` }}>
      {Array.from({ length: stages }, (_, n) => (
        <div
          key={n}
          ref={(el) => {
            markers.current[n] = el;
          }}
          data-stage={n}
          className="absolute inset-x-0 h-2"
          style={{ top: `${n * 58 + 12}svh` }}
          aria-hidden="true"
        />
      ))}

      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center px-[var(--margin)]">
        <h2 id="what-we-do" className="display relative z-10 text-center text-[length:var(--text-head)] sm:text-[length:var(--text-display)]">
          <span className="block">{first}</span>
          <span className="sr-only"> {second}</span>
        </h2>

        <div className="relative mt-4 grid w-full max-w-6xl grid-cols-1 items-start gap-6 sm:grid-cols-[1fr_auto_1fr]">
          <div className="hidden sm:block" />
          <figure className="mx-auto w-[70vw] sm:w-[28vw] sm:min-w-[260px]">
            <div className="relative aspect-[4/5] overflow-hidden bg-ground-2">
              <Image
                src={image}
                alt="Aerial view of Staniel Cay in the Exumas: scrub, white limestone ground, houses and the sea"
                fill
                sizes="(min-width: 640px) 30vw, 70vw"
                className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] motion-reduce:transition-none"
                style={{ objectPosition: "60% 50%", transform: `scale(${stop.scale})`, transformOrigin: stop.origin }}
              />
            </div>
            <figcaption className="mt-2 text-[length:var(--text-small)] text-ink-soft">{credit}</figcaption>
          </figure>
          <div className="min-h-[9rem] sm:pt-2" aria-live="polite">
            {group ? (
              <div key={stage} className="animate-fade-in max-w-[30ch] space-y-5">
                {group.map((p) => (
                  <div key={p.title}>
                    <p className="text-[length:var(--text-lead)] leading-tight text-ink">{p.title}</p>
                    {p.body ? <p className="mt-1 text-[length:var(--text-body)] text-ink">{p.body}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="max-w-[30ch] text-[length:var(--text-body)] text-ink">{intro}</p>
            )}
          </div>
        </div>

        <p
          className="display mt-2 text-center text-[length:var(--text-head)] transition-[opacity,transform] duration-700 sm:-mt-[0.3em] sm:text-[clamp(3rem,1rem+6vw,8rem)]"
          style={{ opacity: stage > 0 ? 1 : 0, transform: stage > 0 ? "none" : "translateY(0.3em)" }}
          aria-hidden="true"
        >
          {second}
        </p>
      </div>

      {/* Readable without the scroll story. */}
      <ul className="sr-only">
        {points.map((p) => (
          <li key={p.title}>
            {p.title}. {p.body}
          </li>
        ))}
      </ul>
    </section>
  );
}
