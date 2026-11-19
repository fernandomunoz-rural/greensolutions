"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/avatar";
import { Icon, type IconName } from "@/components/icons";
import { signOut } from "@/app/auth/actions";

type NavItem = { href: string; label: string; icon: IconName; adminOnly?: boolean };

const NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: "Home" }],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/articles", label: "Articles", icon: "Newspaper" },
      { href: "/admin/content", label: "Site content", icon: "Layout", adminOnly: true },
      { href: "/admin/team", label: "Team", icon: "Users", adminOnly: true },
    ],
  },
  {
    heading: "Access",
    items: [{ href: "/admin/users", label: "Users & roles", icon: "Shield", adminOnly: true }],
  },
];

export function AdminShell({
  children,
  isAdmin,
  fullName,
  avatarUrl,
  role,
}: {
  children: ReactNode;
  isAdmin: boolean;
  fullName: string | null;
  avatarUrl: string | null;
  role: string;
}) {
  const pathname = usePathname();
  // The drawer remembers the page it was opened on, so it closes by itself
  // as soon as the route changes.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-1 flex-col gap-7 px-3 py-6">
      {NAV.map((group) => {
        const items = group.items.filter((i) => isAdmin || !i.adminOnly);
        if (items.length === 0) return null;
        return (
          <div key={group.heading}>
            <p className="px-3 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-ink/40">
              {group.heading}
            </p>
            <ul className="mt-2 space-y-0.5">
              {items.map((item) => {
                const I = Icon[item.icon];
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active ? "bg-forest text-white" : "text-ink/70 hover:bg-forest/[0.05] hover:text-forest"
                      }`}
                    >
                      <I className="h-[1.1rem] w-[1.1rem]" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <div className="mt-auto space-y-0.5 border-t border-line pt-5">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-forest/[0.05] hover:text-forest"
        >
          <Icon.External className="h-[1.1rem] w-[1.1rem]" /> View site
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-ink/70 hover:bg-forest/[0.05] hover:text-forest"
          >
            <Icon.LogOut className="h-[1.1rem] w-[1.1rem]" /> Log out
          </button>
        </form>
      </div>
    </nav>
  );

  const who = (
    <Link href="/account" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-forest/[0.04]">
      <Avatar src={avatarUrl} name={fullName} className="h-8 w-8 text-xs" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-forest">{fullName ?? "Your account"}</span>
        <span className="block text-xs capitalize text-ink/50">{role}</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[15.5rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-line px-6">
          <Logo className="text-[13px]" />
          <span className="rounded bg-forest/[0.07] px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-forest">
            Admin
          </span>
        </div>
        {nav}
        <div className="border-t border-line p-3">{who}</div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <Logo className="text-[12px]" />
          <span className="rounded bg-forest/[0.07] px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-forest">
            Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-forest hover:bg-forest/5"
        >
          <Icon.Menu className="h-6 w-6" />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              {who}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-forest hover:bg-forest/5"
              >
                <Icon.X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">{nav}</div>
          </div>
        </div>
      ) : null}

      <div className="min-w-0">{children}</div>
    </div>
  );
}
