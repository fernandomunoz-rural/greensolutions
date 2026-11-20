# Green Solutions

Practical agriculture for The Bahamas — an educational website that makes
growing food easier to understand and plan for gardeners, new growers, and
students. Built to scale from a learning tool into a full commercial platform
with video and image content.

> _“Cultivate with care, sow with love, and harvest life.”_

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling, with the brand palette + fonts wired into the
  design system (`src/app/globals.css`)
- Fully static-generated pages — fast, SEO-friendly, cheap to host

## Getting started

```bash
npm install      # first time only
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## What's included

| Route | Description |
| --- | --- |
| `/` | Marketing home page — hero, value props, featured guides & crops, CTA |
| `/learn` | Learning hub with searchable, filterable articles |
| `/learn/[slug]` | Full article view with optional video embed + related guides |
| `/crops` | Crop guide cards (season, difficulty, harvest at a glance) |
| `/crops/[slug]` | Per-crop fact sheet + growing tips |
| `/diagnose` | **Plant Doctor** — interactive symptom-based problem finder |
| `/resources` | Video library, downloadable guides, FAQ |
| `/about` | The project, the problem, the team / "living structure" |
| `/get-involved` | Ways to help + contact form |

## Content / test data

All content lives in `src/data/` as typed TypeScript — easy to edit, and ready
to swap for a CMS or database later without touching the UI:

- `site.ts` — site config, navigation, team/offices, stats
- `articles.ts` — educational guides (HTML body, optional video)
- `crops.ts` — crop growing guides
- `problems.ts` — Plant Doctor knowledge base (symptoms → likely causes → fixes)
- `resources.ts` — videos, downloads, FAQ

## Brand

Colours, typography, and the wordmark logo follow the Green Solutions brand
guidelines. Brand tokens are defined once in `globals.css` (`--color-forest`,
`--color-mint`, `--color-leaf`, `--color-ochre`, `--color-sand`, `--color-paper`)
and used as Tailwind utility classes (`bg-forest`, `text-mint`, etc.).

## Scaling to commercial

The architecture is ready to grow:

- **Media**: video embeds are already in place (`/resources`, article pages);
  swap in real photography by dropping files in `public/` and referencing them.
- **CMS / database**: the `src/data/*` modules are the only content source —
  replace them with API/CMS calls and every page updates automatically.
- **AI tooling**: the Plant Doctor matcher (`src/components/plant-doctor.tsx`)
  is a clean seam to plug in an AI-supported diagnosis backend.
- **Commerce / accounts**: add routes under `src/app/` as needed.

## Admin (`/admin`)

Staff manage the site at `/admin` (spec: `docs/specs/001-admin-cms.md`).

| Area | Who | What |
| --- | --- | --- |
| Articles | editors (own), admins (all) | Markdown editor with preview, images, cover, draft/published |
| Site content | admins | Every text and image on the home page, footer and site settings. Draft → Preview → Publish, with History/Restore |
| Team | admins | People, photos, groups, order, show/hide. Shown on the home page and `/team` |
| Users & roles | admins | Make someone an editor or admin |

**Database setup (once per Supabase project):** run `supabase/schema.sql`,
`supabase/content.sql`, then `supabase/admin.sql` in the SQL editor. All are
safe to re-run. Until `admin.sql` runs, the site shows its built-in text.
Optional: `supabase/sample-content.sql` removes the old "Testing" post and
publishes two sample articles whose covers live in `public/articles/`.

Make yourself admin (SQL editor):
`update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');`

### Local development with a real database

```bash
npx supabase@2 start -x studio,imgproxy,edge-runtime,logflare,vector,realtime,supavisor,postgres-meta
```

Apply the three SQL files to the local database, put the local URL/keys in
`.env.development.local` (app) and `.env.test.local` (tests), then:

```bash
npm run db:seed-local   # local test accounts: admin@ / editor@ / user@test.local
npm test                # unit tests + row-level-security tests against the local DB
```
