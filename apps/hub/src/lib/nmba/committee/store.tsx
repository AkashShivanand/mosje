"use client";

// localStorage-backed committee store built on a module-level external store +
// useSyncExternalStore (hydration-safe: SSR renders the seed, the client swaps
// in persisted data after mount without a hydration mismatch). Records + minutes
// metadata survive a reload; uploaded PDF bytes do not (blob URLs are in-session
// only, so they are stripped to null before persisting).

import * as React from "react";
import type { CommitteeRecord, MeetingMinute, UploadedFile } from "./types";
import { SEED_COMMITTEES } from "./seed";

const STORAGE_KEY = "nmba_napddr_committees_v4";

export interface NewCommitteeInput {
  tier: CommitteeRecord["tier"];
  state: string;
  district?: string;
  block?: string;
  chiefSecretaryName?: string;
  chairpersonName?: string;
  chairpersonDesignation?: string;
  memberSecretaryName?: string;
  memberSecretaryDesignation?: string;
  nodalDepartment?: string;
  formationDate: string;
  memberCount: number;
  notification: UploadedFile;
  createdBy: string;
}

export interface NewMinuteInput {
  committeeId: string;
  committeeName: string;
  meetingDate: string;
  file: UploadedFile;
}

export interface CommitteeStore {
  records: CommitteeRecord[];
  addCommittee: (input: NewCommitteeInput) => CommitteeRecord;
  addMinute: (input: NewMinuteInput) => void;
}

// ── Module-level external store ──────────────────────────────────────────────

let records: CommitteeRecord[] = SEED_COMMITTEES;
let hydrated = false;
const listeners = new Set<() => void>();

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/** Strip in-session blob URLs before persisting (they don't survive a reload). */
function serialize(list: CommitteeRecord[]): string {
  const stripped = list.map((r) => ({
    ...r,
    notification: { ...r.notification, blobUrl: null },
    minutes: r.minutes.map((m) => ({ ...m, file: { ...m.file, blobUrl: null } })),
  }));
  return JSON.stringify(stripped);
}

function isValidRecord(r: unknown): r is CommitteeRecord {
  if (typeof r !== "object" || r === null) return false;
  const rec = r as Record<string, unknown>;
  return (
    typeof rec.id === "string" &&
    (rec.tier === "STATE" || rec.tier === "DISTRICT" || rec.tier === "BLOCK") &&
    typeof rec.state === "string" &&
    typeof rec.formationDate === "string" &&
    typeof rec.memberCount === "number" &&
    typeof rec.notification === "object" &&
    rec.notification !== null &&
    Array.isArray(rec.minutes)
  );
}

function loadPersisted(): CommitteeRecord[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    // Reject a corrupt/hand-edited payload rather than crashing downstream.
    if (!Array.isArray(parsed) || !parsed.every(isValidRecord)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, serialize(records));
  }
}

function hydrateOnce(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const persisted = loadPersisted();
  if (persisted) {
    records = persisted;
  } else {
    persist();
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

function getSnapshot(): CommitteeRecord[] {
  return records;
}

function getServerSnapshot(): CommitteeRecord[] {
  return SEED_COMMITTEES;
}

function addCommittee(input: NewCommitteeInput): CommitteeRecord {
  const record: CommitteeRecord = {
    id: newId(),
    minutes: [],
    createdAt: new Date().toISOString(),
    ...input,
  };
  records = [...records, record];
  persist();
  emit();
  return record;
}

function addMinute(input: NewMinuteInput): void {
  const minute: MeetingMinute = { id: newId(), ...input };
  records = records.map((r) =>
    r.id === input.committeeId ? { ...r, minutes: [...r.minutes, minute] } : r,
  );
  persist();
  emit();
}

/**
 * Restore the demo baseline (discards anything registered this session and
 * re-seeds). Lets a presenter re-run the demo — including re-showing the
 * State/District registration flow that is otherwise a one-time action.
 */
export function resetDemoData(): void {
  hydrated = true;
  records = SEED_COMMITTEES;
  persist();
  emit();
}

// ── React binding ────────────────────────────────────────────────────────────

/** Passthrough provider kept for wiring symmetry (store is a module singleton). */
export function CommitteeStoreProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCommitteeStore(): CommitteeStore {
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { records: snapshot, addCommittee, addMinute };
}
