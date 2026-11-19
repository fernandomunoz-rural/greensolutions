"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type Pic = { src: StaticImageData | string; alt: string; position?: string };

function Pic({ pic, sizes, className = "" }: { pic: Pic; sizes: string; className?: string }) {
  return typeof pic.src === "string" ? (
    // eslint-disable-next-line @next/next/no-img-element -- uploaded storage URL
    <img src={pic.src} alt={pic.alt} className={`h-full w-full object-cover ${className}`} style={{ objectPosition: pic.position }} />
  ) : (
    <Image src={pic.src} alt={pic.alt} fill sizes={sizes} className={`object-cover ${className}`} style={{ objectPosition: pic.position }} />
  );
}

/**
 * "What we do": the points scroll past on the right and light up one at a
 * time while the photo on the left holds still and changes with them.
 * On a phone each point simply carries its own photo.
 */
export function StickyPoints({ points, pics }: { points: { title: string; body: string }[]; pics: Pic[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [points.length]);

  const picFor = (i: number) => pics[i % pics.length];

  return (
    <div className="grid gap-x-8 md:grid-cols-12">
      <div className="hidden md:col-span-5 md:block">
        <div className="sticky top-24 h-[calc(100svh-8rem)] overflow-hidden rounded-[20px] bg-ground-2">
          {points.map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-[var(--ease-out)]"
              style={{ opacity: i === active ? 1 : 0, transform: i === active ? "scale(1)" : "scale(1.08)" }}
              aria-hidden={i !== active}
            >
              <Pic pic={picFor(i)} sizes="40vw" />
            </div>
          ))}
          <p className="absolute bottom-5 left-5 rounded-full bg-ground/90 px-4 py-2 text-[length:var(--text-small)] font-medium text-ink backdrop-blur">
            {active + 1} / {points.length}
          </p>
        </div>
      </div>

      <ol className="md:col-span-6 md:col-start-7">
        {points.map((p, i) => (
          <li
            key={`${p.title}-${i}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className={`flex flex-col justify-center py-10 transition-opacity duration-700 md:min-h-[60svh] md:py-0 ${i === active ? "" : "md:opacity-25"}`}
          >
            <div data-reveal="clip" className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[20px] md:hidden">
              <Pic pic={picFor(i)} sizes="100vw" />
            </div>
            <h3 className="display text-[clamp(2rem,1.3rem+2.6vw,3.75rem)]">{p.title}</h3>
            {p.body ? <p className="mt-5 max-w-[34ch] text-[length:var(--text-lead)] leading-snug text-ink-soft">{p.body}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
