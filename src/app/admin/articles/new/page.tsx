import type { Metadata } from "next";
import { AdminPage } from "@/components/admin/ui";
import { PostEditor } from "@/components/post-editor";
import { requirePage } from "@/lib/admin/auth";
import { createPost } from "../actions";

export const metadata: Metadata = { title: "New article" };

export default async function NewArticlePage() {
  const { viewer } = await requirePage("staff", "/admin/articles/new");
  return (
    <AdminPage title="New article" back={{ href: "/admin/articles", label: "Articles" }}>
      <PostEditor action={createPost} userId={viewer.userId} />
    </AdminPage>
  );
}
