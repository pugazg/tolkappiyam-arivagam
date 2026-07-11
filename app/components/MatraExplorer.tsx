"use client";
import Link from "next/link";
import { useState } from "react";
import { analyzeMatra, formatMatra } from "@/lib/matra.ts";
import { Bi } from "@/app/components/Bi";
import { TranslitInput } from "./TranslitInput";

const confBadge: Record<string, string> = {
  high: "badge-high",
  medium: "badge-medium",
  "needs-review": "badge-low",
};
const confLabel: Record<string, [string, string]> = {
  high: ["உயர்", "high"],
  medium: ["இடை", "medium"],
  "needs-review": ["ஆய்வு தேவை", "needs review"],
};

export function MatraExplorer() {
  const [value, setValue] = useState("வீடு");
  const a = analyzeMatra(value);
  const appliedRules = a.parts.filter((p) => p.rule && p.contextual !== p.nominal);

  return (
    <div>
      <label htmlFor="matra" className="eyebrow">தமிழ்ச் சொல்லை உள்ளிடுக · type a Tamil word</label>
      <TranslitInput id="matra" ariaLabel="Tamil word for matra analysis" initialRoman="vIDu" onTamilChange={setValue} />

      {appliedRules.length > 0 && (
        <div className="notice notice-accent" style={{ marginTop: "1.25rem" }}>
          <Bi ta="சூழல் விதி பயன்படுத்தப்பட்டது" en="Contextual rule applied" />:{" "}
          {appliedRules.map((p, i) => (
            <span key={i}><strong>{p.rule}</strong>{i < appliedRules.length - 1 ? ", " : ""}</span>
          ))}
        </div>
      )}

      <div className="matra-result" style={{ overflowX: "auto", marginTop: "1.25rem" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th><Bi ta="பகுதி" en="Part" /></th>
              <th><Bi ta="வகை" en="Category" /></th>
              <th><Bi ta="அடி · உயிர்" en="Base · vowel" /></th>
              <th style={{ textAlign: "right" }}><Bi ta="பெயரளவு" en="Nominal letter value" /></th>
              <th style={{ textAlign: "right" }}><Bi ta="சூழல் மதிப்பு" en="Contextual மாத்திரை value" /></th>
              <th><Bi ta="விதி · குறிப்பு" en="Rule · note" /></th>
            </tr>
          </thead>
          <tbody>
            {a.parts.map((p, i) => (
              <tr key={i}>
                <td className="tamil-serif matra-grapheme" style={{ fontSize: "1.3rem" }} data-label="பகுதி · Part">{p.grapheme}</td>
                <td style={{ fontSize: "0.85rem" }} data-label="வகை · Category">{p.category}</td>
                <td style={{ fontSize: "0.9rem" }} data-label="அடி · உயிர் · Base · vowel">{[p.baseConsonant, p.vowel].filter(Boolean).join(" · ") || "—"}</td>
                <td className="matra-num" data-label="பெயரளவு · Nominal">{formatMatra(p.nominal)}</td>
                <td className="matra-num" style={{ fontWeight: 600, color: p.contextual !== p.nominal ? "var(--accent)" : "inherit" }} data-label="சூழல் மதிப்பு · Contextual">
                  {p.contextual === null ? <Bi ta="உறுதியற்று" en="indeterminate" /> : formatMatra(p.contextual)}
                </td>
                <td style={{ fontSize: "0.82rem" }} data-label="விதி · குறிப்பு · Rule · note">
                  {p.rule && <div><strong>{p.rule}</strong>{p.ruleEnglish ? <span className="muted"> · {p.ruleEnglish}</span> : null}</div>}
                  <div className="muted">{p.note}</div>
                  <span className={`badge ${confBadge[p.confidence]}`} style={{ marginTop: "0.2rem" }}>
                    <Bi ta={confLabel[p.confidence][0]} en={confLabel[p.confidence][1]} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        {a.analyzable ? (
          <div className="card" style={{ display: "inline-flex", alignItems: "baseline", gap: "0.75rem", background: "var(--paper-2)" }}>
            <span className="muted"><Bi ta="மொத்தச் சூழல் மாத்திரை" en="Total contextual மாத்திரை" /></span>
            <span className="big-number" style={{ fontSize: "2rem" }}>{formatMatra(a.total)}</span>
          </div>
        ) : (
          <div className="notice" style={{ borderLeftColor: "var(--warn)" }}>
            <p className="tamil" style={{ margin: 0, color: "var(--ink-soft)" }}>{a.message}</p>
            <p className="muted" style={{ margin: "0.35rem 0 0", fontSize: "0.85rem" }}>
              A definitive total is withheld because a form in this word (e.g. non-initial ஐ/ஔ, ஐகாரக்/ஔகாரக் குறுக்கம்)
              does not have a single agreed மாத்திரை value in the tradition. Per-letter nominal values are still shown above.
            </p>
          </div>
        )}
      </div>

      <div className="notice notice-accent" style={{ marginTop: "1.25rem" }}>
        <Bi
          ta={<><strong>எல்லைக்குட்பட்ட முன்மாதிரி.</strong> இந்தக் கருவி தற்போது அடிப்படை மாத்திரை விதிகளையும் தேர்ந்தெடுக்கப்பட்ட சூழல் சார்ந்த விதிகளையும் (சொல்லிறுதி குற்றியலுகரம் உட்பட) மட்டுமே கணக்கிடுகிறது. இது முழு யாப்பியல் ஆய்வு அல்ல. மூலத்தில் அளபு/மாத்திரை பற்றிக் காண <Link href="/adhikaram/ezhuthu/ezhuthu-noolmarabu">நூல் மரபு</Link>.</>}
          en={<><strong>Bounded prototype.</strong> This tool currently computes only the basic மாத்திரை values and selected context-sensitive rules (including word-final குற்றியலுகரம்). It is not a full prosody engine and does not present unsupported calculations as definitive. See <Link href="/adhikaram/ezhuthu/ezhuthu-noolmarabu">நூல் மரபு</Link> for the source treatment of அளபு / மாத்திரை.</>}
        />
      </div>
    </div>
  );
}
