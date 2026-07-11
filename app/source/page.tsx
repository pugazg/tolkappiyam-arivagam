import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { work, parsingReport } from "@/lib/data.ts";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = { title: "மூலமும் உரிமையும் · Source & Rights", description: "The Project Madurai source, attribution, and the boundary between source text and editorial additions." };

export default function SourcePage() {
  const src = work.source;
  return (
    <div className="shell block prose" style={{ maxWidth: "48rem" }}>
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="மூலம்" en="Source" /> }]} />
      <h1 style={{ marginTop: "1rem" }}><Bi ta="மூலமும் உரிமையும்" en="Source & rights" /></h1>
      <p className="lead"><Bi ta="உரை எங்கிருந்து வருகிறது, யார் தயாரித்தார்கள், இத்திட்டம் எதை மாற்றியது, எதை மாற்றவில்லை என்பதைத் துல்லியமாக." en="Where the text comes from, who prepared it, and exactly what this project has and has not changed." /></p>

      <h2>Source edition</h2>
      <dl className="kv">
        <dt>Publisher</dt><dd>Project Madurai</dd>
        <dt>Source ID</dt><dd><code>{src.sourceId}</code></dd>
        <dt>Title</dt><dd>தொல்காப்பியர் அருளிய தொல்காப்பியம் (moolam)</dd>
        <dt>URL</dt><dd><a href={src.url} rel="noreferrer">{src.url}</a></dd>
      </dl>

      <h2>Attribution from the source header</h2>
      {src.acknowledgementText ? (
        <pre className="notice" style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{src.acknowledgementText}</pre>
      ) : (
        <p className="notice" style={{ whiteSpace: "pre-wrap" }}>
          Etext preparation & PDF version: Dr. K. Kalyanasundaram, Lausanne, Switzerland.{"\n"}
          Proof-reading & web version: Mr. N. D. Logasundaram, Chennai, Tamilnadu.{"\n"}
          © Project Madurai, 1998–2024.
        </p>
      )}
      <p className="muted">The original Project Madurai header is preserved verbatim in the local source file and is not altered by this project.</p>

      <h2>What this project transformed</h2>
      <p>Starting only from the electronic text, this project:</p>
      <ul>
        <li>identified the three அதிகாரங்கள் and 27 இயல்கள் from the source headings;</li>
        <li>segmented {parsingReport.totalSutrasExtracted.toLocaleString("en-IN")} numbered aphorism (நூற்பா) blocks, keeping the source’s own numbering;</li>
        <li>assigned each நூற்பா a stable, semantic identifier;</li>
        <li>recorded parsing confidence and warnings instead of silently correcting anything;</li>
        <li>added navigation, search, a glossary framework, and Tamil-letter tools around the text.</li>
      </ul>

      <h2>Source vs. editorial additions</h2>
      <p>The Tamil நூற்பா text on every page is the Project Madurai source, preserved unchanged. Everything interpretive — simple/detailed explanations, English, word-separation, commentary, examples — is a clearly labelled editorial layer shown only when a human has verified it. Elsewhere you will see honest placeholders.</p>

      <h2>Rights and reuse</h2>
      <p>The source header states you are welcome to freely distribute the file provided the header page is kept intact. This project does <strong>not</strong> assert any additional licence over the base text, and does not claim a Creative Commons licence on your behalf. For redistribution of the base electronic text, consult Project Madurai’s own distribution conditions at <a href="https://www.projectmadurai.org/" rel="noreferrer">projectmadurai.org</a>.</p>
      <p>Structural parsing, data schemas, and the interface are the work of this project. Future commentary editions (இளம்பூரணர், சேனாவரையர், and others) will be evaluated for rights and verification <em>separately</em> before any text is added — see <Link href="/commentaries">commentaries</Link>.</p>

      <div className="notice notice-accent">
        This is an independent project. It is not affiliated with, endorsed by, or an official product of Project Madurai.
      </div>
    </div>
  );
}
