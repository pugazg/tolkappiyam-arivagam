# CLAUDE.md — தொல்காப்பிய அறிவகம் / Tolkāppiyam Grammar Lab

Persistent context for every session. These are **non-negotiable**. If a request
conflicts with anything here, stop and raise the conflict rather than proceeding.

Companion docs: `HANDOVER.md`, `docs/EDITORIAL_ARCHITECTURE.md`,
`docs/TERMINOLOGY.md`, `README.md`.

---

## 1. Source integrity

- **The Project Madurai source text (`pmuni0100`) is immutable.** Never modernise,
  normalise, "correct", or otherwise alter source Tamil — not spelling, not
  sandhi, not punctuation, not line breaks.
- **`data/generated/**` is importer-owned.** Only `scripts/import-tolkappiyam.mjs`
  writes there. Never hand-edit it, and never treat an edit there as durable —
  the next `npm run import:data` overwrites it.
- **Human editorial content must never be written into generated or source
  files.** It lives only under `data/editorial/**`. This is what makes re-import
  safe.
- **Stable IDs must not change.** `ezhuthu-noolmarabu-001` and friends are public,
  citable identifiers backing `/sutra/<id>` and `/api/sutra/<id>`. An ID change
  breaks citations and permalinks. Treat renaming an ID as a breaking change
  requiring explicit approval.

## 2. Corpus invariants

Authoritative counts, from `data/generated/parsing-report.json`:

| Invariant | Value |
|---|---|
| அதிகாரங்கள் | **3** |
| இயல்கள் | **27** |
| நூற்பா | **1,602** |
| High confidence | **1,597** |
| Medium confidence | **5** |
| Low confidence | **0** |
| Parsing warnings | **12** (all benign) |

**Any drift in these counts requires an explicit explanation and a STOP.** Do not
"fix" a count by adjusting the parser to hit the expected number. Report what
changed, why, and wait for a decision.

## 3. Layer separation

These five layers must remain **visibly and structurally distinct** — in the data
model, in the types, and in the UI:

| Layer | Directory | Owner | Types |
|---|---|---|---|
| Source (verbatim) | `data/source/` | importer | — |
| Parser-derived | `data/generated/` | importer | `SutraRecord` (`lib/types.ts`) |
| Machine-derived | `data/derived/` | tooling | `SutraDerivedMetadata` (`lib/layers.ts`) |
| Editorial (human) | `data/editorial/sutras/` | editors | `SutraEditorialAnnotation` (`lib/layers.ts`) |
| Modern pedagogy | code (`lib/{tamil,matra}.ts`) | maintainers | letter classes, mātrā model |

Never flatten layers into one another. The merge model
(`buildSutraViewModel` in `lib/editorial.ts`) preserves provenance by design —
keep it that way.

Two distinctions that are routinely confused and must not be:

- **Transliteration is not English translation.** Romanisation is a reading aid
  over the *same* Tamil text. It is never a substitute for, or presented as, an
  English explanation.
- **Editorial verification status is separate from parsing confidence.**
  `parsingConfidence` (high/medium/low) describes how reliably the *importer*
  segmented the text. `EditorialAnnotationStatus`
  (not-started/draft/reviewed/verified) describes *human* review. A
  high-confidence parse says nothing about editorial verification, and vice
  versa. Never merge, derive, or display one as the other.

## 4. Honesty rules

- **Never invent commentary, translation, explanation, citation, dates, examples,
  or scholarly consensus.** Not as a placeholder, not as a demo, not "to be
  replaced later". Absent content renders an honest placeholder
  ("விரைவில் சேர்க்கப்படும்" / "under editorial review").
- **Never place placeholder or fixture prose in production editorial files.**
- **No meaningful Tamil grapheme may be silently dropped by analysis tools.** If
  a tool cannot classify a character (Grantha, extended, or otherwise), it must
  say so explicitly — surfacing it under a clearly-labelled rule such as "modern
  extended" — rather than skipping it or under-counting.
- **Unsupported analysis must not return a definitive result.** If the rules in
  the source do not cover an input, return an explicit "not determined" with the
  reason. Never fabricate a confident answer to fill a gap.
- **No fake AI assistant.** No simulated scholarly voice.

## 5. Code conventions

- **All internal content routes go through `lib/routes.ts` helpers**
  (`getSutraPath`, `getIyalPath`, `getAdhikaramPath`, …). Do not hard-code
  internal href strings — canonical routes must not be able to silently drift or
  404. (`tests/routes.test.mjs` guards this, including the நூல் மரபு canonical
  regression.)
- Route user-facing terminology through `lib/terminology.ts` rather than
  scattering literal term strings across components.
- TypeScript is strict. Do not weaken types, exclude app source from
  typechecking, or cast generated JSON to loosen it. (See `HANDOVER.md` §7 — a
  past slow-`tsc` incident was **iCloud I/O**, never a type problem.)

## 6. Definition of done

A phase is not complete until **all** of these pass:

```bash
npm run import:data        # and the §2 invariants still hold exactly
npm run validate:editorial
npm run typecheck
npm run lint
npm test
npm run build
```

Never declare a phase complete on an unverified build.

## 7. Environment

- **Active code lives under `~/Developer`, not `~/Documents`.** iCloud "Desktop &
  Documents" sync evicts `node_modules` into cloud placeholders, which once
  turned a 0.03s typecheck into a 13-minute one. Keep the repo — and especially
  `node_modules` — on a local, non-synced path.
- Large archival/research outputs may live outside the repo, but the **deployed
  runtime must never depend on a local absolute path**. Anything the build or
  runtime needs is committed to the repo (this is why `data/generated/**` and
  `data/source/**` are checked in — the build never fetches from Project Madurai).

## 8. Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 (strict) ·
Tailwind v4 · no database · checked-in generated data · Node 22 · Vercel.
