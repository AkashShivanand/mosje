/**
 * Every failure an E-Anudaan request can come back with — one entry each, and the only place the
 * words for them are written.
 *
 * This file IS the reference: there is no separate documentation page. Each entry says
 *
 *   id / code   — `id` is ours and stable; `code` is what a real service would send (HTTP status or
 *                 a named condition). NEITHER is ever put on a screen — a citizen cannot act on "503".
 *   renderIn    — where it can occur, and for each place the component it renders in:
 *                   inline   a message beside the field or the document row it concerns
 *                   summary  the ErrorSummary at the top of a form, linking to the field
 *                   banner   an Alert above the content, with the action as its button
 *                   toast    a passing notice, for a failure that costs nothing to repeat
 *                   page     the StatusScreen template, in place of a page that cannot be drawn
 *   title/body  — the words, in the register of a Government of India page. `{minutes}` is filled
 *                 from the entry's `retryAfterMinutes`, which stands in for the Retry-After a real
 *                 response carries.
 *   action      — what the reader is offered.
 *   preserved   — whether what the reader had entered is kept. Said on screen, because the first
 *                 question after "it failed" is "have I lost my work?".
 *
 * Screens never write their own copy for these: they call the one helper in
 * `components/e-anudaan/service-error.tsx`, which reads this catalogue.
 *
 * Helpdesk: the E-Anudaan helpdesk's telephone number and email are not published in any source
 * this repository holds (live portal, BRD, scheme guidelines), so the words name the helpdesk and a
 * reference number and invent no contact details. Needs a Ministry answer.
 */

/** Where in the portal a request is made. */
export type ErrorOccasion = "sign-in" | "save-draft" | "upload" | "submit" | "officer-action" | "payment" | "darpan" | "session";

export const ERROR_OCCASIONS: readonly { id: ErrorOccasion; label: string; where: string }[] = [
  { id: "sign-in", label: "Sign In", where: "The sign-in page" },
  { id: "session", label: "Session", where: "Any signed-in page" },
  { id: "darpan", label: "NGO-DARPAN Lookup", where: "Opening a grant application, and DARPAN sign-in" },
  { id: "save-draft", label: "Save Draft", where: "Save and Continue on a grant application" },
  { id: "upload", label: "Document Upload", where: "The Upload Documents step" },
  { id: "submit", label: "Submit Application", where: "Submit on the Review step" },
  { id: "officer-action", label: "Officer Decision", where: "Any decision on an officer's review screen" },
  { id: "payment", label: "Payment Status", where: "The Finance payment status page" },
] as const;

export type RenderTarget = "inline" | "summary" | "banner" | "toast" | "page";

export type ErrorActionKind =
  /** Try the same request again now. */
  | "retry"
  /** Wait `retryAfterMinutes`, then try again. */
  | "wait-retry"
  /** Contact the helpdesk quoting the reference number shown. */
  | "helpdesk"
  /** Sign in again; the page returns to where the reader was. */
  | "sign-in"
  /** Correct the named field and send again. */
  | "fix-field"
  /** Load the latest version of the page. */
  | "reload"
  /** Choose a different file. */
  | "choose-file"
  /** Go back to the reader's list or home. */
  | "go-home";

export interface CatalogueEntry {
  id: string;
  code: string;
  /** The place it occurs → the component it renders in. The keys are where it can occur. */
  renderIn: Partial<Record<ErrorOccasion, RenderTarget>>;
  title: string;
  body: string;
  action: ErrorActionKind;
  /** The button's words. */
  actionLabel: string;
  preserved: boolean;
  /** Stated under the body. Written per entry because "kept" means different things in different places. */
  preservedNote: string;
  retryAfterMinutes?: number;
}

