import type { Metadata } from "next";
import { Board, SectionHead } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { TeamProfile } from "@/components/team-card";
import { getSiteContent } from "@/lib/content/load";
import { getPublicTeam } from "@/lib/team-load";
import { groupTeam } from "@/lib/team";
import { PLACES } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { team } = await getSiteContent();
  return { title: "Our team", description: team.intro };
}

export default async function TeamPage() {
  const [content, members] = await Promise.all([getSiteContent(), getPublicTeam()]);
  const groups = groupTeam(members);

  return (
    <>
      {/* The islands the team works for. Not the team's own land. */}
      <PageHero title={content.team.title} intro={content.team.intro} place={PLACES.market} />

      {groups.length === 0 ? (
        <Board className="mt-2">
          <p className="col-span-2 rounded-[8px] bg-ground-2 p-6 md:col-span-12">Team profiles are coming soon.</p>
        </Board>
      ) : (
        groups.map(({ group, members: list }, gi) => (
          <Board as="section" key={group} aria-labelledby={`g-${gi}`} className="mt-2">
            {groups.length > 1 ? (
              <SectionHead id={`g-${gi}`} title={group} />
            ) : (
              <h2 id={`g-${gi}`} className="sr-only">
                {group}
              </h2>
            )}
            <div className="col-span-2 grid gap-2 md:col-span-12 md:grid-cols-2 lg:grid-cols-4">
              {list.map((m, i) => (
                <TeamProfile key={m.id} member={m} index={i} />
              ))}
            </div>
          </Board>
        ))
      )}

      {content.settings.email ? (
        <Board className="mt-24 lg:mt-32">
          <div data-reveal className="col-span-2 flex flex-wrap items-end justify-between gap-6 rounded-[8px] bg-accent p-6 text-field md:col-span-12">
            <p className="display max-w-[18ch] text-[length:var(--text-head)]">Want to grow with us?</p>
            <a
              href={`mailto:${content.settings.email}`}
              className="press inline-flex h-13 items-center rounded-[8px] bg-field px-7 font-medium text-on-field transition-colors hover:bg-ink"
            >
              Write to {content.settings.email}
            </a>
          </div>
        </Board>
      ) : null}
    </>
  );
}
