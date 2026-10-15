-- Hash It Out RPCs for the live Supabase project.
-- Run this once in the Supabase SQL editor. It does not drop tables or rows.
--
-- Live tables already exist and anon SELECT is already denied. This script
-- only adds missing columns, tightens checks, and installs SECURITY DEFINER
-- functions. The anon key may call the granted RPCs. It must not read or
-- write the base tables.
--
-- Installed shape (do not rename):
--   hash_sessions.join_code, host_token_hash, prompt, context, title,
--   identity_mode, show_live_board, blind_first_round, revealed, vote_limit,
--   cosmic_enabled, status, closed_at
--   hash_participants.participant_token_hash, display_name, last_seen_at
--   hash_clusters.is_pinned, is_hidden, locked_by_host, source
--   hash_submissions."text", normalized_text, anonymous, display_name
--   hash_cluster_events.event_type, payload
-- All ids are uuid. Tokens are stored only as SHA-256 hex.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end $$;

grant usage on schema public to anon, authenticated;

create table if not exists public.hash_sessions (
  id uuid primary key default gen_random_uuid(),
  join_code text not null unique,
  host_token_hash text not null,
  prompt text not null,
  context text not null default '',
  title text not null default '',
  starter text not null default 'custom',
  identity_mode text not null default 'choice' check (identity_mode in ('anonymous', 'named', 'choice')),
  show_live_board boolean not null default true,
  blind_first_round boolean not null default false,
  revealed boolean not null default true,
  vote_limit integer not null default 3 check (vote_limit in (1, 3)),
  cosmic_enabled boolean not null default false,
  status text not null default 'open' check (status in ('open', 'paused', 'voting', 'closed')),
  lucky_cluster_id uuid,
  synthesis jsonb not null default '{}'::jsonb,
  llm_calls integer not null default 0,
  auto_llm integer not null default 0,
  last_collate_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hash_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.hash_sessions (id) on delete cascade,
  participant_token_hash text not null,
  display_name text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  unique (session_id, participant_token_hash)
);

