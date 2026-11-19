import type { ReactNode } from "react";
import { Container } from "./ui";

/** Inner-page opening: the title large, one sentence under it. No label. */
export function PageHero({
  title,
  intro,
  children,
}: {
  /** Ignored: small labels above headings are against the house rules. */
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section>
      <Container className="pb-16 pt-[clamp(3rem,10vw,8rem)]">
        <h1 className="animate-fade-in display max-w-[18ch] text-[2.35rem] sm:text-[clamp(3rem,1rem+6.5vw,8.5rem)]">
          {title}
        </h1>
        {intro ? (
          <p className="animate-fade-in mt-8 max-w-[44ch] text-[length:var(--text-lead)] leading-snug text-ink">
            {intro}
          </p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
