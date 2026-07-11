import { test } from "node:test";
import assert from "node:assert/strict";
import { transliterate } from "../lib/transliterate.ts";

test("composes consonant + vowel", () => {
  assert.equal(transliterate("ka"), "க");
  assert.equal(transliterate("ki"), "கி");
  assert.equal(transliterate("k"), "க்");
});
test("full words", () => {
  assert.equal(transliterate("tamizh"), "தமிழ்");
  assert.equal(transliterate("vaNakkam"), "வணக்கம்");
  assert.equal(transliterate("uyir"), "உயிர்");
  assert.equal(transliterate("mey"), "மெய்");
});
test("retroflex via capitals", () => {
  assert.equal(transliterate("N"), "ண்");
  assert.equal(transliterate("R"), "ற்");
  assert.equal(transliterate("L"), "ள்");
});
test("passes through non-roman and spaces", () => {
  assert.equal(transliterate("ka ka"), "க க");
  assert.equal(transliterate("தமிழ்"), "தமிழ்");
});
