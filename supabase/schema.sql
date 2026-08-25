  -- ============================================================================
  -- knowvault — Supabase schema
  -- Run this entire file in the Supabase SQL Editor (Dashboard → SQL Editor).
  -- Fully idempotent: safe to run repeatedly and safe after a partial run.
  -- ============================================================================

  -- 1. Category enum -----------------------------------------------------------
  do $$
  begin
    if not exists (select 1 from pg_type where typname = 'resource_category') then
      create type public.resource_category as enum ('Projects', 'Placement prep', 'Research');
    end if;
  end
  $$;

  -- 2. profiles (one row per auth user) ----------------------------------------
  create table if not exists public.profiles (
    id         uuid primary key references auth.users(id) on delete cascade,
    full_name  text,
    department text,
    avatar_url text,
    created_at timestamptz not null default now()
  );

  -- 3. resources ---------------------------------------------------------------
  create table if not exists public.resources (
    id           uuid primary key default gen_random_uuid(),
    author_id    uuid references public.profiles(id) on delete set null,
    author_name  text not null,
    category     public.resource_category not null,
    year         int not null check (year between 1900 and 2100),
    department   text not null,
    title        text not null,
    description  text not null default '',
    tags         text[] not null default '{}',
    external_url text,
    reused_count int not null default 0,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
  );

  -- 4. resource_files (metadata for files stored in the Storage bucket) --------
  create table if not exists public.resource_files (
    id           uuid primary key default gen_random_uuid(),
    resource_id  uuid not null references public.resources(id) on delete cascade,
    storage_path text not null,
    file_name    text not null,
    file_size    bigint,
    mime_type    text,
    created_at   timestamptz not null default now()
  );

  -- 5. saves (bookmarks — composite PK prevents duplicates) --------------------
  create table if not exists public.saves (
    user_id     uuid not null references public.profiles(id) on delete cascade,
    resource_id uuid not null references public.resources(id) on delete cascade,
    created_at  timestamptz not null default now(),
    primary key (user_id, resource_id)
  );

  -- 6. reuses (powers the timeline + reused_count) -----------------------------
  create table if not exists public.reuses (
    id          uuid primary key default gen_random_uuid(),
    resource_id uuid not null references public.resources(id) on delete cascade,
    user_id     uuid not null references public.profiles(id) on delete cascade,
    note        text,
    created_at  timestamptz not null default now()
  );

  -- 7. Indexes -----------------------------------------------------------------
  create index if not exists resources_author_id_idx   on public.resources(author_id);
  create index if not exists resources_category_idx    on public.resources(category);
  create index if not exists resources_department_idx  on public.resources(department);
  create index if not exists resources_year_idx        on public.resources(year);
  create index if not exists resources_created_at_idx  on public.resources(created_at desc);
  create index if not exists resources_tags_gin_idx    on public.resources using gin (tags);
  create index if not exists resource_files_resource_id_idx on public.resource_files(resource_id);
  create index if not exists saves_user_id_idx         on public.saves(user_id);
  create index if not exists reuses_resource_id_idx    on public.reuses(resource_id);
  create index if not exists reuses_user_id_idx        on public.reuses(user_id);
  create index if not exists reuses_created_at_idx     on public.reuses(created_at desc);

  -- 8. Triggers ----------------------------------------------------------------
  -- 8a. Create a profile automatically whenever a new auth user signs up.
  create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer set search_path = ''
  as $$
  begin
    insert into public.profiles (id, full_name, department, avatar_url)
    values (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'department',
      new.raw_user_meta_data->>'avatar_url'
    );
    return new;
  end;
  $$;

  drop trigger if exists on_auth_user_created on auth.users;
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

  -- 8b. Maintain resources.updated_at.
  create or replace function public.set_updated_at()
  returns trigger language plpgsql as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$;

  drop trigger if exists resources_set_updated_at on public.resources;
  create trigger resources_set_updated_at
    before update on public.resources
    for each row execute function public.set_updated_at();

  -- 8c. Increment reused_count each time a reuse is recorded.
  create or replace function public.increment_reused_count()
  returns trigger language plpgsql security definer set search_path = ''
  as $$
  begin
    update public.resources
      set reused_count = reused_count + 1
    where id = new.resource_id;
    return new;
  end;
  $$;

  drop trigger if exists reuses_increment_count on public.reuses;
  create trigger reuses_increment_count
    after insert on public.reuses
    for each row execute function public.increment_reused_count();

  -- 9. Row Level Security ------------------------------------------------------
  alter table public.profiles       enable row level security;
  alter table public.resources      enable row level security;
  alter table public.resource_files enable row level security;
  alter table public.saves          enable row level security;
  alter table public.reuses         enable row level security;

  -- profiles: world-readable, owner-writable
  drop policy if exists "Profiles are viewable by everyone" on public.profiles;
  create policy "Profiles are viewable by everyone"
    on public.profiles for select using (true);
  drop policy if exists "Users can insert their own profile" on public.profiles;
  create policy "Users can insert their own profile"
    on public.profiles for insert with check (auth.uid() = id);
  drop policy if exists "Users can update their own profile" on public.profiles;
  create policy "Users can update their own profile"
    on public.profiles for update using (auth.uid() = id);

  -- resources: world-readable, author-writable
  drop policy if exists "Resources are viewable by everyone" on public.resources;
  create policy "Resources are viewable by everyone"
    on public.resources for select using (true);
  drop policy if exists "Users can create their own resources" on public.resources;
  create policy "Users can create their own resources"
    on public.resources for insert with check (auth.uid() = author_id);
  drop policy if exists "Authors can update their resources" on public.resources;
  create policy "Authors can update their resources"
    on public.resources for update using (auth.uid() = author_id);
  drop policy if exists "Authors can delete their resources" on public.resources;
  create policy "Authors can delete their resources"
    on public.resources for delete using (auth.uid() = author_id);

  -- resource_files: world-readable, writable only by the resource's author
  drop policy if exists "Resource files are viewable by everyone" on public.resource_files;
  create policy "Resource files are viewable by everyone"
    on public.resource_files for select using (true);
  drop policy if exists "Authors can add files to their resources" on public.resource_files;
  create policy "Authors can add files to their resources"
    on public.resource_files for insert with check (
      exists (select 1 from public.resources r
              where r.id = resource_id and r.author_id = auth.uid())
    );
  drop policy if exists "Authors can delete their resource files" on public.resource_files;
  create policy "Authors can delete their resource files"
    on public.resource_files for delete using (
      exists (select 1 from public.resources r
              where r.id = resource_id and r.author_id = auth.uid())
    );

  -- saves: each user manages only their own bookmarks
  drop policy if exists "Users can view their own saves" on public.saves;
  create policy "Users can view their own saves"
    on public.saves for select using (auth.uid() = user_id);
  drop policy if exists "Users can create their own saves" on public.saves;
  create policy "Users can create their own saves"
    on public.saves for insert with check (auth.uid() = user_id);
  drop policy if exists "Users can delete their own saves" on public.saves;
  create policy "Users can delete their own saves"
    on public.saves for delete using (auth.uid() = user_id);

  -- reuses: world-readable (timeline), insert only as yourself
  drop policy if exists "Reuses are viewable by everyone" on public.reuses;
  create policy "Reuses are viewable by everyone"
    on public.reuses for select using (true);
  drop policy if exists "Users can record their own reuses" on public.reuses;
  create policy "Users can record their own reuses"
    on public.reuses for insert with check (auth.uid() = user_id);

  -- 10. Storage bucket for resource file attachments ---------------------------
  insert into storage.buckets (id, name, public)
  values ('resource-files', 'resource-files', true)
  on conflict (id) do nothing;

  -- Public read; each user may only write under their own {user_id}/... folder.
  drop policy if exists "Resource files are publicly readable" on storage.objects;
  create policy "Resource files are publicly readable"
    on storage.objects for select using (bucket_id = 'resource-files');
  drop policy if exists "Users can upload their own resource files" on storage.objects;
  create policy "Users can upload their own resource files"
    on storage.objects for insert to authenticated with check (
      bucket_id = 'resource-files' and (storage.foldername(name))[1] = auth.uid()::text
    );
  drop policy if exists "Users can update their own resource files" on storage.objects;
  create policy "Users can update their own resource files"
    on storage.objects for update to authenticated using (
      bucket_id = 'resource-files' and (storage.foldername(name))[1] = auth.uid()::text
    );
  drop policy if exists "Users can delete their own resource files" on storage.objects;
  create policy "Users can delete their own resource files"
    on storage.objects for delete to authenticated using (
      bucket_id = 'resource-files' and (storage.foldername(name))[1] = auth.uid()::text
    );

  -- 11. Optional seed data (only inserted while the table is still empty) -------
  do $$
  begin
    if not exists (select 1 from public.resources) then
      insert into public.resources (author_name, category, year, department, title, description, tags)
      values
        ('Aarav Mehta', 'Projects', 2024, 'Computer Science',
        'MediRoute: AI triage for rural clinics',
        'A practical guide to building a lightweight ML triage assistant with a human-in-the-loop workflow.',
        array['Python','ML','FastAPI']),
        ('Diya Shah', 'Placement prep', 2025, 'Information Technology',
        'Placement OS: the interview preparation playbook',
        'What worked, what did not, and a week-by-week system for technical interview preparation.',
        array['DSA','System Design']),
        ('Prof. Neha Rao', 'Research', 2023, 'Electrical Engineering',
        'Campus energy dashboard research notes',
        'Research notes and data collection templates from a campus sustainability study.',
        array['Python','Pandas','IoT']);
    end if;
  end
  $$;
