---
name: supabase-auth
description: GreenSolutions uses Supabase for auth/users; Next.js 16 renames middleware to proxy
metadata:
  type: project
---

Green Solutions (Next.js 16 app) uses **Supabase** for authentication and user data. Project ref `gnxrqcvcdwihwaxdyqnh`.

- Auth is client-side via `@supabase/ssr` (`src/lib/supabase/client.ts` browser, `server.ts` server, `proxy.ts` session refresh).
- Session refresh runs in `src/proxy.ts` — in **Next.js 16 middleware was renamed to `proxy`** (file `proxy.ts`, exports `proxy`). Standard Supabase tutorials use `middleware.ts`, which is deprecated here. `cookies()` is async.
- DB structure in `supabase/schema.sql`: `profiles` table (1:1 with `auth.users`) with a `role` enum (`user`/`admin`) and RLS. A trigger auto-creates a profile on signup.
- The `role` column + "Admins can manage all profiles" RLS policy are the intended **foundation for a future CMS/admin area**.
- Protected routes live under `/account`.
