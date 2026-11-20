import type { Metadata } from "next";
import { Button, Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { TeamProfile } from "@/components/team-card";
import { Split } from "@/components/motion/split";
import { getSiteContent } from "@/lib/content/load";
import { getPublicTeam } from "@/lib/team-load";
import { groupTeam } from "@/lib/team";
import { PHOTOS } from "@/lib/photos";

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
      {/* The islands the team works for; not the team's own land. */}
      <PageHero
        title={content.team.title}
        intro={content.team.intro}
        photo={content.team.image ? { image: content.team.image, alt: "" } : PHOTOS.stanielCay}
      />

      <Container className="py-[clamp(5rem,10vw,9rem)]">
        {groups.length === 0 ? (
          <p className="text-[length:var(--text-lead)]">Team profiles are coming soon.</p>
        ) : (
          groups.map(({ group, members: list }, gi) => (
            <section key={group} aria-labelledby={`g-${gi}`} className={gi > 0 ? "mt-[clamp(5rem,10vw,8rem)]" : ""}>
              {groups.length > 1 ? (
                <Split id={`g-${gi}`} text={group} className="display mb-10 text-[clamp(2rem,1.4rem+2.2vw,3.5rem)]" />
              ) : (
                <h2 id={`g-${gi}`} className="sr-only">
                  {group}
                </h2>
              )}
              <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((m, i) => (
                  <TeamProfile key={m.id} member={m} index={i} />
                ))}
              </div>
            </section>
          ))
        )}
      </Container>

      {content.settings.email && content.team.joinTitle ? (
        <Container>
          <div className="flex flex-col gap-8 rounded-[28px] bg-field p-[clamp(1.75rem,5vw,4.5rem)] text-white md:flex-row md:items-end md:justify-between">
            <Split text={content.team.joinTitle} className="display max-w-[14ch] text-[length:var(--text-head)]" />
            <Button href={`mailto:${content.settings.email}`} variant="accent" size="lg" arrow>
              Write to us
            </Button>
          </div>
        </Container>
      ) : null}
    </>
  );
}
