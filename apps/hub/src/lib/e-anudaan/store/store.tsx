"use client";

/**
 * EAnudaanStore — the shared client-side mock store.
 *
 * One React context holds all cross-role state and persists to localStorage, so an application
 * an NGO submits survives a reload and a switch to an officer login, then climbs the approval
 * chain as each grade acts on it. No backend.
 *
 * `act()` is the single choke point for workflow changes: it resolves the session role, calls
 * the pure state machine, and appends the audit entry. No screen assigns `status` or `holder`.
 */

import * as React from "react";
import { useToast } from "@mosje/design-system";
import type {
  CctvSetup,
  ChangeRequest,
  DocReviewStatus,
  EAnudaanState,
  GrantApplication,
  Inspection,
  NgoProfile,
  RoleId,
  UtilisationCertificate,
} from "../types.ts";
import type { Beneficiary, Employee } from "../roster.ts";
import { decideChangeRequest as decideChange, requestRaisedNotice, type ChangeDecision } from "../change-requests.ts";
import { newInspection } from "../registers.ts";
import type { DocVerdict } from "../doc-verification.ts";
import { notificationBody, notificationTitle, notifiesApplicant } from "../applicant.ts";
import { fileApplication, type SubmitApplicationInput } from "../submit-application.ts";
import {
  applyAction,
  issueShowCauseNotice as issueNotice,
  openForClaim as openClaim,
  releaseFunds as release,
  scheduleOnlineInspection as scheduleOnline,
  type ActionPayload,
  type ActResult,
  type Clock,
  type OnlineInspectionInput,
  type ShowCauseInput,
  type WorkflowAction,
} from "../workflow.ts";
import { buildSeed, SEED_NOW, SEED_SCHEMES } from "./seed.ts";
import {
  STORAGE_KEY,
  commitChange,
  markAllReadFor,
  markReadFor,
  migrateFrom8,
  migrateFrom11,
  type PersistedState,
  readPersisted,
  writePersisted,
  type StorageLike,
} from "./persistence.ts";
/**
 * Bump when the persisted shape changes; a mismatch drops and reseeds rather than crashing,
 * unless `migrate` below can bring the older copy forward.
 *
 * 9 — notifications carry `readBy` per role instead of one `read` flag; documents carry who gave
 * the verdict (`reviewedBy`, `reviewedAt`).
 * 10 — document upload history and automatic-check records; bank and location change requests with
 * officer decisions; instalment releases; seeded 1st/2nd/3rd-instalment projects for every scheme. An
 * older copy is dropped and reseeded: it predates the projects and releases every renewal now reads,
 * so carrying it forward would show renewals with nothing to claim.
 * 11 — a `cctv` record per project (the NGO's CCTV setup, which an inspecting officer has to be
 * able to read), and the seed's own story changed (design-director audit B8, 16 Sep 2026): a
 * project's years follow the order its files were filed, a draft claim is the claim the dashboard
 * offers, corrected files are dated their correction, and submitted files answer their questions.
 * An older copy is reseeded, because it holds exactly the contradictions those rules remove.
 * 12 — a CCTV setup gains its camera register, installation certificate, retention, storage and
 * monthly uptime declarations. All optional, so an 11 copy is carried forward (`migrateFrom11`).
 */
const SCHEMA_VERSION = 12;

function seedState(): EAnudaanState {
  const seed = buildSeed();
  return {
    version: SCHEMA_VERSION,
    session: null,
    schemes: SEED_SCHEMES,
    ngos: seed.ngos,
    applications: seed.applications,
    inspections: seed.inspections,
    notifications: seed.notifications,
    projectAccounts: seed.projectAccounts,
    cctv: seed.cctv,
    changeRequests: seed.changeRequests,
    beneficiaries: seed.beneficiaries,
    employees: seed.employees,
  };
}

/** An earlier build's copy, brought forward so the applicant's own work on this device survives. */
// Schema 8 → 9 stays available for a copy that is exactly 8; it is not applied to 10 (see above).
const migrate = (old: PersistedState) => migrateFrom11(old, buildSeed());
void migrateFrom8;

/**
 * Runtime clock. The seeder uses its own fixed clock; this one is only reached from user
 * actions in the browser, where a real timestamp is correct and hydration is already done.
 */
let idSeq = 0;
function liveClock(): Clock {
  return {
    now: new Date().toISOString(),
    id: (prefix) => `${prefix}-live-${(++idSeq).toString().padStart(4, "0")}`,
  };
}

