import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";

export const inputCls =
  "mt-1.5 w-full rounded-[4px] border border-line bg-white px-3.5 py-2.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-forest focus:ring-2 focus:ring-forest/15 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-200";
export const labelCls = "text-sm font-medium text-ink";
export const helpCls = "mt-1 text-xs text-ink/50";
export const cardCls = "rounded-[6px] bg-white";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-[4px] bg-field px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50";
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-[4px] bg-ground-2 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-50";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-[4px] bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50";
export const iconBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink/55 transition-colors hover:bg-forest/[0.06] hover:text-forest disabled:pointer-events-none disabled:opacity-30";

export function AdminPage({
  title,
  intro,
  actions,
  back,
  children,
}: {
  title: string;
  intro?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      {back ? (
        <Link
          href={back.href}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest"
        >
          <Icon.ArrowLeft className="h-4 w-4" /> {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[2rem] leading-tight text-ink sm:text-[2.5rem]">{title}</h1>
          {intro ? <p className="mt-1 max-w-2xl text-sm text-ink/60">{intro}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function EmptyState({
  icon: I = Icon.Leaf,
  title,
  body,
  action,
}: {
  icon?: (p: { className?: string }) => ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className={`${cardCls} px-6 py-14 text-center`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/[0.06] text-forest">
        <I className="h-6 w-6" />
      </span>
      <p className="mt-4 font-serif text-xl text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink/60">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

/** Shown when the admin tables haven't been created on this database yet. */
export function SetupNotice() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      <p className="font-semibold">One-time database setup needed</p>
      <p className="mt-1">
        Open the Supabase dashboard → SQL Editor → New query, paste the contents of{" "}
        <code className="rounded bg-white/70 px-1">supabase/admin.sql</code> and press Run. Then reload this
        page. Until then the public site keeps showing its built-in text.
      </p>
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "live" | "draft" | "hidden" | "neutral"; children: ReactNode }) {
  const tones = {
    live: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    draft: "bg-amber-50 text-amber-800 ring-amber-200",
    hidden: "bg-ink/[0.05] text-ink/60 ring-ink/10",
    neutral: "bg-forest/[0.06] text-forest ring-forest/10",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ring-1 ${tones[tone]}`}>
      {tone === "live" ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> : null}
      {children}
    </span>
  );
}

export function timeAgo(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value).getTime();
  if (Number.isNaN(d)) return "";
  const s = Math.round((Date.now() - d) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const days = Math.round(h / 24);
  if (days < 30) return `${days} d ago`;
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
