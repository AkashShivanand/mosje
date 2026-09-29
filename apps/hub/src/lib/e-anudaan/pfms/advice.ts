/**
 * The payment advice's rules — pure functions, no React, no storage.
 *
 * Every rule here carries the BRD reference it implements. The Maker's wizard, the Checker's
 * review and the tests all call these, so a rule changes in one place (plan §5).
 *
 * The central design choice (BRD §2.4, NFR §6.5): everything knowable locally is checked
 * locally, BEFORE the one ReceiveSanctionData call, because a single-call design "means any one
 * incomplete field rejects the whole bill" (§9). `validateAdvice` returns field-level issues keyed
 * to the step and the input, so the wizard can put each message beside the field it is about.
 */

import type {
  AdviceDocument,
  AdviceEvent,
  AdviceStep,
  BeneficiaryLine,
  ClaimReferenceBatch,
  Designation,
  DocumentTypeCode,
  HeadLine,
  LandingStatus,
  Masters,
  PaymentAdvice,
  PfmsRequest,
  SchemePfmsConfig,
  Signature,
  ValidationIssue,
} from "./types.ts";
import type { RoleId } from "../types.ts";
import { IFSC, PAYEE_CODE, configFor, mastersStale } from "./masters.ts";
import { latestRequest } from "./stages.ts";

export interface AdviceContext {
  masters: Masters;
  configs: readonly SchemePfmsConfig[];
  now: string;
}

export type AdviceResult = { ok: true; advice: PaymentAdvice } | { ok: false; error: string; issues?: ValidationIssue[] };

export const STEP_ORDER: readonly AdviceStep[] = ["header", "heads", "beneficiary", "documents", "review"];

export const STEP_LABEL: Record<AdviceStep, string> = {
  header: "Sanction Header",
  heads: "Heads of Account",
  beneficiary: "Beneficiary Payment",
  documents: "Supporting Documents",
  review: "Review and Submit",
};

/** Fixed values PFMS requires and nobody chooses (FR-PDM-006, BR-SNC-003). */
export const FIXED_VALUES = [
  { term: "Payment Mode", value: "528 — e-Payment" },
  { term: "Sanction Type", value: "14 — Expenditure" },
  { term: "Bill Type", value: "7 — RPR-34 Grants-in-Aid Bill" },
  { term: "e-Sanction", value: "Yes" },
] as const;

/** Annexure E. */
export const DOCUMENT_TYPES: Record<DocumentTypeCode, string> = {
  1: "Claim",
  2: "Sanction",
  3: "Copy of Approved Notes",
  4: "Bill",
  5: "PAO Passing",
  6: "Other",
};

/** BR-DOC-001: mandatory fingerprints escalate with where the sanction lands. */
export function requiredDocTypes(landing: LandingStatus): DocumentTypeCode[] {
  if (landing === "PassedByPAO") return [1, 2, 4, 5];
  if (landing === "DigitallySignedByDDO") return [1, 2, 4];
  return [1, 2];
}

export const LANDING_LABEL: Record<LandingStatus, string> = {
  Approved: "Lands at the DDO",
  DigitallySignedByDDO: "Lands at the Bill Distributor",
  PassedByPAO: "Lands after PAO passing",
};

/** "2025-26" → "2026": PFMS reports the financial year by its closing year (Annexure A.1). */
export function pfmsFinancialYear(fy: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(fy);
  if (!m) return fy;
  return String(Number(m[1]) + 1);
}

/** A bill number unique per DDO per financial year (FR-PDM-005, BR-SNC-004). */
export function nextBillNumber(advices: readonly Pick<PaymentAdvice, "header">[], ddoCode: string, financialYear: string, skip: readonly string[] = []): string {
  const prefix = `${ddoCode}/${pfmsFinancialYear(financialYear)}/`;
  const taken = new Set([...advices.map((a) => a.header.billNumber).filter((b) => b.startsWith(prefix)), ...skip]);
  let n = taken.size + 1;
  let candidate = `${prefix}${String(n).padStart(4, "0")}`;
  while (taken.has(candidate)) candidate = `${prefix}${String(++n).padStart(4, "0")}`;
  return candidate;
}

export function sumHeads(heads: readonly HeadLine[]): number {
  return heads.reduce((s, h) => s + (Number.isFinite(h.amount) ? h.amount : 0), 0);
}

export function netOf(b: Pick<BeneficiaryLine, "gross" | "deductions">): number {
  return b.gross - sumHeads(b.deductions);
}

export const REMARKS_MAX = 25;

/* ── Creating ─────────────────────────────────────────────────────────────── */

