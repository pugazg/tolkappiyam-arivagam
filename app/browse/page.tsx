import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { adhikarams, getAdhikaramSutras, getIyalsFor } from "@/lib/data.ts";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "உலாவுக · Browse",
  description: "Browse Tolkāppiyam by அதிகாரம் and இயல் — from the work down to individual aphorisms (நூற்பாக்கள்).",
};

export default function BrowsePage() {
  return (
    <div className="shell block">
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="உலாவுக" en="Browse" /> }]} />
      <p className="eyebrow" style={{ marginTop: "1rem" }}>தொல்காப்பியம் → அதிகாரம் → இயல் → நூற்பா</p>
      <h1 style={{ marginTop: 0 }}><Bi ta="அமைப்பின்படி உலாவுக" en="Browse by structure" /></h1>
      <p className="lead"><Bi ta="மூலம் காட்டும் அமைப்பின்படியே முழு நூலும்: மூன்று அதிகாரங்கள், ஒவ்வொன்றிலும் ஒன்பது இயல்கள்." en="The whole work, organised exactly as the source presents it: three அதிகாரங்கள், each with nine இயல்கள்." /></p>

      {adhikarams.map((a) => {
        const iyalList = getIyalsFor(a.id);
        const total = getAdhikaramSutras(a.id).length;
        return (
          <section key={a.id} style={{ marginTop: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
              <h2 style={{ margin: 0 }}><Link href={`/adhikaram/${a.id}`}>{a.tamil}</Link></h2>
              <span className="muted">{a.english} · {total} நூற்பா</span>
            </div>
            <div className="grid grid-3" style={{ marginTop: "1rem" }}>
              {iyalList.map((iyal) => (
                <Link key={iyal.id} href={`/adhikaram/${a.id}/${iyal.id}`} className="card card-link">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{iyal.sourceTamil ?? iyal.tamil}</h3>
                    <span className="muted" style={{ fontSize: "0.85rem" }}>{iyal.sutraCount}</span>
                  </div>
                  <p className="muted" style={{ fontSize: "0.85rem", margin: "0.35rem 0 0" }}>{iyal.gloss}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
