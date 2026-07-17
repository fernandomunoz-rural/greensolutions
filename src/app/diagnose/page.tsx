import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { PlantDoctor } from "@/components/plant-doctor";

// TEMPORARILY DISABLED — set DISABLED to false to bring the Plant Doctor back.
const DISABLED: boolean = true;

export const metadata: Metadata = {
  title: "Plant Doctor",
  description:
    "Tell us what your plant looks like and get the most likely causes — with practical, low-cost fixes tuned for Bahamian conditions.",
};

export default function DiagnosePage() {
  if (DISABLED) redirect("/");
  return (
    <>
      <PageHero
        eyebrow="Plant Doctor"
        title="Diagnose common plant problems"
        intro="Select the symptoms you can see on your plant. We'll rank the most likely causes and give you practical, low-cost steps to fix them — built for island growing."
      />
      <Container className="py-14">
        <PlantDoctor />
      </Container>
    </>
  );
}
