import Link from "next/link";
import {
  adhikarams,
  analysis,
  getAdhikaramSutras,
  getFeaturedSutra,
  getIyalsFor,
  parsingReport,
} from "@/lib/data.ts";
import { SutraCard } from "./components/SutraCard";
import { Bi } from "@/app/components/Bi";

export default function Home() {
  const featured = getFeaturedSutra();
  return (
    <>
      <section className="shell hero">
        <div>
          <p className="eyebrow">From நூற்பா to language intelligence</p>
          <h1>
            தொல்காப்பிய அறிவகம்
            <span className="en">Tolkāppiyam Grammar Lab</span>
          </h1>
          <p className="lead">
            <Bi
              ta="தொல்காப்பியத்தின் ஒவ்வொரு நூற்பாவையும் தேடக்கூடிய, மேற்கோள் காட்டக்கூடிய, விளக்கங்களுடன் விரிவாக்கக்கூடிய அறிவுத் தொகுதியாக மாற்றும் திறந்த மின்னியல் முயற்சி."
              en="An open digital initiative that transforms every Tolkāppiyam aphorism (நூற்பா) into a searchable, citable, and extensible unit of language knowledge."
            />
          </p>
          <p className="muted" style={{ maxWidth: "44rem", marginTop: "0.75rem" }}>
            <Bi
              ta="மூல நூற்பா எப்போதும் தமிழிலேயே இருக்கும்; விளக்கங்கள், மொழிபெயர்ப்புகள், உரைகள் அனைத்தும் மனிதப் பதிப்பாசிரியரால் சரிபார்க்கப்பட்ட பிறகே சேர்க்கப்படும்."
              en="The source aphorism (நூற்பா) always stays in Tamil; explanations, translations, and commentaries are added only after a human editor has verified them."
            />
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/browse"><Bi ta="நூற்பாக்களை உலாவுக" en="Browse the aphorisms" /></Link>
            <Link className="btn btn-ghost" href="/search"><Bi ta="மூலத்தைத் தேடுக" en="Search the source" /></Link>
            <Link className="btn btn-ghost" href="/understanding"><Bi ta="தொல்காப்பியம் என்றால்?" en="What is Tolkāppiyam?" /></Link>
          </div>
        </div>
        <aside className="stat-panel" aria-label="Current dataset status">
          <div className="concept-map" aria-hidden><span>எழுத்து</span><span>சொல்</span><span>பொருள்</span></div>
          <div>
            <div className="big-number">{parsingReport.totalSutrasExtracted.toLocaleString("en-IN")}</div>
            <strong className="muted" style={{ fontSize: "0.85rem" }}><Bi ta="பிரிக்கப்பட்ட நூற்பாக்கள்" en="segmented aphorisms" /></strong>
          </div>
          <dl style={{ margin: "1rem 0 0" }}>
            <div className="stat-row"><dt><Bi ta="அதிகாரம்" en="Adhikaram" /></dt><dd>{parsingReport.totalAdhikaramsFound} / 3</dd></div>
            <div className="stat-row"><dt><Bi ta="இயல்" en="Iyal" /></dt><dd>{parsingReport.totalIyalsFound} / 27</dd></div>
            {analysis && <div className="stat-row"><dt><Bi ta="சொற்கள்" en="Words" /></dt><dd>{analysis.totalWords.toLocaleString("en-IN")}</dd></div>}
            <div className="stat-row"><dt><Bi ta="குறிப்புகள்" en="Parsing notes" /></dt><dd>{parsingReport.warnings.length}</dd></div>
          </dl>
        </aside>
      </section>

      <hr className="divider" />

      <section className="shell block">
        <p className="eyebrow"><Bi ta="அமைப்பின்படி உலாவுக" en="Browse by structure" /></p>
        <h2 style={{ marginTop: 0 }}><Bi ta="மூன்று அதிகாரங்கள் · இருபத்தேழு இயல்கள்" en="Three adhikarams · twenty-seven iyals" /></h2>
        <div className="grid grid-3" style={{ marginTop: "1.5rem" }}>
          {adhikarams.map((a, i) => {
            const iyalList = getIyalsFor(a.id);
            const count = getAdhikaramSutras(a.id).length;
            return (
              <article className="card" key={a.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="eyebrow" style={{ margin: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="muted" style={{ fontSize: "0.85rem" }}>{count} <Bi ta="நூற்பா" en="aphorisms" /></span>
                </div>
                <h3 style={{ margin: "0.3rem 0 0.1rem", fontSize: "1.4rem" }}>{a.tamil}</h3>
                <p className="muted" style={{ fontSize: "0.85rem", margin: "0 0 0.7rem" }}>{a.english}</p>
                <p style={{ fontSize: "0.95rem", color: "var(--ink-soft)" }}>{a.neutralDescription}</p>
                <div className="pill-row" style={{ marginTop: "0.8rem" }}>
                  {iyalList.map((iyal) => (
                    <Link key={iyal.id} className="chip" href={`/adhikaram/${a.id}/${iyal.id}`}>{iyal.sourceTamil ?? iyal.tamil}</Link>
                  ))}
                </div>
                <p style={{ marginTop: "1rem" }}>
                  <Link href={`/adhikaram/${a.id}`}>{a.tamil} <Bi ta="திறக்க" en="— open" /> →</Link>
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="shell block">
        <div className="grid grid-2">
          <div>
            <p className="eyebrow"><Bi ta="மாதிரி மூலம்" en="Sample source" /></p>
            <h2 style={{ marginTop: 0 }}>எழுத்ததிகாரம் · நூல் மரபு</h2>
            {featured ? <SutraCard sutra={featured} showIyal={false} /> : <p className="muted">Run the data import to populate.</p>}
          </div>
          <div className="card" style={{ background: "var(--paper-2)" }}>
            <p className="eyebrow"><Bi ta="பதிப்பாசிரிய நிலை" en="Editorial stance" /></p>
            <h2 style={{ marginTop: 0, fontSize: "1.4rem" }}><Bi ta="புனையப்பட்ட விளக்கம் இல்லை" en="No fabricated explanations" /></h2>
            <p style={{ color: "var(--ink-soft)" }}>
              <Bi
                ta="விளக்கங்கள், மொழிபெயர்ப்புகள், உரைகள், எடுத்துக்காட்டுகள் ஆகியவை மனிதப் பதிப்பாசிரியரால் சரிபார்க்கப்படும்போது மட்டுமே காட்டப்படும். மற்ற இடங்களில் இயந்திரம் உருவாக்கிய நிரப்பீட்டுக்குப் பதிலாக நேர்மையான இடக்குறிப்பைக் காண்பீர்கள். மூலத் தமிழ் ஒருபோதும் மாற்றப்படுவதில்லை."
                en="Explanations, translations, commentaries, and examples are shown only when a human editor has verified them. Everywhere else you will see an honest placeholder rather than machine-generated filler. The source Tamil is never modernised or altered."
              />
            </p>
            <p style={{ margin: 0 }}><Link href="/methodology"><Bi ta="முறையியலைப் படிக்க" en="Read the methodology" /> →</Link></p>
          </div>
        </div>
      </section>

      {analysis && (
        <section className="shell block">
          <p className="eyebrow"><Bi ta="மூலப் பகுப்பாய்வு" en="Source-derived analysis" /></p>
          <h2 style={{ marginTop: 0 }}><Bi ta="எண்களில் தொல்காப்பியம்" en="Tolkāppiyam in numbers" /></h2>
          <p className="muted" style={{ maxWidth: "44rem" }}>
            <Bi ta="மூல உரையின் மீதான இயந்திரக் கணக்கீடுகள் — விளக்கம் அல்ல, அளவிடக்கூடியவை மட்டும்." en="Mechanical counts over the source text — no interpretation, just what is measurable." />
          </p>
          <div className="grid grid-3" style={{ marginTop: "1.25rem" }}>
            {analysis.perAdhikaram.map((a) => (
              <div className="card" key={a.id}>
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}>{a.tamil}</h3>
                <dl className="kv">
                  <dt><Bi ta="நூற்பா" en="Aphorisms" /></dt><dd>{a.sutras}</dd>
                  <dt><Bi ta="சொற்கள்" en="Words" /></dt><dd>{a.words.toLocaleString("en-IN")}</dd>
                  <dt><Bi ta="தனிச் சொற்கள்" en="Unique words" /></dt><dd>{a.uniqueWords.toLocaleString("en-IN")}</dd>
                  <dt><Bi ta="சராசரி/நூற்பா" en="Avg/aphorism" /></dt><dd>{a.averageWordsPerSutra}</dd>
                </dl>
              </div>
            ))}
          </div>
          <p style={{ marginTop: "1.25rem" }}><Link href="/understanding#analysis"><Bi ta="முழுப் பகுப்பாய்வைக் காண" en="See the full analysis" /> →</Link></p>
        </section>
      )}

      <section className="shell block">
        <div className="card" style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ maxWidth: "40rem" }}>
            <p className="eyebrow"><Bi ta="தமிழ் எழுத்துக் கருவிகள்" en="Tamil letter tools" /></p>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.4rem" }}><Bi ta="மூலத்தையும் கற்பித்தல் அடுக்கையும் தெளிவாகப் பிரித்து ஆராய்க" en="Explore, keeping source and teaching layers clearly separate" /></h2>
            <p className="muted" style={{ margin: 0 }}>
              <Bi ta="கருவிகள் Unicode தமிழ் எழுத்துகளையும் அடிப்படை மாத்திரை மதிப்புகளையும் நவீன கல்வி உதவிகளாக வகைப்படுத்துகின்றன. சரிபார்க்கப்படாத வரை எந்த நூற்பாவுடனும் தொடர்பு உரிமை கோரா." en="The tools classify Unicode Tamil letters and basic மாத்திரை values as modern educational aids. They never claim a source link unless it has been verified." />
            </p>
          </div>
          <Link className="btn btn-primary" href="/tools/tamil-letters"><Bi ta="தமிழ் எழுத்துகளை ஆராய்க" en="Explore Tamil letters" /></Link>
        </div>
      </section>

      <section className="shell" style={{ paddingBottom: "3rem" }}>
        <div className="notice">
          <Bi
            ta={<>அடிப்படை மின்னூல்: Project Madurai <span lang="en">pmuni0100</span>. இத்திட்டம் சுயேச்சையானது; பதிவு அளவில் மூல வழிமூலத்தைப் பாதுகாக்கிறது; இது Project Madurai-வின் அதிகாரப்பூர்வ தயாரிப்பு அல்ல. <Link href="/source">மூல விவரம் →</Link></>}
            en={<>Base electronic text: Project Madurai <span lang="en">pmuni0100</span>. This project is independent, preserves source provenance at the record level, and is not an official Project Madurai product. <Link href="/source">View source information →</Link></>}
          />
        </div>
      </section>
    </>
  );
}
