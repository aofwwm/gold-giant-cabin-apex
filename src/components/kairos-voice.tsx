import { Clock, CloudRain, Sun } from "lucide-react";
import { clipVoice } from "@/lib/voice";

export type VoiceMode = "dating" | "family" | "meet" | "makan" | "out" | "today" | "travel" | "oracle";
export type VoiceStatus = "good" | "neutral" | "warning";

export function KairosVoice({
  mode,
  text,
  status = "neutral",
  mark,
  label,
}: {
  mode: VoiceMode;
  text: string;
  status?: VoiceStatus;
  mark?: string;
  label?: string;
}) {
  const line = clipVoice(text);
  if (!line) return null;
  const voice = mode === "dating" ? "dating" : mode === "family" ? "family" : mode === "today" ? "today" : mode === "travel" ? "travel" : mode === "oracle" ? "oracle" : "work";
  const heading = label ?? (mode === "dating" ? "月老 says" : mode === "oracle" ? "神婆 says" : mode === "today" ? "Kairos · Today" : "Kairos says");
  const seal = mode === "dating" && (mark || status === "good") ? mark || "吉" : mode !== "dating" ? mark : "";

  return (
    <figure key={line} className="kairos-voice" data-voice={voice} data-status={status}>
      {voice === "dating" || voice === "oracle" ? <span className="kairos-voice__thread" aria-hidden /> : null}
      <figcaption className="kairos-voice__label">
        <span>{heading}</span>
        {voice === "family" && status === "good" ? <Sun className="kairos-voice__glyph" aria-hidden /> : null}
        {voice === "family" && status === "warning" ? <CloudRain className="kairos-voice__glyph" aria-hidden /> : null}
        {voice === "today" ? <Clock className="kairos-voice__glyph" aria-hidden /> : null}
        {voice === "oracle" ? <span className="kairos-voice__orb" aria-hidden /> : null}
        {seal ? <span className="kairos-voice__seal">{seal}</span> : null}
      </figcaption>
      <span className="kairos-voice__rule" aria-hidden />
      <blockquote className="kairos-voice__quote">{line}</blockquote>
    </figure>
  );
}
