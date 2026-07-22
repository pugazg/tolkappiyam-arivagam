// Read/merge model for the editorial + derived layers. This is ADDITIVE:
// nothing here writes data, and a missing annotation is a valid, normal state
// (source-only நூற்பாக்கள் simply have no editorial record). The importer never
// touches these directories, so re-import cannot destroy editorial work.
import fs from "node:fs";
import path from "node:path";
import type {
  SutraEditorialAnnotation,
  SutraDerivedMetadata,
  EditorialRevision,
} from "./layers.ts";

const ROOT = process.cwd();
const EDITORIAL_SUTRA_DIR = path.join(ROOT, "data", "editorial", "sutras");
const REVIEW_HISTORY_DIR = path.join(ROOT, "data", "editorial", "review-history");
const DERIVED_SUTRA_DIR = path.join(ROOT, "data", "derived", "sutras");

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null; // absent or unreadable = genuinely absent
  }
}

export function getEditorialAnnotation(sutraId: string): SutraEditorialAnnotation | null {
  return readJson<SutraEditorialAnnotation>(path.join(EDITORIAL_SUTRA_DIR, `${sutraId}.json`));
}
export function getDerivedMetadata(sutraId: string): SutraDerivedMetadata | null {
  return readJson<SutraDerivedMetadata>(path.join(DERIVED_SUTRA_DIR, `${sutraId}.json`));
}
export function getReviewHistory(sutraId: string): EditorialRevision[] {
  return readJson<EditorialRevision[]>(path.join(REVIEW_HISTORY_DIR, `${sutraId}.json`)) ?? [];
}

export type SutraViewModel<TSource> = {
  source: TSource;                              // immutable, importer-owned
  editorial: SutraEditorialAnnotation | null;   // human-owned, may be absent
  derived: SutraDerivedMetadata | null;         // machine-derived suggestions
};

// Merge without flattening: provenance of each layer is preserved.
export function buildSutraViewModel<TSource>(source: TSource, sutraId: string): SutraViewModel<TSource> {
  return {
    source,
    editorial: getEditorialAnnotation(sutraId),
    derived: getDerivedMetadata(sutraId),
  };
}
