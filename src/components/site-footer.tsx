import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./ui";
import { Icon } from "./icons";
import { authNav } from "@/data/site";
import type { SiteContent } from "@/lib/content/schema";

const exploreLinks = [
  { label: "News", href: "/news" },
  { label: "About the project", href: "/#about" },
  { label: "Our team", href: "/team" },
];

const accountLinks = [
  { label: authNav.signup.label, href: authNav.signup.href },
  { label: authNav.login.label, href: authNav.login.href },
];

export function SiteFooter({ settings }: { settings: SiteContent["settings"] }) {
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "Facebook", href: settings.facebook },
    { label: "YouTube", href: settings.youtube },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 bg-forest text-mint-100">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" className="text-[14px]" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mint-100/70">{settings.description}</p>
          </div>

          <FooterList title="Explore" links={exploreLinks} />
          <FooterList title="Account" links={accountLinks} />

          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mint/60">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="inline-flex items-center gap-2 text-mint-100/85 transition-colors hover:text-white"
                  >
                    <Icon.Mail className="h-4 w-4" /> {settings.email}
                  </a>
                </li>
              ) : null}
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mint-100/85 transition-colors hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-mint-100/70">
          <p>
            © {new Date().getFullYear()} {settings.name}
            {settings.location ? `. ${settings.location}.` : "."}
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mint/60">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-mint-100/85 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