export const ERROR_CATALOGUE: readonly CatalogueEntry[] = [
  {
    id: "network-offline",
    code: "NETWORK_OFFLINE",
    renderIn: { "sign-in": "banner", "save-draft": "banner", upload: "inline", submit: "banner", "officer-action": "banner", payment: "banner", darpan: "banner" },
    title: "No Internet Connection",
    body: "The portal could not be reached because this device is not connected to the internet.",
    action: "retry",
    actionLabel: "Try Again",
    preserved: true,
    preservedNote: "Nothing you entered has been lost. Try again once the connection is back.",
  },
  {
    id: "timeout",
    code: "REQUEST_TIMEOUT",
    renderIn: { "sign-in": "banner", "save-draft": "toast", upload: "inline", submit: "banner", "officer-action": "banner", payment: "banner", darpan: "banner" },
    title: "The Request Took Too Long",
    body: "The portal did not answer in time. This is usually a slow connection.",
    action: "retry",
    actionLabel: "Try Again",
    preserved: true,
    preservedNote: "Nothing you entered has been lost.",
  },
  {
    id: "server-error",
    code: "HTTP_5XX",
    renderIn: { "sign-in": "banner", "save-draft": "banner", upload: "inline", submit: "banner", "officer-action": "banner", payment: "page", darpan: "banner" },
    title: "Something Went Wrong on the Portal",
    body: "The portal could not complete this request. The problem is on the portal's side, not with what you entered.",
    action: "helpdesk",
    actionLabel: "Try Again",
    preserved: true,
    preservedNote: "Nothing you entered has been lost. If it happens again, contact the E-Anudaan helpdesk and quote the reference number below.",
  },
  {
    id: "session-expired",
    code: "HTTP_401",
    renderIn: { session: "page", "save-draft": "banner", upload: "banner", submit: "banner", "officer-action": "banner", payment: "page" },
    title: "Your Session Has Ended",
    body: "You were signed out because the portal was not used for some time.",
    action: "sign-in",
    actionLabel: "Sign In Again",
    preserved: true,
    preservedNote: "Your answers are kept on this device. Sign in again to continue from where you were.",
  },
  {
    id: "forbidden-role",
    code: "HTTP_403",
    renderIn: { session: "page", "officer-action": "banner", payment: "page" },
    title: "You Do Not Have Access to This",
    body: "Your account does not have permission for this page or this action.",
    action: "go-home",
    actionLabel: "Go to Your Dashboard",
    preserved: false,
    preservedNote: "Nothing was changed.",
  },
  {
    id: "not-found-withdrawn",
    code: "HTTP_404",
    renderIn: { "save-draft": "banner", submit: "banner", "officer-action": "page", payment: "page" },
    title: "This Application Is No Longer Available",
    body: "The application may have been withdrawn by the organisation or removed from the register.",
    action: "go-home",
    actionLabel: "Go to Your Applications",
    preserved: false,
    preservedNote: "Nothing was changed.",
  },
  {
    id: "conflict-stale",
    code: "HTTP_409",
    renderIn: { "save-draft": "banner", submit: "banner", "officer-action": "banner" },
    title: "This Was Changed Somewhere Else",
    body: "The application was changed in another tab or by another person after you opened it.",
    action: "reload",
    actionLabel: "Load the Latest Version",
    preserved: true,
    preservedNote: "Your changes on this page have not been sent. Load the latest version, check it, and make your changes again.",
  },
  {
    id: "validation-rejected",
    code: "HTTP_422",
    renderIn: { "sign-in": "inline", "save-draft": "summary", submit: "summary", "officer-action": "inline" },
    title: "One Answer Was Not Accepted",
    body: "The portal did not accept this answer. Check it and send it again.",
    action: "fix-field",
    actionLabel: "Go to the Answer",
    preserved: true,
    preservedNote: "Every other answer is kept.",
  },
  {
    id: "duplicate-submission",
    code: "DUPLICATE_SUBMISSION",
    renderIn: { submit: "banner", "officer-action": "banner" },
    title: "This Has Already Been Sent",
    body: "The portal has already received this. It was not sent a second time.",
    action: "go-home",
    actionLabel: "Go to Your Applications",
    preserved: true,
    preservedNote: "The earlier submission stands and nothing has been duplicated.",
  },
  {
    id: "rate-limited",
    code: "HTTP_429",
    renderIn: { "sign-in": "banner", upload: "inline", submit: "banner", darpan: "banner" },
    title: "Too Many Attempts",
    body: "Too many requests were made in a short time. Wait {minutes} minutes and try again.",
    action: "wait-retry",
    actionLabel: "Try Again",
    preserved: true,
    preservedNote: "Nothing you entered has been lost.",
    retryAfterMinutes: 5,
  },
  {
    id: "file-store-unavailable",
    code: "FILE_STORE_UNAVAILABLE",
    renderIn: { upload: "inline" },
    title: "Documents Cannot Be Received Now",
    body: "The portal cannot store documents at the moment. Try this document again in {minutes} minutes.",
    action: "wait-retry",
    actionLabel: "Try Again",
    preserved: true,
    preservedNote: "Your other documents and your answers are kept.",
    retryAfterMinutes: 15,
  },
  {
    id: "virus-scan-failed",
    code: "MALWARE_DETECTED",
    renderIn: { upload: "inline" },
    title: "This File Was Not Accepted",
    body: "The security check found a problem with this file, so it was not stored. Scan the paper document again, or save a fresh copy, and upload that.",
    action: "choose-file",
    actionLabel: "Choose Another File",
    preserved: true,
    preservedNote: "Your other documents are kept.",
  },
  {
    id: "darpan-unavailable",
    code: "DARPAN_UNAVAILABLE",
    renderIn: { darpan: "banner", "sign-in": "banner" },
    title: "NGO-DARPAN Cannot Be Reached",
    body: "The organisation's details could not be read from NGO-DARPAN. Try again in {minutes} minutes, or sign in with your username instead.",
    action: "wait-retry",
    actionLabel: "Try Again",
    preserved: true,
    preservedNote: "Details already read from NGO-DARPAN are kept.",
    retryAfterMinutes: 10,
  },
  {
    id: "pfms-unavailable",
    code: "PFMS_UNAVAILABLE",
    renderIn: { payment: "banner", "officer-action": "banner" },
    title: "PFMS Cannot Be Reached",
    body: "The payment status could not be read from the Public Financial Management System. The figures shown are as last recorded. Try again in {minutes} minutes.",
    action: "wait-retry",
    actionLabel: "Try Again",
    preserved: true,
    preservedNote: "No payment was made or changed.",
    retryAfterMinutes: 30,
  },
  {
    id: "deadline-closed",
    code: "APPLICATION_WINDOW_CLOSED",
    renderIn: { submit: "banner", "save-draft": "banner" },
    title: "Applications Are Closed",
    body: "The last date for applications under this scheme for this financial year has passed, so this application cannot be submitted.",
    action: "go-home",
    actionLabel: "Go to Your Applications",
    preserved: true,
    preservedNote: "Your draft is kept.",
  },
  {
    id: "maintenance",
    code: "HTTP_503_MAINTENANCE",
    renderIn: { "sign-in": "banner", session: "page", "save-draft": "banner", upload: "inline", submit: "banner", "officer-action": "banner", payment: "page", darpan: "banner" },
    title: "The Portal Is Under Maintenance",
    body: "Scheduled maintenance is in progress. The portal will be available again in about {minutes} minutes.",
    action: "wait-retry",
    actionLabel: "Try Again",
    preserved: true,
    preservedNote: "Nothing you entered has been lost.",
    retryAfterMinutes: 60,
  },
];

