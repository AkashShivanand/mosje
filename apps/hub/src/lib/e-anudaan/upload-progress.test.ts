/**
 * The checklist counter. Both halves of every fraction count the same set.
 *
 * Live shows SHRESHTA Mode 2 applicants "10 / 7 uploaded" — a fraction that exceeds its own
 * total and so cannot mean "done" (design audit M1a). The next version counted mandatory
 * documents only and printed "19 / 19 uploaded · All mandatory" over a list of twenty with one
 * marked optional, while the application page said "20 of 20" (form-path QA, 13 Sep 2026).
 * One count now: every document, with the mandatory figures reported beside it.
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

test("the headline counts every document on the list, optional ones included", () => {
  const all = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
  assert.deepEqual(uploadProgress(DOCS, all), { done: 5, total: 5, mandatoryDone: 3, mandatoryTotal: 3, optionalTotal: 2 });
});

test("no fraction exceeds its own total, whatever is optional", () => {
  const p = uploadProgress(DOCS, { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 9: {} });
  assert.ok(p.done <= p.total, `${p.done} / ${p.total}`);
  assert.ok(p.mandatoryDone <= p.mandatoryTotal, `${p.mandatoryDone} / ${p.mandatoryTotal}`);
});

test("uploading only optional documents leaves the mandatory count at zero", () => {
  const p = uploadProgress(DOCS, { 4: {}, 5: {} });
  assert.equal(p.done, 2);
  assert.equal(p.mandatoryDone, 0);
});

test("a checklist with nothing optional reports no optional documents", () => {
  assert.deepEqual(uploadProgress([{ n: 1 }, { n: 2 }], { 1: {} }), { done: 1, total: 2, mandatoryDone: 1, mandatoryTotal: 2, optionalTotal: 0 });
});
