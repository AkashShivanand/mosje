import * as React from "react";
import type { Metadata } from "next";
import {
  PropsTable,
  TokenTable,
  DoDont,
  A11yChecklist,
  Callout,
  StatusBadge,
  TerminalCode,
} from "@/components/design-system/docs-kit/index";
import { buttonClasses } from "@mosje/design-system";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";
import {
  AccessibilityBarPreview,
  AccessibilityBarNavyPreview,
  AccessibilityBarFontSizePreview,
} from "./accessibility-bar-preview";

export const metadata: Metadata = {
  title: "Accessibility Bar",
  description:
    "The government top utility bar (UX4G / GIGW) — Government of India link plus the accessibility controls (skip to content, font size, accessibility, language). The a11y surface itself, fully keyboard-operable and tokenised.",
};

const sectionStyle: React.CSSProperties = { marginBottom: "var(--sa-section-m)" };
const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-2-size)",
  fontWeight: 600,
  marginBottom: "var(--sa-stack-m)",
  scrollMarginTop: "var(--sa-section-m)",
};
const leadStyle: React.CSSProperties = {
  fontSize: "var(--sa-type-body-1-size)",
  color: "var(--sa-text-neutral-subtle)",
  lineHeight: "var(--sa-type-body-1-lh)",
  maxWidth: "64ch",
  marginBottom: "var(--sa-stack-m)",
};
const previewLabel: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)",
  fontWeight: 600,
  color: "var(--sa-text-neutral-subtle)",
  marginBottom: "var(--sa-stack-xs)",
};

const USAGE = `import { AccessibilityBar } from "@mosje/design-system";

<AccessibilityBar
  tone="blue"
  layout="wide"
  govLink={{ href: "https://india.gov.in/", label: "Government of India" }}
  skipTo="#main-content"
  accessibilityHref="/accessibility-statement"
  language={{ label: "English", onClick: openLanguageMenu }}
  onFontScaleChange={(scale) => persist(scale)}
/>`;

