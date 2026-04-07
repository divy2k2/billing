create extension if not exists "pgcrypto";

alter table if exists public.entries drop constraint if exists entries_user_id_fkey;
alter table if exists public.categories drop constraint if exists categories_user_id_fkey;
alter table if exists public.entries alter column user_id drop not null;
alter table if exists public.categories alter column user_id drop not null;
drop index if exists categories_user_name_type_idx;
create unique index if not exists categories_name_type_idx
  on public.categories (lower(name), type);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text not null default '#0f766e',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  category_id uuid not null references public.categories (id) on delete restrict,
  title text not null,
  notes text,
  amount numeric(12, 2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  occurred_on date not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.categories enable row level security;
alter table public.entries enable row level security;
drop policy if exists "Users can view their categories" on public.categories;
drop policy if exists "Users can insert their categories" on public.categories;
drop policy if exists "Users can update their categories" on public.categories;
drop policy if exists "Users can delete their categories" on public.categories;
drop policy if exists "Users can view their entries" on public.entries;
drop policy if exists "Users can insert their entries" on public.entries;
drop policy if exists "Users can update their entries" on public.entries;
drop policy if exists "Users can delete their entries" on public.entries;

insert into public.categories (name, type, color)
values
  ('Salary', 'income', '#15803d'),
  ('Freelance', 'income', '#2563eb'),
  ('Sales', 'income', '#9333ea'),
  ('Rent', 'expense', '#ea580c'),
  ('Utilities', 'expense', '#dc2626'),
  ('Food', 'expense', '#0f766e'),
  ('Transport', 'expense', '#64748b')
on conflict (lower(name), type) do nothing;
