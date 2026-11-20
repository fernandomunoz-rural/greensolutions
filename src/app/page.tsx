import type { ReactNode } from "react";
import { ArrowLink, Button, Container, SectionHead } from "@/components/ui";
import { Split } from "@/components/motion/split";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { ScrollWords } from "@/components/motion/scroll-words";
import { CountUp } from "@/components/motion/count-up";
import { StickyPoints } from "@/components/motion/sticky-points";
import { PlantingCalendar } from "@/components/motion/planting-calendar";
import { CropCarousel } from "@/components/motion/crop-carousel";
import { PostCard } from "@/components/cards";
import { MemberTile } from "@/components/team-card";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, type Post } from "@/lib/posts";
import { getSiteContent } from "@/lib/content/load";
import { getPublicTeam } from "@/lib/team-load";
import type { HomeSectionId, SiteContent } from "@/lib/content/schema";
import { orderTeam, type TeamMember } from "@/lib/team";
import { MONTHS } from "@/lib/calendar";
import { PHOTOS, type Photo } from "@/lib/photos";

export const dynamic = "force-dynamic";

const HOME_TEAM_LIMIT = 8;
const section = "py-[clamp(6rem,12vw,11rem)]";

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

/* Hero: a full-screen photograph that settles and drifts, the headline rising word by word. */
function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-white">
      <ParallaxImage
        src={hero.image || PHOTOS.leaves.image}
        alt=""
        position={hero.image ? undefined : PHOTOS.leaves.position}
        priority
        intro
        strength={0.18}
        className="absolute! inset-0 -z-10"
      />
      {/* Shade for legibility: darker at the foot where the words sit. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(13,31,23,0.45)_0%,rgba(13,31,23,0.15)_35%,rgba(13,31,23,0.85)_100%)]" />

      <Container className="pb-[clamp(2.5rem,6vw,5rem)] pt-32">
        <Split as="h1" immediate text={hero.title} delay={250} className="display max-w-[16ch] text-[length:var(--text-display)]" />
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
          {hero.intro ? (
            <p className="animate-fade-in max-w-[44ch] text-[length:var(--text-lead)] leading-snug text-white/80 [animation-delay:900ms] md:col-span-6">
              {hero.intro}
            </p>
          ) : null}
          <div className="animate-fade-in flex flex-wrap gap-3 [animation-delay:1100ms] md:col-span-6 md:justify-end">
            {hero.primaryLabel && hero.primaryHref ? (
              <Button href={hero.primaryHref} variant="accent" size="lg" arrow>
                {hero.primaryLabel}
              </Button>
            ) : null}
            {hero.secondaryLabel && hero.secondaryHref ? (
              <Button href={hero.secondaryHref} variant="outline-light" size="lg">
                {hero.secondaryLabel}
              </Button>
            ) : null}
          </div>
        </div>
        <div className="animate-fade-in mt-12 flex items-center justify-between border-t border-white/15 pt-5 text-[length:var(--text-small)] text-white/70 [animation-delay:1300ms]">
          <span>Nassau, The Bahamas</span>
          <a href="#calendar" className="flex items-center gap-3 hover:text-white">
            Scroll
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-white/20">
              <span className="cue absolute inset-0 bg-white" />
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}

/* The calendar: what goes in the ground this month. */
function Calendar({ copy }: { copy: SiteContent["calendar"] }) {
  const month = nassauMonth();
  return (
    <section id="calendar" aria-labelledby="calendar-title" className={`scroll-mt-16 bg-field text-white ${section}`}>
      <Container>
        <SectionHead
          id="calendar-title"
          tone="light"
          title={`${copy.title} *${MONTHS[month]}*`}
          intro={copy.intro || undefined}
        />
        <div className="mt-14">
          <PlantingCalendar initialMonth={month} />
        </div>
      </Container>
    </section>
  );
}

/* Figures: the site's purpose lit up word by word, then the numbers counting up. */
function Stats({ items, description }: { items: SiteContent["stats"]["items"]; description: string }) {
  return (
    <section aria-labelledby="in-numbers" className={section}>
      <Container>
        <h2 id="in-numbers" className="sr-only">
          Why it matters
        </h2>
        {description ? (
          <ScrollWords
            text={description}
            className="max-w-[26ch] text-[clamp(1.875rem,1.1rem+2.9vw,4rem)] font-medium leading-[1.08] tracking-[-0.04em] md:max-w-[30ch]"
          />
        ) : null}
        {items.length ? (
          <dl className="mt-[clamp(4rem,9vw,8rem)] grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
            {items.map((s, i) => (
              <div key={`${s.value}-${i}`} data-reveal style={{ ["--i" as string]: i }} className="border-t border-ink/15 pt-6">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <CountUp value={s.value} className="display block text-[clamp(3rem,2rem+3.6vw,6rem)]" />
                  <span className="mt-4 block max-w-[24ch] text-ink-soft">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </section>
  );
}

/* What we do: points light up in turn beside a photo that holds still and changes. */
function About({ about }: { about: SiteContent["about"] }) {
  // Each point's own photo when uploaded, otherwise the built-in ones in turn.
  const builtIn: Photo[] = [PHOTOS.cropRows, PHOTOS.hands, PHOTOS.orangeTree, PHOTOS.leafRain];
  const pics = about.items.map((p, i) => {
    if (p.image) return { src: p.image, alt: "" };
    const b = builtIn[i % builtIn.length];
    return { src: b.image, alt: b.alt, position: b.position };
  });
  return (
    <section id="about" aria-labelledby="about-title" className={`scroll-mt-16 bg-ground-2 ${section}`}>
      <Container>
        <SectionHead id="about-title" title={about.title} intro={about.intro} />
        <div className="mt-[clamp(3rem,7vw,6rem)]">
          <StickyPoints points={about.items} pics={pics} />
        </div>
      </Container>
    </section>
  );
}

/* News: the latest articles. */
function News({ copy, posts }: { copy: SiteContent["news"]; posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="latest" className={section}>
      <Container>
        <SectionHead id="latest" title={copy.title} intro={copy.intro} action={<ArrowLink href="/news">All news</ArrowLink>} />
        <div className={`mt-14 grid gap-x-8 gap-y-14 ${posts.length === 1 ? "" : posts.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {posts.map((p, i) => (
            <PostCard key={p.id} post={p} wide={posts.length === 1} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Team: portraits, four across. */
function Team({ copy, members }: { copy: SiteContent["team"]; members: TeamMember[] }) {
  if (members.length === 0) return null;
  const shown = orderTeam(members).slice(0, HOME_TEAM_LIMIT);
  return (
    <section id="team" aria-labelledby="team-title" className={`scroll-mt-16 ${section}`}>
      <Container>
        <SectionHead id="team-title" title={copy.title} intro={copy.intro} action={<ArrowLink href="/team">Meet everyone</ArrowLink>} />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {shown.map((m, i) => (
            <MemberTile key={m.id} member={m} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Close: the islands, full width, with the action over them. */
function Cta({ cta }: { cta: SiteContent["cta"] }) {
  return (
    <section aria-labelledby="cta-title" className="px-[calc(var(--gutter)/2)]">
      <ParallaxImage
        src={cta.image || PHOTOS.exuma.image}
        alt={cta.image ? "" : PHOTOS.exuma.alt}
        position={cta.image ? undefined : PHOTOS.exuma.position}
        strength={0.15}
        sizes="100vw"
        className="mx-auto max-w-[1600px] rounded-[28px]"
      >
        <div className="relative flex min-h-[min(88svh,820px)] flex-col justify-end bg-[linear-gradient(180deg,rgba(13,31,23,0.05)_30%,rgba(13,31,23,0.75)_100%)] p-[clamp(1.5rem,5vw,4.5rem)] text-white">
          <Split id="cta-title" text={cta.title} className="display max-w-[14ch] text-[length:var(--text-head)]" />
          <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
            {cta.body ? (
              <p data-reveal className="max-w-[40ch] text-[length:var(--text-lead)] leading-snug text-white/85 md:col-span-6">
                {cta.body}
              </p>
            ) : null}
            <div data-reveal style={{ ["--i" as string]: 1 }} className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
              {cta.primaryLabel && cta.primaryHref ? (
                <Button href={cta.primaryHref} variant="accent" size="lg" arrow>
                  {cta.primaryLabel}
                </Button>
              ) : null}
              {cta.secondaryLabel && cta.secondaryHref ? (
                <Button href={cta.secondaryHref} variant="outline-light" size="lg">
                  {cta.secondaryLabel}
                </Button>
              ) : null}
            </div>
          </div>
          {cta.image ? null : (
            <p className="mt-10 text-[length:var(--text-small)] text-white/60">
              Little Exuma, The Bahamas. Photo: {PHOTOS.exuma.credit}
            </p>
          )}
        </div>
      </ParallaxImage>
    </section>
  );
}

export default async function HomePage() {
  const [content, posts, team] = await Promise.all([getSiteContent(), getLatestPosts(), getPublicTeam()]);

  const sections: Record<HomeSectionId, ReactNode> = {
    stats: <Stats items={content.stats.items} description={content.settings.description} />,
    news: <News copy={content.news} posts={posts} />,
    about: <About about={content.about} />,
    team: <Team copy={content.team} members={team} />,
    cta: <Cta cta={content.cta} />,
  };

  return (
    <>
      <Hero hero={content.hero} />
      <CropCarousel />
      <Calendar copy={content.calendar} />
      {content.home
        .filter((s) => s.visible)
        .map((s) => (
          <div key={s.id}>{sections[s.id]}</div>
        ))}
    </>
  );
}
