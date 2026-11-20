import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink, Container } from "@/components/ui";
import { PostCard, PostPicture } from "@/components/cards";
import { Avatar } from "@/components/avatar";
import { Markdown } from "@/components/markdown";
import { Split } from "@/components/motion/split";
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
      <Container className="pt-[clamp(8rem,14vw,12rem)]">
        <Link
          href="/news"
          className="group animate-fade-in inline-flex items-center gap-2 text-[length:var(--text-small)] font-medium text-ink-soft hover:text-ink"
        >
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          <span className="line-link">All news</span>
        </Link>
        <Split as="h1" immediate text={post.title} className="display mt-8 max-w-[20ch] text-[clamp(2.5rem,1.2rem+5vw,6.5rem)]" />
        <div className="mt-10 grid gap-6 md:grid-cols-12 md:items-end">
          {post.excerpt ? (
            <p className="animate-fade-in max-w-[40ch] text-[length:var(--text-lead)] leading-snug text-ink-soft [animation-delay:350ms] md:col-span-7">
              {post.excerpt}
            </p>
          ) : null}
          <div className="animate-fade-in flex items-center gap-3 [animation-delay:500ms] md:col-span-5 md:justify-self-end">
            <Avatar src={post.author?.avatar_url} name={post.author?.full_name} className="h-11 w-11 shrink-0 text-sm" />
            <p className="text-[length:var(--text-small)] text-ink-soft">
              <span className="block font-medium text-ink">{post.author?.full_name ?? "Green Solutions"}</span>
              {[post.category, formatDate(post.published_at), `${readMinutes(post.body)} min read`].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </Container>

      <Container className="mt-[clamp(2.5rem,5vw,4rem)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] md:aspect-[21/9]">
          <PostPicture post={post} sizes="100vw" priority />
        </div>
      </Container>

      {/* Body — Markdown with raw HTML dropped (see components/markdown.tsx). */}
      <Container className="py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[68ch]">
          {post.body.trim() ? (
            <Markdown source={post.body} />
          ) : (
            <p className="text-ink-soft">This post has no content yet.</p>
          )}
        </div>
      </Container>

      {more.length > 0 ? (
        <section aria-labelledby="more" className="bg-ground-2 py-[clamp(5rem,10vw,8rem)]">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Split id="more" text="More from *the field*" className="display text-[length:var(--text-head)]" />
              <ArrowLink href="/news">All news</ArrowLink>
            </div>
            <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p, i) => (
                <PostCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
