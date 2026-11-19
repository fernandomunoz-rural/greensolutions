import Link from "next/link";
import { Container, SectionHeading, Button, Eyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
import { PostCard } from "@/components/cards";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, type Post } from "@/lib/posts";
import { stats, values, offices } from "@/data/site";

async function getLatestPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_WITH_AUTHOR)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);
  if (error) return []; // table may not exist yet
  return (data ?? []) as unknown as Post[];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function HomePage() {
  const latestPosts = await getLatestPosts();

  return (
    <>
      {/* HERO — light, type-led */}
      <section className="border-b border-line bg-white">
        <Container className="py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow>Agriculture platform for The Bahamas</Eyebrow>
            <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.03] tracking-tight text-forest sm:text-6xl">
              Practical tools for growing food across the islands.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60">
              Clear guidance and planning tools for gardeners, growers, and
              students — built for Bahamian soil, climate, and supply chains.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/signup" size="lg">
                Create free account
              </Button>
              <Button href="/news" variant="secondary" size="lg">
                Read the latest
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* STATS */}
      <section className="border-b border-line bg-paper">
        <Container className="py-14">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-line pl-5">
                <dt className="font-display text-4xl font-semibold tracking-tight text-forest">
                  {s.value}
                </dt>
                <dd className="mt-2 text-sm leading-snug text-ink/55">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* LATEST NEWS — only shows once posts are published */}
      {latestPosts.length > 0 ? (
        <section className="border-b border-line bg-white py-20 sm:py-24">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="News"
                title="Latest updates"
                intro="Guidance, announcements, and field notes from the team."
              />
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:text-forest"
              >
                View all
                <Icon.ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* WHAT WE DO */}
      <section id="about" className="scroll-mt-20 border-b border-line bg-paper py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Guidance you can act on"
            intro="We organize agricultural knowledge into clear, usable steps and tools — tuned to the realities of island growing."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="bg-white p-6">
                <span className="font-display text-sm font-semibold text-leaf">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-base font-semibold text-forest">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TEAM */}
      <section id="team" className="scroll-mt-20 bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Team"
            title="A connected team with clear roles"
            intro="Each office owns a defined part of the work — from applied agriculture to technology and outreach."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((o) => (
              <div
                key={o.name}
                className="flex flex-col rounded-xl border border-line bg-white p-6 transition-colors hover:border-forest/25"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-forest font-display text-sm font-semibold text-mint">
                    {initials(o.lead)}
                  </span>
                  <div>
                    <p className="font-medium text-forest">{o.lead}</p>
                    <p className="text-xs text-ink/55">{o.name}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink/60">
                  {o.role}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA — dark anchor */}
      <section className="border-t border-line bg-forest py-20 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Create an account and start growing
              </h2>
              <p className="mt-4 text-mint-100/70">
                Free while we build. Set up in under a minute.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/signup" variant="secondary" size="lg">
                Create free account
              </Button>
              <Button
                href="/login"
                size="lg"
                className="bg-transparent text-white ring-1 ring-white/20 hover:bg-white/[0.06]"
              >
                Log in
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
