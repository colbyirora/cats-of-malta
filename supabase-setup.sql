-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Create the cats table
create table if not exists cats (
  id uuid primary key default gen_random_uuid(),
  name text,
  photos text[] default '{}',
  primary_photo text not null,
  location_lat double precision not null,
  location_lng double precision not null,
  location_name text not null,
  breed text,
  color text not null,
  age text,
  is_stray boolean default true,
  background_story text,
  voting_status text default 'none' check (voting_status in ('none', 'suggesting', 'voting', 'complete')),
  voting_round_id uuid,
  created_at timestamptz default now(),
  approved boolean default false
);

-- Enable Row Level Security
alter table cats enable row level security;

-- Public read access for approved cats (for the public site)
create policy "Anyone can view approved cats"
  on cats for select
  using (approved = true);

-- Service role can do everything (used by admin API with SUPABASE_SERVICE_KEY)
-- The service role bypasses RLS by default, so no policy needed for admin ops.

-- Seed with sample data
insert into cats (id, name, photos, primary_photo, location_lat, location_lng, location_name, breed, color, age, is_stray, background_story, voting_status, approved)
values
  (gen_random_uuid(), 'Marmalade', '{"/cats/cat1.jpg"}', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', 35.8989, 14.5146, 'Valletta Old Town', 'Ginger Tabby', 'Orange', '~3 years', true, 'Found lounging near the Grand Harbour, this friendly fellow greets every tourist with a meow.', 'complete', true),
  (gen_random_uuid(), null, '{"/cats/cat2.jpg"}', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400', 35.8617, 14.4583, 'Mdina Gate', 'Mixed', 'Black and White', '~2 years', true, 'A mysterious tuxedo cat who watches over the ancient city gates.', 'voting', true),
  (gen_random_uuid(), 'Luna', '{"/cats/cat3.jpg"}', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400', 35.9042, 14.5189, 'Sliema Waterfront', 'Siamese Mix', 'Cream with Blue Points', '~4 years', false, 'Luna belongs to a local cafe owner but loves to greet visitors on the promenade.', 'complete', true),
  (gen_random_uuid(), null, '{"/cats/cat4.jpg"}', 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400', 35.8781, 14.5361, 'Three Cities', 'Tabby', 'Grey Tabby', '~1 year', true, 'A playful young cat often seen chasing seagulls near the waterfront.', 'suggesting', true),
  (gen_random_uuid(), 'Cappuccino', '{"/cats/cat5.jpg"}', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400', 35.8400, 14.4800, 'Rabat', 'Persian Mix', 'Brown and Cream', '~5 years', false, 'This fluffy friend lives near St. Paul''s Catacombs and loves afternoon naps.', 'complete', true),
  (gen_random_uuid(), 'Sunny', '{"/cats/cat6.jpg"}', 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400', 35.9100, 14.4300, 'Golden Bay', 'Ginger', 'Orange', '~2 years', true, 'Named for her love of sunbathing on the beach rocks.', 'complete', true);
