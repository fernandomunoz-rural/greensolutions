import type { SVGProps } from "react";

/**
 * Minimal line-icon set. Single consistent stroke, inherits color + size
 * from the parent (set width/height via className, e.g. "h-5 w-5").
 */
type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const Icon = {
  Leaf: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M11 20A7 7 0 0 1 4 13C4 8 8 4 18 4c0 10-4 14-9 14Z" />
      <path d="M5 19c2-5 6-8 11-9" />
    </svg>
  ),
  Sprout: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 21v-7" />
      <path d="M12 14c0-3 2-5 6-5 0 3-2 5-6 5Z" />
      <path d="M12 14c0-3-2-5-6-5 0 3 2 5 6 5Z" />
    </svg>
  ),
  Search: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  ArrowRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  ),
  ArrowLeft: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  ),
  ChevronDown: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 12l5 5L20 6" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Droplet: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3s6 5.5 6 10a6 6 0 0 1-12 0c0-4.5 6-10 6-10Z" />
    </svg>
  ),
  Bug: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="8" y="7" width="8" height="11" rx="4" />
      <path d="M3 11h2M19 11h2M3 16h3M18 16h3M9 7l-1-2M15 7l1-2M12 7V4" />
    </svg>
  ),
  Flask: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M10 3h4M10 3v6l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3" />
      <path d="M7.5 15h9" />
    </svg>
  ),
  Shield: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M12 8v4M12 15h.01" />
    </svg>
  ),
  Sun: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  ),
  File: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  ),
  ListCheck: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 7l2 2 3-3M4 17l2 2 3-3M13 7h7M13 17h7" />
    </svg>
  ),
  Calendar: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </svg>
  ),
  Download: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  ),
  Compass: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" />
    </svg>
  ),
  Wheat: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 22V8" />
      <path d="M12 8c0-2 1.5-4 4-4 0 2-1.5 4-4 4ZM12 8c0-2-1.5-4-4-4 0 2 1.5 4 4 4ZM12 13c0-2 1.5-3.5 4-3.5 0 2-1.5 3.5-4 3.5ZM12 13c0-2-1.5-3.5-4-3.5 0 2 1.5 3.5 4 3.5Z" />
    </svg>
  ),
  Microscope: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 18h10M9 18V9M9 9a3 3 0 0 1 6 0v1a3 3 0 0 1-6 0V9Z" />
      <path d="M4 21h12M14 14a5 5 0 0 1 2 7" />
    </svg>
  ),
  Wrench: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M15 6a4 4 0 0 0-5 5L4 17l3 3 6-6a4 4 0 0 0 5-5l-2.5 2.5L13 8l2-2Z" />
    </svg>
  ),
  Mail: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ),
  Play: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M8 5v14l11-7-11-7Z" />
    </svg>
  ),
  Pencil: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M13.5 6.5l3 3" />
    </svg>
  ),
  Newspaper: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 6a2 2 0 0 1 2-2h11v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V6Z" />
      <path d="M17 8h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2M8 8h6M8 12h6M8 16h4" />
    </svg>
  ),
  Image: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="M20 15l-4-4-8 8" />
    </svg>
  ),
  User: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  ),
  Trash: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </svg>
  ),
  Upload: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 15V4M8 8l4-4 4 4M5 20h14" />
    </svg>
  ),
};

export type IconName = keyof typeof Icon;
