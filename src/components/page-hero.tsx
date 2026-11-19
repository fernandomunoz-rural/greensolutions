import type { ReactNode } from "react";
import { Board, PhotoTile } from "./ui";
import type { Place } from "@/lib/places";

/** Inner-page opening: a green title tile, with a photograph tile beside it when given. */
export function PageHero({
  title,
  intro,
  children,
  place,
}: {
  /** Ignored: small labels above headings are against the house rules. */
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  place?: Place;
}) {
  return (
    <Board className="pt-2">
      <div
        className={`col-span-2 flex min-h-[clamp(18rem,40vw,30rem)] flex-col justify-end rounded-[8px] bg-field p-6 text-on-field ${
          place ? "md:col-span-7" : "md:col-span-12"
        }`}
      >
        <h1 className="animate-fade-in display max-w-[18ch] text-[length:var(--text-display)]">{title}</h1>
        {intro ? (
          <p className="animate-fade-in mt-5 max-w-[48ch] text-[length:var(--text-lead)] leading-snug text-on-field-soft">
            {intro}
          </p>
        ) : null}
        {children}
      </div>
      {place ? (
        <PhotoTile
          src={place.image}
          alt={place.alt}
          caption={place.caption}
          position={place.position}
          priority
          shutter
          sizes="(min-width: 768px) 42vw, 100vw"
          className="col-span-2 aspect-[4/3] md:col-span-5 md:aspect-auto"
        />
      ) : null}
    </Board>
  );
}
