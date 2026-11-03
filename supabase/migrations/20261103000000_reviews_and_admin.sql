create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;

drop policy if exists "Admin can read own membership" on public.admin_users;
create policy "Admin can read own membership"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(trim(author_name)) between 1 and 80),
  rating smallint not null check (rating between 1 and 10),
  comment text not null check (char_length(trim(comment)) between 1 and 2000),
  photo_path text,
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_status_created_at_idx
  on public.reviews (status, created_at desc);

alter table public.reviews enable row level security;
revoke all on table public.reviews from anon, authenticated;
grant select on table public.reviews to anon, authenticated;
grant insert (author_name, rating, comment, photo_path, status) on table public.reviews to anon, authenticated;
grant update (status) on table public.reviews to authenticated;
grant delete on table public.reviews to authenticated;

drop policy if exists "Visitors can read approved reviews" on public.reviews;
create policy "Visitors can read approved reviews"
  on public.reviews for select to anon, authenticated
  using (status = 'approved');

drop policy if exists "Admins can read every review" on public.reviews;
create policy "Admins can read every review"
  on public.reviews for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Visitors can submit pending reviews" on public.reviews;
create policy "Visitors can submit pending reviews"
  on public.reviews for insert to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Admins can update reviews" on public.reviews;
create policy "Admins can update reviews"
  on public.reviews for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete reviews" on public.reviews;
create policy "Admins can delete reviews"
  on public.reviews for delete to authenticated
  using ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-photos', 'review-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Visitors can upload review photos" on storage.objects;
create policy "Visitors can upload review photos"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'review-photos'
    and name ~ '^[0-9a-f-]{36}\.(jpg|png|webp)$'
  );

drop policy if exists "Admins can delete review photos" on storage.objects;
create policy "Admins can delete review photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'review-photos' and (select public.is_admin()));

-- After creating your account at /reviews/admin, run this once in the Supabase SQL Editor.
-- Replace the email with the owner account address:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = lower('owner@example.com')
-- on conflict do nothing;
