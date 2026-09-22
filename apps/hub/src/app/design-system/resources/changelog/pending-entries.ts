import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { CHANGE_KINDS, type ChangeEntry } from "./entry";

/**
 * Changelog entries that have landed but have not been given a version yet.
 *
 * WHY THIS EXISTS. Every branch used to add its release block to the top of the
 * `RELEASES` array in `page.tsx`, which meant every branch touched the same
 * line, chose the same next version number, and moved the same `current: true`
 * flag. Three guaranteed collisions. One small chore branch needed THREE merges
 * of `main` in under an hour on 2026-09-16, every one of them this file, and the
 * documented remedy — "keep both sets, renumber the unmerged branch upward" —
 * is a remedy for a wound that should not be inflicted.
 *
 * A branch now writes ONE NEW FILE into `pending/`. Two branches adding two
 * different files merge cleanly, because git has nothing to reconcile: there is
 * no shared line, no shared number, and no shared flag. The version is assigned
 * later, on `main`, by `scripts/changelog-release.mjs` — see `pending/README.md`.
 *
 * This is read at BUILD time by a server component, so the directory listing
 * never reaches the browser and the page stays static.
 */

/** `next build` and `next dev` both run with `apps/hub` as the working directory. */
const HERE = "src/app/design-system/resources/changelog/pending";

/* `turbopackIgnore`: these are directory paths read with `readdirSync`, which the
   file tracer cannot follow, so without it the tracer ships the WHOLE PROJECT
   with the changelog's function ("Dynamic filesystem access causes tracing of the
   whole project" — 4,931 traced files). The page is prerendered, so the read only
   ever happens at build time, where the directory is on disk. If this page is
   ever made dynamic, these files must be named in `outputFileTracingIncludes`
   instead — see docs/audit/vercel-storage-2026-09-08.md. */
const CANDIDATES = [
  join(/* turbopackIgnore: true */ process.cwd(), HERE),
  // A runner that starts from the repo root instead of the app.
  join(/* turbopackIgnore: true */ process.cwd(), "apps", "hub", HERE),
];

function pendingDir(): string | null {
  for (const dir of CANDIDATES) {
    try {
      readdirSync(dir);
      return dir;
    } catch {
      /* try the next one */
    }
  }
  return null;
}

function read(dir: string): ChangeEntry[] {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    // Stable order, so the rendered page does not reshuffle between builds on a
    // filesystem that does not sort its directory listing.
    .sort();

  const entries: ChangeEntry[] = [];
  for (const file of files) {
    const raw = readFileSync(join(dir, file), "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new Error(`changelog: ${file} is not valid JSON — ${String(err)}`);
    }
    // A malformed entry must not render as a blank bullet on a government page;
    // failing the build is the kinder outcome, and `check:changelog-entries`
    // says the same thing earlier and more clearly.
    const e = parsed as Partial<ChangeEntry>;
    if (!e || typeof e.text !== "string" || !e.text.trim()) {
      throw new Error(`changelog: ${file} has no \`text\`.`);
    }
    if (!e.kind || !CHANGE_KINDS.includes(e.kind)) {
      throw new Error(
        `changelog: ${file} has kind "${String(e.kind)}" — expected one of ${CHANGE_KINDS.join(", ")}.`,
      );
    }
    entries.push({
      kind: e.kind,
      text: e.text,
      ...(typeof e.migration === "string" && e.migration.trim()
        ? { migration: e.migration }
        : {}),
    });
  }
  return entries;
}

const dir = pendingDir();

/** Entries waiting for a version. Empty on a tree where everything is released. */
export const PENDING: ChangeEntry[] = dir ? read(dir) : [];