export interface NewAdviceInput {
  id: string;
  appId: string;
  schemeCode: string;
  financialYear: string;
  sanctionAmount: number;
  beneficiary: Omit<BeneficiaryLine, "id" | "gross" | "deductions" | "remarks" | "claimReference">;
  maker: RoleId;
  now: string;
  configs: readonly SchemePfmsConfig[];
}

/**
 * Open a payment advice against a final sanction (FR-PDM-002): everything e-Anudaan already knows
 * is filled in — the sanction amount, the NGO's payee code and bank details, a single head of
 * account where the scheme has only one, and the gross amount — so the Maker supplies only what
 * PFMS additionally needs.
 */
export function createAdvice(input: NewAdviceInput): PaymentAdvice {
  const cfg = configFor(input.configs, input.schemeCode);
  const onlyDdo = cfg && cfg.ddoCodes.length === 1 ? cfg.ddoCodes[0]! : "";
  const first = cfg?.heads[0];
  return {
    id: input.id,
    appId: input.appId,
    schemeCode: input.schemeCode,
    financialYear: input.financialYear,
    sanctionAmount: input.sanctionAmount,
    state: "draft",
    header: { ddoCode: onlyDdo, pdCode: "", billNumber: "", billDate: input.now.slice(0, 10), npbDate: "", cnaExceptionReason: "" },
    heads: [{ id: `${input.id}-h1`, ...(first ?? {}), amount: input.sanctionAmount }],
    beneficiaries: [
      {
        id: `${input.id}-b1`,
        ...input.beneficiary,
        gross: input.sanctionAmount,
        deductions: [],
        remarks: "",
      },
    ],
    documents: [],
    preparedBy: input.maker,
    createdAt: input.now,
    updatedAt: input.now,
    returnCount: 0,
    requests: [],
    issues: [],
    history: [{ at: input.now, kind: "created", by: input.maker, text: "Payment advice opened against the sanction." }],
  };
}

/* ── Checking (NFR §6.5) ─────────────────────────────────────────────────── */

/**
 * Every issue the Maker can fix before PFMS sees the advice, keyed to its step and input.
 * Returned in step order, so the first one is the first thing to fix.
 */
