/**
 * The payment leg's seeded state — ILLUSTRATIVE, like every figure in this prototype.
 *
 * Built from the main seed's own files so the two stores tell one story:
 *
 *   - the files sanctioned this year and not yet paid (the six `inPayment` projects and the legacy
 *     sanctioned files) are spread across the stages, one per state a Maker, a Checker, the Bureau
 *     or an NGO can meet;
 *   - files released since 1 April 2026 are shown as paid through PFMS, with the credit dated the
 *     day the main store records the release — so "Paid" here and "Grant Released" there agree;
 *   - anything released earlier was paid before the integration and has no advice.
 */

import type { EAnudaanState, GrantApplication, ProjectAccount } from "../types.ts";
import { accountsFor } from "../applicant.ts";
import { SEED_SCHEME_CONFIG, configFor, seedMasters } from "./masters.ts";
import { createAdvice, nextBillNumber, pfmsFinancialYear } from "./advice.ts";
import { drawBatch, type ReleaseEntry } from "./reports.ts";
import type {
  AdviceDocument,
  BackfilledAccount,
  BeneficiaryLine,
  ClaimReferenceBatch,
  Designation,
  Masters,
  PaymentAdvice,
  PayeeRecord,
  PfmsRequest,
  PfmsStatus,
  SchemePfmsConfig,
} from "./types.ts";
import { PFMS_HAPPY_PATH } from "./stages.ts";
import { pfmsError } from "./errors.ts";

export interface PfmsState {
  version: number;
  masters: Masters;
  configs: SchemePfmsConfig[];
  designations: Designation[];
  payees: PayeeRecord[];
  backfilled: BackfilledAccount[];
  advices: PaymentAdvice[];
  pool: ClaimReferenceBatch[];
  /** The Ministry Release / Transfer Entry feed, as last pulled (FR-STS-004). */
  feed: ReleaseEntry[];
  feedPulledAt: string;
  /** The Bureau's rewordings of PFMS error messages, by code (FR-STS-006). */
  errorOverrides: Record<string, string>;
  /** Days before an ageing row is flagged (§11, Ageing Report). */
  ageingThresholdDays: number;
  seq: number;
}

export const PFMS_SCHEMA_VERSION = 1;

const DAY = 86_400_000;
const INTEGRATION_FROM = "2026-04-01";

/** Illustrative PFMS payee code: the project's state letters and ten digits from its serial. */
export function derivedPayeeCode(projectId: string, salt = 0): string {
  const state = projectId.split("/")[1] ?? "IN";
  let h = 7 + salt;
  for (const ch of projectId) h = (h * 31 + ch.charCodeAt(0)) % 9_999_999_967;
  return `${state.toUpperCase().slice(0, 2)}${String(h).padStart(10, "0").slice(-10)}`;
}

/** A plausible-looking Base64 SHA-256 for a seeded file. A real upload hashes its bytes. */
export function seededHash(name: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let h = 2166136261;
  let out = "";
  for (let i = 0; i < 43; i++) {
    h ^= name.charCodeAt(i % name.length) + i;
    h = Math.imul(h, 16777619) >>> 0;
    out += alphabet[h % 64];
  }
  return `${out}=`;
}

const iso = (ms: number) => new Date(ms).toISOString();

