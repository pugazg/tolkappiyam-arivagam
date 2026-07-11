"use client";
import { useState } from "react";
import { transliterate, TRANSLIT_LEGEND } from "@/lib/transliterate.ts";

type Props = {
  id: string;
  ariaLabel: string;
  initialRoman?: string;
  initialTamil?: string;
  onTamilChange?: (tamil: string) => void;
  name?: string; // when set, the underlying input participates in a form (submits Tamil)
  type?: string;
  placeholder?: string;
  big?: boolean;
  fullWidth?: boolean;
  compact?: boolean; // hide the typing-scheme legend (for search boxes)
};

// Reusable typing helper: with transliteration ON, you type in English (roman)
// and Tamil appears live in the field. Emits the Tamil string to the parent and,
// when `name` is set, submits the Tamil value with a surrounding form.
export function TranslitInput({
  id,
  ariaLabel,
  initialRoman = "",
  initialTamil = "",
  onTamilChange,
  name,
  type = "text",
  placeholder,
  big,
  fullWidth,
  compact,
}: Props) {
  const [enabled, setEnabled] = useState(!initialTamil);
  const [buf, setBuf] = useState(initialTamil || initialRoman);

  const shown = enabled ? transliterate(buf) : buf;

  function emit(nextBuf: string, nextEnabled: boolean) {
    setBuf(nextBuf);
    onTamilChange?.(nextEnabled ? transliterate(nextBuf) : nextBuf);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!enabled) return; // native editing in direct-Tamil mode
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      emit(buf.slice(0, -1), true);
    } else if (e.key === "Enter" || e.key === "Tab") {
      // let these behave normally (form submit, focus move)
    } else if (e.key.length === 1) {
      e.preventDefault();
      emit(buf + e.key, true);
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    if (!enabled) return;
    e.preventDefault();
    emit(buf + e.clipboardData.getData("text"), true);
  }

  function toggle(next: boolean) {
    if (next === enabled) return;
    const tamil = enabled ? transliterate(buf) : buf; // preserve Tamil across switch
    setEnabled(next);
    const nextBuf = next ? "" : tamil; // ON: fresh roman; OFF: keep Tamil, editable
    setBuf(nextBuf);
    onTamilChange?.(next ? "" : tamil);
  }

  return (
    <div style={fullWidth ? { width: "100%" } : undefined}>
      <div className="pill-row" style={{ marginBottom: "0.5rem" }}>
        <button type="button" className="chip" aria-pressed={enabled} style={{ cursor: "pointer", background: enabled ? "var(--accent-wash)" : undefined, color: enabled ? "var(--accent)" : undefined }} onClick={() => toggle(true)}>
          ஆங்கிலம் → தமிழ் (auto)
        </button>
        <button type="button" className="chip" aria-pressed={!enabled} style={{ cursor: "pointer", background: !enabled ? "var(--accent-wash)" : undefined, color: !enabled ? "var(--accent)" : undefined }} onClick={() => toggle(false)}>
          நேரடி தமிழ் (direct)
        </button>
      </div>
      <input
        id={id}
        name={name}
        type={type}
        aria-label={ariaLabel}
        className="field"
        style={{ maxWidth: fullWidth ? undefined : "22rem", width: fullWidth ? "100%" : undefined, fontSize: big ? "1.4rem" : "1.1rem", fontFamily: "var(--font-noto-serif-tamil), serif" }}
        value={shown}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onChange={(e) => { if (!enabled) emit(e.target.value, false); }}
        placeholder={placeholder ?? (enabled ? "type e.g. thamizh, uyir, vaNakkam" : "தமிழ் எழுத்து")}
        autoComplete="off"
        spellCheck={false}
      />
      {enabled && !compact && (
        <details style={{ marginTop: "0.6rem" }}>
          <summary className="muted" style={{ cursor: "pointer", fontSize: "0.85rem" }}>எழுத்து விசைத் திட்டம் · typing scheme</summary>
          <table className="data-table" style={{ marginTop: "0.5rem", maxWidth: "28rem" }}>
            <tbody>
              {TRANSLIT_LEGEND.map(([roman, tamil]) => (
                <tr key={roman}><td><code>{roman}</code></td><td className="tamil-serif" style={{ fontSize: "1.05rem" }}>{tamil}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="muted" style={{ fontSize: "0.78rem", marginTop: "0.4rem" }}>
            Capitals give retroflex/long letters: <code>T N R L</code> → ட ண ற ள, and <code>A I U E O</code> → long vowels.
            Deterministic helper, not a full keyboard.
          </p>
        </details>
      )}
      {enabled && compact && (
        <p className="muted" style={{ fontSize: "0.75rem", marginTop: "0.35rem" }}>
          ஆங்கிலத்தில் தட்டச்சு செய்யுங்கள் — தமிழாக மாறும் (e.g. <code>uyir</code> → உயிர்).
        </p>
      )}
    </div>
  );
}
