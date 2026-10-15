-- Where a meeting happens, so makan and team out can start from a real place.

alter table events add column if not exists format text not null default 'physical';
alter table events add column if not exists venue_name text not null default '';
alter table events add column if not exists room text not null default '';
alter table events add column if not exists address text not null default '';
alter table events add column if not exists platform text not null default '';
alter table events add column if not exists meeting_url text not null default '';
alter table events add column if not exists makan_when text not null default '';
