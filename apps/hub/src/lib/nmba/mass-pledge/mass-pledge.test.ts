// Tests for the Mass Pledge approval engine, scoping and counting rules.
// Run: npm test --prefix apps/hub
//
// These are the rules that decide what the national figure is, so they are
// tested directly rather than only through the UI.

import { test } from "node:test";
import assert from "node:assert/strict";

import type { PortalSession } from "../committee/types.ts";
import { computeTotal, sumTotals, type MassPledgeSubmission } from "./types.ts";
import {
  approve,
  approvalQueue,
  approvedOnly,
  canApprove,
  canEdit,
  findExistingSubmission,
  initialStatus,
  initialVerification,
  isVisibleTo,
  nextStatusOnApprove,
  pendingLabel,
  resubmit,
  returnForCorrection,
  sessionKey,
} from "./workflow.ts";
import { isFormOpen, istDate, reporterKindForSession, windowState } from "./masters.ts";
import { blockCoverage, blocksFor, hasBlocks } from "./blocks.ts";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const admin: PortalSession = { role: "ADMIN", accountId: "A", displayName: "Admin" };
const mhState: PortalSession = {
  role: "STATE",
  accountId: "S",
  displayName: "MH SNO",
  state: "Maharashtra",
};
const punDistrict: PortalSession = {
  role: "DISTRICT",
  accountId: "D",
  displayName: "Pune DNO",
  state: "Maharashtra",
  district: "Pune",
};
const havBlock: PortalSession = {
  role: "BLOCK",
  accountId: "B",
  displayName: "Haveli BNO",
  state: "Maharashtra",
  district: "Pune",
  block: "Haveli",
};
const ministry: PortalSession = {
  role: "ENTITY",
  accountId: "E",
  displayName: "MoE",
  entityKind: "LINE_MINISTRY",
  entityName: "Ministry of Education",
};
const keralaState: PortalSession = {
  role: "STATE",
  accountId: "K",
  displayName: "KL SNO",
  state: "Kerala",
};

function submission(patch: Partial<MassPledgeSubmission> = {}): MassPledgeSubmission {
  return {
    id: "x1",
    reporterKind: "ADMIN_TIER",
    eventDate: "2026-08-18",
    submittedAt: "2026-08-18T12:00:00.000Z",
    state: "Maharashtra",
    district: "Pune",
    block: "Haveli",
    counts: { youth: 10, women: 5, others: 2 },
    photos: [],
    reportingOfficerName: "Officer",
    reportingOfficerDesignation: "BDO",
    contactNo: "9890005678",
    contactVerified: true,
    declarationAccepted: true,
    status: "PENDING_DISTRICT",
    verification: "VERIFIED",
    locationUnavailable: false,
    history: [],
    createdBy: "B",
    ...patch,
  };
}

// ── Counting (assumption A1) ─────────────────────────────────────────────────

test("total is the sum of the three non-overlapping buckets", () => {
  assert.equal(computeTotal({ youth: 820, women: 410, others: 265 }), 1495);
  assert.equal(computeTotal({ youth: 0, women: 0, others: 0 }), 0);
});

test("sumTotals adds across submissions", () => {
  const list = [
    submission({ counts: { youth: 100, women: 50, others: 25 } }),
    submission({ counts: { youth: 10, women: 5, others: 5 } }),
  ];
  assert.equal(sumTotals(list), 195);
});

// ── Entry into the chain (assumptions A6, A8) ────────────────────────────────

test("entry tier decides the starting status, not the coordinating ministry", () => {
  assert.equal(initialStatus(havBlock), "PENDING_DISTRICT");
  assert.equal(initialStatus(punDistrict), "PENDING_STATE");
  assert.equal(initialStatus(mhState), "APPROVED");
  assert.equal(initialStatus(ministry), "APPROVED");
});

