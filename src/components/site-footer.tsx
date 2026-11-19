import { Logo } from "./logo";
import { PICTURE_CREDITS } from "@/data/credits";
import type { SiteContent } from "@/lib/content/schema";

const links = [
  { label: "News", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "What we do", href: "/#about" },
  { label: "Create an account", href: "/signup" },
];

/** "Contact as the headline": the email address is the close of every page. */
export function SiteFooter({ settings }: { settings: SiteContent["settings"] }) {
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "Facebook", href: settings.facebook },
    { label: "YouTube", href: settings.youtube },
  ].filter((s) => s.href);
  const [user, domain] = settings.email.split("@");

  return (
    <footer className="flex min-h-[90svh] flex-col bg-field px-[var(--margin)] pb-8 pt-[clamp(6rem,14vw,10rem)] text-on-field">
      <div className="flex flex-wrap items-start justify-between gap-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-12">
          <Logo variant="light" className="text-[12px]" />
          <p className="max-w-[38ch] text-[length:var(--text-body)] text-on-field">{settings.description}</p>
          {settings.location ? <p className="text-[length:var(--text-body)] text-on-field">{settings.location}</p> : null}
        </div>
        <a href="#" className="text-[length:var(--text-small)] underline decoration-1 underline-offset-4 hover:text-accent">
          Back to top
        </a>
      </div>

      <div className="mt-auto pt-24">
        {settings.email ? (
          <a
            href={`mailto:${settings.email}`}
            className="display block break-words text-[clamp(2.4rem,0.5rem+7.6vw,9rem)] leading-[0.95] transition-colors hover:text-accent"
          >
            {user}
            <wbr />@{domain}
          </a>
        ) : null}

        <div className="mt-12 grid gap-6 text-[length:var(--text-small)] text-on-field lg:grid-cols-[1fr_2fr_auto]">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {[...links, ...socials].map((l) => (
              <a key={l.label} href={l.href} className="text-on-field underline decoration-1 underline-offset-4 hover:text-accent" {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {l.label}
              </a>
            ))}
          </nav>
          <p className="text-[length:var(--text-body)] text-on-field">
            Pictures: botanical plates by{" "}
            <a href={PICTURE_CREDITS[0].href} className="underline decoration-1 underline-offset-2 hover:text-accent" target="_blank" rel="noopener noreferrer">
              F. M. Blanco
            </a>{" "}
            (Flora de Filipinas) and{" "}
            <a href={PICTURE_CREDITS[1].href} className="underline decoration-1 underline-offset-2 hover:text-accent" target="_blank" rel="noopener noreferrer">
              Prospero Alpino
            </a>
            , public domain; Staniel Cay by{" "}
            <a href={PICTURE_CREDITS[6].href} className="underline decoration-1 underline-offset-2 hover:text-accent" target="_blank" rel="noopener noreferrer">
              cogdogblog
            </a>
            , CC0. Via Wikimedia Commons. Type: Sentient, Indian Type Foundry.
          </p>
          <p>
            {settings.name}, {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
