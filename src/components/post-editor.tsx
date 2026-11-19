"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { Icon } from "./icons";
import { Markdown } from "./markdown";
import { createClient } from "@/lib/supabase/client";
import { slugify, POST_CATEGORIES, readMinutes, type Post } from "@/lib/posts";
import { checkImageFile, resizeImage } from "@/lib/image-resize";
import { inputCls, labelCls, helpCls, cardCls, btnPrimary, btnSecondary } from "./admin/ui";
import type { PostState } from "@/app/admin/articles/actions";

type Action = (prev: PostState, formData: FormData) => Promise<PostState>;

/** Upload an article image (resized in the browser) and return its public URL. */
async function uploadPostImage(userId: string, file: File, name: string, maxWidth: number) {
  const bad = checkImageFile(file);
  if (bad) throw new Error(bad);
  const { blob, ext } = await resizeImage(file, maxWidth);
  const supabase = createClient();
  const path = `${userId}/${slugify(name) || "image"}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, blob, { contentType: blob.type || file.type, cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl;
}

/** Toolbar buttons: each wraps the selected text in Markdown. */
type Tool = { label: string; icon: keyof typeof Icon; run: (sel: string) => string; line?: boolean };

const TOOLS: Tool[] = [
  { label: "Heading", icon: "Heading", line: true, run: (s) => `## ${s || "Heading"}` },
  { label: "Bold", icon: "Bold", run: (s) => `**${s || "bold text"}**` },
  { label: "Italic", icon: "Italic", run: (s) => `_${s || "italic text"}_` },
  {
    label: "Bulleted list",
    icon: "List",
    line: true,
    run: (s) => (s || "List item").split("\n").map((l) => `- ${l}`).join("\n"),
  },
  {
    label: "Numbered list",
    icon: "ListOrdered",
    line: true,
    run: (s) => (s || "List item").split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n"),
  },
  { label: "Quote", icon: "Quote", line: true, run: (s) => `> ${s || "Quote"}` },
  { label: "Link", icon: "Link", run: (s) => `[${s || "link text"}](https://)` },
];

