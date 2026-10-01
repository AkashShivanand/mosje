// The PFMS payment leg — the rules the Maker's wizard, the Checker's review, the case page and the
// reports all read. Each test names the BRD requirement it holds up.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { buildSeed, SEED_SCHEMES } from "../store/seed.ts";
import type { EAnudaanState } from "../types.ts";
import { buildPfmsSeed } from "./seed.ts";
import { PFMS_STATUS_STAGE, RESTARTABLE, STAGE_INFO, STAGES, EXCEPTIONS, stageOf, latestRequest } from "./stages.ts";
import {
  authoriseAndTransmit,
  billStatusOf,
  restartAdvice,
  certificateCheck,
  createAdvice,
  nextBillNumber,
  pfmsFinancialYear,
  requiredDocTypes,
  returnAdvice,
  submitAdvice,
  validateAdvice,
  type AdviceContext,
} from "./advice.ts";
import { advanceRequest, expireFinancialYear, failCredit, resendQueued, returnAndCancel, returnByPfms, simulateTransmit } from "./simulator.ts";
import { schemeCodeFor, schemeTitle } from "./masters.ts";
import { PFMS_ERRORS, pfmsError } from "./errors.ts";
import { paymentCase, paymentCases, makerTab } from "./selectors.ts";
import { ageing, pipelineCounts, poolUtilisation, reconcile, turnaround, usedClaimReferences } from "./reports.ts";
import type { PaymentAdvice } from "./types.ts";
import { sanctionBankGap } from "../workflow.ts";

const NOW = "2026-09-29T09:00:00.000Z";
const main: EAnudaanState = { version: 13, session: null, schemes: SEED_SCHEMES, ...buildSeed() };
const pfms = buildPfmsSeed(main, NOW);
const ctx: AdviceContext = { masters: pfms.masters, configs: pfms.configs, now: NOW };

/* ── Annexure C: no raw status reaches a user ─────────────────────────────── */

test("every PFMS status maps to a stage with a Title Case label (BRD §2.4, Annexure C)", () => {
  for (const [status, stage] of Object.entries(PFMS_STATUS_STAGE)) {
    const info = STAGE_INFO[stage];
    assert.ok(info, `${status} → ${stage} has no label`);
    assert.ok(!/[a-z][A-Z]/.test(info.label), `${stage} label reads like a code: ${info.label}`);
  }
  for (const s of [...STAGES, ...EXCEPTIONS]) assert.ok(STAGE_INFO[s].label.length > 0);
});

test("a UTR on every beneficiary reads Paid, and nothing before it does (BR-NTF-001)", () => {
  const paid = pfms.advices.filter((a) => stageOf(a) === "paid" || stageOf(a) === "closed");
  assert.ok(paid.length > 0);
  for (const a of paid) assert.ok(latestRequest(a)!.payments.every((p) => p.utr), a.id);
  for (const a of pfms.advices.filter((x) => !["paid", "closed"].includes(stageOf(x)))) {
    assert.ok(!latestRequest(a)?.payments.every((p) => p.utr) || latestRequest(a)!.payments.length === 0, a.id);
  }
});

/* ── One request, one answer: the two stores agree ───────────────────────── */

test("a file shown Paid through PFMS is the file the main store records as released, on the same day", () => {
  for (const a of pfms.advices.filter((x) => ["paid", "closed"].includes(stageOf(x)))) {
    const app = main.applications.find((x) => x.id === a.appId)!;
    assert.ok(app.release, `${a.appId} is Paid here but not released there`);
    const credited = latestRequest(a)!.payments[0]!.scrollDate!;
    assert.equal(credited, app.release!.releasedAt.slice(0, 10), a.appId);
  }
  for (const a of pfms.advices.filter((x) => !["paid", "closed"].includes(stageOf(x)))) {
    assert.ok(!main.applications.find((x) => x.id === a.appId)!.release, `${a.appId} is in flight here but released there`);
  }
});

