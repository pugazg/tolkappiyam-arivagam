import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tolkappiyam-arivagam.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "தொல்காப்பிய அறிவகம் · Tolkāppiyam Grammar Lab",
    template: "%s · தொல்காப்பிய அறிவகம்",
  },
  description:
    "An open digital initiative that turns every Tolkāppiyam நூற்பா into a searchable, citable, and extensible unit of Tamil language knowledge — grounded in the Project Madurai source text.",
  keywords: ["Tolkappiyam", "தொல்காப்பியம்", "Tamil grammar", "நூற்பா", "Project Madurai", "எழுத்து", "சொல்", "பொருள்"],
  openGraph: {
    title: "தொல்காப்பிய அறிவகம் · Tolkāppiyam Grammar Lab",
    description: "Every Tolkāppiyam aphorism (நூற்பா) as a searchable, citable unit of language knowledge.",
    locale: "ta_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta" data-lang="ta" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{var l=localStorage.getItem('tk-lang');if(l==='en'||l==='ta')document.documentElement.setAttribute('data-lang',l);}catch(e){}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600&family=Noto+Serif+Tamil:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">உள்ளடக்கத்திற்குச் செல் · Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
