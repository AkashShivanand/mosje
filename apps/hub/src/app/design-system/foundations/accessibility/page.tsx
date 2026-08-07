import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { A11yChecklist, Callout, TerminalCode, PropsTable } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "The accessibility baseline for SAMAVESH — WCAG 2.1 AA + GIGW, the POUR principles, and practical checklists for designers and developers.",
};

const WIDGET_IMPORT_SNIPPET = `import { UX4GAccessibilityWidget } from "@mosje/design-system";

// render once near the end of the root layout, alongside AppSwitcher:
<UX4GAccessibilityWidget />`;

const WIDGET_EMBED_SNIPPET = `<script src="https://cdn.ux4g.gov.in/accessibility-beta-v1.15/accessibility-widget.js" defer></script>`;

export default function AccessibilityPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Accessibility</h1>
      <p style={{ fontSize: "var(--ds-text-headline)", lineHeight: "var(--ds-leading-headline)", color: "var(--ds-ink-muted)", marginTop: "var(--ds-spacing-md)" }}>
        These are government services. Every citizen must be able to use them,
        whatever their ability, device or connection — so accessibility is a
        release requirement here, not a later pass.
      </p>
      <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.accessibility)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="standard" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="standard">WCAG 2.1 AA + GIGW</h2>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <strong>WCAG 2.1</strong> (Web Content Accessibility Guidelines) is the
          international standard for accessible digital content. Each guideline
          has three conformance levels — A, AA and AAA. SAMAVESH targets{" "}
          <strong>AA</strong>, the level expected of public services worldwide.
          Individual criteria introduced in <strong>WCAG 2.2</strong> — target
          size, for one — are adopted where they are already met; that is not a
          claim of full 2.2 conformance, which has not been audited.
        </p>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <strong>GIGW</strong> (Guidelines for Indian Government Websites and
          Apps) builds on WCAG and is the national standard for government
          digital properties in India. Meeting WCAG 2.1 AA and GIGW is{" "}
          <strong>legally required</strong> for Indian government websites — it
          is not optional, and it is the baseline every MoSJE property must
          clear before it ships.
        </p>
      </section>

      <section aria-labelledby="pour" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="pour">The four POUR principles</h2>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          WCAG is built on four ideas. In plain English:
        </p>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>
            <strong>Perceivable</strong> — people must be able to sense the
            content. Provide text alternatives for images, captions for media,
            and enough colour contrast to read comfortably.
          </li>
          <li>
            <strong>Operable</strong> — people must be able to use it. Everything
            works with a keyboard, nothing depends on a precise gesture, and
            users have enough time to act.
          </li>
          <li>
            <strong>Understandable</strong> — content and controls must make
            sense. Use clear language, predictable behaviour, and helpful error
            messages.
          </li>
          <li>
            <strong>Robust</strong> — it must work with the tools people rely on.
            Clean, semantic markup so screen readers and assistive technology
            can interpret the page reliably.
          </li>
        </ul>
      </section>

      <section aria-labelledby="widget" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="widget">The Accessibility Widget</h2>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          Accessibility settings across the SAMAVESH estate are delivered by the{" "}
          <strong>official Government of India (MeitY / UX4G) Accessibility
          Widget</strong> — a control fixed to the viewport that lets any citizen
          adapt the page to their needs without a separate settings screen. It is
          the <strong>single, canonical</strong> accessibility and high-contrast
          mechanism for every portal and site; do not build per-app contrast
          toggles. It is centrally maintained by MeitY and complies with{" "}
          <strong>WCAG, GIGW and IS 17802</strong>.
        </p>

        <h3 id="widget-features" style={{ marginTop: "var(--ds-spacing-2xl)" }}>
          What it provides
        </h3>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li><strong>Contrast &amp; invert</strong> — high-contrast and inverted-colour modes.</li>
          <li><strong>Dark / light mode</strong> — switch the page between light and dark.</li>
          <li><strong>Bigger text</strong> — scale text up for readability.</li>
          <li><strong>Text spacing</strong> — increase letter and word spacing.</li>
          <li><strong>Line height</strong> — loosen line spacing.</li>
          <li><strong>Dyslexia-friendly font</strong> — swap to a dyslexia-legible typeface.</li>
          <li><strong>Highlight links</strong> — make links visually prominent.</li>
          <li><strong>Hide images</strong> — remove imagery to reduce distraction.</li>
          <li><strong>Bigger cursor</strong> — enlarge the pointer.</li>
          <li><strong>Screen reader</strong> — read page content aloud.</li>
        </ul>
        <p style={{ marginTop: "var(--ds-spacing-md)", color: "var(--ds-ink-muted)" }}>
          Preferences persist as the user navigates. The control is keyboard-operable and screen-reader labelled.
        </p>

        <h3 id="widget-integration" style={{ marginTop: "var(--ds-spacing-2xl)" }}>
          How to integrate
        </h3>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          In any app in this estate, render the shared wrapper once near the end of
          the root layout (alongside <code>AppSwitcher</code>). It injects the
          official widget script idempotently — never hand-embed the script.
        </p>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <TerminalCode title="app/layout.tsx" codeText={WIDGET_IMPORT_SNIPPET}>
            {WIDGET_IMPORT_SNIPPET}
          </TerminalCode>
        </div>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          Outside this monorepo (plain HTML, PHP, WordPress, etc.), embed the
          official script directly before <code>&lt;/body&gt;</code>:
        </p>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <TerminalCode title="html" codeText={WIDGET_EMBED_SNIPPET}>
            {WIDGET_EMBED_SNIPPET}
          </TerminalCode>
        </div>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <PropsTable
            props={[
              {
                name: "src",
                type: "string",
                default: "UX4G_A11Y_WIDGET_SRC",
                description:
                  "Override the widget script URL — e.g. to pin a specific version or self-host the script.",
              },
            ]}
          />
        </div>

        <h3 id="widget-theming" style={{ marginTop: "var(--ds-spacing-2xl)" }}>
          Behaviour &amp; theming
        </h3>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>
            The widget applies the class <code>.dark-mode</code> to{" "}
            <code>&lt;html&gt;</code> for its own dark theme. This is{" "}
            <strong>separate</strong> from the design system&apos;s{" "}
            <code>data-theme</code> / <code>data-brand</code> token theming —
            keep the citizen-facing accessibility control and product/brand
            theming as distinct concerns.
          </li>
          <li>
            Deployments must allow the UX4G CDN (<code>cdn.ux4g.gov.in</code>) in
            their Content-Security-Policy.
          </li>
        </ul>

        <div style={{ marginTop: "var(--ds-spacing-xl)" }}>
          <Callout type="warning" title="One mechanism only">
            The bespoke <code>AccessibilityWidget</code> reimplementation and every
            per-app font-size/contrast toggle have been removed — everything routes
            through the official UX4G widget now. Full writeup:{" "}
            <code>docs/specs/samavesh-accessibility-consolidation.md</code>.
          </Callout>
        </div>
      </section>

      <section aria-labelledby="designers" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="designers">Checklist for designers</h2>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>
            <strong>Contrast ratios:</strong> at least 4.5:1 for normal text and
            3:1 for large text and meaningful icons.
          </li>
          <li>
            <strong>Touch targets:</strong> interactive elements at least
            24×24px — the Level AA minimum. Form controls and the large button
            use 44px, which is the stricter Level AAA size.
          </li>
          <li>
            <strong>Focus indicators:</strong> design a visible focus state for
            every interactive element — never rely on colour alone.
          </li>
          <li>
            <strong>Don&apos;t rely on colour:</strong> pair colour with text,
            icons or patterns so meaning survives for colour-blind users.
          </li>
        </ul>
      </section>

      <section aria-labelledby="developers" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="developers">Checklist for developers</h2>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>
            <strong>Semantic HTML:</strong> use the right element — buttons,
            headings, lists, landmarks — before reaching for ARIA.
          </li>
          <li>
            <strong>ARIA labels:</strong> give icon-only and ambiguous controls
            an accessible name; don&apos;t over-apply ARIA where HTML already
            conveys the role.
          </li>
          <li>
            <strong>Keyboard navigation:</strong> every action reachable and
            operable with Tab, Enter, Space and arrow keys, in a logical order.
          </li>
          <li>
            <strong>Screen reader testing:</strong> test real flows with a
            screen reader, not just an automated scan.
          </li>
        </ul>
      </section>

      <section aria-labelledby="baseline" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="baseline">Baseline requirements</h2>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          Every SAMAVESH page must meet these as a minimum:
        </p>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <A11yChecklist
            items={[
              {
                criterion: "Text contrast",
                level: "AA",
                description: "Body text reaches at least 4.5:1 against its background.",
              },
              {
                criterion: "Keyboard operable",
                level: "A",
                description: "All functionality is available without a mouse.",
              },
              {
                criterion: "Visible focus",
                level: "AA",
                description: "A clear focus indicator appears on every interactive element.",
              },
              {
                criterion: "Target size",
                level: "AA",
                description:
                  "Targets are at least 24×24px — SC 2.5.8 Target Size (Minimum). The 44×44px figure often quoted is SC 2.5.5 Target Size (Enhanced), which is Level AAA; form controls meet it, the sm and md buttons do not.",
              },
              {
                criterion: "Text alternatives",
                level: "A",
                description: "Informative images carry meaningful alt text; decorative ones are hidden.",
              },
              {
                criterion: "Accessible names",
                level: "A",
                description: "Form fields, buttons and links each have a clear accessible name.",
              },
              {
                criterion: "GIGW conformance",
                level: "GIGW",
                description: "Meets the Guidelines for Indian Government Websites and Apps.",
              },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="testing" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="testing">How to test</h2>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>
            <strong>axe DevTools</strong> — a free browser extension that flags
            common issues automatically. A great first pass, but it cannot catch
            everything.
          </li>
          <li>
            <strong>VoiceOver on macOS</strong> — turn it on with{" "}
            <code>Cmd + F5</code> and navigate the page by ear to hear what a
            blind user experiences.
          </li>
          <li>
            <strong>Keyboard-only navigation</strong> — unplug the mouse and Tab
            through the whole flow. If you can&apos;t reach or operate something,
            neither can many of your users.
          </li>
        </ul>
      </section>

      <section aria-labelledby="built-in" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="built-in">Built-in by default</h2>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <Callout type="info" title="Components ship accessible">
            SAMAVESH components ship with accessibility built in — semantic
            markup, focus management, accessible names and contrast are already
            handled. The checklist above is for custom implementations and
            anything you build outside the shared components.
          </Callout>
        </div>
      </section>
    </article>
  );
}
