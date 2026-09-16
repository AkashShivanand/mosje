#!/usr/bin/env node
/**
 * Cut a changelog release: fold `pending/*.json` into a numbered release.
 *
 * WHY THE NUMBER IS ASSIGNED HERE AND NOT IN A BRANCH. A version chosen in a
 * branch is a guess about what will land first, and when the guess is wrong it
 * is a merge conflict — on a 2,490-line file, on the same line, every time. On
 * 2026-09-16 one chore branch needed three merges of `main` in under an hour and
 * all three conflicted here and nowhere else. A branch now adds a FILE and says
 * nothing about versions; this runs afterwards, on `main`, where there is
 * nothing to race.
 *
 *   npm run changelog:release
 *   npm run changelog:release -- --dry-run
 *   npm run changelog:release -- --version v1.0.0
 *   npm run changelog:release -- --date 2026-09-17
 *
 * It rewrites `page.tsx` by inserting one release block at the top of the
 * `RELEASES` array, clears the `current: true` that was there, and deletes the
 * pending files it folded. Review the diff and commit it like anything else.
 */
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DIR = "apps/hub/src/app/design-system/resources/changelog";
const PAGE = join(ROOT, DIR, "page.tsx");
const PENDING = join(ROOT, DIR, "pending");
const KINDS = ["Breaking", "Added", "Changed", "Fixed", "Removed"];

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1] ?? null;
};
const DRY = argv.includes("--dry-run");

function die(msg) {
  console.error(`\n✖ changelog:release\n${msg}\n`);
  process.exit(1);
}

/* ── 1. Collect the pending entries ──────────────────────────────────────── */

let files;
try {
  files = readdirSync(PENDING).filter((f) => f.endsWith(".json")).sort();
} catch {
  die(`No pending directory at ${DIR}/pending — run this from the repo root.`);
}

if (files.length === 0) {
  console.log("• changelog:release: nothing pending. No release to cut.");
  process.exit(0);
}

const entries = files.map((file) => {
  let e;
  try {
    e = JSON.parse(readFileSync(join(PENDING, file), "utf8"));
  } catch (err) {
    die(`${file} is not valid JSON — ${String(err)}`);
  }
  if (typeof e.text !== "string" || !e.text.trim()) die(`${file} has no \`text\`.`);
  if (!KINDS.includes(e.kind)) {
    die(`${file} has kind "${e.kind}" — expected one of ${KINDS.join(", ")}.`);
  }
  if (e.kind === "Breaking" && !e.migration) {
    die(`${file} is Breaking and carries no \`migration\`. Say where a consumer goes.`);
  }
  return { file, ...e };
});

/* ── 2. Work out the version ─────────────────────────────────────────────── */

const source = readFileSync(PAGE, "utf8");
const versions = [...source.matchAll(/version:\s*"v(\d+)\.(\d+)\.(\d+)"/g)].map((m) => ({
  major: +m[1], minor: +m[2], patch: +m[3],
}));
if (versions.length === 0) die(`No \`version: "vX.Y.Z"\` found in ${DIR}/page.tsx.`);

const newest = versions.sort(
  (a, b) => b.major - a.major || b.minor - a.minor || b.patch - a.patch,
)[0];

// Pre-1.0 the estate bumps the MINOR for every release, breaking or not — the
// changelog page says so in its own "How to read this" callout. Honour that
// rather than inventing a scheme here; `--version` is the override for the day
// it stops being true.
const version = flag("version") ?? `v${newest.major}.${newest.minor + 1}.0`;
if (!/^v\d+\.\d+\.\d+$/.test(version)) die(`--version ${version} is not vX.Y.Z.`);
if (source.includes(`version: "${version}"`)) {
  die(`${version} is already in the changelog. Pass a different --version.`);
}

const date = flag("date") ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) die(`--date ${date} is not YYYY-MM-DD.`);

/* ── 3. Render the block, in the file's own shape ────────────────────────── */

// The page stores non-ASCII as \u escapes, which is what every existing entry
// looks like; matching that keeps the diff to the lines that actually changed.
const esc = (s) =>
  JSON.stringify(s).replace(/[-￿]/g, (c) =>
    `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );

const lines = entries.map((e) => {
  const migration = e.migration ? `, migration: ${esc(e.migration)}` : "";
  return `      { kind: ${esc(e.kind)}, text: ${esc(e.text)}${migration} },`;
});

const block = [
  "  {",
  `    version: "${version}",`,
  `    date: "${date}",`,
  "    current: true,",
  "    changes: [",
  ...lines,
  "    ],",
  "  },",
].join("\n");

/* ── 4. Insert it, and demote the badge that was current ─────────────────── */

const ANCHOR = "const RELEASES: Release[] = [\n";
if (!source.includes(ANCHOR)) die(`Could not find \`${ANCHOR.trim()}\` in page.tsx.`);

// Exactly one release may be current, and it is the one just written — so the
// tail is demoted and the new block is left alone. Splitting the string is what
// makes that unambiguous; a positional test inside a `replace` callback reads
// against the string being built, which is not the one the offsets belong to.
const head = source.slice(0, source.indexOf(ANCHOR) + ANCHOR.length);
const tail = source.slice(head.length).replace(/^(\s*)current: true,$/gm, "$1current: false,");
const next = head + block + "\n" + tail;

const current = (next.match(/^\s*current: true,$/gm) ?? []).length;
if (current !== 1) {
  die(`Expected exactly one \`current: true\` after the fold, found ${current}.`);
}

if (DRY) {
  console.log(`• changelog:release --dry-run\n`);
  console.log(`  ${version}  ${date}  (${entries.length} entr${entries.length === 1 ? "y" : "ies"})`);
  for (const e of entries) console.log(`    ${e.kind.padEnd(8)} ${e.file}`);
  console.log(`\n  Would rewrite ${DIR}/page.tsx and delete ${entries.length} pending file(s).`);
  process.exit(0);
}

writeFileSync(PAGE, next);
for (const e of entries) unlinkSync(join(PENDING, e.file));

console.log(`✔ changelog:release — ${version} (${date}), ${entries.length} entr${entries.length === 1 ? "y" : "ies"} folded:`);
for (const e of entries) console.log(`    ${e.kind.padEnd(8)} ${e.file}`);
console.log(`\n  Review the diff, then commit page.tsx and the deleted pending files together.`);
