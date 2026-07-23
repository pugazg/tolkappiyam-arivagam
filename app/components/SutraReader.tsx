"use client";
import { useId, useState } from "react";
import Link from "next/link";
import type { AudioReference } from "@/lib/types.ts";
import type { ResolvedSutraView, ResolvedField, FieldLayer } from "@/lib/sutra-view.ts";
import { EditorialPlaceholder } from "./EditorialPlaceholder";
import { ProvenanceNote } from "./ProvenanceNote";

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

const relatedLayerNote: Record<FieldLayer, string> = {
  source: "Listed in the source layer.",
  "parser-derived": "Related by shared vocabulary within the same இயல் (a mechanical lexical link, not an interpretive claim).",
  "machine-derived": "Related by shared vocabulary within the same இயல் (a mechanical lexical link, not an interpretive claim).",
  editorial: "Related நூற்பாக்கள் curated by an editor.",
};

export function SutraReader({
  view,
  related,
  relatedLayer,
  audio,
}: {
  view: ResolvedSutraView;
  related: Related[];
  relatedLayer: FieldLayer;
  audio: AudioReference | null;
}) {
  const [active, setActive] = useState<string>("moolam");
  const base = useId();
  const f = view.fields;

  const prose = (
    field: ResolvedField<string> | null,
    placeholder: React.ReactNode,
    className = "prose",
  ) =>
    field ? (
      <div>
        <p className={className}>{field.value}</p>
        <ProvenanceNote field={field} />
      </div>
    ) : (
      placeholder
    );

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
          <p className="source-text lg">{view.originalLines.join("\n")}</p>
        )}
        {active === "sol" && prose(
          f.wordSeparatedText,
          <EditorialPlaceholder english="Word-separated (சொல் பிரிப்பு) text is added by editors after review; it is not auto-generated." />,
          "source-text",
        )}
        {active === "transliteration" && prose(
          f.transliteration,
          <EditorialPlaceholder english="A verified romanised transliteration has not been added for this நூற்பா yet." />,
        )}
        {active === "eliya" && prose(
          f.simpleTamilExplanation,
          <EditorialPlaceholder english="A simple Tamil explanation has not been added for this நூற்பா yet." />,
          "prose tamil",
        )}
        {active === "vivara" && prose(
          f.detailedTamilExplanation,
          <EditorialPlaceholder english="A detailed Tamil explanation has not been added for this நூற்பா yet." />,
          "prose tamil",
        )}
        {active === "english" && prose(
          f.englishExplanation,
          <EditorialPlaceholder tamil="Explanation under editorial review" english="An English explanation has not been added for this நூற்பா yet." />,
        )}
        {active === "karuthu" && (
          f.concepts
            ? <div>
                <div className="pill-row">{f.concepts.value.map((c) => <Link key={c} className="chip" href={`/search?q=${encodeURIComponent(c)}`}>{c}</Link>)}</div>
                <ProvenanceNote field={f.concepts} />
              </div>
            : <EditorialPlaceholder english="No source-attested keyword concepts were detected for this நூற்பா." />
        )}
        {active === "notes" && prose(
          f.scholarlyNotes,
          <EditorialPlaceholder english="Editorial / scholarly notes for this நூற்பா have not been added yet. These are distinct from the automatic parsing notes shown in the metadata." />,
          "prose tamil",
        )}
        {active === "thodarbu" && (
          related.length
            ? <div>
                <p className="muted" style={{ fontSize: "0.85rem", marginTop: 0 }}>
                  {relatedLayerNote[relatedLayer]}
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
          audio
            ? <div>
                <audio controls src={audio.url} style={{ width: "100%", maxWidth: "28rem" }} />
                <p className="muted" style={{ fontSize: "0.82rem", marginTop: "0.5rem" }}>
                  {audio.reciter ? `ஓதியவர்: ${audio.reciter}. ` : ""}
                  {audio.license ? `உரிமம்: ${audio.license}.` : ""}
                </p>
              </div>
            : <EditorialPlaceholder english="Recited audio for this நூற்பா has not been added yet. Audio will be attached with reciter and licence details when available." />
        )}
      </div>
    </div>
  );
}