interface EAnudaanContextValue {
  state: EAnudaanState;
  hydrated: boolean;

  login: (role: RoleId) => void;
  logout: () => void;

  /** The single workflow entry point. Every officer and NGO action button calls this. */
  act: (appId: string, action: WorkflowAction, payload?: ActionPayload) => ActResult;

  /**
   * Create and submit a brand-new application from the wizard's answers. Mirrors the live
   * portal: the file lands with the Programme Division's ASO, a timeline entry is written, and
   * the applicant gets an "Application submitted" notice.
   *
   * Returns `ok: false` when the application could not be written to the device — and then
   * nothing is applied. The wizard shows success, and deletes the draft, only on `ok: true`.
   */
  submitApplication: (input: SubmitApplicationInput) => SubmitResult;

  /**
   * Replace an uploaded document. The earlier file is kept as a version — the department asked
   * that a replaced file is never lost (review call, T83–92).
   */
  replaceDocument: (appId: string, docId: string, file: { name: string; sizeKb: number }, note?: string) => void;
  /** The automatic check's verdict on a document's current file, when the check answers. */
  recordDocumentCheck: (appId: string, docId: string, fileName: string, verdict: DocVerdict) => void;
  /** Attach a file to the officer's review (Officer Supporting Documents). */
  addOfficerDocument: (appId: string, file: { name: string; sizeKb: number; title?: string }) => void;
  removeOfficerDocument: (appId: string, id: string) => void;
  /**
   * The officer's verdict on one document, and its reason. Saved as it is chosen: it lived only
   * in the review screen, so a refresh erased it and a deficiency could not be built from it
   * (screen audit, 14 Sep 2026).
   */
  reviewDocument: (appId: string, docId: string, status: DocReviewStatus, remarks: string) => void;
  /** Record the applicant's correction of one deficiency item. */
  correctDeficiencyItem: (appId: string, itemId: string, response: string, value?: string) => void;
  /** Raise a location or bank-account change request for a project. */
  submitChangeRequest: (request: Omit<ChangeRequest, "id" | "submittedAt" | "status">) => ChangeRequest;
  addBeneficiary: (b: Omit<Beneficiary, "id">) => void;
  setBeneficiaryActive: (id: string, active: boolean) => void;
  addEmployee: (e: Omit<Employee, "id">) => void;
  setEmployeeActive: (id: string, active: boolean) => void;
  /** Schedule or record a PMU inspection — replaces the inspection with the same id. */
  saveInspection: (next: Inspection) => void;
  /**
   * Register (or change) the CCTV at one project. Replaces that project's record, so a project
   * never carries two. The officer's e-inspection reads the same record.
   */
  saveCctv: (setup: CctvSetup) => void;
  /** Raise a new inspection on a sanctioned file (PMU "Inspect"). Returns the inspection raised. */
  raiseInspection: (applicationId: string) => Inspection | undefined;
  /**
   * Raise a location or bank-account change request AND tell the desk that decides it — the
   * Joint Secretary for a bank account, the PMU for a location. Returns the request.
   */
  raiseChangeRequest: (request: Omit<ChangeRequest, "id" | "submittedAt" | "status">) => ChangeRequest;
  /** The deciding officer's approval (or verification) or rejection (or return), with remarks. */
  decideChangeRequest: (requestId: string, decision: ChangeDecision, remarks: string) => { ok: true } | { ok: false; error: string };
  /** File the utilisation certificate on a sanctioned application. */
  fileUtilisationCertificate: (appId: string, uc: Omit<UtilisationCertificate, "filedAt">) => { ok: true } | { ok: false; error: string };

  /** PD:US — release a sanctioned claim's funds. */
  releaseFunds: (appId: string) => ActResult;
  /** PD:US — open the instalment after a released one for the NGO to claim. `nextLabel`: "2nd Instalment". */
  openForClaim: (appId: string, nextLabel: string) => ActResult;
  /** PD:SO / PD:JS — issue a Show Cause Notice. */
  issueShowCauseNotice: (appId: string, input: ShowCauseInput) => ActResult;
  /** Schedule an online (BharatVC) inspection from the review screen. */
  scheduleOnlineInspection: (appId: string, input: OnlineInspectionInput) => ActResult;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetStore: () => void;

