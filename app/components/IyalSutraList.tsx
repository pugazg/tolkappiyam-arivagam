"use client";
import Link from "next/link";
import { Bi } from "@/app/components/Bi";
import { useMemo, useState } from "react";
import type { SutraRecord } from "@/lib/types.ts";
import { useUiLang } from "@/lib/useUiLang.ts";
import { TranslitInput } from "./TranslitInput";

export function IyalSutraList({ sutras }: { sutras: SutraRecord[] }) {
  const lang = useUiLang();
  const [q, setQ] = useState("");
  const [concept, setConcept] = useState<string | null>(null);

  const concepts = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sutras) for (const c of s.concepts) m.set(c, (m.get(c) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
  }, [sutras]);

  const filtered = useMemo(() => {
    const nq = q.normalize("NFC").toLocaleLowerCase("ta").trim();
    return sutras.filter((s) => {
      if (concept && !s.concepts.includes(concept)) return false;
      if (!nq) return true;
      return (
        s.originalText.normalize("NFC").toLocaleLowerCase("ta").includes(nq) ||
        s.displayNumber === nq ||
        s.id.includes(nq)
      );
    });
  }, [sutras, q, concept]);

  return (
    <div>
      <div style={{ margin: "1rem 0" }}>
        <TranslitInput
          id="iyal-search"
          ariaLabel={lang === "en" ? "Search within this chapter" : "இந்த இயலில் தேடுக"}
          placeholder={lang === "en" ? "Search within this chapter… (type in English too)" : "இந்த இயலில் தேடுக… (ஆங்கிலத்திலும் தட்டச்சு செய்யலாம்)"}
          compact
          onTamilChange={setQ}
        />
        <span className="muted" style={{ fontSize: "0.9rem", display: "block", marginTop: "0.4rem" }}>{filtered.length} / {sutras.length}</span>
      </div>
      {concepts.length > 0 && (
        <div className="pill-row" style={{ marginBottom: "1rem" }}>
          <button className="chip" style={{ cursor: "pointer", background: concept === null ? "var(--accent-wash)" : undefined }} onClick={() => setConcept(null)}><Bi ta="அனைத்தும்" en="All" /></button>
          {concepts.map(([c, n]) => (
            <button key={c} className="chip" style={{ cursor: "pointer", background: concept === c ? "var(--accent-wash)" : undefined, color: concept === c ? "var(--accent)" : undefined }} onClick={() => setConcept(concept === c ? null : c)}>
              {c} <span className="muted">{n}</span>
            </button>
          ))}
        </div>
      )}
      <p className="muted" style={{ fontSize: "0.82rem", borderLeft: "3px solid var(--line-strong)", paddingLeft: "0.75rem", margin: "0 0 0.5rem" }}>
        <Bi
          ta="கீழே உள்ள நூற்பாக்கள் மூலத் தமிழில் உள்ளன. ஆங்கில விளக்கம்/மொழிபெயர்ப்பு பதிப்பாசிரிய அடுக்கு — சரிபார்க்கப்பட்ட பிறகு சேர்க்கப்படும்."
          en="The நூற்பாக்கள் below are shown in the original Tamil source. English translations/explanations are an editorial layer, added only after verification — the source text is never machine-translated."
        />
      </p>
      <div>
        {filtered.map((s) => (
          <Link key={s.id} href={`/sutra/${s.id}`} className="sutra-item" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="sutra-num">{s.displayNumber}</span>
            <span className="st">{s.originalLines.join(" ")}</span>
          </Link>
        ))}
        {filtered.length === 0 && <p className="muted" style={{ padding: "1rem 0" }}><Bi ta="பொருந்தும் நூற்பா இல்லை. வேறு சொல்லை முயற்சிக்கவும்." en="No matching aphorism. Try another word." /></p>}
      </div>
    </div>
  );
}
