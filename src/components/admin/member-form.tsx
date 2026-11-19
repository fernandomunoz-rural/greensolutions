"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ImageField } from "./image-field";
import { inputCls, labelCls, helpCls, cardCls, btnPrimary, btnSecondary } from "./ui";
import { TEAM_LIMITS, type TeamMember } from "@/lib/team";
import type { MemberState } from "@/app/admin/team/actions";

type Action = (prev: MemberState, formData: FormData) => Promise<MemberState>;

export function MemberForm({
  action,
  member,
  groups,
}: {
  action: Action;
  member?: TeamMember;
  groups: string[];
}) {
  const [state, formAction, pending] = useActionState<MemberState, FormData>(action, {});
  const [photo, setPhoto] = useState(member?.photo_url ?? "");
  const [summary, setSummary] = useState(member?.summary ?? "");
  const [bio, setBio] = useState(member?.bio ?? "");
  const fe = state.fieldErrors ?? {};
  // After a failed save, show what was sent rather than the stored values.
  const v = (k: "name" | "title" | "email" | "linkedin_url" | "team_group") =>
    state.values?.[k] ?? member?.[k] ?? "";

  const err = (k: string) =>
    fe[k] ? (
      <p id={`${k}-err`} className="mt-1 text-xs font-medium text-red-600">
        {fe[k]}
      </p>
    ) : null;
  const aria = (k: string) => (fe[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {});

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_17.5rem]">
      {member ? <input type="hidden" name="id" value={member.id} /> : null}

      <div className={`${cardCls} space-y-5 p-5 sm:p-6`}>
        <div>
          <span className={labelCls}>Photo</span>
          <div className="mt-2">
            <ImageField name="photo_url" value={photo} onChange={setPhoto} folder="team" maxWidth={640} round label="Photo" />
          </div>
          {err("photo_url")}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>
              Name
            </label>
            <input id="name" name="name" required maxLength={TEAM_LIMITS.name} defaultValue={v("name")} className={inputCls} {...aria("name")} />
            {err("name")}
          </div>
          <div>
            <label htmlFor="title" className={labelCls}>
              Role or office
            </label>
            <input
              id="title"
              name="title"
              maxLength={TEAM_LIMITS.title}
              defaultValue={v("title")}
              placeholder="e.g. Agriculture Office"
              className={inputCls}
              {...aria("title")}
            />
            {err("title")}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="summary" className={labelCls}>
              Short description
            </label>
            <span className="text-xs text-ink/40">
              {summary.length}/{TEAM_LIMITS.summary}
            </span>
          </div>
          <textarea
            id="summary"
            name="summary"
            rows={2}
            maxLength={TEAM_LIMITS.summary}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One line on what they do. Shown on the home page."
            className={`${inputCls} resize-y`}
            {...aria("summary")}
          />
          {err("summary")}
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="bio" className={labelCls}>
              Bio
            </label>
            <span className="text-xs text-ink/40">
              {bio.length}/{TEAM_LIMITS.bio}
            </span>
          </div>
          <textarea
            id="bio"
            name="bio"
            rows={6}
            maxLength={TEAM_LIMITS.bio}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Background, experience, what they're working on. Shown on the Team page."
            className={`${inputCls} resize-y`}
            {...aria("bio")}
          />
          {err("bio")}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelCls}>
              Email <span className="font-normal text-ink/45">(optional)</span>
            </label>
            <input id="email" name="email" type="email" maxLength={TEAM_LIMITS.email} defaultValue={v("email")} className={inputCls} {...aria("email")} />
            {err("email")}
          </div>
          <div>
            <label htmlFor="linkedin_url" className={labelCls}>
              LinkedIn <span className="font-normal text-ink/45">(optional)</span>
            </label>
            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              maxLength={TEAM_LIMITS.linkedin_url}
              defaultValue={v("linkedin_url")}
              placeholder="https://linkedin.com/in/…"
              className={inputCls}
              {...aria("linkedin_url")}
            />
            {err("linkedin_url")}
          </div>
        </div>
      </div>

      <aside className="space-y-5">
        <div className={`${cardCls} p-5`}>
          <label htmlFor="team_group" className={labelCls}>
            Group
          </label>
          <input
            id="team_group"
            name="team_group"
            list="team-groups"
            maxLength={TEAM_LIMITS.team_group}
            defaultValue={v("team_group") || groups[0] || "Leadership"}
            className={inputCls}
            {...aria("team_group")}
          />
          <datalist id="team-groups">
            {groups.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
          <p className={helpCls}>People are shown in groups, e.g. Leadership, Advisors, Volunteers. Type a new name to start a group.</p>
          {err("team_group")}

          <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-forest">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={state.values ? state.values.is_active === "true" : (member?.is_active ?? true)}
              className="h-4 w-4 rounded border-line accent-forest"
            />
            Show on the website
          </label>

          <div className="mt-5 flex flex-col gap-2">
            <button type="submit" disabled={pending} className={btnPrimary}>
              {pending ? "Saving…" : member ? "Save changes" : "Add person"}
            </button>
            <Link href="/admin/team" className={btnSecondary}>
              Cancel
            </Link>
          </div>
          {state.error ? (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {state.error}
            </p>
          ) : null}
        </div>
      </aside>
    </form>
  );
}