test("only chain-routed reports are tagged VERIFIED", () => {
  assert.equal(initialVerification("ADMIN_TIER"), "VERIFIED");
  assert.equal(initialVerification("LINE_MINISTRY"), "SELF_DECLARED");
  assert.equal(initialVerification("SPIRITUAL_ORG"), "SELF_DECLARED");
  assert.equal(initialVerification("HEI"), "SELF_DECLARED");
  assert.equal(initialVerification("GIA"), "SELF_DECLARED");
});

// ── Who may approve ──────────────────────────────────────────────────────────

test("a block's report is actionable by its own district only", () => {
  const s = submission({ status: "PENDING_DISTRICT" });
  assert.equal(canApprove(s, punDistrict), true);
  assert.equal(canApprove(s, mhState), false, "state must not skip the district tier");
  assert.equal(canApprove(s, havBlock), false, "a block cannot approve itself");
  assert.equal(canApprove(s, admin), false, "admin is oversight-only");
});

test("a district's report is actionable by its own state only", () => {
  const s = submission({ status: "PENDING_STATE" });
  assert.equal(canApprove(s, mhState), true);
  assert.equal(canApprove(s, keralaState), false, "another state must not act");
  assert.equal(canApprove(s, punDistrict), false);
});

test("an approved report is not actionable again", () => {
  assert.equal(canApprove(submission({ status: "APPROVED" }), mhState), false);
  assert.equal(canApprove(submission({ status: "RETURNED" }), punDistrict), false);
});

test("approval moves one tier at a time, never straight to approved", () => {
  assert.equal(nextStatusOnApprove(submission({ status: "PENDING_DISTRICT" })), "PENDING_STATE");
  assert.equal(nextStatusOnApprove(submission({ status: "PENDING_STATE" })), "APPROVED");
});

test("approving appends to the audit trail", () => {
  const after = approve(submission({ status: "PENDING_DISTRICT" }), punDistrict);
  assert.equal(after.status, "PENDING_STATE");
  assert.equal(after.history.length, 1);
  assert.equal(after.history[0]?.action, "APPROVED");
  assert.equal(after.history[0]?.actorRole, "DISTRICT");
});

// ── Return and resubmit (assumption A7) ──────────────────────────────────────

test("returning without remarks is refused", () => {
  assert.throws(() => returnForCorrection(submission(), punDistrict, ""), /Remarks are required/);
  assert.throws(() => returnForCorrection(submission(), punDistrict, "   "), /Remarks are required/);
});

test("returning records the remarks against the approver", () => {
  const after = returnForCorrection(submission(), punDistrict, "Figures look high.");
  assert.equal(after.status, "RETURNED");
  assert.equal(after.history[0]?.action, "RETURNED");
  assert.equal(after.history[0]?.remarks, "Figures look high.");
});

test("resubmitting re-enters at the submitter's own tier", () => {
  const returned = returnForCorrection(submission(), punDistrict, "Fix this.");
  const again = resubmit(returned, havBlock);
  assert.equal(again.status, "PENDING_DISTRICT", "a block resubmits to its district");
  assert.equal(again.history.length, 2);
  assert.equal(again.history[1]?.action, "RESUBMITTED");
});

test("only the original submitter may edit, and only while returned", () => {
  const returned = submission({ status: "RETURNED", createdBy: "B" });
  assert.equal(canEdit(returned, havBlock), true);
  assert.equal(canEdit(returned, punDistrict), false, "an approver must not edit the figures");
  assert.equal(canEdit(submission({ status: "PENDING_DISTRICT" }), havBlock), false);
});

// ── Visibility ───────────────────────────────────────────────────────────────

test("each tier sees only its own jurisdiction", () => {
  const s = submission();
  assert.equal(isVisibleTo(s, admin), true);
  assert.equal(isVisibleTo(s, mhState), true);
  assert.equal(isVisibleTo(s, punDistrict), true);
  assert.equal(isVisibleTo(s, havBlock), true);
  assert.equal(isVisibleTo(s, keralaState), false);
});

test("a block sees only its own block", () => {
  const otherBlock = submission({ block: "Mulshi" });
  assert.equal(isVisibleTo(otherBlock, havBlock), false);
  assert.equal(isVisibleTo(otherBlock, punDistrict), true);
});

