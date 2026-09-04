/**
 * Case-sensitivity audit — the one class of defect a Mac cannot see and ubuntu always can.
 *
 * macOS is case-INSENSITIVE. `import { Button } from "../Components/button"` resolves
 * here when the directory is really `components`, and fails on the Linux runner with
 * "Module not found". CLAUDE.md already names case-collisions as a hazard this repo has
 * been bitten by; this is the half of it a build on this machine will never report.
 *
 * It is not part of the GitHub workflows because on ubuntu the compiler already enforces
 * it. It runs here BECAUSE we are not on ubuntu — a local CI that only mirrors the remote
 * one is blind exactly where the platforms differ.
 *
 * TWO CHECKS:
 *   1. Every relative import in the source resolves with EXACT casing, compared against
 *      the real directory entries rather than against the path we were given.
 *   2. No two tracked paths differ only by case — which is a merge waiting to destroy one
 *      of them on a case-insensitive checkout.
 */
import { readdirSync, existsSync, statSync, readFileSync } from "node:fs";
import { dirname, join, resolve, relative, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SRC = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const EXTS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".css"];
const INDEX = ["index.ts", "index.tsx", "index.js", "index.jsx", "index.mjs"];

const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

const dirCache = new Map();
const entriesOf = (dir) => {
  if (!dirCache.has(dir)) {
    try { dirCache.set(dir, readdirSync(dir)); } catch { dirCache.set(dir, null); }
  }
  return dirCache.get(dir);
};

/** Does this absolute path exist with EXACTLY this spelling? */
function existsExact(p) {
  const entries = entriesOf(dirname(p));
  return entries ? entries.includes(basename(p)) : false;
}

const problems = [];

// ── 1. relative imports ─────────────────────────────────────────────────────
const IMPORT = /(?:^|\n)\s*(?:import|export)[\s\S]{0,200}?from\s*["'](\.[^"']+)["']|require\(\s*["'](\.[^"']+)["']\s*\)/g;
let scanned = 0;
for (const rel of tracked) {
  if (!SRC.test(rel)) continue;
  if (rel.includes("node_modules")) continue;
  const abs = join(ROOT, rel);
  let src;
  try { src = readFileSync(abs, "utf8"); } catch { continue; }
  scanned++;
  for (const m of src.matchAll(IMPORT)) {
    const spec = m[1] ?? m[2];
    if (!spec) continue;
    const target = resolve(dirname(abs), spec);

    // Find how it actually resolves, then check the spelling of every segment we were given.
    let resolved = null;
    for (const ext of EXTS) {
      if (existsSync(target + ext) && statSync(target + ext).isFile()) { resolved = target + ext; break; }
    }
    if (!resolved && existsSync(target) && statSync(target).isDirectory()) {
      for (const i of INDEX) if (existsSync(join(target, i))) { resolved = join(target, i); break; }
    }
    if (!resolved) continue; // unresolvable is typecheck's problem, not ours

    // The resolved file is real by construction; what can be miscased is what the
    // author WROTE. Walk the specifier segment by segment against real directory entries.
    const spelled = resolve(dirname(abs), spec);
    let cursor = ROOT, bad = null;
    for (const seg of relative(ROOT, spelled).split("/")) {
      const next = join(cursor, seg);
      if (!existsSync(next)) break; // an extension-less tail is normal, not a defect
      if (!existsExact(next)) { bad = relative(ROOT, next); break; }
      cursor = next;
    }
    if (bad) {
      problems.push({ kind: "import", file: rel, spec, detail: `"${bad}" is not the real spelling on disk` });
    }
  }
}

function readFileSyncSafe(p) {
  try { return require("node:fs").readFileSync(p, "utf8"); } catch { return null; }
}

// ── 2. paths differing only by case ─────────────────────────────────────────
const byLower = new Map();
for (const p of tracked) {
  const k = p.toLowerCase();
  if (!byLower.has(k)) byLower.set(k, []);
  byLower.get(k).push(p);
}
for (const [, list] of byLower) {
  if (list.length > 1) problems.push({ kind: "collision", detail: list.join("  ↔  ") });
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`case-audit: ${scanned} source file(s) · ${tracked.length} tracked path(s)`);

// The first version of this file used `require` inside an ESM module, so every read threw,
// nothing was scanned, and it reported a clean pass. A check that can pass on zero input
// is not a check.
if (scanned < 100) {
  console.error(`\n✖ case-audit scanned only ${scanned} file(s) — it cannot pass vacuously. Something is wrong with the scan itself.`);
  process.exit(2);
}
if (!problems.length) {
  console.log("✔ every relative import matches the real spelling on disk, and no two paths differ only by case.");
  process.exit(0);
}
console.error(`\n✖ ${problems.length} case problem(s) — these resolve on macOS and FAIL on the Linux runner:\n`);
for (const p of problems) {
  if (p.kind === "collision") console.error(`   two tracked paths differ only by case:\n     ${p.detail}\n`);
  else console.error(`   ${p.file}\n     imports "${p.spec}" — ${p.detail}\n`);
}
process.exit(1);
