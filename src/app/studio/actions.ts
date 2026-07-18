"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/posts";

export type PostState = { error?: string; ok?: boolean };

/** Resolve the signed-in staff user, or throw a friendly error state. */
async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be logged in." as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isStaff = profile?.role === "admin" || profile?.role === "editor";
  if (!isStaff) return { error: "You don't have permission to do that." as const };

  return { supabase, user };
}

/** Ensure a slug is unique, appending -2, -3… on collision. */
async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  ignoreId?: string,
): Promise<string> {
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
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: String(formData.get("body") ?? ""),
    category: String(formData.get("category") ?? "").trim(),
    cover_url: String(formData.get("cover_url") ?? "").trim(),
    status: String(formData.get("status") ?? "draft") === "published"
      ? "published"
      : "draft",
  };
}

export async function createPost(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const staff = await requireStaff();
  if ("error" in staff) return { error: staff.error };
  const { supabase, user } = staff;

  const f = readForm(formData);
  if (!f.title) return { error: "Give your post a title." };

  const slug = await uniqueSlug(supabase, f.slug || f.title);

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
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

  revalidatePath("/studio");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/studio");
}

export async function updatePost(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const staff = await requireStaff();
  if ("error" in staff) return { error: staff.error };
  const { supabase } = staff;

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing post id." };

  const f = readForm(formData);
  if (!f.title) return { error: "Give your post a title." };

  // Read current state so we only stamp published_at on the draft→published edge.
  const { data: current } = await supabase
    .from("posts")
    .select("status, published_at, slug")
    .eq("id", id)
    .single();

  const slug =
    f.slug && f.slug !== current?.slug
      ? await uniqueSlug(supabase, f.slug, id)
      : current?.slug ?? (await uniqueSlug(supabase, f.title, id));

  const publishedAt =
    f.status === "published"
      ? current?.published_at ?? new Date().toISOString()
      : null;

  const { error } = await supabase
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
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/studio");
  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  revalidatePath("/");
  redirect("/studio");
}

export async function deletePost(formData: FormData): Promise<void> {
  const staff = await requireStaff();
  if ("error" in staff) return;
  const { supabase } = staff;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/studio");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/studio");
}
