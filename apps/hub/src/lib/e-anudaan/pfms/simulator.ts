/**
 * PFMS, simulated. The prototype has no PFMS to call, so these functions answer the way the BRD
 * says PFMS answers (§5.6–5.7, §8.5, Annexure C) — accepted, refused with error codes, silent
 * (timeout), progressing through bill, pass order and payment, or returned and cancelled.
 *
 * They exist so every state a Maker, a Checker and an NGO can meet is on screen and can be walked
 * from the demo rail. Nothing here is reached in production; the real client is NeGD's build
 * (§3.1 D). A reviewer who sees "Paid" on this prototype has seen a design, not a payment.
 */

import type { BeneficiaryPayment, PaymentAdvice, PfmsRequest, PfmsStatus } from "./types.ts";
import type { TransmitOutcome } from "./advice.ts";
import { PFMS_HAPPY_PATH, latestRequest, allCredited, statusText } from "./stages.ts";
import { netOf } from "./advice.ts";
import { pfmsError } from "./errors.ts";

/** What the demo rail can force the next transmission to do. */
export type ForcedOutcome = "accept" | "not-accepted" | "duplicate-bill" | "timeout";

export function simulateTransmit(forced: ForcedOutcome = "accept"): TransmitOutcome {
  switch (forced) {
    case "not-accepted": {
      const e = pfmsError("ERRSNC31");
      return { kind: "not-accepted", errors: [{ code: e.code, message: e.message }] };
    }
    case "duplicate-bill": {
      const e = pfmsError("ERRSNC44");
      return { kind: "not-accepted", errors: [{ code: e.code, message: e.message }] };
    }
    case "timeout":
      return { kind: "queued" };
    default:
      return { kind: "accepted" };
  }
}

type Ids = { utr: () => string; token: () => string; voucher: () => string };

function withStatus(req: PfmsRequest, status: PfmsStatus, at: string): PfmsRequest {
  return { ...req, status, statusAt: at, statusHistory: [...req.statusHistory, { status, at }] };
}

function replaceLatest(advice: PaymentAdvice, req: PfmsRequest): PaymentAdvice["requests"] {
  return [...advice.requests.slice(0, -1), req];
}

export type AdvanceResult = { advice: PaymentAdvice; credited: boolean } | { error: string };

/**
 * Move the latest request one stage along the happy path, filling in what PFMS returns at each:
 * the bill and token at `BillGenerated` (GetSanctionBillDetails), payments pending at
 * `DSCBatchGenerated`, the voucher and every beneficiary's UTR at `DigitalSignatoryLast`
 * (GetSanctionVoucherDetails, GetPayeeEPaymentDetails), then `Closed`.
 *
 * `credited` is true exactly once — on the step that captured the last UTR — which is the one and
 * only moment the NGO is told anything (FR-NTF-001).
 */
export function advanceRequest(advice: PaymentAdvice, now: string, ids: Ids): AdvanceResult {
  if (advice.state !== "transmitted") return { error: "Only an advice PFMS has received can move on." };
  const req = latestRequest(advice);
  if (!req?.status) return { error: "PFMS has not reported a status for this advice yet." };
  const i = PFMS_HAPPY_PATH.indexOf(req.status);
  if (i < 0) return { error: "This advice is off the normal path at PFMS." };
  if (i === PFMS_HAPPY_PATH.length - 1) return { error: "PFMS has closed this sanction." };
  const nextStatus = PFMS_HAPPY_PATH[i + 1]!;
  let next = withStatus(req, nextStatus, now);
  const history = [...advice.history];
  const day = now.slice(0, 10);

  if (nextStatus === "BillGenerated") {
    next = { ...next, bill: { billNumber: advice.header.billNumber, billDate: day, tokenNumber: ids.token(), tokenDate: day } };
    history.push({ at: now, kind: "status", text: `Bill ${advice.header.billNumber} generated at the DDO.` });
  } else if (nextStatus === "DSCBatchGenerated") {
    const payments: BeneficiaryPayment[] = advice.beneficiaries.map((b) => ({ beneficiaryId: b.id, payeeCode: b.payeeCode, amount: netOf(b), scrollStatus: "Pending" }));
    next = { ...next, payments };
    history.push({ at: now, kind: "status", text: "Passed by the PAO; payment sent to the bank." });
  } else if (nextStatus === "DigitalSignatoryLast") {
    next = {
      ...next,
      voucher: { number: ids.voucher(), date: day },
      payments: next.payments.map((p) => ({ ...p, utr: ids.utr(), scrollStatus: "Success" as const, scrollDate: day })),
    };
    history.push({ at: now, kind: "credited", text: "Credit confirmed by the bank; UTR recorded for every beneficiary." });
  } else if (nextStatus === "Closed") {
    history.push({ at: now, kind: "status", text: "Sanction closed at PFMS." });
  } else {
    history.push({ at: now, kind: "status", text: statusText(nextStatus) });
  }

  const credited = !allCredited(req) && allCredited(next);
  return { advice: { ...advice, requests: replaceLatest(advice, next), updatedAt: now, history }, credited };
}

/** A bill returned by a higher level and cancelled at the landing interface (§8.5, BR-CAN-001). */
export function returnAndCancel(advice: PaymentAdvice, reason: string, now: string): AdvanceResult {
  if (advice.state !== "transmitted") return { error: "Only an advice PFMS has received can be returned." };
  const req = latestRequest(advice);
  if (!req) return { error: "Nothing has been sent to PFMS." };
  if (allCredited(req)) return { error: "The grant has already been credited." };
  let next = withStatus(req, "ReturnedByPAO", now);
  next = withStatus(next, "Cancelled", now);
  next = { ...next, returnReason: reason };
  return {
    advice: {
      ...advice,
      state: "cancelled",
      requests: replaceLatest(advice, next),
      updatedAt: now,
      history: [...advice.history, { at: now, kind: "cancelled", text: `Returned by the PAO and cancelled at PFMS: ${reason}` }],
    },
    credited: false,
  };
}

/** A queued request resent automatically once PFMS answers again (NFR §6.2). */
export function resendQueued(advice: PaymentAdvice, now: string, uniqueIdentifier: string): AdvanceResult {
  if (advice.state !== "queued") return { error: "This advice is not waiting to be resent." };
  const prev = latestRequest(advice)!;
  const req: PfmsRequest = {
    ...prev,
    uniqueIdentifier,
    previousUniqueIdentifier: prev.uniqueIdentifier,
    sentAt: now,
    outcome: "accepted",
    status: "Created",
    statusAt: now,
    statusHistory: [{ status: "Created", at: now }],
    retries: prev.retries + 1,
  };
  return {
    advice: {
      ...advice,
      state: "transmitted",
      requests: [...advice.requests, req],
      updatedAt: now,
      history: [...advice.history, { at: now, kind: "resent", text: "Sent again automatically and received by PFMS." }],
    },
    credited: false,
  };
}
