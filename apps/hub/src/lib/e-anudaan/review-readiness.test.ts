// The review screen's readiness rules — the bulk verdict, the one count, the forward's blockers
// and the corrected documents (design-director audit R-01, R-02, R-03, R-06, 16 Sep 2026).
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  asoForwardBlockers,
  awaitingVerdict,
  bulkVerifiable,
  correctedDocIds,
  matchesReviewFilter,
  verdictProgress,
} from "./review-readiness.ts";
import type { DocVerdict } from "./doc-verification.ts";
import type { GrantApplication, MockDoc } from "./types.ts";
import { buildSeed } from "./store/seed.ts";

const looksRight: DocVerdict = { state: "verified", confidence: 97 };

function doc(slot: number, over: Partial<MockDoc> = {}): MockDoc {
  return {
    id: `doc-${slot}`,
    slot,
    title: `Document ${slot}`,
    group: "annual",
    fileName: `annexure-${slot}.pdf`,
    sizeKb: 200,
    uploadedAt: "2026-07-01T00:00:00.000Z",
    reviewStatus: "Pending",
    aiVerdict: looksRight,
    ...over,
  };
}

function app(documents: MockDoc[], over: Partial<GrantApplication> = {}) {
  return { documents, deficiencies: [], financialYear: "2026-27", formValues: {}, certifiedAt: undefined, ...over } as Pick<
    GrantApplication,
    "documents" | "deficiencies" | "financialYear" | "formValues" | "certifiedAt"
  >;
}

const ids = (docs: MockDoc[]) => docs.map((d) => d.id);

test("bulk verdict: only unreviewed, uploaded documents the automatic check read as consistent", () => {
  const a = app([
    doc(1),
    doc(2, { aiVerdict: { state: "invalid", confidence: 95 } }),
    doc(3, { aiVerdict: { state: "review", confidence: 70 } }),
    doc(4, { aiVerdict: { state: "unavailable" } }),
    doc(5, { aiVerdict: { state: "pending" } }),
    doc(6, { fileName: undefined, aiVerdict: undefined }),
    doc(7, { reviewStatus: "Verified" }),
    doc(8, { reviewStatus: "Deficient", officerRemarks: "Blurred" }),
    doc(9, { optional: true }),
  ]);
  // doc-9 is optional: the bulk verdict covers the REQUIRED documents every other count names.
  assert.deepEqual(ids(bulkVerifiable(a)), ["doc-1"]);
});

test("bulk verdict never includes a file the NGO replaced in answer to a deficiency", () => {
  const a = app([doc(1), doc(2), doc(3)], {
    deficiencies: [
      {
        id: "def-1",
        raisedBy: "pd-aso",
        raisedAt: "2026-07-20T00:00:00.000Z",
        detail: "Two documents",
        reopenedFields: [],
        respondedAt: "2026-08-07T00:00:00.000Z",
        items: [
          { id: "i1", kind: "document", docId: "doc-2", label: "Document 2", remark: "Blurred", correctedAt: "2026-08-07T00:00:00.000Z" },
          { id: "i2", kind: "field", fieldName: "fld_sc", label: "SC Beneficiaries", remark: "Mismatch", correctedAt: "2026-08-07T00:00:00.000Z" },
        ],
      },
    ],
  });
  assert.deepEqual([...correctedDocIds(a)], ["doc-2"]);
  assert.deepEqual(ids(bulkVerifiable(a)), ["doc-1", "doc-3"]);
  assert.equal(matchesReviewFilter(a, a.documents[1]!, "changed"), true);
  assert.equal(matchesReviewFilter(a, a.documents[0]!, "changed"), false);
});

test("an unanswered deficiency names no corrected document", () => {
  const a = app([doc(1)], {
    deficiencies: [
      { id: "d", raisedBy: "pd-aso", raisedAt: "2026-07-20T00:00:00.000Z", detail: "x", reopenedFields: [], items: [{ id: "i", kind: "document", docId: "doc-1", label: "D", remark: "r" }] },
    ],
  });
  assert.equal(correctedDocIds(a).size, 0);
});

test("one count: required documents reviewed, optional ones named apart", () => {
  const a = app([doc(1, { reviewStatus: "Verified" }), doc(2, { reviewStatus: "Deficient" }), doc(3), doc(4, { optional: true })]);
  const p = verdictProgress(a);
  assert.equal(p.required, 3);
  assert.equal(p.reviewed, 2);
  assert.equal(p.label, "2 of 3 required documents reviewed · 1 optional");
  assert.deepEqual(ids(awaitingVerdict(a)), ["doc-3"]);
});

test("the ASO's forward waits on every verdict, then on the certification — and on a verdict again after a correction", () => {
  const pending = app([doc(1), doc(2, { reviewStatus: "Verified" })]);
  assert.deepEqual(asoForwardBlockers(pending), ["verdicts", "certification"]);

  const reviewed = app([doc(1, { reviewStatus: "Verified" }), doc(2, { reviewStatus: "Deficient" })]);
  assert.deepEqual(asoForwardBlockers(reviewed), ["certification"]);

  assert.deepEqual(asoForwardBlockers({ ...reviewed, certifiedAt: "2026-09-10T00:00:00.000Z" }), []);
  // A corrected upload arrives Not reviewed on a file certified before it.
  assert.deepEqual(asoForwardBlockers({ ...pending, certifiedAt: "2026-09-10T00:00:00.000Z" }), ["verdicts"]);
});

test("after the bulk verdict, only what the automatic check flagged is left awaiting the officer", () => {
  const a = app([doc(1), doc(2, { aiVerdict: { state: "invalid" } }), doc(3)]);
  const verified = new Set(ids(bulkVerifiable(a)));
  const after = app(a.documents.map((d) => (verified.has(d.id) ? { ...d, reviewStatus: "Verified" as const } : d)));
  assert.deepEqual(ids(awaitingVerdict(after)), ["doc-2"]);
  assert.equal(bulkVerifiable(after).length, 0);
});

test("on the seed, the bulk verdict on the ASO's first file leaves every flagged document for the officer", () => {
  const s = buildSeed();
  const file = s.applications.find((x) => x.holder.kind === "chain" && x.holder.division === "pd" && x.holder.grade === "aso" && x.status === "Submitted");
  assert.ok(file, "the seed holds a submitted file at the ASO");
  const bulk = new Set(ids(bulkVerifiable(file)));
  assert.ok(bulk.size > 0, "a submitted file has documents the check read as consistent");
  for (const d of file.documents) {
    if (bulk.has(d.id)) {
      assert.equal(d.reviewStatus, "Pending");
      assert.ok(d.fileName);
      assert.equal(matchesReviewFilter(file, d, "flagged"), false, `${d.title} was flagged but offered for the bulk verdict`);
    }
  }
});
