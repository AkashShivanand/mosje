/**
 * How the E-Anudaan store reaches localStorage, kept free of React so it can be tested.
 *
 * Two defects from the serious audit of 14 Sep 2026 are answered here.
 *
 * S03 — a write that failed (storage full) was swallowed. The success page still said
 * "Application Submitted" with a reference, the draft was deleted, and after a refresh the
 * application was gone. A write now reports whether it landed, and a change that could not be
 * saved is not applied at all, so the screen never shows what the device does not hold.
 *
 * S02 — the whole state was written from whatever copy a tab happened to hold. A tab opened
 * before another tab submitted an application replaced the store with its older copy and the
 * application vanished. Every write now carries a revision; a tab whose copy is older than the
 * stored one re-applies its change to the stored copy instead of overwriting it.
 */

import type { EAnudaanState, NotificationEntry, RoleId } from "../types.ts";

export const STORAGE_KEY = "e-anudaan.store.v1";

/** What the applicant is told when a change cannot be written to the device. */
export const SAVE_FAILED_MESSAGE = "This change could not be saved on this device. Nothing was changed. Try again.";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** The persisted copy: the state plus the revision it was written at. */
export type PersistedState = EAnudaanState & { rev?: number };

function withoutRev(p: PersistedState): EAnudaanState {
  const copy: PersistedState = { ...p };
  delete copy.rev;
  return copy;
}

/**
 * Brings a copy written by an earlier build forward to this build's shape, or returns null when
 * it cannot, in which case the fresh seed stands.
 */
export type Migrate = (old: PersistedState) => EAnudaanState | null;

/**
 * The stored copy, if it is one this build can read. A copy from an earlier shape is read only
 * through `migrate`; without one it is not read at all.
 */
export function readPersisted(
  raw: string | null,
  version: number,
  migrate?: Migrate,
): { state: EAnudaanState; rev: number; migrated: boolean } | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    const rev = Number.isInteger(parsed?.rev) ? (parsed.rev as number) : 0;
    if (parsed?.version !== version) {
      const state = migrate ? migrate(parsed) : null;
      return state ? { state: { ...state, version }, rev, migrated: true } : null;
    }
    return { state: withoutRev(parsed), rev, migrated: false };
  } catch {
    return null;
  }
}

/* ── schema 8 → 9 ─────────────────────────────────────────────────────────── */

type V8Notification = Omit<NotificationEntry, "readBy"> & { read?: boolean; readBy?: RoleId[] };

/**
 * Schema 9 made read state per role and added who gave each document verdict. A schema-8 copy
 * holds the applicant's own work — submitted applications, drafts moved on, decisions — so it is
 * carried forward rather than dropped:
 *
 * - a notice marked read is read by its whole audience, as it appeared to every one of them;
 * - a seeded inspection report that was submitted without a recommendation, and a seeded
 *   certified file whose documents carried no verdict, take the corrected values from the seed —
 *   but only where the record is still exactly as seeded, so nothing a user did is overwritten.
 */
export function migrateFrom8(old: PersistedState, seed: EAnudaanState): EAnudaanState | null {
  if (old?.version !== 8 || !Array.isArray(old.notifications) || !Array.isArray(old.applications)) return null;
  const state = withoutRev(old);

  const notifications = (state.notifications as V8Notification[]).map(({ read, readBy, ...n }) => ({
    ...n,
    readBy: readBy ?? (read ? [...n.audience] : []),
  }));

  const seededInspection = new Map(seed.inspections.map((i) => [i.id, i]));
  const inspections = state.inspections.map((i) => {
    const fresh = seededInspection.get(i.id);
    const reported = i.status === "Submitted" || i.status === "Reviewed";
    if (!fresh || !reported || i.recommendation || fresh.applicationId !== i.applicationId || fresh.status !== i.status) return i;
    return { ...i, recommendation: fresh.recommendation, findings: fresh.findings, scheduledFor: fresh.scheduledFor, submittedAt: fresh.submittedAt };
  });

  const seededApp = new Map(seed.applications.map((a) => [a.id, a]));
  const applications = state.applications.map((a) => {
    const fresh = seededApp.get(a.id);
    if (!fresh || !a.certifiedAt || a.certifiedAt !== fresh.certifiedAt) return a;
    const freshDoc = new Map(fresh.documents.map((d) => [d.id, d]));
    return {
      ...a,
      documents: a.documents.map((d) => {
        const f = freshDoc.get(d.id);
        if (!f?.reviewedBy || d.reviewedBy || d.reviewStatus !== "Pending" || d.fileName !== f.fileName) return d;
        return { ...d, reviewStatus: f.reviewStatus, reviewedBy: f.reviewedBy, reviewedAt: f.reviewedAt };
      }),
    };
  });

  return { ...state, notifications, inspections, applications };
}

