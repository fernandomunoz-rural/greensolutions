import Link from "next/link";
import { Board } from "./ui";
import { PICTURE_CREDITS } from "@/data/credits";
import type { SiteContent } from "@/lib/content/schema";

const links = [
  { label: "News", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "What we do", href: "/#about" },
  { label: "Create an account", href: "/signup" },
  { label: "Log in", href: "/login" },
];

const linkCls = "underline decoration-1 underline-offset-4 hover:text-field";

/** The last row of the board: the name built large, then links, contact and credits as tiles. */
export function SiteFooter({ settings }: { settings: SiteContent["settings"] }) {
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "Facebook", href: settings.facebook },
    { label: "YouTube", href: settings.youtube },
  ].filter((s) => s.href);
  const words = settings.name.trim().split(/\s+/);

  return (
    <footer className="mt-2 pb-2 sm:pb-3">
      <Board>
        <div className="col-span-2 flex min-h-[22rem] flex-col justify-between gap-10 rounded-[8px] bg-field p-6 text-on-field md:col-span-12 lg:col-span-7">
          <p className="max-w-[46ch] text-on-field-soft">{settings.description}</p>
          <p className="display text-[clamp(3.5rem,1rem+8vw,9rem)] uppercase leading-[0.85] text-accent" aria-label={settings.name}>
            {words.map((w, i) => (
              <span key={i} className="block" aria-hidden="true">
                {w}
              </span>
            ))}
          </p>
        </div>

        <nav aria-label="Footer" className="col-span-1 rounded-[8px] bg-ground-2 p-6 md:col-span-4 lg:col-span-2">
          <p className="font-semibold">Site</p>
          <ul className="mt-4 space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-1 rounded-[8px] bg-ground-2 p-6 md:col-span-4 lg:col-span-3">
          <p className="font-semibold">Contact</p>
          <ul className="mt-4 space-y-2">
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className={linkCls}>
                  {settings.email.split("@")[0]}
                  <wbr />@{settings.email.split("@")[1]}
                </a>
              </li>
            ) : null}
            {settings.location ? <li>{settings.location}</li> : null}
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 flex flex-col justify-between gap-6 rounded-[8px] bg-ground-2 p-6 md:col-span-4 lg:hidden">
          <p className="font-semibold">{settings.name}</p>
          <a href="#" className={`${linkCls} text-[length:var(--text-small)]`}>
            Back to top
          </a>
        </div>

        <div className="col-span-2 flex flex-wrap items-start justify-between gap-6 rounded-[8px] bg-ground-2 p-6 text-[length:var(--text-small)] md:col-span-12">
          <p className="max-w-[110ch] text-ink">
            Pictures:{" "}
            {PICTURE_CREDITS.map((c, i) => (
              <span key={c.href}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {c.title}
                </a>{" "}
                by {c.by}, {c.licence}
                {i < PICTURE_CREDITS.length - 1 ? "; " : ". "}
              </span>
            ))}
            Type: Jost by Owen Earl.
          </p>
          <p className="flex gap-6">
            <span>
              © {new Date().getFullYear()} {settings.name}
            </span>
            <a href="#" className={`${linkCls} max-lg:hidden`}>
              Back to top
            </a>
          </p>
        </div>
      </Board>
    </footer>
  );
}
