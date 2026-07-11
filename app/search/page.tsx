import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { adhikarams, iyals, searchSutras } from "@/lib/data.ts";
import { highlightSegments } from "@/lib/search.ts";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { StatusBadge } from "../components/Badges";
import { TranslitInput } from "../components/TranslitInput";

export const metadata: Metadata = {
  title: "தேடல் · Search",
  description: "Search the Tolkāppiyam source text, concepts, and identifiers with Tamil-aware matching and filters.",
};

type SP = Promise<{ q?: string; adhikaram?: string; iyal?: string; status?: string; exact?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const filters = {
    adhikaramId: sp.adhikaram || null,
    iyalId: sp.iyal || null,
    editorialStatus: sp.status || null,
    exact: sp.exact === "1",
  };
  const hits = q ? searchSutras(q, filters) : [];
  const iyalOptions = filters.adhikaramId ? iyals.filter((i) => i.adhikaramId === filters.adhikaramId) : iyals;

  return (
    <div className="shell block">
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="தேடல்" en="Search" /> }]} />
      <h1 style={{ marginTop: "1rem" }}><Bi ta="மூலத்தைத் தேடுக" en="Search the source" /></h1>
      <p className="lead"><Bi ta="மூல உரை, அதிகாரம்/இயல் பெயர்கள், கருத்துகள், நிலையான அடையாளங்கள் மீது தமிழ் அறிந்த தேடல்." en="Tamil-aware search over the original text, அதிகாரம்/இயல் names, concepts, and stable IDs." /></p>

      <form method="get" className="card" style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
        <TranslitInput
          id="site-search"
          name="q"
          ariaLabel="Search query"
          initialTamil={q}
          fullWidth
          compact
          placeholder="எ.கா. உயிர், மெய், புணர்ச்சி — or type in English (uyir, mey…)"
        />
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <select className="field" name="adhikaram" defaultValue={filters.adhikaramId ?? ""} style={{ maxWidth: "16rem" }} aria-label="Filter by அதிகாரம்">
            <option value="">{"— " }அதிகாரம்{" (all)"}</option>
            {adhikarams.map((a) => <option key={a.id} value={a.id}>{a.tamil}</option>)}
          </select>
          <select className="field" name="iyal" defaultValue={filters.iyalId ?? ""} style={{ maxWidth: "16rem" }} aria-label="Filter by இயல்">
            <option value="">{"— "}இயல்{" (all)"}</option>
            {iyalOptions.map((i) => <option key={i.id} value={i.id}>{i.sourceTamil ?? i.tamil}</option>)}
          </select>
          <select className="field" name="status" defaultValue={filters.editorialStatus ?? ""} style={{ maxWidth: "14rem" }} aria-label="Filter by editorial status">
            <option value="">{"— status (all)"}</option>
            <option value="segmented">Segmented</option>
            <option value="reviewed">Reviewed</option>
            <option value="verified">Verified</option>
          </select>
          <label className="chip" style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", cursor: "pointer" }}>
            <input type="checkbox" name="exact" value="1" defaultChecked={filters.exact} /> <Bi ta="சரியான சொற்றொடர்" en="Exact phrase" />
          </label>
          <button className="btn btn-primary" type="submit"><Bi ta="தேடு" en="Search" /></button>
        </div>
      </form>

      {q && (
        <p className="muted" style={{ marginTop: "1.25rem" }}>
          <strong>{hits.length}</strong> <Bi ta={hits.length === 1 ? "முடிவு" : "முடிவுகள்"} en={hits.length === 1 ? "result" : "results"} /> · “{q}”
        </p>
      )}

      {q && hits.length === 0 && (
        <div className="placeholder" style={{ marginTop: "1rem" }}>
          <p style={{ margin: "0 0 0.4rem" }} className="tamil"><Bi ta="பொருந்தும் நூற்பா இல்லை." en="No matching aphorism." /></p>
          <p style={{ margin: 0, fontSize: "0.9rem" }}><Bi ta="ஒற்றைத் தமிழ்ச் சொல்லை முயற்சிக்கவும், வடிகட்டியை நீக்கவும், அல்லது சரியான-சொற்றொடர் பொருத்தத்தை அணைக்கவும். எண்கள் நூற்பா எண்களுடன் பொருந்தும்." en="Try a single Tamil word, remove a filter, or turn off exact-phrase matching. Numbers match aphorism numbers." /></p>
        </div>
      )}

      {!q && (
        <div className="notice" style={{ marginTop: "1.25rem" }}>
          <Bi ta="தொடங்க ஒரு தமிழ்ச் சொல்லை உள்ளிடுக. தேடல் உள்ளடங்கிய தரவுத் தொகுப்பின் மீது இயங்கும் — வெளி சேவை இல்லை, Project Madurai மீது நேரடிச் சார்பும் இல்லை." en="Enter a Tamil word to begin. Search runs over the checked-in dataset — no external service, no live dependency on Project Madurai." />
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        {hits.slice(0, 120).map(({ sutra, matchedIn }) => (
          <Link key={sutra.id} href={`/sutra/${sutra.id}`} className="card card-link" style={{ display: "block", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.5rem" }}>
              <span className="muted" style={{ fontSize: "0.85rem" }}>
                {sutra.adhikaramTamil} · {sutra.iyalEditorialTamil ?? sutra.iyalTamil} · நூற்பா {sutra.displayNumber}
              </span>
              <StatusBadge status={sutra.editorialStatus} />
            </div>
            <p className="tamil-serif" style={{ margin: 0, fontSize: "1.1rem", lineHeight: 1.9 }}>
              {highlightSegments(sutra.originalLines.join(" "), filters.exact ? q : q).map((seg, k) =>
                seg.match ? <mark key={k}>{seg.text}</mark> : <span key={k}>{seg.text}</span>,
              )}
            </p>
            {matchedIn.length > 0 && (
              <p className="muted" style={{ fontSize: "0.78rem", marginTop: "0.5rem" }}><Bi ta="பொருந்தியவை" en="Matched in" />: {matchedIn.join(", ")}</p>
            )}
          </Link>
        ))}
        {hits.length > 120 && <p className="muted">Showing first 120 of {hits.length}. Refine with filters.</p>}
      </div>
    </div>
  );
}
