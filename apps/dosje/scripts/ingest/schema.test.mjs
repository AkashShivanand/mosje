import { test } from "node:test";
import assert from "node:assert/strict";
import { sectionRecordSchema } from "./schema.mjs";

test("valid record passes", () => {
  const rec = { slug: "x", title: "X", sourceUrl: "https://a", sections: [{ heading: "H", html: "<p>y</p>" }] };
  assert.doesNotThrow(() => sectionRecordSchema.parse(rec));
});

test("missing slug fails", () => {
  assert.throws(() => sectionRecordSchema.parse({ title: "X", sourceUrl: "https://a", sections: [] }));
});
