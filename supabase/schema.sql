-- ==========================
-- Digital Arup Ebook Store DB
-- Run this in Supabase SQL Editor
-- ==========================

-- 1) Profiles (role: user/admin/affiliate)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles: insert own" on public.profiles
for insert with check (auth.uid() = id);

-- 2) Ebooks
create table if not exists public.ebooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  price numeric not null default 0,
  description text,
  cover_path text,
  pdf_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ebooks enable row level security;

create policy "ebooks: public read active" on public.ebooks
for select using (is_active = true);

-- Admin operations happen via server (service role), so no extra policies needed.

-- 3) Coupons
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percent','fixed')),
  value numeric not null,
  expires_at timestamptz,
  usage_limit int,
  used_count int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;

create policy "coupons: public read active" on public.coupons
for select using (is_active = true);

-- 4) Affiliates
create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  code text not null unique,
  commission_rate numeric not null default 30,
  created_at timestamptz not null default now()
);

alter table public.affiliates enable row level security;

create policy "affiliates: read own" on public.affiliates
for select using (auth.uid() = user_id);

create policy "affiliates: insert own" on public.affiliates
for insert with check (auth.uid() = user_id);

-- 5) Orders (1 ebook per order)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ebook_id uuid not null references public.ebooks(id) on delete restrict,
  amount numeric not null,
  coupon_code text,
  utr text not null,
  proof_path text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  affiliate_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders: read own" on public.orders
for select using (auth.uid() = user_id);

create policy "orders: insert own" on public.orders
for insert with check (auth.uid() = user_id);

-- 6) Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