test("every advice belongs to a sanctioned file, and no file has two", () => {
  const ids = pfms.advices.map((a) => a.appId);
  assert.equal(new Set(ids).size, ids.length);
  for (const a of pfms.advices) assert.ok(main.applications.find((x) => x.id === a.appId)?.sanction, a.appId);
});

test("the seed puts a file in every state the Maker's queue and the Checker's queue can show", () => {
  const cases = paymentCases(main, pfms);
  const tabs = new Set(cases.map(makerTab));
  for (const t of ["new", "returned", "not-accepted", "held"] as const) assert.ok(tabs.has(t), `no file in ${t}`);
  const stages = new Set(cases.map((c) => c.stage));
  for (const s of ["awaiting-authorisation", "bill-with-ddo", "at-pao", "waiting-to-resend", "cancelled", "paid"] as const) {
    assert.ok(stages.has(s) || (s === "paid" && stages.has("closed")), `no file at ${s}`);
  }
  const blockers = new Set(cases.map((c) => c.blocker).filter(Boolean));
  assert.deepEqual([...blockers].sort(), ["needs-backfill", "needs-payee-code", "scheme-code-pending"]);
});

/* ── The Maker (FR-PDM) ──────────────────────────────────────────────────── */

const freshApp = () => main.applications.find((a) => a.institutionId === "DR/MH/PUN/03651" && a.sanction && !a.release)!;
const fresh = (): PaymentAdvice => {
  const app = freshApp();
  const c = paymentCase(main, pfms, app);
  assert.equal(c.stage, "awaiting-advice");
  assert.equal(c.blocker, undefined);
  const payee = pfms.payees.find((p) => p.projectId === app.institutionId)!;
  return createAdvice({
    id: "PA/TEST/1",
    appId: app.id,
    schemeCode: app.schemeCode,
    financialYear: app.financialYear,
    sanctionAmount: app.sanction!.total,
    beneficiary: { payeeCode: payee.payeeCode, name: "Sankalp Seva Sansthan", accountLast4: "1207", ifsc: "MAHB0001207", bank: "Bank of Maharashtra", source: "ngo" },
    maker: "pd-maker",
    now: NOW,
    configs: pfms.configs,
  });
};

test("a new advice is pre-filled with what e-Anudaan already knows (FR-PDM-002)", () => {
  const a = fresh();
  assert.equal(a.heads[0]!.amount, a.sanctionAmount, "the only head carries the whole sanction");
  assert.equal(a.beneficiaries[0]!.gross, a.sanctionAmount);
  assert.ok(a.heads[0]!.functionHead, "the scheme's first configured head is proposed");
  assert.equal(a.header.ddoCode, "", "NAPDDR has two DDOs, so the Maker chooses");
});

test("the local checks name the field, before PFMS ever sees it (NFR §6.5)", () => {
  const a = fresh();
  const issues = validateAdvice(a, ctx);
  const fields = issues.map((i) => i.field);
  assert.ok(fields.includes("hdr-ddo") && fields.includes("hdr-pd"));
  assert.ok(fields.includes("ben-0-remarks"));
  assert.ok(fields.includes("doc-type-1") && fields.includes("doc-type-2"));
  // Out of balance heads are one issue on the total, not one per head.
  const split = { ...a, heads: [{ ...a.heads[0]!, amount: a.sanctionAmount - 1 }] };
  assert.ok(validateAdvice(split, ctx).some((i) => i.field === "heads-total"));
});

test("an inactive DDO, a PD code of another DDO and a remark over 25 characters are refused (FR-MDM-004, Annexure A.3)", () => {
  const a = fresh();
  const bad = { ...a, header: { ...a.header, ddoCode: "209317", pdCode: "93110017" }, beneficiaries: [{ ...a.beneficiaries[0]!, remarks: "x".repeat(26) }] };
  const msgs = validateAdvice(bad, ctx);
  assert.match(msgs.find((i) => i.field === "hdr-ddo")!.message, /not activated for e-Bills/);
  assert.match(msgs.find((i) => i.field === "hdr-pd")!.message, /not mapped/);
  assert.match(msgs.find((i) => i.field === "ben-0-remarks")!.message, /25 characters/);
});