export function validateAdvice(advice: PaymentAdvice, ctx: AdviceContext): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  const cfg = configFor(ctx.configs, advice.schemeCode);
  const m = ctx.masters;

  // Scheme readiness — nothing else matters if PFMS has no code for the scheme (§9).
  if (!cfg || !cfg.pfmsSchemeCode) {
    out.push({ step: "header", field: "hdr-scheme", message: "PFMS has not yet allotted a scheme code for this scheme. The advice cannot be sent until the Bureau records one." });
  }
  if (mastersStale(m, ctx.now)) {
    out.push({ step: "header", field: "hdr-masters", message: "The PFMS master data is more than a day old. Ask the Bureau to refresh it before submitting." });
  }

  // Header (FR-PDM-003, FR-MDM-004).
  const ddo = m.ddos.find((d) => d.code === advice.header.ddoCode);
  if (!advice.header.ddoCode) out.push({ step: "header", field: "hdr-ddo", message: "Choose the DDO." });
  else if (!ddo) out.push({ step: "header", field: "hdr-ddo", message: "This DDO is not in the PFMS master data. Choose another, or ask the Bureau to refresh the master data." });
  else if (!ddo.eBillActive) out.push({ step: "header", field: "hdr-ddo", message: "This DDO is not activated for e-Bills at PFMS and cannot receive an e-Sanction. Choose another DDO." });
  else if (cfg && !cfg.ddoCodes.includes(ddo.code)) out.push({ step: "header", field: "hdr-ddo", message: "This DDO does not pay this scheme. Choose a DDO configured for the scheme." });

  const pd = m.pdCodes.find((p) => p.code === advice.header.pdCode);
  if (!advice.header.pdCode) out.push({ step: "header", field: "hdr-pd", message: "Choose the division code." });
  else if (!pd || pd.ddoCode !== advice.header.ddoCode) out.push({ step: "header", field: "hdr-pd", message: "This division code is not mapped to the chosen DDO. Choose a code listed for the DDO." });

  if (advice.header.npbDate && advice.header.npbDate < advice.header.billDate) {
    out.push({ step: "header", field: "hdr-npb", message: "The Not Payable Before date cannot be earlier than the bill date." });
  }

  // Heads of account (FR-PDM-004, FR-HOA-001).
  if (advice.heads.length === 0) out.push({ step: "heads", field: "heads-add", message: "Add at least one head of account." });
  advice.heads.forEach((h, i) => {
    const n = advice.heads.length > 1 ? ` on head ${i + 1}` : "";
    if (!h.functionHead) out.push({ step: "heads", field: `head-${i}-function`, message: `Choose the Function Head${n}.` });
    if (!h.objectHead) out.push({ step: "heads", field: `head-${i}-object`, message: `Choose the Object Head${n}.` });
    if (!h.category) out.push({ step: "heads", field: `head-${i}-category`, message: `Choose the Category${n}.` });
    if (!h.grantNumber) out.push({ step: "heads", field: `head-${i}-grant`, message: `Choose the Grant Number${n}.` });
    if (h.functionHead && h.objectHead && h.category && h.grantNumber && cfg) {
      const allowed = cfg.heads.some((c) => c.functionHead === h.functionHead && c.objectHead === h.objectHead && c.category === h.category && c.grantNumber === h.grantNumber);
      if (!allowed) out.push({ step: "heads", field: `head-${i}-function`, message: `This head of account${n} is not configured for the scheme.` });
    }
    if (!(h.amount > 0)) out.push({ step: "heads", field: `head-${i}-amount`, message: `Enter the amount${n}.` });
  });
  const headTotal = sumHeads(advice.heads);
  if (advice.heads.length > 0 && headTotal !== advice.sanctionAmount) {
    out.push({ step: "heads", field: "heads-total", message: "The amounts against the heads of account must add up to the sanction amount." });
  }
  if (advice.heads.some((h) => h.objectHead === "33") && !advice.header.cnaExceptionReason) {
    out.push({ step: "heads", field: "hdr-cna", message: "Object Head 33 needs a CNA exception reason." });
  }

  // Beneficiaries (FR-PDM-007, BR-NGO-001).
  advice.beneficiaries.forEach((b, i) => {
    if (!PAYEE_CODE.test(b.payeeCode)) out.push({ step: "beneficiary", field: `ben-${i}-payee`, message: "The NGO's PFMS payee code is missing or not in the PFMS format." });
    if (!b.accountLast4) out.push({ step: "beneficiary", field: `ben-${i}-account`, message: "The NGO's bank account is not on record." });
    if (!IFSC.test(b.ifsc)) out.push({ step: "beneficiary", field: `ben-${i}-ifsc`, message: "The IFSC is not in the 11-character format." });
    if (!(b.gross > 0)) out.push({ step: "beneficiary", field: `ben-${i}-gross`, message: "Enter the gross amount." });
    if (netOf(b) <= 0) out.push({ step: "beneficiary", field: `ben-${i}-gross`, message: "Deductions cannot exceed the gross amount." });
    if (!b.remarks.trim()) out.push({ step: "beneficiary", field: `ben-${i}-remarks`, message: "Enter the payee remarks. PFMS prints them on the payment." });
    else if (b.remarks.length > REMARKS_MAX) out.push({ step: "beneficiary", field: `ben-${i}-remarks`, message: `Payee remarks can be ${REMARKS_MAX} characters at most.` });
  });
  const gross = advice.beneficiaries.reduce((s, b) => s + b.gross, 0);
  if (advice.beneficiaries.length > 0 && gross !== advice.sanctionAmount) {
    out.push({ step: "beneficiary", field: "ben-total", message: "The gross amount payable must equal the sanction amount." });
  }

  // Documents (FR-PDM-009, BR-DOC-001). Claim and Sanction are the floor wherever the sanction
  // lands; a DDO that lands it further up adds to them.
  const have = new Set(advice.documents.filter((d) => d.hash).map((d) => d.type));
  for (const t of requiredDocTypes(ddo?.landing ?? "Approved")) {
    if (!have.has(t)) out.push({ step: "documents", field: `doc-type-${t}`, message: `Upload the ${DOCUMENT_TYPES[t]} document.` });
  }

  return out;
}

export function issuesAt(issues: readonly ValidationIssue[], step: AdviceStep): ValidationIssue[] {
  return issues.filter((i) => i.step === step);
}

/* ── Moving the advice ────────────────────────────────────────────────────── */

const event = (at: string, kind: AdviceEvent["kind"], text: string, by?: RoleId): AdviceEvent => ({ at, kind, by, text });

/** Only a draft, a returned advice or one PFMS did not accept can be edited (FR-PDM-011). */
export function isEditable(advice: Pick<PaymentAdvice, "state">): boolean {
  return advice.state === "draft" || advice.state === "returned" || advice.state === "not-accepted";
}

