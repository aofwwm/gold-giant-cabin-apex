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
