import Link from "next/link";
import { Bi } from "@/app/components/Bi";
export default function NotFound() {
  return (
    <div className="shell block" style={{ textAlign: "center", padding: "5rem 1rem" }}>
      <p className="eyebrow">404</p>
      <h1><Bi ta="இந்தப் பக்கம் இல்லை" en="Page not found" /></h1>
      <p className="muted"><Bi ta="நீங்கள் தேடும் பக்கம் கிடைக்கவில்லை." en="The page you are looking for could not be found." /></p>
      <div className="hero-actions" style={{ marginTop: "1.5rem", justifyContent: "center" }}>
        <Link className="btn btn-primary" href="/"><Bi ta="முகப்பு" en="Home" /></Link>
        <Link className="btn btn-ghost" href="/browse"><Bi ta="உலாவுக" en="Browse" /></Link>
        <Link className="btn btn-ghost" href="/search"><Bi ta="தேடல்" en="Search" /></Link>
      </div>
    </div>
  );
}
