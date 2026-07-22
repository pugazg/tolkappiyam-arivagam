# Editorial architecture (Phase 3 readiness)

This document defines how source, machine, and human layers are kept separate so
that human editorial work can never be destroyed by re-running the importer.

## 1. Layer ownership (the mandatory rule)

| Layer | Directory | Owner | Mutable by |
|---|---|---|---|
| **Source** (verbatim Project Madurai text) | `data/source/` | importer | importer only |
| **Parser-derived** (segmentation, IDs, confidence, warnings) | `data/generated/` | importer | importer only |
| **Machine-derived** (keyword/concept/related suggestions) | `data/derived/` | tooling | regenerable, non-authoritative |
| **Editorial** (human-authored annotations) | `data/editorial/sutras/` | humans | editors only |
| **Review history** (append-only) | `data/editorial/review-history/` | humans | editors only |

**Rule:** `data/generated/**` and `data/source/**` are *importer-owned output*.
Human editorial content is **never** stored there.

## 2. Importer-owned generated files

`scripts/import-tolkappiyam.mjs` writes **only** to `data/generated/` (and copies
the source into `data/source/`). It writes: `work.json`, `sections.json`,
`sutras.json`, `glossary.json`, `parsing-report.json`, `analysis.json`. It does
**not** read or write `data/editorial/**` or `data/derived/**`.

## 3. Human-owned editorial files

One file per நூற்பா, keyed by stable ID: `data/editorial/sutras/<id>.json`,
shaped as `SutraEditorialAnnotation` (see `lib/layers.ts`). A **missing file is a
valid, normal state** — a source-only நூற்பா simply has no annotation, and the UI
derives its placeholder at render time (no placeholder prose is stored).

## 4. Machine-derived metadata

`data/derived/sutras/<id>.json` shaped as `SutraDerivedMetadata`. Every value is
wrapped in `DerivedValue<T>` carrying its `method` (`literal-source-match`,
`unicode-analysis`, `rule-engine`, `keyword-detection`, `machine-suggestion`), so
a machine suggestion can never be mistaken for reviewed scholarship.

## 5. Provenance layers

`ContentLayer = "source" | "parser-derived" | "machine-derived" | "editorial" | "modern-pedagogy"`.
Each editorial field carries `provenance: { layer: "editorial", editorId?, reviewerId?, createdAt?, updatedAt?, reviewedAt? }`.

## 6. Editorial statuses

`EditorialAnnotationStatus = "not-started" | "draft" | "reviewed" | "verified"`.
This is **independent of `parsingConfidence`** (a source/parser quality signal).

## 7. Reviewer requirement

A field with `status: "verified"` **must** carry `provenance.reviewerId`.
`npm run validate:editorial` fails otherwise.

## 8. Review history

Append-only `EditorialRevision[]` per நூற்பா in
`data/editorial/review-history/<id>.json` (`created`, `updated`,
`submitted-for-review`, `reviewed`, `verified`, `reopened`).

## 9. Merge / read model

`lib/editorial.ts` provides `getEditorialAnnotation(id)`, `getDerivedMetadata(id)`,
`getReviewHistory(id)`, and `buildSutraViewModel(source, id)` →
`{ source, editorial, derived }`. Layers are **merged without flattening**, so
provenance is preserved. Pages migrate to this view model in Phase 3A; until then
source-only pages render exactly as before.

## 10. Validation

`npm run validate:editorial` checks: duplicate records, unknown sutra IDs,
malformed statuses, verified-without-reviewer, unknown glossary/related IDs,
malformed citations, and review-history integrity. **Empty editorial data is
valid** (exit 0); any structural error exits non-zero.

## 11. Re-import safety (proven)

Because the importer only writes `data/generated/` + `data/source/`, and editorial
data lives in `data/editorial/`, **`npm run import:data` cannot overwrite editorial
work.** This is enforced by `tests/editorial-architecture.test.mjs`, which asserts
the importer never references `data/editorial` or `data/derived`.

## 12. How Phase 3 editors add content

1. Create `data/editorial/sutras/<id>.json` (`SutraEditorialAnnotation`).
2. Fill only the fields you have verified; leave the rest absent.
3. Set `status: "verified"` **only** with a `reviewerId`.
4. Append an `EditorialRevision` to the review-history file.
5. Run `npm run validate:editorial` (must pass) and `npm run build`.

The importer may be re-run at any time without touching your work.
