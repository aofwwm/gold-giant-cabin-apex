import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-8H4AJuhK.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-BKxuSUOP.js
var supabase_BKxuSUOP_exports = /* @__PURE__ */ __exportAll({
	n: () => supabaseConfigured,
	r: () => supabase_exports,
	t: () => getSupabase
});
var supabase_exports = /* @__PURE__ */ __exportAll$1({
	getSupabase: () => getSupabase,
	supabaseConfigured: () => supabaseConfigured
});
var client = null;
function supabaseConfigured() {
	return Boolean("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZm16bmJnbnlodW1nd3dlc3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NDA0NTQsImV4cCI6MjEwNjUxNjQ1NH0.BdJnQY2gDTOm9vn9DeeTMH4KtPLbwPSQpWEUO_NK54I");
}
/** Anon client. The key stays in the environment, never in this file. */
function getSupabase() {
	const url = "https://eafmznbgnyhumgwweszt.supabase.co";
	const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZm16bmJnbnlodW1nd3dlc3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NDA0NTQsImV4cCI6MjEwNjUxNjQ1NH0.BdJnQY2gDTOm9vn9DeeTMH4KtPLbwPSQpWEUO_NK54I";
	if (!client) client = createClient(url, anonKey, { auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false
	} });
	return client;
}
//#endregion
export { supabaseConfigured as n, supabase_BKxuSUOP_exports as r, getSupabase as t };
