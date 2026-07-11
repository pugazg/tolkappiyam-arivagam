import Link from "next/link";
import { Bi } from "./Bi";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <h4>தொல்காப்பிய அறிவகம்</h4>
          <p className="muted" style={{ maxWidth: "28rem", fontSize: "0.9rem" }}>
            <Bi
              ta="தொல்காப்பியத்திற்கான மூல அடிப்படையிலான வாசிப்பு மற்றும் ஆய்வுத் தளம். இது ஒரு சுயேச்சைத் திட்டம் — Project Madurai-வின் அதிகாரப்பூர்வ தயாரிப்பு அல்ல."
              en="A source-grounded reading and exploration platform for தொல்காப்பியம். An independent project — not an official Project Madurai product."
            />
          </p>
        </div>
        <div>
          <h4><Bi ta="உலாவுக" en="Browse" /></h4>
          <Link href="/browse"><Bi ta="அதிகாரம் · இயல்" en="Adhikaram · Iyal" /></Link>
          <Link href="/search"><Bi ta="தேடல்" en="Search" /></Link>
          <Link href="/glossary"><Bi ta="சொற்களஞ்சியம்" en="Glossary" /></Link>
          <Link href="/tools"><Bi ta="தமிழ் எழுத்துக் கருவிகள்" en="Tamil letter tools" /></Link>
        </div>
        <div>
          <h4><Bi ta="திட்டம்" en="Project" /></h4>
          <Link href="/understanding"><Bi ta="தொல்காப்பியம் அறிமுகம்" en="Understanding Tolkāppiyam" /></Link>
          <Link href="/methodology"><Bi ta="முறையியல்" en="Methodology" /></Link>
          <Link href="/source"><Bi ta="மூலமும் உரிமையும்" en="Source & rights" /></Link>
          <Link href="/about"><Bi ta="திட்டம் பற்றி" en="About" /></Link>
        </div>
        <p className="footer-note">
          <Bi
            ta={<>அடிப்படை மின்னூல்: Project Madurai <span lang="en">pmuni0100</span>. கட்டமைப்புப் பகுப்பு, இடைமுகம், பதிப்பாசிரிய கட்டமைப்பு ஆகியவை இத்திட்டத்தின் பணி. மூலத் தமிழ் மாற்றமின்றிப் பாதுகாக்கப்படுகிறது; விளக்க அடுக்குகள் தெளிவாகக் குறிக்கப்பட்டு மனித மதிப்பாய்வு தேவைப்படுகின்றன.</>}
            en={<>Base electronic text: Project Madurai <span lang="en">pmuni0100</span>. Structural parsing, interface, and editorial framework are the work of this project. Source Tamil is preserved unchanged; explanatory layers are clearly marked and require human review.</>}
          />
        </p>
      </div>
    </footer>
  );
}
