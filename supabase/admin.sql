-- Green Solutions — admin area (site content, team, users)
-- Run this AFTER schema.sql and content.sql, in the Supabase dashboard:
--   SQL Editor → New query → paste → Run.
-- Idempotent: safe to re-run.
--
-- Adds:
--   • a guard so only admins can change anyone's role (fixes self-promotion)
--   • site_content_draft + site_content_versions (draft → publish → history)
--   • team_members (seeded with today's office leads)
--   • a public `site-media` storage bucket that admins write to
--   • admin_list_users() so the admin can see accounts + emails

-- ===========================================================================
-- 1. Role guard. The owner-update policy on profiles has no column check, so
--    without this any signed-in user could set their own role to 'admin'.
--    auth.uid() is null for the SQL editor / service role, which stay allowed.
-- ===========================================================================
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    if not public.is_admin(auth.uid()) then
      raise exception 'Only admins can change roles' using errcode = '42501';
    end if;
    if auth.uid() = old.id then
      raise exception 'You cannot change your own role' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ===========================================================================
-- 2. Site content. One JSON document; the shape lives in the app
--    (src/lib/content/schema.ts). The newest version is what the site shows.
-- ===========================================================================
create table if not exists public.site_content_draft (
  id          smallint primary key default 1 check (id = 1),
  content     jsonb not null default '{}'::jsonb,
  updated_by  uuid references public.profiles (id) on delete set null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.site_content_versions (
  id             bigint generated always as identity primary key,
  content        jsonb not null,
  changed_keys   text[] not null default '{}',
  restored_from  bigint references public.site_content_versions (id) on delete set null,
  published_by   uuid references public.profiles (id) on delete set null,
  published_at   timestamptz not null default now()
);

comment on table public.site_content_draft is 'Unpublished edits to the site texts (admins only).';
comment on table public.site_content_versions is 'Published site texts. Newest row is live. Rows are never edited.';

alter table public.site_content_draft enable row level security;
alter table public.site_content_versions enable row level security;

drop policy if exists "Admins manage the draft" on public.site_content_draft;
create policy "Admins manage the draft"
  on public.site_content_draft for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Published content is what the public site shows, so anyone may read it.
drop policy if exists "Published content is public" on public.site_content_versions;
create policy "Published content is public"
  on public.site_content_versions for select
  using (true);

drop policy if exists "Admins publish content" on public.site_content_versions;
create policy "Admins publish content"
  on public.site_content_versions for insert
  with check (public.is_admin(auth.uid()) and published_by = auth.uid());
-- No update/delete policies: versions are immutable.

drop trigger if exists site_content_draft_touch on public.site_content_draft;
create trigger site_content_draft_touch
  before update on public.site_content_draft
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- 3. Team members.
-- ===========================================================================
create table if not exists public.team_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 1 and 80),
  title         text not null default '' check (char_length(title) <= 100),
  team_group    text not null default 'Leadership' check (char_length(team_group) between 1 and 60),
  summary       text not null default '' check (char_length(summary) <= 280),
  bio           text not null default '' check (char_length(bio) <= 2000),
  photo_url     text,
  email         text check (email is null or char_length(email) <= 120),
  linkedin_url  text check (linkedin_url is null or char_length(linkedin_url) <= 300),
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists team_members_order_idx
  on public.team_members (team_group, sort_order);

alter table public.team_members enable row level security;

drop policy if exists "Visible team members are public" on public.team_members;
create policy "Visible team members are public"
  on public.team_members for select
  using (is_active or public.is_admin(auth.uid()));

drop policy if exists "Admins manage the team" on public.team_members;
create policy "Admins manage the team"
  on public.team_members for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop trigger if exists team_members_touch on public.team_members;
create trigger team_members_touch
  before update on public.team_members
  for each row execute function public.touch_updated_at();

-- Seed with the team shown on the site today, only if the table is empty.
insert into public.team_members (name, title, team_group, summary, sort_order)
select v.name, v.title, 'Leadership', v.summary, v.ord
from (values
  ('Cody Dean', 'Strategy & Planning Office', 'Project direction, planning, coordination, and documentation.', 1),
  ('Maurice Curry', 'Agriculture Office', 'Applied agriculture, growing guidance, and practical agricultural support.', 2),
  ('Fatma Adem', 'Finance & Resources Office', 'Budgeting, funding coordination, and resource management.', 3),
  ('Fernando Muñoz', 'Technology & Systems Office', 'Software development, AI tools, data systems, and workflows.', 4),
  ('Luis Torres', 'Outreach & Education Office', 'Communication, education, design, and community engagement.', 5),
  ('Michelle Outten', 'Research & Development Office', 'Research, testing, refinement, and product development.', 6)
) as v(name, title, summary, ord)
where not exists (select 1 from public.team_members);

-- ===========================================================================
-- 4. Storage for site images (hero, team photos). Public read, admin write.
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "Site media is public" on storage.objects;
create policy "Site media is public"
  on storage.objects for select
  using (bucket_id = 'site-media');

drop policy if exists "Admins manage site media" on storage.objects;
create policy "Admins manage site media"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'site-media' and public.is_admin(auth.uid()))
  with check (bucket_id = 'site-media' and public.is_admin(auth.uid()));

-- ===========================================================================
-- 5. Users list for admins (emails live in auth.users, which the API can't
--    read). Answers admins only.
-- ===========================================================================
create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  avatar_url text,
  role text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Admins only' using errcode = '42501';
  end if;
  return query
    select p.id, u.email::text, p.full_name, p.avatar_url, p.role::text,
           u.created_at, u.last_sign_in_at
    from public.profiles p
    join auth.users u on u.id = p.id
    order by u.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;
