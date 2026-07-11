import type { Metadata } from "next";
import Link from "next/link";
import { ANI_FIGURES, ANI_GROUPS } from "@/lib/ani.ts";
import { getIyalSutras } from "@/lib/data.ts";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Bi } from "@/app/components/Bi";

export const metadata: Metadata = {
  title: "அணி இலக்கணம் · Aṇi Ilakkaṇam (Figures of speech)",
  description:
    "An educational reference to அணி (poetic figures) in the Tamil tradition — with உவமை linked to Tolkāppiyam's உவமவியல். Clearly separated from the source; the fuller அணி grammar belongs to தண்டியலங்காரம்.",
};

export default function AniPage() {
  const uvamaiCount = getIyalSutras("porul-uvamaiyiyal").length;

  return (
    <div className="shell block">
      <Breadcrumbs items={[
        { label: <Bi ta="முகப்பு" en="Home" />, href: "/" },
        { label: <Bi ta="கருவிகள்" en="Tools" />, href: "/tools" },
        { label: <Bi ta="அணி இலக்கணம்" en="Aṇi Ilakkaṇam" /> },
      ]} />
      <h1 style={{ marginTop: "1rem" }}>அணி இலக்கணம்</h1>
      <p className="muted" style={{ marginTop: "-0.4rem" }}>Aṇi Ilakkaṇam · the grammar of poetic figures</p>
      <p className="lead">
        <Bi
          ta="அணி என்பது பொருளை அழகுபடுத்தும் இலக்கிய உத்திகள். தமிழ் இலக்கணத்தின் ஐந்து பிரிவுகளுள் (எழுத்து · சொல் · பொருள் · யாப்பு · அணி) ஒன்று."
          en="Aṇi are the literary devices that beautify meaning — one of the five traditional divisions of Tamil grammar (எழுத்து · சொல் · பொருள் · யாப்பு · அணி)."
        />
      </p>

      <div className="notice notice-accent" style={{ margin: "1.25rem 0" }}>
        <Bi
          ta={<><strong>வரம்பும் மூலமும்.</strong> முழு அணி இலக்கணம் பிற்கால நூலான <strong>தண்டியலங்காரம்</strong> வழி விரிவாகக் கூறப்படுகிறது; தொல்காப்பியம் <Link href="/adhikaram/porul/porul-uvamaiyiyal">உவமவியலில்</Link> உவமையை மட்டுமே ஆள்கிறது. கீழுள்ள விளக்கங்கள் நவீன கல்வி அறிமுகங்களே — தொல்காப்பிய மூலத்தின் பகுதி அல்ல. உவமை மட்டும் மூல நூற்பாக்களுடன் இணைக்கப்பட்டுள்ளது.</>}
          en={<><strong>Scope & provenance.</strong> A full அணி இலக்கணம் is set out chiefly in the later work <strong>தண்டியலங்காரம்</strong>; Tolkāppiyam treats only உவமை (simile), in <Link href="/adhikaram/porul/porul-uvamaiyiyal">உவமவியல்</Link>. The glosses below are modern educational summaries — <em>not</em> part of the Tolkāppiyam source, and not verified scholarly definitions. Only உவமை is linked to actual நூற்பாக்கள்.</>}
        />
      </div>

      {ANI_GROUPS.map((group) => {
        const figures = ANI_FIGURES.filter((f) => f.group === group.id);
        if (!figures.length) return null;
        return (
          <section key={group.id} style={{ marginTop: "2rem" }}>
            <h2 style={{ marginBottom: "0.25rem" }}>{group.id}</h2>
            <p className="muted" style={{ marginTop: 0, fontSize: "0.9rem" }}>{group.english} — {group.note}</p>
            <div className="grid grid-2" style={{ marginTop: "1rem" }}>
              {figures.map((f) => (
                <article key={f.id} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{f.tamil}</h3>
                    {f.relatedIyalId ? (
                      <span className="badge badge-segmented"><Bi ta="மூலத் தொடர்பு" en="Source-linked" /></span>
                    ) : (
                      <span className="badge badge-review"><Bi ta="நவீன கல்வி" en="Modern educational" /></span>
                    )}
                  </div>
                  <p className="muted" style={{ fontSize: "0.82rem", margin: "0.2rem 0 0.6rem" }}>{f.transliteration} · {f.englishLabel}</p>
                  <p style={{ fontSize: "0.95rem", color: "var(--ink-soft)", margin: 0 }}>{f.gloss}</p>
                  <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.6rem" }}>
                    <Bi ta="விரிவான, சரிபார்க்கப்பட்ட விளக்கம்: விரைவில் சேர்க்கப்படும்." en="Detailed, verified definition: under editorial review." />
                  </p>
                  {f.relatedIyalId && (
                    <p style={{ margin: "0.6rem 0 0", fontSize: "0.9rem" }}>
                      <Link href={`/adhikaram/porul/${f.relatedIyalId}`}>
                        <Bi ta="தொல்காப்பியம் · உவமவியல்" en="Tolkāppiyam · Uvamaviyal" /> ({uvamaiCount} <Bi ta="நூற்பா" en="aphorisms" />) →
                      </Link>
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <div className="notice" style={{ marginTop: "2rem" }}>
        <Bi
          ta="இந்தக் கருவி ஒரு கல்வி அறிமுகக் கட்டமைப்பு. அணிகளின் விரிவான, மேற்கோள் காட்டக்கூடிய விளக்கங்கள் மனிதப் பதிப்பாசிரிய மதிப்பாய்வுக்குப் பின்பே சேர்க்கப்படும்."
          en="This is an educational framework. Detailed, citable definitions of each figure will be added only after human editorial review."
        />
      </div>
    </div>
  );
}
