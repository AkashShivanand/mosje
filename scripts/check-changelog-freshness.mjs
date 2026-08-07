#!/usr/bin/env node
/**
 * Changelog freshness gate.
 *
 * The SAMAVESH changelog is hand-maintained, so it silently rots: in August 2026
 * its newest entry was v0.5.0 dated 2026-06-12 and still badged "Current", while
 * 40 commits had landed against the design-system and token packages behind it —
 * including three whole components that already had docs pages and sidebar
 * entries. A stale changelog is worse than none, because people upgrade against
 * it.
 *
 * This fails the build when a *notable* commit (feat / fix / perf, or anything
 * BREAKING) has touched the watched packages since the newest changelog entry
 * and has been sitting unlogged for longer than the grace window.
 *
 * The grace window exists so landing a feature does not turn CI red on the same
 * push — you get GRACE_DAYS to write the entry. Commits that cannot plausibly
 * need a changelog line (docs, chore, test, style, ci, build) are ignored.
 *
 *   node scripts/check-changelog-freshness.mjs
 *   CHANGELOG_GRACE_DAYS=30 node scripts/check-changelog-freshness.mjs
 */

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

// CHANGELOG_PATH exists so the gate itself can be exercised against a fixture —
// a check nobody has ever seen fail is indistinguishable from one that cannot.
const CHANGELOG =
  process.env.CHANGELOG_PATH ??
  "apps/hub/src/app/design-system/resources/changelog/page.tsx";

/** Packages whose changes are expected to show up in the changelog. */
const WATCHED = ["packages/design-system", "packages/tokens"];

/** Conventional-commit types that do not require a changelog entry. */
const IGNORED_TYPES = /^(docs|chore|test|style|ci|build|revert)\b/i;

const GRACE_DAYS = Number(process.env.CHANGELOG_GRACE_DAYS ?? 14);

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8" }).trim();

function fail(msg) {
  console.error(`\n✖ changelog freshness\n${msg}\n`);
  process.exit(1);
}

// A shallow checkout (actions/checkout defaults to depth 1) cannot answer "what
// landed since date X". Skip rather than fail — a gate that reports false reds
// gets disabled, and then it protects nothing.
try {
  if (git("rev-parse", "--is-shallow-repository") === "true") {
    console.log(
      "• changelog freshness: skipped — shallow clone.\n" +
        "  Set `fetch-depth: 0` on actions/checkout to enable this gate.",
    );
    process.exit(0);
  }
} catch {
  console.log("• changelog freshness: skipped — not a git repository.");
  process.exit(0);
}

const source = readFileSync(CHANGELOG, "utf8");
const dates = [...source.matchAll(/date:\s*"(\d{4}-\d{2}-\d{2})"/g)].map(
  (m) => m[1],
);
if (dates.length === 0) {
  fail(
    `No \`date: "YYYY-MM-DD"\` entries found in ${CHANGELOG}.\n` +
      "Either the file moved or the release shape changed — update this script.",
  );
}

const newest = dates.sort().at(-1);

// Commits to the watched packages strictly after the newest logged release.
const raw = git(
  "log",
  `--since=${newest} 23:59:59`,
  "--format=%h\x01%ad\x01%s",
  "--date=short",
  "--",
  ...WATCHED,
);

const unlogged = raw
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [hash, date, subject] = line.split("\x01");
    return { hash, date, subject };
  })
  .filter(({ subject }) => {
    if (/BREAKING/i.test(subject)) return true;
    return !IGNORED_TYPES.test(subject);
  });

if (unlogged.length === 0) {
  console.log(
    `✔ changelog freshness: up to date (newest entry ${newest}, nothing notable behind it).`,
  );
  process.exit(0);
}

const oldest = unlogged.at(-1);
const ageDays = Math.floor(
  (Date.now() - Date.parse(`${oldest.date}T00:00:00Z`)) / 86_400_000,
);

if (ageDays <= GRACE_DAYS) {
  console.log(
    `• changelog freshness: ${unlogged.length} notable commit(s) not yet logged, ` +
      `oldest ${ageDays}d old — within the ${GRACE_DAYS}d grace window.`,
  );
  process.exit(0);
}

fail(
  `The newest changelog entry is dated ${newest}, but ${unlogged.length} notable ` +
    `commit(s) have landed in ${WATCHED.join(" / ")} since then.\n` +
    `The oldest has been unlogged for ${ageDays} day${ageDays === 1 ? "" : "s"} ` +
    `(grace: ${GRACE_DAYS}).\n\n` +
    unlogged.map((c) => `    ${c.date}  ${c.hash}  ${c.subject}`).join("\n") +
    `\n\n  Add a release to ${CHANGELOG}, or raise CHANGELOG_GRACE_DAYS if this ` +
    `run is a deliberate exception.`,
);
