import { test } from "node:test";
import assert from "node:assert/strict";
import { buildReport } from "./verify.mjs";

test("buildReport flags shortfall after accounting for skipped dupes", () => {
  const r = buildReport({ collection: "organisation", sitemapCount: 16, kept: 16, skipped: 0 });
  assert.equal(r.ok, true);
  const r2 = buildReport({ collection: "schemes", sitemapCount: 141, kept: 120, skipped: 5 });
  assert.equal(r2.ok, false);
  assert.equal(r2.missing, 16);
});