create table if not exists public.hash_clusters (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.hash_sessions (id) on delete cascade,
  title text not null,
  summary text not null default '',
  is_pinned boolean not null default false,
  is_hidden boolean not null default false,
  locked_by_host boolean not null default false,
  source text not null default 'rules' check (source in ('rules', 'ai', 'facilitator')),
  action_kind text not null default '' check (action_kind in ('', 'action', 'park', 'discuss', 'decide')),
  action_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hash_submissions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.hash_sessions (id) on delete cascade,
  participant_id uuid references public.hash_participants (id) on delete set null,
  anonymous boolean not null default true,
  display_name text,
  "text" text not null,
  normalized_text text not null default '',
  cluster_id uuid references public.hash_clusters (id) on delete set null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.hash_same_here (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.hash_sessions (id) on delete cascade,
  cluster_id uuid not null references public.hash_clusters (id) on delete cascade,
  participant_id uuid not null references public.hash_participants (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.hash_votes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.hash_sessions (id) on delete cascade,
  cluster_id uuid not null references public.hash_clusters (id) on delete cascade,
  participant_id uuid not null references public.hash_participants (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.hash_cluster_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.hash_sessions (id) on delete cascade,
  cluster_id uuid references public.hash_clusters (id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.hash_sessions add column if not exists starter text not null default 'custom';
alter table public.hash_sessions add column if not exists lucky_cluster_id uuid;
alter table public.hash_sessions add column if not exists synthesis jsonb not null default '{}'::jsonb;
alter table public.hash_sessions add column if not exists llm_calls integer not null default 0;
alter table public.hash_sessions add column if not exists auto_llm integer not null default 0;
alter table public.hash_sessions add column if not exists last_collate_at timestamptz;
alter table public.hash_clusters add column if not exists action_kind text not null default '';
alter table public.hash_clusters add column if not exists action_note text not null default '';
alter table public.hash_submissions add column if not exists is_hidden boolean not null default false;

alter table public.hash_submissions alter column display_name drop not null;
alter table public.hash_submissions alter column display_name drop default;
alter table public.hash_participants alter column display_name drop not null;
alter table public.hash_participants alter column display_name drop default;
alter table public.hash_cluster_events alter column cluster_id drop not null;

update public.hash_submissions set display_name = null where anonymous = true and display_name is not null;
update public.hash_participants set display_name = null where display_name = '';

do $$
declare
  r record;
begin
  for r in
    select con.conname, pg_get_constraintdef(con.oid) as def
    from pg_constraint con
    where con.conrelid = 'public.hash_sessions'::regclass
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%status%'
  loop
    if r.def not ilike '%voting%' or r.def not ilike '%paused%' then
      execute format('alter table public.hash_sessions drop constraint %I', r.conname);
    end if;
  end loop;
  if not exists (select 1 from pg_constraint where conname = 'hash_sessions_status_check')
     and not exists (select 1 from public.hash_sessions where status not in ('open', 'paused', 'voting', 'closed')) then
    alter table public.hash_sessions
      add constraint hash_sessions_status_check
      check (status in ('open', 'paused', 'voting', 'closed'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'hash_sessions_identity_check')
     and not exists (
       select 1 from public.hash_sessions
       where identity_mode not in ('anonymous', 'named', 'choice')
     ) then
    alter table public.hash_sessions
      add constraint hash_sessions_identity_check
      check (identity_mode in ('anonymous', 'named', 'choice'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'hash_sessions_vote_limit_check')
     and not exists (select 1 from public.hash_sessions where vote_limit not in (1, 3)) then
    alter table public.hash_sessions
      add constraint hash_sessions_vote_limit_check
      check (vote_limit in (1, 3));
  end if;

  for r in
    select con.conname, pg_get_constraintdef(con.oid) as def
    from pg_constraint con
    where con.conrelid = 'public.hash_clusters'::regclass
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%source%'
  loop
    if r.def not ilike '%facilitator%' then
      execute format('alter table public.hash_clusters drop constraint %I', r.conname);
    end if;
  end loop;
  if not exists (select 1 from pg_constraint where conname = 'hash_clusters_source_check')
     and not exists (
       select 1 from public.hash_clusters where source not in ('rules', 'ai', 'facilitator')
     ) then
    alter table public.hash_clusters
      add constraint hash_clusters_source_check
      check (source in ('rules', 'ai', 'facilitator'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'hash_clusters_action_check')
     and not exists (
       select 1 from public.hash_clusters
       where action_kind not in ('', 'action', 'park', 'discuss', 'decide')
     ) then
    alter table public.hash_clusters
      add constraint hash_clusters_action_check
      check (action_kind in ('', 'action', 'park', 'discuss', 'decide'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'hash_submissions_anon_name') then
    alter table public.hash_submissions
      add constraint hash_submissions_anon_name
      check (anonymous = false or display_name is null);
  end if;
end $$;

create unique index if not exists hash_sessions_join_code_idx on public.hash_sessions (join_code);
create unique index if not exists hash_participants_token_idx on public.hash_participants (session_id, participant_token_hash);
create index if not exists hash_submissions_session_idx on public.hash_submissions (session_id, created_at);
create index if not exists hash_submissions_norm_idx on public.hash_submissions (session_id, normalized_text);
create index if not exists hash_clusters_session_idx on public.hash_clusters (session_id);
create unique index if not exists hash_same_here_once_idx on public.hash_same_here (cluster_id, participant_id);
create unique index if not exists hash_votes_once_idx on public.hash_votes (cluster_id, participant_id);

do $$
declare
  t text;
  pol record;
begin
  foreach t in array array[
    'hash_sessions', 'hash_participants', 'hash_clusters', 'hash_submissions',
    'hash_same_here', 'hash_votes', 'hash_cluster_events'
  ]
  loop
    if to_regclass('public.' || t) is null then
      continue;
    end if;
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from public, anon, authenticated', t);
    for pol in select policyname from pg_policies where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on public.%I', pol.policyname, t);
    end loop;
  end loop;
end $$;

create or replace function public.hash_digest(p_token text)
returns text
language plpgsql
stable
set search_path = public
as $$
declare
  raw bytea := convert_to(p_token, 'utf8');
begin
  begin
    return encode(extensions.digest(raw, 'sha256'), 'hex');
  exception when undefined_function or invalid_schema_name or undefined_object then
    return encode(sha256(raw), 'hex');
  end;
end;
$$;

create or replace function public.hash_make_id(p_len integer)
returns text
language plpgsql
volatile
set search_path = public
as $$
declare
  alphabet text := 'abcdefghjkmnpqrstuvwxyz23456789';
  source text := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  out text := '';
  i integer;
  n integer;
begin
  if p_len < 1 or p_len > 64 then
    raise exception 'invalid id length';
  end if;
  for i in 1..p_len loop
    n := get_byte(decode(substr(source, ((i - 1) % 32) * 2 + 1, 2), 'hex'), 0);
    out := out || substr(alphabet, 1 + (n % length(alphabet)), 1);
  end loop;
  return out;
end;
$$;

create or replace function public.hash_uuid(p_value text)
returns uuid
language plpgsql
immutable
set search_path = public
as $$
begin
  if p_value is null or p_value !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return null;
  end if;
  return p_value::uuid;
exception when invalid_text_representation then
  return null;
end;
$$;

create or replace function public.hash_norm(p_text text)
returns text
language sql
immutable
set search_path = public
as $$
  select btrim(regexp_replace(lower(coalesce(p_text, '')), '[^a-z0-9]+', ' ', 'g'));
$$;

create or replace function public.hash_lock(p_session_id text)
returns void
language plpgsql
volatile
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext(p_session_id));
end;
$$;

create or replace function public.hash_separated(p_session_id uuid, p_left text, p_right text)
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.hash_cluster_events e
    where e.session_id = p_session_id
      and e.event_type = 'separate'
      and (e.payload::jsonb->>'a') = least(p_left, p_right)
      and (e.payload::jsonb->>'b') = greatest(p_left, p_right)
  );
$$;

create or replace function public.hash_touch_participant(p_session_id uuid, p_token text)
returns uuid
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  digest text;
  pid uuid;
begin
  if p_token is null or p_token !~ '^[A-Za-z0-9]{16,64}$' then
    raise exception 'Join again from this phone';
  end if;
  digest := public.hash_digest(p_token);
  select id into pid
  from public.hash_participants
  where session_id = p_session_id and participant_token_hash = digest;
  if pid is not null then
    update public.hash_participants set last_seen_at = now() where id = pid;
    return pid;
  end if;
  pid := gen_random_uuid();
  begin
    insert into public.hash_participants (id, session_id, participant_token_hash, display_name, last_seen_at)
    values (pid, p_session_id, digest, null, now());
  exception when unique_violation then
    select id into pid
    from public.hash_participants
    where session_id = p_session_id and participant_token_hash = digest;
  end;
  return pid;
end;
$$;

create or replace function public.hash_require_session(p_code text)
returns public.hash_sessions
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  clean text := lower(btrim(coalesce(p_code, '')));
begin
  if clean !~ '^[a-z0-9]{4,12}$' then
    raise exception 'That code has no room';
  end if;
  select * into s from public.hash_sessions where join_code = clean;
  if s.id is null then
    raise exception 'That code has no room';
  end if;
  return s;
end;
$$;

create or replace function public.hash_require_host(p_code text, p_host_token text)
returns public.hash_sessions
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
begin
  s := public.hash_require_session(p_code);
  if p_host_token is null or p_host_token !~ '^[A-Za-z0-9]{20,80}$' then
    raise exception 'Only the host can do that';
  end if;
  if public.hash_digest(p_host_token) is distinct from s.host_token_hash then
    raise exception 'Only the host can do that';
  end if;
  perform public.hash_lock(s.id::text);
  select * into s from public.hash_sessions where id = s.id;
  return s;
end;
$$;

create or replace function public.hash_room_json(p_session_id uuid, p_participant_id uuid, p_is_host boolean)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  cover boolean;
  themes jsonb := '[]'::jsonb;
  loose jsonb := '[]'::jsonb;
  c public.hash_clusters;
  lines jsonb;
  voices integer;
  anon_voices integer;
  support_count integer;
  vote_count integer;
  mine_support boolean;
  mine_vote boolean;
  theme jsonb;
  visible_themes jsonb;
  strongest text := '';
  favourite text := '';
  hidden_signal text := '';
  best_voices integer := -1;
  best_votes integer := -1;
  best_anon integer := -1;
  own_count integer := 0;
  part_count integer := 0;
  sub_count integer := 0;
  loose_count integer := 0;
  theme_count integer := 0;
begin
  select * into s from public.hash_sessions where id = p_session_id;
  cover := (not p_is_host) and ((s.blind_first_round and not s.revealed) or not s.show_live_board);
  select count(*) into own_count
  from public.hash_submissions
  where session_id = s.id
    and participant_id is not distinct from p_participant_id
    and not is_hidden;

  if cover then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', sub.id,
      'text', sub."text",
      'label', case when sub.anonymous or sub.display_name is null then 'Anonymous' else sub.display_name end,
      'anonymous', sub.anonymous or sub.display_name is null,
      'createdAt', sub.created_at,
      'mine', true,
      'hidden', false
    ) order by sub.created_at), '[]'::jsonb)
    into loose
    from public.hash_submissions sub
    where sub.session_id = s.id
      and sub.participant_id is not distinct from p_participant_id
      and not sub.is_hidden;
  else
    for c in
      select * from public.hash_clusters
      where session_id = s.id
      order by is_pinned desc, title asc
    loop
      if not p_is_host and c.is_hidden then
        continue;
      end if;
      select
        coalesce(jsonb_agg(jsonb_build_object(
          'id', sub.id,
          'text', sub."text",
          'label', case when sub.anonymous or sub.display_name is null then 'Anonymous' else sub.display_name end,
          'anonymous', sub.anonymous or sub.display_name is null,
          'createdAt', sub.created_at,
          'mine', sub.participant_id is not distinct from p_participant_id,
          'hidden', sub.is_hidden
        ) order by sub.created_at), '[]'::jsonb),
        count(*) filter (where not sub.is_hidden),
        count(*) filter (where not sub.is_hidden and (sub.anonymous or sub.display_name is null))
      into lines, voices, anon_voices
      from public.hash_submissions sub
      where sub.cluster_id = c.id
        and sub.session_id = s.id
        and (p_is_host or not sub.is_hidden);
      if not p_is_host and coalesce(voices, 0) = 0 then
        continue;
      end if;
      select count(*) into support_count from public.hash_same_here where cluster_id = c.id;
      select count(*) into vote_count from public.hash_votes where cluster_id = c.id;
      mine_support := p_participant_id is not null and exists (
        select 1 from public.hash_same_here where cluster_id = c.id and participant_id = p_participant_id
      );
      mine_vote := p_participant_id is not null and exists (
        select 1 from public.hash_votes where cluster_id = c.id and participant_id = p_participant_id
      );
      theme := jsonb_build_object(
        'id', c.id,
        'title', c.title,
        'summary', c.summary,
        'voices', coalesce(voices, 0),
        'anonymousVoices', coalesce(anon_voices, 0),
        'support', coalesce(support_count, 0),
        'votes', coalesce(vote_count, 0),
        'pinned', c.is_pinned,
        'hidden', c.is_hidden,
        'locked', c.locked_by_host,
        'source', c.source,
        'actionKind', c.action_kind,
        'actionNote', c.action_note,
        'mineSupported', mine_support,
        'mineVoted', mine_vote,
        'prominence', case
          when coalesce(voices, 0) >= 8 then 3
          when coalesce(voices, 0) >= 4 then 2
          when coalesce(voices, 0) >= 2 then 1
          else 0
        end,
        'lines', coalesce(lines, '[]'::jsonb)
      );
      themes := themes || jsonb_build_array(theme);
    end loop;

    select coalesce(jsonb_agg(item order by (item->>'pinned')::boolean desc, (item->>'voices')::int desc, (item->>'votes')::int desc, item->>'title'), '[]'::jsonb)
    into themes
    from jsonb_array_elements(themes) item;

    select coalesce(jsonb_agg(jsonb_build_object(
      'id', sub.id,
      'text', sub."text",
      'label', case when sub.anonymous or sub.display_name is null then 'Anonymous' else sub.display_name end,
      'anonymous', sub.anonymous or sub.display_name is null,
      'createdAt', sub.created_at,
      'mine', sub.participant_id is not distinct from p_participant_id,
      'hidden', sub.is_hidden
    ) order by sub.created_at), '[]'::jsonb)
    into loose
    from public.hash_submissions sub
    where sub.session_id = s.id
      and sub.cluster_id is null
      and (p_is_host or not sub.is_hidden);
  end if;

  select coalesce(jsonb_agg(item), '[]'::jsonb) into visible_themes
  from jsonb_array_elements(themes) item
  where coalesce((item->>'hidden')::boolean, false) = false and coalesce((item->>'voices')::int, 0) > 0;

  for theme in select item from jsonb_array_elements(visible_themes) item loop
    if (theme->>'voices')::int > best_voices then
      best_voices := (theme->>'voices')::int;
      strongest := theme->>'id';
    end if;
    if (theme->>'votes')::int > 0 and (theme->>'votes')::int > best_votes then
      best_votes := (theme->>'votes')::int;
      favourite := theme->>'id';
    end if;
    if (theme->>'anonymousVoices')::int >= 2
      and (theme->>'anonymousVoices')::int >= (theme->>'voices')::int - (theme->>'anonymousVoices')::int
      and (theme->>'anonymousVoices')::int > best_anon then
      best_anon := (theme->>'anonymousVoices')::int;
      hidden_signal := theme->>'id';
    end if;
  end loop;

  if cover then
    part_count := case when own_count > 0 then 1 else 0 end;
    sub_count := own_count;
    loose_count := 0;
    theme_count := 0;
    strongest := '';
    favourite := '';
    hidden_signal := '';
  else
    select count(*) into part_count from public.hash_participants where session_id = s.id;
    select count(*) into sub_count from public.hash_submissions where session_id = s.id and (not is_hidden or p_is_host);
    select count(*) into loose_count from public.hash_submissions where session_id = s.id and cluster_id is null and not is_hidden;
    select count(*) into theme_count from jsonb_array_elements(visible_themes);
  end if;

  return jsonb_build_object(
    'role', case when p_is_host then 'host' else 'guest' end,
    'sessionId', case when p_is_host then s.id::text else '' end,
    'code', s.join_code,
    'join_code', s.join_code,
    'prompt', s.prompt,
    'context', s.context,
    'starter', s.starter,
    'identityMode', s.identity_mode,
    'showLiveBoard', s.show_live_board,
    'blindRound', s.blind_first_round,
    'revealed', s.revealed,
    'votingEnabled', s.status = 'voting',
    'voteLimit', s.vote_limit,
    'votesCast', coalesce((
      select count(*) from public.hash_votes v
      where v.session_id = s.id and v.participant_id is not distinct from p_participant_id
    ), 0),
    'cosmicEnabled', s.cosmic_enabled,
    'status', s.status,
    'participantCount', part_count,
    'submissionCount', sub_count,
    'uncollatedCount', loose_count,
    'themeCount', theme_count,
    'llmCalls', case when p_is_host then s.llm_calls else 0 end,
    'themes', themes,
    'loose', loose,
    'strongestId', strongest,
    'favouriteId', favourite,
    'hiddenSignalId', hidden_signal,
    'luckyId', case when s.cosmic_enabled and not cover and s.lucky_cluster_id is not null then s.lucky_cluster_id::text else '' end,
    'synthesis', case
      when cover or s.synthesis is null or s.synthesis = '{}'::jsonb or not (s.synthesis ? 'topThemes') then null
      else s.synthesis
    end,
    'sharePath', '/?mode=hash&code=' || s.join_code,
    'autoLlm', case when p_is_host then s.auto_llm else 0 end,
    'lastCollateAt', case when p_is_host then s.last_collate_at else null end,
    'collate', case when p_is_host then jsonb_build_object(
      'submissions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', sub.id,
          'text', sub."text",
          'anonymous', sub.anonymous,
          'createdAt', sub.created_at,
          'clusterId', sub.cluster_id,
          'hidden', sub.is_hidden
        ) order by sub.created_at)
        from public.hash_submissions sub where sub.session_id = s.id
      ), '[]'::jsonb),
      'clusters', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', cl.id,
          'title', cl.title,
          'summary', cl.summary,
          'userLocked', cl.locked_by_host,
          'source', cl.source,
          'pinned', cl.is_pinned,
          'hidden', cl.is_hidden,
          'actionKind', cl.action_kind,
          'actionNote', cl.action_note
        ))
        from public.hash_clusters cl where cl.session_id = s.id
      ), '[]'::jsonb),
      'separations', coalesce((
        select jsonb_agg(jsonb_build_object('a', e.payload::jsonb->>'a', 'b', e.payload::jsonb->>'b'))
        from public.hash_cluster_events e
        where e.session_id = s.id and e.event_type = 'separate'
      ), '[]'::jsonb)
    ) else null end
  );
