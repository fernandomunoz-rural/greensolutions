import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { Icon } from "@/components/icons";
import { PostEditor } from "@/components/post-editor";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/posts";
import { updatePost, deletePost } from "../../actions";

export const metadata: Metadata = { title: "Edit post" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/studio/${id}/edit`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isStaff = profile?.role === "admin" || profile?.role === "editor";
  if (!isStaff) redirect("/account");

  // RLS ensures editors can only load posts they're allowed to edit.
  const { data } = await supabase.from("posts").select("*").eq("id", id).single();
  if (!data) notFound();
  const post = data as unknown as Post;

  return (
    <Container className="py-14">
      <div className="flex items-center justify-between">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/55 hover:text-forest"
        >
          <Icon.ArrowLeft className="h-4 w-4" /> Back to Studio
        </Link>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-ink/50 transition-colors hover:text-red-600"
          >
            <Icon.Trash className="h-4 w-4" /> Delete
          </button>
        </form>
      </div>
      <h1 className="font-display mt-5 text-3xl font-semibold text-forest">
        Edit post
      </h1>
      <div className="mt-8">
        <PostEditor action={updatePost} userId={user.id} post={post} />
      </div>
    </Container>
  );
}
