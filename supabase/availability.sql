-- Tutor availability table
-- This stores bookable time slots for each tutor.

create table if not exists tutor_availability (
  -- Unique availability slot id
  id uuid primary key default gen_random_uuid(),

  -- Tutor connected to this slot
  tutor_id uuid references tutors(id) on delete cascade,

  -- Human-readable date for now
  -- Example: "Monday, May 12"
  date text not null,

  -- Human-readable time for now
  -- Example: "2:00 PM"
  time text not null,

  -- Whether this slot is still available
  is_available boolean default true,

  -- Row creation timestamp
  created_at timestamp with time zone default now()
);

-- Enable Supabase Row Level Security
alter table tutor_availability enable row level security;

-- Anyone can view tutor availability
create policy "Anyone can view tutor availability"
on tutor_availability for select
using (true);