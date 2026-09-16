/**
 * What an officer's review still needs before the file can move — computed ONCE, read by every
 * part of the review screen that states it.
 *
 * Design-director audit of 16 Sep 2026:
 * - R-01: the ASO pressed "Forward", was told to record a certification, found the certification
 *   disabled, and scrolled 3,700px to twenty verdict dropdowns to learn why. The decision panel,
 *   the documents' progress line, the filter chips and the phone's summary bar now all read the
 *   counts below, so no two of them can disagree.
 * - R-03: twenty rows, no bulk verdict. `bulkVerifiable` is the one rule for which documents a
 *   single confirmation may mark Verified.
 * - R-02: the three items the NGO corrected were not linked to their rows. `correctedDocIds` names
 *   them, so the banner and a filter can point at them.
 * - R-06: "0 of 20 documents reviewed" beside "19 of 19 required documents have not been examined".
 *   One count, `verdictProgress`.
 *
 * Pure; no React, so the rules are tested directly (review-readiness.test.ts).
 */

import type { DocVerdict } from "./doc-verification.ts";
import { applicantFacts, simulateCheck } from "./document-centre.ts";
import type { Deficiency, GrantApplication, MockDoc } from "./types.ts";

type ReviewApp = Pick<GrantApplication, "documents" | "deficiencies" | "financialYear" | "formValues">;

/**
 * The automatic check on a submitted file: the one recorded at upload, or the check run now on a
 * seeded file that carries none. Shared by the review screen and the Review Report, so the two
 * print the same finding.
 */
export function automaticCheckOf(app: Pick<GrantApplication, "documents" | "financialYear" | "formValues">, d: MockDoc): DocVerdict | undefined {
  if (!d.fileName) return undefined;
  if (d.aiVerdict) return d.aiVerdict;
  return simulateCheck({
    slot: { n: d.slot, title: d.title },
    checklist: app.documents.map((x) => ({ n: x.slot, title: x.title })),
    fileName: d.fileName,
    sizeKb: d.sizeKb ?? 0,
    applicationFy: app.financialYear,
    facts: applicantFacts(app.formValues ?? {}),
  });
}

/** The check found something an officer must look at: a mismatch, or too little confidence to say. */
export function isFlagged(verdict: DocVerdict | undefined): boolean {
  return verdict?.state === "invalid" || verdict?.state === "review";
}

/** The most recent deficiency the NGO has answered, if any. */
export function answeredDeficiency(app: Pick<GrantApplication, "deficiencies">): Deficiency | undefined {
  return [...app.deficiencies].reverse().find((d) => d.respondedAt);
}

/** Documents the NGO replaced in answer to that deficiency. The officer must read these afresh. */
export function correctedDocIds(app: Pick<GrantApplication, "deficiencies">): ReadonlySet<string> {
  const d = answeredDeficiency(app);
  return new Set((d?.items ?? []).filter((it) => it.kind === "document" && it.docId && it.correctedAt).map((it) => it.docId!));
}

/** Required documents with no verdict. Certification — and so the ASO's forward — waits on these. */
export function awaitingVerdict(app: Pick<GrantApplication, "documents">): MockDoc[] {
  return app.documents.filter((d) => !d.optional && d.reviewStatus === "Pending");
}

/**
 * The documents "Mark All Remaining as Verified" may record a verdict for. Each must be:
 *
 * 1. REQUIRED — so the number on the button is the same 19 the decision panel, the progress line
 *    and the "Needs Your Verdict" chip say. An optional document is given its verdict by hand;
 * 2. without a verdict — a verdict already given, either way, is never overwritten;
 * 3. uploaded — Verified on a document that is not there says nothing;
 * 4. read by the automatic check as consistent — a mismatch, an unsure reading, a check that could
 *    not run and a check still running are all left for the officer to open;
 * 5. not a file the NGO replaced in answer to a deficiency — that file is why the application came
 *    back, and it is read afresh.
 */
export function bulkVerifiable(
  app: ReviewApp,
  checkOf: (d: MockDoc) => DocVerdict | undefined = (d) => automaticCheckOf(app, d),
): MockDoc[] {
  const corrected = correctedDocIds(app);
  return app.documents.filter(
    (d) => !d.optional && d.reviewStatus === "Pending" && !!d.fileName && !corrected.has(d.id) && checkOf(d)?.state === "verified",
  );
}

/** "15 of 19 required documents reviewed · 1 optional" — the one count the screen prints. */
export function verdictProgress(app: Pick<GrantApplication, "documents">) {
  const required = app.documents.filter((d) => !d.optional);
  const reviewed = required.filter((d) => d.reviewStatus !== "Pending").length;
  const optional = app.documents.length - required.length;
  return {
    required: required.length,
    reviewed,
    optional,
    label: `${reviewed} of ${required.length} required documents reviewed${optional > 0 ? ` · ${optional} optional` : ""}`,
  };
}

/** The questions an officer asks of the document list, each a filter. */
export type ReviewDocFilter = "awaiting" | "flagged" | "correction" | "changed";

export function matchesReviewFilter(
  app: ReviewApp,
  d: MockDoc,
  filter: ReviewDocFilter,
  checkOf: (d: MockDoc) => DocVerdict | undefined = (x) => automaticCheckOf(app, x),
): boolean {
  switch (filter) {
    case "awaiting":
      return !d.optional && d.reviewStatus === "Pending";
    case "flagged":
      return isFlagged(checkOf(d));
    case "correction":
      return d.reviewStatus === "Deficient";
    case "changed":
      return correctedDocIds(app).has(d.id);
  }
}

/**
 * Why the Assistant Section Officer's forward is not available yet, in the order they are done —
 * or an empty list when it is. The workflow requires the certification; the screen also holds the
 * forward while a required document has no verdict, which happens when a corrected file arrives
 * on a file that was certified before.
 */
export function asoForwardBlockers(app: Pick<GrantApplication, "documents" | "certifiedAt">): ("verdicts" | "certification")[] {
  const out: ("verdicts" | "certification")[] = [];
  if (awaitingVerdict(app).length > 0) out.push("verdicts");
  if (!app.certifiedAt) out.push("certification");
  return out;
}
