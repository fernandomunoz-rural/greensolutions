import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { Icon } from "@/components/icons";
import { PostEditor } from "@/components/post-editor";
import { createClient } from "@/lib/supabase/server";
import { createPost } from "../actions";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/new");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isStaff = profile?.role === "admin" || profile?.role === "editor";
  if (!isStaff) redirect("/account");

  return (
    <Container className="py-14">
      <Link
        href="/studio"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink/55 hover:text-forest"
      >
        <Icon.ArrowLeft className="h-4 w-4" /> Back to Studio
      </Link>
      <h1 className="font-display mt-5 text-3xl font-semibold text-forest">
        New post
      </h1>
      <div className="mt-8">
        <PostEditor action={createPost} userId={user.id} />
      </div>
    </Container>
  );
}
