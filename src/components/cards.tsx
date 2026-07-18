import Link from "next/link";
import { Badge } from "./ui";
import { Icon } from "./icons";
import { Avatar } from "./avatar";
import { formatDate, readMinutes, type Post } from "@/lib/posts";
import type { Article } from "@/data/articles";
import type { Crop } from "@/data/crops";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 hover:border-forest/25"
    >
      {/* Cover */}
      {post.cover_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- user-uploaded storage URL
        <img
          src={post.cover_url}
          alt=""
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-leaf to-forest text-mint/70">
          <Icon.Leaf className="h-9 w-9" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          {post.category ? (
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-leaf">
              {post.category}
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs text-ink/40">
            {readMinutes(post.body)} min read
          </span>
        </div>
        <h3 className="font-display mt-3 text-xl font-semibold leading-snug text-forest">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/65">
            {post.excerpt}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <div className="mt-6 flex items-center gap-2.5 border-t border-line pt-4">
          <Avatar
            src={post.author?.avatar_url}
            name={post.author?.full_name}
            className="h-7 w-7 text-[0.6rem]"
          />
          <span className="text-xs font-medium text-ink/55">
            {post.author?.full_name ?? "Green Solutions"}
          </span>
          {post.published_at ? (
            <>
              <span className="text-ink/30" aria-hidden="true">
                •
              </span>
              <span className="text-xs text-ink/45">
                {formatDate(post.published_at)}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="group flex flex-col rounded-xl border border-line bg-white p-6 transition-colors duration-200 hover:border-forest/25"
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
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
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
      className="group flex flex-col rounded-xl border border-line bg-white p-6 transition-colors duration-200 hover:border-forest/25"
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
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 text-xs">
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
