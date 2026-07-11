// Ingest the Project Madurai Tolkāppiyam source (pmuni0100) into structured,
// machine-readable data. This never alters the source Tamil; it only reads,
// segments, and records provenance + parsing uncertainty.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseProjectMaduraiHtml } from "../lib/parser.ts";
import { buildAnalysis } from "../lib/analysis.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_URL = "https://www.projectmadurai.org/pm_etexts/utf8/pmuni0100.html";
const SOURCE_NAME = "project-madurai-pmuni0100.html";
const localSource = path.join(ROOT, "data", "source", SOURCE_NAME);
const parentSource = path.join(ROOT, "..", "data", "source", SOURCE_NAME);
const outDir = path.join(ROOT, "data", "generated");

const wantFetch = process.argv.includes("--fetch");

async function resolveSource() {
  if (fs.existsSync(localSource)) {
    return { html: fs.readFileSync(localSource, "utf8"), from: "local" };
  }
  if (fs.existsSync(parentSource)) {
    const html = fs.readFileSync(parentSource, "utf8");
    fs.mkdirSync(path.dirname(localSource), { recursive: true });
    fs.writeFileSync(localSource, html); // become self-contained
    return { html, from: "parent (copied in)" };
  }
  if (wantFetch) {
    const res = await fetch(SOURCE_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const html = await res.text();
    fs.mkdirSync(path.dirname(localSource), { recursive: true });
    fs.writeFileSync(localSource, html);
    return { html, from: "network (--fetch)" };
  }
  throw new Error(
    `Source not found. Place ${SOURCE_NAME} in data/source/, or run with --fetch to download from Project Madurai.`,
  );
}

const { html, from } = await resolveSource();
const parsed = parseProjectMaduraiHtml(html, `data/source/${SOURCE_NAME}`);
const analysis = buildAnalysis(parsed.sutras, parsed.sections.adhikarams, parsed.sections.iyals);

fs.mkdirSync(outDir, { recursive: true });
const write = (name, data) =>
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, name === "sutras.json" ? 0 : 2));

write("work.json", parsed.work);
write("sections.json", parsed.sections);
write("sutras.json", parsed.sutras);
write("glossary.json", parsed.glossary);
write("parsing-report.json", parsed.report);
write("analysis.json", analysis);

console.log(`Source: ${from}`);
console.log(`Adhikarams: ${parsed.report.totalAdhikaramsFound}/3  Iyals: ${parsed.report.totalIyalsFound}/27  Sutras: ${parsed.report.totalSutrasExtracted}`);
console.log(`Confidence — high: ${parsed.report.highConfidenceSutras}, medium: ${parsed.report.mediumConfidenceSutras}, low: ${parsed.report.lowConfidenceSutras}`);
console.log(`Words: ${analysis.totalWords} (${analysis.uniqueWords} unique)  Warnings: ${parsed.report.warnings.length}`);
console.log(`Wrote ${outDir}`);
