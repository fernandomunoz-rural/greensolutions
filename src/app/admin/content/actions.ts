"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin/auth";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { changedKeys, normalizeContent, type FieldErrors } from "@/lib/content/validate";
import type { SiteContent } from "@/lib/content/schema";

export type ContentResult = { ok: true; at: string; changed?: string[] } | { ok: false; error: string; errors?: FieldErrors };

function refreshSite() {
  // Content shows in the shared layout (header/footer) and the home page.
  revalidatePath("/", "layout");
}

export async function saveDraft(input: unknown): Promise<ContentResult> {
  const auth = await requireRole("admin");
  if ("error" in auth) return { ok: false, error: auth.error };
  const { content, errors } = normalizeContent(input, { strict: true });
  if (Object.keys(errors).length) return { ok: false, error: "Some fields need attention.", errors };

  const { data, error } = await auth.supabase
    .from("site_content_draft")
    .upsert({ id: 1, content, updated_by: auth.viewer.userId })
    .select("updated_at")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/content");
  return { ok: true, at: data.updated_at };
}

export async function discardDraft(): Promise<ContentResult> {
  const auth = await requireRole("admin");
  if ("error" in auth) return { ok: false, error: auth.error };
  const { error } = await auth.supabase.from("site_content_draft").delete().eq("id", 1);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/content");
  return { ok: true, at: new Date().toISOString() };
}

/** Publish: the content becomes a new version (live), and the draft is cleared. */
export async function publishContent(input: unknown): Promise<ContentResult> {
  const auth = await requireRole("admin");
  if ("error" in auth) return { ok: false, error: auth.error };
  const { supabase, viewer } = auth;
  const { content, errors } = normalizeContent(input, { strict: true });
  if (Object.keys(errors).length) return { ok: false, error: "Some fields need attention.", errors };

  const { data: latest } = await supabase
    .from("site_content_versions")
    .select("content")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();
  const before: SiteContent = latest ? normalizeContent(latest.content, { strict: false }).content : DEFAULT_CONTENT;
  const changed = changedKeys(before, content);
  if (latest && changed.length === 0) {
    await supabase.from("site_content_draft").delete().eq("id", 1);
    revalidatePath("/admin/content");
    return { ok: false, error: "Nothing has changed since the last publish." };
  }

  const { data, error } = await supabase
    .from("site_content_versions")
    .insert({ content, changed_keys: changed, published_by: viewer.userId })
    .select("published_at")
    .single();
  if (error) return { ok: false, error: error.message };

  await supabase.from("site_content_draft").delete().eq("id", 1);
  refreshSite();
  return { ok: true, at: data.published_at, changed };
}

/** Restore publishes an old version again as a new version (history is never rewritten). */
export async function restoreVersion(versionId: number): Promise<ContentResult> {
  const auth = await requireRole("admin");
  if ("error" in auth) return { ok: false, error: auth.error };
  const { supabase, viewer } = auth;

  const [{ data: target }, { data: latest }] = await Promise.all([
    supabase.from("site_content_versions").select("id, content").eq("id", versionId).maybeSingle(),
    supabase.from("site_content_versions").select("content").order("id", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (!target) return { ok: false, error: "That version doesn't exist." };

  const content = normalizeContent(target.content, { strict: false }).content;
  const before = latest ? normalizeContent(latest.content, { strict: false }).content : DEFAULT_CONTENT;
  const changed = changedKeys(before, content);

  const { data, error } = await supabase
    .from("site_content_versions")
    .insert({ content, changed_keys: changed, published_by: viewer.userId, restored_from: target.id })
    .select("published_at")
    .single();
  if (error) return { ok: false, error: error.message };

  await supabase.from("site_content_draft").delete().eq("id", 1);
  refreshSite();
  revalidatePath("/admin/content");
  return { ok: true, at: data.published_at, changed };
}
