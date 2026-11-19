"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin/auth";

const ROLES = ["user", "editor", "admin"] as const;

export type RoleResult = { ok: boolean; error?: string };

export async function setRole(userId: string, role: string): Promise<RoleResult> {
  const auth = await requireRole("admin");
  if ("error" in auth) return { ok: false, error: auth.error };
  if (!ROLES.includes(role as (typeof ROLES)[number])) return { ok: false, error: "Unknown role." };
  if (userId === auth.viewer.userId) return { ok: false, error: "You can't change your own role." };

  const { data, error } = await auth.supabase.from("profiles").update({ role }).eq("id", userId).select("id");
  if (error) return { ok: false, error: error.message };
  if (!data?.length) return { ok: false, error: "That account no longer exists." };
  revalidatePath("/admin/users");
  return { ok: true };
}
