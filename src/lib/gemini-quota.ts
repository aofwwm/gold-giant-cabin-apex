/** How long a 429 should keep a model out of the retry loop. No network. */

export function quotaPauseMs(message: string, retryAfter: string | null): number {
  const match = /retry in\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+(?:\.\d+)?)s)?/i.exec(message);
  if (match && (match[1] || match[2] || match[3])) {
    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const seconds = Number(match[3] || 0);
    return Math.round(((hours * 60 + minutes) * 60 + seconds) * 1000);
  }
  const header = Number(retryAfter);
  if (retryAfter && Number.isFinite(header) && header >= 0) return Math.min(header * 1000, 24 * 60 * 60 * 1000);
  if (/quota|resource_exhausted|daily/i.test(message)) return 6 * 60 * 60 * 1000;
  return 60_000;
}

export function isConfirmedDailyQuota(message: string, pauseMs: number): boolean {
  return pauseMs >= 30 * 60 * 1000 || /generate_content_free_tier|per day|daily quota/i.test(message);
}