test("organisation reports are national — states do not see them, admin does", () => {
  const s = submission({
    reporterKind: "LINE_MINISTRY",
    state: undefined,
    district: undefined,
    block: undefined,
    entityName: "Ministry of Education",
    createdBy: "E",
  });
  assert.equal(isVisibleTo(s, admin), true);
  assert.equal(isVisibleTo(s, ministry), true, "its own submitter sees it");
  assert.equal(isVisibleTo(s, mhState), false, "a state has no claim over a national report");
});

test("the approval queue only contains what the viewer can act on", () => {
  const list = [
    submission({ id: "a", status: "PENDING_DISTRICT" }),
    submission({ id: "b", status: "PENDING_STATE" }),
    submission({ id: "c", status: "APPROVED" }),
  ];
  assert.deepEqual(approvalQueue(list, punDistrict).map((s) => s.id), ["a"]);
  assert.deepEqual(approvalQueue(list, mhState).map((s) => s.id), ["b"]);
  assert.deepEqual(approvalQueue(list, admin), []);
});

// ── Publishing (assumptions A3, A7) ──────────────────────────────────────────

test("only approved figures are publishable", () => {
  const list = [
    submission({ id: "a", status: "APPROVED", counts: { youth: 100, women: 0, others: 0 } }),
    submission({ id: "b", status: "PENDING_STATE", counts: { youth: 999, women: 0, others: 0 } }),
    submission({ id: "c", status: "RETURNED", counts: { youth: 999, women: 0, others: 0 } }),
  ];
  const publishable = approvedOnly(list);
  assert.equal(publishable.length, 1);
  assert.equal(sumTotals(publishable), 100, "pending and returned figures must not be published");
});

test("tier figures are additive, so a block and its district both count", () => {
  const block = submission({ id: "b", status: "APPROVED", counts: { youth: 100, women: 0, others: 0 } });
  const district = submission({
    id: "d",
    status: "APPROVED",
    block: undefined,
    counts: { youth: 200, women: 0, others: 0 },
  });
  assert.equal(sumTotals(approvedOnly([block, district])), 300);
});

// ── Duplicate detection ──────────────────────────────────────────────────────

test("each account has its own key, so different reporters never collide", () => {
  assert.notEqual(sessionKey(havBlock), sessionKey(punDistrict));
  assert.notEqual(sessionKey(punDistrict), sessionKey(mhState));
  assert.equal(sessionKey(admin), "", "admin files nothing, so it has no key");
});

test("a second report from the same account for the same date is detected", () => {
  const existing = [submission({ id: "first" })];
  const found = findExistingSubmission(existing, havBlock, "2026-08-18");
  assert.equal(found?.id, "first");

  assert.equal(
    findExistingSubmission(existing, havBlock, "2026-08-19"),
    null,
    "a different event date is not a duplicate",
  );
  assert.equal(
    findExistingSubmission(existing, punDistrict, "2026-08-18"),
    null,
    "the district's own report is not the block's duplicate",
  );
});

test("the duplicate guard cannot be evaded by changing the reported name", () => {
  // Regression: the guard used to key off the entity NAME. An organisation
  // login that could pick a different name from a dropdown produced a fresh key
  // every time and so never collided with its own earlier report — one
  // credential could publish unlimited self-declared figures.
  const first = submission({
    id: "first",
    reporterKind: "LINE_MINISTRY",
    state: undefined,
    district: undefined,
    block: undefined,
    entityName: "Ministry of Education",
    createdBy: ministry.accountId,
  });

  assert.equal(
    findExistingSubmission([first], ministry, "2026-08-18")?.id,
    "first",
    "same account, same date — must be refused",
  );

  const underAnotherName = submission({
    ...first,
    id: "second",
    entityName: "Ministry of Defence",
  });
  assert.equal(
    findExistingSubmission([underAnotherName], ministry, "2026-08-18")?.id,
    "second",
    "still the same account, so still a duplicate no matter what name it carries",
  );
});

