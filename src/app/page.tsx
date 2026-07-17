import Link from "next/link";
import { Container, SectionHeading, Button, Eyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
import { site, stats, values, offices, problems } from "@/data/site";

// Tools that are temporarily disabled while the project is in early design.
// Shown on the home page as a roadmap so the scope is clear without linking out.
const comingSoon = [
  { name: "Plant Doctor", note: "Diagnose common plant problems by symptom." },
  { name: "Learning Hub", note: "Plain-language guides for every growing stage." },
  { name: "Crop Guides", note: "What grows well in Bahamian conditions." },
  { name: "Resources", note: "Videos, downloads, and quick answers." },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="border-b border-forest-700/40 bg-forest text-mint-100">
        <Container className="py-20 sm:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="animate-fade-in">
              <Eyebrow>Agriculture for The Bahamas</Eyebrow>
              <h1 className="font-display mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl">
                Grow food with confidence, anywhere in the islands.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-mint-100/80">
                {site.description}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/signup" variant="secondary" size="lg">
                  Create free account
                </Button>
                <Button
                  href="/login"
                  size="lg"
                  className="bg-transparent text-mint-100 ring-1 ring-white/20 hover:bg-white/[0.06]"
                >
                  Log in
                </Button>
              </div>
              <p className="mt-12 border-t border-white/10 pt-6 text-sm font-medium tracking-wide text-mint/80">
                {site.motto}
              </p>
            </div>

            {/* Roadmap panel — signals where the project is heading */}
            <div className="animate-fade-in">
              <div className="rounded-2xl border border-white/10 bg-white p-7 text-ink shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/[0.06] text-forest">
                    <Icon.Leaf className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-leaf">
                      On the way
                    </p>
                    <p className="font-display text-lg font-semibold text-forest">
                      Tools we&apos;re building
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-ink/65">
                  We&apos;re starting small on purpose. Create an account to be
                  first in line as each tool goes live.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {comingSoon.map((t) => (
                    <li
                      key={t.name}
                      className="flex items-start gap-3 rounded-lg border border-line px-4 py-3"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                      <span>
                        <span className="block text-sm font-semibold text-forest">
                          {t.name}
                        </span>
                        <span className="block text-xs text-ink/55">
                          {t.note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* STATS */}
      <section className="border-b border-line bg-white">
        <Container className="py-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
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

      {/* WHY WE EXIST */}
      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="Why we exist"
            title="Clear, local guidance you can actually use"
            intro="Agriculture in The Bahamas faces real pressure — imported food, high costs, limited land. Green Solutions turns that complexity into simple, confident next steps."
          />
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="border-t border-forest/15 pt-5">
                <span className="font-display text-sm font-semibold text-leaf">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-lg font-semibold text-forest">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ABOUT — problem & approach */}
      <section id="about" className="scroll-mt-20 border-y border-line bg-white py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>The problem</Eyebrow>
              <h2 className="font-display mt-4 text-2xl font-semibold text-forest sm:text-3xl">
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
                    className="flex items-start gap-3 rounded-xl border border-line bg-paper p-4"
                  >
                    <span className="mt-2 h-px w-3 shrink-0 bg-ochre" />
                    <span className="text-sm text-ink/75">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow>Our approach</Eyebrow>
              <h2 className="font-display mt-4 text-2xl font-semibold text-forest sm:text-3xl">
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
                    className="rounded-xl border border-line bg-paper p-5"
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
      </section>

      {/* TEAM */}
      <section id="team" className="scroll-mt-20 py-24">
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
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  {o.role}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CURRENT STAGE + MOTTO */}
      <Container className="pb-24">
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

      {/* CTA */}
      <section className="pb-24">
        <Container>
          <div className="rounded-2xl border border-line bg-white px-8 py-16 text-center sm:px-16">
            <Eyebrow>Join the project</Eyebrow>
            <h2 className="font-display mx-auto mt-5 max-w-2xl text-3xl font-semibold leading-tight text-forest sm:text-[2.5rem]">
              Create an account and grow with us
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-ink/65">
              Whether you grow, teach, mentor, or just want to learn — there is a
              place for you here. Set up your account in under a minute.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/signup" size="lg">
                Create free account
              </Button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-[0.95rem] font-semibold text-forest ring-1 ring-forest/15 transition-colors hover:bg-forest/[0.04]"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
