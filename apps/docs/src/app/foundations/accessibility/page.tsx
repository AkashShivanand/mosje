import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { A11yChecklist, Callout } from "@/components/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/figma";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Accessibility is the foundation of SAMAVESH — WCAG 2.2 AA + GIGW, the POUR principles, and practical checklists for designers and developers.",
};

export default function AccessibilityPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Accessibility</h1>
      <p style={{ fontSize: "var(--ds-text-headline)", color: "var(--ds-ink-muted)", marginTop: "var(--ds-spacing-md)" }}>
        Accessibility is not a feature — it&apos;s the foundation. These are
        government services that every citizen must be able to use, regardless of
        ability, device or connection.
      </p>
      <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.accessibility)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="standard" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="standard">WCAG 2.2 AA + GIGW</h2>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <strong>WCAG 2.2</strong> (Web Content Accessibility Guidelines) is the
          international standard for accessible digital content. Each guideline
          has three conformance levels — A, AA and AAA. SAMAVESH targets{" "}
          <strong>AA</strong>, the level expected of public services worldwide.
        </p>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <strong>GIGW</strong> (Guidelines for Indian Government Websites and
          Apps) builds on WCAG and is the national standard for government
          digital properties in India. Meeting WCAG 2.2 AA and GIGW is{" "}
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

      <section aria-labelledby="designers" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="designers">Checklist for designers</h2>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>
            <strong>Contrast ratios:</strong> at least 4.5:1 for normal text and
            3:1 for large text and meaningful icons.
          </li>
          <li>
            <strong>Touch targets:</strong> interactive elements at least 44×44px
            so they are easy to tap.
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
                description: "Touch targets are at least 44×44px (WCAG 2.2 Target Size).",
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
