/**
 * The receiving desk for the two requests an NGO raises about a project: a new bank account and
 * a new address.
 *
 * On the NGO side both requests existed and said they stayed "Under Examination" until the
 * Ministry decided, while no officer screen could decide them (parity inventory §36, §40). The
 * live portal gives the bank change to the Joint Secretary, Programme Division ("SHRESHTA Mode-2 —
 * Project Bank-Account Change") and the location change to the PMU ("Project Location Change").
 *
 * Pure functions over the store's state, so the officer's decision, the account history and the
 * NGO's notice are one change and can be tested without React.
 */

import { ROLES } from "./roles.ts";
import { CHANGE_REQUEST_DECISION } from "./glossary.ts";
import { checkLocation, type LocationCheck } from "./district-centres.ts";
import type {
  BankChangeRequest,
  ChangeRequest,
  EAnudaanState,
  Institution,
  LocationChangeRequest,
  NgoProfile,
  NotificationEntry,
  ProjectAccount,
  RoleId,
} from "./types.ts";

const BASE = "/portals/e-anudaan";

export interface ChangeClock {
  now: string;
  id: (prefix: string) => string;
}

/** The project a request names, and the organisation that runs it. */
export function projectOwner(state: EAnudaanState, projectId: string): { ngo: NgoProfile; project: Institution } | undefined {
  for (const ngo of state.ngos) {
    const project = ngo.institutions.find((i) => i.id === projectId);
    if (project) return { ngo, project };
  }
  return undefined;
}

/**
 * The project's address as the Ministry holds it: the last verified move, or the address it was
 * registered with. The NGO's page and the PMU's desk read this one expression.
 */
export function currentAddressOf(state: EAnudaanState, projectId: string): string {
  const moved = state.changeRequests
    .filter((r): r is LocationChangeRequest => r.kind === "location" && r.projectId === projectId && r.status === "Approved")
    .sort((a, b) => Date.parse(b.decidedAt ?? b.submittedAt) - Date.parse(a.decidedAt ?? a.submittedAt))[0];
  if (moved) return moved.address;
  const p = projectOwner(state, projectId)?.project;
  return p ? `${p.name}, ${p.district}, ${p.state} ${p.pin}` : "";
}

export type QueueView = "Pending" | "All";

function queue<T extends ChangeRequest>(requests: T[], view: QueueView): T[] {
  if (view === "Pending") {
    // A queue is worked oldest first.
    return requests.filter((r) => r.status === "Pending").sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt));
  }
  return [...requests].sort((a, b) => Date.parse(b.decidedAt ?? b.submittedAt) - Date.parse(a.decidedAt ?? a.submittedAt));
}

export function bankChangeQueue(state: EAnudaanState, view: QueueView): BankChangeRequest[] {
  return queue(state.changeRequests.filter((r): r is BankChangeRequest => r.kind === "bank"), view);
}

export function locationChangeQueue(state: EAnudaanState, view: QueueView): LocationChangeRequest[] {
  return queue(state.changeRequests.filter((r): r is LocationChangeRequest => r.kind === "location"), view);
}

/** Is the position recorded with a move inside the project's own district? */
export function locationCheckFor(state: EAnudaanState, request: LocationChangeRequest): LocationCheck {
  const project = projectOwner(state, request.projectId)?.project;
  if (!project) return { kind: "unchecked" };
  return checkLocation(project, request);
}

/** The words each outcome is shown in, to the officer and the NGO alike. */
/**
 * A change request's decision in the glossary's two words (audit N-19). A location change read
 * "Verified", which is an officer's verdict on a document, not a decision; the bank desk said
 * "Rejected" and the location desk "Returned" for the same outcome — the request was not granted and
 * a new one may be raised. The stored status keeps its own value; only the words are one.
 */
export function requestStatusLabel(request: ChangeRequest): string {
  if (request.status === "Pending") return "Under Examination";
  if (request.status === "Approved") return CHANGE_REQUEST_DECISION.approved;
  return CHANGE_REQUEST_DECISION.notApproved;
}

export function requestStatusTone(request: ChangeRequest): "warning" | "success" | "danger" | "neutral" {
  if (request.status === "Pending") return "warning";
  if (request.status === "Approved") return "success";
  if (request.status === "Rejected") return "danger";
  return "neutral";
}

/** Who may decide this kind of request. */
export function deciderCap(request: ChangeRequest): "approveBankChange" | "verifyLocationChange" {
  return request.kind === "bank" ? "approveBankChange" : "verifyLocationChange";
}

