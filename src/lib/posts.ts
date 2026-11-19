// Shared post types + pure helpers. NOTE: this file must stay free of any
// server-only imports (no `next/headers`, no Supabase server client) so it can
// be imported from Client Components too. Data fetching lives in the pages /
// server actions that use the Supabase server client directly.

export type PostStatus = "draft" | "published";

export type PostAuthor = {
  full_name: string | null;
  avatar_url: string | null;
};

export type Post = {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_url: string | null;
  category: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined from profiles when we render public pages.
  author?: PostAuthor | null;
};

// Columns to select whenever we also want the author's name + avatar.
export const POST_WITH_AUTHOR =
  "id, author_id, title, slug, excerpt, body, cover_url, category, status, published_at, created_at, updated_at, author:profiles!posts_author_id_fkey(full_name, avatar_url)";

export const POST_CATEGORIES = [
  "News",
  "Guide",
  "Announcement",
  "Story",
  "Event",
] as const;

/** URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Human date, e.g. "May 12, 2026". Falls back gracefully on bad input. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Rough read-time estimate from the body text. */
export function readMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
