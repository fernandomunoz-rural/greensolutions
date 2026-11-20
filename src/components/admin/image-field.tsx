"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { checkImageFile, resizeImage } from "@/lib/image-resize";
import { btnSecondary, helpCls } from "./ui";

/**
 * Image upload into the public `site-media` bucket (admins only). The image is
 * resized in the browser first; the field holds the public URL in a hidden
 * input named `name`, so it posts with the surrounding form.
 */
export function ImageField({
  name,
  value,
  onChange,
  folder,
  maxWidth,
  aspect = "aspect-[16/9]",
  round = false,
  label = "Image",
}: {
  name?: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  maxWidth: number;
  aspect?: string;
  round?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const bad = checkImageFile(file);
    if (bad) return setError(bad);
    setError(null);
    setBusy(true);
    try {
      const { blob, ext } = await resizeImage(file, maxWidth);
      const supabase = createClient();
      // New name every upload: files are never overwritten, so old versions
      // in the content history keep working.
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-media")
        .upload(path, blob, { contentType: blob.type || file.type, cacheControl: "31536000" });
      if (upErr) throw upErr;
      onChange(supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <div className="flex items-center gap-4">
        <div
          className={`${round ? "h-20 w-20 rounded-full" : `${aspect} w-40 rounded-lg`} shrink-0 overflow-hidden border border-line bg-paper`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- storage URL
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink/30">
              <Icon.Image className="h-7 w-7" />
            </div>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy}
              aria-label={`${value ? "Replace" : "Upload"} ${label.toLowerCase()}`}
              className={`${btnSecondary} px-3 py-2`}
            >
              <Icon.Upload className="h-4 w-4" />
              {busy ? "Uploading…" : value ? "Replace" : "Upload"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-sm font-medium text-ink/50 hover:text-red-600"
              >
                Remove
              </button>
            ) : null}
          </div>
          <p className={helpCls}>JPG, PNG or WebP. Resized to {maxWidth}px before upload.</p>
          {error ? (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ) : null}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFile} className="hidden" />
    </div>
  );
}
