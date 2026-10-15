import { t as noteCache } from "./provider-usage-CqiDrKv8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/travel-cache-BPZkLeXq.js
/** In-process cache and a small gate. Public travel servers are not unlimited. */
var TtlCache = class {
	rows = /* @__PURE__ */ new Map();
	ttlMs;
	max;
	channel;
	constructor(ttlMs, max = 200, channel = "") {
		this.ttlMs = ttlMs;
		this.max = max;
		this.channel = channel;
	}
	peek(key) {
		const row = this.rows.get(key);
		if (!row) return void 0;
		if (Date.now() - row.at > this.ttlMs) {
			this.rows.delete(key);
			return;
		}
		return row.value;
	}
	get(key) {
		const value = this.peek(key);
		if (this.channel) noteCache(this.channel, value !== void 0);
		return value;
	}
	set(key, value) {
		if (this.rows.size >= this.max) {
			const oldest = this.rows.keys().next().value;
			if (oldest) this.rows.delete(oldest);
		}
		this.rows.set(key, {
			at: Date.now(),
			value
		});
	}
	delete(key) {
		this.rows.delete(key);
	}
};
var RequestGate = class {
	stamps = [];
	limit;
	windowMs;
	constructor(limit, windowMs) {
		this.limit = limit;
		this.windowMs = windowMs;
	}
	allow(now = Date.now()) {
		this.stamps = this.stamps.filter((stamp) => now - stamp < this.windowMs);
		if (this.stamps.length >= this.limit) return false;
		this.stamps.push(now);
		return true;
	}
};
var pending = /* @__PURE__ */ new Map();
function shareRequest(key, run) {
	const existing = pending.get(key);
	if (existing) return existing;
	const job = run().finally(() => {
		if (pending.get(key) === job) pending.delete(key);
	});
	pending.set(key, job);
	return job;
}
//#endregion
export { TtlCache as n, shareRequest as r, RequestGate as t };
