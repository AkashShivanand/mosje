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

/**
 * The widget's keyboard shortcut is Windows-only, in label AND in binding.
 *
 * v3.28 hardcodes `Ctrl+F2` into the trigger's markup and binds exactly
 * `e.ctrlKey && e.key === "F2"`. On a Mac that is wrong twice over:
 *
 *   1. Ctrl+F2 is a RESERVED macOS system shortcut — "move focus to the menu
 *      bar" — on by default, so the OS consumes it before the page sees it.
 *   2. F2 is a media key on Apple keyboards unless the user has turned on
 *      "Use F1, F2, etc. as standard function keys", so it needs `fn` as well.
 *
 * A shortcut advertised on the button and then not working is worse than none
 * at all, and on an accessibility control specifically so — keyboard users are
 * the people it exists for.
 *
 * We add ⌘⌥A on macOS and relabel the trigger to match. Why that combo:
 *
 *   - NOT ⌃⌥ (Control+Option). That is the VoiceOver modifier, the "VO key" —
 *     binding it would collide with the screen reader on the one widget whose
 *     users are most likely to be running one.
 *   - Cmd suppresses Option's character substitution, so it cannot type a stray
 *     "å" the way ⌥A alone would.
 *   - Not claimed by macOS or by Safari/Chrome/Firefox defaults.
 *   - Mnemonic: A for Accessibility.
 *
 * The binding is a BRIDGE, not a reimplementation: it dispatches the synthetic
 * Ctrl+F2 the widget already listens for, so open/close/focus behaviour stays
 * exactly the vendor's. Verified against the live widget — the panel toggles
 * cleanly on repeat presses. Windows and Linux are untouched and keep Ctrl+F2.
 *
 * `e.code` rather than `e.key`, because holding Option rewrites `e.key`.
 */
const MAC_SHORTCUT_LABEL = "⌘⌥A";

function isMacPlatform(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? "";
  return /mac/i.test(platform) || /Mac OS X/.test(nav.userAgent);
}

/**
 * Match the A key across the several ways it can present.
 *
 * `e.code` is the right answer on real hardware — it is layout-independent, and
 * holding Option rewrites `e.key` (⌥A alone yields "å"). But `code` is not
 * guaranteed: synthetic events, some automation/remote-input paths and a few
 * assistive tools deliver a keydown with `code` empty, which a `code`-only
 * check silently drops. That is exactly how the first version of this failed —
 * observed, not theorised: `{key: "a", code: "", meta: true, alt: true}`.
 *
 * So accept either signal, and include the Option-modified glyph for the case
 * where a platform hands us `key` without Cmd having suppressed the rewrite.
 */
function isKeyA(e: KeyboardEvent): boolean {
  if (e.code === "KeyA") return true;
  if (e.code) return false; // a real, different key — don't fall through to `key`
  return ["a", "å"].includes(e.key.toLowerCase());
}

/** Binds ⌘⌥A. Returns a cleanup function that removes the listener. */
function installMacShortcutKey(): () => void {
  const onKeyDown = (e: KeyboardEvent): void => {
    if (!e.metaKey || !e.altKey || e.ctrlKey || e.shiftKey) return;
    if (!isKeyA(e)) return;
    e.preventDefault();
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "F2",
        code: "F2",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
  };
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}

/**
 * Rewrite the trigger's hardcoded `Ctrl+F2` to the macOS combo.
 *
 * Called once the script has loaded, so the markup is already in the document;
 * the retry only covers the widget deferring its own injection.
 */
function relabelMacShortcut(): void {
  let attempts = 0;
  const apply = (): void => {
    const label = document.querySelector(".ux4g-accessibility-short-key");
    if (!label) {
      if (attempts++ < 20) window.setTimeout(apply, 100);
      return;
    }
    label.textContent = MAC_SHORTCUT_LABEL;
    // The trigger's aria-label overrides its text content, so without this the
    // shortcut would be visible to sighted users and announced to nobody.
    const trigger = document.getElementById("uw-widget-custom-trigger");
    const name = trigger?.getAttribute("aria-label");
    if (trigger && name && !name.includes(MAC_SHORTCUT_LABEL)) {
      trigger.setAttribute("aria-label", `${name} (${MAC_SHORTCUT_LABEL})`);
    }
  };
  apply();
}