/** The desk a new request of this kind lands on, for the notice the officer gets. */
function deskOf(kind: ChangeRequest["kind"]): { role: RoleId; href: string } {
  return kind === "bank"
    ? { role: "pd-js", href: `${BASE}/dashboard/sm2/bank-changes` }
    : { role: "pmu-field", href: `${BASE}/dashboard/pmu/location-changes` };
}

/** The officer's notice that a request has arrived. */
export function requestRaisedNotice(request: ChangeRequest): NotificationEntry {
  const desk = deskOf(request.kind);
  return {
    id: `ntf-${request.id}`,
    at: request.submittedAt,
    title: request.kind === "bank" ? "Bank Account Change Requested" : "Project Location Change Requested",
    body: `Project ${request.projectId} — ${request.reason.trim().replace(/[.\s]+$/, "")}.`,
    audience: [desk.role],
    href: desk.href,
    readBy: [],
  };
}

export type ChangeDecision = "approve" | "reject";

export type DecideResult = { ok: true; state: EAnudaanState; request: ChangeRequest } | { ok: false; error: string };

/**
 * Record the officer's decision on a pending request.
 *
 *   Bank account — approve: the requested account becomes the project's account from today, and
 *   the one it replaces is closed and kept on record, never deleted. Reject: nothing changes.
 *   Location — verify: the requested address becomes the project's address. Return: the request
 *   goes back to the NGO, which may raise a corrected one.
 *
 * Remarks are required either way: the NGO is shown them with the outcome.
 */
export function decideChangeRequest(
  state: EAnudaanState,
  requestId: string,
  decision: ChangeDecision,
  remarks: string,
  by: RoleId,
  clock: ChangeClock,
): DecideResult {
  const request = state.changeRequests.find((r) => r.id === requestId);
  if (!request) return { ok: false, error: "This request is no longer in the register." };
  if (!ROLES[by]?.caps.includes(deciderCap(request))) return { ok: false, error: "You cannot decide this request." };
  if (request.status !== "Pending") return { ok: false, error: "This request has already been decided." };
  const note = remarks.trim();
  if (!note) return { ok: false, error: "Enter your remarks. The NGO is shown them with the decision." };

  const status: ChangeRequest["status"] = decision === "approve" ? "Approved" : request.kind === "bank" ? "Rejected" : "Returned";
  const decided = { ...request, status, decidedAt: clock.now, decidedBy: by, decisionRemarks: note } as ChangeRequest;

  let projectAccounts = state.projectAccounts;
  if (decided.kind === "bank" && status === "Approved") {
    const opened: ProjectAccount = {
      id: clock.id("acct"),
      projectId: decided.projectId,
      bank: decided.bank,
      branch: decided.branch,
      last4: decided.last4,
      ifsc: decided.ifsc,
      pfmsRegistered: decided.pfmsRegistered,
      activeFrom: clock.now,
    };
    projectAccounts = [
      ...state.projectAccounts.map((a) => (a.projectId === decided.projectId && !a.activeTo ? { ...a, activeTo: clock.now } : a)),
      opened,
    ];
  }

  const owner = projectOwner(state, decided.projectId);
  // The applicant is told only about its own project — the signed-in organisation is the first in
  // the register, as the store's workflow notices already assume.
  const toApplicant = owner?.ngo.id === state.ngos[0]?.id;
  // The notice says what the request's own row says (requestStatusLabel).
  const decisionWord = status === "Approved" ? CHANGE_REQUEST_DECISION.approved : CHANGE_REQUEST_DECISION.notApproved;
  const title = `${decided.kind === "bank" ? "Bank Account Change" : "Project Location Change"} ${decisionWord}`;
  const notice: NotificationEntry = {
    id: `ntf-${decided.id}-decided`,
    at: clock.now,
    title,
    body: `Project ${decided.projectId} — ${note.replace(/[.\s]+$/, "")}.`,
    audience: toApplicant ? ["ngo"] : [],
    href: decided.kind === "bank" ? `${BASE}/ngo/bank-accounts` : `${BASE}/ngo/project-location-change`,
    readBy: [],
  };

  return {
    ok: true,
    request: decided,
    state: {
      ...state,
      projectAccounts,
      changeRequests: state.changeRequests.map((r) => (r.id === requestId ? decided : r)),
      notifications: notice.audience.length ? [notice, ...state.notifications] : state.notifications,
    },
  };
}
