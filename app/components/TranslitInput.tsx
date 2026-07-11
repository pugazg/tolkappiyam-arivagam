"use client";
import { useState } from "react";
import { transliterate, TRANSLIT_LEGEND } from "@/lib/transliterate.ts";

type Props = {
  id: string;
  ariaLabel: string;
  initialRoman?: string;
  onTamilChange: (tamil: string) => void;
  big?: boolean;
};

// A small typing helper: with transliteration ON, you type in English (roman)
// and Tamil appears live in the field. It emits the Tamil string to the parent.
export function TranslitInput({ id, ariaLabel, initialRoman = "", onTamilChange, big }: Props) {
  const [enabled, setEnabled] = useState(true);
  const [buf, setBuf] = useState(initialRoman); // roman while enabled, Tamil while disabled

  const shown = enabled ? transliterate(buf) : buf;

  function emit(nextBuf: string, nextEnabled: boolean) {
    setBuf(nextBuf);
    onTamilChange(nextEnabled ? transliterate(nextBuf) : nextBuf);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!enabled) return; // native editing in Tamil mode
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      emit(buf.slice(0, -1), true);
    } else if (e.key === "Enter" || e.key === "Tab") {
      // let these behave normally
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
    // preserve the Tamil text across the switch
    const tamil = enabled ? transliterate(buf) : buf;
    setEnabled(next);
    const nextBuf = next ? "" : tamil; // ON: start fresh roman; OFF: keep Tamil, editable
    setBuf(nextBuf);
    onTamilChange(next ? "" : tamil);
  }

  return (
    <div>
      <div className="pill-row" style={{ marginBottom: "0.6rem" }}>
        <button type="button" className="chip" aria-pressed={enabled} style={{ cursor: "pointer", background: enabled ? "var(--accent-wash)" : undefined, color: enabled ? "var(--accent)" : undefined }} onClick={() => toggle(true)}>
          ஆங்கிலம் → தமிழ் (auto)
        </button>
        <button type="button" className="chip" aria-pressed={!enabled} style={{ cursor: "pointer", background: !enabled ? "var(--accent-wash)" : undefined, color: !enabled ? "var(--accent)" : undefined }} onClick={() => toggle(false)}>
          நேரடி தமிழ் (direct)
        </button>
      </div>
      <input
        id={id}
        aria-label={ariaLabel}
        className="field"
        style={{ maxWidth: "22rem", fontSize: big ? "1.4rem" : "1.2rem", fontFamily: "var(--font-noto-serif-tamil), serif" }}
        value={shown}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onChange={(e) => { if (!enabled) emit(e.target.value, false); }}
        placeholder={enabled ? "type e.g. thamizh, ki, vaNakkam" : "தமிழ் எழுத்து"}
        autoComplete="off"
        spellCheck={false}
      />
      {enabled && (
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
    </div>
  );
}
