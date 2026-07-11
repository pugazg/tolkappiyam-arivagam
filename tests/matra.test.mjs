import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeMatra, formatMatra } from "../lib/matra.ts";

const total = (w) => analyzeMatra(w).total;
const rule = (w, i) => analyzeMatra(w).parts[i].rule;

test("நெடிற்றொடர்க் குற்றியலுகரம் → 2½", () => {
  for (const w of ["வீடு", "நாடு", "காடு", "ஏடு", "சோறு", "மாடு"]) {
    assert.equal(total(w), 2.5, `${w} should be 2½`);
  }
});

test("வீடு: வீ=2 (nominal & contextual), டு=½ contextual with rule", () => {
  const a = analyzeMatra("வீடு");
  assert.equal(a.parts[0].nominal, 2);
  assert.equal(a.parts[0].contextual, 2);
  assert.equal(a.parts[1].nominal, 1); // isolated டு would be 1
  assert.equal(a.parts[1].contextual, 0.5); // contextual குற்றியலுகரம்
  assert.equal(a.parts[1].rule, "நெடிற்றொடர்க் குற்றியலுகரம்");
  assert.equal(a.analyzable, true);
});

test("காற்று → வன்றொடர்க் குற்றியலுகரம், total 3", () => {
  const a = analyzeMatra("காற்று");
  assert.equal(a.total, 3); // கா(2) + ற்(½) + று(½)
  assert.equal(a.parts.at(-1).rule, "வன்றொடர்க் குற்றியலுகரம்");
});

test("subtypes: உயிர்த்தொடர் (பசு), ஆய்தத்தொடர் (எஃகு), மென்றொடர் (ஐந்து)", () => {
  assert.equal(analyzeMatra("பசு").parts.at(-1).rule, "உயிர்த்தொடர்க் குற்றியலுகரம்");
  assert.equal(analyzeMatra("பசு").total, 1.5);
  assert.equal(analyzeMatra("எஃகு").parts.at(-1).rule, "ஆய்தத்தொடர்க் குற்றியலுகரம்");
  assert.equal(analyzeMatra("எஃகு").total, 2); // எ(1)+ஃ(½)+கு(½)
  assert.equal(analyzeMatra("ஐந்து").parts.at(-1).rule, "மென்றொடர்க் குற்றியலுகரம்");
});

test("அடி → 2 (no contextual rule)", () => {
  const a = analyzeMatra("அடி");
  assert.equal(a.total, 2);
  assert.equal(a.parts.every((p) => p.rule === null), true);
});

test("கால் → 2½ (pulli consonant counted as ½)", () => {
  const a = analyzeMatra("கால்");
  assert.equal(a.total, 2.5); // கா(2) + ல்(½)
});

test("isolated டு → nominal 1, contextual 1, no rule", () => {
  const a = analyzeMatra("டு");
  assert.equal(a.parts[0].nominal, 1);
  assert.equal(a.parts[0].contextual, 1);
  assert.equal(a.parts[0].rule, null);
  assert.equal(a.total, 1);
});

test("மலை → needs-analysis (ஐகாரக் குறுக்கம் indeterminate)", () => {
  const a = analyzeMatra("மலை");
  assert.equal(a.analyzable, false);
  assert.equal(a.total, null);
  assert.match(a.message, /மேலும் இலக்கணச் சூழல்/);
  assert.equal(a.parts.at(-1).rule, "ஐகாரக் குறுக்கம்");
});

test("word-initial ஐ counts as 2 (full)", () => {
  assert.equal(analyzeMatra("ஐந்து").parts[0].contextual, 2);
});

test("formatMatra renders vulgar fractions", () => {
  assert.equal(formatMatra(2.5), "2½");
  assert.equal(formatMatra(0.5), "½");
  assert.equal(formatMatra(1), "1");
  assert.equal(formatMatra(null), "—");
});
