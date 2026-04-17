-- Enable required extensions
create extension if not exists "pgcrypto";

-- Drop old billing tables if they exist
drop table if exists public.entries cascade;
drop table if exists public.categories cascade;

-- Bookings table for service bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  -- General service booking fields
  name text,
  phone text not null,
  email text,
  service text,
  preferred_date date,
  preferred_time text,
  description text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  -- Plumber booking fields
  customer_name text,
  service_type text,
  plumber_id integer,
  plumber_name text,
  address text,
  booking_type text not null default 'service' check (booking_type in ('service', 'plumber')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Enable Row Level Security
alter table public.bookings enable row level security;

-- Allow anyone to insert bookings (public booking form)
create policy "Anyone can create bookings" on public.bookings
  for insert with check (true);

-- Only authenticated users can view bookings (for admin)
create policy "Authenticated users can view bookings" on public.bookings
  for select using (auth.role() = 'authenticated');

-- Only authenticated users can update bookings (for admin)
create policy "Authenticated users can update bookings" on public.bookings
  for update using (auth.role() = 'authenticated');
