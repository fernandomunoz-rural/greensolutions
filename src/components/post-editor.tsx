"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { Icon } from "./icons";
import { createClient } from "@/lib/supabase/client";
import { slugify, POST_CATEGORIES, type Post } from "@/lib/posts";
import type { PostState } from "@/app/studio/actions";

type Action = (prev: PostState, formData: FormData) => Promise<PostState>;

const inputCls =
  "mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-forest focus:ring-2 focus:ring-forest/20";
const labelCls = "text-sm font-semibold text-forest";

export function PostEditor({
  action,
  userId,
  post,
}: {
  action: Action;
  userId: string;
  post?: Post;
}) {
  const [state, formAction, pending] = useActionState<PostState, FormData>(
    action,
    {},
  );

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [coverUrl, setCoverUrl] = useState<string | null>(post?.cover_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${slugify(title) || "cover"}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("post-images")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(path);
      setCoverUrl(publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="cover_url" value={coverUrl ?? ""} />

      {/* Main column */}
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className={labelCls}>
            Title
          </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            placeholder="A clear, specific headline"
            className={`${inputCls} font-display text-lg`}
          />
        </div>

        <div>
          <label htmlFor="excerpt" className={labelCls}>
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={post?.excerpt ?? ""}
            maxLength={280}
            placeholder="One or two sentences shown in the feed and previews."
            className={`${inputCls} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="body" className={labelCls}>
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={18}
            defaultValue={post?.body ?? ""}
            placeholder={"Write your post here.\n\nLeave a blank line between paragraphs."}
            className={`${inputCls} resize-y font-body leading-relaxed`}
          />
          <p className="mt-1 text-xs text-ink/50">
            Plain text. Leave a blank line between paragraphs.
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="rounded-xl border border-line bg-white p-5">
          <label htmlFor="status" className={labelCls}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            className={inputCls}
          >
            <option value="draft">Draft (only you)</option>
            <option value="published">Published (public)</option>
          </select>

          <div className="mt-5 flex flex-col gap-2">
            <button
              type="submit"
              disabled={pending || uploading}
              className="rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Saving…" : post ? "Save post" : "Create post"}
            </button>
            <Link
              href="/studio"
              className="rounded-lg border border-line px-5 py-2.5 text-center text-sm font-semibold text-forest transition-colors hover:bg-forest/[0.04]"
            >
              Cancel
            </Link>
          </div>
          {state.error ? (
            <p className="mt-3 text-sm text-red-600">{state.error}</p>
          ) : null}
        </div>

        <div className="rounded-xl border border-line bg-white p-5">
          <label htmlFor="category" className={labelCls}>
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={post?.category ?? ""}
            className={inputCls}
          >
            <option value="">None</option>
            {POST_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="mt-5">
            <label htmlFor="slug" className={labelCls}>
              URL slug
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="auto-from-title"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-ink/50">/news/{slug || "…"}</p>
          </div>
        </div>

        {/* Cover image */}
        <div className="rounded-xl border border-line bg-white p-5">
          <span className={labelCls}>Cover image</span>
          <div className="mt-2 overflow-hidden rounded-lg border border-line bg-paper">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- storage URL
              <img src={coverUrl} alt="" className="aspect-[16/9] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/9] w-full items-center justify-center text-ink/30">
                <Icon.Image className="h-8 w-8" />
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleCover}
            className="hidden"
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest/[0.04] disabled:opacity-50"
            >
              <Icon.Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : coverUrl ? "Replace" : "Upload"}
            </button>
            {coverUrl ? (
              <button
                type="button"
                onClick={() => setCoverUrl(null)}
                className="text-sm font-medium text-ink/50 hover:text-red-600"
              >
                Remove
              </button>
            ) : null}
          </div>
          {uploadError ? (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          ) : null}
        </div>
      </aside>
    </form>
  );
}
