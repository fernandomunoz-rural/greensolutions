import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { AdminPage, SetupNotice, StatusPill, btnPrimary, cardCls, timeAgo } from "@/components/admin/ui";
import { requirePage, isMissingTable } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminHome() {
  const { supabase, viewer } = await requirePage("staff", "/admin");

  // Editors only see their own articles (RLS also enforces this).
  let postsQuery = supabase
    .from("posts")
    .select("id, title, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(5);
  let draftsQuery = supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft");
  if (!viewer.isAdmin) {
    postsQuery = postsQuery.eq("author_id", viewer.userId);
    draftsQuery = draftsQuery.eq("author_id", viewer.userId);
  }

  const [posts, published, drafts, team, version, draft] = await Promise.all([
    postsQuery,
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    draftsQuery,
    viewer.isAdmin
      ? supabase.from("team_members").select("id, is_active")
      : Promise.resolve({ data: null, error: null }),
    viewer.isAdmin
      ? supabase.from("site_content_versions").select("id, published_at").order("id", { ascending: false }).limit(1).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    viewer.isAdmin
      ? supabase.from("site_content_draft").select("updated_at").eq("id", 1).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const needsSetup = viewer.isAdmin && (isMissingTable(team.error) || isMissingTable(version.error));
  const teamRows = (team.data ?? []) as { is_active: boolean }[];
  const first = viewer.fullName?.split(" ")[0];

  const cards: { href: string; icon: IconName; title: string; value: string; note: string; admin?: boolean }[] = [
    {
      href: "/admin/articles",
      icon: "Newspaper",
      title: "Articles",
      value: String(published.count ?? 0),
      note: `published on the site · ${drafts.count ?? 0} draft${drafts.count === 1 ? "" : "s"}${viewer.isAdmin ? "" : " of yours"}`,
    },
    {
      href: "/admin/content",
      icon: "Layout",
      title: "Site content",
      value: version.data ? `v${version.data.id}` : "Built-in",
      note: draft.data ? "unpublished changes waiting" : version.data ? `published ${timeAgo(version.data.published_at)}` : "nothing published yet",
      admin: true,
    },
    {
      href: "/admin/team",
      icon: "Users",
      title: "Team",
      value: String(teamRows.filter((t) => t.is_active).length),
      note: `on the website${teamRows.some((t) => !t.is_active) ? ` · ${teamRows.filter((t) => !t.is_active).length} hidden` : ""}`,
      admin: true,
    },
  ];

  return (
    <AdminPage
      title={first ? `Welcome back, ${first}` : "Dashboard"}
      intro="Manage what the public sees on Green Solutions."
      actions={
        <Link href="/admin/articles/new" className={btnPrimary}>
          <Icon.Plus className="h-4 w-4" /> New article
        </Link>
      }
    >
      {needsSetup ? (
        <div className="mb-6">
          <SetupNotice />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {cards
          .filter((c) => viewer.isAdmin || !c.admin)
          .map((c) => {
            const I = Icon[c.icon];
            return (
              <Link key={c.href} href={c.href} className={`${cardCls} group p-5 transition-colors hover:border-forest/25`}>
                <span className="flex items-center justify-between text-sm font-semibold text-ink/60">
                  {c.title}
                  <I className="h-5 w-5 text-leaf" />
                </span>
                <span className="font-display mt-3 block text-3xl font-semibold text-forest">{c.value}</span>
                <span className="mt-1 block text-xs text-ink/50">{c.note}</span>
              </Link>
            );
          })}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-forest">
            {viewer.isAdmin ? "Recently edited articles" : "Your recent articles"}
          </h2>
          <Link href="/admin/articles" className="text-sm font-semibold text-leaf hover:text-forest">
            All articles
          </Link>
        </div>
        <ul className={`${cardCls} mt-3 divide-y divide-line overflow-hidden`}>
          {(posts.data ?? []).map((p) => (
            <li key={p.id}>
              <Link href={`/admin/articles/${p.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-paper/60">
                <span className="truncate text-sm font-medium text-forest">{p.title}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-xs text-ink/45 sm:inline">{timeAgo(p.updated_at)}</span>
                  <StatusPill tone={p.status === "published" ? "live" : "draft"}>
                    {p.status === "published" ? "Published" : "Draft"}
                  </StatusPill>
                </span>
              </Link>
            </li>
          ))}
          {(posts.data ?? []).length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-ink/55">No articles yet.</li>
          ) : null}
        </ul>
      </section>
    </AdminPage>
  );
}
