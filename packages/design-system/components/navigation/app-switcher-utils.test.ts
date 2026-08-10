import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_APPS, filterApps } from "./app-switcher-utils.ts";

test("Reports group carries the two QC report pages", () => {
  const reports = DEFAULT_APPS.filter((a) => a.group === "Reports");
  assert.equal(reports.length, 2);
  assert.deepEqual(
    reports.map((r) => r.path).sort(),
    ["/reports/eutthan-admin", "/reports/scw"],
  );
});

test("a report is reachable by search", () => {
  const hits = filterApps(DEFAULT_APPS, "scw");
  assert.ok(hits.some((a) => a.path === "/reports/scw"));
});
