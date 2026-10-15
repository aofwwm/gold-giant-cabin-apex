-- Dating invitations are stored in the linked Supabase project, not this app database.
-- This file stays a no-op so `npm run build` does not look for that table here.
-- The functions that store the private planner token are in
-- supabase/0006_dating_planner_token.sql and run on that Supabase project.
select 1;
