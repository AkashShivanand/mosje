// Nav-drift guard: every link the portal's own role model advertises must resolve to a real route.
//
// The registry test (src/lib/registry/routes.test.ts) only checks the ONE path DEFAULT_APPS
// advertises — /portals/e-anudaan. It cannot see the ~120 hrefs this portal generates from a
// factory (13 roles × ~9 nav items). One typo in pdNav() breaks the same item on five roles at
// once and CI stays green, because nothing ever requests those URLs.
//
// That is not hypothetical here: the Programme Director's `home` pointed at /dashboard/sm2/pd
// while no such route existed, so the final sanctioning authority landed on a blank page. This
// test is what stops that recurring.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { ALL_ROLES, EANUDAAN_BASE, ROLES } from "./roles.ts";

const PORTAL_DIR = path.resolve(import.meta.dirname, "..", "..", "app", "portals", "e-anudaan");

/**
 * Resolve a hub-origin href to a page file, honouring the two App Router features this portal
 * leans on: route groups `(console)` / `(ngo)`, which contribute nothing to the URL, and dynamic
 * segments `[grade]`, which match any single segment. Static siblings win over dynamic ones,
 * exactly as Next resolves them.
 */
function resolves(href: string): boolean {
  const rel = href.replace(`${EANUDAAN_BASE}`, "").replace(/^\/+|\/+$/g, "");
  const segments = rel === "" ? [] : rel.split("/");

  const walk = (dir: string, rest: string[]): boolean => {
    if (rest.length === 0) return existsSync(path.join(dir, "page.tsx"));

    const [head, ...tail] = rest as [string, ...string[]];
    const entries = readdirSync(dir).filter((e) => statSync(path.join(dir, e)).isDirectory());

    // 1. exact static segment
    if (entries.includes(head) && walk(path.join(dir, head), tail)) return true;
    // 2. any dynamic segment
    for (const e of entries) {
      if (/^\[.+\]$/.test(e) && walk(path.join(dir, e), tail)) return true;
    }
    // 3. transparently descend through route groups
    for (const e of entries) {
      if (/^\(.+\)$/.test(e) && walk(path.join(dir, e), rest)) return true;
    }
    return false;
  };

  return walk(PORTAL_DIR, segments);
}

test("the portal's route tree is where this test thinks it is", () => {
  // A resolver pointed at a missing directory would pass everything. Fail loudly instead.
  assert.ok(existsSync(PORTAL_DIR), `expected the portal at ${PORTAL_DIR}`);
  assert.ok(resolves(`${EANUDAAN_BASE}/login`), "sanity: /login must resolve");
  assert.ok(!resolves(`${EANUDAAN_BASE}/definitely-not-a-route`), "sanity: a bogus path must NOT resolve");
});

test("every role's landing route exists", () => {
  const broken = ALL_ROLES.filter((r) => !resolves(r.home)).map((r) => `${r.id} → ${r.home}`);
  assert.deepEqual(broken, [], `roles landing on a non-existent route:\n  ${broken.join("\n  ")}`);
});

test("every nav item on every role resolves to a real route", () => {
  const broken: string[] = [];
  for (const role of ALL_ROLES) {
    for (const item of role.nav) {
      if (!resolves(item.href)) broken.push(`${role.id} · "${item.label}" → ${item.href}`);
    }
  }
  assert.deepEqual(broken, [], `nav items pointing nowhere:\n  ${broken.join("\n  ")}`);
});

test("every nav href is hub-origin absolute", () => {
  // A bare "/dashboard/..." would escape the portal and 404 against the hub root — the single
  // most common mistake when a portal is mounted natively rather than behind a basePath.
  const bad: string[] = [];
  for (const role of ALL_ROLES) {
    for (const item of role.nav) {
      if (!item.href.startsWith(`${EANUDAAN_BASE}/`)) bad.push(`${role.id} · ${item.href}`);
    }
    if (!role.home.startsWith(`${EANUDAAN_BASE}/`)) bad.push(`${role.id} · home ${role.home}`);
  }
  assert.deepEqual(bad, []);
});

test("the Programme Director can reach a sanction desk", () => {
  // The role whose console does not exist upstream. If the inferred desk is ever removed, this
  // fails rather than silently returning the PD to a blank page.
  const pd = ROLES["programme-director"];
  assert.ok(resolves(pd.home), `the PD's home ${pd.home} must resolve`);
  assert.ok(
    pd.nav.some((n) => n.href === pd.home),
    "the PD's landing route must also be reachable from its own sidebar",
  );
});

test("every officer role can reach the review screen for its own grade", () => {
  // The review path shape is /dashboard/sm2/<key>/review/:id where <key> is the grade for PD,
  // `jspd` for PD:JS and `ifd<grade>` for the IFD — the live portal's own irregularity.
  for (const role of ALL_ROLES) {
    if (!role.grade) continue;
    const key = role.division === "finance" ? `ifd${role.grade}` : role.grade === "js" ? "jspd" : role.grade;
    const href = `${EANUDAAN_BASE}/dashboard/sm2/${key}/review/APP-1`;
    assert.ok(resolves(href), `${role.id} cannot reach ${href}`);
  }
});
