import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getEditorialAnnotation, getDerivedMetadata, getReviewHistory } from "../lib/editorial.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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
