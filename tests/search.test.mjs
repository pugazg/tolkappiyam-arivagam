import { test } from "node:test";
import assert from "node:assert/strict";
import { searchSutraRecords, highlightSegments } from "../lib/search.ts";

const base = {
  work: "தொல்காப்பியம்", adhikaramTamil: "எழுத்ததிகாரம்", adhikaramEnglish: "Orthography",
  iyalTamil: "நூல் மரபு", iyalEnglish: "Textual Tradition", concepts: [], keywords: [],
  commentaryReferences: [], examples: [], relatedSutras: [], editorialStatus: "segmented",
  parsingConfidence: "high", source: {}, lineCount: 1, wordCount: 3, traditionalNumber: 1,
};
const records = [
  { ...base, id: "ezhuthu-noolmarabu-001", adhikaramId: "ezhuthu", iyalId: "ezhuthu-noolmarabu", displayNumber: "1", sourceSequence: 1, originalText: "எழுத்து எனப்படுப", normalizedText: "எழுத்து எனப்படுப", originalLines: ["எழுத்து எனப்படுப"], keywords: ["எழுத்து"] },
  { ...base, id: "sol-peyariyal-005", adhikaramId: "sol", iyalId: "sol-peyariyal", displayNumber: "5", sourceSequence: 2, originalText: "பெயர் என மொழிப", normalizedText: "பெயர் என மொழிப", originalLines: ["பெயர் என மொழிப"], keywords: ["பெயர்"] },
];

test("finds Tamil text matches", () => {
  const hits = searchSutraRecords("எழுத்து", records);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].sutra.id, "ezhuthu-noolmarabu-001");
});

test("matches by நூற்பா number and id", () => {
  assert.equal(searchSutraRecords("5", records).length, 1);
  assert.equal(searchSutraRecords("peyariyal", records).length, 1);
});

test("filters by adhikaram", () => {
  const hits = searchSutraRecords("மொழிப", records, { adhikaramId: "sol" });
  assert.equal(hits.length, 1);
  assert.equal(hits[0].sutra.adhikaramId, "sol");
});

test("empty query returns filtered pool", () => {
  assert.equal(searchSutraRecords("", records).length, 2);
});

test("highlightSegments marks the matched span", () => {
  const segs = highlightSegments("எழுத்து எனப்படுப", "எழுத்து");
  assert.ok(segs.some((s) => s.match && s.text === "எழுத்து"));
  assert.equal(segs.map((s) => s.text).join(""), "எழுத்து எனப்படுப");
});
