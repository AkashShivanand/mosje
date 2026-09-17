import { test } from "node:test";
import assert from "node:assert/strict";
import { VISITOR_ANALYTICS as V } from "./visitor-analytics.ts";

test("the language split sums to the total", () => {
  assert.equal(V.english + V.hindi, V.total);
});

test("the monthly rows sum to the total", () => {
  const sum = V.months.reduce((n, m) => n + m.english + m.hindi, 0);
  assert.equal(sum, V.total);
});
