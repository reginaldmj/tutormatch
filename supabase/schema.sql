-- TutorMatch Supabase schema
-- This file documents the database structure used by the app.
-- Run these in Supabase SQL Editor if rebuilding the project.

-- =========================
-- PROFILES
-- =========================

create table if not exists profiles (
  -- Same id as Supabase Auth user
  id uuid primary key references auth.users(id) on delete cascade,

  -- User display name
  full_name text not null,

  -- App role
  role text default 'student',

  -- Row creation timestamp
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users can read their own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

-- =========================
-- TUTORS
-- =========================

create table if not exists tutors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  price numeric not null,
  rating numeric default 5,
  bio text,
  created_at timestamp with time zone default now()
);

alter table tutors enable row level security;

create policy "Anyone can view tutors"
on tutors for select
using (true);

-- =========================
-- BOOKINGS
-- =========================

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade,
  tutor_id text not null,
  tutor_name text not null,
  subject text not null,
  time text not null,
  status text default 'confirmed',
  created_at timestamp with time zone default now()
);

alter table bookings enable row level security;

create policy "Users can view their own bookings"
on bookings for select
using (auth.uid() = student_id);

create policy "Users can create their own bookings"
on bookings for insert
with check (auth.uid() = student_id);

create policy "Users can update their own bookings"
on bookings for update
using (auth.uid() = student_id)
with check (auth.uid() = student_id);

-- =========================
-- MESSAGES
-- =========================

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid,
  sender_id uuid references auth.users(id),
  tutor_id text not null,
  tutor_name text,
  text text not null,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;

create policy "Users can read their own messages"
on messages for select
using (auth.uid() = sender_id);

create policy "Users can send their own messages"
on messages for insert
with check (auth.uid() = sender_id);

-- Enable realtime for chat messages
alter publication supabase_realtime add table messages;