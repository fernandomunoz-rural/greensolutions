import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { PostCard } from "@/components/cards";
import { Avatar } from "@/components/avatar";
import { Markdown } from "@/components/markdown";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, formatDate, readMinutes, type Post } from "@/lib/posts";

export const dynamic = "force-dynamic";

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_WITH_AUTHOR)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as Post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.cover_url ? { images: [post.cover_url] } : undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // A few more recent posts to keep readers going.
  const supabase = await createClient();
  const { data: moreData } = await supabase
    .from("posts")
    .select(POST_WITH_AUTHOR)
    .eq("status", "published")
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(3);
  const more = (moreData ?? []) as unknown as Post[];

  return (
    <article>
      <Container className="pt-[clamp(2.5rem,7vw,6rem)]">
        <h1 className="animate-fade-in display max-w-[22ch] text-[2.1rem] sm:text-[clamp(2.5rem,1rem+4.6vw,6rem)]">
          {post.title}
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="flex items-center gap-3 text-[length:var(--text-small)] text-ink-soft lg:col-span-3 lg:flex-col lg:items-start">
            <Avatar src={post.author?.avatar_url} name={post.author?.full_name} className="h-11 w-11 text-sm" />
            <p>
              <span className="block text-ink">{post.author?.full_name ?? "Green Solutions"}</span>
              {[post.category, formatDate(post.published_at), `${readMinutes(post.body)} min read`].filter(Boolean).join(" · ")}
              <Link href="/news" className="mt-1 block text-ink underline decoration-1 underline-offset-4 hover:text-field">
                All news
              </Link>
            </p>
          </div>
          {post.excerpt ? (
            <p className="max-w-[36ch] text-[length:var(--text-lead)] leading-snug text-ink lg:col-span-9">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </Container>

      {post.cover_url ? (
        <div data-reveal className="mt-14 px-[var(--margin)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded storage URL */}
          <img src={post.cover_url} alt="" className="mx-auto max-h-[80svh] w-full max-w-[1440px] object-cover" />
        </div>
      ) : null}

      {/* Body — Markdown with raw HTML dropped (see components/markdown.tsx). */}
      <Container className="py-[clamp(3rem,7vw,6rem)]">
        <div data-reveal className="lg:ml-[calc(3/12*100%)]">
          {post.body.trim() ? (
            <Markdown source={post.body} className="max-w-[68ch]" />
          ) : (
            <p className="text-ink-soft">This post has no content yet.</p>
          )}
        </div>
      </Container>

      {more.length > 0 ? (
        <section className="bg-ground-2 py-[clamp(5rem,10vw,8rem)]">
          <Container>
            <h2 data-reveal className="display text-[length:var(--text-head)]">More from the field</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p, i) => (
                <div key={p.id} data-reveal style={{ ["--i" as string]: i }}>
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
