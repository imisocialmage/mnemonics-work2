-- ======================================================================================
-- SUPABASE COMPLETE SETUP SCRIPT (SAFE TO RUN MULTIPLE TIMES)
-- ======================================================================================

-- 1. USER CREDITS TABLE
create table if not exists public.user_credits (
    user_id uuid primary key references auth.users(id) on delete cascade,
    credits_remaining integer default 50 not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_credits enable row level security;

-- Policy: Users can read own credits (Drop first to avoid "already exists" error)
drop policy if exists "Users can read own credits" on public.user_credits;
create policy "Users can read own credits" on public.user_credits for select using (auth.uid() = user_id);


-- 2. CREDIT TRIGGER
create or replace function public.handle_new_user_credits() returns trigger as $$
begin
    insert into public.user_credits (user_id, credits_remaining)
    values (new.id, 100);
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_credits on auth.users;
create trigger on_auth_user_created_credits after insert on auth.users for each row execute function public.handle_new_user_credits();


-- 3. AI ASSETS TABLE
create table if not exists public.ai_assets (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    profile_index integer default 0,
    type text,
    results jsonb,
    image_urls jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_assets enable row level security;

-- Policy: Users can manage their own assets (Drop first to avoid error)
drop policy if exists "Users can manage own assets" on public.ai_assets;
create policy "Users can manage own assets" on public.ai_assets for all using (auth.uid() = user_id);

-- 4. STORAGE BUCKET (Create if not exists)
insert into storage.buckets (id, name, public) 
values ('ai-assets', 'ai-assets', true)
on conflict (id) do nothing;

-- Storage Policy: Allow authenticated users to upload
drop policy if exists "Authenticated users can upload assets" on storage.objects;
create policy "Authenticated users can upload assets" on storage.objects for insert to authenticated with check (bucket_id = 'ai-assets');

-- Storage Policy: Allow public to view assets
drop policy if exists "Public access to assets" on storage.objects;
create policy "Public access to assets" on storage.objects for select to public using (bucket_id = 'ai-assets');
