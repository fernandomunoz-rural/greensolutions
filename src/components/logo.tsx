import Link from "next/link";

/** Compact filled leaf that echoes the mark in the brand logo. */
export function LeafMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M20 4C20 4 8.5 4.2 5.2 11.2c-1.9 4 .2 7.6 1.4 8.9C8.2 14.7 12 11.4 16 9.8c-3 2.2-5.6 5.4-7 10.4 4.6 1 9-1.1 10.6-5.5C21.6 9.4 20 4 20 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Props = {
  variant?: "light" | "dark";
  className?: string;
  withLink?: boolean;
};

/** Two-line wordmark recreation of the chosen brand logo. */
export function Logo({ variant = "dark", className = "", withLink = true }: Props) {
  const text = variant === "light" ? "text-paper" : "text-forest";
  const leaf = variant === "light" ? "text-mint" : "text-leaf";

  const mark = (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`font-display font-bold leading-[0.92] tracking-tight ${text}`}>
        <span className="block text-[1.25em]">Green</span>
        <span className="flex items-center text-[1.25em]">
          Solut
          <LeafMark
            className={`mx-[0.01em] h-[0.62em] w-[0.62em] -translate-y-[0.16em] rotate-[16deg] ${leaf}`}
          />
          ons
        </span>
      </span>
    </span>
  );

  if (!withLink) return mark;
  return (
    <Link href="/" aria-label="Green Solutions home" className="inline-flex">
      {mark}
    </Link>
  );
}
