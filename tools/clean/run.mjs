#!/usr/bin/env node
/**
 * Remove build artefacts, and REFUSE to remove anything else.
 *
 * WHY THIS IS A SCRIPT WITH A FIXED LIST, AND NOT A RECURSIVE DELETE IN A
 * package.json FIELD.
 *
 * `.claude/hooks/guard.sh` blocks recursive deletes on purpose: they are
 * irreversible and bypass the Trash. Putting a bare one in package.json would
 * not make it safer — it would only make it invisible to that hook. The command
 * a human reviews becomes `npm run clean`, and what it actually removes stops
 * being on screen. So the paths are a FIXED LIST here, in a file that shows up
 * in a diff, and every one is checked against git before it is touched.
 *
 * THE CHECK IS NOT DECORATION. `packages/tokens/dist` looks exactly like a build
 * output and is TRACKED — seven files, including figma.tokens.json. A script
 * that swept `dist` directories would have deleted committed artefacts on its
 * very first run. That is why every target is VERIFIED rather than assumed:
 *
 *   1. the path resolves INSIDE this repository, and
 *   2. git ignores it, and
 *   3. git tracks NOTHING inside it.
 *
 * A target failing any of the three is skipped and reported, never removed.
 *
 *   npm run clean               caches only — they come back on the next build
 *   npm run clean -- --deep     also built OUTPUT, which needs a rebuild step
 *   npm run clean -- --dry-run  print what would go, remove nothing
 */
import { rmSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const argv = process.argv.slice(2);
const DEEP = argv.includes("--deep");
const DRY = argv.includes("--dry-run");

/** Caches. Regenerated on their own by the next dev server or build. */
const CACHES = [
  "apps/hub/.next",
  "apps/docs/.next",
  ".turbo",
  "apps/hub/.turbo",
  "apps/storybook/.turbo",
  "packages/design-system/.turbo",
];

/**
 * Built OUTPUT. Also disposable, but nothing regenerates it on its own, so the
 * command that does is named against each. /storybook serves this directory in
 * dev exactly as in production and falls back to the unavailable page without
 * it — which is why this half is opt-in rather than part of a plain `clean`.
 */
const OUTPUTS = [
  ["apps/storybook/storybook-static", "npm run build:storybook --prefix apps/hub"],
  ["apps/hub/public/storybook", "npm run build:storybook --prefix apps/hub"],
];

const bytes = (p) => {
  let n = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const f = join(d, e.name);
      try {
        e.isDirectory() ? walk(f) : (n += statSync(f).size);
      } catch {
        /* a file that vanished mid-walk is one we did not need to count */
      }
    }
  };
  try {
    statSync(p).isDirectory() ? walk(p) : (n = statSync(p).size);
  } catch {
    /* nothing there */
  }
  return n;
};

const human = (n) =>
  n >= 1e9 ? (n / 1e9).toFixed(1) + " GB" : n >= 1e6 ? Math.round(n / 1e6) + " MB" : Math.round(n / 1e3) + " KB";

const git = (args) => {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};

/** The three conditions. Returns a REASON to refuse, or null to proceed. */
function refuse(rel) {
  const abs = resolve(ROOT, rel);
  if (!abs.startsWith(ROOT + "/")) return "resolves outside the repository";
  if (git(["check-ignore", rel]) === "") return "is NOT gitignored — it may hold real files";
  const tracked = git(["ls-files", rel]);
  if (tracked !== "") {
    const lines = tracked.split("\n").filter(Boolean);
    return `has ${lines.length} TRACKED file(s) inside — e.g. ${lines[0]}`;
  }
  return null;
}

const targets = [...CACHES.map((p) => [p, null]), ...(DEEP ? OUTPUTS : [])];
let freed = 0;
let count = 0;
let refused = 0;
const rebuilds = new Set();

for (const [rel, rebuild] of targets) {
  if (!existsSync(resolve(ROOT, rel))) continue;

  const why = refuse(rel);
  if (why) {
    console.error(`  ✖ REFUSED  ${rel}\n             ${why}`);
    refused += 1;
    continue;
  }

  const size = bytes(resolve(ROOT, rel));
  if (DRY) {
    console.log(`  would remove  ${rel.padEnd(38)} ${human(size)}`);
  } else {
    rmSync(resolve(ROOT, rel), { recursive: true, force: true });
    console.log(`  removed       ${rel.padEnd(38)} ${human(size)}`);
    if (rebuild) rebuilds.add(rebuild);
  }
  freed += size;
  count += 1;
}

if (count === 0 && refused === 0) {
  console.log("✔ clean: nothing to remove — no build artefacts present.");
} else if (count > 0) {
  console.log(`\n${DRY ? "•" : "✔"} clean: ${count} path(s), ${human(freed)}${DRY ? " would be freed" : " freed"}.`);
}
if (!DEEP && !DRY && count > 0) {
  console.log("  built output left in place — pass --deep to remove that too");
}
for (const r of rebuilds) console.log(`  rebuild with: ${r}`);
if (refused > 0) process.exitCode = 1;
