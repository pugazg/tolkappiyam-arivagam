// Guard used by predev/prebuild: generate data only if it is missing.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sutras = path.join(ROOT, "data", "generated", "sutras.json");
let ok = false;
try { ok = fs.existsSync(sutras) && JSON.parse(fs.readFileSync(sutras, "utf8")).length > 0; } catch {}
if (ok) {
  console.log("Generated data present — skipping import.");
} else {
  console.log("Generated data missing — running import…");
  const r = spawnSync(process.execPath, [path.join(ROOT, "scripts", "import-tolkappiyam.mjs")], { stdio: "inherit" });
  if (r.status !== 0) {
    console.log("Import could not complete automatically. Run `npm run import:data -- --fetch` once with network access.");
  }
}
