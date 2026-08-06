#!/usr/bin/env node
/**
 * Extract the UX4G Design System 3.0 token contract into a reference dataset.
 *
 * WHY THIS EXISTS
 * ───────────────
 * We conform to UX4G 3.0 at the specification level and deliberately do NOT install
 * `ux4g-web-components` (7.6 MB stylesheet + a MutationObserver runtime that rewrites
 * the DOM React owns — see docs/ux4g/UX4G-Code-Readiness-Audit.md §1).
 *
 * To conform to a specification you still need the specification. This script reads the
 * `:root` blocks out of UX4G's published stylesheet and writes the token NAMES and VALUES
 * to a JSON reference file. That file is the baseline the conformance measurement compares
 * against, and the source the `--ux4g-*` parity layer is generated from.
 *
 * Only declarations are extracted — no CSS rules, no runtime, nothing executable. The same
 * values are published openly at https://www.ux4g.gov.in/foundations/tokens.
 *
 * USAGE
 * ─────
 *   node tools/ux4g-conformance/extract-ux4g-tokens.mjs [--version 1.0.3]
 *
 * Downloads the package into a temp dir via `npm pack`, extracts, writes:
 *   packages/tokens/reference/ux4g-3.0.tokens.json
 *
 * Re-run when UX4G publishes a new version; the diff in that JSON is the upgrade surface.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../..");
const OUT = join(REPO, "packages/tokens/reference/ux4g-3.0.tokens.json");

const PKG = "ux4g-web-components";
const versionArg = process.argv.indexOf("--version");
const VERSION = versionArg > -1 ? process.argv[versionArg + 1] : "1.0.3";

/** Split a CSS declaration list on top-level `;`, ignoring `;` inside (), "" or ''. */
function splitDeclarations(body) {
  const out = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (quote) {
      if (ch === quote && body[i - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === ";" && depth === 0) {
      out.push(body.slice(start, i));
      start = i + 1;
    }
  }
  out.push(body.slice(start));
  return out;
}

/**
 * Pull every `--ux4g-*` custom property declared in a `:root` block.
 * Later declarations win, matching the cascade.
 */
function extractRootTokens(css) {
  const tokens = {};
  // `:root{ ... }` — custom-property blocks contain no nested braces.
  const re = /(?:^|[},])\s*:root\s*\{([^{}]*)\}/g;
  let m;
  let blocks = 0;
  while ((m = re.exec(css)) !== null) {
    blocks++;
    for (const decl of splitDeclarations(m[1])) {
      const idx = decl.indexOf(":");
      if (idx === -1) continue;
      const name = decl.slice(0, idx).trim();
      if (!name.startsWith("--ux4g-")) continue;
      tokens[name] = decl.slice(idx + 1).trim();
    }
  }
  return { tokens, blocks };
}

/** Group a flat token map into families by the segment after `--ux4g-`. */
function summarise(tokens) {
  const families = {};
  for (const name of Object.keys(tokens)) {
    const family = name.slice("--ux4g-".length).split("-")[0];
    families[family] = (families[family] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(families).sort((a, b) => b[1] - a[1]));
}

const tmp = mkdtempSync(join(tmpdir(), "ux4g-extract-"));
console.log(`→ npm pack ${PKG}@${VERSION}`);
execFileSync("npm", ["pack", `${PKG}@${VERSION}`, "--silent"], { cwd: tmp, stdio: ["ignore", "ignore", "inherit"] });
execFileSync("tar", ["xzf", `${PKG}-${VERSION}.tgz`], { cwd: tmp });

const cssPath = join(tmp, "package/styles/ux4g.css");
const css = readFileSync(cssPath, "utf8");
const pkgJson = JSON.parse(readFileSync(join(tmp, "package/package.json"), "utf8"));

const { tokens, blocks } = extractRootTokens(css);
const names = Object.keys(tokens).sort();
if (names.length === 0) {
  console.error("✗ No --ux4g-* tokens found. The stylesheet structure changed — inspect it before trusting this.");
  process.exit(1);
}

const payload = {
  $description:
    "UX4G Design System 3.0 token contract, extracted from the published stylesheet for " +
    "conformance measurement and to generate the --ux4g-* parity layer. Reference data only " +
    "— MoSJE does not install or ship ux4g-web-components. See docs/ux4g/UX4G-Code-Readiness-Audit.md.",
  $source: {
    package: PKG,
    version: pkgJson.version,
    license: pkgJson.license ?? "Proprietary (see package)",
    file: "styles/ux4g.css",
    stylesheetBytes: css.length,
    rootBlocksParsed: blocks,
    extractedAt: new Date().toISOString().slice(0, 10),
    publishedReference: "https://www.ux4g.gov.in/foundations/tokens",
  },
  $summary: { tokenCount: names.length, families: summarise(tokens) },
  tokens: Object.fromEntries(names.map((n) => [n, tokens[n]])),
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");

console.log(`✓ ${names.length} tokens from ${blocks} :root block(s) → ${OUT.replace(REPO + "/", "")}`);
for (const [family, n] of Object.entries(payload.$summary.families)) {
  console.log(`    ${String(n).padStart(4)}  ${family}`);
}
