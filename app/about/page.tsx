import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { work } from "@/lib/data.ts";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = { title: "திட்டம் பற்றி · About", description: "The purpose, principles, and roadmap of the Tolkāppiyam Grammar Lab." };

export default function AboutPage() {
  return (
    <div className="shell block prose" style={{ maxWidth: "48rem" }}>
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="திட்டம் பற்றி" en="About" /> }]} />
      <h1 style={{ marginTop: "1rem" }}><Bi ta="திட்டம் பற்றி" en="About the project" /></h1>
      <p className="lead"><Bi ta="தொல்காப்பிய அறிவகம் — Project Madurai-வின் தொல்காப்பிய உரையை, ஒவ்வொரு நூற்பாவாக, கட்டமைக்கப்பட்ட, தேடக்கூடிய, மேற்கோள் காட்டக்கூடிய அறிவுத் தளமாக மாற்றுகிறது." en="தொல்காப்பிய அறிவகம் turns the Project Madurai text of Tolkāppiyam into a structured, searchable, citable knowledge platform — one aphorism (நூற்பா) at a time." /></p>

      <h2>Why</h2>
      <p>Tolkāppiyam is the oldest surviving Tamil grammar and one of the foundational texts of Tamil literary culture. A plain electronic text is invaluable, but it is hard to navigate, cite, and study at the level of the individual நூற்பா. This project treats every நூற்பா as an addressable unit of knowledge that can carry — over time — word separation, explanations, transliteration, commentary references, and examples, each verified by human editors.</p>

      <h2>Editorial principles</h2>
      <ul>{work.editorialPrinciples.map((p, i) => <li key={i}>{p}</li>)}</ul>

      <h2>What is real today</h2>
      <p>The structure, segmentation, search, glossary framework, letter tools, and source/methodology documentation are all functional and grounded in the source. The scholarly layers (explanations, translations, commentaries, audio) are intentionally left as honest placeholders until they are written and reviewed. This site never presents generated text as part of Tolkāppiyam.</p>

      <h2>Roadmap</h2>
      <p>Planned layers, in rough order: word-level annotation; verified simple/detailed explanations; rights-cleared public-domain commentaries with side-by-side comparison; Tamil and English translations; audio; Sangam-literature examples; a Tolkāppiyam–Nannūl comparison; a thinai atlas; downloadable datasets and a public API; and, only after those layers exist, a citation-grounded assistant.</p>

      <p><Link href="/understanding">தொல்காப்பியம் அறிமுகம் →</Link> · <Link href="/methodology">முறையியல் →</Link></p>
    </div>
  );
}
