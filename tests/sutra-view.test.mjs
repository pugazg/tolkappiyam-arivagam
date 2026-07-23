import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveSutraView, resolveRelatedIds } from "../lib/sutra-view.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// A minimal source record shaped like a real one, source-only (no interpretive
// prose), matching what the importer emits for the current corpus.
function sourceOnly(overrides = {}) {
  return {
    id: "ezhuthu-noolmarabu-001",
    work: "தொல்காப்பியம்",
    adhikaramId: "ezhuthu",
    adhikaramTamil: "எழுத்ததிகாரம்",
    adhikaramEnglish: "Ezhuthu",
    iyalId: "ezhuthu-noolmarabu",
    iyalTamil: "நூல் மரபு",
    sourceSequence: 1,
    traditionalNumber: 1,
    displayNumber: "1",
    originalText: "எழுத்து எனப்படுப",
    originalLines: ["எழுத்து எனப்படுப"],
    normalizedText: "எழுத்து எனப்படுப",
    lineCount: 1,
    wordCount: 2,
    concepts: [],
    keywords: [],
    commentaryReferences: [],
    examples: [],
    relatedSutras: [],
    editorialStatus: "segmented",
    source: { publisher: "Project Madurai", sourceId: "pmuni0100", url: "", accessNote: "", attribution: "" },
    parsingConfidence: "high",
    ...overrides,
  };
}

function editorialField(value, status = "reviewed", provenance = {}) {
  return { value, status, provenance: { layer: "editorial", ...provenance } };
}

test("source-only resolution: interpretive fields are absent (placeholder path)", () => {
  const view = resolveSutraView({ source: sourceOnly(), editorial: null, derived: null });
  assert.equal(view.fields.wordSeparatedText, null);
  assert.equal(view.fields.simpleTamilExplanation, null);
  assert.equal(view.fields.detailedTamilExplanation, null);
  assert.equal(view.fields.englishExplanation, null);
  assert.equal(view.fields.transliteration, null);
  assert.equal(view.fields.scholarlyNotes, null);
  assert.equal(view.fields.concepts, null); // empty source concepts => absent
});

test("source-layer concepts resolve as parser-derived provenance", () => {
  const view = resolveSutraView({
    source: sourceOnly({ concepts: ["எழுத்து"] }),
    editorial: null,
    derived: null,
  });
  assert.deepEqual(view.fields.concepts.value, ["எழுத்து"]);
  assert.equal(view.fields.concepts.layer, "parser-derived");
});

test("machine-derived resolution only fills when source+editorial absent, and stays labelled", () => {
  const view = resolveSutraView({
    source: sourceOnly({ concepts: [] }),
    editorial: null,
    derived: { sutraId: "x", conceptSuggestions: { value: ["suggested"], layer: "machine-derived", method: "keyword-detection" } },
  });
  assert.equal(view.fields.concepts.layer, "machine-derived");
  assert.equal(view.fields.concepts.method, "keyword-detection");
});

test("machine-derived must NOT override source concepts", () => {
  const view = resolveSutraView({
    source: sourceOnly({ concepts: ["source-concept"] }),
    editorial: null,
    derived: { sutraId: "x", conceptSuggestions: { value: ["machine"], layer: "machine-derived", method: "keyword-detection" } },
  });
  assert.deepEqual(view.fields.concepts.value, ["source-concept"]);
  assert.equal(view.fields.concepts.layer, "parser-derived");
});

test("editorial precedence: human value wins and carries review-status provenance", () => {
  const view = resolveSutraView({
    source: sourceOnly({ concepts: ["source-concept"] }),
    editorial: {
      sutraId: "ezhuthu-noolmarabu-001",
      englishExplanation: editorialField("An editor-authored gloss.", "verified", { reviewerId: "r1", reviewedAt: "2026-07-23" }),
      concepts: editorialField(["editorial-concept"], "reviewed"),
      overallStatus: "reviewed",
    },
    derived: null,
  });
  assert.equal(view.fields.englishExplanation.value, "An editor-authored gloss.");
  assert.equal(view.fields.englishExplanation.layer, "editorial");
  assert.equal(view.fields.englishExplanation.reviewStatus, "verified");
  assert.equal(view.fields.englishExplanation.reviewedAt, "2026-07-23");
  // editorial concepts beat source concepts
  assert.deepEqual(view.fields.concepts.value, ["editorial-concept"]);
  assert.equal(view.fields.concepts.layer, "editorial");
});

test("empty/whitespace editorial prose is treated as absent (honest placeholder)", () => {
  const view = resolveSutraView({
    source: sourceOnly(),
    editorial: { sutraId: "x", englishExplanation: editorialField("   ", "draft"), overallStatus: "draft" },
    derived: null,
  });
  assert.equal(view.fields.englishExplanation, null);
});

test("three status axes are independent and never inferred from one another", () => {
  const view = resolveSutraView({
    source: sourceOnly({ editorialStatus: "segmented", parsingConfidence: "high" }),
    editorial: null,
    derived: null,
  });
  assert.equal(view.sourceProcessingStatus, "segmented");
  assert.equal(view.parsingConfidence, "high");
  assert.equal(view.editorialReviewStatus, "not-started"); // absent editorial => not-started, NOT derived from the others
});

test("resolveSutraView does not mutate the source record", () => {
  const src = sourceOnly({ concepts: ["a"] });
  const snapshot = JSON.stringify(src);
  resolveSutraView({ source: src, editorial: { sutraId: src.id, concepts: editorialField(["b"]), overallStatus: "draft" }, derived: null });
  assert.equal(JSON.stringify(src), snapshot);
});

test("related ids: editorial curation beats machine-computed link", () => {
  const machine = resolveRelatedIds({ source: sourceOnly({ relatedSutras: ["m-1"] }), editorial: null, derived: null });
  assert.deepEqual(machine, { ids: ["m-1"], layer: "machine-derived" });
  const curated = resolveRelatedIds({
    source: sourceOnly({ relatedSutras: ["m-1"] }),
    editorial: { sutraId: "x", relatedSutras: editorialField(["e-1"]), overallStatus: "reviewed" },
    derived: null,
  });
  assert.deepEqual(curated, { ids: ["e-1"], layer: "editorial" });
});

test("ALL current corpus records resolve as source-only with editorial review not-started", () => {
  const sutras = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "generated", "sutras.json"), "utf8"));
  assert.ok(sutras.length === 1602, `expected 1602 நூற்பா, got ${sutras.length}`);
  for (const s of sutras) {
    const view = resolveSutraView({ source: s, editorial: null, derived: null });
    assert.equal(view.editorialReviewStatus, "not-started", `${s.id} should be not-started`);
    // No interpretive prose present anywhere in the current corpus.
    assert.equal(view.fields.simpleTamilExplanation, null, `${s.id} simple explanation should be absent`);
    assert.equal(view.fields.englishExplanation, null, `${s.id} english should be absent`);
    // parsing confidence and source-processing status are still their own values.
    assert.ok(["high", "medium", "low"].includes(view.parsingConfidence));
    assert.ok(view.sourceProcessingStatus.length > 0);
  }
});
