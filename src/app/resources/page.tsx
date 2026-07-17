import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container, Badge } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { Icon } from "@/components/icons";
import { videos, downloads, faqs } from "@/data/resources";

// TEMPORARILY DISABLED — set DISABLED to false to bring Resources back.
const DISABLED: boolean = true;

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Videos, downloadable guides, and answers to common questions about growing food in The Bahamas.",
};

const typeIcon: Record<string, keyof typeof Icon> = {
  PDF: "File",
  Checklist: "ListCheck",
  Calendar: "Calendar",
};

export default function ResourcesPage() {
  if (DISABLED) redirect("/");
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Watch, download, and learn"
        intro="A growing library of videos and printable guides. As Green Solutions expands, this is where new media and tools will live."
      />

      {/* Videos */}
      <Container className="py-20">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-forest">
            Video library
          </h2>
          <Badge tone="neutral">Growing collection</Badge>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {videos.map((v, i) => (
              <div
                key={`${v.id}-${i}`}
                className="overflow-hidden rounded-xl border border-line bg-white"
              >
                <div className="relative aspect-video bg-forest">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold uppercase tracking-[0.14em] text-leaf">
                      {v.category}
                    </span>
                    <span className="text-ink/40">{v.duration}</span>
                  </div>
                  <h3 className="font-display mt-2.5 text-lg font-semibold text-forest">
                    {v.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
                    {v.description}
                  </p>
                </div>
              </div>
          ))}
        </div>
      </Container>

      {/* Downloads */}
      <section className="border-y border-line bg-white py-20">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-forest">
            Downloadable guides
          </h2>
          <p className="mt-2 max-w-2xl text-ink/65">
            Printable references you can keep by the garden. (Sample files for
            the testing phase.)
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {downloads.map((d) => {
              const TypeIcon = Icon[typeIcon[d.type] ?? "File"];
              return (
                <div
                  key={d.title}
                  className="group flex items-center gap-4 rounded-xl border border-line p-5 transition-colors hover:border-forest/25"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest/[0.06] text-forest">
                    <TypeIcon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-medium text-forest">{d.title}</h3>
                    <p className="text-sm text-ink/60">{d.description}</p>
                    <p className="mt-1 text-xs text-ink/40">
                      {d.type} · {d.size}
                    </p>
                  </div>
                  <Icon.Download className="h-5 w-5 text-ink/35 transition-colors group-hover:text-forest" />
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <Container className="py-20">
        <h2 className="font-display text-2xl font-semibold text-forest">
          Frequently asked questions
        </h2>
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-line rounded-xl border border-line bg-white px-6">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-forest">
                {f.q}
                <Icon.Plus className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </>
  );
}
