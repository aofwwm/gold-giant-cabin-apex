-- Two-link Dating invitations. Run this on the Kairos Supabase project.
-- Recipient token: invite_slug → /date/:inviteSlug
-- Planner token: planner_token → /date/manage/:plannerToken
-- RLS stays enabled. Anonymous roles do not get table UPDATE.

alter table public.dating_invitations add column if not exists planner_token text;
alter table public.dating_invitations add column if not exists recipient_note text not null default '';
alter table public.dating_invitations add column if not exists updated_at timestamptz not null default now();

create unique index if not exists dating_invitations_planner_token_key
  on public.dating_invitations (planner_token)
  where planner_token is not null;

-- Allow revoke without widening who can update the table.
do $$
declare
  rec record;
begin
  for rec in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'dating_invitations'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%status%'
      and pg_get_constraintdef(con.oid) not ilike '%revoked%'
  loop
    execute format('alter table public.dating_invitations drop constraint %I', rec.conname);
  end loop;

  if not exists (
    select 1
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'dating_invitations'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%status%'
  ) then
    alter table public.dating_invitations
      add constraint dating_invitations_status_check
      check (status in ('pending', 'sounds_good', 'alternate_time_requested', 'revoked'));
  end if;
end $$;

do $$
declare sig regprocedure;
begin
  for sig in
    select p.oid::regprocedure
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'create_dating_invitation',
        'get_dating_invitation',
        'respond_to_dating_invitation',
        'get_dating_invitation_for_planner',
        'revoke_dating_invitation'
      )
  loop
    execute 'drop function ' || sig;
  end loop;
end $$;

create function public.create_dating_invitation(
  p_invite_slug text,
  p_planner_token text,
  p_recipient_name text,
  p_title text,
  p_message text,
  p_tone text,
  p_visibility text,
  p_public_payload jsonb
) returns table (invite_slug text, planner_token text, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_payload jsonb;
begin
  if p_invite_slug is null or p_invite_slug !~ '^[A-Za-z0-9]{8,16}$' then
    raise exception 'invalid slug';
  end if;
  if p_planner_token is null or p_planner_token !~ '^[A-Za-z0-9]{8,16}$' then
    raise exception 'invalid planner token';
  end if;
  if p_invite_slug = p_planner_token then
    raise exception 'invalid planner token';
  end if;
  if p_visibility not in ('full_plan', 'first_stop', 'mystery') then
    raise exception 'Invalid invitation visibility';
  end if;
  clean_payload := coalesce(p_public_payload, '{}'::jsonb)
    - 'plannerToken' - 'planner_token' - 'editToken';
  insert into public.dating_invitations (
    invite_slug, planner_token, recipient_name, title, message, tone, visibility, status, public_payload, recipient_note, updated_at
  ) values (
    p_invite_slug,
    p_planner_token,
    left(coalesce(p_recipient_name, ''), 40),
    left(coalesce(p_title, ''), 80),
    left(coalesce(p_message, ''), 280),
    coalesce(nullif(p_tone, ''), 'warm'),
    p_visibility,
    'pending',
    clean_payload,
    '',
    now()
  );
  return query select p_invite_slug, p_planner_token, 'pending'::text;
end;
$$;

create function public.get_dating_invitation(p_invite_slug text)
returns table (
  invite_slug text,
  recipient_name text,
  title text,
  message text,
  tone text,
  visibility text,
  status text,
  recipient_note text,
  public_payload jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    row.invite_slug,
    row.recipient_name,
    row.title,
    row.message,
    row.tone,
    row.visibility,
    row.status,
    row.recipient_note,
    row.public_payload - 'plannerToken' - 'planner_token' - 'editToken',
    row.created_at,
    row.updated_at
  from public.dating_invitations as row
  where row.invite_slug = p_invite_slug
    and row.status is distinct from 'revoked';
$$;

create function public.respond_to_dating_invitation(
  p_invite_slug text,
  p_response text,
  p_note text
) returns table (invite_slug text, status text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_response not in ('sounds_good', 'alternate_time_requested') then
    raise exception 'Invalid invitation response';
  end if;
  update public.dating_invitations as row
  set
    status = p_response,
    recipient_note = left(coalesce(p_note, row.recipient_note, ''), 280),
    updated_at = now()
  where row.invite_slug = p_invite_slug
    and row.status is distinct from 'revoked';
  if not found then
    raise exception 'Invitation was not updated';
  end if;
  return query
    select row.invite_slug, row.status
    from public.dating_invitations as row
    where row.invite_slug = p_invite_slug;
end;
$$;

create function public.get_dating_invitation_for_planner(p_planner_token text)
returns table (
  invite_slug text,
  recipient_name text,
  title text,
  message text,
  status text,
  recipient_note text,
  visibility text,
  public_payload jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    row.invite_slug,
    row.recipient_name,
    row.title,
    row.message,
    row.status,
    row.recipient_note,
    row.visibility,
    row.public_payload - 'plannerToken' - 'planner_token' - 'editToken',
    row.created_at,
    row.updated_at
  from public.dating_invitations as row
  where row.planner_token = p_planner_token
    and p_planner_token ~ '^[A-Za-z0-9]{8,16}$';
$$;

create function public.revoke_dating_invitation(p_planner_token text)
returns table (invite_slug text, status text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_planner_token is null or p_planner_token !~ '^[A-Za-z0-9]{8,16}$' then
    raise exception 'invalid planner token';
  end if;
  update public.dating_invitations as row
  set status = 'revoked', updated_at = now()
  where row.planner_token = p_planner_token
    and row.status is distinct from 'revoked';
  if not found then
    raise exception 'Invitation was not revoked';
  end if;
  return query
    select row.invite_slug, row.status
    from public.dating_invitations as row
    where row.planner_token = p_planner_token;
end;
$$;

revoke all on function public.create_dating_invitation(text, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.get_dating_invitation(text) from public, anon, authenticated;
revoke all on function public.respond_to_dating_invitation(text, text, text) from public, anon, authenticated;
revoke all on function public.get_dating_invitation_for_planner(text) from public, anon, authenticated;
revoke all on function public.revoke_dating_invitation(text) from public, anon, authenticated;

grant execute on function public.create_dating_invitation(text, text, text, text, text, text, text, jsonb) to anon, authenticated;
grant execute on function public.get_dating_invitation(text) to anon, authenticated;
grant execute on function public.respond_to_dating_invitation(text, text, text) to anon, authenticated;
grant execute on function public.get_dating_invitation_for_planner(text) to anon, authenticated;
grant execute on function public.revoke_dating_invitation(text) to anon, authenticated;

notify pgrst, 'reload schema';
