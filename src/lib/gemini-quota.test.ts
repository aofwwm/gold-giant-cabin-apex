import assert from "node:assert/strict";
import test from "node:test";
import { isConfirmedDailyQuota, quotaPauseMs } from "./gemini-quota.ts";

test("quota pause reads the retry-in phrase and the Retry-After header", () => {
  const pause = quotaPauseMs("Quota exceeded. Please retry in 10h37m52.5s.", null);
  assert.equal(pause, Math.round(((10 * 60 + 37) * 60 + 52.5) * 1000));
  assert.equal(isConfirmedDailyQuota("Quota exceeded. Please retry in 10h37m52.5s.", pause), true);
  assert.equal(quotaPauseMs("rate limit", "30"), 30_000);
  assert.equal(isConfirmedDailyQuota("rate limit", 30_000), false);
  assert.equal(quotaPauseMs("You exceeded your daily quota", null), 6 * 60 * 60 * 1000);
  assert.equal(isConfirmedDailyQuota("generate_content_free_tier_requests", 1_000), true);
  assert.equal(quotaPauseMs("unavailable", null), 60_000);
});
