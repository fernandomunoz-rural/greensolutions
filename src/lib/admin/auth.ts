import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer, type Viewer } from "@/lib/content/load";

type Supabase = Awaited<ReturnType<typeof createClient>>;
type Ok = { supabase: Supabase; viewer: Viewer & { userId: string } };
type Err = { error: string };

/** For server actions: never trust the page that rendered the form. */
export async function requireRole(level: "staff" | "admin"): Promise<Ok | Err> {
  const viewer = await getViewer();
  if (!viewer.userId) return { error: "You need to be logged in." };
  const allowed = level === "admin" ? viewer.isAdmin : viewer.isStaff;
  if (!allowed) return { error: "You don't have permission to do that." };
  return { supabase: await createClient(), viewer: viewer as Ok["viewer"] };
}

/** For admin pages: redirect anyone who shouldn't be here. */
export async function requirePage(level: "staff" | "admin", next: string): Promise<Ok> {
  const viewer = await getViewer();
  if (!viewer.userId) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!viewer.isStaff) redirect("/account");
  if (level === "admin" && !viewer.isAdmin) redirect("/admin");
  return { supabase: await createClient(), viewer: viewer as Ok["viewer"] };
}

/** True when a Supabase error means "table/function not created yet". */
export function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.code === "PGRST202" ||
    /does not exist|schema cache/i.test(error.message ?? "")
  );
}
