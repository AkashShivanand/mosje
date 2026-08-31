// Which source an OrgLogo resolves to, and the precedence between `org` and
// `path`. Run: node --test packages/design-system/components/brand/org-logo-resolution.test.ts

import { test } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

import {
  ORG_LOGOS,
  ORG_LOGO_FALLBACK,
  PORTAL_ORG_LOGOS,
  orgLogoSrc,
  portalLogoSrc,
  type OrgSlug,
} from "./org-logo-registry.ts";

/*
 * The resolution rule, MIRRORED from `OrgLogo`'s own line. It is repeated here
 * rather than imported because the component is a `"use client"` React module
 * and this suite runs in bare node.
 *
 * A mirror that nothing checks is decorative: this file passed 6/6 with the
 * precedence bug reintroduced, because reverting the component never touched the
 * copy. The `the mirror still matches the component` test below is what makes
 * every other test in this file mean something — do not delete it.
 */
function resolve(opts: { org?: OrgSlug | null; path?: string | null; src?: string }): string {
  const { org, path, src } = opts;
  return src ?? (org != null ? orgLogoSrc(org) : portalLogoSrc(path));
}

test("an explicit org beats a path, which callers often DERIVE", () => {
  /*
   * The regression this exists for. `PortalCard` passes `path={path ?? href}`
   * and `href` is REQUIRED, so the path is always defined — under the old
   * `path !== undefined` precedence the org branch was unreachable and every
   * card carrying an `org` silently rendered the State Emblem.
   */
  assert.equal(
    resolve({ org: "ncsc", path: "https://ncsc.nic.in/" }),
    ORG_LOGOS.ncsc,
    "an external href must not defeat an explicit slug",
  );
  assert.notEqual(resolve({ org: "ncsc", path: "https://ncsc.nic.in/" }), ORG_LOGO_FALLBACK);
});

test("a path still resolves when no org is given", () => {
  const [route, slug] = Object.entries(PORTAL_ORG_LOGOS)[0] as [string, OrgSlug];
  assert.equal(resolve({ path: route }), ORG_LOGOS[slug]);
});

test("src overrides both — it is the registry's escape hatch", () => {
  assert.equal(resolve({ org: "nmba", path: "/portals/scw", src: "/x.png" }), "/x.png");
});

test("the emblem is the fallback, never a placeholder", () => {
  assert.equal(resolve({}), ORG_LOGO_FALLBACK);
  assert.equal(resolve({ path: "/portals/does-not-exist" }), ORG_LOGO_FALLBACK);
});

test("every registry entry resolves to a real, distinct-per-slug path", () => {
  for (const slug of Object.keys(ORG_LOGOS) as OrgSlug[]) {
    assert.equal(resolve({ org: slug }), ORG_LOGOS[slug], `${slug} must resolve to its own mark`);
    assert.match(ORG_LOGOS[slug], /^\/design-system\/org-logos\//, `${slug} must sit under the canonical root`);
  }
});

test("every portal route maps to a slug the registry actually has", () => {
  for (const [route, slug] of Object.entries(PORTAL_ORG_LOGOS)) {
    assert.ok(slug in ORG_LOGOS, `${route} maps to "${slug}", which is not in ORG_LOGOS`);
  }
});

test("the mirror still matches the component — without this, nothing above is a test", () => {
  const src = readFileSync(fileURLToPath(new URL("./org-logo.tsx", import.meta.url)), "utf8");
  const line = src.split("\n").find((l) => l.includes("const resolved ="));
  assert.ok(line, "OrgLogo no longer has a `const resolved =` line — this suite is testing nothing");
  const normalised = line.replace(/\s+/g, " ").trim();
  assert.equal(
    normalised,
    "const resolved = src ?? (org != null ? orgLogoSrc(org) : portalLogoSrc(path));",
    "OrgLogo's resolution changed but the mirror in this file did not. Update BOTH, " +
      "or the precedence tests above are asserting against a copy that no longer " +
      "describes the component.",
  );
});
