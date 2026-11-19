import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui";
import { PlantingSentence } from "@/components/home/planting-sentence";
import { IslandZoom } from "@/components/home/island-zoom";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, formatDate, readMinutes, type Post } from "@/lib/posts";
import { getSiteContent } from "@/lib/content/load";
import { getPublicTeam } from "@/lib/team-load";
import type { HomeSectionId, SiteContent } from "@/lib/content/schema";
import { memberAnchor, orderTeam, type TeamMember } from "@/lib/team";
import stanielCay from "@/assets/places/flying-over-stanlel-cay-3425540229.jpg";

export const dynamic = "force-dynamic";

const HOME_TEAM_LIMIT = 8;

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

/** The month in Nassau, whatever time zone the server runs in. */
function nassauMonth(): number {
  const m = new Intl.DateTimeFormat("en-US", { month: "numeric", timeZone: "America/Nassau" }).format(new Date());
  return Number(m) - 1;
}

/** Split a heading into two halves at the word nearest the middle. */
function halves(text: string): [string, string] {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return [text, ""];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

const wrap = "px-[var(--margin)]";

/* Hero — "Sentence split by a frame": the planting calendar is the headline. */
function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section className={`${wrap} flex min-h-[calc(88svh-4.5rem)] flex-col justify-between pb-12 pt-[clamp(2rem,7vh,5rem)]`}>
      <PlantingSentence initialMonth={nassauMonth()} />
      <div className="mt-16 grid gap-6 sm:grid-cols-12 sm:items-end">
        <div className="sm:col-span-7 lg:col-span-5">
          <h1 data-reveal className="text-[length:var(--text-lead)] leading-snug text-ink">
            {hero.title}
          </h1>
          {hero.intro ? (
            <p data-reveal style={{ ["--i" as string]: 1 }} className="mt-3 text-ink">
              {hero.intro}
            </p>
          ) : null}
        </div>
        <div data-reveal style={{ ["--i" as string]: 2 }} className="flex flex-wrap items-center gap-5 sm:col-span-5 sm:justify-end lg:col-span-7">
          {hero.secondaryLabel && hero.secondaryHref ? (
            <Link href={hero.secondaryHref} className="text-ink underline decoration-1 underline-offset-4 hover:text-field">
              {hero.secondaryLabel}
            </Link>
          ) : null}
          {hero.primaryLabel && hero.primaryHref ? (
            <Button href={hero.primaryHref} size="lg">
              {hero.primaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Stats — "Figures inside a sentence", on the deep-sea field. */
function Stats({ items }: { items: SiteContent["stats"]["items"] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="in-numbers" className={`${wrap} flex min-h-[64svh] items-center bg-sea py-28 text-on-sea-soft`}>
      <h2 id="in-numbers" className="sr-only">
        In numbers
      </h2>
      <p className="mx-auto max-w-[56ch] text-[clamp(1.5rem,1.1rem+1vw,2.25rem)] leading-[1.25] tracking-[-0.01em]">
        {items.map((s, i) => (
          <span key={`${s.value}-${i}`} data-reveal style={{ ["--i" as string]: i }}>
            <span className="text-white">{s.value}</span>
            {" "}
            {s.label}
            {/[.!?]$/.test(s.label) ? " " : ". "}
          </span>
        ))}
      </p>
    </section>
  );
}

/* News — "Portrait as drop cap": the latest article is the paragraph. */
function News({ copy, posts }: { copy: SiteContent["news"]; posts: Post[] }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;
  return (
    <section aria-labelledby="latest" className={`${wrap} py-[clamp(6rem,12vw,10rem)]`}>
      <h2 id="latest" className="sr-only">
        {copy.title}
      </h2>
      <div className="grid gap-8 lg:grid-cols-12">
        <dl data-reveal className="grid grid-cols-2 gap-4 text-[length:var(--text-small)] text-ink-soft lg:col-span-2 lg:grid-cols-1 lg:content-start">
          <div>
            <dt className="sr-only">Published</dt>
            <dd>{formatDate(lead.published_at)}</dd>
          </div>
          <div>
            <dt className="sr-only">Reading time</dt>
            <dd>{readMinutes(lead.body)} min read</dd>
          </div>
        </dl>
        <div className="lg:col-span-10">
          <p data-reveal style={{ ["--i" as string]: 1 }} className="text-[length:var(--text-lead)] leading-[1.3] text-ink">
            {lead.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- storage URL
              <img
                src={lead.cover_url}
                alt=""
                className="float-left mr-[0.5em] mt-[0.18em] h-[3.6em] w-[3.6em] object-cover max-sm:h-[4.8em] max-sm:w-[4.8em]"
              />
            ) : null}
            <Link href={`/news/${lead.slug}`} className="text-ink underline decoration-1 underline-offset-[0.15em] hover:text-field">
              {lead.title}
            </Link>
            {lead.excerpt ? <> {lead.excerpt}</> : null}
          </p>
          <p data-reveal style={{ ["--i" as string]: 2 }} className="mt-[1.2em] clear-both text-[length:var(--text-lead)] leading-[1.3] text-ink">
            {rest.length ? (
              <>
                Also new:{" "}
                {rest.map((p, i) => (
                  <span key={p.id}>
                    <Link href={`/news/${p.slug}`} className="text-ink underline decoration-1 underline-offset-[0.15em] hover:text-field">
                      {p.title}
                    </Link>
                    {i < rest.length - 1 ? " and " : ". "}
                  </span>
                ))}
              </>
            ) : null}
            <Link href="/news" className="text-ink underline decoration-1 underline-offset-[0.15em] hover:text-field">
              Everything we have written
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

/* About — "One frame, three distances", pinned. */
function About({ about }: { about: SiteContent["about"] }) {
  const [first, second] = halves(about.title);
  return (
    <div id="about" className="scroll-mt-16">
      <IslandZoom
        first={first}
        second={second}
        intro={about.intro}
        points={about.items}
        image={about.image || stanielCay}
        credit={about.image ? "" : "Staniel Cay, Exuma. Photo: cogdogblog, CC0."}
      />
    </div>
  );
}

/* Team — "Statement, table pushed right". */
function Team({ copy, members }: { copy: SiteContent["team"]; members: TeamMember[] }) {
  if (members.length === 0) return null;
  const shown = orderTeam(members).slice(0, HOME_TEAM_LIMIT);
  const pictured = shown.find((m) => m.photo_url);
  return (
    <section id="team" aria-labelledby="team-title" className={`${wrap} scroll-mt-16 bg-ground-2 py-[clamp(6rem,12vw,10rem)]`}>
      <h2 id="team-title" data-reveal className="display max-w-[16ch] text-[length:var(--text-head)] sm:indent-[3vw]">
        {copy.title}
      </h2>
      <div className="mt-24 grid gap-10 lg:grid-cols-12">
        <div className="hidden lg:col-span-4 lg:flex lg:items-end">
          {pictured?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- storage URL
            <img src={pictured.photo_url} alt={`${pictured.name}`} className="aspect-[4/5] w-[22vw] object-cover" />
          ) : (
            <p data-reveal className="max-w-[30ch] text-ink">
              {copy.intro}
            </p>
          )}
        </div>
        <p className="hidden text-[length:var(--text-small)] text-ink-soft lg:col-span-1 lg:block">Offices</p>
        <ul className="lg:col-span-7">
          {shown.map((m, i) => (
            <li key={m.id} data-reveal style={{ ["--i" as string]: i }} className={i > 0 && i % 4 === 0 ? "mt-11" : i > 0 ? "mt-6" : ""}>
              <Link
                href={`/team#${memberAnchor(m.name)}`}
                className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[length:var(--text-body)] sm:grid-cols-[38%_1fr_auto]"
              >
                <span className="text-ink-soft max-sm:col-span-2">{m.title}</span>
                <span className="text-ink group-hover:text-field">{m.name}</span>
                <span className="text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-field" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-16 lg:hidden text-ink">{copy.intro}</p>
      <p className="mt-10 lg:ml-[calc(5/12*100%)]">
        <Link href="/team" className="text-ink underline decoration-1 underline-offset-4 hover:text-field">
          Meet everyone
        </Link>
      </p>
    </section>
  );
}

/* CTA — "The idea again, inverted": the field turns green. */
function Cta({ cta }: { cta: SiteContent["cta"] }) {
  return (
    <section className={`${wrap} flex min-h-[85svh] flex-col justify-between bg-field pb-10 pt-[clamp(4rem,10vw,8rem)] text-on-field`}>
      <h2 data-reveal className="display max-w-[14ch] text-[length:var(--text-display)] leading-[0.92] max-sm:text-[2.4rem]">
        {cta.title}
      </h2>
      <div className="mt-16 grid gap-6 sm:grid-cols-12 sm:items-end">
        {cta.body ? (
          <p data-reveal style={{ ["--i" as string]: 1 }} className="text-[length:var(--text-lead)] text-on-field-soft sm:col-span-6">
            {cta.body}
          </p>
        ) : null}
        <div data-reveal style={{ ["--i" as string]: 2 }} className="flex flex-wrap items-center gap-5 sm:col-span-6 sm:justify-end">
          {cta.secondaryLabel && cta.secondaryHref ? (
            <Link href={cta.secondaryHref} className="underline decoration-1 underline-offset-4 hover:text-accent">
              {cta.secondaryLabel}
            </Link>
          ) : null}
          {cta.primaryLabel && cta.primaryHref ? (
            <Button href={cta.primaryHref} variant="accent" size="lg" className="max-sm:w-full">
              {cta.primaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
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
