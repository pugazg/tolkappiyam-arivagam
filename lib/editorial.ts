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

// The three human/tooling-owned directories. Injectable so tests can point at a
// throwaway fixture directory WITHOUT writing fixture prose into the real
// data/editorial/** tree (a hard project rule). Production defaults are derived
// from process.cwd() and are unchanged from before this became injectable.
export type EditorialDirs = {
  editorial: string;
  derived: string;
  reviewHistory: string;
};

export function defaultEditorialDirs(): EditorialDirs {
  const root = process.cwd();
  return {
    editorial: path.join(root, "data", "editorial", "sutras"),
    derived: path.join(root, "data", "derived", "sutras"),
    reviewHistory: path.join(root, "data", "editorial", "review-history"),
  };
}

// ---- Build-time directory index ------------------------------------------
// Without this, rendering 1,602 sutra pages + 1,602 API routes would issue
// thousands of failing readFileSync() calls (ENOENT) for absent editorial and
// derived files. Instead we readdir each directory ONCE per process and cache
// the set of present ids; a file is only read when its id is actually present.
// Cache is keyed by absolute directory path so injected fixture dirs stay
// isolated from the production dirs.
const dirIndexCache = new Map<string, Set<string>>();

function indexOf(dir: string): Set<string> {
  const cached = dirIndexCache.get(dir);
  if (cached) return cached;
  let ids: Set<string>;
  try {
    ids = new Set(
      fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.slice(0, -".json".length)),
    );
  } catch {
    ids = new Set(); // directory absent = no annotations, a valid empty state
  }
  dirIndexCache.set(dir, ids);
  return ids;
}

// Test-only: forget cached directory listings (e.g. after creating fixtures).
export function clearEditorialIndexCache(): void {
  dirIndexCache.clear();
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null; // absent or unreadable = genuinely absent
  }
}

export function getEditorialAnnotation(
  sutraId: string,
  dirs: EditorialDirs = defaultEditorialDirs(),
): SutraEditorialAnnotation | null {
  if (!indexOf(dirs.editorial).has(sutraId)) return null;
  return readJson<SutraEditorialAnnotation>(path.join(dirs.editorial, `${sutraId}.json`));
}

export function getDerivedMetadata(
  sutraId: string,
  dirs: EditorialDirs = defaultEditorialDirs(),
): SutraDerivedMetadata | null {
  if (!indexOf(dirs.derived).has(sutraId)) return null;
  return readJson<SutraDerivedMetadata>(path.join(dirs.derived, `${sutraId}.json`));
}

export function getReviewHistory(
  sutraId: string,
  dirs: EditorialDirs = defaultEditorialDirs(),
): EditorialRevision[] {
  if (!indexOf(dirs.reviewHistory).has(sutraId)) return [];
  return readJson<EditorialRevision[]>(path.join(dirs.reviewHistory, `${sutraId}.json`)) ?? [];
}

export type SutraViewModel<TSource> = {
  source: TSource;                              // immutable, importer-owned
  editorial: SutraEditorialAnnotation | null;   // human-owned, may be absent
  derived: SutraDerivedMetadata | null;         // machine-derived suggestions
};

// Merge without flattening: provenance of each layer is preserved.
export function buildSutraViewModel<TSource>(
  source: TSource,
  sutraId: string,
  dirs: EditorialDirs = defaultEditorialDirs(),
): SutraViewModel<TSource> {
  return {
    source,
    editorial: getEditorialAnnotation(sutraId, dirs),
    derived: getDerivedMetadata(sutraId, dirs),
  };
}
