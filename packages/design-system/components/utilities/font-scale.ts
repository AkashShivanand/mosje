"use client";

/**
 * The reader's text-size preference, as a MODULE-LEVEL store rather than component
 * state.
 *
 * It moved out of `AccessibilityBar` when the same three controls had to appear in
 * a second place — `NavSheet`, because below `breakpoint/tablet` the bar sheds its
 * right-hand cluster and, until now, nothing picked it up. Two components each
 * holding their own `scaleIx` would each be right about the document and wrong
 * about each other: press A+ in the sheet and the bar behind it still renders the
 * old step, and whichever unmounts last writes its stale index to storage.
 *
 * One store, `useSyncExternalStore`, every mounted control in agreement. The
 * document side-effects (the CSS variable, the root attribute, localStorage) run
 * exactly once per change, in `setScaleIndex`, instead of once per mounted bar.
 */

import * as React from "react";

/** A−, default, A+, A++ — the reader's text-size steps. */
export const FONT_SCALES = [0.9, 1, 1.1, 1.2] as const;
export const DEFAULT_SCALE_INDEX = 1;
/** Where the reader's chosen text size persists across pages. */
const FONT_SCALE_KEY = "sa-font-scale";

let scaleIndex = DEFAULT_SCALE_INDEX;
let hydrated = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

/** Read the stored preference once, on the first subscription in the document. */
function hydrate(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(FONT_SCALE_KEY);
    if (raw === null) return;
    const ix = FONT_SCALES.indexOf(Number(raw) as (typeof FONT_SCALES)[number]);
    if (ix >= 0) {
      scaleIndex = ix;
      apply(ix);
      emit();
    }
  } catch {
    /* storage blocked (private mode, cookie policy) — keep the default */
  }
}

function apply(ix: number): void {
  if (typeof document === "undefined") return;
  const scale = FONT_SCALES[ix] ?? 1;
  const root = document.documentElement;
  root.style.setProperty("--sa-font-scale", String(scale));
  /* `data-sa-font-scale` is what ARMS the :root font-size rule in
     accessibility-bar.css. Without the attribute the rule does not apply, so a
     page with no bar keeps the browser's own root size untouched. */
  root.dataset.saFontScale = String(scale);
  try {
    window.localStorage.setItem(FONT_SCALE_KEY, String(scale));
  } catch {
    /* storage blocked — the scale still applies for this page view */
  }
}

export function setScaleIndex(next: number): void {
  const clamped = Math.min(FONT_SCALES.length - 1, Math.max(0, next));
  if (clamped === scaleIndex) return;
  scaleIndex = clamped;
  apply(clamped);
  emit();
}

function subscribe(listener: () => void): () => void {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => scaleIndex;
/* The server has no stored preference and must not guess one — rendering the
   default keeps the markup stable across hydration. */
const getServerSnapshot = () => DEFAULT_SCALE_INDEX;

/**
 * The current step index, and the three moves over it. Every mounted control
 * shares one value, so the bar and the sheet can never disagree.
 */
export function useFontScale(): {
  index: number;
  scale: number;
  percent: number;
  decrease: () => void;
  increase: () => void;
  reset: () => void;
} {
  const index = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const scale = FONT_SCALES[index] ?? 1;
  return {
    index,
    scale,
    percent: Math.round(scale * 100),
    decrease: React.useCallback(() => setScaleIndex(scaleIndex - 1), []),
    increase: React.useCallback(() => setScaleIndex(scaleIndex + 1), []),
    reset: React.useCallback(() => setScaleIndex(DEFAULT_SCALE_INDEX), []),
  };
}
