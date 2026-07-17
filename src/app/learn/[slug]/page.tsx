import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container, Badge, Button } from "@/components/ui";
import { ArticleCard } from "@/components/cards";
import { Icon } from "@/components/icons";
import { articles, getArticle } from "@/data/articles";

// TEMPORARILY DISABLED — set DISABLED to false to bring guide pages back.
const DISABLED: boolean = true;

export function generateStaticParams() {
  return DISABLED ? [] : articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Guide not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (DISABLED) redirect("/");
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3);
  const fallback = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const suggestions = related.length ? related : fallback;

  return (
    <article>
      {/* Header */}
      <header className="border-b border-forest-700/40 bg-forest text-mint-100">
        <Container className="py-16">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-medium text-mint hover:text-white"
          >
            <Icon.ArrowLeft className="h-4 w-4" /> Back to Learning Hub
          </Link>
          <div className="mt-7 max-w-3xl">
            <Badge tone="mint">{article.category}</Badge>
            <h1 className="font-display mt-5 text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg text-mint-100/80">{article.excerpt}</p>
            <div className="mt-6 flex items-center gap-3 text-sm text-mint-100/70">
              <span className="font-semibold text-mint">{article.author}</span>
              <span aria-hidden="true">•</span>
              <span>
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span aria-hidden="true">•</span>
              <span>{article.readMinutes} min read</span>
            </div>
          </div>
        </Container>
      </header>

      {/* Body */}
      <Container className="py-14">
        <div className="mx-auto max-w-3xl">
          {article.video ? (
            <div className="mb-10 overflow-hidden rounded-xl border border-line bg-forest">
              <div className="relative aspect-video">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${article.video}`}
                  title={article.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}

          <div
            className="prose-gs text-[1.05rem]"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          <div className="mt-12 rounded-xl border border-line bg-white p-6">
            <p className="font-display text-lg font-semibold text-forest">
              Have a plant that doesn&apos;t look right?
            </p>
            <p className="mt-1 text-sm text-ink/65">
              Use the Plant Doctor to find likely causes and practical fixes.
            </p>
            <Button href="/diagnose" className="mt-4">
              Open the Plant Doctor
              <Icon.ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>

      {/* Related */}
      <section className="border-t border-line bg-white py-16">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-forest">
            Keep learning
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </Container>
      </section>
    </article>
  );
}
