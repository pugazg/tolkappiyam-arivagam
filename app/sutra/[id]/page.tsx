import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacentSutras,
  getIyal,
  getSutra,
  sutras,
} from "@/lib/data.ts";
import { compactCitation, fullCitation } from "@/lib/citation.ts";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { StatusBadge, ConfidenceBadge } from "../../components/Badges";
import { SutraReader } from "../../components/SutraReader";
import { CitationBlock } from "../../components/CitationBlock";
import { CopyButton } from "../../components/CopyButton";

export function generateStaticParams() {
  return sutras.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = getSutra(id);
  if (!s) return {};
  const title = `நூற்பா ${s.displayNumber} — ${s.iyalEditorialTamil ?? s.iyalTamil}`;
  return {
    title,
    description: `${s.originalLines.join(" ").slice(0, 150)} — ${s.adhikaramTamil}, ${s.iyalTamil}.`,
    alternates: { canonical: `/sutra/${s.id}` },
    openGraph: { title, description: s.normalizedText.slice(0, 160) },
  };
}

export default async function SutraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getSutra(id);
  if (!s) notFound();
  const iyal = getIyal(s.iyalId);
  const { previous, next } = getAdjacentSutras(s.id);
  const related = s.relatedSutras
    .map((rid) => getSutra(rid))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => ({ id: r.id, number: r.displayNumber, text: r.originalLines.join(" ") }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `தொல்காப்பியம் — ${s.adhikaramTamil}, ${s.iyalTamil}, நூற்பா ${s.displayNumber}`,
    isPartOf: { "@type": "Book", name: "தொல்காப்பியம் (Tolkāppiyam)" },
    inLanguage: "ta",
    identifier: s.id,
    text: s.normalizedText,
    citation: fullCitation(s),
  };

  return (
    <div className="shell block">
      <Breadcrumbs items={[
        { label: <Bi ta="முகப்பு" en="Home" />, href: "/" },
        { label: <Bi ta="உலாவுக" en="Browse" />, href: "/browse" },
        { label: s.adhikaramTamil, href: `/adhikaram/${s.adhikaramId}` },
        { label: s.iyalEditorialTamil ?? s.iyalTamil, href: `/adhikaram/${s.adhikaramId}/${s.iyalId}` },
        { label: <Bi ta={`நூற்பா ${s.displayNumber}`} en={`Aphorism ${s.displayNumber}`} /> },
      ]} />

      <header style={{ margin: "1rem 0 1.5rem" }}>
        <p className="eyebrow" style={{ margin: 0 }}>
          {s.adhikaramTamil} · {s.iyalEditorialTamil ?? s.iyalTamil} · source seq {s.sourceSequence}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "0.75rem" }}>
          <h1 style={{ margin: "0.2rem 0 0" }}><Bi ta={`நூற்பா ${s.displayNumber}`} en={`Aphorism ${s.displayNumber}`} /></h1>
          <div className="pill-row"><StatusBadge status={s.editorialStatus} /><ConfidenceBadge confidence={s.parsingConfidence} /></div>
        </div>
        <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.4rem" }}><Bi ta="நிலையான அடையாளம்" en="Stable ID" />: <code>{s.id}</code></p>
      </header>

      <section className="card" style={{ padding: "1.75rem 1.9rem" }}>
        <p className="source-text lg" style={{ margin: 0 }}>{s.originalLines.join("\n")}</p>
        <div className="pill-row" style={{ marginTop: "1.25rem" }}>
          <CopyButton text={s.originalText} label="மூலத்தை நகலெடு" />
          <span className="muted" style={{ fontSize: "0.82rem", alignSelf: "center" }}>
            <Bi ta="மூலம்: Project Madurai pmuni0100 · மாற்றமின்றி" en="Source: Project Madurai pmuni0100 · preserved unchanged" />
          </span>
        </div>
      </section>

      {s.parsingNotes && s.parsingNotes.length > 0 && (
        <div className="notice notice-accent" style={{ marginTop: "1rem" }}>
          <strong>Parsing notes:</strong>{" "}
          {s.parsingNotes.join(" ")}
        </div>
      )}

      <SutraReader sutra={s} related={related} />

      <div className="grid grid-2" style={{ marginTop: "1.5rem" }}>
        <CitationBlock full={fullCitation(s)} compact={compactCitation(s)} />
        <div className="card">
          <p className="eyebrow" style={{ marginTop: 0 }}><Bi ta="விவரம்" en="Metadata" /></p>
          <dl className="kv">
            <dt><Bi ta="அதிகாரம்" en="Adhikaram" /></dt><dd>{s.adhikaramTamil}</dd>
            <dt><Bi ta="இயல்" en="Iyal" /></dt><dd>{s.iyalTamil}{s.iyalEditorialTamil ? ` (display: ${s.iyalEditorialTamil})` : ""}</dd>
            <dt><Bi ta="நூற்பா எண்" en="Aphorism no." /></dt><dd>{s.displayNumber}</dd>
            <dt><Bi ta="வரிகள்" en="Lines" /></dt><dd>{s.lineCount}</dd>
            <dt><Bi ta="சொற்கள்" en="Words" /></dt><dd>{s.wordCount}</dd>
            <dt><Bi ta="கருத்துகள்" en="Concepts" /></dt><dd>{s.concepts.length ? s.concepts.join(", ") : "—"}</dd>
            <dt><Bi ta="நம்பகத்தன்மை" en="Confidence" /></dt><dd>{s.parsingConfidence}</dd>
            <dt><Bi ta="பதிப்பு நிலை" en="Editorial status" /></dt><dd>{s.editorialStatus}</dd>
          </dl>
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.75rem" }}>
            Source: {s.source.publisher} · {s.source.sourceId}
          </p>
        </div>
      </div>

      <nav className="grid grid-2" style={{ marginTop: "2rem" }} aria-label="Adjacent நூற்பாக்கள்">
        {previous ? (
          <Link href={`/sutra/${previous.id}`} className="card card-link">
            <span className="muted" style={{ fontSize: "0.8rem" }}>← <Bi ta="முந்தைய" en="Previous" /></span>
            <p className="tamil-serif" style={{ margin: "0.3rem 0 0" }}><Bi ta="நூற்பா" en="Aphorism" /> {previous.displayNumber} · {previous.iyalEditorialTamil ?? previous.iyalTamil}</p>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/sutra/${next.id}`} className="card card-link" style={{ textAlign: "right" }}>
            <span className="muted" style={{ fontSize: "0.8rem" }}><Bi ta="அடுத்த" en="Next" /> →</span>
            <p className="tamil-serif" style={{ margin: "0.3rem 0 0" }}><Bi ta="நூற்பா" en="Aphorism" /> {next.displayNumber} · {next.iyalEditorialTamil ?? next.iyalTamil}</p>
          </Link>
        ) : <span />}
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
