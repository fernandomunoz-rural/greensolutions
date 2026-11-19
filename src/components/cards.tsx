import Link from "next/link";
import { Badge } from "./ui";
import { Icon } from "./icons";
import { formatDate, readMinutes, type Post } from "@/lib/posts";
import type { Article } from "@/data/articles";
import type { Crop } from "@/data/crops";

/** An article as a row: picture, then the title large, then the excerpt. No box. */
export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/news/${post.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-ground-2">
        {post.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-uploaded storage URL
          <img
            src={post.cover_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : (
          <span className="display flex h-full w-full items-end bg-field p-5 text-[length:var(--text-lead)] text-accent">
            {post.category ?? "News"}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-[length:var(--text-lead)] leading-tight text-ink group-hover:text-field">{post.title}</h3>
      <p className="mt-1 text-[length:var(--text-small)] text-ink-soft">
        {[post.category, formatDate(post.published_at), `${readMinutes(post.body)} min read`].filter(Boolean).join(" · ")}
      </p>
      {post.excerpt ? <p className="mt-2 text-ink-soft">{post.excerpt}</p> : null}
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
