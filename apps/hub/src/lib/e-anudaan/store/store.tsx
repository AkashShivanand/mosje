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

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetStore: () => void;

  findApp: (id: string) => GrantApplication | undefined;
  findNgo: (id: string) => NgoProfile | undefined;
  findInspection: (id: string) => Inspection | undefined;
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
