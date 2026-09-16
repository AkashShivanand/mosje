"use client";

import * as React from "react";
import type { RoleId } from "./types";

const LAST_KEY = "e-anudaan.last-visit.v1";
const SESSION_KEY = "e-anudaan.previous-visit.v1";

/* One answer per role per page load, so every render reads the same value. */
const cache = new Map<RoleId, string | null>();

/**
 * Pinned for the session: the first read copies the stored "last visit" into
 * sessionStorage and stamps now as the new one, so returning to the dashboard
 * later in the same session still answers "since your last visit" rather than
 * "since you were on this page a minute ago". Storage that throws (private
 * windows) reads as a first visit — the summary is a convenience, not a record.
 */
function readPreviousVisit(role: RoleId): string | null {
  if (cache.has(role)) return cache.get(role) ?? null;
  let previous: string | null = null;
  try {
    const pinned = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) ?? "{}") as Record<string, string | null>;
    if (role in pinned) {
      previous = pinned[role] ?? null;
    } else {
      const last = JSON.parse(window.localStorage.getItem(LAST_KEY) ?? "{}") as Record<string, string>;
      previous = last[role] ?? null;
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...pinned, [role]: previous }));
      window.localStorage.setItem(LAST_KEY, JSON.stringify({ ...last, [role]: new Date().toISOString() }));
    }
  } catch {
    previous = null;
  }
  cache.set(role, previous);
  return previous;
}

const subscribe = () => () => {};

/** When this role last signed in BEFORE the current session, or null on a first visit (and on the server). */
export function usePreviousVisit(role: RoleId): string | null {
  return React.useSyncExternalStore(
    subscribe,
    () => readPreviousVisit(role),
    () => null,
  );
}
