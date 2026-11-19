import type { Metadata } from "next";
import { Board } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { PostCard } from "@/components/cards";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, type Post } from "@/lib/posts";
import { PLACES } from "@/lib/places";

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

  return (
    <>
      <PageHero
        title="From the field"
        intro="Updates, growing stories and announcements for gardeners and growers across The Bahamas."
        place={PLACES.produceStall}
      />
      <Board className="mt-2">
        {posts.length === 0 ? (
          <p className="col-span-2 rounded-[8px] bg-ground-2 p-6 text-[length:var(--text-lead)] md:col-span-12">
            The first stories are on their way. Check back soon.
          </p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className={posts.length === 1 ? "col-span-2 md:col-span-12" : "col-span-2 md:col-span-6 lg:col-span-4"}>
              <PostCard post={p} wide={posts.length === 1} />
            </div>
          ))
        )}
      </Board>
    </>
  );
}
