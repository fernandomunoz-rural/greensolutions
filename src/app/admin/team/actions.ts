"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/admin/auth";
import { TEAM_LIMITS, type TeamMember } from "@/lib/team";

export type MemberState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Echo of what was sent, so the form keeps the edits after an error. */
  values?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function refresh() {
  revalidatePath("/");
  revalidatePath("/team");
  revalidatePath("/admin/team");
  revalidatePath("/admin");
}

function readMember(formData: FormData) {
  const s = (k: string) => String(formData.get(k) ?? "").replace(/\r\n/g, "\n").trim();
  return {
    name: s("name"),
    title: s("title"),
    team_group: s("team_group") || "Leadership",
    summary: s("summary"),
    bio: s("bio"),
    photo_url: s("photo_url"),
    email: s("email"),
    linkedin_url: s("linkedin_url"),
    is_active: formData.get("is_active") === "on",
  };
}

function validate(m: ReturnType<typeof readMember>): Record<string, string> {
  const e: Record<string, string> = {};
  if (!m.name) e.name = "Required.";
  for (const [k, max] of Object.entries(TEAM_LIMITS)) {
    const v = m[k as keyof typeof TEAM_LIMITS];
    if (v.length > max) e[k] = `Keep it under ${max} characters.`;
  }
  if (m.email && !EMAIL_RE.test(m.email)) e.email = "Not a valid email address.";
  if (m.linkedin_url && !/^https:\/\/[^\s]+$/i.test(m.linkedin_url)) e.linkedin_url = "Use a full https:// link.";
  if (m.photo_url && !/^https?:\/\/[^\s]+$/i.test(m.photo_url)) e.photo_url = "Upload a photo instead.";
  return e;
}

export async function saveMember(_prev: MemberState, formData: FormData): Promise<MemberState> {
  const auth = await requireRole("admin");
  if ("error" in auth) return { error: auth.error };
  const { supabase } = auth;

  const id = String(formData.get("id") ?? "");
  const m = readMember(formData);
  const fieldErrors = validate(m);
  const values = Object.fromEntries(Object.entries(m).map(([k, v]) => [k, String(v)]));
  if (Object.keys(fieldErrors).length) return { error: "Check the highlighted fields.", fieldErrors, values };

  const row = {
    ...m,
    photo_url: m.photo_url || null,
    email: m.email || null,
    linkedin_url: m.linkedin_url || null,
  };

  // New members (or members moved to another group) go to the bottom.
  async function nextOrder(group: string) {
    const { data } = await supabase
      .from("team_members")
      .select("sort_order")
      .eq("team_group", group)
      .order("sort_order", { ascending: false })
      .limit(1);
    return (data?.[0]?.sort_order ?? 0) + 1;
  }

  if (id) {
    const { data: current } = await supabase.from("team_members").select("team_group").eq("id", id).maybeSingle();
    if (!current) return { error: "This person no longer exists.", values };
    const patch =
      current.team_group === row.team_group ? row : { ...row, sort_order: await nextOrder(row.team_group) };
    const { error } = await supabase.from("team_members").update(patch).eq("id", id);
    if (error) return { error: error.message, values };
  } else {
    const { error } = await supabase
      .from("team_members")
      .insert({ ...row, sort_order: await nextOrder(row.team_group) });
    if (error) return { error: error.message, values };
  }

  refresh();
  redirect("/admin/team?saved=1");
}

export async function toggleMember(formData: FormData): Promise<void> {
  const auth = await requireRole("admin");
  if ("error" in auth) return;
  const id = String(formData.get("id") ?? "");
  const visible = formData.get("visible") === "1";
  await auth.supabase.from("team_members").update({ is_active: visible }).eq("id", id);
  refresh();
}

/** Move one person up or down within their group, then renumber the group. */
export async function moveMember(formData: FormData): Promise<void> {
  const auth = await requireRole("admin");
  if ("error" in auth) return;
  const { supabase } = auth;
  const id = String(formData.get("id") ?? "");
  const dir = formData.get("dir") === "up" ? -1 : 1;

  const { data: me } = await supabase.from("team_members").select("team_group").eq("id", id).maybeSingle();
  if (!me) return;
  const { data } = await supabase
    .from("team_members")
    .select("id, sort_order")
    .eq("team_group", me.team_group)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const list = (data ?? []) as Pick<TeamMember, "id" | "sort_order">[];
  const i = list.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];

  // Only rows whose position changed are written.
  for (const [index, row] of list.entries()) {
    if (row.sort_order !== index + 1) {
      await supabase.from("team_members").update({ sort_order: index + 1 }).eq("id", row.id);
    }
  }
  refresh();
}

export async function deleteMember(formData: FormData): Promise<void> {
  const auth = await requireRole("admin");
  if ("error" in auth) return;
  const id = String(formData.get("id") ?? "");
  await auth.supabase.from("team_members").delete().eq("id", id);
  refresh();
  redirect("/admin/team?saved=deleted");
}
