"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { ok?: boolean; error?: string };

/**
 * Save the signed-in user's editable profile fields. The avatar itself is
 * uploaded straight to Supabase Storage from the browser (see profile-form);
 * here we only persist the resulting public URL alongside name + bio.
 */
export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be logged in." };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  if (fullName.length > 80) return { error: "Name is too long." };
  if (bio.length > 500) return { error: "Bio must be under 500 characters." };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      bio: bio || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/account");
  revalidatePath("/", "layout"); // header avatar
  return { ok: true };
}
