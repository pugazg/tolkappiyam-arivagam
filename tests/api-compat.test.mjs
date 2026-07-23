import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSutraViewModel } from "../lib/editorial.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Mirrors app/api/sutra/[id]/route.ts: the payload must be the full SutraRecord
// PLUS an additive `layers` key — no existing key renamed or removed.
function apiPayload(sutra) {
  const { editorial, derived } = buildSutraViewModel(sutra, sutra.id);
  return { ...sutra, layers: { editorial, derived } };
}

test("API stays backward-compatible: every source key preserved, `layers` added additively", () => {
  const sutras = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "generated", "sutras.json"), "utf8"));
  const sample = sutras[0];
  const payload = apiPayload(sample);

  // 1. Every original top-level key is present with an identical value.
  for (const key of Object.keys(sample)) {
    assert.deepEqual(payload[key], sample[key], `key "${key}" must be preserved verbatim`);
  }
  // 2. Exactly one new top-level key was added.
  const added = Object.keys(payload).filter((k) => !(k in sample));
  assert.deepEqual(added, ["layers"], `only "layers" may be added, got ${JSON.stringify(added)}`);
  // 3. `layers` carries both sub-layers; both null for a source-only நூற்பா.
  assert.ok("editorial" in payload.layers && "derived" in payload.layers);
  assert.equal(payload.layers.editorial, null);
  assert.equal(payload.layers.derived, null);
});

test("API payload does not rename the stored source-processing field (still `editorialStatus`)", () => {
  const sutras = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "generated", "sutras.json"), "utf8"));
  const payload = apiPayload(sutras[0]);
  assert.ok("editorialStatus" in payload, "legacy `editorialStatus` key must remain in this phase");
});
