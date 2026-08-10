"use client";

import * as React from "react";

/**
 * UX4GAccessibilityWidget — the OFFICIAL Government of India (MeitY / UX4G)
 * accessibility widget. This is the SINGLE, CANONICAL accessibility / high-contrast
 * mechanism for the entire SAMAVESH estate.
 *
 * It injects the official UX4G accessibility script, which renders a floating
 * control providing contrast/high-contrast, text sizing, spacing, link highlighting,
 * dark mode, disability profiles, reading guides and more. Compliant with WCAG,
 * GIGW and IS 17802.
 *
 * Docs: https://doc.ux4g.gov.in/ux4g-accessibility/accessibility-widgets.php
 *
 * Notes:
 * - Framework-agnostic: injects a plain <script> (no `next/script` dependency).
 * - Idempotent: only ever loads the script once per document. v3.x also guards
 *   itself with `window.__ux4g_accessibility_loaded`, explicitly for React
 *   re-hydration, so a double render cannot double-inject the widget.
 * - The script loads its own stylesheet, resolving the URL relative to its own
 *   `document.currentScript.src`. Point `src` at a different origin and the CSS
 *   follows it — so a self-hosted copy must keep the JS and CSS side by side.
 * - The widget applies the class `.dark-mode` to <html> when its dark theme is on;
 *   this is DISTINCT from the design system's own `data-theme` / `data-brand`
 *   token theming — see docs/specs/samavesh-accessibility-consolidation.md.
 * - The CDN script wires almost all of its interactive controls (font size, line
 *   height, spacing, contrast, dark mode, the close button — everything except the
 *   FAB open/close toggle) inside a `document.addEventListener("DOMContentLoaded", ...)`
 *   handler. Because we load the script well after the real DOMContentLoaded has
 *   already fired, that handler would otherwise NEVER run and those controls would
 *   silently do nothing. We dispatch a synthetic DOMContentLoaded once the script
 *   finishes loading so the widget finishes its own init exactly as it would in a
 *   static `<script defer>` embed placed before `</body>`.
 * - The visual skin (accent colour, trigger/panel font) is reskinned to the SAMAVESH
 *   brand via the widget's own `--color-dark-blue-1` CSS variable — see
 *   `ux4g-accessibility-widget.css`. This keeps 100% of the official functionality
 *   while matching the look documented in Figma ("AccessibilityWidget / FAB").
 * - Telemetry is OFF by default. See `analytics` below — this is a deliberate
 *   choice for this estate, not an upstream default.
 *
 * Render it once, near the end of the root layout (like AppSwitcher).
 */

import "./ux4g-accessibility-widget.css";

/**
 * Official UX4G accessibility widget CDN (current: v3.28 — the build
 * ux4g.gov.in itself serves).
 *
 * Upgraded from `accessibility-beta-v1.15`, which had two defects this estate
 * had to work around in code, both fixed upstream in v3.x:
 *
 *   1. `detectRouteChange()` dereferenced its settings without a null check, so
 *      every client-side route change threw for any visitor who had never
 *      touched the widget. v3.x guards the read and keeps settings in a cookie.
 *   2. `loadSettings()` restored state by calling the widget's own CLICK
 *      handlers, which each advance a counter unconditionally — so working
 *      around (1) by seeding the settings key made every page load apply one
 *      step of zoom, line height and letter spacing. UX4G acknowledge this in
 *      v3.28's own source; the seeding workaround is gone with it.
 */
export const UX4G_A11Y_WIDGET_SRC =
  "https://cdn.ux4g.gov.in/accessibility-v3.28/accessibility-widget.js";

/**
 * Dead key left behind by the v1.15 workaround.
 *
 * v3.x keeps its settings in a cookie of the same name and never reads this
 * localStorage entry, so it is inert — but we are the ones who wrote it, so we
 * clear it rather than leaving it in every visitor's browser forever.
 *
 * Safe to delete this and `clearLegacyUx4gSettings()` once the estate has been
 * on v3.x long enough that no meaningful number of browsers still hold the key.
 */
const LEGACY_UX4G_SETTINGS_KEY = "accessibilitySettings";

function clearLegacyUx4gSettings(): void {
  try {
    localStorage.removeItem(LEGACY_UX4G_SETTINGS_KEY);
  } catch {
    // Storage can be unavailable (Safari private mode, blocked cookies).
  }
}

/**
 * Turn the widget's built-in telemetry off.
 *
 * v3.28 added analytics that v1.15 had none of: on load it beacons the full
 * URL, pathname, hostname, referrer, user agent, language, screen resolution,
 * viewport and a session id to `https://audit360.ux4g.gov.in/api/track`, and
 * tracks panel opens, feature toggles and profile selections after that.
 *
 * That is a poor fit for this estate. The portals are authenticated workflow
 * apps whose URLs carry application and beneficiary identifiers in the path, so
 * "the full URL of every page view" is not neutral data to send to a third
 * party — and the whole estate is currently a password-gated prototype whose
 * internal URLs have no reason to leave it at all.
 *
 * There is no documented opt-out and `ANALYTICS_CONFIG` is closed over inside
 * the script's IIFE, but it is exposed BY REFERENCE as
 * `window.UX4G_Analytics.config`, and the send path checks `enabled` on every
 * call — so flipping it here disables every event, not just the first.
 *
 * Timing is the reason this runs where it does. The script defers its analytics
 * init by 100ms whenever `document.readyState` is not "loading", which is
 * always true for us because we inject after hydration. Our `load` handler runs
 * immediately after the script executes, comfortably inside that window, so
 * even the initial widget-load beacon is suppressed. Failed sends are caught
 * and swallowed upstream, so this cannot surface an error to the page either.
 */
function setUx4gAnalyticsEnabled(enabled: boolean): void {
  const w = window as unknown as { UX4G_Analytics?: { config?: { enabled?: boolean } } };
  const config = w.UX4G_Analytics?.config;
  if (config) config.enabled = enabled;
}

export interface UX4GAccessibilityWidgetProps {
  /** Override the widget script URL (e.g. to pin a version or self-host). */
  src?: string;
  /**
   * Allow the widget to send its usage telemetry to UX4G's `audit360` endpoint.
   *
   * Defaults to `false`: the payload includes the full URL of every page view,
   * which on an authenticated portal can carry application and beneficiary
   * identifiers. Set it to `true` only for a public, non-authenticated property
   * where feeding UX4G's accessibility-audit dashboard is worth that trade —
   * and confirm it against the estate's privacy position first.
   */
  analytics?: boolean;
}

export function UX4GAccessibilityWidget({
  src = UX4G_A11Y_WIDGET_SRC,
  analytics = false,
}: UX4GAccessibilityWidgetProps = {}): null {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector(`script[data-ux4g-a11y="true"]`)) return;
    clearLegacyUx4gSettings();
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.setAttribute("data-ux4g-a11y", "true");
    script.addEventListener("load", () => {
      // Before the synthetic DOMContentLoaded below, so the widget's own init
      // — and the load beacon it fires — already sees the setting.
      if (!analytics) setUx4gAnalyticsEnabled(false);
      // The widget's own init (feature buttons, close button, settings restore)
      // is gated on DOMContentLoaded, which has already fired by now — replay it
      // so those handlers actually attach. Safe to dispatch more than once.
      document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true, cancelable: true }));
    });
    document.body.appendChild(script);
    // Intentionally not removed on unmount — the widget is a page-level,
    // idempotent singleton that should persist across route changes.
  }, [src, analytics]);

  return null;
}
