#!/usr/bin/env node
/**
 * `linkAs` must be passed wherever the estate actually navigates.
 *
 * ── WHY THIS GATE EXISTS ────────────────────────────────────────────────────
 *
 * `SiteFooter`, `ContentNav`, `Breadcrumb` and `Ticker` had taken a `linkAs`
 * prop for months so an app can hand them `next/link`. The MASTHEAD — the one
 * navigation surface on every page of every portal in the estate — was the only
 * one that never got it, and nobody noticed across 22 call sites, because
 * forgetting it fails silently: the component renders a bare `<a href>`, the
 * page still works, and every click quietly costs a full document load. Measured
 * before it was fixed, one menu click re-fetched 30 script files and took 1.9s
 * to `loadEventEnd` on localhost with a warm cache.
 *
 * It then went wrong a SECOND time within a day, which is what turned "we should
 * add a gate" into this file. A parallel branch had to drop `linkAs={Link}` from
 * `eutthan-shell.tsx` because the prop did not exist on `main` yet — entirely
 * correct at the time — and once the prop landed, nothing pulled it back. One
 * portal's masthead silently returned to full page loads. A prop that can be
 * removed for a good reason and never restored is exactly the shape of defect a
 * ratchet is for.
 *
 * ── WHAT IT CHECKS ──────────────────────────────────────────────────────────
 *
 * The component list is DERIVED from the design-system source, never
 * transcribed: any exported `*Props` interface declaring `linkAs` puts its
 * component in scope automatically. Add `linkAs` to a new component tomorrow and
 * its call sites are gated the same day, with nothing to remember here.
 *
 * ── WHAT IT DELIBERATELY DOES NOT CHECK ─────────────────────────────────────
 *
 * Documentation specimens and Storybook stories. Both render components to be
 * LOOKED AT rather than navigated: their hrefs are "#", Storybook has no router
 * at all, and `<a>` is the correct element in both. Gating them would produce a
 * wall of exemptions, and a gate everyone learns to silence is not a gate — the
 * same reasoning `documentation-ds-linkage.md` gives for its advisory split.
 * Every exclusion below carries its reason, and an exclusion path that matches
 * nothing is a hard error, so a scope cannot quietly stop covering anything.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { scanSource } from "./scan.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const rel = (p) => path.relative(ROOT, p);

/** Where components that accept `linkAs` are declared. */
const DS_COMPONENTS = "packages/design-system/components";

/** Where a call site is real navigation and must therefore pass the prop. */
const SCOPES = ["apps/hub/src"];

/**
 * Paths inside a scope that are exempt, each with the reason it is exempt.
 * A rule matching nothing is a FAILURE: an exclusion that has silently stopped
 * applying is how a gate ends up measuring the wrong estate.
 */
const EXCLUSIONS = [
  {
    prefix: "apps/hub/src/app/design-system/",
    why: "Documentation specimens. They render a component to be looked at, not navigated — their hrefs are \"#\" — so a plain anchor is the correct element.",
  },
  {
    match: (p) => /\.generated\.[cm]?tsx?$/.test(p),
    why: "Generated files. `props.generated.ts` carries component names inside string literals, which are documentation of the prop, not call sites of it.",
  },
];

/** Categories an inline exemption may declare. Anything else is a failure. */
const EXEMPT_CATEGORIES = {
  specimen: "rendered to be looked at, not navigated",
  "external-only": "every destination it renders is off-site",
  "no-router": "runs outside a router (a standalone bundle, an email, a raster canvas)",
};

/* ── file walking ─────────────────────────────────────────────────────────── */

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!/^(node_modules|\.next|dist|storybook-static)$/.test(e.name)) walk(p, out);
    } else if (/\.tsx$/.test(p)) out.push(p);
  }
  return out;
}

/* ── 1. which components accept `linkAs` — derived, never listed ──────────── */

