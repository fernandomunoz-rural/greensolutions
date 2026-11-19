import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { PostCard } from "@/components/cards";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, formatDate, readMinutes, type Post } from "@/lib/posts";

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
      <PageHero title="From the field" intro="Updates, growing stories and announcements for gardeners and growers across The Bahamas." />
      <Container className="pb-[clamp(5rem,10vw,9rem)]">
        {!lead ? (
          <p className="text-[length:var(--text-lead)] text-ink">The first stories are on their way. Check back soon.</p>
        ) : (
          <>
            {/* The newest story at full width: picture left, words right. */}
            <Link href={`/news/${lead.slug}`} className="group grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="relative aspect-[4/3] overflow-hidden bg-ground-2 lg:col-span-7">
                {lead.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- storage URL
                  <img src={lead.cover_url} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                ) : (
                  <span className="display flex h-full w-full items-end bg-field p-8 text-[length:var(--text-head)] text-accent">
                    {lead.category ?? "News"}
                  </span>
                )}
              </div>
              <div className="lg:col-span-5">
                <h2 className="display text-[clamp(2rem,1rem+2.4vw,3rem)] leading-[1.05] group-hover:text-field">{lead.title}</h2>
                <p className="mt-3 text-[length:var(--text-small)] text-ink-soft">
                  {[lead.category, formatDate(lead.published_at), `${readMinutes(lead.body)} min read`].filter(Boolean).join(" · ")}
                </p>
                {lead.excerpt ? <p className="mt-4 text-[length:var(--text-lead)] leading-snug text-ink">{lead.excerpt}</p> : null}
              </div>
            </Link>

            {rest.length ? (
              <div className="mt-[clamp(5rem,10vw,8rem)] grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => (
                  <div key={p.id} data-reveal style={{ ["--i" as string]: i % 3 }}>
                    <PostCard post={p} />
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </Container>
    </>
  );
}
