"use client";
import Link from "next/link";
import { useState } from "react";
import { LanguageToggle } from "./LanguageToggle";

const links: [string, string, string][] = [
  ["/browse", "உலாவுக", "Browse"],
  ["/search", "தேடல்", "Search"],
  ["/glossary", "சொற்களஞ்சியம்", "Glossary"],
  ["/tools", "கருவிகள்", "Tools"],
  ["/understanding", "அறிமுகம்", "About the text"],
  ["/methodology", "முறையியல்", "Methodology"],
  ["/source", "மூலம்", "Source"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Home">
          <span className="b-tamil">தொல்காப்பிய அறிவகம்</span>
          <span className="b-en">Tolkāppiyam Grammar Lab</span>
        </Link>
        <LanguageToggle />
        <button className="nav-toggle" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen((v) => !v)}>
          <span aria-hidden>≡</span> <span className="i18n-ta">பட்டி</span><span className="i18n-en">Menu</span>
        </button>
        <nav id="primary-nav" className={`nav-links ${open ? "open" : ""}`} aria-label="Primary">
          {links.map(([href, ta, en]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <span className="i18n-ta">{ta}</span><span className="i18n-en">{en}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
