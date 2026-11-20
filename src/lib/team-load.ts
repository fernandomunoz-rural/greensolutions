import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { FALLBACK_TEAM, type TeamMember } from "./team";

/** Visible team members in display order. Falls back if the table is missing. */
export const getPublicTeam = cache(async (): Promise<TeamMember[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) return FALLBACK_TEAM;
    return (data ?? []) as TeamMember[];
  } catch {
    return FALLBACK_TEAM;
  }
});