  findApp: (id: string) => GrantApplication | undefined;
  findNgo: (id: string) => NgoProfile | undefined;
  findInspection: (id: string) => Inspection | undefined;
  /** The CCTV registered at a project, if the NGO has set it up. */
  findCctv: (projectId: string) => CctvSetup | undefined;
}

export type { SubmitApplicationInput };
export type SubmitResult = { ok: true; app: GrantApplication } | { ok: false; error: string };

// The reference number is minted in `applicant.ts` (`buildReference`, `nextReferenceSerial`,
// `districtOfProject`) so it can be tested without React. Re-exported for existing importers.
export { buildReference } from "../applicant.ts";

const Ctx = React.createContext<EAnudaanContextValue | null>(null);

/** The browser's storage, or nothing where there is none (server render, blocked site data). */
function browserStorage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/**
 * The notice for an act that leaves the file where it is: to the officer who did it, to the NGO
 * where the act concerns the NGO and the file is the signed-in applicant's own, and to `also`.
 */
function stayNotice(s: EAnudaanState, app: GrantApplication, role: RoleId, also: RoleId[] = []) {
  const entry = app.audit[app.audit.length - 1]!;
  return {
    id: `ntf-live-${entry.id}`,
    at: entry.at,
    title: notificationTitle(entry.action),
    body: notificationBody(app.id, entry.remarks),
    audience: [...new Set<RoleId>([role, ...also, ...(app.ngoId === s.ngos[0]?.id && notifiesApplicant(entry.action) ? (["ngo"] as RoleId[]) : [])])],
    applicationId: app.id,
    readBy: [],
  };
}

