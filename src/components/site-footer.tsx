import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./ui";
import { primaryNav, authNav, site } from "@/data/site";

const exploreLinks = [
  { label: "About the project", href: "/#about" },
  { label: "Our team", href: "/#team" },
];

const accountLinks = [
  { label: authNav.signup.label, href: authNav.signup.href },
  { label: authNav.login.label, href: authNav.login.href },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-forest text-mint-100">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo variant="light" className="text-[14px]" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mint-100/70">
              {site.description}
            </p>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mint/60">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-mint-100/85 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mint/60">
              Account
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {accountLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-mint-100/85 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-mint-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.location}.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
