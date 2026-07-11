import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyTamilInput, calculateBasicMatra, buildUyirmeiGrid, getConsonantClass } from "../lib/tamil.ts";

test("classifies vowels with length", () => {
  assert.equal(classifyTamilInput("அ").category, "உயிரெழுத்து");
  assert.equal(classifyTamilInput("அ").vowelLength, "குறில்");
  assert.equal(classifyTamilInput("ஆ").vowelLength, "நெடில்");
});

test("classifies pure consonants and their class", () => {
  const c = classifyTamilInput("க்");
  assert.equal(c.category, "மெய்யெழுத்து");
  assert.equal(c.consonantClass, "வல்லினம்");
  assert.equal(getConsonantClass("ங்"), "மெல்லினம்");
  assert.equal(getConsonantClass("ய்"), "இடையினம்");
});

test("decomposes உயிர்மெய் into components", () => {
  const c = classifyTamilInput("கி");
  assert.equal(c.category, "உயிர்மெய்");
  assert.equal(c.consonantComponent, "க்");
  assert.equal(c.vowelComponent, "இ");
  assert.equal(c.vowelLength, "குறில்");
});

test("recognises ஆய்தம், Grantha, numerals", () => {
  assert.equal(classifyTamilInput("ஃ").category, "ஆய்த எழுத்து");
  assert.equal(classifyTamilInput("ஜ").category, "Grantha");
  assert.equal(classifyTamilInput("௫").category, "தமிழ் எண்");
});

test("handles non-Tamil input safely (Latin, emoji)", () => {
  assert.equal(classifyTamilInput("5").recognizedTamil, false);
  assert.equal(classifyTamilInput("😀").recognizedTamil, false);
  assert.equal(classifyTamilInput("A").category, "அறியப்படாதது");
});

test("handles multi-grapheme input without crashing", () => {
  const c = classifyTamilInput("கல்");
  assert.ok(c.graphemes.length >= 2);
});

test("exposes correct code points", () => {
  assert.equal(classifyTamilInput("அ").codePoints[0], "U+0B85");
});

test("basic matra: kuril=1, nedil=2", () => {
  assert.equal(calculateBasicMatra("அ")[0].matra, 1);
  assert.equal(calculateBasicMatra("ஆ")[0].matra, 2);
  assert.equal(calculateBasicMatra("கா")[0].matra, 2);
});

test("uyirmei grid is 18 x 12", () => {
  const g = buildUyirmeiGrid();
  assert.equal(g.length, 18);
  assert.equal(g[0].letters.length, 12);
});
