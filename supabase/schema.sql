-- PlantSoul Database Schema

-- Users table (mirrors Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  created_at timestamptz not null default now()
);

-- Plants table
create table public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  species text,
  personality text,
  created_at timestamptz not null default now()
);

-- Plant photos table
create table public.plant_photos (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  photo_url text not null,
  health_score numeric(3,1) check (health_score >= 0 and health_score <= 10),
  issues text[],
  analysis text,
  created_at timestamptz not null default now()
);

-- Indexes
create index plants_user_id_idx on public.plants(user_id);
create index plant_photos_plant_id_idx on public.plant_photos(plant_id);

-- Row Level Security
alter table public.users enable row level security;
alter table public.plants enable row level security;
alter table public.plant_photos enable row level security;

-- RLS Policies: users
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Auto-insert user on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS Policies: plants
create policy "Users can view own plants"
  on public.plants for select
  using (auth.uid() = user_id);

create policy "Users can insert own plants"
  on public.plants for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plants"
  on public.plants for update
  using (auth.uid() = user_id);

create policy "Users can delete own plants"
  on public.plants for delete
  using (auth.uid() = user_id);

-- RLS Policies: plant_photos
create policy "Users can view own plant photos"
  on public.plant_photos for select
  using (
    exists (
      select 1 from public.plants
      where plants.id = plant_photos.plant_id
        and plants.user_id = auth.uid()
    )
  );

create policy "Users can insert own plant photos"
  on public.plant_photos for insert
  with check (
    exists (
      select 1 from public.plants
      where plants.id = plant_photos.plant_id
        and plants.user_id = auth.uid()
    )
  );

create policy "Users can delete own plant photos"
  on public.plant_photos for delete
  using (
    exists (
      select 1 from public.plants
      where plants.id = plant_photos.plant_id
        and plants.user_id = auth.uid()
    )
  );

-- Storage bucket for plant photos
insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', false)
on conflict do nothing;

-- Storage RLS: users can upload to their own folder (user_id/*)
create policy "Users can upload plant photos"
  on storage.objects for insert
  with check (
    bucket_id = 'plant-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own plant photos"
  on storage.objects for select
  using (
    bucket_id = 'plant-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own plant photos"
  on storage.objects for delete
  using (
    bucket_id = 'plant-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
