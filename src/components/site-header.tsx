"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./logo";
import { Button } from "./ui";
import { Avatar } from "./avatar";
import { signOut } from "@/app/auth/actions";
import { primaryNav, authNav } from "@/data/site";

/** A plain bar: wordmark, a few links, one action. No chrome. */
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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/#.*/, "")) && !href.includes("#"));
  const link = (active: boolean) =>
    `rounded-[8px] px-3 py-2 text-[length:var(--text-small)] font-medium transition-colors ${active ? "bg-ground text-ink" : "text-ink hover:bg-ground-3"}`;

  return (
    <header className="relative z-50 mx-auto w-full max-w-[1680px] px-2 pt-2 sm:px-3">
      <div className="flex h-16 items-center justify-between gap-6 rounded-[8px] bg-ground-2 pl-6 pr-2">
        <Logo className="text-[14px]" />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={link(isActive(item.href))}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          {isAuthed ? (
            <>
              {isStaff ? (
                <Link href="/admin" className={link(isActive("/admin"))}>
                  Admin
                </Link>
              ) : null}
              <form action={signOut}>
                <button type="submit" className={link(false)}>
                  Log out
                </button>
              </form>
              <Link href="/account" aria-label="Your account" className="press rounded-full">
                <Avatar src={avatarUrl} name={fullName} className="h-9 w-9" />
              </Link>
            </>
          ) : (
            <>
              <Link href={authNav.login.href} className={link(isActive(authNav.login.href))}>
                {authNav.login.label}
              </Link>
              <Button href={authNav.signup.href}>{authNav.signup.label}</Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {isAuthed ? null : (
            <Button href={authNav.signup.href} className="h-10 px-4">
              {authNav.signup.label}
            </Button>
          )}
        <button
          type="button"
          onClick={() => setOpenOn(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="press h-11 rounded-[8px] bg-ground px-4 text-[length:var(--text-small)] font-medium text-ink"
        >
          {open ? "Close" : "Menu"}
        </button>
        </div>
      </div>

      {open ? (
        <nav id="site-menu" aria-label="Main" className="absolute inset-x-2 top-full z-50 mt-2 rounded-[8px] bg-ground-2 p-6 shadow-[var(--shadow-float)] sm:inset-x-3 md:hidden" /* taste-skill-ignore: the open menu floats over the page */>
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpenOn(null)} className="display block py-2 text-[2.25rem]">
                  {item.label}
                </Link>
              </li>
            ))}
            {isAuthed && isStaff ? (
              <li>
                <Link href="/admin" onClick={() => setOpenOn(null)} className="display block py-2 text-[2.25rem]">
                  Admin
                </Link>
              </li>
            ) : null}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            {isAuthed ? (
              <>
                <Link href="/account" onClick={() => setOpenOn(null)} className="flex items-center gap-3">
                  <Avatar src={avatarUrl} name={fullName} className="h-9 w-9 text-xs" />
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
                <Button href={authNav.signup.href} size="lg" onClick={() => setOpenOn(null)} className="w-full">
                  {authNav.signup.label}
                </Button>
                <Link href={authNav.login.href} onClick={() => setOpenOn(null)} className="underline decoration-1 underline-offset-4">
                  {authNav.login.label}
                </Link>
              </>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
