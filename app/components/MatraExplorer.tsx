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

      {a.hasExtended && (
        <div className="notice" style={{ marginTop: "1rem", borderLeftColor: "var(--gold)" }}>
          <Bi
            ta={<>இந்தக் கணிப்பில் கிரந்த/நீட்டிய தமிழ் எழுத்து(கள்) <strong>நவீன விரிவாக்க விதியின்</strong> கீழ் கணக்கிடப்பட்டுள்ளன — தொல்காப்பியத்தின் பதினெண் மெய்யெழுத்து வகைப்பாட்டின் பகுதி அல்ல.</>}
            en={<>One or more Tamil-script extended / Grantha letters here were counted under the <strong>modern extended rule</strong> — not part of Tolkāppiyam&rsquo;s classical 18-consonant inventory.</>}
          />
        </div>
      )}

      {a.unsupportedGraphemes.length > 0 && (
        <div className="notice" style={{ marginTop: "1rem", borderLeftColor: "var(--accent)" }}>
          <Bi
            ta={<>கையாளப்படாத எழுத்து(கள்): <strong className="tamil-serif">{a.unsupportedGraphemes.join(" ")}</strong>. இவை முழுமையாக பகுப்பாய்வு செய்யப்படாததால் உறுதியான மொத்தம் காட்டப்படவில்லை.</>}
            en={<>Unhandled grapheme(s): <strong className="tamil-serif">{a.unsupportedGraphemes.join(" ")}</strong>. A definitive total is withheld because they are not fully analysed (no grapheme is silently dropped).</>}
          />
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
              <Bi
                ta="ஒரு உறுதியான மொத்தம் நிறுத்திவைக்கப்பட்டுள்ளது — ஒன்று அல்லது மேற்பட்ட எழுத்துகளுக்கு மரபில் ஒரே மதிப்பு இல்லை, அல்லது பகுப்பாய்வி அவற்றை முழுமையாகக் கையாளவில்லை. ஒவ்வொரு எழுத்தின் அடிப்படை மதிப்பும் மேலே காட்டப்பட்டுள்ளது."
                en="A definitive total is withheld — one or more graphemes either have no single agreed மாத்திரை value in the tradition, or are not fully handled by the analyser. Every grapheme is still shown above; none is silently dropped."
              />
            </p>
          </div>
        )}
        <p className="muted" style={{ fontSize: "0.75rem", marginTop: "0.6rem" }}>
          <Bi ta="எழுத்து ஒருமைப்பாடு" en="Grapheme integrity" />: {a.analysedGraphemeCount}/{a.inputGraphemeCount - a.ignoredGraphemes.length} <Bi ta="பொருள்தரு எழுத்துகள் பகுப்பாய்வு செய்யப்பட்டன" en="meaningful graphemes analysed" />
          {a.ignoredGraphemes.length > 0 ? ` · ${a.ignoredGraphemes.length} ignored (punctuation/space)` : ""}
        </p>
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
