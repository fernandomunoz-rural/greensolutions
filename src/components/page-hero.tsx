import type { ReactNode } from "react";
import { Container } from "./ui";
import { Split } from "./motion/split";
import { ParallaxImage } from "./motion/parallax-image";
import type { Photo } from "@/lib/photos";

/**
 * Inner-page opening: the title large on the limestone ground, the intro
 * beside it, then (when given) a wide photograph that drifts as it scrolls.
 */
export function PageHero({
  title,
  intro,
  children,
  photo,
}: {
  /** Ignored: small labels above headings are against the house rules. */
  eyebrow?: string;
  /** Plain text; *asterisks* set words in the serif italic. */
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  photo?: Photo;
}) {
  return (
    <section className="pt-[clamp(8rem,16vw,13rem)]">
      <Container>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Split as="h1" immediate text={title} className="display text-[length:var(--text-display)] md:col-span-8" />
          {intro ? (
            <p className="animate-fade-in max-w-[40ch] text-[length:var(--text-lead)] leading-snug text-ink-soft [animation-delay:400ms] md:col-span-4">
              {intro}
            </p>
          ) : null}
        </div>
        {children}
      </Container>
      {photo ? (
        <Container className="mt-[clamp(3rem,7vw,6rem)]">
          <figure>
            <ParallaxImage
              src={photo.image}
              alt={photo.alt}
              position={photo.position}
              priority
              sizes="100vw"
              strength={0.1}
              className="aspect-[4/3] rounded-[20px] md:aspect-[21/9]"
            />
            <figcaption className="mt-3 text-[length:var(--text-small)] text-ink-soft">Photo: {photo.credit}</figcaption>
          </figure>
        </Container>
      ) : null}
    </section>
  );
}
