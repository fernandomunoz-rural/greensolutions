import Link from "next/link";
import { Arrow, Container } from "./ui";
import { PHOTO_CREDITS, PLATE_CREDITS } from "@/data/credits";
import type { SiteContent } from "@/lib/content/schema";

const links = [
  { label: "What to plant", href: "/#calendar" },
  { label: "What we do", href: "/#about" },
  { label: "News", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "Create an account", href: "/signup" },
  { label: "Log in", href: "/login" },
];

/** The close of every page: contact as the headline, then links, then the name built huge. */
export function SiteFooter({ settings }: { settings: SiteContent["settings"] }) {
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "Facebook", href: settings.facebook },
    { label: "YouTube", href: settings.youtube },
  ].filter((s) => s.href);
  const [user, domain] = settings.email.split("@");

  return (
    <footer className="relative mt-[clamp(4rem,8vw,8rem)] overflow-hidden bg-ink text-white">
      <Container className="pt-[clamp(5rem,10vw,9rem)]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p data-reveal className="display text-[length:var(--text-head)]">
              Grow with <em>us.</em>
            </p>
            {settings.email ? (
              <a
                data-reveal
                style={{ ["--i" as string]: 1 }}
                href={`mailto:${settings.email}`}
                className="group mt-8 inline-flex items-center gap-4 text-[clamp(1.25rem,0.9rem+1.4vw,2.25rem)] font-medium tracking-[-0.03em] text-accent"
              >
                <span className="line-link">
                  {user}
                  <wbr />@{domain}
                </span>
                <Arrow />
              </a>
            ) : null}
            <p data-reveal style={{ ["--i" as string]: 2 }} className="mt-8 max-w-[46ch] text-on-field-soft">
              {settings.description}
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-5 md:grid-cols-2">
            <div>
              <p className="text-[length:var(--text-small)] text-on-field-soft">Site</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="line-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[length:var(--text-small)] text-on-field-soft">Follow</p>
              <ul className="mt-4 space-y-2.5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="line-link">
                      {s.label}
                    </a>
                  </li>
                ))}
                {settings.location ? <li className="pt-4 text-on-field-soft">{settings.location}</li> : null}
              </ul>
            </div>
          </nav>
        </div>

        <details className="group/c mt-16 text-[length:var(--text-small)] text-on-field-soft">
          <summary className="cursor-pointer list-none hover:text-white">
            Picture credits <span className="inline-block transition-transform group-open/c:rotate-45">+</span>
          </summary>
          <p className="mt-3 max-w-[120ch] leading-relaxed">
            Photographs:{" "}
            {PHOTO_CREDITS.map((c, i) => (
              <span key={c.href}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-2 hover:text-white">
                  {c.by}
                </a>
                {i < PHOTO_CREDITS.length - 1 ? ", " : ". "}
              </span>
            ))}
            Botanical plates (public domain):{" "}
            {PLATE_CREDITS.map((c, i) => (
              <span key={c.href}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-2 hover:text-white">
                  {c.title}
                </a>{" "}
                by {c.by}
                {i < PLATE_CREDITS.length - 1 ? ", " : ". "}
              </span>
            ))}
            The atmosphere photographs are not of Green Solutions&rsquo; own land or people.
          </p>
        </details>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[length:var(--text-small)] text-on-field-soft">
          <p>
            © {new Date().getFullYear()} {settings.name}
          </p>
          <a href="#" className="line-link hover:text-white">
            Back to top ↑
          </a>
        </div>
      </Container>

      {/* The name, built as large as the page allows and cropped by the bottom edge. */}
      <p
        aria-hidden="true"
        className="display pointer-events-none -mb-[0.2em] select-none whitespace-nowrap px-[var(--gutter)] text-center text-[12.4vw] leading-[0.8] text-[#1f4d3a]"
      >
        {settings.name}
      </p>
    </footer>
  );
}
