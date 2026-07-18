"use client";

import { useActionState, useRef, useState } from "react";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, type ProfileState } from "./actions";

type Props = {
  userId: string;
  initialName: string;
  initialBio: string;
  initialAvatar: string | null;
};

export function ProfileForm({ userId, initialName, initialBio, initialAvatar }: Props) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    {},
  );

  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatar);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setUploadError("Image must be under 3 MB.");
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      // Own-folder path so storage RLS lets us write it. Timestamp-free name so
      // a new upload overwrites the old one (upsert) and we don't orphan files.
      const path = `${userId}/avatar.${ext}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);
      // Cache-bust so the <img> refreshes after an overwrite.
      setAvatarUrl(`${publicUrl}?v=${Date.now()}`);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed. Try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="mt-7 space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5 rounded-xl border border-line bg-paper/60 p-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
          aria-label="Change photo"
        >
          <Avatar src={avatarUrl} name={initialName} className="h-20 w-20 text-2xl" />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-forest/0 text-transparent transition-colors group-hover:bg-forest/45 group-hover:text-white">
            <Icon.Image className="h-6 w-6" />
          </span>
        </button>
        <div>
          <input type="hidden" name="avatar_url" value={avatarUrl ?? ""} />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest/[0.04] disabled:opacity-50"
          >
            <Icon.Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Change photo"}
          </button>
          <p className="mt-1.5 text-xs text-ink/50">JPG or PNG, up to 3 MB.</p>
          {uploadError ? (
            <p className="mt-1 text-sm text-red-600">{uploadError}</p>
          ) : null}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="full_name" className="text-sm font-semibold text-forest">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={initialName}
          maxLength={80}
          placeholder="Your name"
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-forest focus:ring-2 focus:ring-forest/20"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="text-sm font-semibold text-forest">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={initialBio}
          maxLength={500}
          placeholder="A sentence or two about you and what you grow."
          className="mt-1.5 w-full resize-y rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-forest focus:ring-2 focus:ring-forest/20"
        />
        <p className="mt-1 text-xs text-ink/50">Shown on posts you publish.</p>
      </div>

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {state.ok ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-leaf">
            <Icon.Check className="h-4 w-4" /> Saved
          </span>
        ) : null}
        {state.error ? (
          <span className="text-sm font-medium text-red-600">{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}
