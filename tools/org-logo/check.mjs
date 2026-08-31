#!/usr/bin/env node
/**
 * check:org-logos — no mark's path is written outside the brand module.
 *
 * WHY THIS EXISTS. The same 16 organisation marks sat in TWO byte-identical
 * public directories, and `organisation-details.ts` reached into THREE different
 * roots for them, including one used by a single organisation. Every consumer
 * re-derived the path at the point of use, so a mark replaced in one place stayed
 * stale everywhere else, and nothing could tell you where "everywhere else" was.
 *
 * `components/brand/org-logo.tsx` is now the only place a mark's path is written.
 * This gate is what keeps that true, because the rule is otherwise cultural — and
 * `documentation-ds-linkage.md` already records what a rule with no gate is worth.
 *
 * IT IS A RATCHET, the same shape as check:storybook, check:icon-scale and
 * check:radius-linkage. There were 100 literals across 49 files when it was
 * written; sweeping them all in one change would touch seven live portals'
 * chrome at once for no functional gain. So the debt is frozen PER FILE:
 *
 *   - a file not in the baseline that writes a literal            -> FAIL
 *   - a baselined file whose count GROWS                          -> FAIL
 *   - a baselined file whose count SHRINKS                        -> FAIL, re-baseline
 *
 * The third is the one that matters. Without it, one page's cleanup can be spent
 * silently on another page's regression and the total never moves.
 *
 *   npm run check:org-logos            the gate
 *   npm run check:org-logos:baseline   re-freeze after a real improvement
 *   npm run check:org-logos:report     every literal, by file
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
const BASELINE = join(ROOT, "tools/org-logo/baseline.json");

const SCOPES = [
  "apps/hub/src",
  "packages/design-system",
  "apps/storybook/stories",
];

/** The module that is ALLOWED to know a path, and its own documentation. */
const OWNERS = [
  // The registry itself — plain data and pure resolvers, no "use client", so a
  // server component gets the real object rather than a client-reference proxy.
  "packages/design-system/components/brand/org-logo-registry.ts",
  "packages/design-system/components/brand/org-logo.tsx",
  "apps/hub/src/app/design-system/components/brand/org-logo/page.tsx",
  "apps/storybook/stories/OrgLogo.stories.tsx",
];

const EXT = new Set([".ts", ".tsx", ".css", ".mjs", ".js"]);

/**
 * A literal that names a mark. Deliberately narrow: it matches the ASSET, not the
 * word "logo", so a prop called `logoSrc` or a sentence about logos is not a hit.
 */
const PATTERNS = [
  /["'`][^"'`]*\/org-logos\/[^"'`]*["'`]/g,
  /["'`][^"'`]*National-Emblem-logo[^"'`]*["'`]/g,
  /["'`][^"'`]*National_Emblem_logo[^"'`]*["'`]/g,
  /["'`][^"'`]*samavesh-logo[^"'`]*["'`]/g,
];

/**
 * `// org-logo-exempt(reason): why` on the line itself, or anywhere in the comment
 * block directly above it.
 *
 * THE WHOLE BLOCK, not just the previous line — a reason worth writing rarely
 * fits on one, so a two-line comment put the marker on line i-2 and the gate did
 * not see it. An exemption mechanism that only works when the justification is
 * short is one that pushes people towards short justifications.
 */
const EXEMPT = /org-logo-exempt\(([a-z-]+)\)/;
const COMMENT_LINE = /^\s*(\/\/|\/\*|\*)/;

function exemptionAbove(lines, i) {
  const own = EXEMPT.exec(lines[i]);
  if (own) return own;
  for (let j = i - 1; j >= 0 && COMMENT_LINE.test(lines[j]); j -= 1) {
    const found = EXEMPT.exec(lines[j]);
    if (found) return found;
  }
  return null;
}
/*
 * `prose` is the one worth explaining: documentation that QUOTES a path is not a
 * consumer of it. The changelog entry announcing this very gate names the two
 * directories the marks used to live in, and a gate that cannot tell an example
 * from a usage teaches people to stop reading it.
 */
