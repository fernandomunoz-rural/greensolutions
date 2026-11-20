"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Icon } from "@/components/icons";
import { ImageField } from "./image-field";
import { AdminPage, StatusPill, btnPrimary, btnSecondary, cardCls, helpCls, iconBtn, inputCls, labelCls, timeAgo } from "./ui";
import {
  HOME_SECTION_LABELS,
  SECTIONS,
  type Field,
  type ListItem,
  type SectionDef,
  type SiteContent,
  type TextField,
} from "@/lib/content/schema";
import { changedKeys, describeKey, type FieldErrors } from "@/lib/content/validate";
import { discardDraft, publishContent, restoreVersion, saveDraft, type ContentResult } from "@/app/admin/content/actions";

export type VersionRow = {
  id: number;
  changed_keys: string[];
  restored_from: number | null;
  published_at: string;
  publisher: { full_name: string | null } | null;
};

type Panel = SectionDef["id"] | "layout" | "history";
type Flash = { tone: "ok" | "error"; text: string } | null;

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function ContentEditor({
  live,
  draft,
  draftMeta,
  versions,
  versionContents,
  previewOn,
}: {
  live: SiteContent;
  draft: SiteContent | null;
  draftMeta: { at: string; by: string | null } | null;
  versions: VersionRow[];
  versionContents: Record<number, SiteContent>;
  previewOn: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(draft ?? live);
  // What's stored on the server for the editor: the draft if any, else live.
  const [saved, setSaved] = useState<SiteContent>(draft ?? live);
  const [hasDraft, setHasDraft] = useState(!!draft);
  const [panel, setPanel] = useState<Panel>("hero");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [flash, setFlash] = useState<Flash>(null);
  const [reviewing, setReviewing] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = !same(content, saved);
  const unpublished = useMemo(() => changedKeys(live, content), [live, content]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  function setField(sectionId: string, key: string, value: string | ListItem[]) {
    setContent((c) => ({ ...c, [sectionId]: { ...(c as unknown as Record<string, object>)[sectionId], [key]: value } }));
  }

  function handle(result: ContentResult, okText: string, after?: () => void) {
    if (result.ok) {
      setErrors({});
      setFlash({ tone: "ok", text: okText });
      after?.();
      router.refresh();
    } else {
      setErrors(result.errors ?? {});
      setFlash({ tone: "error", text: result.error });
      // Jump to the first section with a problem.
      const first = Object.keys(result.errors ?? {})[0];
      if (first) setPanel(first.split(".")[0] as Panel);
    }
  }

  const onSave = () =>
    startTransition(async () => {
      const r = await saveDraft(content);
      handle(r, "Draft saved. Not live yet — publish when ready.", () => {
        setSaved(content);
        setHasDraft(true);
      });
    });

  // Saves first (the preview shows the stored draft), then opens the real
  // site in preview mode in this tab. The preview bar links back here.
  const onPreview = () =>
    startTransition(async () => {
      if (dirty || !hasDraft) {
        const r = await saveDraft(content);
        if (!r.ok) return handle(r, "");
        setSaved(content);
        setHasDraft(true);
      }
      window.location.href = "/admin/preview";
    });

  const onPublish = () =>
    startTransition(async () => {
      const r = await publishContent(content);
      setReviewing(false);
      handle(r, "Published. The website is updated.", () => {
        setSaved(content);
        setHasDraft(false);
      });
    });

  const onDiscard = () => {
    if (!window.confirm("Throw away all unpublished changes and go back to what's live?")) return;
    startTransition(async () => {
      const r = await discardDraft();
      handle(r, "Changes discarded.", () => {
        setContent(live);
        setSaved(live);
        setHasDraft(false);
      });
    });
  };

  const onRestore = (v: VersionRow) => {
    if (!window.confirm(`Make version ${v.id} live again? Unpublished changes in the editor are discarded.`)) return;
    startTransition(async () => {
      const r = await restoreVersion(v.id);
      handle(r, `Version ${v.id} restored and live.`, () => {
        const c = versionContents[v.id];
        if (c) {
          setContent(c);
          setSaved(c);
        }
        setHasDraft(false);
      });
    });
  };

  const navItems: { id: Panel; label: string; dot?: boolean }[] = [
    ...SECTIONS.map((s) => ({
      id: s.id as Panel,
      label: s.label,
      dot: unpublished.some((k) => k.startsWith(`${s.id}.`)),
    })),
    { id: "layout", label: "Home · Order & visibility", dot: unpublished.includes("home") },
    { id: "history", label: "History" },
  ];
  const errorSections = new Set(Object.keys(errors).map((k) => k.split(".")[0]));

  let state: { tone: "live" | "draft" | "neutral"; text: string };
  if (dirty) state = { tone: "draft", text: "Unsaved changes" };
  else if (unpublished.length) state = { tone: "draft", text: `Draft saved · ${unpublished.length} change${unpublished.length === 1 ? "" : "s"} not live` };
  else state = { tone: "live", text: "Everything is live" };

  const section = SECTIONS.find((s) => s.id === panel);

  return (
    <AdminPage
      title="Site content"
      intro="Edit the words and images on the public site. Changes stay in a draft until you publish. Preview shows the draft on the real pages."
      actions={
        previewOn ? (
          <a href="/admin/preview?off=1" className={`${btnSecondary} px-3 py-2`}>
            <Icon.EyeOff className="h-4 w-4" /> Turn preview off
          </a>
        ) : null
      }
    >
      <div className="grid gap-6 pb-28 lg:grid-cols-[14rem_1fr]">
        {/* Section picker */}
        <nav aria-label="Content sections">
          <label className="lg:hidden">
            <span className="sr-only">Section</span>
            <select value={panel} onChange={(e) => setPanel(e.target.value as Panel)} className={`${inputCls} mt-0`}>
              {navItems.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                  {n.dot ? " •" : ""}
                </option>
              ))}
            </select>
          </label>
          <ul className="hidden space-y-0.5 lg:block">
            {navItems.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setPanel(n.id)}
                  aria-current={panel === n.id ? "true" : undefined}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    panel === n.id ? "bg-white text-forest shadow-sm ring-1 ring-line" : "text-ink/65 hover:text-forest"
                  } ${n.id === "history" ? "mt-3" : ""}`}
                >
                  <span className="flex items-center gap-2">
                    {n.id === "history" ? <Icon.History className="h-4 w-4" /> : null}
                    {n.label}
                  </span>
                  {errorSections.has(n.id) ? (
                    <span className="h-2 w-2 rounded-full bg-red-500" aria-label="has errors" />
                  ) : n.dot ? (
                    <span className="h-2 w-2 rounded-full bg-amber-400" aria-label="changed" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          {section ? (
            <SectionPanel section={section} content={content} errors={errors} setField={setField} />
          ) : panel === "layout" ? (
            <LayoutPanel content={content} setContent={setContent} />
          ) : (
            <HistoryPanel versions={versions} onRestore={onRestore} pending={pending} />
          )}
        </div>
      </div>

      {/* Save / publish bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur lg:left-[15.5rem]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="min-w-0 text-sm" aria-live="polite">
            {flash ? (
              <span className={flash.tone === "ok" ? "font-medium text-emerald-700" : "font-medium text-red-600"}>
                {flash.text}
              </span>
            ) : (
              <span className="flex flex-wrap items-center gap-2">
                <StatusPill tone={state.tone}>{state.text}</StatusPill>
                {hasDraft && !dirty && draftMeta ? (
                  // Relative time differs between server and browser render.
                  <span className="text-xs text-ink/45" suppressHydrationWarning>
                    saved {timeAgo(draftMeta.at)}
                    {draftMeta.by ? ` by ${draftMeta.by}` : ""}
                  </span>
                ) : null}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasDraft || dirty ? (
              <button type="button" onClick={onDiscard} disabled={pending} className="px-2 text-sm font-semibold text-ink/50 hover:text-red-600 disabled:opacity-50">
                Discard
              </button>
            ) : null}
            <button type="button" onClick={onPreview} disabled={pending} className={`${btnSecondary} px-3`}>
              <Icon.Eye className="h-4 w-4" /> Preview
            </button>
            <button type="button" onClick={onSave} disabled={pending || !dirty} className={`${btnSecondary} px-3`}>
              {pending ? "Working…" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFlash(null);
                setReviewing(true);
              }}
              disabled={pending || unpublished.length === 0}
              className={btnPrimary}
            >
              Publish…
            </button>
          </div>
        </div>
      </div>

      {reviewing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="review-title">
          <div className={`${cardCls} w-full max-w-lg p-6 shadow-xl`}>
            <h2 id="review-title" className="font-display text-lg font-semibold text-forest">
              Publish {unpublished.length} change{unpublished.length === 1 ? "" : "s"}?
            </h2>
            <p className="mt-1 text-sm text-ink/60">These go live on the website straight away. You can restore the previous version from History.</p>
            <ul className="mt-4 max-h-64 space-y-1.5 overflow-y-auto text-sm">
              {unpublished.map((k) => (
                <li key={k} className="flex items-start gap-2">
                  <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                  {describeKey(k)}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setReviewing(false)} className={btnSecondary}>
                Cancel
              </button>
              <button type="button" onClick={onPublish} disabled={pending} className={btnPrimary}>
                {pending ? "Publishing…" : "Publish now"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminPage>
  );
}

function SectionPanel({
  section,
  content,
  errors,
  setField,
}: {
  section: SectionDef;
  content: SiteContent;
  errors: FieldErrors;
  setField: (sectionId: string, key: string, value: string | ListItem[]) => void;
}) {
  const value = (content as unknown as Record<string, Record<string, string | ListItem[]>>)[section.id];
  return (
    <div className={`${cardCls} p-5 sm:p-6`}>
      <h2 className="font-display text-lg font-semibold text-forest">{section.label}</h2>
      <p className="mt-0.5 text-sm text-ink/55">{section.description}</p>
      <div className="mt-6 space-y-5">
        {section.fields.map((f) => (
          <FieldInput
            key={f.key}
            field={f}
            id={`${section.id}.${f.key}`}
            value={value[f.key]}
            errors={errors}
            onChange={(v) => setField(section.id, f.key, v)}
          />
        ))}
      </div>
    </div>
  );
}

function TextInput({
  field,
  id,
  value,
  error,
  onChange,
}: {
  field: TextField;
  id: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const over = value.length > field.max;
  const common = {
    id,
    value,
    "aria-invalid": !!error || over,
    "aria-describedby": `${id}-help`,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    className: inputCls,
  };
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={labelCls}>
          {field.label}
          {field.required ? <span className="text-red-500"> *</span> : null}
        </label>
        {field.kind !== "image" ? (
          <span className={`text-xs ${over ? "font-semibold text-red-600" : "text-ink/40"}`}>
            {value.length}/{field.max}
          </span>
        ) : null}
      </div>
      {field.kind === "image" ? (
        <div className="mt-2">
          <ImageField value={value} onChange={onChange} folder="site" maxWidth={2000} label={field.label} />
        </div>
      ) : field.kind === "longtext" ? (
        <textarea rows={3} {...common} className={`${inputCls} resize-y`} />
      ) : (
        <input type={field.kind === "email" ? "email" : "text"} {...common} />
      )}
      <div id={`${id}-help`}>
        {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
        {field.help ? <p className={helpCls}>{field.help}</p> : null}
      </div>
    </div>
  );
}

function FieldInput({
  field,
  id,
  value,
  errors,
  onChange,
}: {
  field: Field;
  id: string;
  value: string | ListItem[];
  errors: FieldErrors;
  onChange: (v: string | ListItem[]) => void;
}) {
  if (field.kind !== "list") {
    return <TextInput field={field} id={id} value={value as string} error={errors[id]} onChange={onChange} />;
  }
  const items = value as ListItem[];
  const update = (i: number, key: string, v: string) => onChange(items.map((it, j) => (j === i ? { ...it, [key]: v } : it)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const blank = Object.fromEntries(field.item.map((s) => [s.key, ""]));

  return (
    <fieldset>
      <legend className={labelCls}>
        {field.label} <span className="font-normal text-ink/45">({items.length}/{field.max})</span>
      </legend>
      {errors[id] ? <p className="mt-1 text-xs font-medium text-red-600">{errors[id]}</p> : null}
      <ol className="mt-2 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="rounded-lg border border-line bg-paper/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/45">
                {field.itemLabel} {i + 1}
              </span>
              <span className="flex">
                <button type="button" className={`${iconBtn} h-8 w-8`} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${field.itemLabel} ${i + 1} up`}>
                  <Icon.ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" className={`${iconBtn} h-8 w-8`} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${field.itemLabel} ${i + 1} down`}>
                  <Icon.ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" className={`${iconBtn} h-8 w-8 hover:text-red-600`} onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${field.itemLabel} ${i + 1}`}>
                  <Icon.Trash className="h-4 w-4" />
                </button>
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {field.item.map((sub) => (
                <div key={sub.key} className={sub.kind === "longtext" ? "sm:col-span-2" : ""}>
                  <TextInput
                    field={sub}
                    id={`${id}.${i}.${sub.key}`}
                    value={item[sub.key] ?? ""}
                    error={errors[`${id}.${i}.${sub.key}`]}
                    onChange={(v) => update(i, sub.key, v)}
                  />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        disabled={items.length >= field.max}
        onClick={() => onChange([...items, blank])}
        className={`${btnSecondary} mt-3 px-3 py-2`}
      >
        <Icon.Plus className="h-4 w-4" /> Add {field.itemLabel.toLowerCase()}
      </button>
    </fieldset>
  );
}

function LayoutPanel({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  const home = content.home;
  const update = (next: SiteContent["home"]) => setContent((c) => ({ ...c, home: next }));
  const move = (i: number, d: -1 | 1) => {
    const next = [...home];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    update(next);
  };
  return (
    <div className={`${cardCls} p-5 sm:p-6`}>
      <h2 className="font-display text-lg font-semibold text-forest">Home page order & visibility</h2>
      <p className="mt-0.5 text-sm text-ink/55">Reorder the sections under the hero, or hide one without deleting its text.</p>
      <ol className="mt-6 divide-y divide-line overflow-hidden rounded-lg border border-line">
        <li className="flex items-center gap-3 bg-paper/60 px-4 py-3 text-sm">
          <span className="w-16 text-xs text-ink/40">Always first</span>
          <span className="font-semibold text-forest">Hero</span>
        </li>
        {home.map((h, i) => (
          <li key={h.id} className={`flex items-center gap-3 px-4 py-2.5 ${h.visible ? "" : "bg-paper/60"}`}>
            <span className="flex w-16">
              <button type="button" className={`${iconBtn} h-8 w-8`} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${HOME_SECTION_LABELS[h.id]} up`}>
                <Icon.ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" className={`${iconBtn} h-8 w-8`} disabled={i === home.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${HOME_SECTION_LABELS[h.id]} down`}>
                <Icon.ArrowDown className="h-4 w-4" />
              </button>
            </span>
            <span className={`flex-1 text-sm font-semibold ${h.visible ? "text-forest" : "text-ink/40 line-through"}`}>
              {HOME_SECTION_LABELS[h.id]}
            </span>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/60">
              <input
                type="checkbox"
                checked={h.visible}
                onChange={(e) => update(home.map((x, j) => (j === i ? { ...x, visible: e.target.checked } : x)))}
                className="h-4 w-4 accent-forest"
              />
              Visible
            </label>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HistoryPanel({
  versions,
  onRestore,
  pending,
}: {
  versions: VersionRow[];
  onRestore: (v: VersionRow) => void;
  pending: boolean;
}) {
  if (versions.length === 0) {
    return (
      <div className={`${cardCls} p-6 text-sm text-ink/60`}>
        Nothing published yet. The site is showing its built-in text. Your first publish becomes version 1.
      </div>
    );
  }
  return (
    <div className={`${cardCls} overflow-hidden`}>
      <ul className="divide-y divide-line">
        {versions.map((v, i) => (
          <li key={v.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-forest">
                Version {v.id}
                {i === 0 ? <StatusPill tone="live">Live</StatusPill> : null}
                {v.restored_from ? <StatusPill tone="neutral">Restored from {v.restored_from}</StatusPill> : null}
              </p>
              {/* Server and browser time zones can differ. */}
              <p className="mt-0.5 text-xs text-ink/50" suppressHydrationWarning>
                {new Date(v.published_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                {v.publisher?.full_name ? ` · ${v.publisher.full_name}` : ""}
              </p>
              {v.changed_keys.length ? (
                <p className="mt-1.5 text-xs text-ink/60">
                  {v.changed_keys.slice(0, 4).map(describeKey).join(" · ")}
                  {v.changed_keys.length > 4 ? ` · and ${v.changed_keys.length - 4} more` : ""}
                </p>
              ) : null}
            </div>
            {i > 0 ? (
              <button type="button" onClick={() => onRestore(v)} disabled={pending} className={`${btnSecondary} px-3 py-1.5`}>
                <Icon.History className="h-4 w-4" /> Restore
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
