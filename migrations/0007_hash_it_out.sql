-- Hash It Out rooms. Shareable codes, no accounts.
-- The host token is stored only as a hash. Anonymous rows store no name.

create table if not exists hash_sessions (
  id text primary key,
  code text not null unique,
  host_token_hash text not null,
  prompt text not null,
  context text not null default '',
  starter text not null default 'custom',
  identity_mode text not null default 'choice' check (identity_mode in ('anonymous', 'named', 'choice')),
  show_live_board boolean not null default true,
  blind_round boolean not null default false,
  revealed boolean not null default true,
  voting_enabled boolean not null default false,
  vote_limit integer not null default 3 check (vote_limit in (1, 3)),
  cosmic_enabled boolean not null default false,
  status text not null default 'open' check (status in ('open', 'paused', 'voting', 'closed')),
  lucky_cluster_id text not null default '',
  synthesis text not null default '',
  llm_calls integer not null default 0,
  auto_llm integer not null default 0,
  last_collate_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists hash_participants (
  id text primary key,
  session_id text not null references hash_sessions (id) on delete cascade,
  token_hash text not null,
  display_name text not null default '',
  anonymous boolean not null default true,
  created_at timestamptz not null default now(),
  unique (session_id, token_hash)
);

create table if not exists hash_clusters (
  id text primary key,
  session_id text not null references hash_sessions (id) on delete cascade,
  title text not null,
  summary text not null default '',
  pinned boolean not null default false,
  hidden boolean not null default false,
  user_locked boolean not null default false,
  source text not null default 'rules' check (source in ('rules', 'ai', 'facilitator')),
  action_kind text not null default '' check (action_kind in ('', 'action', 'park', 'discuss', 'decide')),
  action_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hash_submissions (
  id text primary key,
  session_id text not null references hash_sessions (id) on delete cascade,
  participant_id text references hash_participants (id) on delete set null,
  anonymous boolean not null default true,
  display_name text not null default '',
  body text not null,
  cluster_id text references hash_clusters (id) on delete set null,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists hash_submissions_session_idx on hash_submissions (session_id, created_at);
create index if not exists hash_clusters_session_idx on hash_clusters (session_id);

create table if not exists hash_separations (
  session_id text not null references hash_sessions (id) on delete cascade,
  left_id text not null,
  right_id text not null,
  primary key (session_id, left_id, right_id)
);

create table if not exists hash_supports (
  id text primary key,
  session_id text not null references hash_sessions (id) on delete cascade,
  cluster_id text not null references hash_clusters (id) on delete cascade,
  participant_id text not null references hash_participants (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (cluster_id, participant_id)
);

create table if not exists hash_votes (
  id text primary key,
  session_id text not null references hash_sessions (id) on delete cascade,
  cluster_id text not null references hash_clusters (id) on delete cascade,
  participant_id text not null references hash_participants (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (cluster_id, participant_id)
);
