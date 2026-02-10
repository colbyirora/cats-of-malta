-- Voting System Setup
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Prerequisites: The 'cats' table must already exist (see supabase-setup.sql)

-- ============================================================
-- 1. name_suggestions table
-- ============================================================
create table if not exists name_suggestions (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid not null references cats(id) on delete cascade,
  suggested_name text not null,
  vote_count integer default 0,
  created_at timestamptz default now(),
  unique (cat_id, suggested_name)
);

-- ============================================================
-- 2. votes table
-- ============================================================
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references name_suggestions(id) on delete cascade,
  cat_id uuid not null references cats(id) on delete cascade,
  voter_ip text not null,
  created_at timestamptz default now(),
  unique (suggestion_id, voter_ip),
  unique (cat_id, voter_ip)
);

-- ============================================================
-- 3. Row Level Security
-- ============================================================

-- name_suggestions: anyone can view and submit suggestions
alter table name_suggestions enable row level security;

create policy "Anyone can view name suggestions"
  on name_suggestions for select
  using (true);

create policy "Anyone can insert name suggestions"
  on name_suggestions for insert
  with check (true);

-- votes: anyone can insert a vote, no public SELECT needed
alter table votes enable row level security;

create policy "Anyone can insert votes"
  on votes for insert
  with check (true);

-- ============================================================
-- 4. Auto-increment vote_count trigger
-- ============================================================
create or replace function increment_vote_count()
returns trigger as $$
begin
  update name_suggestions set vote_count = vote_count + 1 where id = NEW.suggestion_id;
  return NEW;
end;
$$ language plpgsql;

create trigger on_vote_inserted
after insert on votes
for each row execute function increment_vote_count();
