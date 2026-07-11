import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import { COMMENTATORS } from "@/lib/structure.ts";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = { title: "உரைகள் · Commentaries", description: "The commentary architecture and why no commentary text is ingested yet." };

export default function CommentariesPage() {
  return (
    <div className="shell block prose" style={{ maxWidth: "48rem" }}>
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="உரைகள்" en="Commentaries" /> }]} />
      <h1 style={{ marginTop: "1rem" }}><Bi ta="உரைகள்" en="Commentaries" /></h1>
      <p className="lead"><Bi ta="தொல்காப்பியத்திற்கு வளமான இடைக்கால உரைமரபு உண்டு. தரவு அமைப்பு தயார்; உரிமையும் சரிபார்ப்பும் முடியும் வரை உரை சேர்க்கப்படாது." en="Tolkāppiyam has a rich medieval commentary tradition. The data model is ready for it; the text is not added until rights and verification are settled." /></p>

      <div className="notice notice-accent">
        <strong>Empty by design.</strong> No commentary text is ingested in this release. Each classical
        commentary must be sourced from a specific edition, checked for rights, and verified before a
        single line is shown. Synthetic or paraphrased commentary is never generated.
      </div>

      <h2>Prepared commentators</h2>
      <p>The schema supports side-by-side comparison across these commentators once their editions are cleared:</p>
      <div className="grid grid-2" style={{ marginTop: "1rem" }}>
        {COMMENTATORS.map((c) => (
          <div key={c.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{c.tamil}</h3>
              <span className="badge badge-source">{c.ingestionStatus}</span>
            </div>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "0.2rem 0 0.5rem" }}>{c.english}{c.period ? ` · ${c.period}` : ""}</p>
            <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--ink-soft)" }}>{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
