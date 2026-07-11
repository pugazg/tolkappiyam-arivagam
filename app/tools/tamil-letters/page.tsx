import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { TamilLetterExplorer } from "../../components/TamilLetterExplorer";

export const metadata: Metadata = { title: "தமிழ் எழுத்து ஆய்வு · Tamil Letter Explorer", description: "Explore Tamil vowels, consonants, and உயிர்மெய் combinations with Unicode detail." };

export default function TamilLettersPage() {
  return (
    <div className="shell block">
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="கருவிகள்" en="Tools" />, href: "/tools" }, { label: "தமிழ் எழுத்து ஆய்வு" }]} />
      <h1 style={{ marginTop: "1rem" }}>தமிழ் எழுத்து ஆய்வு</h1>
      <p className="lead"><Bi ta="எந்த எழுத்தையும் சொடுக்கி அதன் வகை, Unicode மதிப்பு, மற்றும் — சேர்க்கப்பட்ட இடத்தில் — சரிபார்க்கப்பட்ட மூலத் தொடர்பைக் காணுங்கள்." en="Click any letter to see its category, Unicode value, and — where added — its verified source relation." /></p>
      <div style={{ marginTop: "1.5rem" }}><TamilLetterExplorer /></div>
    </div>
  );
}
