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
import { ROLES } from "../roles.ts";
import type {
  EAnudaanState,
  GrantApplication,
  Inspection,
  NgoProfile,
  RoleId,
} from "../types.ts";
import {
  applyAction,
  type ActionPayload,
  type ActResult,
  type Clock,
  type WorkflowAction,
} from "../workflow.ts";
import { buildSeed, SEED_NOW, SEED_SCHEMES } from "./seed.ts";

const STORAGE_KEY = "e-anudaan.store.v1";
/** Bump when the persisted shape changes; a mismatch drops and reseeds rather than crashing. */
const SCHEMA_VERSION = 1;

function seedState(): EAnudaanState {
  const { applications, ngos, inspections, notifications } = buildSeed();
  return {
    version: SCHEMA_VERSION,
    session: null,
    schemes: SEED_SCHEMES,
    ngos,
    applications,
    inspections,
    notifications,
  };
}

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
   * Create and submit a brand-new application from the wizard's answers, returning its
   * reference. Mirrors the live portal: the file lands with the Programme Division's ASO,
   * a timeline entry is written, and the applicant gets an "Application submitted" notice.
   */
  submitApplication: (input: SubmitApplicationInput) => GrantApplication;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetStore: () => void;

  findApp: (id: string) => GrantApplication | undefined;
  findNgo: (id: string) => NgoProfile | undefined;
  findInspection: (id: string) => Inspection | undefined;
}

export interface SubmitApplicationInput {
  schemeCode: string;
  financialYear: string;
  /** Every answer the wizard collected, keyed by the scheme form's field names. */
  values: Record<string, string>;
}

/**
 * The reference number the live portal mints on submit:
 *   GIA / <FY> / <SCHEME> / <LOCATION> / <serial>
 * The location segment is the institution's ADDRESS — not its district — uppercased with every
 * run of non-alphanumerics collapsed to an underscore, and cut to 30 characters. Verified by
 * submitting on the live portal 2026-08-22, which produced
 * `GIA/2026-27/SHRESHTA_M2/0531_TENEMENT_PARIKSHITLAL_HOS/83515` from an address beginning
 * "0531, Tenement, Parikshitlal Hostel, HSS, …".
 */
export function buildReference(
  schemeCode: string,
  financialYear: string,
  location: string,
  serial: number,
): string {
  const slug = location
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30)
    .replace(/_+$/, "");
  return `GIA/${financialYear}/${schemeCode.toUpperCase()}/${slug || "PROVISIONAL"}/${serial}`;
}

const Ctx = React.createContext<EAnudaanContextValue | null>(null);

export function EAnudaanProvider({ children }: { children: React.ReactNode }) {
  // Seed synchronously so the first render is never empty; localStorage overlays it on mount.
  const [state, setState] = React.useState<EAnudaanState>(seedState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as EAnudaanState;
        // A stale shape from an earlier build must not hydrate over a newer one.
        // Hydrating persisted state is exactly the "sync from an external system"
        // case the rule carves out; same pattern as tg/store/store.tsx.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed?.version === SCHEMA_VERSION) setState(parsed);
      }
    } catch {
      /* corrupt or unavailable storage — keep the fresh seed */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode — the demo still works in memory */
    }
  }, [state, hydrated]);

  const value = React.useMemo<EAnudaanContextValue>(() => {
    const findApp = (id: string) => state.applications.find((a) => a.id === id);

    return {
      state,
      hydrated,

      login: (role) => setState((s) => ({ ...s, session: role })),
      logout: () => setState((s) => ({ ...s, session: null })),

      act: (appId, action, payload = {}) => {
        const role = state.session;
        if (!role) return { ok: false, error: "You are not signed in." };
        const app = findApp(appId);
        if (!app) return { ok: false, error: `Application ${appId} not found.` };

        const res = applyAction(app, role, action, payload, liveClock());
        if (!res.ok) return res;

        const updated = res.app;
        const entry = updated.audit[updated.audit.length - 1]!;
        setState((s) => ({
          ...s,
          applications: s.applications.map((a) => (a.id === appId ? updated : a)),
          notifications: [
            {
              id: `ntf-live-${entry.id}`,
              at: entry.at,
              title: `Application ${action === "sanction" ? "sanctioned" : "updated"}`,
              body: `${ROLES[role].label} — ${entry.remarks ?? action}. (${updated.id})`,
              audience: ["ngo", role],
              applicationId: updated.id,
              read: false,
            },
            ...s.notifications,
          ],
        }));
        return res;
      },

      submitApplication: ({ schemeCode, financialYear, values }) => {
        const clock = liveClock();
        const ngo = state.ngos[0]!;
        const location =
          values.fld_institution_location ??
          values.fld_project_location ??
          values.fld_site_address ??
          ngo.district;
        const serial = 83500 + state.applications.length;
        const id = buildReference(schemeCode, financialYear, location, serial);

        const sc = Number(values.fld_beneficiaries_sc || 0);
        const other = Number(values.fld_beneficiaries_other || 0);
        const recurring = Number(values.fld_grant_recurring || 0);
        const nonRecurring = Number(values.fld_grant_non_recurring || 0);
        const total = Number(values.fld_grant_total || 0) || recurring + nonRecurring;

        const app: GrantApplication = {
          id,
          schemeCode: schemeCode.toUpperCase(),
          ngoId: ngo.id,
          institutionId: values.fld_institution_id ?? ngo.institutions[0]?.id ?? "",
          projectLabel: values.fld_project_title ?? ngo.name,
          financialYear,
          status: "Submitted",
          holder: { kind: "chain", division: "pd", grade: "aso" },
          scBeneficiaries: sc,
          otherBeneficiaries: other,
          totalBeneficiaries: Number(values.fld_total_beneficiaries || 0) || sc + other,
          recurring,
          nonRecurring,
          total,
          documents: [],
          formValues: values,
          deficiencies: [],
          queries: [],
          showCauseNotices: [],
          submittedAt: clock.now,
          updatedAt: clock.now,
          ageingDays: 0,
          audit: [
            {
              id: clock.id("aud"),
              at: clock.now,
              byRole: "ngo",
              byName: ngo.name,
              action: "submit",
              to: { kind: "chain", division: "pd", grade: "aso" },
              remarks: `Application submitted (${id})`,
            },
          ],
        };

        setState((s) => ({
          ...s,
          applications: [app, ...s.applications],
          notifications: [
            {
              id: `ntf-live-${app.audit[0]!.id}`,
              at: clock.now,
              title: "Application submitted",
              body: `Your application ${id} has been submitted and is now with the Ministry for review.`,
              audience: ["ngo"],
              applicationId: id,
              read: false,
            },
            ...s.notifications,
          ],
        }));

        return app;
      },

      markNotificationRead: (id) =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllNotificationsRead: () =>
        setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      resetStore: () => setState(seedState()),

      findApp,
      findNgo: (id) => state.ngos.find((n) => n.id === id),
      findInspection: (id) => state.inspections.find((i) => i.id === id),
    };
  }, [state, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEAnudaan(): EAnudaanContextValue {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useEAnudaan must be used inside <EAnudaanProvider>");
  return ctx;
}

export { SEED_NOW, STORAGE_KEY };