export function EAnudaanProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  // Seed synchronously so the first render is never empty; localStorage overlays it on mount.
  const [state, setState] = React.useState<EAnudaanState>(seedState);
  const [hydrated, setHydrated] = React.useState(false);
  /**
   * The copy every change is applied to, and the revision it was read or written at. Refs, not
   * state: two changes in one event must chain, and a render has not happened between them.
   */
  const stateRef = React.useRef(state);
  const revRef = React.useRef(0);

  const adopt = React.useCallback((next: EAnudaanState, rev: number) => {
    stateRef.current = next;
    revRef.current = rev;
    setState(next);
  }, []);

  React.useEffect(() => {
    const storage = browserStorage();
    const stored = storage ? readPersisted(storage.getItem(STORAGE_KEY), SCHEMA_VERSION, migrate) : null;
    if (stored) {
      // Hydrating persisted state is exactly the "sync from an external system" case the rule
      // carves out; same pattern as tg/store/store.tsx. A copy from an earlier build is read only
      // when `migrate` can bring it forward; otherwise the fresh seed stands.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      adopt(stored.state, stored.rev);
      // A migrated copy is written back at the same revision, so every tab reads this shape from now on.
      if (stored.migrated && storage) writePersisted(storage, STORAGE_KEY, stored.state, stored.rev);
    } else if (storage) {
      // First visit, or an older shape: write the seed so every tab starts from one copy.
      writePersisted(storage, STORAGE_KEY, stateRef.current, 0);
    }
    setHydrated(true);

    /**
     * Another tab wrote. Its copy is newer than ours, so it is the one to show — without this a
     * tab left open kept an older register on screen, and its next write replaced the newer one.
     * The session stays this tab's own.
     */
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.storageArea !== window.localStorage) return;
      const fresh = readPersisted(e.newValue, SCHEMA_VERSION);
      if (!fresh || fresh.rev <= revRef.current) return;
      adopt({ ...fresh.state, session: stateRef.current.session }, fresh.rev);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [adopt]);

  /**
   * The single write path. Applies `update` to the newest copy, writes it, and shows it only if
   * the write landed. Returns whether it did, so a caller that must not report success on a
   * failed save (the wizard's Submit) can say so.
   */
  const commit = React.useCallback(
    (update: (base: EAnudaanState) => EAnudaanState): { ok: true } | { ok: false; error: string } => {
      const storage = browserStorage();
      if (!storage) {
        // No storage at all (private mode with site data blocked): the demo runs in memory.
        adopt(update(stateRef.current), revRef.current);
        return { ok: true };
      }
      const res = commitChange(storage, STORAGE_KEY, SCHEMA_VERSION, stateRef.current, revRef.current, update);
      if (!res.ok) {
        if (res.fresh) adopt(res.fresh.state, res.fresh.rev);
        return { ok: false, error: res.error };
      }
      adopt(res.state, res.rev);
      if (res.rebased) toast("This page was updated in another tab. Your change was added to the latest version.", "info");
      return { ok: true };
    },
    [adopt, toast],
  );

  /** For changes whose callers do not check a result: a failed save is still said, never silent. */
  const run = React.useCallback(
    (update: (base: EAnudaanState) => EAnudaanState) => {
      const res = commit(update);
      if (!res.ok) toast(res.error, "error");
    },
    [commit, toast],
  );

  const value = React.useMemo<EAnudaanContextValue>(() => {
    const findApp = (id: string) => state.applications.find((a) => a.id === id);

    /** One write for an act outside the chain: the file, an inspection it raised, and the notice. */
    const outsideChain = (
      appId: string,
      apply: (app: GrantApplication, role: RoleId, clock: Clock, s: EAnudaanState) => ActResult | { ok: true; app: GrantApplication; inspection: Inspection },
      also: RoleId[] = [],
    ): ActResult => {
      const role = stateRef.current.session;
      if (!role) return { ok: false, error: "You are not signed in." };
      const out: { result: ActResult } = { result: { ok: false, error: `Application ${appId} not found.` } };
      const saved = commit((s) => {
        const app = s.applications.find((a) => a.id === appId);
        if (!app) return s;
        const res = apply(app, role, liveClock(), s);
        if (!res.ok) {
          out.result = res;
          return s;
        }
        out.result = { ok: true, app: res.app };
        return {
          ...s,
          applications: s.applications.map((a) => (a.id === appId ? res.app : a)),
          inspections: "inspection" in res ? [res.inspection, ...s.inspections] : s.inspections,
          notifications: [stayNotice(s, res.app, role, also), ...s.notifications],
        };
      });
      if (!saved.ok) return { ok: false, error: saved.error };
      return out.result;
    };

    return {
      state,
      hydrated,

      login: (role) => run((s) => ({ ...s, session: role })),
      logout: () => run((s) => ({ ...s, session: null })),

      act: (appId, action, payload = {}) => {
        const role = stateRef.current.session;
        if (!role) return { ok: false, error: "You are not signed in." };
        const out: { result: ActResult } = { result: { ok: false, error: `Application ${appId} not found.` } };
        const saved = commit((s) => {
          const app = s.applications.find((a) => a.id === appId);
          if (!app) return s;
          const res = applyAction(app, role, action, payload, liveClock());
          out.result = res;
          if (!res.ok) return s;

          const updated = res.app;
          const entry = updated.audit[updated.audit.length - 1]!;
          return {
            ...s,
            applications: s.applications.map((a) => (a.id === appId ? updated : a)),
            notifications: [
              {
                id: `ntf-live-${entry.id}`,
                at: entry.at,
                title: notificationTitle(entry.action),
                body: notificationBody(updated.id, entry.remarks),
                // The applicant only for their own file and only for what concerns them, and the
                // seat the file has moved to.
                audience: [
                  ...new Set<RoleId>([
                    role,
                    ...(updated.ngoId === s.ngos[0]?.id && notifiesApplicant(entry.action) ? (["ngo"] as RoleId[]) : []),
                    ...(updated.holder.kind === "chain"
                      ? ([`${updated.holder.division}-${updated.holder.grade}`] as RoleId[])
                      : updated.holder.kind === "pd"
                        ? (["programme-director"] as RoleId[])
                        : []),
                  ]),
                ],
                applicationId: updated.id,
                readBy: [],
              },
              ...s.notifications,
            ],
          };
        });
        if (!saved.ok) return { ok: false, error: saved.error };
        return out.result;
      },

      releaseFunds: (appId) => outsideChain(appId, (app, role, clock) => release(app, role, clock)),
      openForClaim: (appId, nextLabel) => outsideChain(appId, (app, role, clock) => openClaim(app, role, nextLabel, clock)),
      issueShowCauseNotice: (appId, input) => outsideChain(appId, (app, role, clock) => issueNotice(app, role, input, clock)),
      scheduleOnlineInspection: (appId, input) =>
        outsideChain(appId, (app, role, clock, s) => {
          const res = scheduleOnline(app, role, input, s.inspections, clock);
          return res.ok ? { ok: true, app: res.app, inspection: res.inspection } : res;
        }),

      submitApplication: (input) => {
        const out: { app?: GrantApplication } = {};
        const saved = commit((s) => {
          const filed = fileApplication(s, input, liveClock());
          out.app = filed.app;
          return filed.state;
        });
        if (!saved.ok) return { ok: false, error: saved.error };
        return out.app ? { ok: true, app: out.app } : { ok: false, error: "The application could not be created." };
      },

      replaceDocument: (appId, docId, file, note) => {
        const now = new Date().toISOString();
        run((s) => ({
          ...s,
          applications: s.applications.map((a) =>
            a.id !== appId
              ? a
              : {
                  ...a,
                  updatedAt: now,
                  documents: a.documents.map((d) =>
                    d.id !== docId
                      ? d
                      : {
                          ...d,
                          versions: d.fileName
                            ? [
                                ...(d.versions ?? []),
                                {
                                  fileName: d.fileName,
                                  sizeKb: d.sizeKb,
                                  uploadedAt: d.uploadedAt,
                                  replacedAt: now,
                                  ...(d.aiVerdict && d.aiVerdict.state !== "pending" ? { verdict: d.aiVerdict.state } : {}),
                                  ...(note ? { note } : {}),
                                },
                              ]
                            : d.versions,
                          fileName: file.name,
                          sizeKb: file.sizeKb,
                          uploadedAt: now,
                          reviewStatus: "Pending",
                          // The new file is checked as any upload is; the verdict arrives by recordDocumentCheck.
                          aiVerdict: { state: "pending" },
                        },
                  ),
                },
          ),
        }));
      },

      recordDocumentCheck: (appId, docId, fileName, verdict) =>
        run((s) => ({
          ...s,
          applications: s.applications.map((a) =>
            a.id !== appId
              ? a
              : {
                  ...a,
                  // Only onto the file that was checked: a replacement made meanwhile waits for its own.
                  documents: a.documents.map((d) => (d.id === docId && d.fileName === fileName ? { ...d, aiVerdict: verdict } : d)),
                },
          ),
        })),

      addOfficerDocument: (appId, file) => {
        const clock = liveClock();
        run((s) => ({
          ...s,
          applications: s.applications.map((a) =>
            a.id !== appId
              ? a
              : {
                  ...a,
                  officerDocuments: [
                    ...(a.officerDocuments ?? []),
                    {
                      id: clock.id("odoc"),
                      title: file.title?.trim() || undefined,
                      fileName: file.name,
                      sizeKb: file.sizeKb,
                      uploadedAt: clock.now,
                      uploadedBy: s.session ?? "pd-aso",
                    },
                  ],
                },
          ),
        }));
      },

      removeOfficerDocument: (appId, id) =>
        run((s) => ({
          ...s,
          applications: s.applications.map((a) =>
            a.id !== appId ? a : { ...a, officerDocuments: (a.officerDocuments ?? []).filter((o) => o.id !== id) },
          ),
        })),

      reviewDocument: (appId, docId, status, remarks) => {
        const now = new Date().toISOString();
        run((s) => ({
          ...s,
          applications: s.applications.map((a) =>
            a.id !== appId
              ? a
              : {
                  ...a,
                  documents: a.documents.map((d) =>
                    d.id !== docId
                      ? d
                      : {
                          ...d,
                          reviewStatus: status,
                          officerRemarks: remarks.trim() || undefined,
                          // Who gave the verdict and when; a verdict set back to "Not reviewed" has neither.
                          reviewedBy: status === "Pending" ? undefined : (s.session ?? undefined),
                          reviewedAt: status === "Pending" ? undefined : now,
                        },
                  ),
                },
          ),
        }));
      },

      correctDeficiencyItem: (appId, itemId, response, value) => {
        const now = new Date().toISOString();
        run((s) => ({
          ...s,
          applications: s.applications.map((a) =>
            a.id !== appId
              ? a
              : {
                  ...a,
                  formValues:
                    value === undefined
                      ? a.formValues
                      : (() => {
                          const field = a.deficiencies.flatMap((d) => d.items ?? []).find((it) => it.id === itemId)?.fieldName;
                          return field ? { ...a.formValues, [field]: value } : a.formValues;
                        })(),
                  deficiencies: a.deficiencies.map((d) =>
                    d.respondedAt || !d.items
                      ? d
                      : {
                          ...d,
                          items: d.items.map((it) =>
                            it.id === itemId
                              ? {
                                  ...it,
                                  correctedAt: now,
                                  response: response.trim() || undefined,
                                  // The first submitted answer is kept however many times it is corrected.
                                  originalValue:
                                    it.originalValue ?? (it.fieldName && value !== undefined ? a.formValues?.[it.fieldName] : undefined),
                                }
                              : it,
                          ),
                        },
                  ),
                },
          ),
        }));
      },

      submitChangeRequest: (request) => {
        const clock = liveClock();
        const created = { ...request, id: clock.id("req"), submittedAt: clock.now, status: "Pending" } as ChangeRequest;
        run((s) => ({ ...s, changeRequests: [created, ...s.changeRequests] }));
        return created;
      },

      addBeneficiary: (b) =>
        run((s) => ({ ...s, beneficiaries: [{ ...b, id: liveClock().id("ben") }, ...s.beneficiaries] })),
      setBeneficiaryActive: (id, active) =>
        run((s) => ({ ...s, beneficiaries: s.beneficiaries.map((b) => (b.id === id ? { ...b, active } : b)) })),
      addEmployee: (e) =>
        run((s) => ({ ...s, employees: [{ ...e, id: liveClock().id("emp") }, ...s.employees] })),
      setEmployeeActive: (id, active) =>
        run((s) => ({ ...s, employees: s.employees.map((e) => (e.id === id ? { ...e, active } : e)) })),
      raiseInspection: (applicationId) => {
        const out: { insp?: Inspection } = {};
        run((s) => {
          const app = s.applications.find((a) => a.id === applicationId);
          if (!app?.sanction || s.inspections.some((i) => i.applicationId === applicationId)) return s;
          out.insp = newInspection(app, liveClock().id("insp"));
          return { ...s, inspections: [out.insp, ...s.inspections] };
        });
        return out.insp;
      },

      raiseChangeRequest: (request) => {
        const clock = liveClock();
        const created = { ...request, id: clock.id("req"), submittedAt: clock.now, status: "Pending" } as ChangeRequest;
        run((s) => ({ ...s, changeRequests: [created, ...s.changeRequests], notifications: [requestRaisedNotice(created), ...s.notifications] }));
        return created;
      },

      decideChangeRequest: (requestId, decision, remarks) => {
        const role = stateRef.current.session;
        if (!role) return { ok: false, error: "You are not signed in." };
        const out: { error?: string } = {};
        const saved = commit((s) => {
          const res = decideChange(s, requestId, decision, remarks, role, liveClock());
          if (!res.ok) {
            out.error = res.error;
            return s;
          }
          return res.state;
        });
        if (!saved.ok) return saved;
        return out.error ? { ok: false, error: out.error } : { ok: true };
      },

      fileUtilisationCertificate: (appId, uc) => {
        const out: { error?: string } = {};
        const saved = commit((s) => {
          const app = s.applications.find((a) => a.id === appId);
          if (!app?.sanction) {
            out.error = "A utilisation certificate can be filed only on a sanctioned grant.";
            return s;
          }
          const filed = { ...uc, filedAt: new Date().toISOString() };
          return { ...s, applications: s.applications.map((a) => (a.id === appId ? { ...a, utilisation: filed } : a)) };
        });
        if (!saved.ok) return saved;
        return out.error ? { ok: false, error: out.error } : { ok: true };
      },

      saveInspection: (next) =>
        run((s) => ({ ...s, inspections: s.inspections.map((i) => (i.id === next.id ? next : i)) })),

      saveCctv: (setup) =>
        run((s) => ({ ...s, cctv: [setup, ...s.cctv.filter((c) => c.projectId !== setup.projectId)] })),

      markNotificationRead: (id) =>
        run((s) => ({ ...s, notifications: markReadFor(s.notifications, id, s.session) })),

      // Only for the role that pressed it (serious audit S07), and per role: the other roles a
      // notice is addressed to still see it as new.
      markAllNotificationsRead: () =>
        run((s) => ({ ...s, notifications: markAllReadFor(s.notifications, s.session) })),

      resetStore: () => run(() => seedState()),

      findApp,
      findNgo: (id) => state.ngos.find((n) => n.id === id),
      findInspection: (id) => state.inspections.find((i) => i.id === id),
      findCctv: (projectId) => state.cctv.find((c) => c.projectId === projectId),
    };
  }, [state, hydrated, commit, run]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEAnudaan(): EAnudaanContextValue {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useEAnudaan must be used inside <EAnudaanProvider>");
  return ctx;
}

export { SEED_NOW, STORAGE_KEY };
