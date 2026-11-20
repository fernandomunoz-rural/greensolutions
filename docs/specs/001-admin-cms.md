# 001 — Admin area, editable site content, team, articles

## Goal
Staff can change every piece of public content from `/admin` without a deploy:
site texts, the team, and articles. The public site gets a design pass.

Pattern borrowed from SCORE (spec 060 website editor, web-rural team admin):
schema-driven content with defaults that equal today's text, draft → publish →
versioned history with restore, images resized in the browser, team as an
ordered list with show/hide.

## Roles
| Role   | Can do |
| ------ | ------ |
| user   | Nothing in admin. |
| editor | Articles: create, edit, publish, delete **their own**. |
| admin  | Everything: all articles, site content (draft/publish/restore), team, users & roles. |

Security fix bundled in: today a signed-in user can set their own
`profiles.role` to `admin` through the public API (the owner update policy has
no column check). A trigger now blocks role changes unless the caller is admin.

## Site content
- One JSON document. Sections and fields are defined in code
  (`src/lib/content/schema.ts`): text / longtext / url / email / image / list.
  Each field has a label, max length and required flag.
- Defaults (`src/lib/content/defaults.ts`) are today's hardcoded text, so the
  site looks the same before anyone edits, and keeps working if the database
  tables are missing (code ships before the SQL is run).
- Tables: `site_content_draft` (one row, staff only), `site_content_versions`
  (immutable, numbered, public read; latest = live; restore = new version).
- Server validates on save: unknown keys dropped, lengths enforced, plain text
  only (rendered as React text, never HTML).
- Home sections can be reordered and hidden (hero stays first).
- Preview: admin turns on preview (Next draft mode) and sees the draft on the
  real pages, with a bar to exit.

Sections: Site settings (name, tagline, description, email, location, socials),
Home hero (eyebrow, title, intro, buttons, optional image), Stats, What we do,
Latest news heading, Team heading, Call to action, Footer.

## Team
- Table `team_members`: name, title, group, summary, bio, photo, email,
  LinkedIn, sort order, visible.
- Seeded with the six office leads shown today.
- Admin: list grouped by group, move up/down, show/hide, add/edit/delete
  (confirm), photo upload resized to WebP in the browser.
- Public: team section on the home page + `/team` page with bios. Hidden or
  empty → falls back to the seeded defaults only if the table is missing.

## Articles
- Existing `posts` table. Body becomes Markdown (headings, bold/italic, lists,
  links, quotes, images). Existing plain-text posts render the same (blank line
  = paragraph, single newline = line break). Rendered with react-markdown: no
  raw HTML, so authored content cannot inject markup.
- Editor: toolbar, Write / Preview tabs, inline image upload, cover image,
  category, excerpt, slug, draft/published.
- `/studio/*` redirects to `/admin/articles/*` so old links keep working.

## Users
- Admin lists accounts (name, email, role, joined) via a security-definer
  function that only answers admins, and changes roles. An admin cannot demote
  themselves (so there is always one admin).

## Out of scope
Contact form inbox, multi-language, scheduled publishing, the disabled tools
(learn, crops, plant doctor, resources).

## Rollout
1. Merge code (safe before SQL: public site falls back to defaults; admin
   pages show "run supabase/admin.sql").
2. Run `supabase/admin.sql` in the Supabase SQL editor (idempotent).

## Checks
- Unit: content validation/merge, slug, markdown safety.
- Integration against a local Supabase (Docker): RLS — anon can't read drafts,
  user can't escalate role, editor can't edit others' posts / team / content,
  admin can; publish/restore versions.
- Browser: every admin screen end to end on desktop and phone width.
