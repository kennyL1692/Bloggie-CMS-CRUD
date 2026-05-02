-- ============================================================
-- Claude CMS — Supabase Schema
-- Run this entire file in: Supabase Dashboard > SQL Editor
-- ============================================================


-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ── Profiles ────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  bio         text,
  avatar_url  text,
  updated_at  timestamp with time zone default now()
);

-- Auto-create profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── Categories ──────────────────────────────────────────────
create table public.categories (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null,
  slug  text not null unique
);


-- ── Tags ────────────────────────────────────────────────────
create table public.tags (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null,
  slug  text not null unique
);


-- ── Posts ───────────────────────────────────────────────────
create type public.content_status as enum ('draft', 'published');

create table public.posts (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  slug              text not null unique,
  content           text not null default '',
  excerpt           text,
  featured_image    text,
  status            public.content_status not null default 'draft',
  published_at      timestamp with time zone,
  scheduled_at      timestamp with time zone,
  author_id         uuid not null references public.profiles(id) on delete cascade,
  meta_title        text,
  meta_description  text,
  view_count        integer not null default 0,
  created_at        timestamp with time zone default now(),
  updated_at        timestamp with time zone default now()
);

-- Post ↔ Category join
create table public.post_categories (
  post_id      uuid references public.posts(id) on delete cascade,
  category_id  uuid references public.categories(id) on delete cascade,
  primary key (post_id, category_id)
);

-- Post ↔ Tag join
create table public.post_tags (
  post_id  uuid references public.posts(id) on delete cascade,
  tag_id   uuid references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);


-- ── Pages ───────────────────────────────────────────────────
create table public.pages (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  slug              text not null unique,
  content           text not null default '',
  status            public.content_status not null default 'draft',
  meta_title        text,
  meta_description  text,
  created_at        timestamp with time zone default now(),
  updated_at        timestamp with time zone default now()
);


-- ── Media ───────────────────────────────────────────────────
create table public.media (
  id           uuid primary key default uuid_generate_v4(),
  filename     text not null,
  url          text not null,
  size         integer not null default 0,
  mime_type    text not null default '',
  uploaded_by  uuid references public.profiles(id) on delete set null,
  created_at   timestamp with time zone default now()
);


-- ── Auto-update updated_at ───────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on public.posts
  for each row execute procedure public.set_updated_at();

create trigger pages_updated_at
  before update on public.pages
  for each row execute procedure public.set_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();


-- ── Indexes ─────────────────────────────────────────────────
create index idx_posts_status        on public.posts(status);
create index idx_posts_slug          on public.posts(slug);
create index idx_posts_published_at  on public.posts(published_at desc);
create index idx_posts_author_id     on public.posts(author_id);
create index idx_pages_slug          on public.pages(slug);
create index idx_media_uploaded_by   on public.media(uploaded_by);

-- Full text search index
create index idx_posts_fts on public.posts
  using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'')));


-- ── Row Level Security ───────────────────────────────────────

-- profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);


-- categories (public read, admin write)
alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

create policy "Authenticated users can manage categories"
  on public.categories for all using (auth.role() = 'authenticated');


-- tags (public read, admin write)
alter table public.tags enable row level security;

create policy "Tags are viewable by everyone"
  on public.tags for select using (true);

create policy "Authenticated users can manage tags"
  on public.tags for all using (auth.role() = 'authenticated');


-- posts
alter table public.posts enable row level security;

create policy "Published posts are viewable by everyone"
  on public.posts for select
  using (status = 'published' or auth.role() = 'authenticated');

create policy "Authenticated users can manage posts"
  on public.posts for all using (auth.role() = 'authenticated');


-- post_categories
alter table public.post_categories enable row level security;

create policy "Post categories viewable by everyone"
  on public.post_categories for select using (true);

create policy "Authenticated users can manage post categories"
  on public.post_categories for all using (auth.role() = 'authenticated');


-- post_tags
alter table public.post_tags enable row level security;

create policy "Post tags viewable by everyone"
  on public.post_tags for select using (true);

create policy "Authenticated users can manage post tags"
  on public.post_tags for all using (auth.role() = 'authenticated');


-- pages
alter table public.pages enable row level security;

create policy "Published pages are viewable by everyone"
  on public.pages for select
  using (status = 'published' or auth.role() = 'authenticated');

create policy "Authenticated users can manage pages"
  on public.pages for all using (auth.role() = 'authenticated');


-- media
alter table public.media enable row level security;

create policy "Media is viewable by everyone"
  on public.media for select using (true);

create policy "Authenticated users can manage media"
  on public.media for all using (auth.role() = 'authenticated');


-- ── Storage Buckets ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Storage policies — media bucket
create policy "Media files are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated users can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "Authenticated users can delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- Storage policies — avatars bucket
create policy "Avatars are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Authenticated users can update avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');


-- ── Seed: Default categories ─────────────────────────────────
insert into public.categories (name, slug) values
  ('Technology', 'technology'),
  ('Design',     'design'),
  ('Business',   'business'),
  ('Life',       'life');

-- ============================================================
-- Done! All tables, RLS policies, indexes, and buckets created.
-- ============================================================