export function catalogueEntry(id: string): CatalogueEntry | undefined {
  return ERROR_CATALOGUE.find((e) => e.id === id);
}

/** The body with its wait filled in. */
export function bodyOf(entry: CatalogueEntry): string {
  return entry.body.replace("{minutes}", String(entry.retryAfterMinutes ?? ""));
}

export function entriesAt(occasion: ErrorOccasion): CatalogueEntry[] {
  return ERROR_CATALOGUE.filter((e) => e.renderIn[occasion]);
}

/**
 * A reference the reader quotes to the helpdesk. A real service returns its own request id; this
 * one is made from the time, so two failures a moment apart are told apart.
 */
export function referenceNumber(now: Date = new Date()): string {
  return `EA-${now.getTime().toString(36).toUpperCase().slice(-7)}`;
}

/* ── The simulated request layer's one-shot failure ───────────────────────── */

/** sessionStorage key: `{ id, occasion }` — the next request at that occasion fails with that entry. */
export const DEMO_FAIL_KEY = "e-anudaan.demo.fail-next";
/** Dispatched on window whenever the armed failure changes, so the dock and the screens re-read it. */
export const DEMO_FAIL_EVENT = "e-anudaan:demo-fail";

export interface ArmedFailure {
  id: string;
  occasion: ErrorOccasion;
}

interface KeyStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function storeOf(storage?: KeyStore): KeyStore | undefined {
  if (storage) return storage;
  try {
    return typeof window === "undefined" ? undefined : window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function readArmedFailure(storage?: KeyStore): ArmedFailure | null {
  try {
    const raw = storeOf(storage)?.getItem(DEMO_FAIL_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<ArmedFailure>;
    const entry = v.id ? catalogueEntry(v.id) : undefined;
    return entry && v.occasion && entry.renderIn[v.occasion] ? { id: v.id!, occasion: v.occasion } : null;
  } catch {
    return null;
  }
}

function announce() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(DEMO_FAIL_EVENT));
}

export function armFailure(failure: ArmedFailure | null, storage?: KeyStore): void {
  const s = storeOf(storage);
  try {
    if (failure) s?.setItem(DEMO_FAIL_KEY, JSON.stringify(failure));
    else s?.removeItem(DEMO_FAIL_KEY);
  } catch {
    /* storage refused: the demo control simply does nothing */
  }
  announce();
}

/**
 * The simulated API layer's one check: does THIS request fail? Returns the armed entry when it was
 * armed for this occasion, and disarms it — a failure is honoured once, so "Try Again" succeeds.
 */
export function takeFailure(occasion: ErrorOccasion, storage?: KeyStore): CatalogueEntry | null {
  const armed = readArmedFailure(storage);
  if (!armed || armed.occasion !== occasion) return null;
  armFailure(null, storage);
  return catalogueEntry(armed.id) ?? null;
}
