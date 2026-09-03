/**
 * The checklist counter. Both halves must count the same set.
 *
 * Live shows SHRESHTA_M2 applicants "10 / 7 uploaded" — a fraction that exceeds its own total and
 * so cannot mean "done" (design audit M1a). Our clone had the same arithmetic: every upload over
 * a denominator of only the mandatory documents.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { uploadProgress } from "./doc-verification.ts";

const DOCS = [
  { n: 1 },
  { n: 2 },
  { n: 3 },
  { n: 4, optional: true },
  { n: 5, optional: true },
];

test("the counter never exceeds its own total, whatever is optional", () => {
  const all = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
  const { done, total } = uploadProgress(DOCS, all);
  assert.equal(total, 3);
  assert.equal(done, 3);
  assert.ok(done <= total, `${done} / ${total} exceeds its own total`);
});

test("uploading only optional documents leaves the mandatory count at zero", () => {
  assert.deepEqual(uploadProgress(DOCS, { 4: {}, 5: {} }), { done: 0, total: 3 });
});

test("partial progress counts mandatory documents only", () => {
  assert.deepEqual(uploadProgress(DOCS, { 1: {}, 4: {} }), { done: 1, total: 3 });
});

test("a checklist with nothing optional counts everything", () => {
  assert.deepEqual(uploadProgress([{ n: 1 }, { n: 2 }], { 1: {} }), { done: 1, total: 2 });
});
