// Validate the human-owned editorial + review-history data against the
// importer-owned source corpus. Empty editorial data is VALID (Phase 3 has not
// started). Any structural error exits non-zero.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GEN = path.join(ROOT, "data", "generated");
const ED_SUTRA = path.join(ROOT, "data", "editorial", "sutras");
const ED_HISTORY = path.join(ROOT, "data", "editorial", "review-history");

const STATUSES = new Set(["not-started", "draft", "reviewed", "verified"]);
const FIELDS = new Set([
  "wordSeparatedText", "simpleTamilExplanation", "detailedTamilExplanation",
  "englishExplanation", "transliteration", "concepts", "glossaryTerms",
  "relatedSutras", "modernTeachingNote",
]);
const ACTIONS = new Set(["created", "updated", "submitted-for-review", "reviewed", "verified", "reopened"]);

function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }
function listJson(dir) { try { return fs.readdirSync(dir).filter((f) => f.endsWith(".json")); } catch { return []; } }

const validSutraIds = new Set((readJson(path.join(GEN, "sutras.json")) ?? []).map((s) => s.id));
const validGlossaryIds = new Set((readJson(path.join(GEN, "glossary.json")) ?? []).map((g) => g.id));

const errors = [];
const err = (m) => errors.push(m);

// Editorial annotations
const seen = new Set();
for (const file of listJson(ED_SUTRA)) {
  const rec = readJson(path.join(ED_SUTRA, file));
  if (!rec) { err(`Malformed JSON: editorial/sutras/${file}`); continue; }
  if (!rec.sutraId) { err(`Missing sutraId: ${file}`); continue; }
  if (seen.has(rec.sutraId)) err(`Duplicate editorial record for ${rec.sutraId}`);
  seen.add(rec.sutraId);
  if (validSutraIds.size && !validSutraIds.has(rec.sutraId)) err(`Unknown sutraId: ${rec.sutraId}`);
  if (rec.overallStatus && !STATUSES.has(rec.overallStatus)) err(`Bad overallStatus '${rec.overallStatus}' in ${rec.sutraId}`);
  for (const [fname, field] of Object.entries(rec)) {
    if (fname === "sutraId" || fname === "overallStatus") continue;
    if (!FIELDS.has(fname)) { err(`Unknown editorial field '${fname}' in ${rec.sutraId}`); continue; }
    if (typeof field !== "object" || field === null) { err(`Malformed field '${fname}' in ${rec.sutraId}`); continue; }
    if (!STATUSES.has(field.status)) err(`Bad status '${field.status}' for ${fname} in ${rec.sutraId}`);
    if (!field.provenance || field.provenance.layer !== "editorial") err(`Missing/invalid provenance for ${fname} in ${rec.sutraId}`);
    if (field.status === "verified" && !(field.provenance && field.provenance.reviewerId)) err(`Verified field '${fname}' in ${rec.sutraId} has no reviewerId`);
    if (field.citations && !Array.isArray(field.citations)) err(`Malformed citations for ${fname} in ${rec.sutraId}`);
    if (fname === "glossaryTerms" && Array.isArray(field.value) && validGlossaryIds.size)
      for (const g of field.value) if (!validGlossaryIds.has(g)) err(`Unknown glossary id '${g}' in ${rec.sutraId}`);
    if (fname === "relatedSutras" && Array.isArray(field.value) && validSutraIds.size)
      for (const r of field.value) if (!validSutraIds.has(r)) err(`Unknown related sutra '${r}' in ${rec.sutraId}`);
  }
}

// Review history
for (const file of listJson(ED_HISTORY)) {
  const recs = readJson(path.join(ED_HISTORY, file));
  if (!Array.isArray(recs)) { err(`Review history not an array: ${file}`); continue; }
  for (const r of recs) {
    if (validSutraIds.size && !validSutraIds.has(r.sutraId)) err(`Review history for unknown sutra '${r.sutraId}'`);
    if (!FIELDS.has(r.field)) err(`Review history unknown field '${r.field}' (${r.sutraId})`);
    if (!ACTIONS.has(r.action)) err(`Review history bad action '${r.action}' (${r.sutraId})`);
    if (!r.date) err(`Review history missing date (${r.sutraId})`);
  }
}

const nEd = listJson(ED_SUTRA).length, nHist = listJson(ED_HISTORY).length;
if (errors.length) {
  console.error(`✗ Editorial validation failed (${errors.length} error(s)):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`✓ Editorial data valid. Annotations: ${nEd}, review-history files: ${nHist}. (Empty is valid — Phase 3 not started.)`);
