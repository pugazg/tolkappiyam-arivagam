import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adhikarams, getAdhikaram, getAdhikaramSutras, getIyalsFor } from "@/lib/data.ts";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { SourceProcessingStatusBadge } from "../../components/Badges";

export function generateStaticParams() {
  return adhikarams.map((a) => ({ adhikaram: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ adhikaram: string }> }): Promise<Metadata> {
  const { adhikaram } = await params;
  const a = getAdhikaram(adhikaram);
  if (!a) return {};
  return { title: `${a.tamil} · ${a.english}`, description: a.neutralDescription };
}

export default async function AdhikaramPage({ params }: { params: Promise<{ adhikaram: string }> }) {
  const { adhikaram } = await params;
  const a = getAdhikaram(adhikaram);
  if (!a) notFound();
  const iyalList = getIyalsFor(a.id);
  const total = getAdhikaramSutras(a.id).length;
  const segmented = iyalList.filter((i) => i.sutraCount > 0).length;
  const pct = Math.round((segmented / iyalList.length) * 100);

  return (
    <div className="shell block">
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="உலாவுக" en="Browse" />, href: "/browse" }, { label: a.tamil }]} />
      <p className="eyebrow" style={{ marginTop: "1rem" }}>அதிகாரம் {a.number} · {a.transliteration}</p>
      <h1 style={{ marginTop: 0 }}>{a.tamil}</h1>
      <p className="muted" style={{ marginTop: "-0.5rem" }}>{a.english}</p>
      <p className="lead">{a.overview}</p>

      <div className="grid grid-3" style={{ margin: "1.5rem 0" }}>
        <div className="card"><div className="big-number" style={{ fontSize: "2rem" }}>{total}</div><span className="muted"><Bi ta="நூற்பாக்கள்" en="aphorisms" /></span></div>
        <div className="card"><div className="big-number" style={{ fontSize: "2rem" }}>{iyalList.length}</div><span className="muted"><Bi ta="இயல்கள்" en="chapters" /></span></div>
        <div className="card">
          <span className="muted" style={{ fontSize: "0.85rem" }}><Bi ta="பிரிக்கப்பட்ட இயல்கள்" en="Segmented chapters" /> {segmented}/{iyalList.length}</span>
          <div className="progress" style={{ marginTop: "0.6rem" }}><span style={{ width: `${pct}%` }} /></div>
        </div>
      </div>

      <h2><Bi ta="இயல்கள்" en="Chapters (இயல்)" /></h2>
      <div style={{ marginTop: "0.5rem" }}>
        {iyalList.map((iyal) => (
          <Link key={iyal.id} href={`/adhikaram/${a.id}/${iyal.id}`} className="sutra-item" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="sutra-num">{a.number}.{iyal.number}</span>
            <span>
              <span className="st" style={{ fontSize: "1.15rem" }}>{iyal.sourceTamil ?? iyal.tamil}</span>
              <span className="muted" style={{ display: "block", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                {iyal.gloss} · {iyal.sutraCount} நூற்பா
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="notice" style={{ marginTop: "2rem" }}>
        <SourceProcessingStatusBadge status="segmented" /> &nbsp; <Bi ta="கட்டமைப்பும் நூற்பாப் பிரிப்பும் மூலத்திலிருந்து பெறப்பட்டவை. விளக்க/உரை அடுக்குகள் இன்னும் சேர்க்கப்படவில்லை." en="Structure and aphorism (நூற்பா) segmentation are derived from the source. Explanations and commentary layers are not yet added." />
        &nbsp;<Link href="/tools/tamil-letters"><Bi ta="தொடர்புடைய கருவி: தமிழ் எழுத்து ஆய்வு" en="Related tool: Tamil Letter Explorer" /> →</Link>
      </div>
    </div>
  );
}