/** Save as draft (FR-PDM-010): no validation, the advice stays with the Maker. */
export function saveDraft(advice: PaymentAdvice, patch: Partial<Pick<PaymentAdvice, "header" | "heads" | "beneficiaries" | "documents">>, by: RoleId, now: string): AdviceResult {
  if (!isEditable(advice)) return { ok: false, error: "This payment advice is with the Checker or PFMS and cannot be edited." };
  const next: PaymentAdvice = { ...advice, ...patch, updatedAt: now };
  // A bill number is generated the moment a DDO is chosen, and kept unless the DDO changes (FR-PDM-005).
  return { ok: true, advice: next };
}

/** Assign one pool number per beneficiary that has none (FR-PDM-008, BR-SNC-005). */
export function assignClaimReferences(
  advice: PaymentAdvice,
  pool: readonly ClaimReferenceBatch[],
  used: ReadonlySet<string>,
): { advice: PaymentAdvice; drawn: string[] } | { error: string } {
  const fy = pfmsFinancialYear(advice.financialYear);
  const free = pool.filter((b) => b.pdCode === advice.header.pdCode && b.financialYear === fy).flatMap((b) => b.numbers).filter((n) => !used.has(n));
  const needs = advice.beneficiaries.filter((b) => !b.claimReference).length;
  if (free.length < needs) return { error: "The Claim Reference Number pool for this division code is empty. Ask the Bureau to draw a fresh batch from PFMS." };
  const drawn: string[] = [];
  const beneficiaries = advice.beneficiaries.map((b) => {
    if (b.claimReference) return b;
    const n = free[drawn.length]!;
    drawn.push(n);
    return { ...b, claimReference: n };
  });
  return { advice: { ...advice, beneficiaries }, drawn };
}

/** Submit for Authorisation (FR-PDM-011). Locks the advice until the Checker returns it. */
export function submitAdvice(advice: PaymentAdvice, by: RoleId, ctx: AdviceContext, pool: readonly ClaimReferenceBatch[], used: ReadonlySet<string>): AdviceResult {
  if (!isEditable(advice)) return { ok: false, error: "This payment advice has already been submitted." };
  const issues = validateAdvice(advice, ctx);
  if (issues.length > 0) return { ok: false, error: `${issues.length === 1 ? "One thing needs" : `${issues.length} things need`} attention before this can be submitted.`, issues };
  const assigned = assignClaimReferences(advice, pool, used);
  if ("error" in assigned) return { ok: false, error: assigned.error };
  const resubmission = advice.state !== "draft";
  return {
    ok: true,
    advice: {
      ...assigned.advice,
      state: "submitted",
      submittedAt: ctx.now,
      updatedAt: ctx.now,
      issues: [],
      history: [
        ...advice.history,
        event(ctx.now, "submitted", resubmission ? "Corrected and submitted to the Checker again." : "Submitted to the Checker for authorisation.", by),
      ],
    },
  };
}

/** Return to Maker (FR-PDC-003). Reopens only the advice, never the sanction. */
export function returnAdvice(advice: PaymentAdvice, by: RoleId, remark: string, now: string): AdviceResult {
  if (advice.state !== "submitted") return { ok: false, error: "Only an advice awaiting authorisation can be returned." };
  const text = remark.trim();
  if (!text) return { ok: false, error: "Enter the reason for returning the advice. The Maker reads it." };
  return {
    ok: true,
    advice: {
      ...advice,
      state: "returned",
      checkerRemark: text,
      returnCount: advice.returnCount + 1,
      updatedAt: now,
      history: [...advice.history, event(now, "returned", `Returned to the Maker: ${text}`, by)],
    },
  };
}

/* ── Authorising (FR-PDC-004, BR-DSC-001) ────────────────────────────────── */

/** What the signing utility reports. `ok` is the only state that lets the Checker sign. */
export type CertificateCheck = "ok" | "no-utility" | "no-token" | "expired" | "not-designated" | "own-advice";

export const CERTIFICATE_MESSAGE: Record<Exclude<CertificateCheck, "ok">, { title: string; body: string }> = {
  "no-utility": {
    title: "Signing Utility Not Running",
    body: "The DSC signing utility is not running on this computer. Start it, then try again.",
  },
  "no-token": {
    title: "No DSC Token Found",
    body: "Insert your DSC token, then try again.",
  },
  expired: {
    title: "Certificate Has Expired",
    body: "The certificate on this token has expired. Renew it with the certifying authority before signing.",
  },
  "not-designated": {
    title: "Not the Designated Checker",
    body: "Only the officer designated as Checker for this DDO can sign its payment advices. Ask the Under Secretary to review the designation.",
  },
  "own-advice": {
    title: "You Prepared This Advice",
    body: "A payment advice must be authorised by an officer other than the one who prepared it.",
  },
};