// ── Pending labels ───────────────────────────────────────────────────────────

test("pending label names the tier being waited on", () => {
  assert.match(pendingLabel(submission({ status: "PENDING_DISTRICT" })) ?? "", /District/);
  assert.match(pendingLabel(submission({ status: "PENDING_STATE" })) ?? "", /State/);
  assert.equal(pendingLabel(submission({ status: "APPROVED" })), undefined);
});

// ── Reporting window (assumption A10) ────────────────────────────────────────

test("reporting is open on the event date only", () => {
  // Timestamps are UTC; the window is evaluated in IST (UTC+5:30).
  assert.equal(windowState(new Date("2026-07-21T10:00:00Z")), "BEFORE");
  assert.equal(windowState(new Date("2026-08-18T06:00:00Z")), "OPEN");
  assert.equal(
    windowState(new Date("2026-08-19T06:00:00Z")),
    "CLOSED",
    "the day after the event is closed — there is no grace period",
  );
  assert.equal(isFormOpen(new Date("2026-08-18T06:00:00Z")), true);
  assert.equal(isFormOpen(new Date("2026-08-19T06:00:00Z")), false);
});

test("the developer override wins over the real date", () => {
  assert.equal(windowState(new Date("2026-07-21T10:00:00Z"), "OPEN"), "OPEN");
  assert.equal(windowState(new Date("2026-08-18T10:00:00Z"), "CLOSED"), "CLOSED");
});

test("the window follows Indian local time, not UTC", () => {
  // Regression: the check used the UTC calendar date, so for the first 5h30m of
  // 18 August in India it still read as 17 August and the form stayed shut on
  // the morning of the National Pledge itself.
  assert.equal(istDate(new Date("2026-08-17T19:00:00Z")), "2026-08-18", "00:30 IST on the 18th");
  assert.equal(
    windowState(new Date("2026-08-17T19:00:00Z")),
    "OPEN",
    "00:30 IST on 18 Aug must be open",
  );
  assert.equal(
    windowState(new Date("2026-08-17T18:00:00Z")),
    "BEFORE",
    "23:30 IST on 17 Aug is still before",
  );
  assert.equal(
    windowState(new Date("2026-08-18T18:00:00Z")),
    "OPEN",
    "23:30 IST on the 18th is the last open moment",
  );
  assert.equal(
    windowState(new Date("2026-08-18T19:00:00Z")),
    "CLOSED",
    "00:30 IST on the 19th is closed",
  );
});

// ── Which form each login files ──────────────────────────────────────────────

test("each role maps to exactly one form, and admin to none", () => {
  assert.equal(reporterKindForSession(havBlock), "ADMIN_TIER");
  assert.equal(reporterKindForSession(punDistrict), "ADMIN_TIER");
  assert.equal(reporterKindForSession(mhState), "ADMIN_TIER");
  assert.equal(reporterKindForSession(ministry), "LINE_MINISTRY");
  assert.equal(reporterKindForSession(admin), null);
});

// ── Block master data ────────────────────────────────────────────────────────

test("seeded blocks resolve, unseeded districts return empty rather than throwing", () => {
  assert.ok(blocksFor("Maharashtra", "Pune").includes("Haveli"));
  assert.equal(hasBlocks("Maharashtra", "Pune"), true);
  assert.deepEqual(blocksFor("Maharashtra", "Nowhere"), []);
  assert.deepEqual(blocksFor("Atlantis", "Nowhere"), []);
  assert.equal(hasBlocks("Atlantis", "Nowhere"), false);
});

test("coverage is reported honestly and is well short of LGD's ~7,000", () => {
  const c = blockCoverage();
  assert.ok(c.states >= 18, `expected at least 18 states, got ${c.states}`);
  assert.ok(c.blocks > 200, `expected a usable subset, got ${c.blocks}`);
  assert.ok(c.blocks < 7000, "this is a subset, not the full LGD import");
});
