-- Green Solutions — content layer (profiles+, posts, storage)
-- Run this AFTER schema.sql, in the Supabase dashboard:
--   SQL Editor → New query → paste → Run.
--
-- Everything here is idempotent, so re-running is safe. It adds:
--   • extra profile fields (avatar, bio, username)
--   • an 'editor' role for staff who can publish but aren't full admins
--   • a `posts` table for the news / blog feed
--   • storage buckets for avatars and post cover images, with policies
--
-- Role model, so RLS is easy to reason about:
--   user   → default. Reads published posts, edits their own profile only.
--   editor → can create + manage THEIR OWN posts (the CMS writers).
--   admin  → can manage every profile and every post.

-- ===========================================================================
-- 1. Extend the roles enum with 'editor'.
--    (Wrapped so it's safe if the value already exists. If your Supabase runs
--     this inside a transaction and errors, run just this line on its own.)
-- ===========================================================================
do $$
begin
  if not exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'user_role' and e.enumlabel = 'editor'
  ) then
    alter type public.user_role add value 'editor';
  end if;
end$$;

-- ===========================================================================
-- 2. Extra profile columns for a richer public profile.
-- ===========================================================================
alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists bio        text,
  add column if not exists username   text;

-- Usernames are optional but unique when set.
create unique index if not exists profiles_username_key
  on public.profiles (lower(username))
  where username is not null;

-- Public profiles: authors' name + avatar need to be readable on public posts.
-- This ADDS a permissive select policy alongside the owner-only one from
-- schema.sql (Postgres OR's policies together), so anyone can read profile rows.
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- ===========================================================================
-- 3. Role-check helpers (SECURITY DEFINER so they bypass RLS on profiles and
--    can't cause recursive-policy errors). We compare role::text so this file
--    works even before the 'editor' enum value is committed.
-- ===========================================================================
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role::text = 'admin'
  );
$$;

create or replace function public.is_staff(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role::text in ('admin', 'editor')
  );
$$;

-- IMPORTANT: schema.sql's "Admins can manage all profiles" policy selects FROM
-- profiles inside a policy ON profiles → Postgres raises "infinite recursion
-- detected in policy for relation profiles" on every profile update. Replace it
-- with the SECURITY DEFINER helper, which bypasses RLS and cannot recurse.
drop policy if exists "Admins can manage all profiles" on public.profiles;
create policy "Admins can manage all profiles"
  on public.profiles for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ===========================================================================
-- 4. Posts: the news / blog feed.
-- ===========================================================================
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  -- FK targets public.profiles (1:1 with auth.users) so PostgREST can embed the
  -- author's name + avatar in a single query. auth.uid() still equals this id.
  author_id    uuid not null references public.profiles (id) on delete cascade,
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  body         text not null default '',
  cover_url    text,
  category     text,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.posts is 'News / blog posts shown in the public feed.';

create index if not exists posts_published_idx
  on public.posts (published_at desc)
  where status = 'published';
create index if not exists posts_author_idx on public.posts (author_id);

alter table public.posts enable row level security;

-- Read: published posts are public to everyone.
drop policy if exists "Published posts are public" on public.posts;
create policy "Published posts are public"
  on public.posts for select
  using (status = 'published');

-- Read: authors always see their own posts (including drafts).
drop policy if exists "Authors can read their own posts" on public.posts;
create policy "Authors can read their own posts"
  on public.posts for select
  using (auth.uid() = author_id);

-- Read: admins see everything.
drop policy if exists "Admins can read all posts" on public.posts;
create policy "Admins can read all posts"
  on public.posts for select
  using (public.is_admin(auth.uid()));

-- Write: staff (editor/admin) create posts authored by themselves.
drop policy if exists "Staff can create posts" on public.posts;
create policy "Staff can create posts"
  on public.posts for insert
  with check (auth.uid() = author_id and public.is_staff(auth.uid()));

-- Write: authors update / delete their own posts.
drop policy if exists "Authors can update their own posts" on public.posts;
create policy "Authors can update their own posts"
  on public.posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Authors can delete their own posts" on public.posts;
create policy "Authors can delete their own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- Write: admins manage every post.
drop policy if exists "Admins can manage all posts" on public.posts;
create policy "Admins can manage all posts"
  on public.posts for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Keep updated_at fresh (reuses touch_updated_at() from schema.sql).
drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- 5. Storage buckets: avatars (any user, own folder) + post images (staff).
--    Files are keyed under a "<user-id>/..." prefix so policies can check
--    ownership via the first path segment.
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- --- avatars -------------------------------------------------------------
drop policy if exists "Avatar images are public" on storage.objects;
create policy "Avatar images are public"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users manage their own avatar" on storage.objects;
create policy "Users manage their own avatar"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- --- post images ---------------------------------------------------------
drop policy if exists "Post images are public" on storage.objects;
create policy "Post images are public"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "Staff manage post images" on storage.objects;
create policy "Staff manage post images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'post-images' and public.is_staff(auth.uid()))
  with check (bucket_id = 'post-images' and public.is_staff(auth.uid()));

-- ===========================================================================
-- 6. Make yourself an admin so you can use the CMS. Replace the email, run it
--    once, then reload the app.
-- ===========================================================================
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'you@example.com');
