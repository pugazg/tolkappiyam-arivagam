"use client";
import { useState } from "react";
import { Bi } from "@/app/components/Bi";
import { classifyTamilInput } from "@/lib/tamil.ts";
import { analyzeMatra, formatMatra } from "@/lib/matra.ts";
import { TranslitInput } from "./TranslitInput";

export function LetterClassifier() {
  const [value, setValue] = useState("கி");
  const c = classifyTamilInput(value);
  const graphemes = c.graphemes;
  return (
    <div>
      <label htmlFor="cls" className="eyebrow">தமிழ் எழுத்தை உள்ளிடுக · type a Tamil letter</label>
      <TranslitInput id="cls" ariaLabel="Tamil letter to classify" initialRoman="ki" onTamilChange={setValue} big />

      {graphemes.length > 1 ? (
        <div style={{ marginTop: "1.25rem" }}>
          <p className="muted">பல எழுத்துகள் — ஒவ்வொன்றாக:</p>
          <table className="data-table">
            <thead><tr><th>எழுத்து</th><th>வகை</th><th>அளவு/இனம்</th><th>Unicode</th></tr></thead>
            <tbody>
              {graphemes.map((g, i) => {
                const gc = classifyTamilInput(g);
                return <tr key={i}><td className="tamil-serif" style={{ fontSize: "1.2rem" }}>{g}</td><td>{gc.category}</td><td>{[gc.vowelLength, gc.consonantClass].filter(Boolean).join(" · ") || "—"}</td><td><code style={{ fontSize: "0.75rem" }}>{gc.codePoints.join(" ")}</code></td></tr>;
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ marginTop: "1.25rem", maxWidth: "34rem" }}>
          <dl className="kv">
            <dt><Bi ta="தமிழ்?" en="Tamil?" /></dt><dd><Bi ta={c.recognizedTamil ? "ஆம்" : "இல்லை"} en={c.recognizedTamil ? "Yes" : "No"} /></dd>
            <dt>வகை</dt><dd>{c.category}</dd>
            <dt>Unicode</dt><dd><code>{c.codePoints.join(" ") || "—"}</code></dd>
            {c.baseLetter && (<><dt>அடிஎழுத்து</dt><dd>{c.baseLetter}</dd></>)}
            {c.consonantComponent && (<><dt>மெய் கூறு</dt><dd>{c.consonantComponent}</dd></>)}
            {c.vowelComponent && (<><dt>உயிர் கூறு</dt><dd>{c.vowelComponent}</dd></>)}
            {c.vowelLength && (<><dt>குறில்/நெடில்</dt><dd>{c.vowelLength}</dd></>)}
            {c.consonantClass && (<><dt>இனம்</dt><dd>{c.consonantClass}</dd></>)}
            <dt><Bi ta="மாத்திரை (பெயரளவு)" en="மாத்திரை (nominal)" /></dt><dd>{analyzeMatra(value).parts.map((p) => formatMatra(p.nominal)).join(", ") || "—"}</dd>
          </dl>
          <p className="muted" style={{ fontSize: "0.82rem", marginTop: "0.75rem" }}>{c.note}</p>
        </div>
      )}
      <div className="notice" style={{ marginTop: "1.25rem" }}>
        <Bi ta="Unicode grapheme பிரிப்பின் மூலம் Grantha எழுத்துகள், எண்கள், Latin, emoji, இணை வரிசைகளையும் கையாளும் — எளிய string indexing அல்ல. மூல மேற்கோள்கள் சரிபார்க்கப்பட்டால் மட்டுமே காட்டப்படும்." en="Handles Grantha letters, numerals, Latin, emoji, and combining sequences via Unicode-aware grapheme segmentation — not naive string indexing. Source references are shown only when verified." />
      </div>
    </div>
  );
}
