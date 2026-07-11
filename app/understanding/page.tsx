import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { adhikarams, analysis, parsingReport, getSutra } from "@/lib/data.ts";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "தொல்காப்பியம் அறிமுகம் · Understanding Tolkāppiyam",
  description: "A careful, sourced overview of what Tolkāppiyam is and how it is organised — background context kept separate from the source text and from per-aphorism interpretation.",
};

export default function UnderstandingPage() {
  const longest = analysis ? getSutra(analysis.longestSutraId) : null;
  const shortest = analysis ? getSutra(analysis.shortestSutraId) : null;
  const maxWord = analysis?.topWords[0]?.count ?? 1;
  const maxLetter = analysis?.letterFrequency[0]?.count ?? 1;

  return (
    <div className="shell block">
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="அறிமுகம்" en="About the text" /> }]} />
      <div className="prose" style={{ maxWidth: "48rem" }}>
        <h1 style={{ marginTop: "1rem" }}><Bi ta="தொல்காப்பியம் — ஒரு அறிமுகம்" en="Understanding Tolkāppiyam" /></h1>
        <p className="lead"><Bi ta="இந்நூல் என்ன, எவ்வாறு அமைந்துள்ளது, ஏன் நூற்பா-நூற்பாவாக அணுகுவது பயனுள்ளது என்பது." en="What the work is, how it is built, and why treating it aphorism-by-aphorism (நூற்பா) is worthwhile." /></p>

        <div className="notice" style={{ marginBottom: "1.5rem" }}>
          <strong>Two kinds of statement, kept apart.</strong> This page has (a) widely-held background
          about the text, drawn from reference sources and cited below, and (b) mechanical measurements
          of the source dataset, marked as such. Neither is a scholarly interpretation of any individual
          aphorism (நூற்பா) — those remain an editorial layer under review.
        </div>

        <h2>What it is</h2>
        <p>தொல்காப்பியம் (Tolkāppiyam) is the oldest surviving grammar of the Tamil language and the earliest long work of Tamil literature to come down to us. It is written entirely in நூற்பா (nūṟpā) form — terse, aphoristic rules, the Tamil counterpart of the Sanskrit sūtra — attributed by tradition to an author known as தொல்காப்பியர் (Tolkāppiyar). Throughout this site the நூற்பா is glossed in English as an <strong>aphorism</strong>.</p>
        <p className="muted">The date of the work is genuinely debated: scholarly proposals span a very wide range, and many researchers treat it as composed in layers over several centuries rather than at a single moment. This project takes no position on dating; it simply presents the text.</p>

        <h2>The three-fold plan: எழுத்து · சொல் · பொருள்</h2>
        <p>The work is organised into three அதிகாரங்கள் (books), each of nine இயல்கள் (chapters) — twenty-seven chapters in all. The three books move outward from the smallest unit of language to the largest questions of meaning:</p>
        <div className="grid grid-3" style={{ margin: "1.25rem 0" }}>
          {adhikarams.map((a) => (
            <div className="card" key={a.id}>
              <h3 style={{ margin: "0 0 0.3rem", fontSize: "1.25rem" }}>{a.tamil}</h3>
              <p className="muted" style={{ fontSize: "0.82rem", margin: "0 0 0.6rem" }}>{a.english}</p>
              <p style={{ fontSize: "0.92rem", color: "var(--ink-soft)", margin: 0 }}>{a.overview}</p>
              <p style={{ margin: "0.75rem 0 0", fontSize: "0.9rem" }}><Link href={`/adhikaram/${a.id}`}>Open →</Link></p>
            </div>
          ))}
        </div>
        <p>The third book, <strong>பொருளதிகாரம்</strong>, is what makes Tolkāppiyam unusual among the world’s early grammars. Most grammars stop at sounds and words; Tolkāppiyam continues into <em>meaning</em> — the conventions of classical Tamil poetry, its interior (அகம்) and exterior (புறம்) genres, the landscapes (திணை), embodied feeling (மெய்ப்பாடு), simile, and metre. Grammar and poetics are treated as one continuous system.</p>

        <h2>Why work aphorism-by-aphorism</h2>
        <p>Because the aphorism (நூற்பா) is deliberately compressed, its value is unlocked by structure: a stable address, its place in the அதிகாரம்/இயல் hierarchy, the words it uses, the terms it shares with neighbouring rules, and — eventually — verified explanation and commentary. That is the unit this platform is built around. Every aphorism here has a permanent link, a citation, and a place in the whole.</p>

        <h2>The commentary tradition</h2>
        <p>Tolkāppiyam has been read for a millennium through its commentators — இளம்பூரணர், சேனாவரையர், நச்சினார்க்கினியர், பேராசிரியர், தெய்வச்சிலையார் and others. Their commentaries are themselves major works of Tamil scholarship. This project prepares a place for them but adds no commentary text until specific editions are sourced, rights-checked, and verified. See <Link href="/commentaries">commentaries</Link>.</p>

        <h2 id="analysis">தொல்காப்பியம் in numbers</h2>
        <p className="muted">Everything below is a mechanical count of the checked-in source dataset (Project Madurai <span lang="en">pmuni0100</span>). These are measurements, not interpretations.</p>
      </div>

      {analysis ? (
        <>
          <div className="grid grid-3" style={{ margin: "1.5rem 0" }}>
            <div className="card"><div className="big-number" style={{ fontSize: "1.8rem" }}>{analysis.totalSutras.toLocaleString("en-IN")}</div><span className="muted"><Bi ta="நூற்பாக்கள் (இப்பதிப்பு)" en="aphorisms (this edition)" /></span></div>
            <div className="card"><div className="big-number" style={{ fontSize: "1.8rem" }}>{analysis.totalWords.toLocaleString("en-IN")}</div><span className="muted">சொற்கள் · {analysis.uniqueWords.toLocaleString("en-IN")} unique</span></div>
            <div className="card"><div className="big-number" style={{ fontSize: "1.8rem" }}>{analysis.averageWordsPerSutra}</div><span className="muted"><Bi ta="சராசரி சொற்கள்/நூற்பா" en="avg words / aphorism" /></span></div>
          </div>

          <div className="notice" style={{ maxWidth: "48rem" }}>
            Editions differ: reference works cite roughly <strong>1,612</strong> aphorisms (நூற்பாக்கள்) in total, while
            this particular Project Madurai etext segments into <strong>{analysis.totalSutras.toLocaleString("en-IN")}</strong>.
            Such differences are normal across manuscripts and editions and are exactly why segmentation
            confidence is recorded rather than hidden. See <Link href="/methodology">methodology</Link>.
          </div>

          <div className="grid grid-2" style={{ marginTop: "1.5rem", alignItems: "start" }}>
            <div className="card">
              <p className="eyebrow" style={{ marginTop: 0 }}>அதிகாரம் வாரியாக</p>
              <table className="data-table">
                <thead><tr><th>அதிகாரம்</th><th><Bi ta="நூற்பா" en="Aphorisms" /></th><th><Bi ta="சொற்கள்" en="Words" /></th><th><Bi ta="சரா./நூற்பா" en="Avg/aph." /></th></tr></thead>
                <tbody>
                  {analysis.perAdhikaram.map((a) => (
                    <tr key={a.id}><td>{a.tamil}</td><td>{a.sutras}</td><td>{a.words.toLocaleString("en-IN")}</td><td>{a.averageWordsPerSutra}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="muted" style={{ fontSize: "0.82rem", marginTop: "0.75rem" }}>
                Longest aphorism: {longest ? <Link href={`/sutra/${longest.id}`}>{longest.iyalEditorialTamil ?? longest.iyalTamil} {longest.displayNumber}</Link> : "—"} ({analysis && longest ? longest.wordCount : 0} words).{" "}
                Shortest: {shortest ? <Link href={`/sutra/${shortest.id}`}>{shortest.iyalEditorialTamil ?? shortest.iyalTamil} {shortest.displayNumber}</Link> : "—"}.
              </p>
            </div>

            <div className="card">
              <p className="eyebrow" style={{ marginTop: 0 }}>அடிக்கடி வரும் சொற்கள்</p>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                {analysis.topWords.slice(0, 14).map((w) => (
                  <Link key={w.word} href={`/search?q=${encodeURIComponent(w.word)}`} style={{ display: "grid", gridTemplateColumns: "7rem 1fr auto", gap: "0.5rem", alignItems: "center", color: "inherit" }}>
                    <span className="tamil-serif">{w.word}</span>
                    <span className="progress"><span style={{ width: `${(w.count / maxWord) * 100}%` }} /></span>
                    <span className="muted" style={{ fontSize: "0.8rem" }}>{w.count}</span>
                  </Link>
                ))}
              </div>
              <p className="muted" style={{ fontSize: "0.78rem", marginTop: "0.6rem" }}>Common grammatical framing words are filtered out. Click to see occurrences.</p>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1.25rem" }}>
            <p className="eyebrow" style={{ marginTop: 0 }}>எழுத்து அடிக்கடி · Letter frequency (top 30)</p>
            <div className="pill-row">
              {analysis.letterFrequency.slice(0, 30).map((l) => (
                <span key={l.word} className="chip" title={`${l.count}`} style={{ fontSize: `${0.8 + (l.count / maxLetter) * 0.9}rem` }}>
                  <span className="tamil-serif">{l.word}</span>
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="muted">Run <code>npm run import:data</code> to populate the analysis.</p>
      )}

      <div className="prose" style={{ maxWidth: "48rem", marginTop: "2rem" }}>
        <h2>Sources for the background above</h2>
        <p className="muted" style={{ fontSize: "0.9rem" }}>
          General facts about Tolkāppiyam (its status as the oldest extant Tamil grammar, the three-book /
          twenty-seven-chapter structure, the approximate total number of aphorisms (நூற்பாக்கள்), and the debated
          dating) are drawn from standard reference works, including{" "}
          <a href="https://en.wikipedia.org/wiki/Tolk%C4%81ppiyam" rel="noreferrer">Wikipedia: Tolkāppiyam</a> and{" "}
          <a href="https://www.britannica.com/topic/Tolkappiyam" rel="noreferrer">Encyclopædia Britannica: Tolkappiyam</a>.
          The source text itself is the Project Madurai etext (<Link href="/source">pmuni0100</Link>).
        </p>
      </div>
    </div>
  );
}
