// Drift guard: every entry the registry advertises as live must resolve to a
// real route in this app.
//
// This exists because it already went wrong. The Senior Citizens entry pointed
// at /portals/senior-citizens and sat at "planned" long after the portal
// shipped at /portals/scw, so a fully built portal was invisible in the
// explorer and the AppSwitcher and reachable from nowhere in the hub. Nothing
// caught it: the path was never requested, so it never 404'd.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";

import { DEFAULT_APPS } from "@mosje/design-system/app-registry";

const APP_DIR = path.resolve(import.meta.dirname, "..", "..", "app");

/**
 * Paths that are deliberately not App Router routes.
 *
 * Storybook is a static build served out of public/storybook (see
 * next.config.ts), and that directory only exists after `build:storybook`, so
 * asserting on it here would fail on a clean clone rather than catch drift.
 */
const NON_ROUTE_PATHS = new Set(["/storybook/"]);

test("every live registry entry resolves to a route directory", () => {
  const missing: string[] = [];

  for (const entry of DEFAULT_APPS) {
    if ((entry.status ?? "live") !== "live") continue;
    if (NON_ROUTE_PATHS.has(entry.path)) continue;

    const segments = entry.path.replace(/^\/+|\/+$/g, "").split("/");
    const dir = path.join(APP_DIR, ...segments);
    if (!existsSync(dir)) missing.push(`${entry.name} → ${entry.path}`);
  }

  assert.deepEqual(
    missing,
    [],
    `live registry entries with no route:\n  ${missing.join("\n  ")}`,
  );
});

test("no two registry entries share a path", () => {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const entry of DEFAULT_APPS) {
    if (seen.has(entry.path)) duplicates.push(entry.path);
    seen.add(entry.path);
  }
  assert.deepEqual(duplicates, []);
});

test("the Senior Citizens entry points at the built SCW portal", () => {
  const entry = DEFAULT_APPS.find((a) => a.path === "/portals/scw");
  assert.ok(entry, "expected a registry entry for /portals/scw");
  assert.equal(entry?.status, "live");
  assert.ok(
    existsSync(path.join(APP_DIR, "portals", "scw")),
    "expected apps/hub/src/app/portals/scw to exist",
  );
});
