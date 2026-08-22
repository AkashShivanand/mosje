#!/usr/bin/env node
/**
 * Catches what a documentation GENERATOR gets wrong, which lint and typecheck do not.
 *
 * A generator ran over this repo in August 2026 and scaffolded a page for every export. It
 * left three marks that nothing was watching for:
 *
 *   1. A stub SHADOWING a real page. It derived each page's group from the component's source
 *      folder, so `SiteHeader` (documented by hand at section-templates/site-header, 749 lines)
 *      also got a 28-line "waiting for full documentation content" stub at
 *      navigation/site-header — and the nav pointed at the stub. Three of the estate's most
 *      important components documented as empty pages for a week.
 *   2. Two routes for one component, so the sidebar listed Tooltip twice.
 *   3. Escaped backticks written into live code — `\`` and `\${` outside any template literal.
 *      That is a syntax error, and it masked a pile of real type errors beneath it until it
 *      was fixed.
 *
 * The generator was never committed and no longer exists, so there is nothing to patch. This
 * gate is the guardrail instead: run it and the next generator cannot land the same damage.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DOCS = join(ROOT, "apps/hub/src/app/design-system/components");
const NAV = join(ROOT, "apps/hub/src/lib/design-system/nav.ts");

const STUB_MARKER = "Documentation Stub";

/** Every `<group>/<slug>/page.tsx` under the components tree. */
function docPages(dir, group = null, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      docPages(full, group ?? name, out);
    } else if (name === "page.tsx" && group) {
      // route path relative to the components root, e.g. "forms/input"
      const route = relative(DOCS, full).replace(/\/page\.tsx$/, "");
      if (route) out.push({ group, route, file: full, body: readFileSync(full, "utf8") });
    }
  }
  return out;
}

const pages = docPages(DOCS);
const failures = [];

// ── 1 + 2. One route per component, and never a stub shadowing a real page ────
const bySlug = new Map();
for (const p of pages) {
  const key = p.route.split("/").pop();
  if (!bySlug.has(key)) bySlug.set(key, []);
  bySlug.get(key).push(p);
}

for (const [slug, entries] of bySlug) {
  if (entries.length < 2) continue;
  const real = entries.filter((e) => !e.body.includes(STUB_MARKER));
  const stubs = entries.filter((e) => e.body.includes(STUB_MARKER));
  if (stubs.length && real.length) {
    for (const s of stubs) {
      failures.push(
        `stub shadows real documentation: ${s.group}/${slug} is a stub while ` +
          `${real.map((r) => `${r.group}/${slug}`).join(", ")} is written. Delete the stub ` +
          `and point the nav at the real page.`,
      );
    }
  } else {
    failures.push(
      `two routes document ${slug}: ${entries.map((e) => `${e.group}/${slug}`).join(", ")}. ` +
        `A component has exactly one home (packages/design-system/INFORMATION-ARCHITECTURE.md §6).`,
    );
  }
}

// ── 3. The escaped-backtick artefact, outside any template literal ────────────
// A real template literal may legitimately contain \` — that is how a CodeBlock shows one.
// The artefact is an ESCAPED backtick where no template literal is open.
for (const p of pages) {
  let inTemplate = false;
  p.body.split("\n").forEach((line, i) => {
    if (!inTemplate && /\\[`$]/.test(line) && !line.trimStart().startsWith("*")) {
      failures.push(
        `${relative(ROOT, p.file)}:${i + 1} — escaped backtick in live code. A generator wrote ` +
          `\\\` or \\\${ outside a template literal; that is a syntax error.`,
      );
    }
    // crude but sufficient: an odd number of unescaped backticks flips template state
    const ticks = (line.match(/(?<!\\)`/g) || []).length;
    if (ticks % 2 === 1) inTemplate = !inTemplate;
  });
}

// ── The nav may not point at a route that does not exist ──────────────────────
const navSrc = readFileSync(NAV, "utf8");
const routes = new Set(pages.map((p) => `/design-system/components/${p.route}`));
const seenHrefs = new Set();
for (const m of navSrc.matchAll(/"(\/design-system\/components\/[a-z0-9/-]+)"/g)) {
  const href = m[1];
  if (!routes.has(href)) failures.push(`nav points at a route with no page: ${href}`);
  if (seenHrefs.has(href)) failures.push(`nav lists the same route twice: ${href}`);
  seenHrefs.add(href);
}

if (failures.length) {
  console.error(`\n✖ docs routes: ${failures.length} problem(s).\n`);
  for (const f of failures) console.error(`   ${f}`);
  console.error(
    "\n  A documentation page is believed BECAUSE it looks authoritative. An empty\n" +
      "  one that outranks the real page in the nav is worse than no page at all.\n",
  );
  process.exit(1);
}

const stubs = pages.filter((p) => p.body.includes(STUB_MARKER)).length;
console.log(
  `✔ docs routes: ${pages.length} page(s), one per component, nav resolves — ` +
    `${stubs} awaiting content (none shadowing a written page).`,
);
