-- Hash It Out persistence: room summary, action notes, lucky pick.
-- Additive only. Do not drop tables, Do not replace existing room RPCs.
-- No dollar-quoting, so this can be pasted into the SQL editor as-is.

alter table public.hash_sessions
  add column if not exists room_summary jsonb,
  add column if not exists lucky_cluster_id uuid,
  add column if not exists lucky_picked_at timestamptz;

alter table public.hash_clusters
  add column if not exists action_note text;

create or replace function public.hash_finish_lines(p_value jsonb)
returns jsonb
language sql
immutable
set search_path = public, pg_temp
as '
  select coalesce((
    select jsonb_agg(line order by ord)
    from (
      select left(btrim(value), 240) as line, ordinality as ord
      from jsonb_array_elements_text(
        case when jsonb_typeof(p_value) = ''array'' then p_value else ''[]''::jsonb end
      ) with ordinality
      where length(btrim(value)) > 0
      limit 6
    ) lines
  ), ''[]''::jsonb);
';

create or replace function public.hash_finish_session_from_actor(p_raw jsonb, p_join_code text)
returns uuid
language plpgsql
stable
security definer
set search_path = public, pg_temp
as '
declare
  v_id uuid;
  v_text text;
begin
  if p_raw is null or p_join_code is null or length(btrim(p_join_code)) < 4 then
    return null;
  end if;
  if jsonb_typeof(p_raw) = ''string'' then
    v_text := p_raw #>> ''{}'';
  elsif jsonb_typeof(p_raw) = ''object'' then
    v_text := coalesce(nullif(p_raw->>''session_id'', ''''), nullif(p_raw->>''sessionId'', ''''), nullif(p_raw->>''id'', ''''));
  end if;
  if v_text is null or length(v_text) <> 36 or v_text !~* ''^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'' then
    return null;
  end if;
  v_id := v_text::uuid;
  if exists (select 1 from public.hash_sessions s where s.id = v_id and s.join_code = p_join_code) then
    return v_id;
  end if;
  select p.session_id into v_id
  from public.hash_participants p
  join public.hash_sessions s on s.id = p.session_id
  where p.id = v_text::uuid
    and s.join_code = p_join_code;
  return v_id;
end;
';

create or replace function public.hash_finish_host(p_host_token text, p_join_code text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as '
declare
  v_raw jsonb;
  v_id uuid;
begin
  if to_regprocedure(''public.hash_require_host(text,text)'') is null then
    raise exception ''hash_require_host is not installed'';
  end if;
  if p_host_token is null or length(p_host_token) < 24 then
    raise exception ''Only the host can do that'';
  end if;
  execute format(''select to_jsonb(public.hash_require_host(%L, %L))'', p_host_token, p_join_code)
    into v_raw;
  v_id := public.hash_finish_session_from_actor(v_raw, p_join_code);
  if v_id is null then
    raise exception ''Only the host can do that'';
  end if;
  return v_id;
end;
';

create or replace function public.hash_finish_guest(p_participant_token text, p_join_code text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as '
declare
  v_raw jsonb;
  v_id uuid;
begin
  if to_regprocedure(''public.hash_require_participant(text,text)'') is null then
    raise exception ''hash_require_participant is not installed'';
  end if;
  if p_participant_token is null or length(p_participant_token) < 24 then
    raise exception ''Join again from this phone'';
  end if;
  execute format(''select to_jsonb(public.hash_require_participant(%L, %L))'', p_join_code, p_participant_token)
    into v_raw;
  v_id := public.hash_finish_session_from_actor(v_raw, p_join_code);
  if v_id is null then
    raise exception ''Join again from this phone'';
  end if;
  return v_id;
end;
';

create or replace function public.hash_host_save_summary(
  p_join_code text,
  p_host_token text,
  p_summary jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as '
declare
  v_id uuid;
  v_version integer;
  v_summary jsonb;
begin
  v_id := public.hash_finish_host(p_host_token, p_join_code);
  if p_summary is null or jsonb_typeof(p_summary) <> ''object'' then
    raise exception ''The summary was empty'';
  end if;
  select coalesce((room_summary->>''summaryVersion'')::integer, 0) + 1
    into v_version
  from public.hash_sessions
  where id = v_id;
  v_summary := jsonb_build_object(
    ''topThemes'', public.hash_finish_lines(p_summary->''topThemes''),
    ''agreement'', public.hash_finish_lines(p_summary->''agreement''),
    ''differing'', public.hash_finish_lines(p_summary->''differing''),
    ''nextActions'', public.hash_finish_lines(p_summary->''nextActions''),
    ''questions'', public.hash_finish_lines(p_summary->''questions''),
    ''source'', case when p_summary->>''source'' = ''ai'' then ''ai'' else ''rules'' end,
    ''generatedAt'', to_jsonb(now()),
    ''summaryVersion'', v_version
  );
  update public.hash_sessions
  set room_summary = v_summary,
      updated_at = now()
  where id = v_id;
  return v_summary;
end;
';

create or replace function public.hash_host_set_action_note(
  p_join_code text,
  p_host_token text,
  p_cluster_id text,
  p_action_note text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as '
declare
  v_id uuid;
  v_cluster uuid;
  v_note text;
begin
  v_id := public.hash_finish_host(p_host_token, p_join_code);
  if p_cluster_id is null or length(p_cluster_id) <> 36 or p_cluster_id !~* ''^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'' then
    raise exception ''That theme is gone'';
  end if;
  v_cluster := p_cluster_id::uuid;
  v_note := nullif(left(btrim(coalesce(p_action_note, '''')), 160), '''');
  update public.hash_clusters
  set action_note = v_note,
      updated_at = now()
  where id = v_cluster
    and session_id = v_id;
  if not found then
    raise exception ''That theme is gone'';
  end if;
  return jsonb_build_object(''ok'', true);
end;
';

create or replace function public.hash_host_lucky_pick(
  p_join_code text,
  p_host_token text,
  p_reroll boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as '
declare
  v_id uuid;
  v_cosmic boolean;
  v_existing uuid;
  v_ids uuid[];
  v_bytes bytea;
  v_index integer;
  v_need integer;
  v_pick uuid;
  v_at timestamptz;
begin
  v_id := public.hash_finish_host(p_host_token, p_join_code);
  perform pg_advisory_xact_lock(hashtext(v_id::text));
  select cosmic_enabled, lucky_cluster_id
    into v_cosmic, v_existing
  from public.hash_sessions
  where id = v_id
  for update;
  if not coalesce(v_cosmic, false) then
    raise exception ''Turn cosmic mode on first.'';
  end if;
  if v_existing is not null and not coalesce(p_reroll, false) then
    select lucky_picked_at into v_at from public.hash_sessions where id = v_id;
    return jsonb_build_object(''luckyId'', v_existing, ''luckyPickedAt'', v_at);
  end if;
  select coalesce(array_agg(id order by id), ''{}'')
    into v_ids
  from (
    select c.id
    from public.hash_clusters c
    where c.session_id = v_id
      and coalesce(c.is_hidden, false) = false
      and upper(coalesce(c.action_status, '''')) is distinct from ''PARK''
      and exists (
        select 1
        from public.hash_submissions sub
        where sub.cluster_id = c.id
          and sub.session_id = v_id
          and coalesce(upper(sub.moderation_status), ''VISIBLE'') not like ''HIDDEN%''
      )
      and (
        not coalesce(p_reroll, false)
        or v_existing is null
        or c.id is distinct from v_existing
      )
  ) eligible;
  if v_existing is null or not coalesce(p_reroll, false) then
    v_need := 2;
  else
    v_need := 1;
  end if;
  if coalesce(array_length(v_ids, 1), 0) < v_need then
    raise exception ''Lucky pick needs two themes that are not hidden or parked.'';
  end if;
  v_bytes := extensions.gen_random_bytes(4);
  v_index := (
    get_byte(v_bytes, 0)
    + get_byte(v_bytes, 1) * 256
    + get_byte(v_bytes, 2) * 65536
    + get_byte(v_bytes, 3) * 16777216
  ) % array_length(v_ids, 1);
  v_pick := v_ids[v_index + 1];
  v_at := now();
  update public.hash_sessions
  set lucky_cluster_id = v_pick,
      lucky_picked_at = v_at,
      updated_at = v_at
  where id = v_id;
  return jsonb_build_object(''luckyId'', v_pick, ''luckyPickedAt'', v_at);
end;
';

create or replace function public.hash_get_room_extras(
  p_join_code text,
  p_host_token text,
  p_participant_token text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as '
declare
  v_id uuid;
  v_host boolean := false;
  v_live boolean;
  v_blind boolean;
  v_revealed boolean;
  v_shown boolean;
  v_summary jsonb;
  v_lucky uuid;
  v_at timestamptz;
  v_notes jsonb;
begin
  if coalesce(p_host_token, '''') <> '''' then
    begin
      v_id := public.hash_finish_host(p_host_token, p_join_code);
      v_host := true;
    exception when others then
      if sqlerrm ilike ''%only the host%'' or sqlerrm ilike ''%host token%'' then
        v_id := null;
        v_host := false;
      else
        raise;
      end if;
    end;
  end if;
  if not v_host then
    v_id := public.hash_finish_guest(p_participant_token, p_join_code);
  end if;
  select
    coalesce(show_live_board, false),
    coalesce(blind_first_round, false),
    coalesce(revealed, false),
    room_summary,
    lucky_cluster_id,
    lucky_picked_at
  into v_live, v_blind, v_revealed, v_summary, v_lucky, v_at
  from public.hash_sessions
  where id = v_id;
  v_shown := v_host or (v_live and (v_revealed or not v_blind));
  if not v_shown then
    return jsonb_build_object(
      ''shown'', false,
      ''summary'', null,
      ''luckyId'', '''',
      ''luckyPickedAt'', '''',
      ''notes'', ''[]''::jsonb
    );
  end if;
  select coalesce(jsonb_agg(jsonb_build_object(''clusterId'', c.id, ''actionNote'', c.action_note)), ''[]''::jsonb)
    into v_notes
  from public.hash_clusters c
  where c.session_id = v_id
    and nullif(btrim(coalesce(c.action_note, '''')), '''') is not null
    and (v_host or coalesce(c.is_hidden, false) = false);
  return jsonb_build_object(
    ''shown'', true,
    ''summary'', v_summary,
    ''luckyId'', coalesce(v_lucky::text, ''''),
    ''luckyPickedAt'', coalesce(v_at::text, ''''),
    ''notes'', v_notes
  );
end;
';

revoke all on function public.hash_finish_lines(jsonb) from public, anon, authenticated;
revoke all on function public.hash_finish_session_from_actor(jsonb, text) from public, anon, authenticated;
revoke all on function public.hash_finish_host(text, text) from public, anon, authenticated;
revoke all on function public.hash_finish_guest(text, text) from public, anon, authenticated;
revoke all on function public.hash_host_save_summary(text, text, jsonb) from public, anon, authenticated;
revoke all on function public.hash_host_set_action_note(text, text, text, text) from public, anon, authenticated;
revoke all on function public.hash_host_lucky_pick(text, text, boolean) from public, anon, authenticated;
revoke all on function public.hash_get_room_extras(text, text, text) from public, anon, authenticated;

grant execute on function public.hash_host_save_summary(text, text, jsonb) to anon, authenticated;
grant execute on function public.hash_host_set_action_note(text, text, text, text) to anon, authenticated;
grant execute on function public.hash_host_lucky_pick(text, text, boolean) to anon, authenticated;
grant execute on function public.hash_get_room_extras(text, text, text) to anon, authenticated;

notify pgrst, 'reload schema';
