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
 *   this is DISTINCT from the design system's own `data-theme` / `data-color-mode`
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
