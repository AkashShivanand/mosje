import * as React from "react";
import { DocsTabs } from "@/components/design-system/docs-kit";
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

const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-2-size)",
  fontWeight: 600,
  marginBottom: "var(--sa-stack-16)",
  scrollMarginTop: "var(--sa-section-48)",
};
const leadStyle: React.CSSProperties = {
  fontSize: "var(--sa-type-body-1-size)",
  color: "var(--sa-text-neutral-subtle)",
  lineHeight: "var(--sa-type-body-1-lh)",
  maxWidth: "64ch",
  marginBottom: "var(--sa-stack-16)",
};
const previewLabel: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)",
  fontWeight: 600,
  color: "var(--sa-text-neutral-subtle)",
  marginBottom: "var(--sa-stack-8)",
};

const USAGE = `import { AccessibilityBar } from "@mosje/design-system";

<AccessibilityBar
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
      <div style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", marginBottom: "var(--sa-stack-12)" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 500, lineHeight: 1.1 }}>Accessibility Bar</h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: 400, color: "var(--sa-color-text-default)", maxWidth: "62ch", lineHeight: 1.5 }}>
          The government top utility bar — the &ldquo;Government of India&rdquo; link and the
          accessibility controls that open every page.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.accessibility)} target="_blank" rel="noopener noreferrer">
            View in Figma <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* ── Overview ── */}
      
      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
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
        <div style={{ marginTop: "var(--sa-padding-20)" }}>
          <div style={previewLabel}>Blue · full-bleed · all controls</div>
          <AccessibilityBarPreview />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="tone" style={h2Style}>Tone</h2>
        <p style={leadStyle}>
          <strong>Tone is not a prop.</strong> Blue and Navy are the <em>brand axis</em>: put{" "}
          <code>data-brand=&quot;navy&quot;</code> on the bar or any ancestor and the same{" "}
          <code>bg/brand/primary/bolder</code> token re-resolves to the navy ramp (#003366).
          Figma models it identically, as Palette collection modes — which is why the master has
          no Tone variant. The fill is a filled brand surface, one rung deeper than the brand
          ink, so white text clears AA in both.
        </p>
        <div style={previewLabel}>Navy · via data-brand=&quot;navy&quot;</div>
        <AccessibilityBarNavyPreview />
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="font-size" style={h2Style}>Font size</h2>
        <p style={leadStyle}>
          The A−/A/A+ stepper sets <code>--sa-font-scale</code> and{" "}
          <code>data-sa-font-scale</code> on the document root, and a single rule consumes it:{" "}
          <code>:root[data-sa-font-scale] &#123; font-size: calc(100% * var(--sa-font-scale, 1)) &#125;</code>.
          Scaling the <strong>root</strong> carries the whole ramp, because the type scale is
          authored in <code>rem</code> — including both ends of every fluid <code>clamp()</code> —
          along with rem-based spacing, control heights and icons. The choice persists in{" "}
          <code>localStorage</code> and is restored on mount; <code>onFontScaleChange</code> is for
          consumers that need to mirror it somewhere else.
        </p>
        <Callout type="info" title="Armed by the attribute, not the fallback">
          The rule keys off <code>[data-sa-font-scale]</code>, which only a mounted bar sets. A page
          with no bar keeps the browser&apos;s own root size, so we never take over the
          reader&apos;s browser zoom uninvited.
        </Callout>
        <Callout type="warning" title="Two honest limits">
          The <code>vw</code> term inside a fluid <code>clamp()</code> is viewport-derived and does
          not scale, so fluid roles reach their (scaling) ceiling sooner. More importantly,{" "}
          <strong>hardcoded px in consuming markup is out of reach</strong>. Measured 1 → 1.2 on
          2026-08-18: this documentation surface resizes <strong>80.4%</strong> of its text
          elements, a portal <strong>29.3%</strong>, and the public homepage only{" "}
          <strong>14.0%</strong> — because that app is authored in Tailwind arbitrary px
          (<code>text-[15px]</code> and friends). The mechanism is correct; those pages are the
          defect.
        </Callout>
        <Callout type="info" title="Bar vs. widget — the masthead reversed on 2026-08-18">
          <code>SiteHeader</code> used to pass <code>fontSize=&#123;false&#125;</code>, on the
          grounds that the UX4G widget was the single mechanism and a second stepper would double
          up. That premise was never true in practice: the stepper wrote a variable{" "}
          <em>nothing read</em>, so it was not a competing mechanism, it was an inert control. It
          is <strong>ON</strong> now, and the widget&apos;s floating button is hidden wherever the
          bar offers the same entry — one door, not two. Contrast, spacing and dark mode remain the
          widget&apos;s.
        </Callout>
        <div style={{ marginTop: "var(--sa-padding-20)" }}>
          <AccessibilityBarFontSizePreview />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
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
                    padding: "var(--sa-stack-8) var(--sa-stack-12)",
                    borderRadius: "var(--sa-shape-4)",
                    background: "var(--sa-color-action-primary-default)",
                    color: "var(--sa-on-bg-brand-primary-bolder)",
                    fontSize: "var(--sa-type-label-2-size)",
                    fontWeight: 600,
                    outline: "2px solid var(--sa-text-neutral-inverse)",
                    outlineOffset: "2px",
                  }}
                >
                  Skip to Main Content
                </span>
              ),
            },
            {
              type: "dont",
              label: "Don't surface the same property in both the bar and the widget's floating button. One property, one visible door: text size is the bar's, contrast and spacing are the widget's, and the FAB is hidden (not unmounted) where the bar already offers the entry.",
              preview: (
                <div style={{ display: "flex", gap: "var(--sa-stack-12)", alignItems: "center", color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-label-2-size)" }}>
                  <span style={{ display: "inline-flex", gap: "var(--sa-stack-8)", padding: "var(--sa-stack-8) var(--sa-stack-12)", borderRadius: "var(--sa-shape-4)", background: "var(--sa-bg-neutral-subtler)" }}>A− A A+</span>
                  <span aria-hidden="true">+</span>
                  <span style={{ padding: "var(--sa-stack-8) var(--sa-stack-12)", borderRadius: "var(--sa-shape-4)", background: "var(--sa-bg-neutral-subtler)" }}>Widget: text size</span>
                </div>
              ),
            },
          ]}
        />
      </section>

              </div>
            )
          },
          {
            id: "develop",
            label: "Develop",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="states" style={h2Style}>Interaction states</h2>
        <p style={leadStyle}>
          Every <strong>clickable</strong> control on the bar resolves through four states, defined
          in § 04 of the Figma documentation page. <code>:active</code> is declared{" "}
          <em>after</em> <code>:hover</code> at equal specificity — a pointer is almost always
          hovering the control it presses, so the reverse order makes the pressed state
          unreachable.
        </p>
        <TokenTable
          tokens={[
            { token: "(none)", value: "Default", description: "Resting. No background; the glyph is icon/neutral/inverse." },
            { token: "--sa-cmp-accessibilityBar-hoverBg", value: "Hover · white 8%", description: "Figma overlay/on-brand/hover (#ffffff14). Carried an invented 12% until 2026-08-18.", isColor: true },
            { token: "--sa-text-neutral-inverse", value: "Focus-visible · 2px ring", description: "Never removed. Inverse ink, NOT focus/ring — see the warning below.", isColor: true },
            { token: "--sa-cmp-accessibilityBar-pillBg", value: "Active · white 16%", description: "Figma overlay/on-brand/pressed (#ffffff29). Pressed — or the step button matching the direction moved in (A− below default, A+ above). Never the centre.", isColor: true },
          ]}
        />
        <Callout type="info" title="The direction button lights — never the centre">
          <strong>A−</strong> lights below the default size, <strong>A+</strong> above it,
          neither at it. Press <strong>A+</strong> and <strong>A+</strong> lights, which is what
          a person expects — and a lit <strong>A−</strong> versus a lit <strong>A+</strong> says
          which way you went. The centre is purely the reset.
          <br /><br />
          It lit the <em>centre</em> until 2026-08-19, and that was wrong twice over: the
          highlight sat on a button nobody had pressed, so it read as “the centre is selected”,
          and one indicator cannot express direction — 90% and 120% looked identical.
        </Callout>
        <Callout type="info" title="It carries no aria-pressed, deliberately">
          The middle <strong>A</strong> is a reset <em>action</em>, not a toggle — announcing it as
          pressed/unpressed described a control that does not exist. The state a screen-reader user
          needs is the current size, so the accessible name carries it:{" "}
          <code>Text size: 100% (default)</code> at rest,{" "}
          <code>Reset text size to default — currently 110%</code> when deviated. It stays{" "}
          <strong>enabled</strong> at the default: disabling it on reset would destroy focus at the
          exact moment the reader activated it.
        </Callout>
        <Callout type="info" title="Hit areas are ≥24×24 — WCAG 2.2 AA 2.5.8">
          Steppers are 24×24, icon buttons 28×28, measured live. The Figma master carried bare
          20×20 glyphs until 2026-08-18 and gained matching transparent <code>hit-area</code>{" "}
          frames — the target grew, the look did not.
        </Callout>
        <Callout type="warning" title="Do not use focus/ring on this bar">
          <code>focus/ring</code> is <code>#0373DF</code>, and on the bar&apos;s{" "}
          <code>#005EB9</code> fill it measures <strong>1.37:1</strong> — far below the{" "}
          <strong>3:1</strong> WCAG 1.4.11 / 2.4.11 require of a focus indicator, i.e. close to
          invisible exactly where a keyboard user needs it. Inverse ink measures{" "}
          <strong>6.36:1</strong>. The Figma page specified <code>focus/ring</code> and was
          corrected on 2026-08-18. A ring&apos;s contrast is a property of what it lands on, not of
          its name.
        </Callout>
        <Callout type="info" title="Text links are not tinted">
          The Government-of-India and skip links carry the underline affordance instead. Tinting
          them would invent a control affordance the master does not have.
        </Callout>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
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
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>Usage</h2>
        <p style={leadStyle}>
          Set <code>onAccessibility</code> <em>or</em> <code>accessibilityHref</code>, not both:
          a handler opens a dialog; the href links to the GIGW-required accessibility statement.
        </p>
        <TerminalCode title="tsx" codeText={USAGE}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{USAGE}</pre>
        </TerminalCode>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="tokens" style={h2Style}>Token map</h2>
        <p style={leadStyle}>
          Every value binds to an <code>--sa-*</code> token — no raw hex or px.
        </p>
        <TokenTable
          tokens={[
            { token: "--sa-bg-brand-primary-bolder", value: "bar fill", description: "The ONLY fill. Re-resolves to the navy ramp (#003366) under data-brand=\"navy\" — no second token, no tone prop.", isColor: true },
            { token: "--sa-text-neutral-inverse", value: "text / icons", description: "White content on the brand fill (AA on both brands).", isColor: true },
            { token: "--sa-border-neutral-inverse-subtle", value: "separators @ 40%", description: "Reached through the Divider component (Vertical / Inverse subtle), not referenced directly. The bar draws no rule of its own." },
            { token: "--sa-type-body-2-size / -lh", value: "14 / 20", description: "Bar type — Noto Sans Regular. Raised from label-2 (12 / 16) when the master moved to 14." },
            { token: "--sa-shape-2 / --sa-shape-4", value: "flag chip / control radius", description: "Unified 2026-08-19 — the steppers, the reset pill and both icon buttons share shape/4, so one row of controls reads as one shape." },
            { token: "--sa-cmp-accessibilityBar-stepSize / -iconButtonSize", value: "24 / 28", description: "Hit areas. WCAG 2.2 · 2.5.8 Target Size (Minimum) is 24×24 at AA — 44×44 is 2.5.5 Enhanced (AAA) and is not claimed." },
            { token: "--sa-text-neutral-inverse", value: "focus outline", description: "2px, offset 2 (WCAG 2.4.7). Deliberately NOT --sa-focus-ring: that is #0373DF and measures 1.37:1 on this bar's #005EB9 fill, failing 1.4.11. Inverse ink is 6.36:1." },
          ]}
        />
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="api" style={h2Style}>API</h2>
        <PropsTable
          props={[
            { name: "govLink", type: "{ href?; label?; flagSrc? }", default: "Government of India → india.gov.in", description: "The top-left link. Pass flagSrc to show the emblem/flag chip." },
            { name: "skipTo", type: "string", default: '"#main-content"', description: "Skip-link target. Must be an id that exists on the page." },
            { name: "showSkip", type: "boolean", default: "true", description: "Show the Skip to Main Content link." },
            { name: "skipLabel", type: "string", default: '"Skip to Main Content"', description: "The skip link's visible text (Figma: Skip label). A prop rather than a fixed string because the estate is bilingual — a Hindi surface needs its own wording." },
            { name: "fontSize", type: "boolean", default: "true", description: "Show the A−/A/A+ font-size control." },
            { name: "accessibility", type: "boolean", default: "true", description: "Show the accessibility entry (button or link)." },
            { name: "accessibilityHref", type: "string", default: '"/accessibility-statement"', description: "GIGW accessibility-statement page. Used when onAccessibility is not set." },
            { name: "onAccessibility", type: "() => void", description: "Makes the accessibility control a button (opens a dialog/widget). Set this OR accessibilityHref." },
            { name: "language", type: "{ label?; onClick? } | false", default: '{ label: "English" }', description: "Language selector. Pass false to hide." },
            { name: "layout", type: '"narrow" | "wide" | "fluid"', default: '"wide"', description: "Inner content-container width (720 / 1200 / full-bleed)." },
            { name: "device", type: '"auto" | "mobile" | "tablet" | "desktop" | "desktop-xl"', default: '"auto"', description: "Figma's Device axis. auto resolves the same breakpoints in CSS so one instance adapts; pin a device only to reproduce a single variant." },
            { name: "maxWidth", type: "number", description: "Explicit container max-width (px), overriding the layout preset. SiteHeader passes its own so the bar aligns with the rows below it." },
            { name: "onFontScaleChange", type: "(scale: number) => void", description: "Notified when the reader changes the font scale (0.9–1.2). Persist it to keep the choice across pages." },
            { name: "className", type: "string", description: "Additional classes merged onto the root." },
          ]}
        />
      </section>

              </div>
            )
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="accessibility" style={h2Style}>Accessibility</h2>
        <A11yChecklist
          items={[
            { criterion: "Skip link is first in the tab order", level: "A", description: "WCAG 2.4.1 — the skip link is the page's first interactive element and must target an id that exists, or a keyboard user lands nowhere." },
            { criterion: "Text/UI contrast meets AA", level: "AA", description: "WCAG 1.4.3 — white on the brand fill is 6.36:1; the brand ink #0373DF (4.64:1) was rejected as a fill for this reason." },
            { criterion: "Every control keyboard-operable & labelled", level: "A", description: "WCAG 2.1.1 / 4.1.2 — the font-size buttons, accessibility entry and language selector are real buttons/links with aria-labels; the font-size group is a labelled group." },
            { criterion: "Visible focus is never removed", level: "AA", description: "WCAG 2.4.7 — every control shows a 2px inverse-ink outline on focus-visible, offset 2. Not --sa-focus-ring: that is #0373DF and measures 1.37:1 on this bar's #005EB9 fill, failing 1.4.11. Inverse ink is 6.36:1." },
          ]}
        />
      </section>

              </div>
            )
          }
        ]}
      />

    </>
  );
}
