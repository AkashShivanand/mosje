"use client";

// localStorage-backed Mass Pledge store, built on a module-level external store
// + useSyncExternalStore — the same hydration-safe pattern as the NAPDDR
// committee store (SSR renders the seed, the client swaps in persisted data
// after mount without a hydration mismatch).
//
// Unlike the committee store, photos DO survive a reload here: GeoPhotoInput
// emits data-URLs rather than blob URLs. That is only affordable because every
// photo is downscaled first — see the quota guard below.

import * as React from "react";
import type { PortalSession } from "../committee/types";
import { SEED_SUBMISSIONS } from "./seed";
import type { MassPledgeSubmission } from "./types";
import { approve, resubmit, returnForCorrection } from "./workflow";

const STORAGE_KEY = "nmba_mass_pledge_v1";

/**
 * Budget for the persisted payload. Browsers allow roughly 5 MB per origin and
 * the NAPDDR store shares it, so we stop well short and fail with a message the
 * user can act on instead of an opaque QuotaExceededError.
 */
const STORAGE_BUDGET_BYTES = 4 * 1024 * 1024;

export class StorageBudgetError extends Error {
  constructor() {
    super(
      "This submission is too large to save locally. Remove a photo and try again. " +
        "(The prototype stores data in your browser, which has a few megabytes of room.)",
    );
    this.name = "StorageBudgetError";
  }
}

export interface NewSubmissionInput
  extends Omit<MassPledgeSubmission, "id" | "submittedAt" | "status" | "verification" | "history"> {
  status: MassPledgeSubmission["status"];
  verification: MassPledgeSubmission["verification"];
  history: MassPledgeSubmission["history"];
}

export interface MassPledgeStore {
  submissions: MassPledgeSubmission[];
  addSubmission: (input: NewSubmissionInput) => MassPledgeSubmission;
  updateSubmission: (id: string, patch: Partial<MassPledgeSubmission>) => void;
  approveSubmission: (id: string, session: PortalSession) => void;
  returnSubmission: (id: string, session: PortalSession, remarks: string) => void;
  resubmitSubmission: (id: string, session: PortalSession) => void;
}

// ── Module-level external store ──────────────────────────────────────────────

let submissions: MassPledgeSubmission[] = SEED_SUBMISSIONS;
let hydrated = false;
const listeners = new Set<() => void>();

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `mp-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function isValidSubmission(value: unknown): value is MassPledgeSubmission {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  const counts = s.counts as Record<string, unknown> | undefined;
  return (
    typeof s.id === "string" &&
    typeof s.reporterKind === "string" &&
    typeof s.eventDate === "string" &&
    typeof s.status === "string" &&
    typeof s.verification === "string" &&
    typeof counts === "object" &&
    counts !== null &&
    typeof counts.youth === "number" &&
    typeof counts.women === "number" &&
    typeof counts.others === "number" &&
    Array.isArray(s.photos) &&
    Array.isArray(s.history)
  );
}

function loadPersisted(): MassPledgeSubmission[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    // Reject a corrupt or hand-edited payload rather than crashing downstream.
    if (!Array.isArray(parsed) || !parsed.every(isValidSubmission)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Persist, refusing writes that would blow the origin quota.
 * Throws `StorageBudgetError` so the caller can surface it on the form.
 */
function persist(next: MassPledgeSubmission[]): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify(next);
  if (payload.length > STORAGE_BUDGET_BYTES) {
    throw new StorageBudgetError();
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // Quota can still be exceeded by other keys on the origin.
    throw new StorageBudgetError();
  }
}

function hydrateOnce(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const persisted = loadPersisted();
  if (persisted) {
    submissions = persisted;
  } else {
    try {
      persist(submissions);
    } catch {
      // Seeding is best-effort; the in-memory seed still renders.
    }
  }
}

function emit(): void {
  for (const cb of listeners) cb();
}

function subscribe(cb: () => void): () => void {
  hydrateOnce();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): MassPledgeSubmission[] {
  return submissions;
}

function getServerSnapshot(): MassPledgeSubmission[] {
  return SEED_SUBMISSIONS;
}

/** Commit a new list, persisting first so a rejected write leaves state intact. */
function commit(next: MassPledgeSubmission[]): void {
  persist(next);
  submissions = next;
  emit();
}

function addSubmission(input: NewSubmissionInput): MassPledgeSubmission {
  const submission: MassPledgeSubmission = {
    ...input,
    id: newId(),
    submittedAt: new Date().toISOString(),
  };
  commit([...submissions, submission]);
  return submission;
}

function updateSubmission(id: string, patch: Partial<MassPledgeSubmission>): void {
  commit(submissions.map((s) => (s.id === id ? { ...s, ...patch } : s)));
}

function mutateById(
  id: string,
  fn: (submission: MassPledgeSubmission) => MassPledgeSubmission,
): void {
  const target = submissions.find((s) => s.id === id);
  if (!target) return;
  const updated = fn(target);
  commit(submissions.map((s) => (s.id === id ? updated : s)));
}

function approveSubmission(id: string, session: PortalSession): void {
  mutateById(id, (s) => approve(s, session));
}

function returnSubmission(id: string, session: PortalSession, remarks: string): void {
  mutateById(id, (s) => returnForCorrection(s, session, remarks));
}

function resubmitSubmission(id: string, session: PortalSession): void {
  mutateById(id, (s) => resubmit(s, session));
}

/** Restore the demo baseline, discarding anything filed this session. */
export function resetMassPledgeData(): void {
  hydrated = true;
  submissions = SEED_SUBMISSIONS;
  try {
    persist(submissions);
  } catch {
    // Ignore — the in-memory reset still takes effect.
  }
  emit();
}

// ── React binding ────────────────────────────────────────────────────────────

export function useMassPledgeStore(): MassPledgeStore {
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    submissions: snapshot,
    addSubmission,
    updateSubmission,
    approveSubmission,
    returnSubmission,
    resubmitSubmission,
  };
}
