import type { Metadata } from "next";
import { Container, Button } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { TeamProfile } from "@/components/team-card";
import { getSiteContent } from "@/lib/content/load";
import { getPublicTeam } from "@/lib/team-load";
import { groupTeam } from "@/lib/team";

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
      <PageHero eyebrow={content.team.eyebrow || "Team"} title={content.team.title} intro={content.team.intro} />
      <Container className="py-14 sm:py-20">
        {groups.length === 0 ? (
          <p className="text-center text-ink/60">Team profiles are coming soon.</p>
        ) : (
          <div className="space-y-16">
            {groups.map(({ group, members: list }) => (
              <section key={group} aria-labelledby={`g-${group}`}>
                {groups.length > 1 ? (
                  <h2 id={`g-${group}`} className="font-display mb-6 text-2xl font-semibold text-forest">
                    {group}
                  </h2>
                ) : (
                  <h2 id={`g-${group}`} className="sr-only">
                    {group}
                  </h2>
                )}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((m) => (
                    <TeamProfile key={m.id} member={m} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {content.settings.email ? (
          <div className="mt-20 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-white p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-semibold text-forest">Want to work with us?</h2>
              <p className="mt-1 text-sm text-ink/60">We&rsquo;re always glad to hear from growers, students and partners.</p>
            </div>
            <Button href={`mailto:${content.settings.email}`}>Get in touch</Button>
          </div>
        ) : null}
      </Container>
    </>
  );
}
