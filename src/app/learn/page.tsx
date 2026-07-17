import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { ArticleBrowser } from "@/components/article-browser";

// TEMPORARILY DISABLED — set DISABLED to false to bring the Learning Hub back.
const DISABLED: boolean = true;

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "Practical, plain-language guides on growing food in The Bahamas — from your first garden to harvest.",
};

export default function LearnPage() {
  if (DISABLED) redirect("/");
  return (
    <>
      <PageHero
        eyebrow="Learning hub"
        title="Guides for every stage of growing"
        intro="Clear, locally relevant articles written for Bahamian gardeners, new growers, and students. Filter by topic or search for what you need."
      />
      <Container className="py-14">
        <ArticleBrowser />
      </Container>
    </>
  );
}
