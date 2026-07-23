import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getIyalPath, getSutraPath, getAdhikaramPath, getToolPath, getGlossaryPath } from "../lib/routes.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

test("route-helper consolidation: lib/data.ts must not redefine path helpers", () => {
  const src = fs.readFileSync(path.join(ROOT, "lib", "data.ts"), "utf8");
  // These duplicated data.ts implementations were removed; lib/routes.ts is the
  // single source of truth. Re-adding them is the exact drift this guards.
  assert.ok(!/export function getIyalPath\b/.test(src), "getIyalPath must not be redefined in lib/data.ts");
  assert.ok(!/export function getSutraPath\b/.test(src), "getSutraPath must not be redefined in lib/data.ts");
});