test("stale master data blocks submission (BR-MDM-001)", () => {
  const stale: AdviceContext = { ...ctx, masters: { ...ctx.masters, syncedAt: "2026-09-01T00:00:00.000Z" } };
  assert.ok(validateAdvice(fresh(), stale).some((i) => i.field === "hdr-masters"));
});

test("a scheme with no PFMS code cannot be sent (§9)", () => {
  const smile = main.applications.find((a) => a.schemeCode === "SMILE" && a.sanction && !a.release)!;
  assert.equal(paymentCase(main, pfms, smile).blocker, "scheme-code-pending");
});

test("bill numbers are unique per DDO per financial year (BR-SNC-004)", () => {
  const n1 = nextBillNumber(pfms.advices, "209311", "2026-27");
  assert.ok(!pfms.advices.some((a) => a.header.billNumber === n1));
  assert.match(n1, /^209311\/2027\/\d{4}$/);
  assert.equal(pfmsFinancialYear("2026-27"), "2027");
});

test("mandatory documents escalate with the landing status (BR-DOC-001)", () => {
  assert.deepEqual(requiredDocTypes("Approved"), [1, 2]);
  assert.deepEqual(requiredDocTypes("DigitallySignedByDDO"), [1, 2, 4]);
  assert.deepEqual(requiredDocTypes("PassedByPAO"), [1, 2, 4, 5]);
});

/** A fresh advice with everything the Maker supplies filled in. */
const finished = (): PaymentAdvice => {
  const a = fresh();
  return {
    ...a,
    header: { ...a.header, ddoCode: "209311", pdCode: "93110017", billNumber: nextBillNumber(pfms.advices, "209311", a.financialYear) },
    beneficiaries: [{ ...a.beneficiaries[0]!, remarks: "GIA NAPDDR 2027" }],
    documents: ([1, 2] as const).map((t) => ({ id: `d${t}`, type: t, name: `${t}.pdf`, sizeKb: 100, hash: "abc=", uploadedAt: NOW, viewLink: { token: "t", expiresAt: NOW, used: false } })),
  };
};

test("a finished advice passes, is submitted, draws one Claim Reference Number and is locked (FR-PDM-008, FR-PDM-011)", () => {
  const a = finished();
  assert.deepEqual(validateAdvice(a, ctx), []);
  const used = usedClaimReferences(pfms.advices);
  const res = submitAdvice(a, "pd-maker", ctx, pfms.pool, used);
  assert.ok(res.ok);
  const sub = res.advice;
  assert.equal(sub.state, "submitted");
  assert.ok(sub.beneficiaries[0]!.claimReference);
  assert.ok(!used.has(sub.beneficiaries[0]!.claimReference!), "a consumed number is never reissued");
  assert.equal(submitAdvice(sub, "pd-maker", ctx, pfms.pool, used).ok, false, "a submitted advice cannot be submitted again");
});

/* ── The Checker (FR-PDC) ────────────────────────────────────────────────── */

const submitted = () => {
  const r = submitAdvice(finished(), "pd-maker", ctx, pfms.pool, usedClaimReferences(pfms.advices));
  assert.ok(r.ok);
  return r.advice;
};

test("a return needs a remark and reopens only the advice (FR-PDC-003)", () => {
  const a = submitted();
  assert.equal(returnAdvice(a, "pd-checker", "  ", NOW).ok, false);
  const r = returnAdvice(a, "pd-checker", "Wrong head.", NOW);
  assert.ok(r.ok);
  assert.equal(r.advice.state, "returned");
  assert.equal(r.advice.sanctionAmount, a.sanctionAmount, "the sanction is untouched (BR-SNC-002)");
});

