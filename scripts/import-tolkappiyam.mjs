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
const FETCH_NAME = "project-madurai-pmuni0100.html";
const SOURCE_DIR = path.join(ROOT, "data", "source");
const PARENT_DIR = path.join(ROOT, "..", "data", "source");
const outDir = path.join(ROOT, "data", "generated");

const wantFetch = process.argv.includes("--fetch");

// The parser reads either the Project Madurai HTML or an equivalent plain-text /
// markdown export (tag-stripping is a no-op on plain text). So accept any
// .md / .txt / .html file placed in data/source/, whatever it is named.
function findSourceFile(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((f) => !f.startsWith(".") && /\.(md|markdown|txt|html?)$/i.test(f));
  if (!files.length) return null;
  const preferred =
    files.find((f) => /pmuni0100/i.test(f)) ||
    files.find((f) => /tholk|tolk|tolka|தொல்/i.test(f)) ||
    files.find((f) => /\.html?$/i.test(f)) ||
    files[0];
  return path.join(dir, preferred);
}

async function resolveSource() {
  let file = findSourceFile(SOURCE_DIR);
  if (file) return { text: fs.readFileSync(file, "utf8"), from: `local (${path.basename(file)})`, name: path.basename(file) };

  file = findSourceFile(PARENT_DIR);
  if (file) {
    const text = fs.readFileSync(file, "utf8");
    fs.mkdirSync(SOURCE_DIR, { recursive: true });
    fs.writeFileSync(path.join(SOURCE_DIR, path.basename(file)), text); // become self-contained
    return { text, from: `parent (${path.basename(file)}, copied in)`, name: path.basename(file) };
  }

  if (wantFetch) {
    const res = await fetch(SOURCE_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const text = await res.text();
    fs.mkdirSync(SOURCE_DIR, { recursive: true });
    fs.writeFileSync(path.join(SOURCE_DIR, FETCH_NAME), text);
    return { text, from: "network (--fetch)", name: FETCH_NAME };
  }

  throw new Error(
    "No source found in data/source/ (looked for *.md, *.txt, *.html). Add your source file there, or run with --fetch to download from Project Madurai.",
  );
}

const { text, from, name } = await resolveSource();
const parsed = parseProjectMaduraiHtml(text, `data/source/${name}`);
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
