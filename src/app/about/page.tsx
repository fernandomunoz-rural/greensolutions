import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container, SectionHeading, Eyebrow } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { offices, problems, site, values } from "@/data/site";

// DISABLED — the About content now lives on the home page (/#about).
// Set DISABLED to false to restore the standalone About page.
const DISABLED: boolean = true;

export const metadata: Metadata = {
  title: "About",
  description:
    "Green Solutions is a developing project supporting agriculture in The Bahamas through practical tools, clear guidance, and applied learning.",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AboutPage() {
  if (DISABLED) redirect("/#about");
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Building practical agriculture for The Bahamas, step by step"
        intro={site.description}
      />

      {/* Problem / approach */}
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="font-display mt-4 text-2xl font-semibold text-forest">
              Why this matters
            </h2>
            <p className="mt-3 text-ink/65">
              Agriculture in The Bahamas faces real, stacked challenges. Many
              people want to grow food or learn but don&apos;t have simple,
              reliable support they can use.
            </p>
            <ul className="mt-6 space-y-2.5">
              {problems.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 rounded-xl border border-line bg-white p-4"
                >
                  <span className="mt-2 h-px w-3 shrink-0 bg-ochre" />
                  <span className="text-sm text-ink/75">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Our approach</Eyebrow>
            <h2 className="font-display mt-4 text-2xl font-semibold text-forest">
              What we&apos;re doing about it
            </h2>
            <p className="mt-3 text-ink/65">
              We&apos;re starting small on purpose — organizing knowledge,
              designing tools, and exploring how technology, including AI, can
              support learning. We expand only after ideas are tested and shown
              to be useful.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-xl border border-line bg-white p-5"
                >
                  <h3 className="font-display font-semibold text-forest">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink/65">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Living structure / team */}
      <section id="team" className="scroll-mt-20 border-y border-line bg-white py-20">
        <Container>
          <SectionHeading
            eyebrow="The living structure"
            title="A connected team, each with a clear role"
            intro="Green Solutions operates as a connected system. Each office has a clear role, and all work together in a continuous cycle of learning, support, and development."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((o) => (
              <div
                key={o.name}
                className="flex flex-col rounded-xl border border-line p-6 transition-colors hover:border-forest/25"
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
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  {o.role}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stage + motto */}
      <Container className="py-20">
        <div className="rounded-2xl bg-forest px-8 py-16 text-center text-mint-100 sm:px-16">
          <Eyebrow>Current stage</Eyebrow>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-mint-100/80">
            The project is in the planning and early design stage — gathering
            resources, seeking mentors, building a small interdisciplinary team,
            and defining clear goals and next steps.
          </p>
          <p className="font-display mt-8 text-2xl font-medium text-mint">
            {site.motto}
          </p>
        </div>
      </Container>
    </>
  );
}
