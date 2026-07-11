import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = { title: "கருவிகள் · Tools", description: "Interactive Tamil-letter tools: explorer, classifier, and a மாத்திரை educational prototype." };

const tools = [
  { href: "/tools/tamil-letters", tamil: "தமிழ் எழுத்து ஆய்வு", en: "Tamil Letter Explorer", desc: "உயிர், மெய், உயிர்மெய், ஆய்தம் — click any letter for its Unicode and modern classification." },
  { href: "/tools/letter-classifier", tamil: "எழுத்து வகைப்படுத்தி", en: "Letter Classifier", desc: "Type any character — Tamil, Grantha, numeral, Latin, emoji — and see a Unicode-aware breakdown." },
  { href: "/tools/matra-explorer", tamil: "மாத்திரை ஆய்வு", en: "Māttirai Explorer", desc: "An educational prototype for basic short/long vowel durations. Clearly bounded, no over-claims." },
  { href: "/tools/ani-ilakkanam", tamil: "அணி இலக்கணம்", en: "Aṇi Ilakkaṇam", desc: "A reference to Tamil poetic figures (உவமை, உருவகம்…), with உவமை linked to Tolkāppiyam's உவமவியல்." },
];

export default function ToolsPage() {
  return (
    <div className="shell block">
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="கருவிகள்" en="Tools" /> }]} />
      <h1 style={{ marginTop: "1rem" }}><Bi ta="தமிழ் எழுத்துக் கருவிகள்" en="Tamil letter tools" /></h1>
      <p className="lead"><Bi ta="மூல உரையிலிருந்து தெளிவாகப் பிரிக்கப்பட்ட நவீன கல்வி உதவிகள். சரிபார்க்கப்படாத வரை எந்த நூற்பாவுக்கும் நவீன வகையை இவை இணைக்கா." en="Modern educational aids, kept explicitly separate from the source text. They never attribute a modern category to a specific aphorism unless it has been verified." /></p>
      <div className="grid grid-3" style={{ marginTop: "1.5rem" }}>
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="card card-link">
            <h3 style={{ margin: "0 0 0.15rem", fontSize: "1.2rem" }}>{t.tamil}</h3>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "0 0 0.6rem" }}>{t.en}</p>
            <p style={{ fontSize: "0.95rem", color: "var(--ink-soft)", margin: 0 }}>{t.desc}</p>
          </Link>
        ))}
      </div>
      <div className="notice" style={{ marginTop: "2rem" }}>
        <Bi ta="இக்கருவிகள் மூன்று அடுக்குகளைப் பிரித்துக் காட்டுகின்றன: (1) மூலத்தில் கூறப்பட்ட தகவல், (2) நவீன கற்பித்தல் வகைப்பாடு, (3) எதிர்கால பதிப்பாசிரிய விளக்கம். அடுக்குகள் 2, 3 ஒருபோதும் தொல்காப்பியத்தின் பகுதியாகக் காட்டப்படா." en="These tools distinguish three layers: (1) information stated in the source, (2) modern pedagogical classification, and (3) future editorial explanation. Layers 2 and 3 are never presented as part of Tolkāppiyam." />
      </div>
    </div>
  );
}
