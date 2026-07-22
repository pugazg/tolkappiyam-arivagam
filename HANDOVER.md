# Project handover — தொல்காப்பிய அறிவகம் / Tolkāppiyam Grammar Lab

Handover for continuing this project in **Claude Code**. Read this first, then
`docs/EDITORIAL_ARCHITECTURE.md`, `docs/TERMINOLOGY.md`, and `README.md`.

> **Why this matters for Claude Code:** the previous work happened in Cowork,
> whose sandbox could **not** run `npm`/`git` against the folder. **Claude Code
> runs locally on the Mac**, so it *can* run typecheck/lint/test/build and push —
> which is exactly what's needed next. Several edits below are written but **not
> yet verified by a real build**. **Your first job is to verify the build.**

---

## 0. Do these first (in order)

1. **Verify the build.** The repo is **no longer iCloud-managed**, so the
   13-minute `tsc` I/O problem should be gone (see §7 for history). If the folder
   still sits under `~/Documents`, just confirm iCloud "Desktop & Documents"
   sync stays off and the files remain locally resident.
2. `npm ci` (clean install).
3. Run the full suite and fix anything it flags:
   ```bash
   npm run import:data && npm run validate:editorial && npm run typecheck && npm run lint && npm test && npm run build
   ```
   Expect `tsc` to finish in seconds now (real check time was only 0.03s).
4. Commit + push (Claude Code can do this locally):
   ```bash
   git add -A && git commit -m "Verify hardening pass; fix build errors" && git push
   ```
5. Only then consider Phase 3 (see §9).

---

## 1. What this is

An open, source-grounded digital edition + exploration platform for
**Tolkāppiyam**, built from the Project Madurai e-text `pmuni0100`. Every நூற்பா
is an individually addressable, citable unit (`/sutra/<id>`). Live on Vercel
(`tholkappiyam.vercel.app`).

**Non-negotiable editorial safeguards (never violate):**
- Never invent explanations, translations, commentaries, examples, or dates.
- Never modernise/alter source Tamil. Empty interpretive fields render honest
  placeholders ("விரைவில் சேர்க்கப்படும்" / "under editorial review").
- Keep source, machine-derived, editorial, and modern-pedagogy layers visibly
  distinct. No fake AI assistant.

## 2. Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 (strict) ·
Tailwind v4 · no database · checked-in generated data · Node 22 · deploy: Vercel.

## 3. Run / commands

```bash
npm run dev              # predev regenerates data if missing
npm run import:data      # parse source → data/generated/*  (also: -- --fetch)
npm run validate:editorial
npm run typecheck        # tsc --noEmit
npm run lint             # eslint
npm test                 # node --test tests/*.test.mjs
npm run build            # next build (prebuild ensures data)
```

## 4. Data-layer architecture (the important part)

| Layer | Directory | Owner | Types |
|---|---|---|---|
| Source (verbatim) | `data/source/` | importer | — |
| Parser-derived | `data/generated/` | importer | `SutraRecord` etc. (`lib/types.ts`) |
| Machine-derived | `data/derived/` | tooling | `SutraDerivedMetadata` (`lib/layers.ts`) |
| Editorial (human) | `data/editorial/sutras/` | editors | `SutraEditorialAnnotation` (`lib/layers.ts`) |
| Review history | `data/editorial/review-history/` | editors | `EditorialRevision[]` |

**Rule:** `data/generated/**` + `data/source/**` are importer-owned. Human
editorial content lives only under `data/editorial/**` so `import:data` can never
destroy it. Read/merge model: `lib/editorial.ts` (`buildSutraViewModel`). Full
detail: `docs/EDITORIAL_ARCHITECTURE.md`.

The source `.md`/HTML is at `data/source/` (importer auto-detects any `.md/.txt/.html`).

## 5. Corpus invariants (verify these never drift)

3 அதிகாரம், 27 இயல், **1,602 நூற்பா**; **1,597 high / 5 medium / 0 low** confidence;
**12** parsing warnings (all benign). Source: `data/generated/parsing-report.json`.
Stable IDs are semantic (`ezhuthu-noolmarabu-001`); numbering is sequential per
இயல் (zero sequence-mismatch warnings ⇒ IDs unique). If any count changes after
`import:data`, STOP and explain why.

## 6. Key files

- Data pipeline: `lib/{types,structure,parser,analysis,data,search,citation}.ts`, `scripts/import-tolkappiyam.mjs`, `scripts/ensure-data.mjs`.
- Phase-3 architecture (new, additive, typechecked in isolation): `lib/{layers,editorial,terminology,routes}.ts`, `scripts/validate-editorial.mjs`.
- Tamil tooling: `lib/{tamil,matra,transliterate}.ts`.
- UI: `app/**` (pages), `app/components/**`, `app/globals.css`.
- i18n: `data-lang` on `<html>` + `lib/useUiLang.ts` + CSS `.i18n-ta/.i18n-en` via `app/components/Bi.tsx` + `LanguageToggle.tsx`. `UiLanguage = "ta"|"en"`. **Transliteration (`TranslitInput.tsx`) is a separate reading aid, not a language state.**
- Tests: `tests/{parser,tamil,search,transliterate,matra,matra-grantha,editorial-architecture,routes}.test.mjs`.
- Docs: `docs/EDITORIAL_ARCHITECTURE.md`, `docs/TERMINOLOGY.md`, `README.md`.

