import Image from "next/image";
import Link from "next/link";
import { ALL_PLATES } from "@/lib/calendar";
import { Badge } from "./ui";
import { Icon } from "./icons";
import { formatDate, readMinutes, type Post } from "@/lib/posts";
import type { Article } from "@/data/articles";
import type { Crop } from "@/data/crops";

/** Without a cover, an article borrows one of the botanical plates, picked by its slug. */
export function fallbackPlate(slug: string) {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ALL_PLATES[h % ALL_PLATES.length];
}

/** An article as a tile: picture on top, then date, title and excerpt. */
export function PostCard({ post, className = "", wide = false }: { post: Post; className?: string; /** Picture beside the words, for a lone article. */ wide?: boolean }) {
  const plate = post.cover_url ? null : fallbackPlate(post.slug);
  return (
    <Link
      href={`/news/${post.slug}`}
      data-reveal
      className={`group flex h-full flex-col overflow-hidden rounded-[8px] bg-ground-2 transition-colors duration-200 hover:bg-ground-3 ${wide ? "md:flex-row" : ""} ${className}`}
    >
      <div className={`relative aspect-[16/10] shrink-0 overflow-hidden bg-tile ${wide ? "md:aspect-auto md:min-h-[24rem] md:w-1/2" : ""}`}>
        {post.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-uploaded storage URL
          <img
            src={post.cover_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : plate ? (
          <Image
            src={plate.image}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover mix-blend-multiply transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
            style={{ objectPosition: plate.focus }}
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[length:var(--text-small)] text-ink-soft">
          {[post.category, formatDate(post.published_at), `${readMinutes(post.body)} min read`].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-2 text-[length:var(--text-lead)] font-semibold leading-tight tracking-[-0.01em] text-ink">{post.title}</h3>
        {post.excerpt ? <p className="mt-3 line-clamp-3 text-ink">{post.excerpt}</p> : null}
        <span className="mt-auto flex items-center gap-2 pt-6 text-[length:var(--text-small)] font-medium text-field">
          Read the article
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="group flex flex-col rounded-[6px] bg-white p-6 transition-colors duration-200 hover:bg-ground-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-leaf">
          {article.category}
        </span>
        <span className="text-xs text-ink/40">{article.readMinutes} min read</span>
      </div>
      <h3 className="font-display mt-4 text-xl font-semibold leading-snug text-forest">
        {article.title}
      </h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/65">
        {article.excerpt}
      </p>
      <div className="mt-6 flex items-center justify-between pt-2">
        <span className="text-xs font-medium text-ink/55">{article.author}</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full text-forest transition-transform duration-200 group-hover:translate-x-0.5">
          <Icon.ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

const difficultyTone: Record<Crop["difficulty"], "leaf" | "ochre" | "neutral"> = {
  Easy: "leaf",
  Moderate: "ochre",
  Advanced: "neutral",
};

export function CropCard({ crop }: { crop: Crop }) {
  return (
    <Link
      href={`/crops/${crop.slug}`}
      className="group flex flex-col rounded-[6px] bg-white p-6 transition-colors duration-200 hover:bg-ground-2"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/[0.06] text-forest">
          <Icon.Sprout className="h-5 w-5" />
        </span>
        <Badge tone={difficultyTone[crop.difficulty]}>{crop.difficulty}</Badge>
      </div>
      <h3 className="font-display mt-4 text-xl font-semibold text-forest">
        {crop.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
        {crop.summary}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-xs">
        <div>
          <dt className="text-ink/45">Season</dt>
          <dd className="mt-0.5 font-medium text-forest">{crop.season}</dd>
        </div>
        <div>
          <dt className="text-ink/45">Harvest</dt>
          <dd className="mt-0.5 font-medium text-forest">{crop.daysToHarvest}</dd>
        </div>
      </dl>
    </Link>
  );
}
