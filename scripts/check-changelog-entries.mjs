#!/usr/bin/env node
/**
 * Pending changelog entries are well-formed.
 *
 * `pending-entries.ts` throws on a malformed file, so a bad entry already fails
 * the build — but it fails it deep inside `next build`, with a stack, on the one
 * surface where the estate's own rule says nothing may render blank. This says
 * the same thing in a second, names the file, and says what to write instead.
 *
 *   node scripts/check-changelog-entries.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "apps/hub/src/app/design-system/resources/changelog/pending";
const KINDS = ["Breaking", "Added", "Changed", "Fixed", "Removed"];

let files;
try {
  files = readdirSync(DIR);
} catch {
  console.log(`• changelog entries: no ${DIR} directory — nothing to check.`);
  process.exit(0);
}

const json = files.filter((f) => f.endsWith(".json"));
const stray = files.filter((f) => !f.endsWith(".json") && f !== "README.md");
const problems = [];

for (const f of stray) {
  problems.push(`${f} — only .json entries and README.md belong here.`);
}

for (const file of json) {
  const path = join(DIR, file);
  let e;
  try {
    e = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    problems.push(`${file} — not valid JSON (${String(err).split("\n")[0]}).`);
    continue;
  }
  if (typeof e.text !== "string" || !e.text.trim()) {
    problems.push(`${file} — no \`text\`. The entry is the sentence a reader acts on.`);
  }
  if (!KINDS.includes(e.kind)) {
    problems.push(`${file} — kind "${e.kind}" is not one of ${KINDS.join(", ")}.`);
  }
  if (e.kind === "Breaking" && !e.migration) {
    problems.push(
      `${file} — Breaking with no \`migration\`. Say where a consumer goes to migrate; ` +
        `a changelog that cannot say what broke is a list of news.`,
    );
  }
  for (const key of Object.keys(e)) {
    if (!["kind", "text", "migration"].includes(key)) {
      problems.push(`${file} — unknown field "${key}". Only kind, text and migration are read.`);
    }
  }
}

if (problems.length) {
  console.error(
    `\n✖ changelog entries — ${problems.length} problem(s) in ${DIR}\n` +
      problems.map((p) => `    ${p}`).join("\n") +
      `\n\n  The shape is { "kind": "Fixed", "text": "…" }. See ${DIR}/README.md.\n`,
  );
  process.exit(1);
}

console.log(
  `✔ changelog entries: ${json.length} pending entr${json.length === 1 ? "y" : "ies"}, all well-formed.`,
);
