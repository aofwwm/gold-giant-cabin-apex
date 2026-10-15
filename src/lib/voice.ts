const BANNED = /soulmate|destiny|eternal love|\bfated\b|true love|meant to be/i;

export function clipVoice(text: string, max = 20): string {
  const clean = text.replace(/[“”]/g, "").replace(/\s+/g, " ").trim();
  if (!clean || BANNED.test(clean)) return "";
  const words = clean.split(" ").filter(Boolean);
  const cut = words.slice(0, max).join(" ");
  if (!cut) return "";
  if (words.length <= max || /[.!?]$/.test(cut)) return cut;
  return `${cut.replace(/[,:;]$/, "")}.`;
}
