import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getEditorialAnnotation,
  getDerivedMetadata,
  getReviewHistory,
  buildSutraViewModel,
  clearEditorialIndexCache,
} from "../lib/editorial.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Build a throwaway editorial/derived/review-history directory set in the OS
// temp dir, so fixtures never pollute the real data/editorial/** tree.
function makeFixtureDirs() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "tka-editorial-"));
  const dirs = {
    editorial: path.join(base, "editorial", "sutras"),
    derived: path.join(base, "derived", "sutras"),
    reviewHistory: path.join(base, "editorial", "review-history"),
  };
  for (const d of Object.values(dirs)) fs.mkdirSync(d, { recursive: true });
  clearEditorialIndexCache();
  return { base, dirs };
}

test("re-import safety: importer only writes under data/generated (never data/editorial)", () => {
  const src = fs.readFileSync(path.join(ROOT, "scripts", "import-tolkappiyam.mjs"), "utf8");
  // The importer's only output directory must be data/generated; and it must
  // not reference the editorial/derived directories as write targets.
  assert.ok(/data",\s*"generated"/.test(src) || /data\/generated/.test(src), "importer writes to data/generated");
  assert.ok(!/data\/editorial/.test(src), "importer must not touch data/editorial");
  assert.ok(!/data\/derived/.test(src), "importer must not touch data/derived");
});

test("missing editorial annotation is a valid, absent state (returns null / [])", () => {
  assert.equal(getEditorialAnnotation("does-not-exist-001"), null);
  assert.equal(getDerivedMetadata("does-not-exist-001"), null);
  assert.deepEqual(getReviewHistory("does-not-exist-001"), []);
});

test("editorial dirs are injectable: fixtures load without touching data/editorial", () => {
  const { base, dirs } = makeFixtureDirs();
  try {
    const annotation = {
      sutraId: "fixture-001",
      englishExplanation: {
        value: "Fixture gloss.",
        status: "draft",
        provenance: { layer: "editorial", editorId: "test" },
      },
      overallStatus: "draft",
    };
    fs.writeFileSync(path.join(dirs.editorial, "fixture-001.json"), JSON.stringify(annotation));
    clearEditorialIndexCache(); // file created after any prior listing

    const loaded = getEditorialAnnotation("fixture-001", dirs);
    assert.equal(loaded.englishExplanation.value, "Fixture gloss.");
    assert.equal(loaded.overallStatus, "draft");

    // A different id in the same injected dir is still absent.
    assert.equal(getEditorialAnnotation("fixture-999", dirs), null);

    // The real production directory is unaffected (still no such fixture).
    assert.equal(getEditorialAnnotation("fixture-001"), null);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
    clearEditorialIndexCache();
  }
});

test("build-time index: absent ids are answered from a cached listing, not per-file reads", () => {
  const { base, dirs } = makeFixtureDirs(); // all three dirs empty
  const realReaddir = fs.readdirSync;
  let readdirCalls = 0;
  let readFileCalls = 0;
  const realReadFile = fs.readFileSync;
  fs.readdirSync = (...args) => { readdirCalls++; return realReaddir(...args); };
  fs.readFileSync = (...args) => { readFileCalls++; return realReadFile(...args); };
  try {
    for (let i = 0; i < 500; i++) getEditorialAnnotation(`absent-${i}`, dirs);
    // The empty directory is listed once (cached); no per-id readFileSync at all.
    assert.equal(readdirCalls, 1, `expected 1 readdir, got ${readdirCalls}`);
    assert.equal(readFileCalls, 0, `expected 0 readFile for absent ids, got ${readFileCalls}`);
  } finally {
    fs.readdirSync = realReaddir;
    fs.readFileSync = realReadFile;
    fs.rmSync(base, { recursive: true, force: true });
    clearEditorialIndexCache();
  }
});

test("buildSutraViewModel preserves the source object by reference (no source mutation)", () => {
  const source = { id: "src-1", originalLines: ["x"], concepts: [], editorialStatus: "segmented", parsingConfidence: "high", relatedSutras: [] };
  const snapshot = JSON.stringify(source);
  const vm = buildSutraViewModel(source, "src-1");
  assert.equal(vm.source, source); // same reference, unflattened
  assert.equal(vm.editorial, null);
  assert.equal(vm.derived, null);
  assert.equal(JSON.stringify(source), snapshot);
});