test("the Maker cannot sign their own advice, and only the designated Checker can (BR-DSC-001, §10)", () => {
  const a = submitted();
  assert.equal(certificateCheck(a, "pd-maker", pfms.designations, NOW), "own-advice");
  assert.equal(certificateCheck(a, "pd-us", pfms.designations, NOW), "not-designated");
  assert.equal(certificateCheck(a, "pd-checker", pfms.designations, NOW), "ok");
  const lapsed = pfms.designations.map((d) => ({ ...d, certificateExpires: "2026-01-01" }));
  assert.equal(certificateCheck(a, "pd-checker", lapsed, NOW), "expired");
});

test("one call per bill: accepted, refused or queued, and never the same identifier twice (FR-PDC-005, FR-SNC-003)", () => {
  const a = submitted();
  const sig = { by: "pd-checker" as const, personName: "R", at: NOW, certificateSerial: "X" };
  const ok = authoriseAndTransmit(a, sig, "U1", simulateTransmit("accept"), NOW);
  assert.ok(ok.ok);
  assert.equal(stageOf(ok.advice), "received");
  assert.equal(authoriseAndTransmit(ok.advice, sig, "U2", simulateTransmit("accept"), NOW).ok, false);

  const refused = authoriseAndTransmit(a, sig, "U3", simulateTransmit("not-accepted"), NOW);
  assert.ok(refused.ok);
  assert.equal(stageOf(refused.advice), "not-accepted");
  assert.ok(refused.advice.issues.every((i) => !/ERR/.test(i.message)), "the raw code is never the message (FR-STS-006)");

  const queued = authoriseAndTransmit(a, sig, "U4", simulateTransmit("timeout"), NOW);
  assert.ok(queued.ok);
  assert.equal(stageOf(queued.advice), "waiting-to-resend");
  const resent = resendQueued(queued.advice, NOW, "U5");
  assert.ok(!("error" in resent));
  assert.equal(latestRequest(resent.advice)!.previousUniqueIdentifier, "U4", "a resend is a new identifier pointing at the old (FR-SNC-004)");
});

/* ── PFMS progress (FR-STS) ──────────────────────────────────────────────── */

test("advancing reaches Paid exactly once, with a UTR per beneficiary (FR-STS-003, FR-NTF-001)", () => {
  const sig = { by: "pd-checker" as const, personName: "R", at: NOW, certificateSerial: "X" };
  const r = authoriseAndTransmit(submitted(), sig, "UA", simulateTransmit("accept"), NOW);
  assert.ok(r.ok);
  let a = r.advice;
  let credits = 0;
  const ids = { utr: () => "UTR1", token: () => "T1", voucher: () => "V1" };
  for (let i = 0; i < 12; i++) {
    const step = advanceRequest(a, NOW, ids);
    if ("error" in step) break;
    if (step.credited) credits++;
    a = step.advice;
  }
  assert.equal(credits, 1);
  assert.equal(stageOf(a), "closed");
  for (const e of a.history) assert.doesNotMatch(e.text, /\b[A-Z][a-z]+[A-Z][A-Za-z]+\b/, `raw PFMS status in history: ${e.text}`);
  assert.ok(latestRequest(a)!.bill && latestRequest(a)!.voucher);
});

test("a cancelled sanction stays cancelled (BR-CAN-001)", () => {
  const sig = { by: "pd-checker" as const, personName: "R", at: NOW, certificateSerial: "X" };
  const r = authoriseAndTransmit(submitted(), sig, "UC", simulateTransmit("accept"), NOW);
  assert.ok(r.ok);
  const c = returnAndCancel(r.advice, "Wrong date.", NOW);
  assert.ok(!("error" in c));
  assert.equal(stageOf(c.advice), "cancelled");
  assert.equal(submitAdvice(c.advice, "pd-maker", ctx, pfms.pool, new Set()).ok, false);
});

