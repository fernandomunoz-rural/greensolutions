"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { Button } from "./ui";
import { Avatar } from "./avatar";
import { signOut } from "@/app/auth/actions";
import { primaryNav, authNav } from "@/data/site";

/**
 * Fixed bar. Over the home page's photo it is transparent with white text;
 * once the page scrolls it turns into frosted limestone, and it tucks away
 * while scrolling down and returns when scrolling up.
 */
export function SiteHeader({
  isAuthed = false,
  isStaff = false,
  avatarUrl = null,
  fullName = null,
}: {
  isAuthed?: boolean;
  isStaff?: boolean;
  avatarUrl?: string | null;
  fullName?: string | null;
}) {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so it closes on navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setPastHero(y > window.innerHeight - 96);
      if (y > 320 && y > last + 2) setHidden(true);
      else if (y < last - 2 || y <= 320) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const light = pathname === "/" && !pastHero;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/#.*/, "")) && !href.includes("#");
  const link = (active: boolean) =>
    `group relative py-2 text-[length:var(--text-small)] font-medium transition-[color,opacity] ${light ? "text-white" : "text-ink"} ${active ? "" : "opacity-75 hover:opacity-100"}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-500 ease-[var(--ease-out)] ${
        hidden && !open ? "-translate-y-full" : ""
      } ${scrolled && !light && !open ? "bg-ground/85 backdrop-blur-xl" : ""}`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-6 px-[var(--gutter)]">
        <Logo variant={light || open ? "light" : "dark"} className="relative z-10 text-[15px]" />

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={link(isActive(item.href))}>
              <span className={`line-link ${isActive(item.href) ? "bg-[length:100%_1px]" : ""}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          {isAuthed ? (
            <>
              {isStaff ? (
                <Link href="/admin" className={link(isActive("/admin"))}>
                  <span className="line-link">Admin</span>
                </Link>
              ) : null}
              <form action={signOut}>
                <button type="submit" className={link(false)}>
                  <span className="line-link">Log out</span>
                </button>
              </form>
              <Link href="/account" aria-label="Your account" className="press rounded-full">
                <Avatar src={avatarUrl} name={fullName} className="h-10 w-10" />
              </Link>
            </>
          ) : (
            <>
              <Link href={authNav.login.href} className={link(isActive(authNav.login.href))}>
                <span className="line-link">{authNav.login.label}</span>
              </Link>
              <Button href={authNav.signup.href} variant={light ? "light" : "primary"} arrow>
                {authNav.signup.label}
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpenOn(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="site-menu"
          className={`press relative z-10 flex h-11 items-center gap-3 rounded-full px-5 text-[length:var(--text-small)] font-medium md:hidden ${
            light || open ? "bg-white/15 text-white backdrop-blur-md" : "bg-ink text-ground"
          }`}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true" className="relative block h-2.5 w-4">
            <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? "top-1 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? "top-1 -rotate-45" : "top-2"}`} />
          </span>
        </button>
      </div>

      {/* Always mounted; opened and closed with CSS transitions so it always settles. */}
      <nav
        id="site-menu"
        aria-label="Main"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
        className={`fixed inset-0 flex flex-col bg-field px-[var(--gutter)] pb-10 pt-28 text-white duration-700 ease-[var(--ease-out)] md:hidden ${
          open
            ? "visible transition-[clip-path] [clip-path:inset(0_0_0_0)]"
            : "invisible transition-[clip-path,visibility] [clip-path:inset(0_0_100%_0)]"
        }`}
      >
            <ul className="space-y-1">
              {[...primaryNav, ...(isAuthed && isStaff ? [{ label: "Admin", href: "/admin" }] : [])].map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <div
                    className={`transition-transform duration-[800ms] ease-[var(--ease-out)] ${open ? "translate-y-0" : "translate-y-[110%]"}`}
                    style={{ transitionDelay: open ? `${150 + i * 60}ms` : "0ms" }}
                  >
                    <Link href={item.href} onClick={() => setOpenOn(null)} className="display block py-1 text-[3.25rem]">
                      {item.label}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            <div
              className={`mt-auto flex flex-col gap-3 transition-[opacity,transform] duration-[600ms] ease-[var(--ease-out)] ${
                open ? "translate-y-0 opacity-100 delay-[450ms]" : "translate-y-5 opacity-0"
              }`}
            >
              {isAuthed ? (
                <>
                  <Link href="/account" onClick={() => setOpenOn(null)} className="flex items-center gap-3">
                    <Avatar src={avatarUrl} name={fullName} className="h-10 w-10 text-xs" />
                    Your account
                  </Link>
                  <form action={signOut}>
                    <button type="submit" className="underline decoration-1 underline-offset-4">
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Button href={authNav.signup.href} variant="accent" size="lg" arrow onClick={() => setOpenOn(null)} className="w-full">
                    {authNav.signup.label}
                  </Button>
                  <Button href={authNav.login.href} variant="outline-light" size="lg" onClick={() => setOpenOn(null)} className="w-full">
                    {authNav.login.label}
                  </Button>
                </>
              )}
            </div>
      </nav>
    </header>
  );
}
