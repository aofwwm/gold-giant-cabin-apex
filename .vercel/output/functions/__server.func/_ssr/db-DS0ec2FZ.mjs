//#region node_modules/.nitro/vite/services/ssr/assets/db-DS0ec2FZ.js
var _0002_kairos_default = "-- Kairos boards: unowned rows, anyone with the link can read and vote.\n-- Nicknames are public display handles on that link, not accounts.\n\ncreate table if not exists events (\n  id text primary key,\n  code text not null unique,\n  title text not null,\n  kind text not null check (kind in ('meeting', 'makan')),\n  duration_min integer not null check (duration_min in (30, 45, 60, 90, 120)),\n  category text not null default '',\n  anchor_at timestamptz,\n  oracle_text text not null default '',\n  oracle_source text not null default '',\n  oracle_at timestamptz,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists slots (\n  id text primary key,\n  event_id text not null references events (id) on delete cascade,\n  label text not null default '',\n  venue_note text not null default '',\n  starts_at timestamptz not null,\n  sort_order integer not null default 0,\n  cosmic_score integer not null,\n  yi text not null,\n  yi_note text not null,\n  ji text not null,\n  ji_note text not null,\n  tarot text not null,\n  tarot_note text not null,\n  zodiac text not null,\n  zodiac_note text not null,\n  boss text not null\n);\n\ncreate index if not exists slots_event_idx on slots (event_id, starts_at, sort_order);\n\ncreate table if not exists votes (\n  id text primary key,\n  slot_id text not null references slots (id) on delete cascade,\n  event_id text not null references events (id) on delete cascade,\n  nickname text not null,\n  nickname_key text not null,\n  choice text not null check (choice in ('yes', 'maybe', 'no')),\n  created_at timestamptz not null default now(),\n  unique (slot_id, nickname_key)\n);\n\ncreate index if not exists votes_event_idx on votes (event_id);\n\ncreate table if not exists comments (\n  id text primary key,\n  event_id text not null references events (id) on delete cascade,\n  nickname text not null,\n  body text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists comments_event_idx on comments (event_id, created_at);\n";
var _0003_vote_preference_default = "-- Preference votes: great / can / please-no / cannot. Legacy \"maybe\" folds into \"can\".\n\ndo $$\ndeclare\n  r record;\nbegin\n  for r in\n    select con.conname\n    from pg_constraint con\n    join pg_class rel on rel.oid = con.conrelid\n    where rel.relname = 'votes'\n      and con.contype = 'c'\n      and pg_get_constraintdef(con.oid) ilike '%choice%'\n  loop\n    execute format('alter table votes drop constraint %I', r.conname);\n  end loop;\nend $$;\n\nupdate votes set choice = 'yes' where choice = 'maybe';\n\nalter table votes add constraint votes_choice_check check (choice in ('love', 'yes', 'soft', 'no'));\n";
var _0004_kairos_intelligence_default = "-- Structured mission reading and cached explanations. No prompts, no emails.\n\ncreate table if not exists event_ai_context (\n  event_id text primary key references events (id) on delete cascade,\n  meeting_type text not null,\n  meeting_goal text not null,\n  stakes text not null check (stakes in ('low', 'medium', 'high')),\n  tone text not null,\n  preferred_conditions jsonb not null default '[]'::jsonb,\n  time_preferences jsonb not null default '{}'::jsonb,\n  suggested_duration_minutes integer not null,\n  summary text not null,\n  source text not null default 'rules',\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists kairos_results (\n  event_id text primary key references events (id) on delete cascade,\n  winning_slot_id text not null,\n  fingerprint text not null,\n  people_score integer not null,\n  moment_score integer not null,\n  cosmic_score integer not null,\n  kairos_score integer not null,\n  ai_headline text not null,\n  ai_reasoning jsonb not null,\n  ai_comment text not null,\n  backup_label text not null default '',\n  backup_reason text not null default '',\n  slot_lines jsonb not null default '[]'::jsonb,\n  source text not null default 'rules',\n  generated_at timestamptz not null default now()\n);\n\ncreate table if not exists cosmic_readings (\n  event_id text not null references events (id) on delete cascade,\n  slot_id text not null,\n  prose text not null,\n  source text not null,\n  generated_at timestamptz not null default now(),\n  primary key (event_id, slot_id)\n);\n";
var _0005_meeting_place_default = "-- Where a meeting happens, so makan and team out can start from a real place.\n\nalter table events add column if not exists format text not null default 'physical';\nalter table events add column if not exists venue_name text not null default '';\nalter table events add column if not exists room text not null default '';\nalter table events add column if not exists address text not null default '';\nalter table events add column if not exists platform text not null default '';\nalter table events add column if not exists meeting_url text not null default '';\nalter table events add column if not exists makan_when text not null default '';\n";
var _0006_dating_planner_token_default = "-- Dating invitations are stored in the linked Supabase project, not this app database.\n-- This file stays a no-op so `npm run build` does not look for that table here.\n-- The functions that store the private planner token are in\n-- supabase/0006_dating_planner_token.sql and run on that Supabase project.\nselect 1;\n";
var _0007_hash_it_out_default = "-- Hash It Out rooms. Shareable codes, no accounts.\n-- The host token is stored only as a hash. Anonymous rows store no name.\n\ncreate table if not exists hash_sessions (\n  id text primary key,\n  code text not null unique,\n  host_token_hash text not null,\n  prompt text not null,\n  context text not null default '',\n  starter text not null default 'custom',\n  identity_mode text not null default 'choice' check (identity_mode in ('anonymous', 'named', 'choice')),\n  show_live_board boolean not null default true,\n  blind_round boolean not null default false,\n  revealed boolean not null default true,\n  voting_enabled boolean not null default false,\n  vote_limit integer not null default 3 check (vote_limit in (1, 3)),\n  cosmic_enabled boolean not null default false,\n  status text not null default 'open' check (status in ('open', 'paused', 'voting', 'closed')),\n  lucky_cluster_id text not null default '',\n  synthesis text not null default '',\n  llm_calls integer not null default 0,\n  auto_llm integer not null default 0,\n  last_collate_at timestamptz,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists hash_participants (\n  id text primary key,\n  session_id text not null references hash_sessions (id) on delete cascade,\n  token_hash text not null,\n  display_name text not null default '',\n  anonymous boolean not null default true,\n  created_at timestamptz not null default now(),\n  unique (session_id, token_hash)\n);\n\ncreate table if not exists hash_clusters (\n  id text primary key,\n  session_id text not null references hash_sessions (id) on delete cascade,\n  title text not null,\n  summary text not null default '',\n  pinned boolean not null default false,\n  hidden boolean not null default false,\n  user_locked boolean not null default false,\n  source text not null default 'rules' check (source in ('rules', 'ai', 'facilitator')),\n  action_kind text not null default '' check (action_kind in ('', 'action', 'park', 'discuss', 'decide')),\n  action_note text not null default '',\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists hash_submissions (\n  id text primary key,\n  session_id text not null references hash_sessions (id) on delete cascade,\n  participant_id text references hash_participants (id) on delete set null,\n  anonymous boolean not null default true,\n  display_name text not null default '',\n  body text not null,\n  cluster_id text references hash_clusters (id) on delete set null,\n  hidden boolean not null default false,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists hash_submissions_session_idx on hash_submissions (session_id, created_at);\ncreate index if not exists hash_clusters_session_idx on hash_clusters (session_id);\n\ncreate table if not exists hash_separations (\n  session_id text not null references hash_sessions (id) on delete cascade,\n  left_id text not null,\n  right_id text not null,\n  primary key (session_id, left_id, right_id)\n);\n\ncreate table if not exists hash_supports (\n  id text primary key,\n  session_id text not null references hash_sessions (id) on delete cascade,\n  cluster_id text not null references hash_clusters (id) on delete cascade,\n  participant_id text not null references hash_participants (id) on delete cascade,\n  created_at timestamptz not null default now(),\n  unique (cluster_id, participant_id)\n);\n\ncreate table if not exists hash_votes (\n  id text primary key,\n  session_id text not null references hash_sessions (id) on delete cascade,\n  cluster_id text not null references hash_clusters (id) on delete cascade,\n  participant_id text not null references hash_participants (id) on delete cascade,\n  created_at timestamptz not null default now(),\n  unique (cluster_id, participant_id)\n);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_kairos.sql": _0002_kairos_default,
			"/migrations/0003_vote_preference.sql": _0003_vote_preference_default,
			"/migrations/0004_kairos_intelligence.sql": _0004_kairos_intelligence_default,
			"/migrations/0005_meeting_place.sql": _0005_meeting_place_default,
			"/migrations/0006_dating_planner_token.sql": _0006_dating_planner_token_default,
			"/migrations/0007_hash_it_out.sql": _0007_hash_it_out_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
//#endregion
export { getSql as t };
