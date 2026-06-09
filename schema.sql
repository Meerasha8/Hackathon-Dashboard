-- ============================================================
--  HackTrack — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension (already enabled on most Supabase projects)
create extension if not exists "uuid-ossp";

-- ─── ENUM: hackathon status ──────────────────────────────────────────────────
create type hackathon_status as enum (
  'upcoming',
  'registered',
  'idea_submitted',
  'active',
  'submitted',
  'completed'
);

-- ─── TABLE: hackathons ───────────────────────────────────────────────────────
create table hackathons (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  description      text,
  organizer        text,
  link             text,
  our_idea         text,
  what_to_submit   text,
  overall_deadline timestamptz,
  status           hackathon_status not null default 'upcoming',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── TABLE: phases ───────────────────────────────────────────────────────────
create table phases (
  id             uuid primary key default uuid_generate_v4(),
  hackathon_id   uuid not null references hackathons(id) on delete cascade,
  name           text not null,
  description    text,
  deadline       timestamptz,
  what_to_submit text,
  is_completed   boolean not null default false,
  "order"        integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
create index idx_phases_hackathon_id on phases(hackathon_id);
create index idx_hackathons_status   on hackathons(status);

-- ─── AUTO-UPDATE updated_at ──────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger hackathons_updated_at
  before update on hackathons
  for each row execute function update_updated_at();

create trigger phases_updated_at
  before update on phases
  for each row execute function update_updated_at();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
-- Only authenticated users can access data. No public access.

alter table hackathons enable row level security;
alter table phases     enable row level security;

-- Hackathons: any logged-in user can do full CRUD
create policy "auth_users_all_hackathons" on hackathons
  for all
  to authenticated
  using (true)
  with check (true);

-- Phases: any logged-in user can do full CRUD
create policy "auth_users_all_phases" on phases
  for all
  to authenticated
  using (true)
  with check (true);

-- ─── SAMPLE DATA (optional — delete if not needed) ───────────────────────────
-- Uncomment to seed a sample hackathon

/*
insert into hackathons (name, organizer, description, link, our_idea, what_to_submit, overall_deadline, status)
values (
  'HackMIT 2025',
  'MIT',
  'Annual hackathon hosted by MIT students. Open to all college students worldwide.',
  'https://hackmit.org',
  'AI-powered study planner that adapts to student sleep patterns and cognitive load',
  'Working demo, 2-min pitch video, GitHub repo, and slide deck',
  '2025-09-15 23:59:00+00',
  'registered'
);
*/
