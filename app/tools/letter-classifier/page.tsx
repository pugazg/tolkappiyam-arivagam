import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { LetterClassifier } from "../../components/LetterClassifier";

export const metadata: Metadata = { title: "எழுத்து வகைப்படுத்தி · Letter Classifier", description: "Unicode-aware classification of any Tamil (or non-Tamil) character." };

export default function LetterClassifierPage() {
  return (
    <div className="shell block">
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="கருவிகள்" en="Tools" />, href: "/tools" }, { label: "எழுத்து வகைப்படுத்தி" }]} />
      <h1 style={{ marginTop: "1rem" }}>எழுத்து வகைப்படுத்தி</h1>
      <p className="lead"><Bi ta="ஒரு எழுத்தை உள்ளிட்டு அது தமிழா, அதன் code points, கூறுகள் ஆகியவற்றைக் காணுங்கள். ஆங்கிலத்தில் தட்டச்சு செய்தால் தானாகத் தமிழாக மாறும்." en="Type a character to see whether it is Tamil, its code points, and its components. Type in English and it transliterates to Tamil live." /></p>
      <div style={{ marginTop: "1.5rem" }}><LetterClassifier /></div>
    </div>
  );
}