end;
$$;

create or replace function public.hash_lookup_code(p_code text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.hash_sessions
    where join_code = lower(btrim(coalesce(p_code, '')))
  );
$$;

create or replace function public.hash_create_session(
  p_host_token text,
  p_prompt text,
  p_context text,
  p_starter text,
  p_identity_mode text,
  p_show_live_board boolean,
  p_blind_first_round boolean,
  p_vote_limit integer,
  p_cosmic_enabled boolean
) returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  new_id uuid;
  new_code text;
  attempt integer := 0;
  question text;
begin
  if p_host_token is null or p_host_token !~ '^[A-Za-z0-9]{20,80}$' then
    raise exception 'The host key is not valid';
  end if;
  question := btrim(coalesce(p_prompt, ''));
  if length(question) < 2 or length(question) > 200 then
    raise exception 'Ask a question';
  end if;
  if p_identity_mode not in ('anonymous', 'named', 'choice') then
    raise exception 'Choose how names work';
  end if;
  if p_vote_limit not in (1, 3) then
    raise exception 'Votes are 1 or 3';
  end if;
  new_id := gen_random_uuid();
  loop
    attempt := attempt + 1;
    new_code := public.hash_make_id(6);
    exit when not exists (select 1 from public.hash_sessions where join_code = new_code);
    if attempt > 8 then
      raise exception 'Could not open a room';
    end if;
  end loop;
  insert into public.hash_sessions (
    id, join_code, host_token_hash, prompt, context, title, starter, identity_mode,
    show_live_board, blind_first_round, revealed, vote_limit, cosmic_enabled, status, updated_at
  ) values (
    new_id,
    new_code,
    public.hash_digest(p_host_token),
    question,
    left(coalesce(p_context, ''), 500),
    left(question, 120),
    left(coalesce(nullif(btrim(coalesce(p_starter, '')), ''), 'custom'), 24),
    p_identity_mode,
    coalesce(p_show_live_board, true),
    coalesce(p_blind_first_round, false),
    not coalesce(p_blind_first_round, false),
    p_vote_limit,
    coalesce(p_cosmic_enabled, false),
    'open',
    now()
  );
  return jsonb_build_object('join_code', new_code, 'code', new_code);
