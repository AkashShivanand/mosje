import * as React from "react";
import type { Metadata } from "next";

import "./accessibility.css";
import { Callout, FoundationDocPage, PropsTable, TerminalCode } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "The accessibility baseline for SAMAVESH — WCAG 2.1 AA + GIGW, the POUR principles, the one accessibility widget for the estate, and the checklists for designers and developers.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · PropsTable ✅ (generated) · TerminalCode ✅
 * The focus and target values are read from foundations-data.generated.ts; the widget's
 * version is derived from its URL, mirrored below. Nothing here types a size.
 */

/** What this foundation binds: the focus ring and the target sizes. */
const focusRows = FOUNDATIONS.states.tokens.filter((r) => r.path.startsWith("focus/"));
const targetRows = FOUNDATIONS.sizing.tokens.filter((r) => r.path.startsWith("target/"));
const rows = [...focusRows, ...targetRows];
const remToPx = (v: string | null): number => Math.round(Number.parseFloat(v ?? "0") * 16);
const targetPx = (name: string): number => remToPx(targetRows.find((r) => r.path === `target/${name}`)?.value ?? null);
const TARGET_MIN = targetPx("min");
const TARGET_COMFORTABLE = targetPx("comfortable");

/**
 * The official widget URL, as `UX4G_A11Y_WIDGET_SRC` in
 * packages/design-system/components/utilities/ux4g-accessibility-widget.tsx. That module
 * is a client module, so its constant cannot be read from this server-rendered page —
 * importing it yields a client reference, not the string — and the URL is mirrored here
 * instead. The version below is derived from this one string so the two cannot disagree.
 */
const UX4G_A11Y_WIDGET_SRC = "https://cdn.ux4g.gov.in/accessibility-v3.28/accessibility-widget.js";
const WIDGET_VERSION = /accessibility-v([\d.]+)\//.exec(UX4G_A11Y_WIDGET_SRC)?.[1] ?? "3";

const WIDGET_IMPORT_SNIPPET = `import { UX4GAccessibilityWidget } from "@mosje/design-system";

// render once near the end of the root layout, alongside AppSwitcher:
<UX4GAccessibilityWidget />`;

const WIDGET_EMBED_SNIPPET = `<script src="${UX4G_A11Y_WIDGET_SRC}" defer></script>`;

const POUR = [
  {
    name: "Perceivable",
    body: "People must be able to sense the content. Provide text alternatives for images, captions for media, and enough colour contrast to read comfortably.",
  },
  {
    name: "Operable",
    body: "People must be able to use it. Everything works with a keyboard, nothing depends on a precise gesture, and users have enough time to act.",
  },
  {
    name: "Understandable",
    body: "Content and controls must make sense. Use clear language, predictable behaviour, and helpful error messages.",
  },
  {
    name: "Robust",
    body: "It must work with the tools people rely on. Clean, semantic markup so screen readers and assistive technology can interpret the page reliably.",
  },
];

const WIDGET_FEATURES = [
  { name: "Contrast & invert", body: "high-contrast and inverted-colour modes" },
  { name: "Dark / light mode", body: "switch the page between light and dark" },
  { name: "Bigger text", body: "scale text up for readability" },
  { name: "Text spacing", body: "increase letter and word spacing" },
  { name: "Line height", body: "loosen line spacing" },
  { name: "Dyslexia-friendly font", body: "swap to a dyslexia-legible typeface" },
  { name: "Highlight links", body: "make links visually prominent" },
  { name: "Hide images", body: "remove imagery to reduce distraction" },
  { name: "Bigger cursor", body: "enlarge the pointer" },
  { name: "Screen reader", body: "read page content aloud" },
];

const DESIGNER_CHECKS = [
  { t: "Contrast Ratios", b: "At least 4.5:1 for normal text and 3:1 for large text and meaningful icons." },
  {
    t: "Touch Targets",
    b: `Interactive elements at least ${TARGET_MIN}×${TARGET_MIN}px — the Level AA minimum. Form controls and the large button use ${TARGET_COMFORTABLE}px, which is the stricter Level AAA size.`,
  },
  { t: "Focus Indicators", b: "Design a visible focus state for every interactive element — never rely on colour alone." },
  { t: "Do Not Rely on Colour", b: "Pair colour with text, icons or patterns so meaning survives for colour-blind users." },
];

