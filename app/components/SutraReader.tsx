"use client";
import { useId, useState } from "react";
import Link from "next/link";
import type { SutraRecord } from "@/lib/types.ts";
import { EditorialPlaceholder } from "./EditorialPlaceholder";

type Related = { id: string; number: string; text: string };

const TABS = [
  { key: "moolam", label: "மூலம்" },
  { key: "sol", label: "சொல் பிரிப்பு" },
  { key: "transliteration", label: "ஒலிபெயர்ப்பு" },
  { key: "eliya", label: "எளிய தமிழ்" },
  { key: "vivara", label: "விரிவான விளக்கம்" },
  { key: "english", label: "English" },
  { key: "karuthu", label: "கருத்துகள்" },
  { key: "notes", label: "அறிஞர் குறிப்பு" },
  { key: "thodarbu", label: "தொடர்புடைய" },
  { key: "audio", label: "ஒலி" },
] as const;

export function SutraReader({ sutra, related }: { sutra: SutraRecord; related: Related[] }) {
  const [active, setActive] = useState<string>("moolam");
  const base = useId();

  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Reading tools">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            id={`${base}-tab-${t.key}`}
            aria-selected={active === t.key}
            aria-controls={`${base}-panel-${t.key}`}
            tabIndex={active === t.key ? 0 : -1}
            className="tab"
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${base}-panel-${active}`} aria-labelledby={`${base}-tab-${active}`} className="panel">
        {active === "moolam" && (
          <p className="source-text lg">{sutra.originalLines.join("\n")}</p>
        )}
        {active === "sol" && (
          sutra.wordSeparatedText
            ? <p className="source-text">{sutra.wordSeparatedText}</p>
            : <EditorialPlaceholder english="Word-separated (சொல் பிரிப்பு) text is added by editors after review; it is not auto-generated." />
        )}
        {active === "transliteration" && (
          sutra.transliteration
            ? <p className="prose">{sutra.transliteration}</p>
            : <EditorialPlaceholder english="A verified romanised transliteration has not been added for this நூற்பா yet." />
        )}
        {active === "eliya" && (
          sutra.simpleTamilExplanation
            ? <p className="prose tamil">{sutra.simpleTamilExplanation}</p>
            : <EditorialPlaceholder english="A simple Tamil explanation has not been added for this நூற்பா yet." />
        )}
        {active === "vivara" && (
          sutra.detailedTamilExplanation
            ? <p className="prose tamil">{sutra.detailedTamilExplanation}</p>
            : <EditorialPlaceholder english="A detailed Tamil explanation has not been added for this நூற்பா yet." />
        )}
        {active === "english" && (
          sutra.englishExplanation
            ? <p className="prose">{sutra.englishExplanation}</p>
            : <EditorialPlaceholder tamil="Explanation under editorial review" english="An English explanation has not been added for this நூற்பா yet." />
        )}
        {active === "karuthu" && (
          sutra.concepts.length
            ? <div className="pill-row">{sutra.concepts.map((c) => <Link key={c} className="chip" href={`/search?q=${encodeURIComponent(c)}`}>{c}</Link>)}</div>
            : <EditorialPlaceholder english="No source-attested keyword concepts were detected for this நூற்பா." />
        )}
        {active === "notes" && (
          sutra.scholarlyNotes
            ? <p className="prose tamil">{sutra.scholarlyNotes}</p>
            : <EditorialPlaceholder english="Editorial / scholarly notes for this நூற்பா have not been added yet. These are distinct from the automatic parsing notes shown in the metadata." />
        )}
        {active === "thodarbu" && (
          related.length
            ? <div>
                <p className="muted" style={{ fontSize: "0.85rem", marginTop: 0 }}>
                  Related by shared vocabulary within the same இயல் (a mechanical lexical link, not an interpretive claim).
                </p>
                {related.map((r) => (
                  <Link key={r.id} href={`/sutra/${r.id}`} className="sutra-item" style={{ textDecoration: "none", color: "inherit" }}>
                    <span className="sutra-num">{r.number}</span>
                    <span className="st">{r.text}</span>
                  </Link>
                ))}
              </div>
            : <EditorialPlaceholder english="No closely related நூற்பாக்கள் were detected by shared vocabulary." />
        )}
        {active === "audio" && (
          sutra.audio
            ? <div>
                <audio controls src={sutra.audio.url} style={{ width: "100%", maxWidth: "28rem" }} />
                <p className="muted" style={{ fontSize: "0.82rem", marginTop: "0.5rem" }}>
                  {sutra.audio.reciter ? `ஓதியவர்: ${sutra.audio.reciter}. ` : ""}
                  {sutra.audio.license ? `உரிமம்: ${sutra.audio.license}.` : ""}
                </p>
              </div>
            : <EditorialPlaceholder english="Recited audio for this நூற்பா has not been added yet. Audio will be attached with reciter and licence details when available." />
        )}
      </div>
    </div>
  );
}
