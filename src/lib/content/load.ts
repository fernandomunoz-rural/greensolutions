import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CONTENT } from "./defaults";
import { normalizeContent } from "./validate";
import type { SiteContent } from "./schema";

export type Viewer = {
  userId: string | null;
  role: "user" | "editor" | "admin" | null;
  fullName: string | null;
  avatarUrl: string | null;
  isStaff: boolean;
  isAdmin: boolean;
};

/** The signed-in user and their role, once per request. */
export const getViewer = cache(async (): Promise<Viewer> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { userId: null, role: null, fullName: null, avatarUrl: null, isStaff: false, isAdmin: false };
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();
  const role = (profile?.role ?? "user") as Viewer["role"];
  return {
    userId: user.id,
    role,
    fullName: profile?.full_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    isStaff: role === "admin" || role === "editor",
    isAdmin: role === "admin",
  };
});

/** True when an admin has preview switched on (they see the draft). */
export const isPreviewing = cache(async (): Promise<boolean> => {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return false;
  const viewer = await getViewer();
  return viewer.isAdmin;
});

/** Live site content (or the draft, while an admin previews). Never throws. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const supabase = await createClient();
    if (await isPreviewing()) {
      const { data } = await supabase
        .from("site_content_draft")
        .select("content")
        .eq("id", 1)
        .maybeSingle();
      if (data?.content) return normalizeContent(data.content, { strict: false }).content;
    }
    const { data, error } = await supabase
      .from("site_content_versions")
      .select("content")
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return DEFAULT_CONTENT;
    return normalizeContent(data.content, { strict: false }).content;
  } catch {
    return DEFAULT_CONTENT;
  }
});
