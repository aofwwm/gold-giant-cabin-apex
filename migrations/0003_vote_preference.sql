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