end;
$$;

create or replace function public.hash_join_session(p_code text, p_participant_token text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  pid uuid;
begin
  s := public.hash_require_session(p_code);
  perform public.hash_lock(s.id::text);
  pid := public.hash_touch_participant(s.id, p_participant_token);
  return public.hash_room_json(s.id, pid, false);
end;
$$;

create or replace function public.hash_get_public_snapshot(p_code text, p_participant_token text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  pid uuid;
begin
  s := public.hash_require_session(p_code);
  pid := public.hash_touch_participant(s.id, p_participant_token);
  return public.hash_room_json(s.id, pid, false);
end;
$$;

create or replace function public.hash_get_host_snapshot(p_code text, p_host_token text, p_participant_token text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  pid uuid := null;
begin
  s := public.hash_require_host(p_code, p_host_token);
  if coalesce(p_participant_token, '') ~ '^[A-Za-z0-9]{16,64}$' then
    pid := public.hash_touch_participant(s.id, p_participant_token);
  end if;
  return public.hash_room_json(s.id, pid, true);
end;
$$;

create or replace function public.hash_exact_cluster(p_session_id uuid, p_submission_id uuid, p_norm text)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  existing uuid;
  twin uuid;
  created uuid;
  title text;
begin
  if p_norm = '' then
    return;
  end if;
  select sub.cluster_id into existing
  from public.hash_submissions sub
  where sub.session_id = p_session_id
    and sub.id <> p_submission_id
    and sub.normalized_text = p_norm
    and sub.cluster_id is not null
    and not sub.is_hidden
    and not public.hash_separated(p_session_id, p_submission_id::text, sub.id::text)
  order by sub.created_at
  limit 1;
  if existing is not null then
    update public.hash_submissions set cluster_id = existing where id = p_submission_id;
    return;
  end if;
  select sub.id into twin
  from public.hash_submissions sub
  where sub.session_id = p_session_id
    and sub.id <> p_submission_id
    and sub.normalized_text = p_norm
    and sub.cluster_id is null
    and not sub.is_hidden
    and not public.hash_separated(p_session_id, p_submission_id::text, sub.id::text)
  order by sub.created_at
  limit 1;
  if twin is null then
    return;
  end if;
  select left("text", 80) into title from public.hash_submissions where id = p_submission_id;
  created := gen_random_uuid();
  insert into public.hash_clusters (id, session_id, title, summary, source, locked_by_host, updated_at)
  values (created, p_session_id, left(coalesce(title, 'New thread'), 60), left(coalesce(title, ''), 140), 'rules', false, now());
  update public.hash_submissions set cluster_id = created where id in (p_submission_id, twin);
end;
$$;

create or replace function public.hash_submit_idea(
  p_code text,
  p_participant_token text,
  p_text text,
  p_anonymous boolean,
  p_display_name text
) returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  pid uuid;
  clean text;
  named boolean;
  anon boolean;
  label text;
  previous timestamptz;
  total integer;
  new_id uuid;
  norm text;
begin
  s := public.hash_require_session(p_code);
  perform public.hash_lock(s.id::text);
  select * into s from public.hash_sessions where id = s.id;
  if s.status = 'paused' then
    raise exception 'The room is paused';
  end if;
  if s.status <> 'open' then
    raise exception 'The room is not taking ideas right now';
  end if;
  clean := left(btrim(regexp_replace(coalesce(p_text, ''), '\s+', ' ', 'g')), 240);
  if length(clean) < 2 then
    raise exception 'Throw in a few words';
  end if;
  pid := public.hash_touch_participant(s.id, p_participant_token);
  named := s.identity_mode = 'named' or (s.identity_mode = 'choice' and not coalesce(p_anonymous, true));
  anon := s.identity_mode = 'anonymous' or not named;
  label := nullif(left(btrim(coalesce(p_display_name, '')), 24), '');
  if label like '%@%' then
    label := null;
  end if;
  if anon then
    label := null;
  elsif label is null then
    if s.identity_mode = 'named' then
      raise exception 'Add a name';
    end if;
    raise exception 'Add a name, or stay anonymous';
  end if;
  select count(*) into total from public.hash_submissions where participant_id = pid;
  if total >= 20 then
    raise exception 'That is plenty from you for this room';
  end if;
  select created_at into previous
  from public.hash_submissions
  where participant_id = pid
  order by created_at desc
  limit 1;
  if previous is not null and previous > clock_timestamp() - interval '800 milliseconds' then
    raise exception 'Give it a second';
  end if;
  if label is null then
    anon := true;
  else
    anon := false;
    update public.hash_participants set display_name = label where id = pid and display_name is null;
  end if;
  new_id := gen_random_uuid();
  norm := public.hash_norm(clean);
  insert into public.hash_submissions (
    id, session_id, participant_id, anonymous, display_name, "text", normalized_text, is_hidden
  ) values (
    new_id, s.id, pid, anon, case when anon then null else label end, clean, norm, false
  );
  perform public.hash_exact_cluster(s.id, new_id, norm);
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.hash_add_same_here(p_code text, p_participant_token text, p_cluster_id text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  pid uuid;
  cid uuid;
begin
  s := public.hash_require_session(p_code);
  perform public.hash_lock(s.id::text);
  select * into s from public.hash_sessions where id = s.id;
  if s.status in ('paused', 'closed') then
    raise exception 'The room is not taking that right now';
  end if;
  cid := public.hash_uuid(p_cluster_id);
  if cid is null or not exists (
    select 1 from public.hash_clusters where id = cid and session_id = s.id and not is_hidden
  ) then
    raise exception 'That theme is gone';
  end if;
  pid := public.hash_touch_participant(s.id, p_participant_token);
  insert into public.hash_same_here (id, session_id, cluster_id, participant_id)
  values (gen_random_uuid(), s.id, cid, pid)
  on conflict do nothing;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.hash_cast_vote(p_code text, p_participant_token text, p_cluster_id text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  pid uuid;
  cid uuid;
  cast_count integer;
begin
  s := public.hash_require_session(p_code);
  perform public.hash_lock(s.id::text);
  select * into s from public.hash_sessions where id = s.id;
  if s.status <> 'voting' then
    raise exception 'Voting is not open';
  end if;
  cid := public.hash_uuid(p_cluster_id);
  if cid is null or not exists (
    select 1 from public.hash_clusters where id = cid and session_id = s.id and not is_hidden
  ) then
    raise exception 'That theme is gone';
  end if;
  pid := public.hash_touch_participant(s.id, p_participant_token);
  if exists (select 1 from public.hash_votes where cluster_id = cid and participant_id = pid) then
    return jsonb_build_object('ok', true);
  end if;
  select count(*) into cast_count from public.hash_votes where participant_id = pid and session_id = s.id;
  if cast_count >= s.vote_limit then
    raise exception 'You have used your votes';
  end if;
  insert into public.hash_votes (id, session_id, cluster_id, participant_id)
  values (gen_random_uuid(), s.id, cid, pid);
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.hash_host_settings(p_code text, p_host_token text, p_action text, p_payload jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  eligible uuid[];
  pick uuid;
  n integer;
  open_voting boolean;
begin
  s := public.hash_require_host(p_code, p_host_token);
  if p_action = 'pause' then
    update public.hash_sessions
    set status = case when status = 'closed' then 'closed' else 'paused' end, updated_at = now()
    where id = s.id;
  elsif p_action = 'resume' then
    update public.hash_sessions
    set status = case when status = 'closed' then 'closed' else 'open' end,
        closed_at = case when status = 'closed' then closed_at else null end,
        updated_at = now()
    where id = s.id;
  elsif p_action = 'reveal' then
    update public.hash_sessions
    set revealed = true, show_live_board = true, updated_at = now()
    where id = s.id;
  elsif p_action = 'end' then
    update public.hash_sessions
    set status = 'closed', closed_at = coalesce(closed_at, now()), updated_at = now()
    where id = s.id;
  elsif p_action = 'voting' then
    open_voting := coalesce((p_payload->>'open')::boolean, false);
    update public.hash_sessions
    set status = case when open_voting then 'voting' else 'open' end,
        vote_limit = case
          when (p_payload->>'voteLimit') in ('1', '3') then (p_payload->>'voteLimit')::integer
          else vote_limit
        end,
        updated_at = now()
    where id = s.id;
  elsif p_action = 'live' then
    update public.hash_sessions
    set show_live_board = coalesce((p_payload->>'show')::boolean, true), updated_at = now()
    where id = s.id;
  elsif p_action = 'cosmic' then
    update public.hash_sessions
    set cosmic_enabled = coalesce((p_payload->>'enabled')::boolean, false),
        lucky_cluster_id = case when coalesce((p_payload->>'enabled')::boolean, false) then lucky_cluster_id else null end,
        updated_at = now()
    where id = s.id;
  elsif p_action = 'lucky' then
    if not s.cosmic_enabled then
      raise exception 'Cosmic mode is off';
    end if;
    select coalesce(array_agg(c.id order by c.id), array[]::uuid[]) into eligible
    from public.hash_clusters c
    where c.session_id = s.id
      and not c.is_hidden
      and c.action_kind is distinct from 'park'
      and exists (
        select 1 from public.hash_submissions sub
        where sub.cluster_id = c.id and not sub.is_hidden
      );
    n := coalesce(array_length(eligible, 1), 0);
    if n < 2 then
      raise exception 'Lucky pick needs at least two themes';
    end if;
    pick := eligible[1 + ((mod(hashtext(s.id::text || ':' || array_to_string(eligible, ','))::bigint, n) + n) % n)];
    update public.hash_sessions set lucky_cluster_id = pick, updated_at = now() where id = s.id;
  else
    raise exception 'Unknown host action';
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.hash_host_update_cluster(p_code text, p_host_token text, p_cluster_id text, p_patch jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  cid uuid;
  kind text;
begin
  s := public.hash_require_host(p_code, p_host_token);
  cid := public.hash_uuid(p_cluster_id);
  if cid is null or not exists (select 1 from public.hash_clusters where id = cid and session_id = s.id) then
    raise exception 'That theme is gone';
  end if;
  kind := coalesce(p_patch->>'actionKind', p_patch->>'action_kind', '');
  if kind not in ('', 'action', 'park', 'discuss', 'decide') then
    raise exception 'That mark is not valid';
  end if;
  update public.hash_clusters as c
  set title = case when p_patch ? 'title' and length(btrim(p_patch->>'title')) > 0 then left(btrim(p_patch->>'title'), 60) else c.title end,
      summary = case when p_patch ? 'summary' then left(coalesce(p_patch->>'summary', ''), 180) else c.summary end,
      is_pinned = case when p_patch ? 'pinned' then coalesce((p_patch->>'pinned')::boolean, false) else c.is_pinned end,
      is_hidden = case when p_patch ? 'hidden' then coalesce((p_patch->>'hidden')::boolean, false) else c.is_hidden end,
      action_kind = case when p_patch ? 'actionKind' or p_patch ? 'action_kind' then kind else c.action_kind end,
      action_note = case
        when p_patch ? 'actionNote' or p_patch ? 'action_note'
          then left(coalesce(p_patch->>'actionNote', p_patch->>'action_note', ''), 160)
        else c.action_note
      end,
      locked_by_host = true,
      source = 'facilitator',
      updated_at = now()
  where c.id = cid and c.session_id = s.id;
  insert into public.hash_cluster_events (id, session_id, cluster_id, event_type, payload)
  values (gen_random_uuid(), s.id, cid, 'edit', coalesce(p_patch, '{}'::jsonb));
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.hash_host_merge_clusters(p_code text, p_host_token text, p_into_id text, p_from_id text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  into_id uuid;
  from_id uuid;
  member_ids text[];
begin
  s := public.hash_require_host(p_code, p_host_token);
  into_id := public.hash_uuid(p_into_id);
  from_id := public.hash_uuid(p_from_id);
  if into_id is null or from_id is null then
    raise exception 'That theme is gone';
  end if;
  if into_id = from_id then
    return jsonb_build_object('ok', true);
  end if;
  if not exists (select 1 from public.hash_clusters where id = into_id and session_id = s.id) then
    raise exception 'That theme is gone';
  end if;
  if not exists (select 1 from public.hash_clusters where id = from_id and session_id = s.id) then
    raise exception 'That theme is gone';
  end if;
  select coalesce(array_agg(id::text), array[]::text[]) into member_ids
  from public.hash_submissions
  where session_id = s.id and cluster_id in (into_id, from_id);
  update public.hash_submissions set cluster_id = into_id where session_id = s.id and cluster_id = from_id;
  delete from public.hash_same_here a
  using public.hash_same_here b
  where a.cluster_id = from_id and b.cluster_id = into_id and a.participant_id = b.participant_id;
  update public.hash_same_here set cluster_id = into_id where cluster_id = from_id;
  delete from public.hash_votes a
  using public.hash_votes b
  where a.cluster_id = from_id and b.cluster_id = into_id and a.participant_id = b.participant_id;
  update public.hash_votes set cluster_id = into_id where cluster_id = from_id;
  if coalesce(array_length(member_ids, 1), 0) >= 2 then
    delete from public.hash_cluster_events
    where session_id = s.id and event_type = 'separate'
      and (payload::jsonb->>'a') = any(member_ids)
      and (payload::jsonb->>'b') = any(member_ids);
  end if;
  update public.hash_clusters
  set locked_by_host = true, source = 'facilitator', updated_at = now()
  where id = into_id;
  update public.hash_sessions
  set lucky_cluster_id = case when lucky_cluster_id = from_id then null else lucky_cluster_id end
  where id = s.id;
  delete from public.hash_clusters where id = from_id;
  insert into public.hash_cluster_events (id, session_id, cluster_id, event_type, payload)
  values (gen_random_uuid(), s.id, into_id, 'merge', jsonb_build_object('from', from_id, 'into', into_id));
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.hash_remember_split(p_session_id uuid, p_submission_id uuid, p_previous uuid)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  sibling uuid;
  left_id text;
  right_id text;
begin
  if p_previous is null then
    return;
  end if;
  for sibling in
    select id from public.hash_submissions
    where session_id = p_session_id and cluster_id = p_previous and id <> p_submission_id
  loop
    left_id := least(p_submission_id::text, sibling::text);
    right_id := greatest(p_submission_id::text, sibling::text);
    insert into public.hash_cluster_events (id, session_id, cluster_id, event_type, payload)
    select gen_random_uuid(), p_session_id, p_previous, 'separate', jsonb_build_object('a', left_id, 'b', right_id)
    where not exists (
      select 1 from public.hash_cluster_events e
      where e.session_id = p_session_id
        and e.event_type = 'separate'
        and (e.payload::jsonb->>'a') = left_id
        and (e.payload::jsonb->>'b') = right_id
    );
  end loop;
end;
$$;

create or replace function public.hash_host_move_submission(
  p_code text,
  p_host_token text,
  p_submission_id text,
  p_cluster_id text,
  p_split boolean
) returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  sid uuid;
  current_cluster uuid;
  target uuid;
  body text;
begin
  s := public.hash_require_host(p_code, p_host_token);
  sid := public.hash_uuid(p_submission_id);
  if sid is null then
    raise exception 'That idea is gone';
  end if;
  select cluster_id, "text" into current_cluster, body
  from public.hash_submissions
  where id = sid and session_id = s.id;
  if body is null then
    raise exception 'That idea is gone';
  end if;
  target := public.hash_uuid(p_cluster_id);
  if coalesce(p_split, false) and target is null then
    target := gen_random_uuid();
    insert into public.hash_clusters (id, session_id, title, summary, locked_by_host, source, updated_at)
    values (target, s.id, left(body, 42), left(body, 140), true, 'facilitator', now());
  end if;
  if target is null or not exists (select 1 from public.hash_clusters where id = target and session_id = s.id) then
    raise exception 'That theme is gone';
  end if;
  perform public.hash_remember_split(s.id, sid, current_cluster);
  update public.hash_submissions set cluster_id = target where id = sid;
  update public.hash_clusters
  set locked_by_host = true, source = 'facilitator', updated_at = now()
  where id = target;
  if current_cluster is not null then
    update public.hash_clusters
    set locked_by_host = true, source = 'facilitator', updated_at = now()
    where id = current_cluster;
    if not exists (select 1 from public.hash_submissions where cluster_id = current_cluster) then
      delete from public.hash_clusters where id = current_cluster and not is_pinned;
      update public.hash_sessions
      set lucky_cluster_id = null
      where id = s.id and lucky_cluster_id = current_cluster;
    end if;
  end if;
  insert into public.hash_cluster_events (id, session_id, cluster_id, event_type, payload)
  values (
    gen_random_uuid(),
    s.id,
    target,
    case when coalesce(p_split, false) then 'split' else 'move' end,
    jsonb_build_object('submission', sid)
  );
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.hash_apply_collation(
  p_code text,
  p_host_token text,
  p_groups jsonb,
  p_used_llm boolean,
  p_auto boolean
) returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  grp jsonb;
  cid uuid;
  raw_id text;
  sid uuid;
  current_cluster uuid;
  current_locked boolean;
  member text;
  blocked boolean;
  v_title text;
  v_summary text;
  v_source text;
  sub_id text;
begin
  s := public.hash_require_host(p_code, p_host_token);
  if jsonb_typeof(p_groups) is distinct from 'array' then
    raise exception 'Collate did not send groups';
  end if;
  for grp in select item from jsonb_array_elements(p_groups) item loop
    v_title := left(btrim(coalesce(grp->>'title', '')), 60);
    v_summary := left(btrim(coalesce(grp->>'summary', '')), 180);
    v_source := case when grp->>'source' in ('rules', 'ai', 'facilitator') then grp->>'source' else 'rules' end;
    if v_title = '' then
      continue;
    end if;
    raw_id := grp->>'id';
    cid := public.hash_uuid(raw_id);
    if cid is null or not exists (select 1 from public.hash_clusters where id = cid and session_id = s.id) then
      cid := gen_random_uuid();
      insert into public.hash_clusters (id, session_id, title, summary, source, locked_by_host, updated_at)
      values (cid, s.id, v_title, v_summary, v_source, false, now());
    else
      update public.hash_clusters as c
      set title = case when c.locked_by_host then c.title else v_title end,
          summary = case when c.locked_by_host then c.summary else v_summary end,
          source = case when c.locked_by_host then c.source else v_source end,
          updated_at = now()
      where c.id = cid and c.session_id = s.id;
    end if;
    for sub_id in select jsonb_array_elements_text(coalesce(grp->'submissionIds', '[]'::jsonb)) loop
      sid := public.hash_uuid(sub_id);
      if sid is null then
        continue;
      end if;
      select cluster_id into current_cluster from public.hash_submissions where id = sid and session_id = s.id;
      if not found then
        continue;
      end if;
      current_locked := false;
      if current_cluster is not null and current_cluster <> cid then
        select locked_by_host into current_locked from public.hash_clusters where id = current_cluster;
        if coalesce(current_locked, false) then
          continue;
        end if;
      end if;
      blocked := false;
      for member in select id::text from public.hash_submissions where cluster_id = cid and id <> sid loop
        if public.hash_separated(s.id, sid::text, member) then
          blocked := true;
          exit;
        end if;
      end loop;
      if blocked then
        continue;
      end if;
      update public.hash_submissions set cluster_id = cid where id = sid and session_id = s.id;
    end loop;
  end loop;
  update public.hash_sessions
  set lucky_cluster_id = null
  where id = s.id
    and lucky_cluster_id is not null
    and not exists (select 1 from public.hash_clusters c where c.id = lucky_cluster_id and c.session_id = s.id);
  delete from public.hash_clusters c
  where c.session_id = s.id
    and not c.locked_by_host
    and not c.is_pinned
    and not exists (select 1 from public.hash_submissions sub where sub.cluster_id = c.id);
  update public.hash_sessions
  set llm_calls = llm_calls + case when coalesce(p_used_llm, false) then 1 else 0 end,
      auto_llm = auto_llm + case when coalesce(p_auto, false) and coalesce(p_used_llm, false) then 1 else 0 end,
      last_collate_at = now(),
      updated_at = now()
  where id = s.id;
  insert into public.hash_cluster_events (id, session_id, event_type, payload)
  values (gen_random_uuid(), s.id, 'collate', jsonb_build_object('llm', coalesce(p_used_llm, false)));
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.hash_save_synthesis(p_code text, p_host_token text, p_synthesis jsonb, p_used_llm boolean)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
begin
  s := public.hash_require_host(p_code, p_host_token);
  if jsonb_typeof(p_synthesis) is distinct from 'object' then
    raise exception 'The summary was empty';
  end if;
  update public.hash_sessions
  set synthesis = p_synthesis,
      llm_calls = llm_calls + case when coalesce(p_used_llm, false) then 1 else 0 end,
      updated_at = now()
  where id = s.id;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.hash_host_hide_submission(
  p_code text,
  p_host_token text,
  p_submission_id text,
  p_hidden boolean
) returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.hash_sessions;
  sid uuid;
begin
  s := public.hash_require_host(p_code, p_host_token);
  sid := public.hash_uuid(p_submission_id);
  if sid is null then
    raise exception 'That idea is gone';
  end if;
  update public.hash_submissions
  set is_hidden = coalesce(p_hidden, true)
  where id = sid and session_id = s.id;
  if not found then
    raise exception 'That idea is gone';
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.hash_digest(text) from public, anon, authenticated;
revoke all on function public.hash_make_id(integer) from public, anon, authenticated;
revoke all on function public.hash_uuid(text) from public, anon, authenticated;
revoke all on function public.hash_norm(text) from public, anon, authenticated;
revoke all on function public.hash_lock(text) from public, anon, authenticated;
revoke all on function public.hash_separated(uuid, text, text) from public, anon, authenticated;
revoke all on function public.hash_touch_participant(uuid, text) from public, anon, authenticated;
revoke all on function public.hash_require_session(text) from public, anon, authenticated;
revoke all on function public.hash_require_host(text, text) from public, anon, authenticated;
revoke all on function public.hash_room_json(uuid, uuid, boolean) from public, anon, authenticated;
revoke all on function public.hash_exact_cluster(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.hash_remember_split(uuid, uuid, uuid) from public, anon, authenticated;

revoke all on function public.hash_lookup_code(text) from public, anon, authenticated;
revoke all on function public.hash_create_session(text, text, text, text, text, boolean, boolean, integer, boolean) from public, anon, authenticated;
revoke all on function public.hash_join_session(text, text) from public, anon, authenticated;
revoke all on function public.hash_get_public_snapshot(text, text) from public, anon, authenticated;
revoke all on function public.hash_get_host_snapshot(text, text, text) from public, anon, authenticated;
revoke all on function public.hash_submit_idea(text, text, text, boolean, text) from public, anon, authenticated;
revoke all on function public.hash_add_same_here(text, text, text) from public, anon, authenticated;
revoke all on function public.hash_cast_vote(text, text, text) from public, anon, authenticated;
revoke all on function public.hash_host_settings(text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.hash_host_update_cluster(text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.hash_host_merge_clusters(text, text, text, text) from public, anon, authenticated;
revoke all on function public.hash_host_move_submission(text, text, text, text, boolean) from public, anon, authenticated;
revoke all on function public.hash_apply_collation(text, text, jsonb, boolean, boolean) from public, anon, authenticated;
revoke all on function public.hash_host_hide_submission(text, text, text, boolean) from public, anon, authenticated;
revoke all on function public.hash_save_synthesis(text, text, jsonb, boolean) from public, anon, authenticated;

grant execute on function public.hash_lookup_code(text) to anon, authenticated;
grant execute on function public.hash_create_session(text, text, text, text, text, boolean, boolean, integer, boolean) to anon, authenticated;
grant execute on function public.hash_join_session(text, text) to anon, authenticated;
grant execute on function public.hash_get_public_snapshot(text, text) to anon, authenticated;
grant execute on function public.hash_get_host_snapshot(text, text, text) to anon, authenticated;
grant execute on function public.hash_submit_idea(text, text, text, boolean, text) to anon, authenticated;
grant execute on function public.hash_add_same_here(text, text, text) to anon, authenticated;
grant execute on function public.hash_cast_vote(text, text, text) to anon, authenticated;
grant execute on function public.hash_host_settings(text, text, text, jsonb) to anon, authenticated;
grant execute on function public.hash_host_update_cluster(text, text, text, jsonb) to anon, authenticated;
grant execute on function public.hash_host_merge_clusters(text, text, text, text) to anon, authenticated;
grant execute on function public.hash_host_move_submission(text, text, text, text, boolean) to anon, authenticated;
grant execute on function public.hash_apply_collation(text, text, jsonb, boolean, boolean) to anon, authenticated;
grant execute on function public.hash_host_hide_submission(text, text, text, boolean) to anon, authenticated;
grant execute on function public.hash_save_synthesis(text, text, jsonb, boolean) to anon, authenticated;
