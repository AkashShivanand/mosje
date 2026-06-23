"use client";

import * as React from "react";

/**
 * useA11yToolbar — real, working behaviour for the navbar accessibility toolbar.
 *
 * GIGW / WCAG require the text-size and contrast controls on a government masthead
 * to actually work. This hook owns that behaviour in the design system so all 33+
 * properties get it for free and no app can ship a dead (lying) control:
 *
 *   • Text size  → sets the root `<html>` font-size (3 levels), so all rem-based
 *                  content scales. Persisted in localStorage.
 *   • Contrast   → toggles `data-theme="hc"` on `<html>` — the DS's documented
 *                  high-contrast theme axis (real token overrides). Persisted.
 *
 * SSR-safe: nothing touches `document` during render; preferences are read and
 * applied in an effect after mount. The control buttons call these directly, so
 * the toolbar works with zero wiring; app-level `onFontSize`/`onContrast`
 * callbacks are optional observation hooks (analytics), never the implementation.
 */

const FONT_KEY = "ds-a11y-fontscale";
const CONTRAST_KEY = "ds-a11y-contrast";

/** Three discrete text sizes — A− (default) · A (large) · A+ (larger). */
export const FONT_LEVELS = ["100%", "115%", "130%"] as const;
export type FontLevel = 0 | 1 | 2;

function applyFont(level: FontLevel): void {
  document.documentElement.style.fontSize = FONT_LEVELS[level] ?? "100%";
}

function applyContrast(on: boolean): void {
  const html = document.documentElement;
  if (on) {
    html.setAttribute("data-theme", "hc");
  } else if (html.getAttribute("data-theme") === "hc") {
    // Only clear OUR value — never clobber an app-set dark/light theme.
    html.removeAttribute("data-theme");
  }
}

export interface A11yToolbar {
  fontLevel: FontLevel;
  contrast: boolean;
  /** Select an absolute text size (0 = default, 1 = large, 2 = larger). */
  setFont: (level: FontLevel) => void;
  /** Turn the high-contrast theme on/off. */
  setContrast: (on: boolean) => void;
}

export function useA11yToolbar(): A11yToolbar {
  const [fontLevel, setFontLevel] = React.useState<FontLevel>(0);
  const [contrast, setContrastState] = React.useState(false);

  // Hydrate persisted prefs and apply them (after mount — SSR-safe).
  React.useEffect(() => {
    try {
      const raw = Number.parseInt(localStorage.getItem(FONT_KEY) ?? "0", 10);
      const lvl = (Number.isFinite(raw) ? Math.min(2, Math.max(0, raw)) : 0) as FontLevel;
      const c = localStorage.getItem(CONTRAST_KEY) === "1";
      setFontLevel(lvl);
      setContrastState(c);
      applyFont(lvl);
      applyContrast(c);
    } catch {
      /* localStorage unavailable (private mode / SSR) — defaults stand. */
    }
  }, []);

  const setFont = React.useCallback((level: FontLevel) => {
    const clamped = Math.min(2, Math.max(0, level)) as FontLevel;
    setFontLevel(clamped);
    applyFont(clamped);
    try {
      localStorage.setItem(FONT_KEY, String(clamped));
    } catch {
      /* ignore */
    }
  }, []);

  const setContrast = React.useCallback((on: boolean) => {
    setContrastState(on);
    applyContrast(on);
    try {
      localStorage.setItem(CONTRAST_KEY, on ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  return { fontLevel, contrast, setFont, setContrast };
}