export function PostEditor({ action, userId, post }: { action: Action; userId: string; post?: Post }) {
  const [state, formAction, pending] = useActionState<PostState, FormData>(action, {});

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [coverUrl, setCoverUrl] = useState<string | null>(post?.cover_url ?? null);
  const [busy, setBusy] = useState<null | "cover" | "inline">(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const inlineRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  function onTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  /** Replace the current selection in the body, keeping focus + cursor. */
  function insert(make: (selected: string) => string, line = false) {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.slice(start, end);
    let text = make(selected);
    // Block-level formatting starts on its own line.
    if (line && start > 0 && body[start - 1] !== "\n") text = `\n\n${text}`;
    const next = body.slice(0, start) + text + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  }

  async function onCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    setBusy("cover");
    try {
      setCoverUrl(await uploadPostImage(userId, file, title || "cover", 1600));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  }

  async function onInline(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    setBusy("inline");
    try {
      const url = await uploadPostImage(userId, file, file.name.replace(/\.[^.]+$/, ""), 1400);
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/[[\]]/g, "");
      insert(() => `![${alt}](${url})\n`, true);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  }

  const words = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_17.5rem]">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="cover_url" value={coverUrl ?? ""} />
      <input type="hidden" name="body" value={body} />
      <input type="hidden" name="status" value={status} />

      {/* Main column */}
      <div className="min-w-0 space-y-5">
        <div>
          <label htmlFor="title" className={labelCls}>
            Title
          </label>
          <input
            id="title"
            name="title"
            value={title}
            maxLength={160}
            required
            onChange={(e) => onTitle(e.target.value)}
            placeholder="A clear, specific headline"
            className={`${inputCls} font-display text-lg`}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="excerpt" className={labelCls}>
              Excerpt
            </label>
            <span className="text-xs text-ink/40">{excerpt.length}/280</span>
          </div>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={280}
            placeholder="One or two sentences shown in the feed and in link previews."
            className={`${inputCls} resize-y`}
          />
        </div>

        <div className={`${cardCls} overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper/60 px-2 py-1.5">
            <div className="flex gap-0.5" role="tablist">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold capitalize ${
                    tab === t ? "bg-white text-forest shadow-sm ring-1 ring-line" : "text-ink/55 hover:text-forest"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {tab === "write" ? (
              <div className="flex flex-wrap items-center gap-0.5">
                {TOOLS.map((tool) => {
                  const I = Icon[tool.icon];
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      title={tool.label}
                      aria-label={tool.label}
                      onClick={() => insert(tool.run, tool.line)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-ink/60 hover:bg-white hover:text-forest"
                    >
                      <I className="h-4 w-4" />
                    </button>
                  );
                })}
                <span className="mx-1 h-5 w-px bg-line" />
                <button
                  type="button"
                  title="Insert image"
                  onClick={() => inlineRef.current?.click()}
                  disabled={busy !== null}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-ink/60 hover:bg-white hover:text-forest disabled:opacity-50"
                >
                  <Icon.Image className="h-4 w-4" />
                  {busy === "inline" ? "Uploading…" : "Image"}
                </button>
                <input ref={inlineRef} type="file" accept="image/*" onChange={onInline} className="hidden" />
              </div>
            ) : null}
          </div>

          {tab === "write" ? (
            <textarea
              ref={bodyRef}
              id="body"
              aria-label="Article body"
              rows={22}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                "Write your article here.\n\nLeave a blank line between paragraphs. Use the toolbar for headings, lists, links and images."
              }
              className="block w-full resize-y border-0 bg-white px-5 py-4 font-mono text-[0.92rem] leading-relaxed text-ink outline-none placeholder:font-sans placeholder:text-ink/35"
            />
          ) : (
            <div className="min-h-[28rem] bg-white px-5 py-6 sm:px-8">
              {body.trim() ? (
                <Markdown source={body} className="max-w-none" />
              ) : (
                <p className="text-sm text-ink/45">Nothing to preview yet.</p>
              )}
            </div>
          )}
          <div className="flex items-center justify-between border-t border-line px-4 py-2 text-xs text-ink/45">
            <span>
              Markdown: <code>## Heading</code> · <code>**bold**</code> · <code>- list</code> ·{" "}
              <code>[link](https://…)</code>
            </span>
            <span>
              {words} words · {readMinutes(body)} min read
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-5">
        <div className={`${cardCls} p-5`}>
          <span className={labelCls}>Visibility</span>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-paper p-1 ring-1 ring-line">
            {(["draft", "published"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
                className={`rounded-md px-2 py-1.5 text-sm font-semibold ${
                  status === s ? "bg-white text-forest shadow-sm ring-1 ring-line" : "text-ink/55"
                }`}
              >
                {s === "draft" ? "Draft" : "Published"}
              </button>
            ))}
          </div>
          <p className={helpCls}>
            {status === "draft" ? "Only staff can see drafts." : "Visible to everyone on News."}
          </p>

          <div className="mt-5 flex flex-col gap-2">
            <button type="submit" disabled={pending || busy !== null} className={btnPrimary}>
              {pending
                ? "Saving…"
                : status === "published"
                  ? post?.status === "published"
                    ? "Update article"
                    : "Publish article"
                  : "Save draft"}
            </button>
            <Link href="/admin/articles" className={btnSecondary}>
              Cancel
            </Link>
          </div>
          {state.error ? (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {state.error}
            </p>
          ) : null}
        </div>

        <div className={`${cardCls} p-5`}>
          <label htmlFor="category" className={labelCls}>
            Category
          </label>
          <select id="category" name="category" defaultValue={post?.category ?? ""} className={inputCls}>
            <option value="">None</option>
            {POST_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="mt-5">
            <label htmlFor="slug" className={labelCls}>
              Web address
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
            <p className={`${helpCls} break-all`}>/news/{slugify(slug) || "…"}</p>
          </div>
        </div>

        <div className={`${cardCls} p-5`}>
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
          <input ref={coverRef} type="file" accept="image/*" onChange={onCover} className="hidden" />
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              disabled={busy !== null}
              className={`${btnSecondary} px-3 py-2`}
            >
              <Icon.Upload className="h-4 w-4" />
              {busy === "cover" ? "Uploading…" : coverUrl ? "Replace" : "Upload"}
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
          <p className={helpCls}>Resized to 1600px wide before upload.</p>
          {uploadError ? (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {uploadError}
            </p>
          ) : null}
        </div>
      </aside>
    </form>
  );
}
