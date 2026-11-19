import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** One grid margin for the whole site; large things run to the edges. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-[var(--margin)] ${className}`}>{children}</div>;
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
      {intro ? <p className={`mt-5 max-w-[46ch] text-[length:var(--text-body)] ${introColor}`}>{intro}</p> : null}
    </div>
  );
}

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "ochre" | "accent";
  size?: "md" | "lg";
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "className">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

// One button shape for the whole site: flat, one fill, 4px corners.
const buttonBase =
  "press inline-flex items-center justify-center gap-2 rounded-[4px] font-medium transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none";

const buttonVariants: Record<string, string> = {
  primary: "bg-field text-on-field hover:bg-ink",
  ochre: "bg-field text-on-field hover:bg-ink",
  accent: "bg-accent text-field hover:bg-white",
  secondary: "bg-ground-2 text-ink hover:bg-ink hover:text-ground",
  ghost: "bg-ground-2 text-ink hover:bg-ink hover:text-ground",
};

const buttonSizes: Record<string, string> = {
  md: "h-11 px-5 text-[length:var(--text-small)]",
  lg: "h-14 px-7 text-[length:var(--text-body)]",
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
    <span className="inline-flex items-center rounded-[4px] bg-ground-2 px-2.5 py-1 text-[length:var(--text-small)] text-ink">
      {children}
    </span>
  );
}
