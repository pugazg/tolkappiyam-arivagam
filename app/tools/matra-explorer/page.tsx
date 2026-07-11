import type { Metadata } from "next";
import { Bi } from "@/app/components/Bi";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { MatraExplorer } from "../../components/MatraExplorer";

export const metadata: Metadata = { title: "மாத்திரை ஆய்வு · Māttirai Explorer", description: "An educational prototype for basic Tamil vowel durations (மாத்திரை)." };

export default function MatraExplorerPage() {
  return (
    <div className="shell block">
      <Breadcrumbs items={[{ label: <Bi ta="முகப்பு" en="Home" />, href: "/" }, { label: <Bi ta="கருவிகள்" en="Tools" />, href: "/tools" }, { label: "மாத்திரை ஆய்வு" }]} />
      <h1 style={{ marginTop: "1rem" }}>மாத்திரை ஆய்வு</h1>
      <p className="lead"><Bi ta="எல்லைக்குட்பட்ட, நேர்மையான முன்மாதிரி: வெளிப்படையாக என்கோடு செய்யப்பட்ட கால அளவுகளை மட்டுமே கணக்கிடும்." en="A bounded, honest prototype: it counts only the durations it has explicitly encoded." /></p>
      <div style={{ marginTop: "1.5rem" }}><MatraExplorer /></div>
    </div>
  );
}
