-- Extra Job - Schema MVP Supabase (PostgreSQL)
-- A executer dans le SQL Editor de Supabase.

create extension if not exists pgcrypto;

create type public.activity_category as enum (
  'jardinage',
  'demenagement',
  'bricolage',
  'menage',
  'evenement',
  'courses',
  'animaux',
  'informatique',
  'cuisine',
  'autre'
);

create type public.listing_status as enum ('active', 'complete', 'expired', 'cancelled');
create type public.application_status as enum ('pending', 'accepted', 'rejected', 'cancelled');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  bio text,
  skills text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  category public.activity_category not null,
  address text not null,
  city text not null,
  postal_code text not null,
  latitude double precision not null,
  longitude double precision not null,
  preferred_date timestamptz,
  estimated_duration integer not null check (estimated_duration > 0),
  spots_total integer not null check (spots_total between 1 and 20),
  spots_filled integer not null default 0 check (spots_filled >= 0 and spots_filled <= spots_total),
  photos text[] not null default '{}'::text[],
  is_urgent boolean not null default false,
  status public.listing_status not null default 'active',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status public.application_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  participant_1 uuid not null references public.users(id) on delete cascade,
  participant_2 uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (participant_1 <> participant_2)
);

create unique index if not exists conversations_unique_pair_per_listing
  on public.conversations (listing_id, least(participant_1, participant_2), greatest(participant_1, participant_2));

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reviewer_id uuid not null references public.users(id) on delete cascade,
  reviewed_id uuid not null references public.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (listing_id, reviewer_id, reviewed_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  reported_user_id uuid references public.users(id) on delete set null,
  reported_listing_id uuid references public.listings(id) on delete set null,
  reason text not null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_listings_status_expires_at on public.listings (status, expires_at desc);
create index if not exists idx_listings_category on public.listings (category);
create index if not exists idx_listings_city on public.listings (city);
create index if not exists idx_listings_preferred_date on public.listings (preferred_date);
create index if not exists idx_listings_user_id on public.listings (user_id);
create index if not exists idx_applications_listing_id on public.applications (listing_id);
create index if not exists idx_applications_user_id on public.applications (user_id);
create index if not exists idx_conversations_participant_1 on public.conversations (participant_1);
create index if not exists idx_conversations_participant_2 on public.conversations (participant_2);
create index if not exists idx_messages_conversation_id_created_at on public.messages (conversation_id, created_at);
create index if not exists idx_reviews_reviewed_id on public.reviews (reviewed_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Utilisateur')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.applications enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;

drop policy if exists "users_select_all" on public.users;
create policy "users_select_all"
on public.users for select
using (true);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own"
on public.users for insert
with check (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
on public.users for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "listings_select_all" on public.listings;
create policy "listings_select_all"
on public.listings for select
using (true);

drop policy if exists "listings_insert_own" on public.listings;
create policy "listings_insert_own"
on public.listings for insert
with check (auth.uid() = user_id);

drop policy if exists "listings_update_own" on public.listings;
create policy "listings_update_own"
on public.listings for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "listings_delete_own" on public.listings;
create policy "listings_delete_own"
on public.listings for delete
using (auth.uid() = user_id);

drop policy if exists "applications_select_candidate_or_owner" on public.applications;
create policy "applications_select_candidate_or_owner"
on public.applications for select
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.listings l
    where l.id = applications.listing_id
    and l.user_id = auth.uid()
  )
);

drop policy if exists "applications_insert_own" on public.applications;
create policy "applications_insert_own"
on public.applications for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.listings l
    where l.id = applications.listing_id
    and l.user_id <> auth.uid()
  )
);

drop policy if exists "applications_update_candidate_or_owner" on public.applications;
create policy "applications_update_candidate_or_owner"
on public.applications for update
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.listings l
    where l.id = applications.listing_id
    and l.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  or exists (
    select 1 from public.listings l
    where l.id = applications.listing_id
    and l.user_id = auth.uid()
  )
);

drop policy if exists "applications_delete_candidate_or_owner" on public.applications;
create policy "applications_delete_candidate_or_owner"
on public.applications for delete
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.listings l
    where l.id = applications.listing_id
    and l.user_id = auth.uid()
  )
);

drop policy if exists "conversations_select_participants" on public.conversations;
create policy "conversations_select_participants"
on public.conversations for select
using (auth.uid() = participant_1 or auth.uid() = participant_2);

drop policy if exists "conversations_insert_participants" on public.conversations;
create policy "conversations_insert_participants"
on public.conversations for insert
with check (auth.uid() = participant_1 or auth.uid() = participant_2);

drop policy if exists "messages_select_participants" on public.messages;
create policy "messages_select_participants"
on public.messages for select
using (
  exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
    and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
  )
);

drop policy if exists "messages_insert_sender_participant" on public.messages;
create policy "messages_insert_sender_participant"
on public.messages for insert
with check (
  auth.uid() = sender_id
  and exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
    and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
  )
);

drop policy if exists "messages_update_participants" on public.messages;
create policy "messages_update_participants"
on public.messages for update
using (
  exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
    and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
  )
)
with check (
  exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
    and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
  )
);

drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all"
on public.reviews for select
using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
on public.reviews for insert
with check (auth.uid() = reviewer_id);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own"
on public.reviews for update
using (auth.uid() = reviewer_id)
with check (auth.uid() = reviewer_id);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own"
on public.reviews for delete
using (auth.uid() = reviewer_id);

drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own"
on public.reports for insert
with check (auth.uid() = reporter_id);

drop policy if exists "reports_select_own" on public.reports;
create policy "reports_select_own"
on public.reports for select
using (auth.uid() = reporter_id);

insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

drop policy if exists "listing_photos_public_read" on storage.objects;
create policy "listing_photos_public_read"
on storage.objects for select
using (bucket_id = 'listing-photos');

drop policy if exists "listing_photos_auth_insert" on storage.objects;
create policy "listing_photos_auth_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'listing-photos');

drop policy if exists "listing_photos_owner_update" on storage.objects;
create policy "listing_photos_owner_update"
on storage.objects for update
to authenticated
using (bucket_id = 'listing-photos' and owner = auth.uid())
with check (bucket_id = 'listing-photos' and owner = auth.uid());

drop policy if exists "listing_photos_owner_delete" on storage.objects;
create policy "listing_photos_owner_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'listing-photos' and owner = auth.uid());
