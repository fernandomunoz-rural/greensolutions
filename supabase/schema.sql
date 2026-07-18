-- Green Solutions — auth + user structure
-- Run this in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- Supabase Auth already stores accounts (email, hashed password, sessions) in
-- the built-in `auth.users` table. You do NOT create a users table yourself.
-- This adds a public `profiles` table for app-facing data, keyed to each auth
-- user, plus a `role` column so a future CMS/admin area can gate permissions.

-- ---------------------------------------------------------------------------
-- 1. Roles: extend as the CMS grows (e.g. 'editor', 'moderator').
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'admin');
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- 2. Profiles table (1:1 with auth.users).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        public.user_role not null default 'user',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'App-facing profile data, one row per auth user.';

-- ---------------------------------------------------------------------------
-- 3. Row Level Security: every user can only touch their own row.
--    (Admins get broader access via the policy below — safe for a CMS later.)
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by the owner" on public.profiles;
create policy "Profiles are viewable by the owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can read/manage every profile (foundation for the CMS).
drop policy if exists "Admins can manage all profiles" on public.profiles;
create policy "Admins can manage all profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- 4. Auto-create a profile row whenever someone signs up.
--    Pulls full_name from the signup metadata (raw_user_meta_data).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 5. Keep updated_at fresh on profile edits.
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
