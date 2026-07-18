import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Badge, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type Post } from "@/lib/posts";

export const metadata: Metadata = { title: "Content Studio" };
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.role === "admin";
  const isStaff = isAdmin || profile?.role === "editor";
  if (!isStaff) redirect("/account");

  // Admins manage everything; editors manage their own posts.
  let query = supabase
    .from("posts")
    .select("id, title, slug, status, category, published_at, updated_at, body")
    .order("updated_at", { ascending: false });
  if (!isAdmin) query = query.eq("author_id", user.id);
  const { data } = await query;
  const posts = (data ?? []) as unknown as Post[];

  return (
    <Container className="py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest">
            Content Studio
          </h1>
          <p className="mt-1 text-ink/60">
            Write, edit, and publish posts to the news feed.
          </p>
        </div>
        <Button href="/studio/new">
          <Icon.Plus className="h-4 w-4" /> New post
        </Button>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
        {posts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/[0.06] text-forest">
              <Icon.Newspaper className="h-6 w-6" />
            </span>
            <p className="font-display mt-4 text-lg font-semibold text-forest">
              No posts yet
            </p>
            <p className="mt-1.5 text-sm text-ink/60">
              Create your first post to get the news feed going.
            </p>
            <Button href="/studio/new" className="mt-6">
              <Icon.Plus className="h-4 w-4" /> New post
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="truncate font-semibold text-forest">
                      {post.title}
                    </span>
                    {post.status === "published" ? (
                      <Badge tone="leaf">Published</Badge>
                    ) : (
                      <Badge tone="sand">Draft</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {post.category ? `${post.category} · ` : ""}
                    {post.status === "published" && post.published_at
                      ? `Published ${formatDate(post.published_at)}`
                      : `Updated ${formatDate(post.updated_at)}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {post.status === "published" ? (
                    <Link
                      href={`/news/${post.slug}`}
                      className="rounded-md px-3 py-1.5 text-sm font-semibold text-ink/55 transition-colors hover:text-forest"
                    >
                      View
                    </Link>
                  ) : null}
                  <Link
                    href={`/studio/${post.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-forest transition-colors hover:bg-forest/[0.04]"
                  >
                    <Icon.Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