## 7. Resolved — the 13-minute `tsc` was iCloud I/O (history + troubleshooting)

**Status: resolved** (the repo is no longer iCloud-managed). Keep this as a
reference in case it recurs.

Extended diagnostics showed `Check time 0.03s` but `I/O Read time 795s` at ~0% CPU
over 14 min — i.e. **blocked filesystem reads, not type-checking**. Cause: the repo
was under `~/Documents/…`, synced by **iCloud Drive (Desktop & Documents + Optimize
Storage)**; `node_modules` files were cloud-evicted placeholders, so TypeScript's
first reads blocked on File Provider on-demand hydration. It was never a compiler,
type, or `sutras.json` problem — do **not** weaken types, exclude app source, or
cast the JSON.

If a slow `tsc` ever returns, this is the signature to check (high `I/O Read time`
+ ~0% CPU), and the confirmation commands on the Mac are:
```bash
xattr -l node_modules 2>/dev/null | grep -i fileprovider   # iCloud attrs present?
find node_modules -maxdepth 2 -flags +dataless 2>/dev/null | head   # evicted files?
```
Permanent guard: keep the repo (and especially `node_modules`) on a local,
non-synced path such as `~/Developer/`.

## 8. Status snapshot (from the last audit)

- **Phase 1 (structured source edition): ~96% — substantially complete & verified from generated data.**
- **Phase 2 (exploration platform): ~82% — near-complete, needs a verified build + hardening.**
- Māttirai correctness fixed & tested (வீடு → 2½ via நெடிற்றொடர்க் குற்றியலுகரம்; ஸ்டாலின் → 4 with Grantha `ஸ்`=½ as "modern extended", no silent grapheme loss).
- Transliteration now in all inputs (search + chapter search + tools).
- Editorial-layer architecture, terminology model, route helpers, editorial
  validation, re-import-safety test: **created and typechecked in isolation; not
  yet run as part of the repo build.**

## 9. Outstanding work (do with a green build; each is verifiable in Claude Code)

**Hardening (finish Phase 2 → Phase 3 readiness):**
1. **Verify build/typecheck/lint/test** and fix errors from recent Cowork edits (P0).
2. Wire the sutra page + `SutraReader` onto `buildSutraViewModel(source, id)` so editorial/derived layers render when present (source-only pages must still show placeholders). Currently the page reads editorial fields off `SutraRecord`; migrate to the merged view model.
3. Swap remaining hard-coded internal hrefs to `lib/routes.ts` helpers; keep `tests/routes.test.mjs` green (includes the நூல் மரபு canonical regression).
4. Route major UI term strings through `lib/terminology.ts`.
5. Finish Tamil-mode language-leak fixes on content pages (methodology/source/understanding bodies still have English-primary prose).
6. (Optional) formally split `SourceSutraRecord` out of `SutraRecord` now that `lib/layers.ts` defines it — only with a passing build.

**Phase 3B — நூல் மரபு pilot (do NOT do all 33):**
- Author real, human-reviewed editorial annotations for the **first 5 நூற்பா**
  only, as `data/editorial/sutras/ezhuthu-noolmarabu-00{1..5}.json`
  (`SutraEditorialAnnotation`): word separation, simple/detailed Tamil, English,
  concepts, glossary links, citations, review status. Validate with
  `npm run validate:editorial`. Prove public rendering + provenance + review
  status. Only scale to 33 after these 5 pass editorial review.
- Never place placeholder/fixture prose in production editorial files.

**Later:** Phase 4 commentary/cross-text · Phase 5 knowledge graph (seed = computed
related-நூற்பா links) · Phase 6 citation-grounded intelligence (substrate =
`/api/sutra/<id>` JSON). Each gated on the prior's completion criteria.

## 10. Git / deploy

Repo has git history on branch `master`. Push to `github.com/pugazg/tolkappiyam-arivagam`
(`gh repo create … --push`, or GitHub Desktop). Vercel auto-redeploys on push;
set `NEXT_PUBLIC_SITE_URL`. Committed data (`data/generated/*`, `data/source/*`)
means the build does not fetch from Project Madurai.

## 11. Tip for Claude Code

Consider renaming/copying the guardrails in §1 + the corpus invariants in §5 into
a root `CLAUDE.md` so they're auto-loaded as persistent context each session.
