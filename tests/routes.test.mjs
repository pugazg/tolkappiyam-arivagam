import { test } from "node:test";
import assert from "node:assert/strict";
import { getIyalPath, getSutraPath, getAdhikaramPath, getToolPath, getGlossaryPath } from "../lib/routes.ts";

test("canonical route helpers", () => {
  assert.equal(getAdhikaramPath("ezhuthu"), "/adhikaram/ezhuthu");
  assert.equal(getIyalPath("ezhuthu", "ezhuthu-noolmarabu"), "/adhikaram/ezhuthu/ezhuthu-noolmarabu");
  assert.equal(getSutraPath("ezhuthu-noolmarabu-001"), "/sutra/ezhuthu-noolmarabu-001");
  assert.equal(getToolPath("matra-explorer"), "/tools/matra-explorer");
  assert.equal(getGlossaryPath("uyir"), "/glossary#uyir");
});

test("நூல் மரபு canonical link regression (Māttirai tool link)", () => {
  // The Māttirai tool's 'See நூல் மரபு' must resolve to the real route.
  assert.equal(getIyalPath("ezhuthu", "ezhuthu-noolmarabu"), "/adhikaram/ezhuthu/ezhuthu-noolmarabu");
});
