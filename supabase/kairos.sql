-- Kairos paste script for the app tables.
-- Dating invitations: supabase/0006_dating_planner_token.sql
-- Hash It Out: supabase/hash_it_out.sql
-- Hash tables are private. Do not add anon SELECT/INSERT policies for them.

-- Kairos boards: unowned rows, anyone with the link can read and vote.
-- Nicknames are public display handles on that link, not accounts.

create table if not exists events (
  id text primary key,
  code text not null unique,
  title text not null,
  kind text not null check (kind in ('meeting', 'makan')),
  duration_min integer not null check (duration_min in (30, 45, 60, 90, 120)),
  category text not null default '',
  anchor_at timestamptz,
  oracle_text text not null default '',
  oracle_source text not null default '',
  oracle_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists slots (
  id text primary key,
  event_id text not null references events (id) on delete cascade,
  label text not null default '',
  venue_note text not null default '',
  starts_at timestamptz not null,
  sort_order integer not null default 0,
  cosmic_score integer not null,
  yi text not null,
  yi_note text not null,
  ji text not null,
  ji_note text not null,
  tarot text not null,
  tarot_note text not null,
  zodiac text not null,
  zodiac_note text not null,
  boss text not null
);

create index if not exists slots_event_idx on slots (event_id, starts_at, sort_order);

create table if not exists votes (
  id text primary key,
  slot_id text not null references slots (id) on delete cascade,
  event_id text not null references events (id) on delete cascade,
  nickname text not null,
  nickname_key text not null,
  choice text not null check (choice in ('yes', 'maybe', 'no')),
  created_at timestamptz not null default now(),
  unique (slot_id, nickname_key)
);

create index if not exists votes_event_idx on votes (event_id);

create table if not exists comments (
  id text primary key,
  event_id text not null references events (id) on delete cascade,
  nickname text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_event_idx on comments (event_id, created_at);
-- Preference votes: great / can / please-no / cannot. Legacy "maybe" folds into "can".

do $$
declare
  r record;
begin
  for r in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    where rel.relname = 'votes'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%choice%'
  loop
    execute format('alter table votes drop constraint %I', r.conname);
  end loop;
end $$;

update votes set choice = 'yes' where choice = 'maybe';

alter table votes add constraint votes_choice_check check (choice in ('love', 'yes', 'soft', 'no'));
-- Structured mission reading and cached explanations. No prompts, no emails.

create table if not exists event_ai_context (
  event_id text primary key references events (id) on delete cascade,
  meeting_type text not null,
  meeting_goal text not null,
  stakes text not null check (stakes in ('low', 'medium', 'high')),
  tone text not null,
  preferred_conditions jsonb not null default '[]'::jsonb,
  time_preferences jsonb not null default '{}'::jsonb,
  suggested_duration_minutes integer not null,
  summary text not null,
  source text not null default 'rules',
  created_at timestamptz not null default now()
);

create table if not exists kairos_results (
  event_id text primary key references events (id) on delete cascade,
  winning_slot_id text not null,
  fingerprint text not null,
  people_score integer not null,
  moment_score integer not null,
  cosmic_score integer not null,
  kairos_score integer not null,
  ai_headline text not null,
  ai_reasoning jsonb not null,
  ai_comment text not null,
  backup_label text not null default '',
  backup_reason text not null default '',
  slot_lines jsonb not null default '[]'::jsonb,
  source text not null default 'rules',
  generated_at timestamptz not null default now()
);

create table if not exists cosmic_readings (
  event_id text not null references events (id) on delete cascade,
  slot_id text not null,
  prose text not null,
  source text not null,
  generated_at timestamptz not null default now(),
  primary key (event_id, slot_id)
);
-- Where a meeting happens, so makan and team out can start from a real place.

alter table events add column if not exists format text not null default 'physical';
alter table events add column if not exists venue_name text not null default '';
alter table events add column if not exists room text not null default '';
alter table events add column if not exists address text not null default '';
alter table events add column if not exists platform text not null default '';
alter table events add column if not exists meeting_url text not null default '';
alter table events add column if not exists makan_when text not null default '';
