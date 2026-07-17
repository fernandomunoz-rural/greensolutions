import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-leaf">
      <span className="h-px w-6 bg-leaf/50" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const titleColor = tone === "light" ? "text-white" : "text-forest";
  const introColor = tone === "light" ? "text-mint-100/85" : "text-ink/65";
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        className={`font-display mt-4 text-3xl font-semibold leading-[1.1] sm:text-[2.6rem] ${titleColor}`}
      >
        {title}
      </h2>
      {intro ? (
        <p className={`mt-4 text-[1.05rem] leading-relaxed ${introColor}`}>{intro}</p>
      ) : null}
    </div>
  );
}

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "ochre";
  size?: "md" | "lg";
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "className">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:ring-forest disabled:opacity-40 disabled:pointer-events-none";

const buttonVariants: Record<string, string> = {
  primary: "bg-forest text-paper hover:bg-forest-700",
  ochre: "bg-ochre text-white hover:brightness-105",
  secondary: "bg-mint text-forest hover:brightness-[1.03]",
  ghost: "bg-transparent text-forest ring-1 ring-forest/15 hover:bg-forest/[0.04]",
};

const buttonSizes: Record<string, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-[0.95rem]",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps & { className?: string }) {
  const cls = `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;
  if (props.href !== undefined) {
    const { href, ...rest } = props;
    return <Link href={href} className={cls} {...rest} />;
  }
  const { href: _omit, ...rest } = props;
  return <button className={cls} {...(rest as ComponentProps<"button">)} />;
}

export function Badge({
  children,
  tone = "leaf",
}: {
  children: ReactNode;
  tone?: "leaf" | "ochre" | "sand" | "mint" | "neutral";
}) {
  const tones: Record<string, string> = {
    leaf: "bg-leaf/10 text-leaf ring-leaf/15",
    ochre: "bg-ochre/10 text-ochre ring-ochre/15",
    sand: "bg-sand/40 text-forest ring-forest/10",
    mint: "bg-mint/20 text-forest ring-forest/10",
    neutral: "bg-forest/[0.06] text-forest ring-forest/10",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
