#!/usr/bin/env node
/**
 * Token drift checker — compares tokens.json (code source of truth) against a
 * Figma snapshot (same shape, produced by the /sync-figma workflow which reads the
 * Figma DS variables via the Figma MCP and normalises them with figma-token-map.json).
 *
 *   node check-drift.mjs <figma-snapshot.json>          # report drift (exit 1 if any)
 *   node check-drift.mjs <figma-snapshot.json> --write   # apply Figma values into tokens.json
 *
 * After --write, run `npm run build:tokens` to regenerate tokens.css + tokens.ts.
 */
import { readFile, writeFile } from "node:fs/promises";

const ROOT = new URL(".", import.meta.url).pathname;
const [snapPath, ...flags] = process.argv.slice(2);
const write = flags.includes("--write");
// Only treat code-only tokens as "removed" when the snapshot is the COMPLETE Figma set.
const complete = flags.includes("--complete");

if (!snapPath) {
  console.error("Usage: node check-drift.mjs <figma-snapshot.json> [--write]");
  process.exit(2);
}

const tokens = JSON.parse(await readFile(ROOT + "tokens.json", "utf8"));
const snap = JSON.parse(await readFile(snapPath, "utf8"));

const SECTIONS = ["color", "radius", "font", "type", "shadow"];
const norm = (v) => JSON.stringify(v);
let changes = 0,
  added = 0,
  missing = 0;

for (const section of SECTIONS) {
  const cur = tokens[section] || {};
  const next = snap[section];
  if (!next) continue; // snapshot may cover only some sections
  for (const [k, v] of Object.entries(next)) {
    if (!(k in cur)) {
      console.log(`  + ${section}.${k} = ${norm(v)}   (new in Figma)`);
      added++;
    } else if (norm(cur[k]) !== norm(v)) {
      console.log(`  ~ ${section}.${k}: ${norm(cur[k])} -> ${norm(v)}`);
      changes++;
    }
  }
  if (complete) {
    for (const k of Object.keys(cur)) {
      if (!(k in next)) {
        console.log(`  - ${section}.${k} = ${norm(cur[k])}   (in code, not in Figma)`);
        missing++;
      }
    }
  }
}

const drift = changes + added + missing;
console.log("");
if (drift === 0) {
  console.log("✓ In sync — code tokens match the Figma snapshot.");
  process.exit(0);
}
console.log(`Drift: ${changes} changed, ${added} new in Figma, ${missing} only in code.`);

if (write) {
  for (const section of SECTIONS) {
    if (!snap[section]) continue;
    tokens[section] = { ...(tokens[section] || {}), ...snap[section] };
  }
  await writeFile(ROOT + "tokens.json", JSON.stringify(tokens, null, 2) + "\n");
  console.log("✓ Applied Figma values into tokens.json. Now run: npm run build:tokens");
  process.exit(0);
}
console.log("Run with --write to apply these Figma values into tokens.json.");
process.exit(1);
