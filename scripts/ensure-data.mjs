// Guard used by predev/prebuild: ensure generated data exists before the app
// builds. Order of preference:
//   1. Use already-generated data (e.g. committed data/generated/*.json).
//   2. Parse a local source at data/source/ or ../data/source/.
//   3. Fetch the source from Project Madurai (--fetch) — needed on CI / Vercel.
// If none of these produce data, FAIL the build loudly rather than deploying an
// empty site (build-time fetch bakes data into static pages; there is no
// runtime dependency on Project Madurai).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sutras = path.join(ROOT, "data", "generated", "sutras.json");
const importer = path.join(ROOT, "scripts", "import-tolkappiyam.mjs");

function hasData() {
  try {
    return fs.existsSync(sutras) && JSON.parse(fs.readFileSync(sutras, "utf8")).length > 0;
  } catch {
    return false;
  }
}

if (hasData()) {
  console.log("Generated data present — skipping import.");
  process.exit(0);
}

console.log("Generated data missing — generating (will download the source if no local copy is found)…");
const r = spawnSync(process.execPath, [importer, "--fetch"], { stdio: "inherit" });

if (r.status !== 0 || !hasData()) {
  console.error(
    "\nERROR: could not generate the Tolkāppiyam dataset.\n" +
      "The build needs the Project Madurai source. Either commit data/generated/*.json,\n" +
      "or ensure the build machine can reach https://www.projectmadurai.org (used by --fetch).",
  );
  process.exit(1);
}
console.log("Dataset generated successfully.");
