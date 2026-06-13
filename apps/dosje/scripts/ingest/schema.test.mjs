import { test } from "node:test";
import assert from "node:assert/strict";
import { sectionRecordSchema, fileRecordSchema } from "./schema.mjs";

test("valid record passes", () => {
  const rec = { slug: "x", title: "X", sourceUrl: "https://a", sections: [{ heading: "H", html: "<p>y</p>" }] };
  assert.doesNotThrow(() => sectionRecordSchema.parse(rec));
});

test("missing slug fails", () => {
  assert.throws(() => sectionRecordSchema.parse({ title: "X", sourceUrl: "https://a", sections: [] }));
});

test("valid file record passes", () => {
  const rec = { slug: "t1", title: "Tender 1", sourceUrl: "https://a", date: "2026-05-06", category: "Procurement", fileUrl: "https://cdn/x.pdf" };
  assert.doesNotThrow(() => fileRecordSchema.parse(rec));
});

test("file record missing title fails", () => {
  assert.throws(() => fileRecordSchema.parse({ slug: "t1", sourceUrl: "https://a" }));
});
