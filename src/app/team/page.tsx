import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { TeamProfile } from "@/components/team-card";
import { getSiteContent } from "@/lib/content/load";
import { getPublicTeam } from "@/lib/team-load";
import Image from "next/image";
import { groupTeam } from "@/lib/team";
import stanielCay from "@/assets/places/flying-over-stanlel-cay-3425540229.jpg";

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
      <PageHero title={content.team.title} intro={content.team.intro} />
      {/* The islands the team works for. Not the team's own land. */}
      <figure className="px-[var(--margin)]">
        <div className="relative mx-auto aspect-[21/9] max-w-[1440px] overflow-hidden bg-ground-2 max-sm:aspect-[4/3]">
          <Image src={stanielCay} alt="Aerial view of Staniel Cay in the Exumas" fill sizes="100vw" className="object-cover" style={{ objectPosition: "50% 30%" }} priority />
        </div>
        <figcaption className="mx-auto mt-2 max-w-[1440px] text-[length:var(--text-small)] text-ink-soft">Staniel Cay, Exuma. Photo: cogdogblog, CC0.</figcaption>
      </figure>
      <Container className="pb-[clamp(5rem,10vw,9rem)]">
        {groups.length === 0 ? (
          <p className="text-ink">Team profiles are coming soon.</p>
        ) : (
          groups.map(({ group, members: list }) => (
            <section key={group} aria-labelledby={`g-${group}`} className="mt-24">
              <h2
                id={`g-${group}`}
                className={groups.length > 1 ? "display text-[length:var(--text-head)] lg:ml-[calc(2/12*100%)]" : "sr-only"}
              >
                {group}
              </h2>
              {list.map((m, i) => (
                <TeamProfile key={m.id} member={m} index={i} />
              ))}
            </section>
          ))
        )}

        {content.settings.email ? (
          <p className="mt-16 text-[length:var(--text-lead)] lg:ml-[calc(2/12*100%)]">
            Want to grow with us?{" "}
            <a href={`mailto:${content.settings.email}`} className="underline decoration-1 underline-offset-4 hover:text-field">
              Write to {content.settings.email}
            </a>
            .
          </p>
        ) : null}
      </Container>
    </>
  );
}
