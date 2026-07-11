import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdhikaram, getIyal, getIyalSutras, iyals } from "@/lib/data.ts";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { ConfidenceBadge } from "../../../components/Badges";
import { IyalSutraList } from "../../../components/IyalSutraList";

export function generateStaticParams() {
  return iyals.map((i) => ({ adhikaram: i.adhikaramId, iyal: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ adhikaram: string; iyal: string }> }): Promise<Metadata> {
  const { iyal } = await params;
  const i = getIyal(iyal);
  if (!i) return {};
  return { title: `${i.sourceTamil ?? i.tamil} · ${i.english}`, description: `${i.gloss} — ${i.sutraCount} aphorisms.` };
}

export default async function IyalPage({ params }: { params: Promise<{ adhikaram: string; iyal: string }> }) {
  const { adhikaram, iyal } = await params;
  const a = getAdhikaram(adhikaram);
  const i = getIyal(iyal);
  if (!a || !i || i.adhikaramId !== a.id) notFound();
  const sutras = getIyalSutras(i.id);

  return (
    <div className="shell block">
      <Breadcrumbs items={[
        { label: <Bi ta="முகப்பு" en="Home" />, href: "/" },
        { label: <Bi ta="உலாவுக" en="Browse" />, href: "/browse" },
        { label: a.tamil, href: `/adhikaram/${a.id}` },
        { label: i.sourceTamil ?? i.tamil },
      ]} />
      <p className="eyebrow" style={{ marginTop: "1rem" }}>
        {a.tamil} · <Bi ta={<>இயல் {i.number} · மூல வரிசை {i.sourceSequence}</>} en={<>Chapter {i.number} · source seq {i.sourceSequence}</>} />
      </p>
      <h1 style={{ marginTop: 0 }}>{i.sourceTamil ?? i.tamil}</h1>
      <p className="muted" style={{ marginTop: "-0.4rem" }}>{i.english} · {i.transliteration}</p>
      <p className="lead">{i.gloss}</p>
      <div className="pill-row" style={{ margin: "0.75rem 0" }}>
        <ConfidenceBadge confidence={i.parsingConfidence} />
        <span className="chip">{sutras.length} <Bi ta="நூற்பா" en="aphorisms" /></span>
      </div>

      {i.parsingNotes.length > 0 && (
        <div className="notice notice-accent" style={{ marginBottom: "1rem" }}>
          <strong><Bi ta="பாகுபாட்டுக் குறிப்புகள்:" en="Parsing notes:" /></strong>
          <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.2rem" }}>
            {i.parsingNotes.map((n, k) => <li key={k}>{n}</li>)}
          </ul>
        </div>
      )}

      <IyalSutraList sutras={sutras} />

      <div className="notice" style={{ marginTop: "2rem" }}>
        <Bi ta="காட்டப்படும் நூற்பா எண்கள் இந்த இயலில் மூலத்தின் சொந்த எண்ணிடலே. பிரிப்பான் இன்றி எண் ஒட்டப்பட்ட இடங்கள் நூற்பாப் பக்கத்தில் குறிக்கப்படும்." en="Displayed நூற்பா numbers are the source’s own numbering within this இயல். Where the source attaches a number without a separator, it is flagged on the நூற்பா page." />
      </div>
    </div>
  );
}
