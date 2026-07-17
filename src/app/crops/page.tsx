import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { CropCard } from "@/components/cards";
import { crops } from "@/data/crops";

// TEMPORARILY DISABLED — set DISABLED to false to bring Crop Guides back.
const DISABLED: boolean = true;

export const metadata: Metadata = {
  title: "Crop Guides",
  description:
    "Beginner-friendly crops chosen for the Bahamian climate — seasons, spacing, harvest times, and growing tips.",
};

export default function CropsPage() {
  if (DISABLED) redirect("/");
  return (
    <>
      <PageHero
        eyebrow="Crop guides"
        title="What grows well in The Bahamas"
        intro="Each guide gives you the essentials at a glance — when to plant, how much space and sun it needs, when to harvest, and the tips that make the difference."
      />
      <Container className="py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {crops.map((c) => (
            <CropCard key={c.slug} crop={c} />
          ))}
        </div>
      </Container>
    </>
  );
}
