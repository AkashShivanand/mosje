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
  expectedDocumentYear,
  uploadGate,
  withYearCheck,
  yearCheckedVerdict,
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
  // No Re-verify: the page offers none, and an applicant must not overrule the check on the same
  // file (serious audit UX-07 / S08). Replacing the document is the only way past.
  assert.doesNotMatch(g.reason ?? "", /Re-verify/);
  assert.match(g.reason ?? "", /Replace it to proceed/);
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

/* ── The document's year against the application's year ─────────────────────
 * Form-path QA, 13 Sep 2026: every document on all seven paths read "Verified · 100%" for
 * FY 2025-26 on an FY 2026-27 application — "Budget Estimates — Current Year" included —
 * because the year was a constant in the demo verdict and nothing compared it with anything.
 */

test("the year a document must cover is read from its title and the application's year", () => {
  assert.equal(expectedDocumentYear("Budget Estimates — Current Year", "2026-27"), "2026-27");
  assert.equal(expectedDocumentYear("Annual Report — Previous Financial Year", "2026-27"), "2025-26");
  assert.equal(expectedDocumentYear("Audited Accounts of NGO — previous-to-previous financial year", "2026-27"), "2024-25");
  assert.equal(expectedDocumentYear("Registration Certificate", "2026-27"), undefined);
});

test("a sample upload is verified for the year the application needs, never a fixed one", () => {
  const current = demoVerdictFor("verified", "Budget Estimates — Current Year", "2027-28");
  assert.equal(current.extracted?.["Financial Year"], "2027-28");
  assert.match(current.summary ?? "", /FY 2027-28/);
  const permanent = demoVerdictFor("verified", "Registration Certificate", "2027-28");
  assert.equal(permanent.extracted?.["Financial Year"], undefined);
  assert.doesNotMatch(permanent.summary ?? "", /FY/);
});

test("a document for the wrong financial year is flagged, not verified", () => {
  const forLastYear = demoVerdictFor("verified", "Budget Estimates — Current Year", "2025-26");
  const v = yearCheckedVerdict(forLastYear, "Budget Estimates — Current Year", "2026-27");
  assert.equal(v.state, "invalid");
  assert.match(v.summary ?? "", /FY 2025-26/);
  assert.match(v.summary ?? "", /FY 2026-27/);
});

test("moving the application to another year after uploading blocks the step", () => {
  const docs = [{ n: 1, title: "Budget Estimates — Current Year" }, { n: 2, title: "Registration Certificate" }];
  const uploaded: Record<number, UploadedDoc> = {
    1: { fileName: "be.pdf", sizeKb: 1, uploadedOn: "", verdict: demoVerdictFor("verified", docs[0]!.title, "2026-27") },
    2: { fileName: "rc.pdf", sizeKb: 1, uploadedOn: "", verdict: demoVerdictFor("verified", docs[1]!.title, "2026-27") },
  };
  assert.equal(uploadGate(docs, withYearCheck(docs, uploaded, "2026-27")).blocked, false);
  const moved = uploadGate(docs, withYearCheck(docs, uploaded, "2027-28"));
  assert.equal(moved.blocked, true);
  assert.match(moved.reason ?? "", /1 document is not valid/);
});

test("an upload for a document no longer on the list does not hold the step", () => {
  // The checklist follows the answers: a Rent Agreement leaves it when the building is owned.
  const g = uploadGate([{ n: 1 }], { 1: up("verified"), 7: up("invalid") });
  assert.equal(g.blocked, false);
});