const EXEMPT_KINDS = new Set([
  "third-party",
  "portal-local",
  "specimen",
  "generated",
  "prose",
]);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".next" || entry === "storybook-static") continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (EXT.has(entry.slice(entry.lastIndexOf(".")))) out.push(full);
  }
  return out;
}

function scan() {
  const found = new Map();
  const bad = [];
  for (const scope of SCOPES) {
    const abs = join(ROOT, scope);
    if (!statSync(abs, { throwIfNoEntry: false })) {
      console.error(`✖ scope does not exist: ${scope}`);
      process.exit(2); // a gate that cannot fail is worse than no gate
    }
    for (const file of walk(abs)) {
      const rel = relative(ROOT, file).split(sep).join("/");
      if (OWNERS.includes(rel)) continue;
      const lines = readFileSync(file, "utf8").split("\n");
      const hits = [];
      lines.forEach((line, i) => {
        for (const re of PATTERNS) {
          re.lastIndex = 0;
          if (!re.test(line)) continue;
          const here = exemptionAbove(lines, i);
          if (here) {
            if (!EXEMPT_KINDS.has(here[1])) {
              bad.push(`${rel}:${i + 1} — unknown exemption kind "${here[1]}"`);
            }
            return;
          }
          hits.push({ line: i + 1, text: line.trim().slice(0, 110) });
          return;
        }
      });
      if (hits.length) found.set(rel, hits);
    }
  }
  return { found, bad };
}

const mode = process.argv[2] ?? "--gate";
const { found, bad } = scan();
const counts = Object.fromEntries([...found].map(([f, h]) => [f, h.length]));

if (mode === "--report") {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`org-logo literals: ${total} in ${found.size} file(s)\n`);
  for (const [file, hits] of [...found].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${String(hits.length).padStart(3)}  ${file}`);
    for (const h of hits) console.log(`       :${h.line}  ${h.text}`);
  }
  process.exit(0);
}

if (mode === "--baseline") {
  writeFileSync(BASELINE, `${JSON.stringify(counts, null, 2)}\n`);
  console.log(`✔ baseline written: ${Object.keys(counts).length} file(s)`);
  process.exit(0);
}

let base = {};
try {
  base = JSON.parse(readFileSync(BASELINE, "utf8"));
} catch {
  console.error(`✖ no baseline at ${relative(ROOT, BASELINE)} — run npm run check:org-logos:baseline`);
  process.exit(2);
}

const errors = [...bad];
for (const [file, n] of Object.entries(counts)) {
  const was = base[file];
  if (was === undefined) {
    errors.push(
      `${file}: ${n} mark path(s) written here. Resolve the mark through <OrgLogo> / orgLogoSrc()\n` +
        `      from @mosje/design-system, or declare an exemption: // org-logo-exempt(portal-local): why`,
    );
  } else if (n > was) {
    errors.push(`${file}: ${was} → ${n}. A baselined file may not grow.`);
  } else if (n < was) {
    errors.push(
      `${file}: ${was} → ${n} — an improvement. Re-run npm run check:org-logos:baseline and commit it,\n` +
        `      so the gain cannot be spent later on another file's regression.`,
    );
  }
}
for (const file of Object.keys(base)) {
  if (counts[file] === undefined) {
    errors.push(`${file}: now clean. Delete its baseline entry (npm run check:org-logos:baseline).`);
  }
}

if (errors.length) {
  console.error(`✖ org-logos: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error(`   ${e}`);
  console.error(
    `\n   Every mark's path lives in packages/design-system/components/brand/org-logo.tsx.\n` +
      `   npm run check:org-logos:report lists every literal by file.`,
  );
  process.exit(1);
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(
  `✔ org-logos: no new mark paths. ${total} literal(s) in ${found.size} file(s) remain as declared debt.`,
);
