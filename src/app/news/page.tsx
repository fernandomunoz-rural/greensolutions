import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { PostCard } from "@/components/cards";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, type Post } from "@/lib/posts";

export const metadata: Metadata = {
  title: "News & stories",
  description: "Updates, growing stories, and announcements from the Green Solutions community across The Bahamas.",
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
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHero
        title="From the *field*"
        intro="Updates, growing stories and announcements for gardeners and growers across The Bahamas."
      />
      <Container className="pb-[clamp(3rem,6vw,5rem)] pt-[clamp(4rem,8vw,7rem)]">
        {!lead ? (
          <p className="text-[length:var(--text-lead)]">The first stories are on their way. Check back soon.</p>
        ) : (
          <>
            <PostCard post={lead} wide />
            {rest.length ? (
              <div className="mt-[clamp(4rem,8vw,7rem)] grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => (
                  <PostCard key={p.id} post={p} index={i % 3} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </Container>
    </>
  );
}