test("every PFMS error has a plain-language message and a field to jump to", () => {
  for (const e of PFMS_ERRORS) {
    assert.ok(e.message.endsWith("."), e.code);
    assert.ok(!/ERR/.test(e.message), e.code);
    assert.ok(e.field, e.code);
  }
  assert.match(pfmsError("ERRUNKNOWN").message, /PFMS did not accept/);
  assert.equal(pfmsError("ERRSNC44", { ERRSNC44: "Reworded." }).message, "Reworded.");
});

/* ── Reports (§11) ───────────────────────────────────────────────────────── */

test("the pipeline counts every advice once, and the reports agree with it", () => {
  const cases = paymentCases(main, pfms);
  const counts = pipelineCounts(pfms.advices, cases.filter((c) => !c.advice).length);
  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  assert.equal(total, cases.length);
  const recon = reconcile(pfms.advices, pfms.feed);
  assert.ok(recon.some((r) => r.state === "matched"));
  assert.ok(recon.some((r) => r.state === "not-in-feed"));
  assert.ok(recon.some((r) => r.state === "amount-differs"));
  assert.ok(ageing(pfms.advices, pfms.masters, NOW, pfms.ageingThresholdDays).some((r) => r.overThreshold));
  const pool = poolUtilisation(pfms.pool, pfms.advices);
  for (const p of pool) assert.equal(p.drawn, p.consumed + p.remaining);
  const tat = turnaround(pfms.advices, (id) => main.applications.find((a) => a.id === id)?.sanction?.sanctionedAt);
  assert.ok(tat.length > 0 && tat.every((t) => t.averageDays >= 0));
});

test("the seeded payment leg fits beside the main store", () => {
  const size = JSON.stringify(pfms).length;
  assert.ok(size < 150_000, `seeded payment leg is ${size.toLocaleString("en-IN")} characters`);
});

test("no sanction is issued while the application's bank account or IFSC is incomplete (FR-NGO-002)", () => {
  assert.match(sanctionBankGap({ formValues: { fld_bank_account_number: "", fld_bank_ifsc: "SBIN0001234" } }) ?? "", /cannot be issued/);
  assert.match(sanctionBankGap({ formValues: { fld_bank_account_number: "30112233445566", fld_bank_ifsc: "" } }) ?? "", /cannot be issued/);
  assert.equal(sanctionBankGap({ formValues: { fld_bank_account_number: "30112233445566", fld_bank_ifsc: "SBIN0001234" } }), null);
  // A legacy file with no bank section is held for back-fill at the payment stage instead (BR-BAK-001).
  assert.equal(sanctionBankGap({ formValues: {} }), null);
});

test("deductions reduce the net payable and cannot exceed the gross (FR-PDM-004, Annexure F.3)", () => {
  const a = finished();
  const ded = { ...a, beneficiaries: [{ ...a.beneficiaries[0]!, deductions: [{ id: "d1", functionHead: "2235021070101", objectHead: "31", category: "GEN", grantNumber: "093", amount: 50_000 }] }] };
  assert.deepEqual(validateAdvice(ded, ctx), []);
  const over = { ...a, beneficiaries: [{ ...a.beneficiaries[0]!, deductions: [{ id: "d1", amount: a.sanctionAmount + 1 }] }] };
  assert.ok(validateAdvice(over, ctx).some((i) => /Deductions cannot exceed/.test(i.message)));
  const blank = { ...a, beneficiaries: [{ ...a.beneficiaries[0]!, deductions: [{ id: "d1", amount: 10 }] }] };
  assert.ok(validateAdvice(blank, ctx).some((i) => i.field === "ben-0-ded-0-function"));
});

/* ── The application form (FR-NGO-001/002) ──────────────────────────────── */

