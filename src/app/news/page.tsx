import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { PostCard } from "@/components/cards";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, type Post } from "@/lib/posts";

export const metadata: Metadata = {
  title: "News & Stories",
  description:
    "Updates, growing stories, and announcements from the Green Solutions community across The Bahamas.",
};

// Always reflect the latest published posts.
export const dynamic = "force-dynamic";

async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_WITH_AUTHOR)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) return []; // table may not exist yet, or nothing published
  return (data ?? []) as unknown as Post[];
}

export default async function NewsPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHero
        eyebrow="News & stories"
        title="From the field"
        intro="Updates, growing stories, and announcements from the Green Solutions community. Fresh guidance for gardeners and growers across The Bahamas."
      />
      <Container className="py-14">
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-xl border border-line bg-white px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/[0.06] text-forest">
              <Icon.Newspaper className="h-6 w-6" />
            </span>
            <p className="font-display mt-4 text-lg font-semibold text-forest">
              No posts yet
            </p>
            <p className="mt-1.5 text-sm text-ink/60">
              The first stories are on their way. Check back soon.
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
