"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./logo";
import { Button } from "./ui";
import { Avatar } from "./avatar";
import { signOut } from "@/app/auth/actions";
import { primaryNav, authNav } from "@/data/site";

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
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo className="text-[14px]" />

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-forest"
                  : "text-ink/60 hover:text-forest"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthed ? (
            <>
              {isStaff ? (
                <Link
                  href="/admin"
                  className={`rounded-md px-3.5 py-2 text-sm font-semibold transition-colors ${
                    isActive("/admin")
                      ? "text-forest"
                      : "text-ink/60 hover:text-forest"
                  }`}
                >
                  Admin
                </Link>
              ) : null}
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md px-3.5 py-2 text-sm font-semibold text-ink/60 transition-colors hover:text-forest"
                >
                  Log out
                </button>
              </form>
              <Link
                href="/account"
                aria-label="Your account"
                className="rounded-full ring-offset-2 ring-offset-paper transition-shadow hover:ring-2 hover:ring-forest/20"
              >
                <Avatar src={avatarUrl} name={fullName} className="h-9 w-9" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href={authNav.login.href}
                className="rounded-md px-3.5 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest/[0.05]"
              >
                {authNav.login.label}
              </Link>
              <Button href={authNav.signup.href} size="md">
                {authNav.signup.label}
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-forest hover:bg-forest/5 lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-paper lg:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-5 py-4 sm:px-8">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-forest/[0.06] text-forest"
                    : "text-ink/75 hover:bg-forest/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthed ? (
              <>
                {isStaff ? (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-semibold text-forest hover:bg-forest/5"
                  >
                    Admin
                  </Link>
                ) : null}
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold text-forest hover:bg-forest/5"
                >
                  <Avatar src={avatarUrl} name={fullName} className="h-7 w-7 text-xs" />
                  Account
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-lg px-4 py-3 text-left text-base font-semibold text-ink/75 hover:bg-forest/5"
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href={authNav.login.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-forest hover:bg-forest/5"
                >
                  {authNav.login.label}
                </Link>
                <Button
                  href={authNav.signup.href}
                  size="lg"
                  className="mt-2 w-full"
                  onClick={() => setOpen(false)}
                >
                  {authNav.signup.label}
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
