import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Board, MoreLink, PhotoTile, SectionHead } from "@/components/ui";
import { PostCard, fallbackPlate } from "@/components/cards";
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
  const plate = fallbackPlate(post.slug);

  return (
    <article>
      <Board className="pt-2">
        <header
          className={`col-span-2 flex min-h-[clamp(18rem,36vw,28rem)] flex-col justify-end rounded-[8px] bg-field p-6 text-on-field ${
            "md:col-span-7"
          }`}
        >
          <h1 className="animate-fade-in display max-w-[22ch] text-[clamp(2.1rem,1.2rem+3.4vw,4.5rem)]">{post.title}</h1>
          {post.excerpt ? (
            <p className="animate-fade-in mt-5 max-w-[48ch] text-[length:var(--text-lead)] leading-snug text-on-field-soft">
              {post.excerpt}
            </p>
          ) : null}
        </header>
        {post.cover_url ? (
          <PhotoTile src={post.cover_url} alt="" priority shutter className="col-span-2 aspect-[4/3] md:col-span-5 md:aspect-auto" />
        ) : (
          // No cover yet: the same botanical plate its tile shows in lists.
          <PhotoTile
            src={plate.image}
            alt=""
            caption={plate.caption}
            strip="ground"
            position={plate.focus}
            blend
            priority
            className="col-span-2 aspect-[4/3] bg-tile! md:col-span-5 md:aspect-auto"
          />
        )}

        <aside className="col-span-2 rounded-[8px] bg-ground-2 p-6 md:col-span-4 lg:col-span-3">
          <div className="flex items-center gap-3 md:sticky md:top-6">
            <Avatar src={post.author?.avatar_url} name={post.author?.full_name} className="h-11 w-11 shrink-0 text-sm" />
            <p className="text-[length:var(--text-small)] text-ink-soft">
              <span className="block font-semibold text-ink">{post.author?.full_name ?? "Green Solutions"}</span>
              {[post.category, formatDate(post.published_at), `${readMinutes(post.body)} min read`].filter(Boolean).join(" · ")}
            </p>
          </div>
          <Link
            href="/news"
            className="mt-6 inline-flex text-[length:var(--text-small)] font-medium text-field underline decoration-1 underline-offset-4 hover:text-ink"
          >
            ← All news
          </Link>
        </aside>

        {/* Body — Markdown with raw HTML dropped (see components/markdown.tsx). */}
        <div className="col-span-2 rounded-[8px] bg-tile p-6 md:col-span-8 lg:col-span-9 lg:p-12">
          {post.body.trim() ? (
            <Markdown source={post.body} className="max-w-[68ch]" />
          ) : (
            <p className="text-ink-soft">This post has no content yet.</p>
          )}
        </div>
      </Board>

      {more.length > 0 ? (
        <Board as="section" aria-labelledby="more" className="mt-2">
          <SectionHead id="more" title="More from the field" action={<MoreLink href="/news">All news</MoreLink>} />
          {more.map((p) => (
            <div key={p.id} className="col-span-2 md:col-span-6 lg:col-span-4">
              <PostCard post={p} />
            </div>
          ))}
        </Board>
      ) : null}
    </article>
  );
}
