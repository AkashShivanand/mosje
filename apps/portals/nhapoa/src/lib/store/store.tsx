"use client";

/**
 * NhapoaStore — the shared client-side mock store.
 *
 * A single React context holds all cross-role state and persists to
 * localStorage, so a grievance a Citizen files survives a page reload and a
 * switch to an admin login, then flows through the status state machine as each
 * role acts on it. No backend.
 */

import * as React from "react";
import {
  canTransition,
  type AdminUserRecord,
  type Allocation,
  type Case,
  type CaseStatus,
  type Disbursement,
  type NhapoaState,
  type Rescue,
  type RoleId,
} from "./types";
import {
  GRIEVANCE_CATEGORIES,
  REF_PREFIX,
  SEED_ALLOCATIONS,
  SEED_CASES,
  SEED_DISBURSEMENTS,
  SEED_NOTIFICATIONS,
  SEED_RESCUES,
  SEED_USERS,
  STATE_CODES,
} from "./seed";

const STORAGE_KEY = "nhapoa.store.v4";

function seedState(): NhapoaState {
  return {
    cases: SEED_CASES,
    rescues: SEED_RESCUES,
    disbursements: SEED_DISBURSEMENTS,
    allocations: SEED_ALLOCATIONS,
    users: SEED_USERS,
    notifications: SEED_NOTIFICATIONS,
    categories: GRIEVANCE_CATEGORIES,
    queries: [],
    session: null,
  };
}

// ── New-entity payloads ─────────────────────────────────────────────────────

export type NewGrievanceInput = Omit<
  Case,
  "id" | "refNo" | "status" | "timeline" | "createdAt"
> & { source?: Case["source"] };

export type NewRescueInput = Omit<Rescue, "id" | "refNo" | "status" | "createdAt">;

interface NhapoaContextValue {
  state: NhapoaState;
  /** True once localStorage hydration has run — guards should wait for this. */
  hydrated: boolean;
  // auth
  login: (role: RoleId) => void;
  logout: () => void;
  // citizen / call-center
  createGrievance: (input: NewGrievanceInput) => Case;
  createRescue: (input: NewRescueInput) => Rescue;
  findByRef: (refNo: string) => Case | undefined;
  // workflow transitions (return true if the transition was legal)
  transitionCase: (caseId: string, to: CaseStatus, note?: string, byRole?: RoleId) => boolean;
  disburseCase: (caseId: string, amount: number, mode: string, beneficiary: string) => Disbursement | null;
  // admin config
  addUser: (user: Omit<AdminUserRecord, "id">) => void;
  toggleUser: (id: string) => void;
  addCategory: (name: string, slaDays: number, amountCeiling: number) => void;
  toggleCategory: (id: string) => void;
  addAllocation: (alloc: Omit<Allocation, "id" | "at">) => void;
  logQuery: (callerMobile: string, subject: string) => void;
  resolveQuery: (id: string) => void;
  markNotificationRead: (id: string) => void;
  resetStore: () => void;
}

const NhapoaContext = React.createContext<NhapoaContextValue | null>(null);

let seq = Date.now();
const nextId = (prefix: string) => `${prefix}-${(seq += 1)}`;
const nowIso = () => new Date().toISOString();

