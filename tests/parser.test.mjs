import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseProjectMaduraiHtml,
  htmlToTextLines,
  tokenizeTamilText,
  containsGlossaryTerm,
} from "../lib/parser.ts";

const HTML = `<html><body>
<strong> Acknowledgements: </strong><br>
Etext Preparation & PDF version: Dr.K. Kalyanasundaram<br>
Proof-reading & Web version: Mr. N.D. Logasundaram<br>
<h3>தொல்காப்பியம் -சிறப்புப்பாயிரம்</h3>
வட வேங்கடம் தென் குமரி 1<br>
----------
<h3>முதல் பாகம் - எழுத்ததிகாரம்</h3>
<strong>1.1. நூல் மரபு</strong><br>
எழுத்து எனப்படுப<br>
அகரம் முதல்<br>
னகர இறுவாய் முப்பஃது என்ப. 1<br>
<br>
அவைதாம் ஆய்தம் என்ற<br>
முப்பாற்புள்ளியும் எழுத்து ஓரன்ன. 2<br>
----------
<h3>இரண்டாம் பாகம் - சொல்லதிகாரம்</h3>
<strong>2.1. கிளவியாக்கம்</strong><br>
சொல் என மொழிப. 1<br>
</body></html>`;

test("htmlToTextLines converts <br> to lines and strips tags", () => {
  const lines = htmlToTextLines("a<br>b<br/>c");
  assert.deepEqual(lines, ["a", "b", "c"]);
});

test("recognises adhikarams and iyals", () => {
  const out = parseProjectMaduraiHtml(HTML);
  assert.equal(out.report.totalAdhikaramsFound, 2);
  assert.ok(out.report.totalIyalsFound >= 2);
});

test("segments numbered sutras with source numbering", () => {
  const out = parseProjectMaduraiHtml(HTML);
  const noolmarabu = out.sutras.filter((s) => s.iyalId === "ezhuthu-noolmarabu");
  assert.equal(noolmarabu.length, 2);
  assert.equal(noolmarabu[0].displayNumber, "1");
  assert.equal(noolmarabu[1].displayNumber, "2");
});

test("generates stable semantic ids (not array indexes)", () => {
  const out = parseProjectMaduraiHtml(HTML);
  assert.equal(out.sutras[0].id, "ezhuthu-noolmarabu-001");
  assert.ok(out.sutras.every((s) => /^[a-z]+-[a-z]+-\d{3}$/.test(s.id)));
});

test("preserves original Tamil lines exactly (no modernisation)", () => {
  const out = parseProjectMaduraiHtml(HTML);
  const s = out.sutras[0];
  assert.deepEqual(s.originalLines, ["எழுத்து எனப்படுப", "அகரம் முதல்", "னகர இறுவாய் முப்பஃது என்ப."]);
  assert.equal(s.lineCount, 3);
});

test("detects glossary keywords from source", () => {
  const out = parseProjectMaduraiHtml(HTML);
  assert.ok(out.sutras[0].keywords.includes("எழுத்து"));
});

test("tokenizeTamilText only returns Tamil tokens", () => {
  assert.deepEqual(tokenizeTamilText("எழுத்து abc 123 மொழி"), ["எழுத்து", "மொழி"]);
});

test("containsGlossaryTerm matches whole tokens", () => {
  assert.equal(containsGlossaryTerm("உயிர் மெய் என்ப", "மெய்"), true);
  assert.equal(containsGlossaryTerm("உயிர்மெய் என்ப", "மெய்"), false);
});

test("missing adhikaram/iyal produce warnings, not silent drops", () => {
  const out = parseProjectMaduraiHtml(HTML);
  assert.ok(out.report.warnings.some((w) => w.severity === "needs-review"));
});
