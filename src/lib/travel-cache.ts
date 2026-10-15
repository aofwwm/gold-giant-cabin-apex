/** In-process cache and a small gate. Public travel servers are not unlimited. */

import { noteCache, type UsageChannel } from "@/lib/provider-usage";

export class TtlCache<T> {
  private readonly rows = new Map<string, { at: number; value: T }>();
  private readonly ttlMs: number;
  private readonly max: number;
  private readonly channel: UsageChannel | "";

  constructor(ttlMs: number, max = 200, channel: UsageChannel | "" = "") {
    this.ttlMs = ttlMs;
    this.max = max;
    this.channel = channel;
  }

  peek(key: string): T | undefined {
    const row = this.rows.get(key);
    if (!row) return undefined;
    if (Date.now() - row.at > this.ttlMs) {
      this.rows.delete(key);
      return undefined;
    }
    return row.value;
  }

  get(key: string): T | undefined {
    const value = this.peek(key);
    if (this.channel) noteCache(this.channel, value !== undefined);
    return value;
  }

  set(key: string, value: T): void {
    if (this.rows.size >= this.max) {
      const oldest = this.rows.keys().next().value;
      if (oldest) this.rows.delete(oldest);
    }
    this.rows.set(key, { at: Date.now(), value });
  }

  delete(key: string): void {
    this.rows.delete(key);
  }
}

export class RequestGate {
  private stamps: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  allow(now = Date.now()): boolean {
    this.stamps = this.stamps.filter((stamp) => now - stamp < this.windowMs);
    if (this.stamps.length >= this.limit) return false;
    this.stamps.push(now);
    return true;
  }
}

const pending = new Map<string, Promise<unknown>>();

export function shareRequest<T>(key: string, run: () => Promise<T>): Promise<T> {
  const existing = pending.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const job = run().finally(() => {
    if (pending.get(key) === job) pending.delete(key);
  });
  pending.set(key, job);
  return job;
}