/**
 * Give the panel's four section toggles an accessible name.
 *
 * THE ACCESSIBILITY WIDGET WAS NOT OPERABLE BY A SCREEN READER. Its four
 * collapse toggles — Accessibility Profile, Color Adjustment, Content
 * Adjustment, Orientation Adjustment — contain a chevron `<span>` and nothing
 * else, so each is a button with no text, no `aria-label` and no `title`. axe
 * reports four CRITICAL `button-name` violations on every page of the estate,
 * and a screen-reader user reaches four buttons announced as "button".
 *
 * The name is not invented. Each toggle's own section heading is its previous
 * sibling, visible on screen, so this points `aria-labelledby` at that element
 * and the announced name is exactly what a sighted user reads.
 *
 * WHY THIS IS ALLOWED. `.claude/rules/accessibility-entry-point.md` forbids
 * SUPPRESSING any part of the vendor's panel and forbids restyling it. This
 * does neither: it adds an accessible name where there was none. Nothing is
 * hidden, no behaviour changes, no pixel moves. `relabelMacShortcut` already
 * establishes the pattern in this file, including writing an `aria-label` onto
 * a vendor node.
 *
 * NOT FIXED HERE: `#dark-btn` is a `<button>` wrapping a focusable `<input>`,
 * which axe reports as `nested-interactive`. Repairing that means changing
 * which element is focusable in a vendor control, and getting it wrong makes
 * the theme switch unreachable rather than merely mislabelled. It is recorded
 * in the audit instead.
 */
const SECTION_TOGGLE_IDS = [
  "profileDropdown",
  "colorAdjustmentDropdown",
  "contentDropdown",
  "orientationDropdown",
] as const;

function nameSectionToggles(): void {
  let attempts = 0;
  const apply = (): void => {
    const found = SECTION_TOGGLE_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (found.length === 0) {
      // The panel's markup is injected with the rest of the widget; the retry
      // window matches relabelMacShortcut's, for the same reason.
      if (attempts++ < 20) window.setTimeout(apply, 100);
      return;
    }
    for (const el of found) {
      if (el!.getAttribute("aria-label") || el!.getAttribute("aria-labelledby")) continue;
      const heading = el!.previousElementSibling;
      const text = heading?.textContent?.replace(/\s+/g, " ").trim();
      if (!text) continue;
      // Prefer labelledby so the name tracks the vendor's own text if it is
      // ever translated; fall back to a copied label only if the heading has
      // no id to point at and cannot be given one safely.
      if (!heading!.id) heading!.id = `sa-ux4g-${el!.id}-label`;
      el!.setAttribute("aria-labelledby", heading!.id);
      // The chevron is decoration; without this it can be announced as an
      // extra unnamed node inside the button.
      el!.querySelector(".ux4g-accessibility-icon-chevron")?.setAttribute("aria-hidden", "true");
    }
  };
  apply();
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
      if (isMacPlatform()) relabelMacShortcut();
      nameSectionToggles();
    });
    document.body.appendChild(script);
    // Intentionally not removed on unmount — the widget is a page-level,
    // idempotent singleton that should persist across route changes.
  }, [src, analytics]);

  // Separate from the script effect on purpose: that one bails early when the
  // singleton is already loaded, and both the key binding and the label still
  // have to be right. Unlike the widget itself the listener IS torn down on
  // unmount, since one outliving the component would be a leak.
  //
  // relabel runs here as well as in the load handler, covering the two ways it
  // can be missed: a remount past the early return (this effect), and a CDN
  // slow enough to outlast the retry window (the load handler). It only ever
  // writes the same text, so running twice is harmless.
  // Naming the panel's section toggles is NOT mac-gated — it is a WCAG repair
  // that every platform needs — so it runs before the mac-only early return.
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    nameSectionToggles();
  }, []);

  React.useEffect(() => {
    if (typeof document === "undefined" || !isMacPlatform()) return;
    relabelMacShortcut();
    return installMacShortcutKey();
  }, []);

  return null;
}