export default function AccessibilityBarPage(): React.JSX.Element {
  return (
    <>
      {/* ── Header ── */}
      <div style={{ marginBottom: "var(--sa-stack-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-s)", marginBottom: "var(--sa-stack-s)" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 500, lineHeight: 1.1 }}>Accessibility Bar</h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: 400, color: "var(--sa-color-text-default)", maxWidth: "62ch", lineHeight: 1.5 }}>
          The government top utility bar — the &ldquo;Government of India&rdquo; link and the
          accessibility controls that open every page.
        </p>
        <div style={{ marginTop: "var(--sa-stack-m)" }}>
          <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.accessibility)} target="_blank" rel="noopener noreferrer">
            View in Figma <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* ── Overview ── */}
      <section style={sectionStyle}>
        <h2 id="overview" style={h2Style}>Overview</h2>
        <p style={leadStyle}>
          The <strong>Accessibility Bar</strong> is the thin band that sits above the masthead on
          every government property (UX4G / GIGW). It carries the{" "}
          <strong>Government of India</strong> link on the left, and on the right the accessibility
          controls: <strong>Skip to content</strong>, <strong>Font size</strong> (A−/A/A+),{" "}
          <strong>Accessibility</strong>, and <strong>Language</strong> — each independently
          toggleable.
        </p>
        <p style={leadStyle}>
          It <em>is</em> the accessibility surface, so every control is keyboard-operable and
          announced, and the skip link is the first interactive element on the page.
        </p>
        <div style={{ marginTop: "var(--sa-padding-l)" }}>
          <div style={previewLabel}>Blue · full-bleed · all controls</div>
          <AccessibilityBarPreview />
        </div>
      </section>

      {/* ── Anatomy / tone ── */}
      <section style={sectionStyle}>
        <h2 id="tone" style={h2Style}>Tone</h2>
        <p style={leadStyle}>
          Two brand tones: <code>blue</code> (default, public site) and <code>navy</code> (portal
          chrome). The fill is a filled brand surface — one rung deeper than the brand ink — so
          white text clears AA.
        </p>
        <div style={previewLabel}>Navy · portal chrome</div>
        <AccessibilityBarNavyPreview />
      </section>

      {/* ── Font size ── */}
      <section style={sectionStyle}>
        <h2 id="font-size" style={h2Style}>Font size</h2>
        <p style={leadStyle}>
          The A−/A/A+ stepper drives a <code>--sa-font-scale</code> CSS variable on the document
          root (and a <code>data-sa-font-scale</code> attribute). Content that sizes in{" "}
          <code>rem</code> — or reads the variable — reflows with the reader&apos;s choice. Pass{" "}
          <code>onFontScaleChange</code> to persist it across pages.
        </p>
        <Callout type="info" title="Bar vs. widget">
          This standalone bar keeps the font-size control because the Figma component does. Note
          that <code>SiteHeader</code> renders its own Tier-1 bar with font-size deliberately{" "}
          <em>removed</em> — the official UX4G accessibility widget is the single canonical
          mechanism for font-size and contrast estate-wide. Use this component directly when you
          want the full bar in isolation.
        </Callout>
        <div style={{ marginTop: "var(--sa-padding-l)" }}>
          <AccessibilityBarFontSizePreview />
        </div>
      </section>

      {/* ── Layout ── */}
      <section style={sectionStyle}>
        <h2 id="layout" style={h2Style}>Layout (content width)</h2>
        <p style={leadStyle}>
          <code>layout</code> sets the inner content container&apos;s max-width, centred inside the
          full-bleed bar — reproducing UX4G&apos;s per-breakpoint padding with one mechanism.
        </p>
        <TokenTable
          tokens={[
            { token: "narrow", value: "720px", description: "Most inset — content matches a 720px page column." },
            { token: "wide", value: "1200px", description: "Default — content matches a 1200px page container." },
            { token: "fluid", value: "full-bleed", description: "No max-width; edge padding only." },
          ]}
        />
        <Callout type="warning" title="Naming note (carried from UX4G)">
          &ldquo;Fluid&rdquo; is actually the <em>widest</em> (full-bleed) and &ldquo;Narrow&rdquo;
          the most inset. The names are kept from UX4G for parity.
        </Callout>
      </section>

      {/* ── Usage ── */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>Usage</h2>
        <p style={leadStyle}>
          Set <code>onAccessibility</code> <em>or</em> <code>accessibilityHref</code>, not both:
          a handler opens a dialog; the href links to the GIGW-required accessibility statement.
        </p>
        <TerminalCode title="tsx" codeText={USAGE}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{USAGE}</pre>
        </TerminalCode>
      </section>

      {/* ── Token map ── */}
      <section style={sectionStyle}>
        <h2 id="tokens" style={h2Style}>Token map</h2>
        <p style={leadStyle}>
          Every value binds to an <code>--sa-*</code> token — no raw hex or px.
        </p>
        <TokenTable
          tokens={[
            { token: "--sa-color-action-primary-default", value: "bar fill (blue)", description: "Filled brand surface for tone=blue.", isColor: true },
            { token: "--sa-color-brand-navy", value: "bar fill (navy)", description: "Filled brand surface for tone=navy.", isColor: true },
            { token: "--sa-on-bg-brand-primary-bolder", value: "text / icons", description: "White content on the brand fill (AA on both tones).", isColor: true },
            { token: "--sa-border-neutral-inverse", value: "separators @ 40%", description: "The 1×20 dividers between control groups." },
            { token: "--sa-type-label-2-size / -lh", value: "12 / 16", description: "Bar type — Noto Sans Medium (UX4G navbar spec)." },
            { token: "--sa-shape-full", value: "pill radius", description: "Icon-button hit area (accessibility, language)." },
            { token: "--sa-focus-ring", value: "focus outline", description: "2px outline on every control (WCAG 2.4.7)." },
          ]}
        />
      </section>

      {/* ── Do / Don't ── */}
      <section style={sectionStyle}>
        <h2 id="guidelines" style={h2Style}>Do &amp; Don&apos;t</h2>
        <DoDont
          cards={[
            {
              type: "do",
              label: "Keep the skip link the first interactive element, pointing at a real #main-content landmark on the page.",
              preview: (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "var(--sa-stack-xs) var(--sa-stack-s)",
                    borderRadius: "var(--sa-shape-xs)",
                    background: "var(--sa-color-action-primary-default)",
                    color: "var(--sa-on-bg-brand-primary-bolder)",
                    fontSize: "var(--sa-type-label-2-size)",
                    fontWeight: 600,
                    outline: "2px solid var(--sa-focus-ring)",
                    outlineOffset: "2px",
                  }}
                >
                  Skip to Main Content
                </span>
              ),
            },
            {
              type: "dont",
              label: "Don't duplicate font-size/contrast in both the bar and the UX4G widget. Pick one mechanism per property so a reader isn't given two conflicting controls.",
              preview: (
                <div style={{ display: "flex", gap: "var(--sa-stack-s)", alignItems: "center", color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-label-2-size)" }}>
                  <span style={{ display: "inline-flex", gap: "var(--sa-stack-xs)", padding: "var(--sa-stack-xs) var(--sa-stack-s)", borderRadius: "var(--sa-shape-xs)", background: "var(--sa-bg-neutral-subtler)" }}>A− A A+</span>
                  <span aria-hidden="true">+</span>
                  <span style={{ padding: "var(--sa-stack-xs) var(--sa-stack-s)", borderRadius: "var(--sa-shape-xs)", background: "var(--sa-bg-neutral-subtler)" }}>Widget: text size</span>
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* ── Accessibility ── */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>Accessibility</h2>
        <A11yChecklist
          items={[
            { criterion: "Skip link is first in the tab order", level: "A", description: "WCAG 2.4.1 — the skip link is the page's first interactive element and must target an id that exists, or a keyboard user lands nowhere." },
            { criterion: "Text/UI contrast meets AA", level: "AA", description: "WCAG 1.4.3 — white on the brand fill is 6.36:1; the brand ink #0373DF (4.64:1) was rejected as a fill for this reason." },
            { criterion: "Every control keyboard-operable & labelled", level: "A", description: "WCAG 2.1.1 / 4.1.2 — the font-size buttons, accessibility entry and language selector are real buttons/links with aria-labels; the font-size group is a labelled group." },
            { criterion: "Visible focus is never removed", level: "AA", description: "WCAG 2.4.7 — every control shows a 2px --sa-focus-ring outline on focus-visible." },
          ]}
        />
      </section>

      {/* ── API ── */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>API</h2>
        <PropsTable
          props={[
            { name: "govLink", type: "{ href?; label?; flagSrc? }", default: "Government of India → india.gov.in", description: "The top-left link. Pass flagSrc to show the emblem/flag chip." },
            { name: "skipTo", type: "string", default: '"#main-content"', description: "Skip-link target. Must be an id that exists on the page." },
            { name: "showSkip", type: "boolean", default: "true", description: "Show the Skip to Main Content link." },
            { name: "fontSize", type: "boolean", default: "true", description: "Show the A−/A/A+ font-size control." },
            { name: "accessibility", type: "boolean", default: "true", description: "Show the accessibility entry (button or link)." },
            { name: "accessibilityHref", type: "string", default: '"/accessibility-statement"', description: "GIGW accessibility-statement page. Used when onAccessibility is not set." },
            { name: "onAccessibility", type: "() => void", description: "Makes the accessibility control a button (opens a dialog/widget). Set this OR accessibilityHref." },
            { name: "language", type: "{ label?; onClick? } | false", default: '{ label: "English" }', description: "Language selector. Pass false to hide." },
            { name: "layout", type: '"narrow" | "wide" | "fluid"', default: '"wide"', description: "Inner content-container width (720 / 1200 / full-bleed)." },
            { name: "tone", type: '"blue" | "navy"', default: '"blue"', description: "Brand fill of the bar." },
            { name: "onFontScaleChange", type: "(scale: number) => void", description: "Notified when the reader changes the font scale (0.9–1.2). Persist it to keep the choice across pages." },
            { name: "className", type: "string", description: "Additional classes merged onto the root." },
          ]}
        />
      </section>
    </>
  );
}
