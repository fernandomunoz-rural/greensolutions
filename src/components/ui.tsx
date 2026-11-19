import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Split } from "./motion/split";

/** The page's one column: max 1440px, the same side gutter everywhere. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-[var(--gutter)] ${className}`}>{children}</div>;
}

/** A section's opening: headline with a word-by-word entrance, an intro, and an optional link. */
export function SectionHead({
  id,
  title,
  intro,
  action,
  tone = "dark",
}: {
  id?: string;
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <div className="grid gap-8 md:grid-cols-12 md:items-end">
      <Split id={id} text={title} className={`display text-[length:var(--text-head)] md:col-span-8 ${tone === "light" ? "text-white" : ""}`} />
      <div className="md:col-span-4 md:justify-self-end">
        {intro ? (
          <p data-reveal className={`max-w-[38ch] ${tone === "light" ? "text-on-field-soft" : "text-ink-soft"}`}>
            {intro}
          </p>
        ) : null}
        {action ? (
          <div data-reveal style={{ ["--i" as string]: 1 }} className={intro ? "mt-6" : ""}>
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Arrow that slides on hover; used in buttons and links. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative inline-block h-[1em] w-[1.1em] shrink-0 overflow-hidden align-middle ${className}`}>
      <span className="absolute inset-0 flex items-center justify-center leading-none transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-full">→</span>
      <span className="absolute inset-0 flex -translate-x-full items-center justify-center leading-none transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0">→</span>
    </span>
  );
}

/** "All news →" style text link with a drawn underline. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 font-medium ${className}`}>
      <span className="line-link">{children}</span>
      <Arrow />
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

/** Older pages' section heading. */
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
  const introColor = tone === "light" ? "text-on-field-soft" : "text-ink-soft";
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 className={`display text-[length:var(--text-head)] ${titleColor}`}>{title}</h2>
      {intro ? <p className={`mt-4 max-w-[52ch] text-[length:var(--text-body)] ${introColor}`}>{intro}</p> : null}
    </div>
  );
}

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "ochre" | "accent" | "light" | "outline-light";
  size?: "md" | "lg";
  /** Show the sliding arrow after the label. */
  arrow?: boolean;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "className">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

// One button shape for the whole site: a flat pill.
const buttonBase =
  "press group inline-flex items-center justify-center gap-3 rounded-full font-medium transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none";

const buttonVariants: Record<string, string> = {
  primary: "bg-field text-on-field hover:bg-ink",
  ochre: "bg-field text-on-field hover:bg-ink",
  accent: "bg-accent text-ink hover:bg-white",
  light: "bg-white text-ink hover:bg-accent",
  "outline-light": "bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-ink",
  secondary: "bg-ground-2 text-ink hover:bg-ink hover:text-ground",
  ghost: "bg-ground-2 text-ink hover:bg-ink hover:text-ground",
};

const buttonSizes: Record<string, string> = {
  md: "h-11 px-5 text-[length:var(--text-small)]",
  lg: "h-14 px-7 text-[length:var(--text-body)]",
};

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  children,
  ...props
}: ButtonProps & { className?: string; children?: ReactNode }) {
  const cls = `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  );
  if (props.href !== undefined) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  const rest = { ...props } as ComponentProps<"button"> & { href?: undefined };
  delete rest.href;
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}

/** Sentence-case marker, a step in tone, no outline. */
export function Badge({ children }: { children: ReactNode; tone?: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-ground-2 px-3 py-1 text-[length:var(--text-small)] text-ink">
      {children}
    </span>
  );
}
