"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/admin/auth";
import { POST_CATEGORIES, slugify } from "@/lib/posts";
import type { createClient } from "@/lib/supabase/server";

export type PostState = { error?: string; ok?: boolean };
type Supabase = Awaited<ReturnType<typeof createClient>>;

const LIMITS = { title: 160, excerpt: 280, body: 100_000 };

/** Ensure a slug is unique, appending -2, -3… on collision. */
async function uniqueSlug(supabase: Supabase, base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "post";
  let candidate = root;
  for (let n = 2; n < 50; n++) {
    let query = supabase.from("posts").select("id").eq("slug", candidate).limit(1);
    if (ignoreId) query = query.neq("id", ignoreId);
    const { data } = await query;
    if (!data || data.length === 0) return candidate;
    candidate = `${root}-${n}`;
  }
  return `${root}-${Date.now()}`;
}

function readForm(formData: FormData) {
  const category = String(formData.get("category") ?? "").trim();
  const cover = String(formData.get("cover_url") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: String(formData.get("body") ?? "").replace(/\r\n/g, "\n"),
    category: (POST_CATEGORIES as readonly string[]).includes(category) ? category : "",
    cover_url: /^https?:\/\//i.test(cover) ? cover : "",
    status: String(formData.get("status") ?? "draft") === "published" ? "published" : "draft",
  } as const;
}

function check(f: ReturnType<typeof readForm>): string | null {
  if (!f.title) return "Give your article a title.";
  if (f.title.length > LIMITS.title) return `Keep the title under ${LIMITS.title} characters.`;
  if (f.excerpt.length > LIMITS.excerpt) return `Keep the excerpt under ${LIMITS.excerpt} characters.`;
  if (f.body.length > LIMITS.body) return "The article is too long.";
  return null;
}

function refresh(slug?: string) {
  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  revalidatePath("/news");
  if (slug) revalidatePath(`/news/${slug}`);
  revalidatePath("/");
}

export async function createPost(_prev: PostState, formData: FormData): Promise<PostState> {
  const auth = await requireRole("staff");
  if ("error" in auth) return { error: auth.error };
  const { supabase, viewer } = auth;

  const f = readForm(formData);
  const problem = check(f);
  if (problem) return { error: problem };

  const slug = await uniqueSlug(supabase, f.slug || f.title);
  const { error } = await supabase.from("posts").insert({
    author_id: viewer.userId,
    title: f.title,
    slug,
    excerpt: f.excerpt || null,
    body: f.body,
    category: f.category || null,
    cover_url: f.cover_url || null,
    status: f.status,
    published_at: f.status === "published" ? new Date().toISOString() : null,
  });
  if (error) return { error: error.message };

  refresh(slug);
  redirect(`/admin/articles?saved=${f.status}`);
}

export async function updatePost(_prev: PostState, formData: FormData): Promise<PostState> {
  const auth = await requireRole("staff");
  if ("error" in auth) return { error: auth.error };
  const { supabase } = auth;

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing article id." };

  const f = readForm(formData);
  const problem = check(f);
  if (problem) return { error: problem };

  // RLS limits this to posts the user may see; nothing back = not allowed.
  const { data: current } = await supabase
    .from("posts")
    .select("status, published_at, slug")
    .eq("id", id)
    .maybeSingle();
  if (!current) return { error: "This article doesn't exist or you can't edit it." };

  const slug =
    f.slug && slugify(f.slug) !== current.slug ? await uniqueSlug(supabase, f.slug, id) : current.slug;

  // Stamp published_at only on the draft → published edge.
  const publishedAt = f.status === "published" ? (current.published_at ?? new Date().toISOString()) : null;

  const { data: updated, error } = await supabase
    .from("posts")
    .update({
      title: f.title,
      slug,
      excerpt: f.excerpt || null,
      body: f.body,
      category: f.category || null,
      cover_url: f.cover_url || null,
      status: f.status,
      published_at: publishedAt,
    })
    .eq("id", id)
    .select("id");
  if (error) return { error: error.message };
  // Under RLS a forbidden update matches zero rows instead of erroring.
  if (!updated || updated.length === 0) return { error: "You can't edit this article." };

  refresh(slug);
  if (current.slug !== slug) revalidatePath(`/news/${current.slug}`);
  redirect(`/admin/articles?saved=${f.status}`);
}

export async function deletePost(formData: FormData): Promise<void> {
  const auth = await requireRole("staff");
  if ("error" in auth) return;
  const { supabase } = auth;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data } = await supabase.from("posts").delete().eq("id", id).select("slug");
  refresh(data?.[0]?.slug);
  redirect("/admin/articles?saved=deleted");
}
