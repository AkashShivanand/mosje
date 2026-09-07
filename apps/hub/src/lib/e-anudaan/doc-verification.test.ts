/**
 * The upload step's gate.
 *
 * Live BLOCKS on an invalid document — "12 documents are not valid. Replace them — or use
 * Re-verify if you believe the check is wrong" (captured 2026-09-07). Our clone printed
 * "Continuing anyway — test mode" and let the applicant through, so the prototype walked past
 * its own gate and taught the wrong flow to everyone it was shown to.
 *
 * The states that must NOT block are as load-bearing as the one that must.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  demoVerdictFor,
  uploadGate,
  verdictPill,
  VERDICT_LABEL,
  type UploadedDoc,
  type VerdictState,
} from "./doc-verification.ts";

const DOCS = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4, optional: true }];

const up = (state: VerdictState): UploadedDoc => ({
  fileName: "x.pdf",
  sizeKb: 60,
  uploadedOn: "07 Sep 2026",
  verdict: demoVerdictFor(state, "Registration Certificate"),
});

test("blocks while a mandatory document is missing, counting only the mandatory ones", () => {
  // Four documents, one optional — the denominator is 3. Counting uploads against a
  // mandatory-only denominator is what produces live's "10 / 7 uploaded".
  const g = uploadGate(DOCS, { 1: up("verified") });
  assert.equal(g.blocked, true);
  assert.equal(g.reason, "Upload all 3 mandatory documents to proceed (1/3).");
});

test("clears once every mandatory document is verified, optional ones absent", () => {
  const g = uploadGate(DOCS, { 1: up("verified"), 2: up("verified"), 3: up("verified") });
  assert.deepEqual(g, { blocked: false, reason: null });
});

test("BLOCKS on an invalid document, in the live portal's words", () => {
  const g = uploadGate(DOCS, { 1: up("invalid"), 2: up("verified"), 3: up("verified") });
  assert.equal(g.blocked, true);
  assert.match(g.reason ?? "", /1 document is not valid/);
  assert.match(g.reason ?? "", /Re-verify/);
});

test("pluralises the invalid message", () => {
  const g = uploadGate(DOCS, { 1: up("invalid"), 2: up("invalid"), 3: up("verified") });
  assert.match(g.reason ?? "", /2 documents are not valid/);
  assert.match(g.reason ?? "", /Replace them/);
});

test("blocks while a check is running, and says the wait ends by itself", () => {
  const g = uploadGate(DOCS, { 1: up("pending"), 2: up("verified"), 3: up("verified") });
  assert.equal(g.blocked, true);
  assert.match(g.reason ?? "", /Next opens as soon as the check completes/);
});

test("does NOT block when the checker is unavailable", () => {
  // The point of the state: an outage is not the applicant's fault, so the upload is accepted
  // and routed to a human. This was live's behaviour throughout August 2026.
  const g = uploadGate(DOCS, {
    1: up("unavailable"),
    2: up("unavailable"),
    3: up("unavailable"),
  });
  assert.deepEqual(g, { blocked: false, reason: null });
});

test("does NOT block on needs-review — a confidence shortfall is the officer's to resolve", () => {
  const g = uploadGate(DOCS, { 1: up("review"), 2: up("verified"), 3: up("verified") });
  assert.equal(g.blocked, false);
});

test("reports invalid ahead of pending when both are present", () => {
  // Someone who must replace a document should be told that, not asked to wait for a check
  // whose result cannot clear the step anyway.
  const g = uploadGate(DOCS, { 1: up("invalid"), 2: up("pending"), 3: up("verified") });
  assert.match(g.reason ?? "", /not valid/);
});

test("the unavailable verdict carries no confidence pill", () => {
  assert.equal(verdictPill(demoVerdictFor("unavailable", "Anything")), null);
});

test("the unavailable verdict is labelled as live labels it, and asks nothing of the applicant", () => {
  assert.equal(VERDICT_LABEL.unavailable, "Automatic check unavailable");
  const v = demoVerdictFor("unavailable", "Registration Certificate");
  assert.match(v.summary ?? "", /reviewer will verify it by hand/);
  assert.match(v.summary ?? "", /you do not need to do anything/);
});