/* ── schema 11 → 12 ───────────────────────────────────────────────────────── */

/**
 * Schema 12 gave a CCTV setup its camera register, installation certificate, footage retention,
 * storage and monthly uptime declarations — all optional, so a schema-11 copy is already a valid
 * schema-12 one and the applicant's work on this device is carried forward whole.
 *
 * The seed's worked CCTV records are brought in only where the stored setup is still exactly the
 * seeded one (same project, same save time, no register of its own), so nothing the NGO saved is
 * overwritten.
 */
export function migrateFrom11(old: PersistedState, seed: Pick<EAnudaanState, "cctv">): EAnudaanState | null {
  if (old?.version !== 11 || !Array.isArray(old.applications) || !Array.isArray(old.cctv)) return null;
  const state = withoutRev(old);
  const seeded = new Map(seed.cctv.map((c) => [c.projectId, c]));
  const cctv = state.cctv.map((c) => {
    const fresh = seeded.get(c.projectId);
    return fresh && !c.cameraRegister && fresh.savedAt === c.savedAt ? fresh : c;
  });
  return { ...state, cctv };
}

export type WriteResult = { ok: true } | { ok: false; error: string };

export function writePersisted(storage: StorageLike, key: string, state: EAnudaanState, rev: number): WriteResult {
  try {
    storage.setItem(key, JSON.stringify({ ...state, rev }));
    return { ok: true };
  } catch {
    return { ok: false, error: SAVE_FAILED_MESSAGE };
  }
}

export type CommitResult =
  | { ok: true; state: EAnudaanState; rev: number; rebased: boolean }
  | {
      ok: false;
      error: string;
      /** The newer stored copy, when one was found — the tab should show it even though its own change failed. */
      fresh?: { state: EAnudaanState; rev: number };
    };

/**
 * Apply one change and write it.
 *
 * `update` is run against the NEWEST copy: the tab's own when it is current, the stored one
 * when another tab has written since this tab last read. The session is the tab's own either
 * way — two tabs signed in as two roles is how the demo is walked, and adopting another tab's
 * copy must not sign this one in as somebody else.
 *
 * Nothing is applied unless the write succeeds.
 */
export function commitChange(
  storage: StorageLike,
  key: string,
  version: number,
  current: EAnudaanState,
  knownRev: number,
  update: (base: EAnudaanState) => EAnudaanState,
): CommitResult {
  let stored: { state: EAnudaanState; rev: number } | null = null;
  try {
    stored = readPersisted(storage.getItem(key), version);
  } catch {
    stored = null;
  }
  const rebased = stored != null && stored.rev > knownRev;
  const base = rebased ? { ...stored!.state, session: current.session } : current;
  const baseRev = Math.max(knownRev, stored?.rev ?? 0);
  const fresh = rebased ? { state: base, rev: stored!.rev } : undefined;

  const next = update(base);
  if (next === base) return { ok: true, state: base, rev: baseRev, rebased };
  const rev = baseRev + 1;
  const res = writePersisted(storage, key, next, rev);
  if (!res.ok) return { ok: false, error: res.error, fresh };
  return { ok: true, state: next, rev, rebased };
}

/** Has this role read this notice? Nobody signed in has read nothing. */
export function isReadBy(n: Pick<NotificationEntry, "readBy">, role: RoleId | null): boolean {
  return !!role && n.readBy.includes(role);
}

/** Mark one notice read for one role; the rest of its audience still see it as new. */
export function markReadFor(notifications: readonly NotificationEntry[], id: string, role: RoleId | null): NotificationEntry[] {
  if (!role) return [...notifications];
  return notifications.map((n) => (n.id === id && n.audience.includes(role) && !n.readBy.includes(role) ? { ...n, readBy: [...n.readBy, role] } : n));
}

/**
 * "Mark All as Read" for the role that pressed it, and only for that role. It first marked every
 * role's notifications read (S07); then, with one `read` flag per notice, a notice addressed to
 * the applicant and an officer was still marked read for both when either pressed it.
 */
export function markAllReadFor(notifications: readonly NotificationEntry[], role: RoleId | null): NotificationEntry[] {
  if (!role) return [...notifications];
  return notifications.map((n) => (n.audience.includes(role) && !n.readBy.includes(role) ? { ...n, readBy: [...n.readBy, role] } : n));
}
