import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { glossary, getSutra } from "@/lib/data.ts";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = { title: "சொற்களஞ்சியம் · Glossary", description: "A framework glossary of Tolkāppiyam technical terms, linked to their occurrences in the source." };

export default function GlossaryPage() {
  const terms = [...glossary].sort((a, b) => b.occurrences - a.occurrences);
  return (
    <div className="shell block">
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="சொற்களஞ்சியம்" en="Glossary" /> }]} />
      <h1 style={{ marginTop: "1rem" }}><Bi ta="சொற்களஞ்சியம்" en="Glossary" /></h1>
      <p className="lead"><Bi ta="இலக்கணத்தின் தொழில்நுட்பச் சொற்கள். ஒவ்வொரு உள்ளீடும் மூலத்தில் உள்ள உண்மையான இடங்களுடன் இணைக்கிறது; அறிஞர் விளக்கங்கள் மதிப்பாய்வுக்குப் பின் சேர்க்கப்படும் பதிப்பு அடுக்கு." en="Technical terms of the grammar. Each entry links to real occurrences in the source; the scholarly definitions are an editorial layer, added after review." /></p>
      <div className="notice" style={{ margin: "1rem 0 1.5rem" }}>
        <Bi ta="வருகை எண்ணிக்கையும் தொடர்புடைய நூற்பா இணைப்புகளும் மூல உரையிலிருந்து கணக்கிடப்படுகின்றன. “விரைவில் சேர்க்கப்படும்” எனக் குறிக்கப்பட்ட விளக்கங்கள் இடக்குறிப்புகளே — இயந்திரம் எழுதிய விளக்கங்கள் அல்ல." en="Occurrence counts and related aphorism (நூற்பா) links are computed from the source text. Definitions marked “விரைவில் சேர்க்கப்படும்” are placeholders — not machine-written definitions." />
      </div>
      <div className="grid grid-2">
        {terms.map((t) => (
          <article key={t.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem" }}>{t.tamil}</h2>
              <span className="muted" style={{ fontSize: "0.82rem" }}>{t.occurrences} occ.</span>
            </div>
            <p className="muted" style={{ fontSize: "0.85rem", margin: "0.2rem 0 0.6rem" }}>{t.transliteration} · {t.englishTerm}</p>
            <p className="tamil" style={{ color: "var(--ink-soft)", fontSize: "0.95rem" }}>{t.conciseDefinition}</p>
            {t.relatedSutras.length > 0 && (
              <div style={{ marginTop: "0.6rem" }}>
                <p className="eyebrow" style={{ margin: "0 0 0.35rem" }}><Bi ta="தொடர்புடைய நூற்பாக்கள்" en="Related aphorisms" /></p>
                <div className="pill-row">
                  {t.relatedSutras.slice(0, 8).map((rid) => {
                    const s = getSutra(rid);
                    return <Link key={rid} className="chip" href={`/sutra/${rid}`}>{s ? `${s.iyalEditorialTamil ?? s.iyalTamil} ${s.displayNumber}` : rid}</Link>;
                  })}
                </div>
              </div>
            )}
            <p style={{ margin: "0.75rem 0 0" }}><Link href={`/search?q=${encodeURIComponent(t.tamil)}`} style={{ fontSize: "0.9rem" }}><Bi ta="எல்லா இடங்களையும் தேடு" en="Search all occurrences" /> →</Link></p>
          </article>
        ))}
      </div>
    </div>
  );
}
