/**
 * Reading the payment leg: which sanctioned files are where, and what (if anything) holds them.
 *
 * One function — `paymentCase()` — answers "where is this file's payment?" for every screen:
 * the Maker's queue, the Checker's queue, the case page, the Instalments panel on the review
 * screen and the NGO's application page (.claude/rules/data-state-completeness.md §2).
 */

import type { EAnudaanState, GrantApplication } from "../types.ts";
import { accountsFor } from "../applicant.ts";
import { configFor } from "./masters.ts";
import { stageOf, type AnyStage } from "./stages.ts";
import type { BeneficiaryLine, PaymentAdvice } from "./types.ts";
import type { PfmsState } from "./seed.ts";

/** Why a sanctioned file cannot yet have a payment advice. */
export type Blocker =
  /** A legacy file with no bank details on record at all — the Bureau back-fills it (BR-BAK-001). */
  | "needs-backfill"
  /** The account exists but the NGO has not given its PFMS payee code (BR-NGO-001). */
  | "needs-payee-code"
  /** PFMS has not allotted the scheme a code (§9). */
  | "scheme-code-pending";

export const BLOCKER_TEXT: Record<Blocker, { label: string; body: string }> = {
  "needs-backfill": {
    label: "Bank Details Needed",
    body: "No bank account is on record for this project. The Bureau enters the NGO's bank details and PFMS payee code before a payment advice can be prepared.",
  },
  "needs-payee-code": {
    label: "Payee Code Needed",
    body: "The NGO has not yet given its PFMS payee code. The NGO has been asked to add it on Project Bank Accounts.",
  },
  "scheme-code-pending": {
    label: "Scheme Code Awaited",
    body: "PFMS has not yet allotted a scheme code for this scheme, so no payment advice can be sent.",
  },
};

export interface PaymentCase {
  app: GrantApplication;
  advice?: PaymentAdvice;
  stage: AnyStage;
  blocker?: Blocker;
  /** Paid before the PFMS integration: a release with no advice behind it. */
  paidBeforeIntegration: boolean;
}

export type Payee = Omit<BeneficiaryLine, "id" | "gross" | "deductions" | "remarks" | "claimReference">;

/** The NGO's payee details as the Maker would pre-fill them, or null with the reason. */
export function payeeFor(main: EAnudaanState, pfms: PfmsState, app: GrantApplication): Payee | Exclude<Blocker, "scheme-code-pending"> {
  const name = main.ngos.find((n) => n.id === app.ngoId)?.name ?? app.ngoId;
  const acct = accountsFor(main, app.institutionId).current;
  if (acct) {
    const payee = pfms.payees.find((p) => p.accountId === acct.id);
    if (!payee) return "needs-payee-code";
    return { payeeCode: payee.payeeCode, name, accountLast4: acct.last4, ifsc: acct.ifsc, bank: acct.bank, source: payee.source };
  }
  const b = pfms.backfilled.find((x) => x.projectId === app.institutionId);
  if (!b) return "needs-backfill";
  return { payeeCode: b.payeeCode, name, accountLast4: b.last4, ifsc: b.ifsc, bank: b.bank, source: "bureau" };
}

export function adviceFor(pfms: Pick<PfmsState, "advices">, appId: string): PaymentAdvice | undefined {
  return pfms.advices.find((a) => a.appId === appId);
}

export function paymentCase(main: EAnudaanState, pfms: PfmsState, app: GrantApplication): PaymentCase {
  const advice = adviceFor(pfms, app.id);
  if (advice) return { app, advice, stage: stageOf(advice), paidBeforeIntegration: false };
  if (app.release) return { app, stage: "closed", paidBeforeIntegration: true };
  const cfg = configFor(pfms.configs, app.schemeCode);
  let blocker: Blocker | undefined;
  if (!cfg?.pfmsSchemeCode) blocker = "scheme-code-pending";
  else {
    const payee = payeeFor(main, pfms, app);
    if (typeof payee === "string") blocker = payee;
  }
  return { app, stage: "awaiting-advice", blocker, paidBeforeIntegration: false };
}

/** Every sanctioned file whose payment is not finished, or finished through PFMS. */
export function paymentCases(main: EAnudaanState, pfms: PfmsState): PaymentCase[] {
  return main.applications
    .filter((a) => a.sanction && a.status !== "Rejected" && (!a.release || adviceFor(pfms, a.id)))
    .map((a) => paymentCase(main, pfms, a));
}

/** The Maker's queue, by tab (FR-PDM-001). */
export type MakerTab = "new" | "returned" | "not-accepted" | "drafts" | "held";

export function makerTab(c: PaymentCase): MakerTab | null {
  if (c.blocker) return "held";
  if (!c.advice) return "new";
  switch (c.advice.state) {
    case "draft":
      return "drafts";
    case "returned":
      return "returned";
    case "not-accepted":
      return "not-accepted";
    default:
      return null;
  }
}

export const MAKER_TABS: readonly { id: MakerTab; label: string; empty: string }[] = [
  { id: "new", label: "New", empty: "No sanctioned file is waiting for a payment advice." },
  { id: "returned", label: "Returned by Checker", empty: "No payment advice has been returned by the Checker." },
  { id: "not-accepted", label: "Not Accepted by PFMS", empty: "PFMS has accepted every payment advice sent to it." },
  { id: "drafts", label: "Drafts", empty: "No payment advice is saved as a draft." },
  { id: "held", label: "On Hold", empty: "No sanctioned file is on hold." },
];

/** The date a queue sorts by — the sanction date, oldest first (FR-PDM-001). */
export function sanctionDate(c: PaymentCase): string {
  return c.app.sanction?.sanctionedAt ?? c.app.updatedAt;
}

/** What the sanction order and cost sheet already say — pre-filled, never editable (FR-PDM-002, FR-PDC-006). */
export interface SanctionFacts {
  orderNo: string;
  sanctionedAt: string;
  amount: number;
  financialYear: string;
  /** IFD concurrence, read from the Integrated Finance Division's concurrence on the file. */
  ifdNumber: string;
  ifdDate: string;
  schemeCode: string;
  pfmsSchemeCode: string | null;
}

export function sanctionFacts(pfms: Pick<PfmsState, "configs">, app: GrantApplication): SanctionFacts | null {
  if (!app.sanction) return null;
  const concur = [...app.audit].reverse().find((e) => e.action === "concur");
  const ifdDate = concur?.at ?? app.sanction.sanctionedAt;
  // The concurrence number is not a field the approval chain records; it is derived from the
  // concurrence entry until the cost sheet carries it (illustrative, like every reference here).
  const serial = app.id.replace(/\D/g, "").slice(-5).padStart(5, "0");
  return {
    orderNo: app.sanction.orderNo,
    sanctionedAt: app.sanction.sanctionedAt,
    amount: app.sanction.total,
    financialYear: app.financialYear,
    ifdNumber: `IFD/${app.financialYear}/${serial}`,
    ifdDate,
    schemeCode: app.schemeCode,
    pfmsSchemeCode: configFor(pfms.configs, app.schemeCode)?.pfmsSchemeCode ?? null,
  };
}
