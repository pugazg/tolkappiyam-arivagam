import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeMatra } from "../lib/matra.ts";

const parts = (w) => analyzeMatra(w).parts.map((p) => p.grapheme);

test("ஸ்டாலின்: no grapheme dropped; ஸ் analysed; total 4", () => {
  const a = analyzeMatra("ஸ்டாலின்");
  assert.deepEqual(parts("ஸ்டாலின்"), ["ஸ்", "டா", "லி", "ன்"]);
  assert.equal(a.inputGraphemeCount, 4);
  assert.equal(a.analysedGraphemeCount, 4);
  assert.equal(a.total, 4); // ஸ்(½) + டா(2) + லி(1) + ன்(½)
  assert.equal(a.analyzable, true);
});

test("ஸ் is classified as Tamil-script extended / Grantha, ½, labelled modern extended", () => {
  const s = analyzeMatra("ஸ்டாலின்").parts[0];
  assert.equal(s.status, "extended");
  assert.equal(s.category, "Tamil-script extended / Grantha");
  assert.equal(s.nominal, 0.5);
  assert.equal(s.contextual, 0.5);
  assert.equal(s.rule, "நவீன விரிவாக்கக் கணிப்பு");
});

test("no grapheme is silently lost for Grantha words; extended flagged", () => {
  for (const w of ["ஜான்", "ஷாஜகான்", "ஹரி", "ஸ்ரீ", "க்ஷேத்திரம்"]) {
    const a = analyzeMatra(w);
    assert.equal(a.unsupportedGraphemes.length, 0, `${w} has no unsupported graphemes`);
    // every meaningful grapheme (non-space) is analysed or extended
    assert.equal(a.analysedGraphemeCount, a.inputGraphemeCount - a.ignoredGraphemes.length, `${w} loses no grapheme`);
    assert.equal(a.hasExtended, true, `${w} contains extended letters`);
  }
});

test("native cases unchanged", () => {
  assert.equal(analyzeMatra("வீடு").total, 2.5);
  assert.equal(analyzeMatra("நாடு").total, 2.5);
  assert.equal(analyzeMatra("அடி").total, 2);
  assert.equal(analyzeMatra("மலை").analyzable, false); // ஐகாரக் குறுக்கம் → needs analysis
});

test("unsupported grapheme → no definitive total, reported not dropped", () => {
  const a = analyzeMatra("வீ5டு"); // Tamil numeral in the middle
  assert.equal(a.analyzable, false);
  assert.equal(a.total, null);
  assert.ok(a.unsupportedGraphemes.includes("5") || a.unsupportedGraphemes.length > 0);
  // the grapheme still appears in parts (not dropped)
  assert.ok(a.parts.some((p) => p.grapheme === "5"));
});

test("integrity metadata is present and punctuation is ignored not lost", () => {
  const a = analyzeMatra("வீடு.");
  assert.equal(a.total, 2.5);
  assert.deepEqual(a.ignoredGraphemes, ["."]);
  assert.equal(a.inputGraphemeCount, 3);
  assert.equal(a.analysedGraphemeCount, 2);
});
