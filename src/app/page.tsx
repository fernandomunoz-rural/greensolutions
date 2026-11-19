import type { ReactNode } from "react";
import { Board, Button, MoreLink, PhotoTile, SectionHead, TILE_SOFT, TILE_TONES, type TileTone } from "@/components/ui";
import { PlantingTiles } from "@/components/home/planting-tiles";
import { PostCard } from "@/components/cards";
import { MemberTile } from "@/components/team-card";
import { createClient } from "@/lib/supabase/server";
import { POST_WITH_AUTHOR, type Post } from "@/lib/posts";
import { getSiteContent } from "@/lib/content/load";
import { getPublicTeam } from "@/lib/team-load";
import type { HomeSectionId, SiteContent } from "@/lib/content/schema";
import { orderTeam, type TeamMember } from "@/lib/team";
import { PLACES } from "@/lib/places";

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

/*
  Hero board. Desktop:
  [ title tile — 7 cols, field green ][ market photo — 5 cols ]
  [ plant-this-month — 5 ][ plate — 3 ][ aerial photo — 4 ]
*/
function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <Board className="pt-2">
      <div className="col-span-2 flex min-h-[clamp(26rem,48vw,40rem)] flex-col justify-between gap-10 rounded-[8px] bg-field p-6 text-on-field md:col-span-7">
        <h1 className="animate-fade-in display max-w-[15ch] text-[length:var(--text-display)]">{hero.title}</h1>
        <div className="animate-fade-in [animation-delay:120ms]">
          {hero.intro ? <p className="max-w-[46ch] text-[length:var(--text-lead)] leading-snug text-on-field-soft">{hero.intro}</p> : null}
          <div className="mt-8 flex flex-wrap gap-2">
            {hero.primaryLabel && hero.primaryHref ? (
              <Button href={hero.primaryHref} variant="accent" size="lg">
                {hero.primaryLabel}
              </Button>
            ) : null}
            {hero.secondaryLabel && hero.secondaryHref ? (
              <Button href={hero.secondaryHref} variant="dark" size="lg">
                {hero.secondaryLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <PhotoTile
        src={PLACES.produceStall.image}
        alt={PLACES.produceStall.alt}
        caption={PLACES.produceStall.caption}
        position={PLACES.produceStall.position}
        priority
        shutter
        sizes="(min-width: 768px) 42vw, 100vw"
        className="col-span-2 aspect-[4/3] md:col-span-5 md:aspect-auto"
      />

      <PlantingTiles
        initialMonth={nassauMonth()}
        listClass="col-span-2 md:col-span-7 lg:col-span-5 min-h-[22rem]"
        plateClass="col-span-1 aspect-square md:col-span-5 md:aspect-auto lg:col-span-3"
      />

      <PhotoTile
        src={PLACES.stanielCay.image}
        alt={PLACES.stanielCay.alt}
        caption={PLACES.stanielCay.caption}
        position={PLACES.stanielCay.position}
        sizes="(min-width: 1024px) 33vw, 50vw"
        className="col-span-1 aspect-square md:col-span-12 md:aspect-[21/9] lg:col-span-4 lg:aspect-auto"
      />
    </Board>
  );
}

const STAT_TONES: TileTone[] = ["sea", "ground", "field", "accent", "ground", "sea"];

/* Figures: one tile each, in a row, colours rotating. */
function Stats({ items }: { items: SiteContent["stats"]["items"] }) {
  if (items.length === 0) return null;
  return (
    <Board as="section" aria-labelledby="in-numbers" className="mt-2">
      <h2 id="in-numbers" className="sr-only">
        In numbers
      </h2>
      <div className="col-span-2 grid grid-cols-2 gap-2 md:col-span-12 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none">
      {items.map((s, i) => {
        const tone = STAT_TONES[i % STAT_TONES.length];
        const last = items.length % 2 === 1 && i === items.length - 1;
        return (
          <div
            key={`${s.value}-${i}`}
            data-reveal
            style={{ ["--i" as string]: i }}
            className={`flex min-h-[15rem] flex-col justify-between gap-8 rounded-[8px] p-6 ${TILE_TONES[tone]} ${last ? "col-span-2 lg:col-span-1" : ""}`}
          >
            {/* data-ui: the inspector reads a caption in the tile above as a label of this figure on phones. */}
            <p data-ui className="display text-[clamp(2.75rem,1.6rem+3.6vw,5rem)] leading-none">
              {s.value}
            </p>
            <p className={`max-w-[26ch] leading-snug ${tone === "ground" ? "text-ink" : TILE_SOFT[tone]}`}>{s.label}</p>
          </div>
        );
      })}
      </div>
    </Board>
  );
}

const POINT_TONES: TileTone[] = ["paper", "ground", "ground", "paper"];

/* What we do: the statement, the points as tiles, then the harbour where the food comes in. */
function About({ about }: { about: SiteContent["about"] }) {
  return (
    <Board as="section" id="about" aria-labelledby="about-title" className="mt-2 scroll-mt-4">
      <SectionHead id="about-title" title={about.title} intro={about.intro} />
      <div className="col-span-2 grid gap-2 md:col-span-12 md:grid-cols-2 lg:grid-cols-4">
        {about.items.map((p, i) => {
          const tone = POINT_TONES[i % POINT_TONES.length];
          return (
            <div
              key={`${p.title}-${i}`}
              data-reveal
              style={{ ["--i" as string]: i }}
              className={`flex flex-col rounded-[8px] p-6 md:min-h-[13rem] ${TILE_TONES[tone]}`}
            >
              <h3 className="text-[length:var(--text-lead)] font-semibold leading-tight tracking-[-0.01em]">{p.title}</h3>
              <p className="mt-auto pt-6 text-ink">{p.body}</p>
            </div>
          );
        })}
      </div>
      <PhotoTile
        src={about.image || PLACES.harbour.image}
        alt={about.image ? "" : PLACES.harbour.alt}
        caption={about.image ? undefined : PLACES.harbour.caption}
        position={about.image ? undefined : PLACES.harbour.position}
        sizes="(min-width: 768px) 66vw, 100vw"
        className="col-span-2 aspect-[4/3] md:col-span-8 md:aspect-[16/9]"
      />
      <PhotoTile
        src={PLACES.market.image}
        alt={PLACES.market.alt}
        caption={PLACES.market.caption}
        strip="sea"
        sizes="(min-width: 768px) 33vw, 100vw"
        className="col-span-2 aspect-[4/3] md:col-span-4 md:aspect-auto"
      />
    </Board>
  );
}

/* News: up to three article tiles. */
function News({ copy, posts }: { copy: SiteContent["news"]; posts: Post[] }) {
  if (posts.length === 0) return null;
  const span = posts.length === 1 ? "md:col-span-12" : posts.length === 2 ? "md:col-span-6" : "md:col-span-4";
  return (
    <Board as="section" aria-labelledby="latest" className="mt-2">
      <SectionHead id="latest" title={copy.title} intro={copy.intro} action={<MoreLink href="/news">All news</MoreLink>} />
      {posts.map((p) => (
        <div key={p.id} className={`col-span-2 ${span}`}>
          <PostCard post={p} wide={posts.length === 1} />
        </div>
      ))}
    </Board>
  );
}

/* Team: portrait tiles, four across. */
function Team({ copy, members }: { copy: SiteContent["team"]; members: TeamMember[] }) {
  if (members.length === 0) return null;
  const shown = orderTeam(members).slice(0, HOME_TEAM_LIMIT);
  return (
    <Board as="section" id="team" aria-labelledby="team-title" className="mt-2 scroll-mt-4">
      <SectionHead id="team-title" title={copy.title} intro={copy.intro} action={<MoreLink href="/team">Meet everyone</MoreLink>} />
      <div className="col-span-2 grid grid-cols-2 gap-2 md:col-span-12 md:grid-cols-4 lg:grid-cols-6">
        {shown.map((m, i) => (
          <MemberTile key={m.id} member={m} index={i} />
        ))}
      </div>
    </Board>
  );
}

/* Close: the action tile between a photograph and a contact tile. */
function Cta({ cta, email }: { cta: SiteContent["cta"]; email: string }) {
  return (
    <Board as="section" aria-labelledby="cta-title" className="mt-24 lg:mt-32">
      <PhotoTile
        src={PLACES.dock.image}
        alt={PLACES.dock.alt}
        caption={PLACES.dock.caption}
        strip="sea"
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="col-span-1 aspect-square md:col-span-6 md:aspect-[4/3] lg:col-span-3 lg:order-1 lg:aspect-auto"
      />
      <div
        data-reveal
        className="col-span-2 flex min-h-[24rem] flex-col justify-between gap-10 rounded-[8px] bg-accent p-6 text-field order-first md:col-span-12 lg:order-2 lg:col-span-6"
      >
        <h2 id="cta-title" className="display max-w-[14ch] text-[length:var(--text-head)]">
          {cta.title}
        </h2>
        <div>
          {cta.body ? <p className="max-w-[40ch] text-[length:var(--text-lead)] leading-snug">{cta.body}</p> : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {cta.primaryLabel && cta.primaryHref ? (
              <Button href={cta.primaryHref} size="lg">
                {cta.primaryLabel}
              </Button>
            ) : null}
            {cta.secondaryLabel && cta.secondaryHref ? (
              <Button href={cta.secondaryHref} variant="secondary" size="lg" className="bg-accent-2">
                {cta.secondaryLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <div
        data-reveal
        className="col-span-1 flex aspect-square flex-col justify-between rounded-[8px] bg-sea p-6 text-white md:col-span-6 md:aspect-[4/3] lg:order-3 lg:col-span-3 lg:aspect-auto"
      >
        <p className="text-[length:var(--text-lead)] font-semibold leading-tight">Questions first?</p>
        {email ? (
          <a href={`mailto:${email}`} className="text-on-sea-soft underline decoration-1 underline-offset-4 hover:text-white">
            {email.split("@")[0]}
            <wbr />@{email.split("@")[1]}
          </a>
        ) : null}
      </div>
    </Board>
  );
}

export default async function HomePage() {
  const [content, posts, team] = await Promise.all([getSiteContent(), getLatestPosts(), getPublicTeam()]);

  const sections: Record<HomeSectionId, ReactNode> = {
    stats: <Stats items={content.stats.items} />,
    news: <News copy={content.news} posts={posts} />,
    about: <About about={content.about} />,
    team: <Team copy={content.team} members={team} />,
    cta: <Cta cta={content.cta} email={content.settings.email} />,
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
