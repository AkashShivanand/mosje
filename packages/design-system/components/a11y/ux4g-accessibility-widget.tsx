"use client";

import * as React from "react";

/**
 * UX4GAccessibilityWidget — the OFFICIAL Government of India (MeitY / UX4G)
 * accessibility widget. This is the SINGLE, CANONICAL accessibility / high-contrast
 * mechanism for the entire SAMAVESH estate.
 *
 * It injects the official UX4G accessibility script, which renders a floating
 * control providing contrast/high-contrast, text sizing, spacing, link highlighting,
 * dark mode and more. Compliant with WCAG, GIGW and IS 17802.
 *
 * Docs: https://doc.ux4g.gov.in/ux4g-accessibility/accessibility-widgets.php
 *
 * Notes:
 * - Framework-agnostic: injects a plain <script> (no `next/script` dependency).
 * - Idempotent: only ever loads the script once per document.
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
 *
 * Render it once, near the end of the root layout (like AppSwitcher).
 */

import "./ux4g-accessibility-widget.css";

/** Official UX4G accessibility widget CDN (current: beta v1.15). */
export const UX4G_A11Y_WIDGET_SRC =
  "https://cdn.ux4g.gov.in/accessibility-beta-v1.15/accessibility-widget.js";

/** The widget's own localStorage key. Must match SETTINGS_KEY in the CDN script. */
const UX4G_SETTINGS_KEY = "accessibilitySettings";

/**
 * Work around an unguarded null dereference in the CDN widget.
 *
 * `detectRouteChange()` reads its settings once and never null-checks them:
 *
 *   const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY));  // null
 *   setInterval(() => { … if (settings.adhdFriendly) { … } }, 1000);  // throws
 *
 * `JSON.parse(null)` is `null`, so for any visitor who has never toggled a
 * widget setting — nearly everyone — every client-side route change throws
 * "Cannot read properties of null (reading 'adhdFriendly')". It is installed on
 * `scroll`, so it fires constantly. `loadSettings()` guards the same read
 * correctly; this one function does not.
 *
 * Seeding the key with the neutral object the widget itself would write on its
 * first save makes the read succeed and every flag false, which is the state a
 * fresh visitor is already in. Existing settings are never touched.
 *
 * Remove this once the CDN ships a null check.
 */
function seedUx4gSettings(): void {
  try {
    if (localStorage.getItem(UX4G_SETTINGS_KEY) !== null) return;
    localStorage.setItem(
      UX4G_SETTINGS_KEY,
      // Shape copied from the script's own saveSettings().
      JSON.stringify({
        screenReader: false,
        fontSizeCount: 0,
        lineHeightCount: 0,
        textSpacingCount: 0,
        highlightLinks: false,
        dyslexiaMode: false,
        hideImages: false,
        darkMode: false,
        cursorChanged: false,
        invert: false,
        adhdFriendly: false,
      }),
    );
  } catch {
    // Storage can be unavailable (Safari private mode, blocked cookies). The
    // widget still works; the upstream error just remains unfixed.
  }
}

export interface UX4GAccessibilityWidgetProps {
  /** Override the widget script URL (e.g. to pin a version or self-host). */
  src?: string;
}

export function UX4GAccessibilityWidget({
  src = UX4G_A11Y_WIDGET_SRC,
}: UX4GAccessibilityWidgetProps = {}): null {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector(`script[data-ux4g-a11y="true"]`)) return;
    // Must run BEFORE the script: detectRouteChange() captures settings once,
    // on the first scroll after load, and never re-reads them.
    seedUx4gSettings();
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.setAttribute("data-ux4g-a11y", "true");
    script.addEventListener("load", () => {
      // The widget's own init (feature buttons, close button, settings restore)
      // is gated on DOMContentLoaded, which has already fired by now — replay it
      // so those handlers actually attach. Safe to dispatch more than once.
      document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true, cancelable: true }));
    });
    document.body.appendChild(script);
    // Intentionally not removed on unmount — the widget is a page-level,
    // idempotent singleton that should persist across route changes.
  }, [src]);

  return null;
}
