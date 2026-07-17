import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container, Badge, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { crops, getCrop } from "@/data/crops";

// TEMPORARILY DISABLED — set DISABLED to false to bring crop pages back.
const DISABLED: boolean = true;

export function generateStaticParams() {
  return DISABLED ? [] : crops.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const crop = getCrop(slug);
  if (!crop) return { title: "Crop not found" };
  return {
    title: `${crop.name} — Growing Guide`,
    description: crop.summary,
  };
}

export default async function CropPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (DISABLED) redirect("/");
  const { slug } = await params;
  const crop = getCrop(slug);
  if (!crop) notFound();

  const facts = [
    { label: "Difficulty", value: crop.difficulty },
    { label: "Season", value: crop.season },
    { label: "Days to harvest", value: crop.daysToHarvest },
    { label: "Sunlight", value: crop.sun },
    { label: "Spacing", value: crop.spacing },
  ];

  return (
    <>
      <header className="border-b border-forest-700/40 bg-forest text-mint-100">
        <Container className="py-16">
          <Link
            href="/crops"
            className="inline-flex items-center gap-2 text-sm font-medium text-mint hover:text-white"
          >
            <Icon.ArrowLeft className="h-4 w-4" /> Back to Crop Guides
          </Link>
          <div className="mt-7 flex items-center gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-mint">
              <Icon.Sprout className="h-7 w-7" />
            </span>
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {crop.name}
              </h1>
              <p className="mt-2 max-w-xl text-mint-100/80">{crop.summary}</p>
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* Fact sheet */}
          <aside>
            <div className="rounded-xl border border-line bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-forest">
                At a glance
              </h2>
              <dl className="mt-3 divide-y divide-line">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center justify-between py-3"
                  >
                    <dt className="text-sm text-ink/55">{f.label}</dt>
                    <dd className="text-sm font-medium text-forest">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          {/* Growing tips */}
          <div>
            <Badge tone="leaf">Growing tips</Badge>
            <h2 className="font-display mt-4 text-2xl font-semibold text-forest">
              How to grow {crop.name.toLowerCase()} successfully
            </h2>
            <ul className="mt-6 space-y-3">
              {crop.tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-xl border border-line bg-white p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest/[0.06] font-display text-sm font-semibold text-leaf">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink/75">{tip}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <p className="font-display text-lg font-semibold text-forest">
                Something not looking right?
              </p>
              <p className="mt-1 text-sm text-ink/65">
                Check symptoms against likely causes with the Plant Doctor.
              </p>
              <Button href="/diagnose" className="mt-4">
                Diagnose a plant
                <Icon.ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
