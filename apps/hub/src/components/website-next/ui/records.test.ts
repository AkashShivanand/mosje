// File sizes as the Department's register prints them. The 29 Sep 2026 refresh
// brought a thousands separator ("1,014.26 KB") that the old pattern read as
// "014.26 KB" and printed as 14 KB — eleven documents, a factor of seventy.

import { test } from "node:test";
import assert from "node:assert/strict";

import { formatFileSize } from "./records.ts";

test("a file size reads the same whichever way the register prints it", () => {
  const cases: [string, string][] = [
    ["117.93 KB", "118 KB"],
    ["0.12 MB", "123 KB"],
    ["1,014.26 KB", "1014 KB"],
    ["2,048.5 KB", "2 MB"],
    ["1.5 MB", "1.5 MB"],
    ["195.4 MB", "195 MB"],
    ["12 B", "1 KB"],
  ];
  for (const [raw, shown] of cases) assert.equal(formatFileSize(raw), shown, raw);
});

test("a size the register did not publish is left off, not invented", () => {
  for (const raw of [undefined, null, "", "NA", "—", "0 KB"]) assert.equal(formatFileSize(raw), undefined, String(raw));
});
