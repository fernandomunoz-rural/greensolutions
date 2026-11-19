import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { AdminPage, EmptyState, StatusPill, btnPrimary, cardCls, timeAgo } from "@/components/admin/ui";
import { requirePage } from "@/lib/admin/auth";
import { formatDate } from "@/lib/posts";

export const metadata: Metadata = { title: "Articles" };

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  category: string | null;
  cover_url: string | null;
  published_at: string | null;
  updated_at: string;
  author: { full_name: string | null } | null;
};

const SAVED: Record<string, string> = {
  published: "Article saved and published.",
  draft: "Draft saved.",
  deleted: "Article deleted.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; status?: string }>;
}) {
  const { saved, status } = await searchParams;
  const { supabase, viewer } = await requirePage("staff", "/admin/articles");

  // Admins manage everything; editors manage their own articles.
  let query = supabase
    .from("posts")
    .select(
      "id, title, slug, status, category, cover_url, published_at, updated_at, author:profiles!posts_author_id_fkey(full_name)",
    )
    .order("updated_at", { ascending: false });
  if (!viewer.isAdmin) query = query.eq("author_id", viewer.userId);
  if (status === "draft" || status === "published") query = query.eq("status", status);
  const { data } = await query;
  const posts = (data ?? []) as unknown as Row[];

  const tabs = [
    { label: "All", value: undefined },
    { label: "Published", value: "published" },
    { label: "Drafts", value: "draft" },
  ];

  return (
    <AdminPage
      title="Articles"
      intro={
        viewer.isAdmin
          ? "Everything published to News. Drafts are only visible here."
          : "Your articles. Drafts are only visible to you and admins."
      }
      actions={
        <Link href="/admin/articles/new" className={btnPrimary}>
          <Icon.Plus className="h-4 w-4" /> New article
        </Link>
      }
    >
      {saved && SAVED[saved] ? (
        <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800">
          {SAVED[saved]}
        </p>
      ) : null}

      <div className="mb-4 flex gap-1">
        {tabs.map((t) => {
          const active = status === t.value || (!status && !t.value);
          return (
            <Link
              key={t.label}
              href={t.value ? `/admin/articles?status=${t.value}` : "/admin/articles"}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                active ? "bg-forest/[0.08] text-forest" : "text-ink/55 hover:text-forest"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={Icon.Newspaper}
          title={status ? "Nothing here" : "No articles yet"}
          body="Write your first article: guides, announcements, stories from the field."
          action={
            <Link href="/admin/articles/new" className={btnPrimary}>
              <Icon.Plus className="h-4 w-4" /> New article
            </Link>
          }
        />
      ) : (
        <ul className={`${cardCls} divide-y divide-line overflow-hidden`}>
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
              <div className="hidden h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-leaf to-forest sm:block">
                {post.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- storage URL
                  <img src={post.cover_url} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/articles/${post.id}`}
                  className="block truncate font-semibold text-forest hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink/50">
                  {post.status === "published" ? (
                    <StatusPill tone="live">Published</StatusPill>
                  ) : (
                    <StatusPill tone="draft">Draft</StatusPill>
                  )}
                  {post.category ? <span>{post.category}</span> : null}
                  {viewer.isAdmin && post.author?.full_name ? <span>by {post.author.full_name}</span> : null}
                  <span>
                    {post.status === "published" && post.published_at
                      ? formatDate(post.published_at)
                      : `edited ${timeAgo(post.updated_at)}`}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {post.status === "published" ? (
                  <Link
                    href={`/news/${post.slug}`}
                    target="_blank"
                    className="hidden rounded-md px-2.5 py-1.5 text-sm font-semibold text-ink/55 hover:text-forest sm:inline-flex"
                  >
                    View
                  </Link>
                ) : null}
                <Link
                  href={`/admin/articles/${post.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-forest hover:bg-forest/[0.04]"
                >
                  <Icon.Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  );
}
