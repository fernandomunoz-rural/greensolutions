import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

/*
  The board: every public page is a 12-column grid of filled tiles with
  8px gaps, one 8px radius and text inset 24px from the tile's edge.
  On a phone the board has two columns.
*/

/** Older pages' plain column. Same outer edge as the board. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1680px] px-[var(--margin)] ${className}`}>{children}</div>;
}

/** A row of tiles. Children set their own spans (`col-span-2 md:col-span-6`…). */
export function Board({
  children,
  className = "",
  as: As = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">) {
  return (
    <As
      className={`mx-auto grid w-full max-w-[1680px] grid-cols-2 gap-2 px-2 sm:px-3 md:grid-cols-12 ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}

export type TileTone = "ground" | "paper" | "field" | "sea" | "accent" | "ink";

export const TILE_TONES: Record<TileTone, string> = {
  ground: "bg-ground-2 text-ink",
  paper: "bg-tile text-ink",
  field: "bg-field text-on-field",
  sea: "bg-sea text-white",
  accent: "bg-accent text-field",
  ink: "bg-ink text-ground",
};

/** Muted text that still reads on each tone. */
export const TILE_SOFT: Record<TileTone, string> = {
  ground: "text-ink-soft",
  paper: "text-ink-soft",
  field: "text-on-field-soft",
  sea: "text-on-sea-soft",
  accent: "text-field",
  ink: "text-on-field-soft",
};

/** One flat tile. Text sits top-left on the 24px inset. */
export function Tile({
  tone = "ground",
  className = "",
  children,
  as: As = "div",
  ...rest
}: {
  tone?: TileTone;
  className?: string;
  children?: ReactNode;
  as?: "div" | "article" | "section" | "aside" | "li";
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">) {
  return (
    <As data-reveal className={`relative overflow-hidden rounded-[8px] p-6 ${TILE_TONES[tone]} ${className}`} {...rest}>
      {children}
    </As>
  );
}

const STRIPS = {
  field: "bg-field text-on-field",
  sea: "bg-sea text-white",
  accent: "bg-accent text-field",
  ground: "bg-ground-2 text-ink",
} as const;

/**
 * A photograph covering a whole tile, with a thin colour strip fused to
 * its foot carrying the caption and credit.
 */
export function PhotoTile({
  src,
  alt,
  caption,
  strip = "field",
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
  position,
  priority = false,
  shutter = false,
  blend = false,
}: {
  src: StaticImageData | string;
  alt: string;
  caption?: ReactNode;
  strip?: keyof typeof STRIPS;
  className?: string;
  sizes?: string;
  position?: string;
  priority?: boolean;
  shutter?: boolean;
  /** Multiply onto the tile (for engravings on white paper). */
  blend?: boolean;
}) {
  const imgCls = `absolute inset-0 h-full w-full object-cover ${blend ? "mix-blend-multiply" : ""} ${shutter ? "shutter" : ""}`;
  return (
    <figure data-reveal className={`relative isolate overflow-hidden rounded-[8px] bg-ground-2 ${className}`}>
      {typeof src === "string" ? (
        // eslint-disable-next-line @next/next/no-img-element -- uploaded storage URL
        <img src={src} alt={alt} className={imgCls} style={{ objectPosition: position }} loading={priority ? undefined : "lazy"} />
      ) : (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={imgCls} style={{ objectPosition: position }} />
      )}
      {caption ? (
        <figcaption
          className={`absolute inset-x-0 bottom-0 z-10 flex min-h-8 items-center px-4 py-1.5 text-[length:var(--text-small)] leading-tight ${STRIPS[strip]}`}
        >
          <span className="truncate">{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}

/** A section's opening line on the bare ground, aligned with tile text. */
export function SectionHead({
  id,
  title,
  intro,
  action,
}: {
  id?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="col-span-2 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-4 pb-4 pt-16 sm:px-6 md:col-span-12 lg:pt-24">
      <div>
        <h2 id={id} data-reveal className="display max-w-[22ch] text-[length:var(--text-head)]">
          {title}
        </h2>
        {intro ? (
          <p data-reveal className="mt-3 max-w-[56ch] text-ink">
            {intro}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** "See all →" style link used at the end of a section head. */
export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="press group inline-flex h-12 items-center gap-2 rounded-[8px] bg-ground-2 px-5 font-medium text-ink transition-colors hover:bg-ink hover:text-ground"
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

/**
 * Kept so older pages still compile, but renders nothing: small labels above
 * headings are against the house rules. Put the information in the heading.
 */
export function Eyebrow(_props: { children?: ReactNode }) {
  void _props;
  return null;
}

export function SectionHeading({
  title,
  intro,
  align = "left",
  tone = "dark",
}: {
  /** Ignored (see Eyebrow). */
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const titleColor = tone === "light" ? "text-on-field" : "text-ink";
  const introColor = tone === "light" ? "text-on-field-soft" : "text-ink";
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 className={`display text-[length:var(--text-head)] ${titleColor}`}>{title}</h2>
      {intro ? <p className={`mt-4 max-w-[52ch] text-[length:var(--text-body)] ${introColor}`}>{intro}</p> : null}
    </div>
  );
}

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "ochre" | "accent" | "dark";
  size?: "md" | "lg";
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "className">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

// One button shape for the whole site: flat, one fill, the board's 8px radius.
const buttonBase =
  "press inline-flex items-center justify-center gap-2 rounded-[8px] font-medium transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none";

const buttonVariants: Record<string, string> = {
  primary: "bg-field text-on-field hover:bg-ink",
  ochre: "bg-field text-on-field hover:bg-ink",
  accent: "bg-accent text-field hover:bg-white",
  dark: "bg-field-2 text-on-field hover:bg-ink",
  secondary: "bg-ground-2 text-ink hover:bg-ink hover:text-ground",
  ghost: "bg-ground-2 text-ink hover:bg-ink hover:text-ground",
};

const buttonSizes: Record<string, string> = {
  md: "h-11 px-5 text-[length:var(--text-small)]",
  lg: "h-13 px-7 text-[length:var(--text-body)]",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps & { className?: string }) {
  const cls = `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;
  if (props.href !== undefined) {
    const { href, ...rest } = props;
    return <Link href={href} className={cls} {...rest} />;
  }
  const rest = { ...props } as ComponentProps<"button"> & { href?: undefined };
  delete rest.href;
  return <button className={cls} {...rest} />;
}

/** Sentence-case marker, a step in tone, no outline. */
export function Badge({ children }: { children: ReactNode; tone?: string }) {
  return (
    <span className="inline-flex items-center rounded-[8px] bg-ground-2 px-2.5 py-1 text-[length:var(--text-small)] text-ink">
      {children}
    </span>
  );
}
