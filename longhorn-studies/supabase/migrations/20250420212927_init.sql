-- ============================================================================
-- Profiles
-- ============================================================================
-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key default auth.uid(),
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on public.profiles
  for update using ((select auth.uid()) = id); 

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');


-- ============================================================================
-- Spots
-- ============================================================================
create table public.spots (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null  references auth.users(id) on delete cascade default auth.uid(),
  title         text not null,
  body          text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- --------------  tags  ---------------------------------------------
create table public.tags (
  id            bigint generated always as identity primary key,
  label         text     not null check (length(label) <= 40),
  slug          text     not null unique,            -- lower(label)‑spaces→dashes
  created_by    uuid     references auth.users(id) default auth.uid(),
  is_system     boolean  default false               -- “official” tags you seed
);

-- --------------  spot_tags link  (spots ↔ tags, many‑to‑many) -------
create table public.spot_tags (
  spot_id   uuid   references spots(id) on delete cascade,
  tag_id    bigint references tags(id)  on delete cascade,
  primary key (spot_id, tag_id)
);

-- --------------  media  --------------------------------------------
create table public.media (
  id          uuid primary key default gen_random_uuid(),
  spot_id     uuid      references spots(id) on delete cascade,
  storage_key text      not null,      -- e.g. 'public/spot-media/abc123.webp'
  position    int       default 1,     -- for manual ordering in galleries
  created_at  timestamptz default now()
);

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('media', 'media');

-- Set up access controls for storage.
create policy "Media publicly accessible." on storage.objects
  for select using (bucket_id = 'media');

create policy "Anyone can upload media." on storage.objects
  for insert with check (bucket_id = 'media');

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.spots      enable row level security;
alter table public.media      enable row level security;
alter table public.spot_tags  enable row level security;
alter table public.tags       enable row level security;

-- Spots: author can do anything
create policy "Spot Owner" on public.spots
  using  (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Media: follow its spot
create policy "Media Owner" on public.media
  using  (exists (select 1
                  from spots s
                  where s.id = spot_id and s.user_id = (select auth.uid())))
  with check (exists (select 1
                      from spots s
                      where s.id = spot_id and s.user_id = (select auth.uid())));

-- Tags: anyone may read; creator may update; you may also lock system tags
create policy "Tag Read" on public.tags
  for select 
  to authenticated
  using (true);

create policy "Tag Creator Insert" on public.tags
  for insert
  to authenticated 
  with check (created_by = (select auth.uid()) and not is_system);

create policy "Tag Creator Update" on public.tags
  for update
  to authenticated 
  using (created_by = (select auth.uid()) and not is_system)
  with check (created_by = (select auth.uid()) and not is_system);

create policy "Tag Creator Delete" on public.tags
  for delete
  to authenticated 
  using (created_by = (select auth.uid()) and not is_system);-- Spot tag link: follow its spot

create policy "Spot Tag Owner" on public.spot_tags
  using  (exists (select 1
                  from spots s
                  where s.id = spot_id and s.user_id = (select auth.uid())))
  with check (exists (select 1
                      from spots s
                      where s.id = spot_id and s.user_id = (select auth.uid())));

-- ============================================================================
-- Indexes
-- ============================================================================
create index on public.tags          (slug);
create index on public.spot_tags     (tag_id);
create index on public.media         (spot_id, position);
create index on public.media         (spot_id);
create index on public.spot_tags     (spot_id);
create index on public.spots         (user_id);
create index on public.tags          (created_by);

-- ============================================================================
-- Helper function Slugify
-- ============================================================================
-- One‑time setup
create extension if not exists unaccent with schema extensions;     -- strips accents å, ü, etc.

create or replace function public.slugify(txt text)
returns text
language sql
set search_path = ''
immutable
as $$
    -- 1. unaccent → déjà‑vu  → deja vu
    -- 2. lower‑case          → deja vu
    -- 3. drop non‑alphanum   → deja vu
    -- 4. collapse whitespace → deja-vu
    select regexp_replace(
             regexp_replace(
               lower(extensions.unaccent($1)),        -- 1 & 2
               '[^a-z0-9\s-]', '', 'g'),   -- 3
             '\s+', '-', 'g')              -- 4
$$;

create or replace function public.set_tag_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.slug := public.slugify(new.label);
  return new;
end;
$$;

create trigger tag_slug_tg
before insert or update of label   -- fire only when label changes
on public.tags
for each row
execute procedure public.set_tag_slug();

create or replace function public.upsert_tags(label_list text[])
returns setof tags
language plpgsql
set search_path = ''
as $$
begin
  return query
  insert into public.tags (label, slug)
  select lbl, public.slugify(lbl)
  from unnest(label_list) as lbl
  on conflict (slug) do update
    set label = excluded.label          -- optional: sync label changes
  returning *;
end;
$$;
