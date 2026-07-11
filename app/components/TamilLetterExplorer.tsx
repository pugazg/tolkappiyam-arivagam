"use client";
import { useState } from "react";
import {
  UYIR, KURIL, NEDIL, MEY, VALLINAM, MELLINAM, IDAIYINAM, AYTHAM,
  buildUyirmeiGrid, classifyTamilInput, codePointLabel,
} from "@/lib/tamil.ts";

const grid = buildUyirmeiGrid();

function Detail({ letter }: { letter: string }) {
  const c = classifyTamilInput(letter);
  return (
    <div className="card" style={{ position: "sticky", top: "5rem" }}>
      <div className="tamil-serif" style={{ fontSize: "3rem", lineHeight: 1, color: "var(--accent)" }}>{letter}</div>
      <dl className="kv" style={{ marginTop: "1rem" }}>
        <dt>வகை</dt><dd>{c.category}</dd>
        <dt>Unicode</dt><dd><code>{codePointLabel(letter)}</code></dd>
        {c.consonantComponent && (<><dt>மெய்</dt><dd>{c.consonantComponent}</dd></>)}
        {c.vowelComponent && (<><dt>உயிர்</dt><dd>{c.vowelComponent}</dd></>)}
        {c.vowelLength && (<><dt>அளவு</dt><dd>{c.vowelLength}</dd></>)}
        {c.consonantClass && (<><dt>இனம்</dt><dd>{c.consonantClass}</dd></>)}
      </dl>
      <div className="placeholder" style={{ marginTop: "1rem" }}>
        <p style={{ margin: "0 0 0.3rem", fontSize: "0.85rem" }}><strong>உச்சரிப்பு:</strong> விரைவில் சேர்க்கப்படும்.</p>
        <p style={{ margin: 0, fontSize: "0.85rem" }}>Pronunciation audio and verified நூற்பா links are an editorial layer, added after review.</p>
      </div>
      <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.75rem" }}>
        This is a modern pedagogical classification computed from Unicode. It is not automatically
        attributed to any specific நூற்பா.
      </p>
    </div>
  );
}

function Row({ title, subtitle, letters, onPick, active }: { title: string; subtitle: string; letters: string[]; onPick: (l: string) => void; active: string }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ margin: "0 0 0.15rem", fontSize: "1.1rem" }}>{title}</h3>
      <p className="muted" style={{ fontSize: "0.82rem", margin: "0 0 0.6rem" }}>{subtitle}</p>
      <div className="pill-row">
        {letters.map((l) => (
          <button key={l} className="letter-cell" style={{ width: "3.2rem" }} aria-pressed={active === l} onClick={() => onPick(l)}>{l}</button>
        ))}
      </div>
    </div>
  );
}

export function TamilLetterExplorer() {
  const [active, setActive] = useState("அ");
  const [showGrid, setShowGrid] = useState(false);
  return (
    <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr", gap: "2rem", alignItems: "start" }}>
      <div>
        <Row title="உயிரெழுத்துகள் (12)" subtitle="குறில் 5 · நெடில் 7 — the vowels." letters={UYIR} onPick={setActive} active={active} />
        <div className="grid grid-2" style={{ marginBottom: "1.5rem" }}>
          <div><p className="muted" style={{ fontSize: "0.82rem", margin: "0 0 0.4rem" }}>குறில் (short)</p><div className="pill-row">{KURIL.map((l) => <button key={l} className="letter-cell" style={{ width: "3rem" }} aria-pressed={active === l} onClick={() => setActive(l)}>{l}</button>)}</div></div>
          <div><p className="muted" style={{ fontSize: "0.82rem", margin: "0 0 0.4rem" }}>நெடில் (long)</p><div className="pill-row">{NEDIL.map((l) => <button key={l} className="letter-cell" style={{ width: "3rem" }} aria-pressed={active === l} onClick={() => setActive(l)}>{l}</button>)}</div></div>
        </div>
        <Row title="மெய்யெழுத்துகள் (18)" subtitle="Consonants, each marked with புள்ளி." letters={MEY} onPick={setActive} active={active} />
        <div className="grid grid-3" style={{ marginBottom: "1.5rem" }}>
          <div><p className="muted" style={{ fontSize: "0.8rem", margin: "0 0 0.4rem" }}>வல்லினம்</p><div className="pill-row">{VALLINAM.map((l) => <button key={l} className="letter-cell" style={{ width: "2.8rem" }} aria-pressed={active === l} onClick={() => setActive(l)}>{l}</button>)}</div></div>
          <div><p className="muted" style={{ fontSize: "0.8rem", margin: "0 0 0.4rem" }}>மெல்லினம்</p><div className="pill-row">{MELLINAM.map((l) => <button key={l} className="letter-cell" style={{ width: "2.8rem" }} aria-pressed={active === l} onClick={() => setActive(l)}>{l}</button>)}</div></div>
          <div><p className="muted" style={{ fontSize: "0.8rem", margin: "0 0 0.4rem" }}>இடையினம்</p><div className="pill-row">{IDAIYINAM.map((l) => <button key={l} className="letter-cell" style={{ width: "2.8rem" }} aria-pressed={active === l} onClick={() => setActive(l)}>{l}</button>)}</div></div>
        </div>
        <Row title="ஆய்த எழுத்து" subtitle="The special letter ஃ." letters={[AYTHAM]} onPick={setActive} active={active} />

        <button className="btn btn-ghost" onClick={() => setShowGrid((v) => !v)} aria-expanded={showGrid}>
          {showGrid ? "உயிர்மெய் அட்டவணையை மறை" : "உயிர்மெய் அட்டவணையைக் காட்டு (18 × 12)"}
        </button>
        {showGrid && (
          <div style={{ overflowX: "auto", marginTop: "1rem" }}>
            <table className="data-table">
              <tbody>
                {grid.map((row) => (
                  <tr key={row.base}>
                    <th scope="row" className="tamil-serif">{row.mey}</th>
                    {row.letters.map((cell) => (
                      <td key={cell.letter}>
                        <button className="letter-cell" style={{ width: "2.5rem", fontSize: "1.1rem" }} aria-pressed={active === cell.letter} onClick={() => setActive(cell.letter)}>{cell.letter}</button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Detail letter={active} />
    </div>
  );
}