function componentsAcceptingLinkAs() {
  const found = new Set();
  for (const file of walk(path.join(ROOT, DS_COMPONENTS))) {
    const src = fs.readFileSync(file, "utf8");
    if (!/^\s*linkAs\??\s*:/m.test(src)) continue;
    // Split on top-level `export`s so a `linkAs` in one interface cannot be
    // credited to its neighbour.
    const marks = [...src.matchAll(/^export\s+(?:interface|type)\s+([A-Za-z0-9_]+)Props\b/gm)];
    for (let i = 0; i < marks.length; i++) {
      const start = marks[i].index;
      const end = i + 1 < marks.length ? marks[i + 1].index : src.length;
      if (/^\s*linkAs\??\s*:/m.test(src.slice(start, end))) found.add(marks[i][1]);
    }
  }
  return found;
}

/* ── 2. every JSX call site, and whether it passes the prop ───────────────── */

/* The scan itself lives in `scan.mjs`, where it is unit-tested: finding the end
   of a JSX tag is the part of this gate that can be quietly wrong, and was. */

function callSites(files, components) {
  const sites = [];
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    for (const site of scanSource(src, components)) sites.push({ file, ...site });
  }
  return sites;
}

/* ── 3. run ───────────────────────────────────────────────────────────────── */

const components = componentsAcceptingLinkAs();

// A gate that cannot fail is worse than no gate. If the derivation finds
// nothing, the design system moved and this tool is now checking air.
if (components.size === 0) {
  console.error(
    "✖ link-as: no component in the design system declares a `linkAs` prop.\n" +
      `   Either ${DS_COMPONENTS} moved, or the prop was renamed. This tool is\n` +
      "   checking nothing — fix the derivation rather than deleting the gate.",
  );
  process.exitCode = 2;
} else {
  for (const rule of EXCLUSIONS) {
    if (!rule.prefix) continue;
    if (!fs.existsSync(path.join(ROOT, rule.prefix))) {
      console.error(
        `✖ link-as: exclusion path "${rule.prefix}" does not exist.\n` +
          "   An exclusion that matches nothing has silently stopped applying.",
      );
      process.exitCode = 2;
    }
  }
}

if (process.exitCode === 2) process.exit(2);

const excluded = (p) =>
  EXCLUSIONS.find((r) => (r.prefix ? rel(p).startsWith(r.prefix) : r.match(rel(p))));

const files = SCOPES.flatMap((s) => walk(path.join(ROOT, s))).filter((f) => !excluded(f));
const sites = callSites(files, components);

const failures = [];
const spreads = [];
const exempted = [];

for (const s of sites) {
  if (s.passes) continue;
  if (s.exemption) {
    if (!(s.exemption.category in EXEMPT_CATEGORIES)) {
      failures.push({ ...s, why: `unknown exemption category "${s.exemption.category}"` });
    } else {
      exempted.push(s);
    }
    continue;
  }
  if (s.spread) {
    spreads.push(s);
    continue;
  }
  failures.push({ ...s, why: "does not pass `linkAs`" });
}

const head =
  `link-as: ${sites.length} call site(s) across ${files.length} file(s) · ` +
  `${components.size} component(s) accept the prop`;

if (failures.length === 0) {
  console.log(head);
  if (spreads.length)
    console.log(
      `  · ${spreads.length} site(s) spread their props, so the prop cannot be proven statically — reported, not failed`,
    );
  if (exempted.length) console.log(`  · ${exempted.length} declared exemption(s)`);
  console.log("✔ every navigating call site routes through the app's link component.");
  process.exit(0);
}

console.error(head);
console.error(`\n✖ ${failures.length} call site(s) will render a bare anchor:\n`);
for (const f of failures) {
  console.error(`   ${rel(f.file)}:${f.line}`);
  console.error(`     <${f.name}> ${f.why}`);
}
console.error(`
   Pass the app's router link — \`linkAs={Link}\` with \`import Link from "next/link"\`.

   Forgetting it does not break the page, which is the whole problem: the
   component falls back to <a href>, every click costs a full document load,
   the scroll position is lost, and nothing prefetches. That went unnoticed
   across 22 call sites once, and returned on one portal a day after it was
   fixed.

   If a call site genuinely must not route — a specimen, an external-only
   destination, a surface with no router — declare it on or just above the tag:

     {/* linkAs-exempt(specimen): nav hrefs are "#"; this is drawn, not navigated */}

   Categories: ${Object.keys(EXEMPT_CATEGORIES).join(" · ")}
`);
process.exit(1);
