import Link from "next/link";
import type { ReactNode } from "react";
import { Container, SectionHeading, Button, Eyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
import { PostCard } from "@/components/cards";
import { TeamCard } from "@/components/team-card";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, type Post } from "@/lib/posts";
import { getSiteContent } from "@/lib/content/load";
import { getPublicTeam } from "@/lib/team-load";
import type { HomeSectionId, SiteContent } from "@/lib/content/schema";
import { orderTeam, type TeamMember } from "@/lib/team";

export const dynamic = "force-dynamic";

const HOME_TEAM_LIMIT = 6;

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

/** Drawn illustration used when no hero photo has been uploaded. */
function FieldIllustration() {
  return (
    <svg viewBox="0 0 480 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17493a" />
          <stop offset="1" stopColor="#0f3d2e" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34d399" stopOpacity="0.18" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="480" height="400" fill="url(#sky)" />
      <circle cx="360" cy="110" r="46" fill="#34d399" opacity="0.9" />
      <circle cx="360" cy="110" r="74" fill="#34d399" opacity="0.08" />
      <path d="M0 210 C 120 190, 220 205, 480 188 L480 236 L0 236 Z" fill="url(#sea)" />
      {/* Field rows receding */}
      {Array.from({ length: 9 }, (_, i) => {
        const y = 236 + i * i * 2.2 + i * 6;
        return <path key={i} d={`M0 ${y} Q 240 ${y - 10 - i} 480 ${y}`} stroke="#34d399" strokeOpacity={0.12 + i * 0.05} strokeWidth={1 + i * 0.5} fill="none" />;
      })}
      {/* Sprouts */}
      {[
        [96, 300, 1],
        [180, 318, 1.2],
        [292, 312, 1.1],
        [384, 330, 1.35],
        [140, 360, 1.5],
        [330, 368, 1.6],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#34d399">
          <path d="M0 0 V-18" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
          <path d="M0 -12 C -12 -14, -16 -24, -14 -28 C -4 -26, 0 -18, 0 -12 Z" opacity="0.85" />
          <path d="M0 -16 C 10 -20, 16 -30, 14 -34 C 4 -32, -1 -24, 0 -16 Z" />
        </g>
      ))}
    </svg>
  );
}

function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_110%_-10%,rgba(52,211,153,0.10),transparent_60%)]"
      />
      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="animate-fade-in max-w-2xl">
          {hero.eyebrow ? <Eyebrow>{hero.eyebrow}</Eyebrow> : null}
          <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.03] tracking-tight text-forest sm:text-6xl">
            {hero.title}
          </h1>
          {hero.intro ? <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60">{hero.intro}</p> : null}
          <div className="mt-9 flex flex-wrap gap-3">
            {hero.primaryLabel && hero.primaryHref ? (
              <Button href={hero.primaryHref} size="lg">
                {hero.primaryLabel}
                <Icon.ArrowRight className="h-4 w-4" />
              </Button>
            ) : null}
            {hero.secondaryLabel && hero.secondaryHref ? (
              <Button href={hero.secondaryHref} variant="secondary" size="lg">
                {hero.secondaryLabel}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="animate-fade-in relative [animation-delay:120ms]">
          <div className="relative aspect-[6/5] overflow-hidden rounded-2xl shadow-soft ring-1 ring-forest/10">
            {hero.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded storage URL
              <img src={hero.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <FieldIllustration />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stats({ items }: { items: SiteContent["stats"]["items"] }) {
  if (items.length === 0) return null;
  return (
    <section className="border-b border-line bg-paper">
      <Container className="py-14">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {items.map((s, i) => (
            <div key={`${s.value}-${i}`} className="border-l border-line pl-5">
              <dt className="font-display text-4xl font-semibold tracking-tight text-forest">{s.value}</dt>
              <dd className="mt-2 text-sm leading-snug text-ink/55">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function News({ copy, posts }: { copy: SiteContent["news"]; posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="border-b border-line bg-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:text-forest">
            View all
            <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function About({ about }: { about: SiteContent["about"] }) {
  return (
    <section id="about" className="scroll-mt-20 border-b border-line bg-paper py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow={about.eyebrow} title={about.title} intro={about.intro} />
        {about.items.length ? (
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {about.items.map((v, i) => (
              <div key={`${v.title}-${i}`} className="bg-white p-6">
                <span className="font-display text-sm font-semibold text-leaf">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display mt-3 text-base font-semibold text-forest">{v.title}</h3>
                {v.body ? <p className="mt-2 text-sm leading-relaxed text-ink/60">{v.body}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

function Team({ copy, members }: { copy: SiteContent["team"]; members: TeamMember[] }) {
  if (members.length === 0) return null;
  const shown = orderTeam(members).slice(0, HOME_TEAM_LIMIT);
  return (
    <section id="team" className="scroll-mt-20 border-b border-line bg-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
          <Link href="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:text-forest">
            Meet the team
            <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m) => (
            <TeamCard key={m.id} member={m} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Cta({ cta }: { cta: SiteContent["cta"] }) {
  return (
    <section className="bg-forest py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">{cta.title}</h2>
            {cta.body ? <p className="mt-4 text-mint-100/70">{cta.body}</p> : null}
          </div>
          <div className="flex flex-wrap gap-3">
            {cta.primaryLabel && cta.primaryHref ? (
              <Button href={cta.primaryHref} variant="secondary" size="lg">
                {cta.primaryLabel}
              </Button>
            ) : null}
            {cta.secondaryLabel && cta.secondaryHref ? (
              <Button
                href={cta.secondaryHref}
                size="lg"
                className="bg-transparent text-white ring-1 ring-white/20 hover:bg-white/[0.06]"
              >
                {cta.secondaryLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default async function HomePage() {
  const [content, posts, team] = await Promise.all([getSiteContent(), getLatestPosts(), getPublicTeam()]);

  const sections: Record<HomeSectionId, ReactNode> = {
    stats: <Stats items={content.stats.items} />,
    news: <News copy={content.news} posts={posts} />,
    about: <About about={content.about} />,
    team: <Team copy={content.team} members={team} />,
    cta: <Cta cta={content.cta} />,
  };

  return (
    <>
      <Hero hero={content.hero} />
      {content.home
        .filter((s) => s.visible)
        .map((s) => (
          <div key={s.id}>{sections[s.id]}</div>
        ))}
    </>
  );
}