export function certificateCheck(
  advice: Pick<PaymentAdvice, "preparedBy" | "header">,
  role: RoleId,
  designations: readonly Designation[],
  now: string,
  simulated: Exclude<CertificateCheck, "not-designated" | "own-advice" | "expired"> = "ok",
): CertificateCheck {
  if (advice.preparedBy === role) return "own-advice";
  const d = designations.find((x) => x.ddoCode === advice.header.ddoCode);
  if (!d || d.checker !== role) return "not-designated";
  if (d.certificateExpires < now.slice(0, 10)) return "expired";
  return simulated;
}

/** The outcome of the one ReceiveSanctionData call, as PFMS answered it (or failed to). */
export type TransmitOutcome =
  | { kind: "accepted" }
  | { kind: "not-accepted"; errors: { code: string; message: string }[] }
  | { kind: "queued" };

/**
 * Sign and transmit (FR-PDC-004, FR-PDC-005, FR-SNC-003). One call per bill; a second concurrent
 * submission of the same identifier is refused by the state check at the top.
 */
export function authoriseAndTransmit(
  advice: PaymentAdvice,
  signature: Signature,
  uniqueIdentifier: string,
  outcome: TransmitOutcome,
  now: string,
): AdviceResult {
  if (advice.state !== "submitted") return { ok: false, error: "This payment advice is not awaiting authorisation." };
  if (advice.requests.some((r) => r.uniqueIdentifier === uniqueIdentifier)) return { ok: false, error: "This request identifier has already been sent to PFMS." };
  const previous = latestRequest(advice);
  const request: PfmsRequest = {
    uniqueIdentifier,
    previousUniqueIdentifier: previous?.uniqueIdentifier,
    sentAt: now,
    // A validation failure creates nothing at PFMS, so a resubmission after one is still a fresh
    // bill. When "R" applies is open question 4 in the plan.
    billStatus: "F",
    outcome: outcome.kind,
    errors: outcome.kind === "not-accepted" ? outcome.errors : [],
    status: outcome.kind === "accepted" ? "Created" : undefined,
    statusAt: outcome.kind === "accepted" ? now : undefined,
    statusHistory: outcome.kind === "accepted" ? [{ status: "Created", at: now }] : [],
    payments: [],
    retries: 0,
  };
  const signed = event(now, "signed", `Authorised and digitally signed by ${signature.personName}.`, signature.by);
  const base = { ...advice, signature, requests: [...advice.requests, request], updatedAt: now };
  if (outcome.kind === "accepted") {
    return { ok: true, advice: { ...base, state: "transmitted", issues: [], history: [...advice.history, signed, event(now, "transmitted", "Received by PFMS.")] } };
  }
  if (outcome.kind === "queued") {
    return { ok: true, advice: { ...base, state: "queued", history: [...advice.history, signed, event(now, "queued", "PFMS could not be reached. The advice will be sent automatically when it can.")] } };
  }
  return {
    ok: true,
    advice: {
      ...base,
      state: "not-accepted",
      issues: outcome.errors.map((e) => ({ step: "review" as const, field: "advice-review", message: e.message, pfmsCode: e.code })),
      history: [...advice.history, signed, event(now, "not-accepted", "PFMS did not accept the advice. Nothing was created at PFMS; it is back with the Maker.")],
    },
  };
}

/** Is a PFMS-returned-and-cancelled advice beyond help? Always (BR-CAN-001). */
export function canResubmit(advice: Pick<PaymentAdvice, "state">): boolean {
  return advice.state !== "cancelled" && advice.state !== "transmitted";
}

/** A document freshly uploaded: fingerprint in, single-use view link out (FR-DOC-001, FR-DOC-002). */
export function newDocument(input: { id: string; type: DocumentTypeCode; name: string; sizeKb: number; hash: string; now: string; token: string }): AdviceDocument {
  const expires = new Date(Date.parse(input.now) + 7 * 86_400_000).toISOString();
  return {
    id: input.id,
    type: input.type,
    name: input.name,
    sizeKb: input.sizeKb,
    hash: input.hash,
    uploadedAt: input.now,
    viewLink: { token: input.token, expiresAt: expires, used: false },
  };
}

/** Fields that differ between the advice and the sanction order the Checker compares it with. */
export function divergences(advice: PaymentAdvice): string[] {
  const out: string[] = [];
  if (sumHeads(advice.heads) !== advice.sanctionAmount) out.push("heads-total");
  const gross = advice.beneficiaries.reduce((s, b) => s + b.gross, 0);
  if (gross !== advice.sanctionAmount) out.push("ben-total");
  return out;
}
