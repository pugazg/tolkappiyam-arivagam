import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { parsingReport } from "@/lib/data.ts";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = { title: "முறையியல் · Methodology", description: "How the source was acquired, parsed, segmented, and how uncertainty is preserved rather than silently corrected." };

const steps: [string, string][] = [
  ["1 · Source acquisition", "The Project Madurai Unicode HTML (pmuni0100) is downloaded once and stored locally. Runtime pages never depend on live access to Project Madurai."],
  ["2 · Unicode preservation", "Text is normalised to NFC and line endings are regularised, but no Tamil character is changed, modernised, or 'corrected'. Meaningful Tamil punctuation is preserved."],
  ["3 · Structural parsing", "அதிகாரம் and இயல் headings are recognised from the source's own numbered headings (e.g. 1.1, 2.3) and validated against the expected 3 × 9 structure."],
  ["4 · நூற்பா segmentation", "Each numbered block is treated as one நூற்பா, using the source's own trailing numbers. The number within each இயல் becomes the display number."],
  ["5 · Stable identifiers", "Every நூற்பா gets a semantic ID like ezhuthu-noolmarabu-001 — never a bare array index — so links stay valid even if parsing is refined."],
  ["6 · Uncertainty handling", "When a number is attached without a separator, or a sequence jumps, the source lines are kept as-is, a confidence level is recorded, and a warning is logged."],
  ["7 · Editorial review", "Explanations, translations, commentaries, and examples are added only by human review and are flagged with an editorial status. Nothing is auto-written."],
  ["8 · Source vs. interpretation", "The interface visually separates source text from any editorial or modern-teaching layer, so the two can never be confused."],
  ["9 · Correction process", "Corrections are made in the data files (or by re-running the importer), not by rewriting UI code. Every record carries its provenance."],
  ["10 · Citation", "Every நூற்பா exposes a full and a compact citation naming the Project Madurai source, so the platform is quotable in scholarship."],
];

export default function MethodologyPage() {
  return (
    <div className="shell block prose" style={{ maxWidth: "48rem" }}>
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="முறையியல்" en="Methodology" /> }]} />
      <h1 style={{ marginTop: "1rem" }}><Bi ta="முறையியல்" en="Methodology" /></h1>
      <p className="lead"><Bi ta="நம்பகமான மின்பதிப்பு தன் முறையை வெளிப்படையாகக் கூறுவதன் மூலம் நம்பிக்கையைப் பெறுகிறது. உரை எவ்வாறு தரவாக மாறியது என்பது இதோ." en="A reliable digital edition earns trust by being explicit about method. Here is exactly how the text became data." /></p>

      <div className="notice notice-accent" style={{ fontSize: "1.05rem" }}>
        <strong><Bi ta="வழிகாட்டும் கொள்கை:" en="Guiding principle:" /></strong> <Bi ta="“ஐயம் அமைதியாகத் திருத்தப்படாமல் பாதுகாக்கப்பட வேண்டும்.”" en="“Uncertainty must be preserved, not silently corrected.”" />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        {steps.map(([title, body]) => (
          <div key={title} style={{ padding: "1.1rem 0", borderTop: "1px solid var(--line)" }}>
            <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.1rem" }}>{title}</h3>
            <p style={{ margin: 0, color: "var(--ink-soft)" }}>{body}</p>
          </div>
        ))}
      </div>

      <h2>When parsing is uncertain</h2>
      <p>The importer preserves the source lines, marks a confidence level, records a warning, and leaves the record open to later editorial correction. In the current dataset there {parsingReport.warnings.length === 1 ? "is" : "are"} <strong>{parsingReport.warnings.length}</strong> logged {parsingReport.warnings.length === 1 ? "note" : "notes"} — most are benign (e.g. a source heading spelled without a space). None involve discarding text.</p>

      <p><Link href="/source">See the source and rights →</Link> · <Link href="/understanding">Understand the work →</Link></p>
    </div>
  );
}
