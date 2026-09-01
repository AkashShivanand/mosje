// Tests for SAMAVESH banner configuration and placement evaluation.
// Run: node --test apps/hub/src/lib/samavesh-banner/config.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_SAMAVESH_BANNER_PLACEMENT,
  SAMAVESH_BANNER_CONFIG_VERSION,
  parseSamaveshBannerConfig,
  samaveshBannerConfig,
  samaveshBannerPlacement,
  serializeSamaveshBannerConfig,
  shouldShowSamaveshBanner,
  type SamaveshBannerPlacement,
} from "./config.ts";

// The default was NARROWED from "all" to "homepage_only" deliberately (v0.78.0):
// the band is an entry point, so it earns its 80px where a reader is deciding
// where to go and costs 80px on every page where they have already decided. This
// test asserted the old default and was left behind by that change — it is the
// TEST that was stale, not the code, so it now pins the decision rather than
// reverting it. Widening it again is a setting at /admin/portals, not a release,
// which is why nothing here should be relaxed to accommodate a future change of
// mind: an explicit stored value already wins, and the test below proves it.
test("default placement is the HOMEPAGE ONLY, not every page", () => {
  assert.equal(DEFAULT_SAMAVESH_BANNER_PLACEMENT, "homepage_only");
  assert.equal(samaveshBannerPlacement(null), "homepage_only");
});

test("parses valid placement configurations", () => {
  const placements: SamaveshBannerPlacement[] = [
    "all",
    "except_org_details",
    "homepage_only",
  ];

  for (const placement of placements) {
    const raw = JSON.stringify({
      version: SAMAVESH_BANNER_CONFIG_VERSION,
      placement,
    });
    const parsed = parseSamaveshBannerConfig(raw);
    assert.ok(parsed);
    assert.equal(parsed.placement, placement);
    assert.equal(parsed.version, SAMAVESH_BANNER_CONFIG_VERSION);
  }
});

test("round-trips serialize and parse", () => {
  const config = samaveshBannerConfig("except_org_details");
  const serialized = serializeSamaveshBannerConfig(config);
  const parsed = parseSamaveshBannerConfig(serialized);

  assert.deepEqual(parsed, config);
});

test("rejects invalid versions, empty strings, and unknown placements", () => {
  assert.equal(parseSamaveshBannerConfig(""), null);
  assert.equal(parseSamaveshBannerConfig(null), null);
  assert.equal(parseSamaveshBannerConfig(undefined), null);
  assert.equal(parseSamaveshBannerConfig("invalid json"), null);
  assert.equal(
    parseSamaveshBannerConfig(JSON.stringify({ version: 999, placement: "all" })),
    null,
  );
  assert.equal(
    parseSamaveshBannerConfig(
      JSON.stringify({
        version: SAMAVESH_BANNER_CONFIG_VERSION,
        placement: "unknown-mode",
      }),
    ),
    null,
  );
});

test("evaluates shouldShowSamaveshBanner correctly across routes", () => {
  // Mode: "all"
  assert.equal(
    shouldShowSamaveshBanner("all", { pathname: "/website", isHomepage: true }),
    true,
  );
  assert.equal(
    shouldShowSamaveshBanner("all", {
      pathname: "/website/about-us",
      isHomepage: false,
    }),
    true,
  );
  assert.equal(
    shouldShowSamaveshBanner("all", {
      pathname: "/website/organisation/scw",
      isOrgDetails: true,
    }),
    true,
  );

  // Mode: "homepage_only"
  assert.equal(
    shouldShowSamaveshBanner("homepage_only", {
      pathname: "/website",
      isHomepage: true,
    }),
    true,
  );
  assert.equal(
    shouldShowSamaveshBanner("homepage_only", {
      pathname: "/website/about-us",
      isHomepage: false,
    }),
    false,
  );
  assert.equal(
    shouldShowSamaveshBanner("homepage_only", {
      pathname: "/website/organisation/scw",
      isOrgDetails: true,
    }),
    false,
  );

  // Mode: "except_org_details"
  assert.equal(
    shouldShowSamaveshBanner("except_org_details", {
      pathname: "/website",
      isHomepage: true,
    }),
    true,
  );
  assert.equal(
    shouldShowSamaveshBanner("except_org_details", {
      pathname: "/website/about-us",
      isHomepage: false,
    }),
    true,
  );
  assert.equal(
    shouldShowSamaveshBanner("except_org_details", {
      pathname: "/website/organisation/nsfdc",
      isOrgDetails: true,
    }),
    false,
  );
  assert.equal(
    shouldShowSamaveshBanner("except_org_details", {
      pathname: "/website/organisation/pmajay/adarsh-gram",
      isOrgDetails: true,
    }),
    false,
  );
});
