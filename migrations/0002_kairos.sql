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
