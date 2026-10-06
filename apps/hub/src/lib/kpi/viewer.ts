"use client";

import * as React from "react";
import { roleById, type OfficerRole } from "./access";

/**
 * Who the website's Dashboard is being viewed as — the public, or one of the officer
 * roles in `access.ts` — chosen in the demo rail's View As tab and held in sessionStorage.
 *
 * A demo control, not authentication: the Dashboard is not connected to a portal login
 * (5 Oct 2026). Read through `useSyncExternalStore`, as `DataModeProvider` reads its
 * cookie, so the first paint is the public view and the browser reconciles once.
 */

const KEY = "sa-dashboard-viewer";
const CHANGED = "sa-dashboard-viewer-changed";

function read(): string {
  try {
    return window.sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** `null` returns the Dashboard to the public view. */
export function setViewer(roleId: string | null): void {
  try {
    if (roleId) window.sessionStorage.setItem(KEY, roleId);
    else window.sessionStorage.removeItem(KEY);
  } catch {
    /* storage blocked: the choice lasts until the next navigation */
  }
  window.dispatchEvent(new Event(CHANGED));
}

/** The role being viewed as, or undefined for the public view. */
export function useDashboardViewer(): OfficerRole | undefined {
  const id = React.useSyncExternalStore(subscribe, read, () => "");
  return roleById(id);
}