export function buildPfmsSeed(main: EAnudaanState, now: string): PfmsState {
  const nowMs = Date.parse(now);
  const masters = seedMasters(iso(nowMs - 3 * 3_600_000));
  const configs = SEED_SCHEME_CONFIG.map((c) => ({ ...c, heads: [...c.heads], ddoCodes: [...c.ddoCodes] }));
  let seq = 0;

  const designations: Designation[] = masters.ddos.map((d) => ({
    ddoCode: d.code,
    maker: "pd-maker",
    checker: "pd-checker",
    certificateSerial: `4C3A${d.code}0F`,
    // One certificate has lapsed, so the Designations page shows what an expired one looks like.
    certificateExpires: d.code === "209312" ? "2026-07-31" : "2027-11-30",
    designatedBy: "pd-us",
    designatedAt: iso(nowMs - 40 * DAY),
  }));

  // NGO-confirmed payee codes for every current account the NGO has declared PFMS-registered.
  const payees: PayeeRecord[] = main.projectAccounts
    .filter((a) => !a.activeTo && a.pfmsRegistered)
    .map((a) => ({ accountId: a.id, projectId: a.projectId, payeeCode: derivedPayeeCode(a.projectId), source: "ngo" as const, confirmedAt: a.activeFrom }));

  // Two legacy files the Bureau has already back-filled (FR-NGO-003); LGCY/76001 is still waiting.
  const backfilled: BackfilledAccount[] = [];
  const legacy = (appId: string, bank: string, ifsc: string, last4: string) => {
    const app = main.applications.find((a) => a.id === appId);
    if (!app) return;
    backfilled.push({ projectId: app.institutionId, bank, branch: "Main", last4, ifsc, payeeCode: derivedPayeeCode(app.institutionId, 3), enteredBy: "pfms-bureau", enteredAt: iso(nowMs - 9 * DAY) });
  };
  legacy("LGCY/76002", "State Bank of India", "SBIN0001763", "3308");
  legacy("LGCY/76006", "Bank of Baroda", "BARB0VJAHMD", "6124");

  const pool: ClaimReferenceBatch[] = [];
  for (const pd of masters.pdCodes) {
    for (const fy of ["2024-25", "2025-26", "2026-27"]) pool.push(drawBatch(pool, pd.code, fy, 25, iso(nowMs - 30 * DAY)));
  }

  const ngoName = (app: GrantApplication) => main.ngos.find((n) => n.id === app.ngoId)?.name ?? app.ngoId;
  const beneficiaryOf = (app: GrantApplication): Omit<BeneficiaryLine, "id" | "gross" | "deductions" | "remarks" | "claimReference"> | null => {
    const acct: ProjectAccount | undefined = accountsFor(main, app.institutionId).current;
    if (acct) {
      const payee = payees.find((p) => p.accountId === acct.id);
      if (!payee) return null;
      return { payeeCode: payee.payeeCode, name: ngoName(app), accountLast4: acct.last4, ifsc: acct.ifsc, bank: acct.bank, source: "ngo" };
    }
    const b = backfilled.find((x) => x.projectId === app.institutionId);
    if (!b) return null;
    return { payeeCode: b.payeeCode, name: ngoName(app), accountLast4: b.last4, ifsc: b.ifsc, bank: b.bank, source: "bureau" };
  };

  const advices: PaymentAdvice[] = [];
  const used = new Set<string>();

  /** A complete, valid advice for a sanctioned file — the shape a Maker's finished work takes. */
  const complete = (app: GrantApplication, at: number): PaymentAdvice | null => {
    const ben = beneficiaryOf(app);
    const cfg = configFor(configs, app.schemeCode);
    if (!ben || !cfg || !app.sanction) return null;
    const created = iso(at);
    const adv = createAdvice({
      id: `PA/${app.financialYear}/${String(advices.length + 1).padStart(5, "0")}`,
      appId: app.id,
      schemeCode: app.schemeCode,
      financialYear: app.financialYear,
      sanctionAmount: app.sanction.total,
      beneficiary: ben,
      maker: "pd-maker",
      now: created,
      configs,
    });
    const ddoCode = cfg.ddoCodes[0]!;
    const pdCode = masters.pdCodes.find((p) => p.ddoCode === ddoCode)!.code;
    const fy = pfmsFinancialYear(app.financialYear);
    const claim = pool.find((b) => b.pdCode === pdCode && b.financialYear === fy)!.numbers.find((n) => !used.has(n))!;
    used.add(claim);
    const docs: AdviceDocument[] = ([1, 2] as const).map((t, i) => {
      const name = t === 1 ? `claim-${app.id.replace(/\//g, "-")}.pdf` : `sanction-order-${app.sanction!.orderNo.replace(/\//g, "-")}.pdf`;
      return { id: `${adv.id}-d${i + 1}`, type: t, name, sizeKb: 180 + i * 60, hash: seededHash(name), uploadedAt: created, viewLink: { token: seededHash(`${name}-link`).slice(0, 16), expiresAt: iso(at + 7 * DAY), used: false } };
    });
    return {
      ...adv,
      header: { ...adv.header, ddoCode, pdCode, billNumber: nextBillNumber(advices, ddoCode, app.financialYear), billDate: created.slice(0, 10) },
      beneficiaries: adv.beneficiaries.map((b) => ({ ...b, remarks: `GIA ${app.schemeCode.replace("_M2", "")} ${fy}`.slice(0, 25), claimReference: claim })),
      documents: docs,
      history: [...adv.history, { at: iso(at + 3_600_000), kind: "submitted", by: "pd-maker", text: "Submitted to the Checker for authorisation." }],
      submittedAt: iso(at + 3_600_000),
      updatedAt: iso(at + 3_600_000),
    };
  };

  const uid = (at: number) => `EANU${iso(at).slice(0, 10).replace(/-/g, "")}${String(++seq).padStart(6, "0")}`;
  const signature = (at: number) => ({ by: "pd-checker" as const, personName: "Radhika Menon", at: iso(at), certificateSerial: "4C3A2093110F" });

  /** Walk an accepted request along the happy path up to `until`, stamping each status a day apart. */
  const transmitted = (adv: PaymentAdvice, sentAt: number, until: PfmsStatus, paidOn?: number): PaymentAdvice => {
    const path = PFMS_HAPPY_PATH.slice(0, PFMS_HAPPY_PATH.indexOf(until) + 1);
    const step = paidOn ? Math.max(1, Math.floor((paidOn - sentAt) / Math.max(1, path.length - 1))) : DAY;
    const history = path.map((status, i) => ({ status, at: iso(Math.min(sentAt + i * step, paidOn ?? Infinity)) }));
    const req: PfmsRequest = {
      uniqueIdentifier: uid(sentAt),
      sentAt: iso(sentAt),
      billStatus: "F",
      outcome: "accepted",
      errors: [],
      status: until,
      statusAt: history.at(-1)!.at,
      statusHistory: history,
      payments: [],
      retries: 0,
    };
    const has = (s: PfmsStatus) => path.includes(s);
    const at = (s: PfmsStatus) => history.find((h) => h.status === s)!.at;
    if (has("BillGenerated")) req.bill = { billNumber: adv.header.billNumber, billDate: at("BillGenerated").slice(0, 10), tokenNumber: `T${String(40_000 + seq * 7).slice(-6)}`, tokenDate: at("BillGenerated").slice(0, 10) };
    if (has("DSCBatchGenerated")) req.payments = adv.beneficiaries.map((b) => ({ beneficiaryId: b.id, payeeCode: b.payeeCode, amount: b.gross, scrollStatus: "Pending" }));
    if (has("DigitalSignatoryLast")) {
      const day = (paidOn ? iso(paidOn) : at("DigitalSignatoryLast")).slice(0, 10);
      req.voucher = { number: `V${String(9_000 + seq * 3).slice(-5)}`, date: day };
      req.payments = req.payments.map((p) => ({ ...p, utr: `SBIN${day.replace(/-/g, "").slice(2)}${String(100_000 + seq * 13).slice(-6)}`, scrollStatus: "Success", scrollDate: day }));
    }
    const signedAt = sentAt - 30 * 60_000;
    return {
      ...adv,
      state: "transmitted",
      signature: signature(signedAt),
      requests: [req],
      updatedAt: req.statusAt!,
      history: [
        ...adv.history,
        { at: iso(signedAt), kind: "signed", by: "pd-checker", text: "Authorised and digitally signed by Radhika Menon." },
        { at: iso(sentAt), kind: "transmitted", text: "Received by PFMS." },
        ...(has("DigitalSignatoryLast") ? [{ at: iso(paidOn ?? sentAt), kind: "credited" as const, text: "Credit confirmed by the bank; UTR recorded for every beneficiary." }] : []),
        ...(until === "Closed" ? [{ at: req.statusAt!, kind: "status" as const, text: "Sanction closed at PFMS." }] : []),
      ],
    };
  };

  const byInst = (inst: string) => main.applications.filter((a) => a.institutionId === inst && a.sanction && !a.release).at(-1);
  const byId = (appId: string) => main.applications.find((a) => a.id === appId && a.sanction && !a.release);
  const sanctionedMs = (app: GrantApplication) => Date.parse(app.sanction!.sanctionedAt);

  // ── In flight ────────────────────────────────────────────────────────────
  // DR/MH/PUN/03651 — sanctioned, no advice yet: the Maker's first case.
  // DR/RJ/JAI/03653 — no PFMS payee code on record: held until the NGO supplies one.
  // SMILE/PUNE/03625 — PFMS has not allotted the scheme a code: held with the Bureau.
  // LGCY/76001 — a legacy file with no bank details at all: in the Bureau's back-fill queue.

  const put = (app: GrantApplication | undefined, make: (app: GrantApplication, t0: number) => PaymentAdvice | null) => {
    if (!app) return;
    const adv = make(app, sanctionedMs(app) + 2 * DAY);
    if (adv) advices.push(adv);
  };

  // Awaiting the Checker.
  put(byInst("DR/DL/NWD/03652"), (app, t0) => {
    const a = complete(app, t0);
    return a && { ...a, state: "submitted" };
  });

  // Returned by the Checker, with the remark the Maker reads.
  put(byId("LGCY/76002"), (app, t0) => {
    const a = complete(app, t0);
    if (!a) return null;
    const remark = "Attach the approved note sheet; the sanction order alone does not show the IFD concurrence.";
    return { ...a, state: "returned", returnCount: 1, checkerRemark: remark, history: [...a.history, { at: iso(t0 + 26 * 3_600_000), kind: "returned", by: "pd-checker", text: `Returned to the Maker: ${remark}` }] };
  });

  // Not accepted by PFMS — nothing created at PFMS, back with the Maker.
  put(byInst("DR/GJ/AHM/03654"), (app, t0) => {
    const a = complete(app, t0);
    if (!a) return null;
    const e = pfmsError("ERRSNC27");
    const sentAt = t0 + DAY;
    const req: PfmsRequest = { uniqueIdentifier: uid(sentAt), sentAt: iso(sentAt), billStatus: "F", outcome: "not-accepted", errors: [{ code: e.code, message: "Invalid Head of Account combination for Scheme" }], statusHistory: [], payments: [], retries: 0 };
    return {
      ...a,
      state: "not-accepted",
      signature: signature(sentAt - 60_000),
      requests: [req],
      issues: [{ step: e.step, field: e.field, message: e.message, pfmsCode: e.code }],
      updatedAt: iso(sentAt),
      history: [
        ...a.history,
        { at: iso(sentAt - 60_000), kind: "signed", by: "pd-checker", text: "Authorised and digitally signed by Radhika Menon." },
        { at: iso(sentAt), kind: "not-accepted", text: "PFMS did not accept the advice. Nothing was created at PFMS; it is back with the Maker." },
      ],
    };
  });

  // PFMS unreachable: queued for automatic resend.
  put(byInst("SR/MH/THN/03656"), (app, t0) => {
    const a = complete(app, t0);
    if (!a) return null;
    const sentAt = nowMs - 5 * 3_600_000;
    const req: PfmsRequest = { uniqueIdentifier: uid(sentAt), sentAt: iso(sentAt), billStatus: "F", outcome: "queued", errors: [], statusHistory: [], payments: [], retries: 2 };
    return {
      ...a,
      state: "queued",
      signature: signature(sentAt - 60_000),
      requests: [req],
      updatedAt: iso(sentAt),
      history: [
        ...a.history,
        { at: iso(sentAt - 60_000), kind: "signed", by: "pd-checker", text: "Authorised and digitally signed by Radhika Menon." },
        { at: iso(sentAt), kind: "queued", text: "PFMS could not be reached. The advice will be sent automatically when it can." },
      ],
    };
  });

  // Bill with the DDO.
  put(byInst("SR/DL/NWD/03655"), (app, t0) => {
    const a = complete(app, t0);
    return a && transmitted(a, t0 + DAY, "DigitallySignedByDDO");
  });

  // At the PAO, and stuck there long enough to be flagged on the Ageing report.
  put(byId("LGCY/76012"), (app) => {
    const t0 = nowMs - 26 * DAY;
    const a = complete(app, t0);
    return a && transmitted(a, t0 + DAY, "PassedByDHForDSC");
  });

  // Returned by the PAO and cancelled: terminal, a fresh sanction must originate (BR-CAN-001).
  put(byId("LGCY/76006"), (app) => {
    const t0 = nowMs - 21 * DAY;
    const a = complete(app, t0);
    if (!a) return null;
    const t = transmitted(a, t0 + DAY, "BillGenerated");
    const req = t.requests[0]!;
    const at = iso(t0 + 6 * DAY);
    const reason = "Sanction order date is later than the IFD concurrence date; the concurrence does not cover this sanction.";
    return {
      ...t,
      state: "cancelled",
      requests: [{ ...req, status: "Cancelled", statusAt: at, statusHistory: [...req.statusHistory, { status: "ReturnedByPAO", at }, { status: "Cancelled", at }], returnReason: reason }],
      updatedAt: at,
      history: [...t.history, { at, kind: "cancelled", text: `Returned by the PAO and cancelled at PFMS: ${reason}` }],
    };
  });

  // ── Paid through PFMS since the integration (credit = the main store's release) ────────────
  const released = main.applications.filter((a) => a.sanction && a.release && a.release.releasedAt >= INTEGRATION_FROM);
  for (const app of released) {
    const paidOn = Date.parse(app.release!.releasedAt);
    const t0 = Math.max(sanctionedMs(app) + DAY, paidOn - 12 * DAY);
    const a = complete(app, t0);
    if (!a) continue;
    advices.push(transmitted(a, t0 + DAY, nowMs - paidOn > 20 * DAY ? "Closed" : "DigitalSignatoryLast", paidOn));
  }

  // The release feed: every credited advice, with one amount recorded differently and one missing,
  // so the reconciliation report has something to flag.
  const credited = advices.filter((a) => a.requests[0]?.payments.every((p) => p.utr) && a.requests[0].payments.length > 0);
  const feed: ReleaseEntry[] = credited
    .filter((_, i) => i !== 1)
    .map((a, i) => {
      const req = a.requests[0]!;
      const amount = req.payments.reduce((s, p) => s + p.amount, 0);
      return { uniqueIdentifier: req.uniqueIdentifier, amount: i === 2 ? amount - 10_000 : amount, utr: req.payments[0]!.utr!, date: req.payments[0]!.scrollDate! };
    });

  return {
    version: PFMS_SCHEMA_VERSION,
    masters,
    configs,
    designations,
    payees,
    backfilled,
    advices,
    pool,
    feed,
    feedPulledAt: iso(nowMs - 6 * 3_600_000),
    errorOverrides: {},
    ageingThresholdDays: 15,
    seq,
  };
}
