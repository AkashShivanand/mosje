"use client";

/**
 * TgStore — the shared client-side mock store.
 *
 * One React context holds all cross-role state and persists to localStorage, so
 * an application a citizen submits survives a reload and a switch to an officer
 * login, then flows through the review state machine as each role acts on it.
 * No backend.
 */

import * as React from "react";
import {
  canTransition,
  slaRisk,
  ROLE_ACTS_ON,
  type AdminRoleId,
  type ApplicantDetails,
  type Application,
  type ApplicationType,
  type Grievance,
  type PasswordPolicy,
  type RoleId,
  type Stage,
  type TgState,
  type UserRecord,
} from "./types";
import {
  DEMO_CITIZEN_APP,
  SEED_APPLICATIONS,
  SEED_GRIEVANCES,
  SEED_PASSWORD_POLICY,
  SEED_ROLES,
  SEED_TENANTS,
  SEED_USERS,
} from "./seed";
import { STATE_CODES } from "../states";

const STORAGE_KEY = "tg.store.v1";

function seedState(): TgState {
  return {
    applications: [DEMO_CITIZEN_APP, ...SEED_APPLICATIONS],
    users: SEED_USERS,
    roles: SEED_ROLES,
    tenants: SEED_TENANTS,
    passwordPolicy: SEED_PASSWORD_POLICY,
    grievances: SEED_GRIEVANCES,
    session: null,
  };
}

export interface NewApplicationInput {
  type: ApplicationType;
  applicant: ApplicantDetails;
  viaDigiLocker: boolean;
  documents: Application["documents"];
}

interface TgContextValue {
  state: TgState;
  hydrated: boolean;
  // auth
  login: (role: RoleId) => void;
  logout: () => void;
  // citizen
  createApplication: (input: NewApplicationInput) => Application;
  createGrievance: (subject: string, category: string, detail: string) => Grievance;
  withdrawApplication: (appId: string) => boolean;
  // workflow (returns true if the transition was legal)
  transition: (appId: string, to: Stage, note?: string, byRole?: RoleId) => boolean;
  // admin config
  addUser: (user: Omit<UserRecord, "id" | "active">) => void;
  toggleUser: (id: string) => void;
  addRole: (role: string, description: string) => void;
  addTenant: (name: string, description: string) => void;
  updatePasswordPolicy: (policy: PasswordPolicy) => void;
  resetStore: () => void;
  // selectors
  findApp: (id: string) => Application | undefined;
}

const TgContext = React.createContext<TgContextValue | null>(null);

let seq = 121; // last seeded application number
let certSeq = 41000; // dedicated, monotonic certificate-number counter
const nowIso = () => new Date("2026-07-06T09:00:00.000Z").toISOString();

export function TgProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<TgState>(seedState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState(JSON.parse(raw) as TgState);
    } catch {
      /* corrupt storage — fall back to seed */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* non-fatal for a demo */
    }
  }, [state, hydrated]);

  const value = React.useMemo<TgContextValue>(() => {
    const nextAppId = () => `TG-2026-${String((seq += 1)).padStart(6, "0")}`;
    // Certificate numbers get their own monotonic counter so two approvals from
    // the same state back-to-back can never collide.
    const certNoFor = (stateName: string) => {
      const code = STATE_CODES[stateName] ?? "IN";
      return `TG/CERT/2026/${code}/${String((certSeq += 1))}`;
    };

    return {
      state,
      hydrated,
      login: (role) => setState((s) => ({ ...s, session: role })),
      logout: () => setState((s) => ({ ...s, session: null })),

      createApplication: (input) => {
        const app: Application = {
          id: nextAppId(),
          type: input.type,
          applicant: input.applicant,
          stage: "SUBMITTED",
          submittedAt: nowIso(),
          slaDaysLeft: 30,
          documents: input.documents,
          timeline: [{ stage: "SUBMITTED", at: nowIso(), byRole: "citizen" }],
          viaDigiLocker: input.viaDigiLocker,
        };
        setState((s) => ({ ...s, applications: [app, ...s.applications] }));
        return app;
      },

      createGrievance: (subject, category, detail) => {
        const g: Grievance = {
          id: `g-${(seq += 1)}`,
          subject,
          category,
          detail,
          status: "OPEN",
          raisedAt: nowIso(),
        };
        setState((s) => ({ ...s, grievances: [g, ...s.grievances] }));
        return g;
      },

      withdrawApplication: (appId) => {
        const app = state.applications.find((a) => a.id === appId);
        if (!app || ["APPROVED_SIGNED", "REJECTED", "WITHDRAWN"].includes(app.stage)) return false;
        setState((s) => ({
          ...s,
          applications: s.applications.map((a) =>
            a.id === appId
              ? { ...a, stage: "WITHDRAWN", timeline: [...a.timeline, { stage: "WITHDRAWN", at: nowIso(), byRole: "citizen", note: "Withdrawn by applicant" }] }
              : a,
          ),
        }));
        return true;
      },

      transition: (appId, to, note, byRole) => {
        const app = state.applications.find((a) => a.id === appId);
        if (!app || !canTransition(app.stage, to)) return false;
        // Separation of duties: an officer may only act on stages in their queue.
        // Central Admin is an override; a citizen may only resubmit a correction.
        const actor: RoleId = byRole ?? state.session ?? "central-admin";
        if (actor === "citizen") {
          if (!(app.stage === "CORRECTION_REQUESTED" && to === "MAKER_REVIEW")) return false;
        } else if (actor !== "central-admin" && !ROLE_ACTS_ON[actor as AdminRoleId].includes(app.stage)) {
          return false;
        }
        setState((s) => ({
          ...s,
          applications: s.applications.map((a) =>
            a.id === appId
              ? {
                  ...a,
                  stage: to,
                  certificateNo: to === "APPROVED_SIGNED" ? a.certificateNo ?? certNoFor(a.applicant.state) : a.certificateNo,
                  timeline: [...a.timeline, { stage: to, at: nowIso(), byRole: byRole ?? s.session ?? "central-admin", note }],
                }
              : a,
          ),
        }));
        return true;
      },

      addUser: (user) =>
        setState((s) => ({ ...s, users: [{ ...user, id: `u-${(seq += 1)}`, active: true }, ...s.users] })),

      toggleUser: (id) =>
        setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)) })),

      addRole: (role, description) =>
        setState((s) => ({ ...s, roles: [...s.roles, { id: `r-${(seq += 1)}`, role, description }] })),

      addTenant: (name, description) =>
        setState((s) => ({
          ...s,
          tenants: [{ id: `t-${(seq += 1)}`, name, description, date: "06-07-2026" }, ...s.tenants],
        })),

      updatePasswordPolicy: (policy) => setState((s) => ({ ...s, passwordPolicy: policy })),

      resetStore: () => setState(seedState()),

      findApp: (id) => state.applications.find((a) => a.id === id),
    };
  }, [state, hydrated]);

  return <TgContext.Provider value={value}>{children}</TgContext.Provider>;
}

export function useTg(): TgContextValue {
  const ctx = React.useContext(TgContext);
  if (!ctx) throw new Error("useTg must be used within <TgProvider>");
  return ctx;
}

/** Recompute SLA risk for display (kept out of stored state so it stays fresh). */
export { slaRisk };
