import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { InvolveForm } from "@/components/involve-form";
import { Icon, type IconName } from "@/components/icons";
import { site } from "@/data/site";

// TEMPORARILY DISABLED — set DISABLED to false to bring Get Involved back.
const DISABLED: boolean = true;

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Offer advice, share experience, support research, or help shape tools. Involvement in Green Solutions is flexible and based on interest and availability.",
};

const ways: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "Compass",
    title: "Offer advice or mentorship",
    body: "Share your expertise in agriculture, technology, design, or education.",
  },
  {
    icon: "Wheat",
    title: "Share experience or feedback",
    body: "Tell us what works in your garden and help us improve our guidance.",
  },
  {
    icon: "Microscope",
    title: "Support research or planning",
    body: "Help test ideas, gather resources, and refine what we build.",
  },
  {
    icon: "Wrench",
    title: "Help shape tools or ideas",
    body: "Contribute to the design of practical tools that fit Bahamian conditions.",
  },
];

export default function GetInvolvedPage() {
  if (DISABLED) redirect("/");
  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="There's a place for you in this project"
        intro="People can be involved in many ways — and it's all flexible, based on your interest and availability. Input and guidance are genuinely welcomed as the project takes shape."
      />

      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          {/* Ways to help */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">
              Ways to get involved
            </h2>
            <div className="mt-6 space-y-3">
              {ways.map((w) => {
                const WIcon = Icon[w.icon];
                return (
                  <div
                    key={w.title}
                    className="flex gap-4 rounded-xl border border-line bg-white p-5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest/[0.06] text-forest">
                      <WIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-forest">
                        {w.title}
                      </h3>
                      <p className="mt-1 text-sm text-ink/65">{w.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-start gap-4 rounded-xl border border-line bg-white p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest/[0.06] text-forest">
                <Icon.Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-ink/60">
                  Prefer to email us directly?
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="font-display mt-0.5 inline-block text-lg font-semibold text-leaf hover:text-forest"
                >
                  {site.email}
                </a>
                <p className="mt-0.5 text-xs text-ink/50">{site.location}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div id="contact" className="scroll-mt-20">
            <h2 className="font-display text-2xl font-semibold text-forest">
              Send us a message
            </h2>
            <p className="mt-2 text-ink/70">
              Tell us how you&apos;d like to help and we&apos;ll be in touch.
            </p>
            <div className="mt-6">
              <InvolveForm />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
