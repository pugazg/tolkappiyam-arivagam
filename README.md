# தொல்காப்பிய அறிவகம் · Tolkāppiyam Grammar Lab

**From நூற்பா to language intelligence.**

A source-grounded web platform that turns the Project Madurai Unicode text of
**தொல்காப்பியம்** into a structured, searchable, citable, and extensible digital
grammar — treating every நூற்பா (aphorism) as an individually addressable unit of knowledge.

This is an independent project. It is **not** an official Project Madurai product.

> **Terminology:** a **நூற்பா** (*nūṟpā*) is rendered in English as an **aphorism** — the terse, aphoristic rule-form of the text (the Tamil counterpart of the Sanskrit *sūtra*).

---

## What is real in this release

- **Complete structure** — 3 அதிகாரங்கள் × 9 இயல்கள் (27), parsed and validated from the source.
- **~1,600 நூற்பாக்கள் (aphorisms)** segmented from the source with the source's own numbering, each with a
  stable semantic ID (e.g. `ezhuthu-noolmarabu-001`) and its own indexable page.
- **Tamil-aware search** over original text, அதிகாரம்/இயல், concepts, and IDs — with filters,
  exact-phrase mode, highlighting, and URL parameters. No external search service.
- **Source-derived analysis** — word counts, unique-word counts, per-அதிகாரம் breakdowns,
  frequent words, and letter frequency, computed at build time (measurement, never interpretation).
- **Glossary framework** linking technical terms to their real occurrences in the source.
- **Tamil tools** — Letter Explorer, Unicode-aware Letter Classifier, and a bounded மாத்திரை prototype.
- **Understanding, Methodology, Source & Rights, Commentaries** pages with honest scoping.
- **SEO** — per-aphorism metadata, canonical URLs, Open Graph, JSON-LD, sitemap, robots.
- **Accessibility** — semantic headings, skip link, keyboard-navigable tabs, visible focus,
  reduced-motion handling, and no colour-only signalling.

Explanations, translations, commentaries, examples, transliteration, and audio are intentionally
left as clearly-marked editorial placeholders ("விரைவில் சேர்க்கப்படும்" / "under editorial review")
until a human has verified them. **The source Tamil is never altered, modernised, or generated.**

---

## Technical stack

- **Next.js (App Router)** with static generation for all source content
- **React + TypeScript**
- **Tailwind CSS v4** plus a small hand-authored editorial design system (`app/globals.css`)
- Checked-in / build-time-generated JSON content — **no database, no live dependency on Project Madurai**
- Deploys cleanly to **Vercel**

---

## Getting started

```bash
npm install
npm run dev      # predev regenerates data if missing, then starts the dev server
```

Open http://localhost:3000.

### Data generation

The app renders from JSON in `data/generated/`. That JSON is produced by parsing the Project
Madurai source (`pmuni0100`). The importer finds the source in this order:

1. `data/source/project-madurai-pmuni0100.html` (this project), else
2. `../data/source/project-madurai-pmuni0100.html` (the authoritative copy in the parent Codex
   folder — copied in automatically on first run so the project becomes self-contained), else
3. downloaded from Project Madurai when run with `--fetch`.

```bash
npm run import:data            # parse local/parent source → data/generated/*
npm run import:data -- --fetch # download the source from Project Madurai, then parse
```

Generated files:

```text
data/generated/
  work.json            # work metadata + preserved source header
  sections.json        # adhikarams + iyals (with source-vs-editorial headings)
  sutras.json          # every நூற்பா record
  glossary.json        # glossary terms with occurrences + related aphorisms
  analysis.json        # build-time source measurements
  parsing-report.json  # counts, confidence, and warnings
```

The source HTML (`data/source/*.html`) and the parsed dataset (`data/generated/*.json`) are committed to the repo, so the build reads local files and never fetches from Project Madurai. Regenerate them any time with `npm run import:data`.
For a committed deployment, run `npm run import:data` once and commit `data/` (or rely on the
`prebuild` step, which regenerates automatically — use `-- --fetch` on CI without the local source).

### Commands

```bash
npm run dev         # dev server (auto-generates data if missing)
npm run import:data # (re)generate structured data from the source
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # node --test (parser, Tamil utils, search)
npm run build       # production build (prebuild regenerates data if missing)
```

---

## Deploying to Vercel

1. Push this folder to a Git repository.
2. Import it into Vercel (Framework preset: **Next.js**).
3. Set `NEXT_PUBLIC_SITE_URL` to your production URL (used for canonical links and the sitemap).
4. Ensure data is available at build time — either commit `data/generated/*`, **or** keep the
   default `prebuild` step and adjust `scripts/import-tolkappiyam.mjs` invocation to `--fetch` in
   your build command if the source file is not committed.

Node ≥ 20.9 is required (the scripts use Node's native TypeScript execution).

---

## Editorial safeguards

- Never invent a commentary, translation, or explanation.
- Never silently modernise or replace source text; uncertainty is recorded, not corrected.
- Never claim scholarly consensus without evidence; dating and interpretation are presented as open.
- Source text, editorial annotation, and modern teaching material are always visually distinct.
- Provenance is preserved at the record level; parsing confidence and warnings are surfaced.
- All interpretive layers are editable through the data files without touching UI code.

---

## Source & attribution

Base electronic text: **Project Madurai** electronic text `pmuni0100`.

- Etext preparation & PDF version: Dr. K. Kalyanasundaram, Lausanne, Switzerland
- Proof-reading & web version: Mr. N. D. Logasundaram, Chennai, Tamilnadu
- © Project Madurai, 1998–2024

The original Project Madurai header is preserved in the local source file. Consult Project Madurai's
own distribution conditions before redistributing the base text. Background facts on the /understanding
page are drawn from standard references (Wikipedia, Encyclopædia Britannica) and cited there.

---

## Known limitations

- Explanations, translations, transliteration, commentaries, examples, and audio are placeholders
  pending human editorial work.
- The மாத்திரை tool distinguishes **nominal** (isolated) from **contextual** (word-level) மாத்திரை, and implements word-final **குற்றியலுகரம்** (e.g. வீடு = 2½). It is a bounded prototype — non-initial ஐ/ஔ (குறுக்கம்), குற்றியலிகரம், அளபெடை, and மகர/ஆய்தக் குறுக்கம் return an explicit "needs further analysis" rather than a contested total. See `docs/matra.md`.
- Modern letter classifications are teaching aids, not automatically attributed to any நூற்பா (aphorism).
- Aphorism (நூற்பா) counts differ slightly across editions; this dataset reflects the pmuni0100 segmentation.

## Roadmap

Word-level annotation → verified explanations → rights-cleared commentaries (side-by-side) →
Tamil/English translations → audio → Sangam examples → Tolkāppiyam–Nannūl comparison → thinai atlas
→ downloadable datasets & public API → citation-grounded assistant (only after the layers above exist).
