-- ============================================================
-- Simplified RLS for demo — open read, auth write
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Drop existing policies and replace with simpler ones

-- profiles
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Profiles: public read" on public.profiles for select using (true);
create policy "Profiles: auth write" on public.profiles for all using (auth.role() = 'authenticated');

-- posts
drop policy if exists "Published posts are viewable by everyone" on public.posts;
drop policy if exists "Authenticated users can manage posts" on public.posts;
create policy "Posts: public read" on public.posts for select using (true);
create policy "Posts: auth write" on public.posts for all using (auth.role() = 'authenticated');

-- pages
drop policy if exists "Published pages are viewable by everyone" on public.pages;
drop policy if exists "Authenticated users can manage pages" on public.pages;
create policy "Pages: public read" on public.pages for select using (true);
create policy "Pages: auth write" on public.pages for all using (auth.role() = 'authenticated');

-- Done