export function NhapoaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<NhapoaState>(seedState);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage once on mount. We deliberately seed on the server
  // + first client render (SSR-safe) and then sync from storage in this effect —
  // the standard hydration pattern, so the set-state-in-effect rule is disabled
  // for this specific, intentional case.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState(JSON.parse(raw) as NhapoaState);
    } catch {
      /* ignore corrupt storage — fall back to seed */
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration, so we don't clobber stored state).
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable — non-fatal for a demo */
    }
  }, [state, hydrated]);

  const value = React.useMemo<NhapoaContextValue>(() => {
    const refFor = (stateName: string) => {
      const code = STATE_CODES[stateName] ?? stateName.slice(0, 2).toUpperCase();
      return `${REF_PREFIX}/2026/${code}/${String(Math.floor(100000 + (seq % 900000)))}`;
    };

    return {
      state,
      hydrated,
      login: (role) => setState((s) => ({ ...s, session: role })),
      logout: () => setState((s) => ({ ...s, session: null })),

      createGrievance: (input) => {
        const now = nowIso();
        const c: Case = {
          ...input,
          id: nextId("case"),
          refNo: refFor(input.state || "IN"),
          status: "SUBMITTED",
          source: input.source ?? "citizen",
          timeline: [{ status: "SUBMITTED", at: now, byRole: input.source === "call-center" ? "call-center" : "citizen" }],
          createdAt: now,
        };
        setState((s) => ({ ...s, cases: [c, ...s.cases] }));
        return c;
      },

      createRescue: (input) => {
        const now = nowIso();
        const r: Rescue = {
          ...input,
          id: nextId("rescue"),
          refNo: `${REF_PREFIX}/RSC/2026/${String(Math.floor(2000 + (seq % 8000)))}`,
          status: "SUBMITTED",
          createdAt: now,
        };
        setState((s) => ({ ...s, rescues: [r, ...s.rescues] }));
        return r;
      },

      findByRef: (refNo) =>
        state.cases.find((c) => c.refNo.toLowerCase() === refNo.trim().toLowerCase()),

      transitionCase: (caseId, to, note, byRole) => {
        const target = state.cases.find((c) => c.id === caseId);
        if (!target || !canTransition(target.status, to)) return false;
        setState((s) => ({
          ...s,
          cases: s.cases.map((c) =>
            c.id === caseId
              ? { ...c, status: to, timeline: [...c.timeline, { status: to, at: nowIso(), note, byRole }] }
              : c,
          ),
        }));
        return true;
      },

      disburseCase: (caseId, amount, mode, beneficiary) => {
        const target = state.cases.find((c) => c.id === caseId);
        if (!target || !canTransition(target.status, "DISBURSED")) return null;
        const d: Disbursement = {
          id: nextId("disb"),
          caseId,
          refNo: target.refNo,
          amount,
          mode,
          beneficiary,
          txnRef: `TXN${String(seq).slice(-8)}`,
          at: nowIso(),
        };
        setState((s) => ({
          ...s,
          disbursements: [d, ...s.disbursements],
          cases: s.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  // Disbursement closes the case: record both the DISBURSED and
                  // CLOSED steps atomically so the timeline shows the full journey.
                  status: "CLOSED",
                  reliefAmount: amount,
                  timeline: [
                    ...c.timeline,
                    { status: "DISBURSED", at: nowIso(), byRole: "finance-officer", note: `Disbursed ₹${amount.toLocaleString("en-IN")} · ${mode}` },
                    { status: "CLOSED", at: nowIso(), byRole: "finance-officer", note: "Case closed after disbursement" },
                  ],
                }
              : c,
          ),
        }));
        return d;
      },

      addUser: (user) =>
        setState((s) => ({ ...s, users: [{ ...user, id: nextId("u") }, ...s.users] })),

      toggleUser: (id) =>
        setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)) })),

      addCategory: (name, slaDays, amountCeiling) =>
        setState((s) => ({
          ...s,
          categories: [...s.categories, { id: nextId("cat"), name, active: true, slaDays, amountCeiling }],
        })),

      toggleCategory: (id) =>
        setState((s) => ({ ...s, categories: s.categories.map((c) => (c.id === id ? { ...c, active: !c.active } : c)) })),

      addAllocation: (alloc) =>
        setState((s) => ({
          ...s,
          allocations: [{ ...alloc, id: nextId("alloc"), at: nowIso() }, ...s.allocations],
        })),

      logQuery: (callerMobile, subject) =>
        setState((s) => ({
          ...s,
          queries: [{ id: nextId("q"), callerMobile, subject, status: "OPEN" as const, at: nowIso() }, ...s.queries],
        })),

      resolveQuery: (id) =>
        setState((s) => ({ ...s, queries: s.queries.map((q) => (q.id === id ? { ...q, status: "RESOLVED" as const } : q)) })),

      markNotificationRead: (id) =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      resetStore: () => setState(seedState()),
    };
  }, [state, hydrated]);

  return <NhapoaContext.Provider value={value}>{children}</NhapoaContext.Provider>;
}

export function useNhapoa(): NhapoaContextValue {
  const ctx = React.useContext(NhapoaContext);
  if (!ctx) throw new Error("useNhapoa must be used within <NhapoaProvider>");
  return ctx;
}
