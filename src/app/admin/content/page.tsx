import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { AdminPage, SetupNotice } from "@/components/admin/ui";
import { ContentEditor, type VersionRow } from "@/components/admin/content-editor";
import { requirePage, isMissingTable } from "@/lib/admin/auth";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { normalizeContent } from "@/lib/content/validate";

export const metadata: Metadata = { title: "Site content" };

export default async function ContentPage() {
  const { supabase } = await requirePage("admin", "/admin/content");

  const [versions, draft, preview] = await Promise.all([
    supabase
      .from("site_content_versions")
      .select(
        "id, content, changed_keys, restored_from, published_at, publisher:profiles!site_content_versions_published_by_fkey(full_name)",
      )
      .order("id", { ascending: false })
      .limit(30),
    supabase
      .from("site_content_draft")
      .select("content, updated_at, editor:profiles!site_content_draft_updated_by_fkey(full_name)")
      .eq("id", 1)
      .maybeSingle(),
    draftMode(),
  ]);

  if (isMissingTable(versions.error) || isMissingTable(draft.error)) {
    return (
      <AdminPage title="Site content">
        <SetupNotice />
      </AdminPage>
    );
  }

  const rows = (versions.data ?? []) as unknown as (VersionRow & { content: unknown })[];
  const live = rows[0] ? normalizeContent(rows[0].content, { strict: false }).content : DEFAULT_CONTENT;
  const draftRow = draft.data as unknown as {
    content: unknown;
    updated_at: string;
    editor: { full_name: string | null } | null;
  } | null;

  return (
    <ContentEditor
      live={live}
      draft={draftRow ? normalizeContent(draftRow.content, { strict: false }).content : null}
      draftMeta={draftRow ? { at: draftRow.updated_at, by: draftRow.editor?.full_name ?? null } : null}
      versions={rows.map((r) => ({
        id: r.id,
        changed_keys: r.changed_keys ?? [],
        restored_from: r.restored_from,
        published_at: r.published_at,
        publisher: r.publisher,
      }))}
      versionContents={Object.fromEntries(
        rows.map((r) => [r.id, normalizeContent(r.content, { strict: false }).content]),
      )}
      previewOn={preview.isEnabled}
    />
  );
}
