import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Badge } from "@/components/ui";
import { PostCard } from "@/components/cards";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import {
  POST_WITH_AUTHOR,
  formatDate,
  readMinutes,
  toParagraphs,
  type Post,
} from "@/lib/posts";

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

  const paragraphs = toParagraphs(post.body);

  return (
    <article>
      {/* Header */}
      <header className="border-b border-forest-700/40 bg-forest text-mint-100">
        <Container className="py-16">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-mint hover:text-white"
          >
            <Icon.ArrowLeft className="h-4 w-4" /> Back to News
          </Link>
          <div className="mt-7 max-w-3xl">
            {post.category ? <Badge tone="mint">{post.category}</Badge> : null}
            <h1 className="font-display mt-5 text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 text-lg text-mint-100/80">{post.excerpt}</p>
            ) : null}
            <div className="mt-7 flex items-center gap-3">
              <Avatar
                src={post.author?.avatar_url}
                name={post.author?.full_name}
                className="h-10 w-10 text-sm"
              />
              <div className="text-sm text-mint-100/70">
                <span className="block font-semibold text-mint">
                  {post.author?.full_name ?? "Green Solutions"}
                </span>
                <span>
                  {formatDate(post.published_at)} · {readMinutes(post.body)} min
                  read
                </span>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Cover */}
      {post.cover_url ? (
        <Container className="pt-14">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded storage URL */}
            <img
              src={post.cover_url}
              alt=""
              className="w-full object-cover"
            />
          </div>
        </Container>
      ) : null}

      {/* Body — rendered as escaped paragraphs, never raw HTML. */}
      <Container className={post.cover_url ? "py-10" : "py-14"}>
        <div className="prose-gs mx-auto max-w-3xl text-[1.05rem]">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p key={i}>
                {para.split("\n").map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            ))
          ) : (
            <p className="text-ink/50">This post has no content yet.</p>
          )}
        </div>
      </Container>

      {/* More posts */}
      {more.length > 0 ? (
        <section className="border-t border-line bg-white py-16">
          <Container>
            <h2 className="font-display text-2xl font-semibold text-forest">
              More from the field
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
