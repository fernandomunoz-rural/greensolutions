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
  Users: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5" />
      <path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.7.8 2.9 2.6 3.5 5.2" />
    </svg>
  ),
  Layout: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M3.5 9h17M10 9v11" />
    </svg>
  ),
  Home: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-8Z" />
    </svg>
  ),
  Eye: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  ),
  EyeOff: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 4l16 16M10.6 6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.7 3.4M6.6 7.4C4 9.2 2.5 12 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1" />
      <path d="M9.9 10a2.8 2.8 0 0 0 4 4" />
    </svg>
  ),
  ArrowUp: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  ),
  ArrowDown: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  ),
  History: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5" />
      <path d="M3.5 4v4.5H8M12 8v4.5l3 2" />
    </svg>
  ),
  External: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  X: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Linkedin: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6V16" />
    </svg>
  ),
  Bold: (p: IconProps) => (
    <svg {...base(p)} strokeWidth={2.2}>
      <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7V5ZM7 12h7a3.5 3.5 0 0 1 0 7H7v-7Z" />
    </svg>
  ),
  Italic: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M10 5h8M6 19h8M14.5 5l-5 14" />
    </svg>
  ),
  Heading: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 5v14M18 5v14M6 12h12" />
    </svg>
  ),
  List: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.1M4.5 12h.1M4.5 17.5h.1" />
    </svg>
  ),
  ListOrdered: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M10 6.5h10M10 12h10M10 17.5h10M4 5l1.5-1v5M4 14.5c0-.8.7-1.5 1.5-1.5s1.5.6 1.5 1.3c0 1.2-3 1.7-3 3.7h3" />
    </svg>
  ),
  Quote: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 18c2.5-1 4-3 4-6V7H4.5v5H8M15 18c2.5-1 4-3 4-6V7h-4.5v5H18" />
    </svg>
  ),
  Link: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  ),
  LogOut: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h10" />
    </svg>
  ),
};

export type IconName = keyof typeof Icon;
