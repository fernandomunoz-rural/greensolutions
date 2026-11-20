function initials(name?: string | null): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Round avatar. Shows the uploaded image when present, otherwise the user's
 * initials on a forest background. Sizes are plain Tailwind classes so callers
 * can pass any h-/w- pair via `className`.
 */
export function Avatar({
  src,
  name,
  className = "h-9 w-9",
}: {
  src?: string | null;
  name?: string | null;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- user-uploaded storage URL
      <img
        src={src}
        alt={name ? `${name}'s avatar` : "Avatar"}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      className={`${className} font-display flex shrink-0 items-center justify-center rounded-full bg-forest text-[0.8em] font-semibold text-mint`}
      aria-hidden="true"
    >
      {initials(name) || "•"}
    </span>
  );
}