const DEVELOPER_CHECKS = [
  { t: "Semantic HTML", b: "Use the right element — buttons, headings, lists, landmarks — before reaching for ARIA." },
  { t: "ARIA Labels", b: "Give icon-only and ambiguous controls an accessible name; do not over-apply ARIA where HTML already conveys the role." },
  { t: "Keyboard Navigation", b: "Every action reachable and operable with Tab, Enter, Space and arrow keys, in a logical order." },
  { t: "Screen Reader Testing", b: "Test real flows with a screen reader, not just an automated scan." },
];

const TESTS = [
  { t: "axe DevTools", b: "A free browser extension that flags common issues automatically. A first pass, but it cannot catch everything." },
  { t: "VoiceOver on macOS", b: "Turn it on with Cmd + F5 and navigate the page by ear to hear what a blind user experiences." },
  { t: "Keyboard-only navigation", b: "Unplug the mouse and Tab through the whole flow. If something cannot be reached or operated, neither can many readers." },
];

export default function AccessibilityPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Accessibility"
      status="Stable"
      since="0.49.0"
      summary="These are government services. Every citizen must be able to use them, whatever their ability, device or connection — so accessibility is a release requirement here, not a later pass. The baseline is WCAG 2.1 AA and GIGW, which is the legal floor for an Indian government website; one official widget delivers the citizen's own adjustments on every property."
      figma={{ node: "accessibility" }}
      glance={[
        { value: "AA", label: "conformance target", note: "WCAG 2.1; 2.2 criteria adopted where already met" },
        { value: POUR.length, label: "principles", note: "perceivable · operable · understandable · robust" },
        { value: WIDGET_FEATURES.length, label: "widget adjustments", note: `UX4G v${WIDGET_VERSION}, one mechanism estate-wide` },
        { value: `${TARGET_MIN} / ${TARGET_COMFORTABLE}`, label: "target sizes, px", note: "2.5.8 AA minimum · 2.5.5 AAA enhanced" },
        { value: rows.length, label: "tokens bound", note: "focus/* and target/*" },
        { value: DESIGNER_CHECKS.length + DEVELOPER_CHECKS.length, label: "checks before shipping", note: `${DESIGNER_CHECKS.length} for designers, ${DEVELOPER_CHECKS.length} for developers` },
      ]}
      sections={[
        {
          id: "standard",
          keyword: "STANDARD",
          title: "WCAG 2.1 AA and GIGW Are the Legal Floor, Not a Target",
          description:
            "WCAG 2.1 (Web Content Accessibility Guidelines) is the international standard for accessible digital content. Each guideline has three conformance levels — A, AA and AAA. SAMAVESH targets AA, the level expected of public services worldwide.",
          content: (
            <>
              <p>
                Individual criteria introduced in <strong>WCAG 2.2</strong> — target size, for one — are adopted where they are
                already met; that is not a claim of full 2.2 conformance, which has not been audited.
              </p>
              <p>
                <strong>GIGW</strong> (Guidelines for Indian Government Websites and Apps) builds on WCAG and is the national
                standard for government digital properties in India. Meeting WCAG 2.1 AA and GIGW is{" "}
                <strong>legally required</strong> for Indian government websites — it is not optional, and it is the baseline
                every MoSJE property must clear before it ships.
              </p>
              <div className="a11y-specimens" aria-label="Focus ring and target sizes, drawn from the tokens">
                <div className="a11y-specimen">
                  <span className="a11y-specimen__box a11y-specimen__box--focus" aria-hidden="true" />
                  focus/ring · width · offset
                </div>
                {targetRows
                  .filter((r) => r.path !== "target/spacing")
                  .map((r) => {
                    const name = r.path.split("/")[1];
                    return (
                      <div key={r.path} className="a11y-specimen">
                        <span className={`a11y-specimen__box a11y-specimen__box--${name}`} aria-hidden="true" />
                        {r.path} · {remToPx(r.value)}px
                      </div>
                    );
                  })}
              </div>
            </>
          ),
        },
        {
          id: "principles",
          keyword: "PRINCIPLES",
          title: "Four Principles Underlie Every Criterion",
          description: "WCAG is built on four ideas, in plain English.",
          content: (
            <ul className="a11y-cards">
              {POUR.map((p) => (
                <li key={p.name} className="a11y-card">
                  <p className="a11y-card__title">{p.name}</p>
                  <p className="a11y-card__body">{p.body}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "widget",
          keyword: "WIDGET",
          title: "One Accessibility Widget Serves the Whole Estate",
          description:
            "Accessibility settings across the SAMAVESH estate are delivered by the official Government of India (MeitY / UX4G) Accessibility Widget — a control fixed to the viewport that lets any citizen adapt the page to their needs without a separate settings screen. It is the single, canonical accessibility and high-contrast mechanism for every portal and site; no per-app contrast toggle is built. It is centrally maintained by MeitY and complies with WCAG, GIGW and IS 17802.",
          content: (
            <>
              <ul className="a11y-features" aria-label={`The ${WIDGET_FEATURES.length} adjustments the widget provides`}>
                {WIDGET_FEATURES.map((f) => (
                  <li key={f.name}>
                    <strong>{f.name}</strong> — {f.body}.
                  </li>
                ))}
              </ul>
              <p>Preferences persist as the citizen navigates. The control is keyboard-operable and screen-reader labelled.</p>
              <Callout type="warning" title="One mechanism only">
                The bespoke <code>AccessibilityWidget</code> reimplementation and every per-app font-size/contrast toggle have
                been removed — everything routes through the official UX4G widget now. Full writeup:{" "}
                <code>docs/specs/samavesh-accessibility-consolidation.md</code>.
              </Callout>
            </>
          ),
        },
        {
          id: "integration",
          keyword: "INTEGRATION",
          title: "The Shared Wrapper Is Rendered Once; the Script Is Never Hand-Embedded",
          description:
            "In any app in this estate, render the shared wrapper once near the end of the root layout, alongside AppSwitcher. It injects the official widget script idempotently.",
          content: (
            <>
              <TerminalCode title="app/layout.tsx" codeText={WIDGET_IMPORT_SNIPPET}>
                {WIDGET_IMPORT_SNIPPET}
              </TerminalCode>
              <p>
                Outside this monorepo (plain HTML, PHP, WordPress and the like), embed the official script directly before{" "}
                <code>&lt;/body&gt;</code>:
              </p>
              <TerminalCode title="html" codeText={WIDGET_EMBED_SNIPPET}>
                {WIDGET_EMBED_SNIPPET}
              </TerminalCode>
              <PropsTable from="UX4GAccessibilityWidgetProps" />
              <p>
                Deployments must allow the UX4G CDN (<code>cdn.ux4g.gov.in</code>) in their Content-Security-Policy.
              </p>
            </>
          ),
        },
        {
          id: "theming",
          keyword: "THEMING",
          title: "The Widget's Dark Mode Is the Only Dark Appearance in the Estate",
          description:
            "The widget applies the class .dark-mode to <html> for its own dark theme. The design system's own data-theme axis (light/dark/hc) was retired, tokens.css emits no [data-theme] block, and nothing sets the attribute. What remains token-driven is data-brand, which is palette, not appearance — every brand renders on a light surface.",
          content: (
            <ul>
              <li>
                The widget does <strong>not</strong> consume the estate&rsquo;s tokens, and nothing wires it to{" "}
                <code>data-brand</code>. If a surface should react to <code>.dark-mode</code>, add explicit{" "}
                <code>.dark-mode …</code> overrides for it — deliberately, and with QA, because the widget already applies its
                own treatment and a second one double-darkens.
              </li>
              <li>
                The visual skin — accent colour, trigger and panel font — is reskinned to the SAMAVESH brand through the
                widget&rsquo;s own <code>--color-dark-blue-1</code> variable, keeping all of the official functionality while
                matching the Figma <code>AccessibilityWidget / FAB</code>.
              </li>
            </ul>
          ),
        },
        {
          id: "designers",
          keyword: "DESIGNERS",
          title: "Four Checks Before a Design Leaves Figma",
          content: (
            <ul className="a11y-cards">
              {DESIGNER_CHECKS.map((c) => (
                <li key={c.t} className="a11y-card">
                  <p className="a11y-card__title">{c.t}</p>
                  <p className="a11y-card__body">{c.b}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "developers",
          keyword: "DEVELOPERS",
          title: "Semantic HTML First, ARIA Second, a Screen Reader Before Shipping",
          content: (
            <ul className="a11y-cards">
              {DEVELOPER_CHECKS.map((c) => (
                <li key={c.t} className="a11y-card">
                  <p className="a11y-card__title">{c.t}</p>
                  <p className="a11y-card__body">{c.b}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "testing",
          keyword: "TESTING",
          title: "An Automated Scan Is the First Pass, Not the Last",
          content: (
            <ul className="a11y-cards">
              {TESTS.map((c) => (
                <li key={c.t} className="a11y-card">
                  <p className="a11y-card__title">{c.t}</p>
                  <p className="a11y-card__body">{c.b}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "defaults",
          keyword: "DEFAULTS",
          title: "Components Ship Accessible; the Checklists Are for What Is Built Outside Them",
          content: (
            <Callout type="info" title="Built in by default">
              SAMAVESH components ship with accessibility built in — semantic markup, focus management, accessible names and
              contrast are already handled. The checklists above are for custom implementations and anything built outside the
              shared components.
            </Callout>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="Accessibility has no token family of its own; it binds two that other foundations own. focus/* — ring, width, offset — is the Interaction States family, and target/* — min, comfortable, spacious, spacing — is the Sizing family. Bind them by name; a control that types its own outline or its own 44px is the defect the tokens exist to prevent."
      a11y={[
        {
          criterion: "1.4.3 Contrast (Minimum)",
          level: "AA",
          description: "Body text reaches at least 4.5:1 against its background.",
        },
        {
          criterion: "2.1.1 Keyboard",
          level: "A",
          description: "All functionality is available without a mouse.",
        },
        {
          criterion: "2.4.7 Focus Visible",
          level: "AA",
          description: "A clear focus indicator appears on every interactive element.",
          status: "partial",
          evidence: `focus/ring, focus/width and focus/offset are bound by every DS control; no estate-wide audit has yet confirmed every custom control outside the DS.`,
        },
        {
          criterion: "2.5.8 Target Size (Minimum)",
          level: "AA",
          description: `Targets are at least ${TARGET_MIN}×${TARGET_MIN}px. The ${TARGET_COMFORTABLE}×${TARGET_COMFORTABLE}px figure often quoted is SC 2.5.5 Target Size (Enhanced), which is Level AAA; form controls meet it, the sm and md buttons do not.`,
          status: "partial",
          evidence: `Form controls and the lg button bind target/comfortable (${TARGET_COMFORTABLE}px); sm and md buttons hold the ${TARGET_MIN}px minimum only.`,
        },
        {
          criterion: "1.1.1 Non-text Content",
          level: "A",
          description: "Informative images carry meaningful alt text; decorative ones are hidden.",
        },
        {
          criterion: "4.1.2 Name, Role, Value",
          level: "A",
          description: "Form fields, buttons and links each have a clear accessible name.",
        },
        {
          criterion: "GIGW 3.0 — conformance",
          level: "GIGW",
          description: "Meets the Guidelines for Indian Government Websites and Apps.",
        },
      ]}
      standards={[
        {
          clause: `UX4G Accessibility Widget v${WIDGET_VERSION} — telemetry`,
          says: "On load the widget beacons the full page URL, referrer, user agent and screen data to audit360.ux4g.gov.in, and tracks every toggle after that.",
          does: "Telemetry is off by default; the wrapper sets the widget's own analytics config to disabled before its first beacon. Opt in with analytics on a public, non-authenticated property only.",
          why: "Portal URLs carry application and beneficiary identifiers in the path, so the full URL of every page view is not neutral data to send to a third party.",
        },
        {
          clause: `UX4G Accessibility Widget v${WIDGET_VERSION} — keyboard shortcut`,
          says: "Ctrl+F2 opens the panel, on every platform.",
          does: "On macOS the wrapper adds ⌘⌥A and relabels the trigger; Windows and Linux keep Ctrl+F2 untouched.",
          why: "Ctrl+F2 is a reserved macOS shortcut and F2 is a media key on Apple keyboards, so the advertised shortcut did not work for the keyboard users it exists for. ⌃⌥ was avoided because it is the VoiceOver modifier.",
        },
      ]}
      related={[
        { label: "Interaction States", href: "/design-system/foundations/states", reason: "owns focus/ring, focus/width and focus/offset" },
        { label: "Sizing", href: "/design-system/foundations/sizing", reason: "owns target/min, comfortable and spacious" },
        { label: "Color", href: "/design-system/foundations/color", reason: "the ink pairings measured for 4.5:1 and 3:1" },
        { label: "Iconography", href: "/design-system/foundations/iconography", reason: "an icon is never the only signal" },
      ]}
    />
  );
}