test("the application form asks for the payee code and a typed-twice account where the account is new", async () => {
  const { wizardFor, stepFields, fieldVisible, validateStep } = await import("../form-schema.ts");
  const w = wizardFor("SHRESHTA_M2")!;
  const step = w.steps.find((s) => s.kind !== "documents" && s.kind !== "review" && stepFields(s).some((f) => f.name === "fld_pfms_payee_code"))!;
  const f = (name: string) => stepFields(step).find((x) => x.name === name)!;
  const fresh = { claim_stage: "", fld_pfms_on_record: "", fld_pfms_registered: "Yes", fld_bank_account_number: "30112233445566" };
  assert.ok(fieldVisible(f("fld_pfms_payee_code"), fresh) && fieldVisible(f("fld_pfms_payee_confirm"), fresh));
  assert.ok(fieldVisible(f("fld_bank_account_confirm"), fresh));
  // Not registered: the Ministry registers it later, and the code is asked on Project Bank Accounts.
  assert.ok(!fieldVisible(f("fld_pfms_payee_code"), { ...fresh, fld_pfms_registered: "No" }));
  // Already on record: nothing is asked again.
  assert.ok(!fieldVisible(f("fld_pfms_payee_code"), { ...fresh, fld_pfms_on_record: "Yes" }));
  const errors = validateStep(step, { ...fresh, fld_bank_account_confirm: "30112233445567", fld_pfms_payee_code: "MH12" });
  assert.match(errors.fld_bank_account_confirm ?? "", /do not match/);
  assert.match(errors.fld_pfms_payee_code ?? "", /two letters and ten digits/);
});

/* ── After PFMS sends a bill back, lets it lapse, or the bank fails it (1 Oct 2026) ─────────── */

const sig = { by: "pd-checker" as const, personName: "R", at: NOW, certificateSerial: "X" };
const sentToPfms = (id: string) => {
  const r = authoriseAndTransmit(submitted(), sig, id, simulateTransmit("accept"), NOW);
  assert.ok(r.ok);
  return r.advice;
};
const step = (a: PaymentAdvice, times: number) => {
  for (let i = 0; i < times; i++) {
    const s = advanceRequest(a, NOW, { utr: () => "UTR1", token: () => "T1", voucher: () => "V1" });
    assert.ok(!("error" in s), "advance");
    a = s.advice;
  }
  return a;
};

test("a bill returned by PFMS without cancellation goes back to the Maker and is resubmitted as R under a new identifier (FR-PDM-001, FR-PDM-006, FR-SNC-004)", () => {
  assert.equal(PFMS_STATUS_STAGE.ReturnedByPDChecker, "returned-by-pfms");
  const a = step(sentToPfms("UR1"), 1); // Bill generated at the DDO
  const r = returnByPfms(a, "DDO", "The object head does not match the scheme.", NOW);
  assert.ok(!("error" in r));
  assert.equal(stageOf(r.advice), "returned-by-pfms");
  assert.equal(billStatusOf(r.advice), "R");
  const again = submitAdvice(r.advice, "pd-maker", ctx, pfms.pool, usedClaimReferences(pfms.advices));
  assert.ok(again.ok, "a returned bill can be corrected and submitted again");
  const resent = authoriseAndTransmit(again.advice, sig, "UR2", simulateTransmit("accept"), NOW);
  assert.ok(resent.ok);
  const req = latestRequest(resent.advice)!;
  assert.equal(req.billStatus, "R");
  assert.equal(req.previousUniqueIdentifier, "UR1");
  assert.equal(billStatusOf(resent.advice), "F", "once PFMS has received the resubmission, nothing is pending as R");
});

test("a returned-by-PFMS case sits in the Maker's Returned by PFMS tab", () => {
  const a = returnByPfms(step(sentToPfms("UT1"), 1), "PAO", "Wrong head.", NOW);
  assert.ok(!("error" in a));
  const app = main.applications.find((x) => x.id === a.advice.appId)!;
  assert.equal(makerTab({ app, advice: a.advice, stage: stageOf(a.advice), paidBeforeIntegration: false }), "returned-pfms");
});

