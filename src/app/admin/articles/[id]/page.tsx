import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { AdminPage, btnDanger } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { PostEditor } from "@/components/post-editor";
import { requirePage } from "@/lib/admin/auth";
import type { Post } from "@/lib/posts";
import { updatePost, deletePost } from "../actions";

export const metadata: Metadata = { title: "Edit article" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, viewer } = await requirePage("staff", `/admin/articles/${id}`);

  // RLS: editors only get posts they're allowed to edit. Ids are uuids; a
  // malformed id just errors and lands on 404.
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as Post;
  if (!viewer.isAdmin && post.author_id !== viewer.userId) notFound();

  return (
    <AdminPage
      title="Edit article"
      back={{ href: "/admin/articles", label: "Articles" }}
      actions={
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <ConfirmSubmit
            message={`Delete “${post.title}”? This can't be undone.`}
            className={btnDanger}
            pendingLabel="Deleting…"
          >
            <Icon.Trash className="h-4 w-4" /> Delete
          </ConfirmSubmit>
        </form>
      }
    >
      <PostEditor action={updatePost} userId={viewer.userId} post={post} />
    </AdminPage>
  );
}
