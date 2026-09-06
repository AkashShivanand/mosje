import test from "node:test";
import assert from "node:assert/strict";

import {
  BRAND_BY_ROUTE,
  DEFAULT_COLOR_MODE,
  colorModeInitScript,
  defaultColorModeForPath,
} from "./color-mode.ts";

/**
 * The brand a surface opens in is decided in TWO places — the inline `<head>`
 * script that runs before first paint, and `defaultColorModeForPath` that runs
 * at hydration. They read the same `BRAND_BY_ROUTE` array, and these tests exist
 * to keep them agreeing: a disagreement is a brand that changes colour a frame
 * after the page appears.
 */

const PATHS: ReadonlyArray<[string, string]> = [
  ["/portals/scw/sage-registration/form", "navy"],
  ["/portals/nmba", "navy"],
  ["/portals/smile-admin/dashboard", "navy"],
  ["/portals", "navy"],
  ["/portals/", "navy"],
  ["/website", "blue"],
  ["/website/schemes", "blue"],
  ["/design-system/components/feedback/stepper", "blue"],
  ["/reports/pm-ajay", "blue"],
  ["/", "blue"],
  ["/gate", "blue"],
  // a path that merely CONTAINS the prefix is not under it
  ["/website/our-portals/guide", "blue"],
];

test("a portal opens navy and everything else opens blue", () => {
  for (const [path, brand] of PATHS) {
    assert.equal(defaultColorModeForPath(path), brand, path);
  }
});

test("a missing path falls back to the estate default rather than guessing", () => {
  assert.equal(defaultColorModeForPath(null), DEFAULT_COLOR_MODE);
  assert.equal(defaultColorModeForPath(undefined), DEFAULT_COLOR_MODE);
  assert.equal(defaultColorModeForPath(""), DEFAULT_COLOR_MODE);
});

test("the inline script resolves every path exactly as the function does", () => {
  const script = colorModeInitScript();
  for (const [path, brand] of PATHS) {
    // Run the real script against a stubbed document/location, with NO cookie —
    // the default is only consulted when nobody has chosen.
    const attrs: Record<string, string> = {};
    const sandbox = {
      location: { pathname: path },
      document: { cookie: "", documentElement: { setAttribute: (k: string, v: string) => { attrs[k] = v; } } },
    };
    new Function("location", "document", script)(sandbox.location, sandbox.document);
    assert.equal(attrs["data-brand"], brand, `inline script disagreed on ${path}`);
  }
});

test("a chosen brand outranks the route default, including on a portal", () => {
  const script = colorModeInitScript();
  const attrs: Record<string, string> = {};
  new Function("location", "document", script)(
    { pathname: "/portals/scw" },
    { cookie: "mosje-color-mode=blue", documentElement: { setAttribute: (k: string, v: string) => { attrs[k] = v; } } },
  );
  assert.equal(attrs["data-brand"], "blue");
});

test("every route rule names a brand the estate actually has", () => {
  for (const { prefix, brand } of BRAND_BY_ROUTE) {
    assert.ok(prefix.startsWith("/") && prefix.endsWith("/"), `${prefix} must be an anchored path prefix`);
    assert.equal(defaultColorModeForPath(prefix), brand);
  }
});