test("a lapsed financial year is final, cannot advance, and is started afresh (Annexure C, BR-CAN-001)", () => {
  const e = expireFinancialYear(step(sentToPfms("UE1"), 2), NOW);
  assert.ok(!("error" in e));
  assert.equal(stageOf(e.advice), "fy-expired");
  assert.ok("error" in advanceRequest(e.advice, NOW, { utr: () => "U", token: () => "T", voucher: () => "V" }));
  const app = main.applications.find((x) => x.id === e.advice.appId)!;
  assert.equal(makerTab({ app, advice: e.advice, stage: "fy-expired", paidBeforeIntegration: false }), "returned-pfms");
});

test("a failed bank credit is its own stage, never Paid, and a fresh advice replaces it (decision: plan §4, question 13)", () => {
  let a = step(sentToPfms("UF1"), 5); // payment file sent to the bank
  assert.equal(stageOf(a), "payment-in-process");
  const f = failCredit(a, NOW);
  assert.ok(!("error" in f));
  a = f.advice;
  assert.equal(stageOf(a), "credit-failed");
  assert.ok("error" in advanceRequest(a, NOW, { utr: () => "U", token: () => "T", voucher: () => "V" }), "a failed credit is not walked on to Paid");

  const payee = { ...a.beneficiaries[0]!, accountLast4: "9911" };
  const fresh = restartAdvice(a, { id: "PA/2026-27/99999", beneficiary: payee, billNumber: "209311/2027/0099", maker: "pd-maker", now: NOW });
  assert.ok(fresh.ok);
  const n = fresh.advice;
  assert.equal(n.state, "draft");
  assert.equal(n.earlier?.length, 1);
  assert.equal(n.earlier?.[0]?.id, a.id);
  assert.equal(n.beneficiaries[0]!.accountLast4, "9911", "the payee is read again from the corrected account");
  assert.equal(n.beneficiaries[0]!.claimReference, undefined, "a new Claim Reference Number is drawn on submit");
  const used = usedClaimReferences([n]);
  assert.ok(used.has(a.beneficiaries[0]!.claimReference!), "the old number stays consumed");

  const sub = submitAdvice(n, "pd-maker", ctx, pfms.pool, usedClaimReferences([...pfms.advices, n]));
  assert.ok(sub.ok);
  const sent = authoriseAndTransmit(sub.advice, sig, "UF2", simulateTransmit("accept"), NOW);
  assert.ok(sent.ok);
  assert.equal(latestRequest(sent.advice)!.previousUniqueIdentifier, "UF1", "the fresh advice points back to the one it replaces");
  assert.equal(latestRequest(sent.advice)!.billStatus, "F");
});

test("only a cancelled, lapsed or failed advice can be started afresh", () => {
  const a = sentToPfms("UX1");
  assert.equal(restartAdvice(a, { id: "x", beneficiary: a.beneficiaries[0]!, billNumber: "b", maker: "pd-maker", now: NOW }).ok, false);
  for (const s of RESTARTABLE) assert.ok(STAGE_INFO[s].terminal, s);
});

test("the seed closes a sanction after its credit, never before it", () => {
  for (const a of pfms.advices) {
    const req = latestRequest(a);
    const closed = req?.statusHistory.find((h) => h.status === "Closed");
    const voucher = req?.statusHistory.find((h) => h.status === "DigitalSignatoryLast");
    if (closed && voucher) assert.ok(closed.at > voucher.at, a.id);
  }
});

test("SHRESTHA Mode 1 is configured and waits for its PFMS scheme code (BRD §1.2, §9)", () => {
  const m1 = pfms.configs.find((c) => c.schemeCode === "SHRESHTA_M1");
  assert.ok(m1);
  assert.equal(m1.pfmsSchemeCode, null);
  assert.equal(schemeTitle(m1), "SHRESHTA Mode 1");
  assert.equal(schemeCodeFor("  Scheme for PM-DAKSH  "), "SCHEME_FOR_PM_DAKSH");
});
