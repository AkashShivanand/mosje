import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  DoDont,
  TokenTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import {
  AccessibilityBarFontSizePreview,
  AccessibilityBarNavyPreview,
  AccessibilityBarPreview,
} from "./accessibility-bar-preview";

export const metadata: Metadata = {
  title: "Accessibility Bar — Design System",
  description:
    "The government top utility bar (UX4G / GIGW) — the Government of India link and the accessibility controls that open every page: skip to content, text size, accessibility, language.",
};

const USAGE = `import { AccessibilityBar } from "@mosje/design-system";

<AccessibilityBar
  layout="page"
  govLink={{ href: "https://india.gov.in/", label: "Government of India", flagSrc: "/website/images/Indian-Flag.svg" }}
  skipTo="#main-content"
  accessibilityHref="/accessibility-statement"
  language={{ label: "English", onClick: openLanguageMenu }}
  onFontScaleChange={(scale) => persist(scale)}
/>`;

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.1 Bypass Blocks",
    level: "A",
    description:
      "The skip link is the page's first interactive element and must target an id that exists. It is kept on mobile even where the rest of the right-hand cluster collapses, because dropping the page's only bypass mechanism would fail a mandatory criterion.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "White on the brand fill measures 6.36:1. The brand ink #0373DF was rejected as a fill for this bar at 4.64:1 against white content.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "The text-size buttons, the accessibility entry and the language selector are real buttons and links, each with an accessible name; the text-size group is a labelled group.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description:
      "Every control draws a 2px inverse-ink outline on `:focus-visible`, offset 2, and the stylesheet never removes it. Deliberately not `--sa-focus-ring`: that is #0373DF and measures 1.37:1 on this bar's #005EB9 fill.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "The focus indicator clears 3:1 against the bar. A ring's contrast is a property of what it lands on, not of its name — the Figma page specified focus/ring and was corrected on 2026-08-18.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "Text-size steppers are 24×24 and icon buttons 28×28, measured live. The Figma master carried bare 20×20 glyphs until 2026-08-18 and gained matching transparent hit-area frames — the target grew, the look did not. 44×44 is 2.5.5 Enhanced (AAA) and is not claimed.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The reset button carries no `aria-pressed`, deliberately: it is an action, not a toggle. The state a screen-reader user needs is the current size, so the accessible name carries it — \"Text size: 100% (default)\" at rest, \"Reset text size to default — currently 110%\" when deviated. It stays enabled at the default, because disabling it on reset would destroy focus at the moment the reader activated it.",
  },
  {
    criterion: "GIGW 3.0 — Mandatory features",
    level: "GIGW",
    description: "The Government of India link, the skip link, the accessibility entry and the language selector are the bar GIGW expects on a government property.",
  },
];

export default function AccessibilityBarPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Accessibility Bar"
      status="Stable"
      summary="The thin band above the masthead on every government property — the Government of India link on the left, and on the right the controls that open every page: skip to content, text size, accessibility and language. It is the accessibility surface itself, so every control is keyboard-operable and announced."
      figma={{ node: "accessibility" }}
      specimen={<AccessibilityBarPreview />}
      propsFrom="AccessibilityBarProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A public page or a portal needs the Government of India utility band above its masthead.",
          "A page needs a skip link, and it should be the first interactive element on the page.",
          "A property is built outside SiteHeader and still owes a reader the estate's text-size control.",
        ],
        avoid: [
          "You are building a public page with SiteHeader — it renders this bar as its own first tier, and a second one would give the page two skip links to the same target.",
          "You want contrast, spacing or dark mode — those are the UX4G Accessibility Widget's, and duplicating them here would give one property two visible doors.",
          "You want a page-level navigation bar — use Site Header or Tabs; this band is a utility strip, not navigation.",
        ],
      }}
      related={[
        { label: "UX4G Accessibility Widget", href: "/design-system/components/utilities/ux4g-accessibility-widget", reason: "the panel the accessibility control opens" },
        { label: "Site Header", href: "/design-system/components/section-templates/site-header", reason: "renders this bar as its first tier and passes its own maxWidth" },
        { label: "Nav Sheet", href: "/design-system/components/navigation/nav-sheet", reason: "where the right-hand cluster goes on mobile" },
        { label: "Divider", href: "/design-system/components/layout/divider", reason: "the separators between the bar's controls; the bar draws no rule of its own" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-tone">
            <h2 id="cdp-tone" className="cdp__h2">
              Tone Is Not a Prop
            </h2>
            <p>
              Blue and Navy are the <strong>brand axis</strong>. Put{" "}
              <code>data-brand=&quot;navy&quot;</code> on the bar or any ancestor and the same{" "}
              <code>bg/brand/primary/bolder</code> token re-resolves to the navy ramp
              (#003366). Figma models it identically, as Palette collection modes, which is why the
              master carries no Tone variant. The fill is a filled brand surface one rung deeper
              than the brand ink, so white text clears AA on both.
            </p>
            <AccessibilityBarNavyPreview />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-fontsize">
            <h2 id="cdp-fontsize" className="cdp__h2">
              Text Size
            </h2>
            <p>
              The A−/A/A+ stepper sets <code>--sa-font-scale</code> and{" "}
              <code>data-sa-font-scale</code> on the document root, and a single rule consumes
              it: <code>:root[data-sa-font-scale] &#123; font-size: calc(100% * var(--sa-font-scale, 1)) &#125;</code>.
              Scaling the <strong>root</strong> carries the whole ramp, because the type scale is
              authored in <code>rem</code> — including both ends of every fluid{" "}
              <code>clamp()</code> — along with rem-based spacing, control heights and icons. The
              choice persists in <code>localStorage</code> and is restored on mount;{" "}
              <code>onFontScaleChange</code> is for consumers that need to mirror it elsewhere.
            </p>
            <Callout type="info" title="Armed by the attribute, not the fallback">
              The rule keys off <code>[data-sa-font-scale]</code>, which only a mounted bar sets. A
              page with no bar keeps the browser&apos;s own root size, so the reader&apos;s browser
              zoom is never taken over uninvited.
            </Callout>
            <Callout type="warning" title="Two honest limits">
              The <code>vw</code> term inside a fluid <code>clamp()</code> is viewport-derived and
              does not scale, so fluid roles reach their (scaling) ceiling sooner. More
              importantly, <strong>hardcoded px in consuming markup is out of reach</strong>.
              Measured 1 → 1.2 on 2026-08-18: this documentation surface resizes{" "}
              <strong>80.4%</strong> of its text elements, a portal <strong>29.3%</strong>, and the
              public homepage only <strong>14.0%</strong> — because that app is authored in
              Tailwind arbitrary px (<code>text-[15px]</code> and friends). The mechanism is
              correct; those pages are the defect.
            </Callout>
            <Callout type="info" title="Bar or widget — the masthead reversed on 2026-08-18">
              <code>SiteHeader</code> used to pass <code>fontSize=&#123;false&#125;</code>, on the
              grounds that the UX4G widget was the single mechanism and a second stepper would
              double up. That premise was never true in practice: the stepper wrote a variable{" "}
              <em>nothing read</em>, so it was not a competing mechanism, it was an inert control.
              It is <strong>on</strong> now, and the widget&apos;s floating button is hidden
              wherever the bar offers the same entry — one door, not two. Contrast, spacing and
              dark mode remain the widget&apos;s.
            </Callout>
            <AccessibilityBarFontSizePreview />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-dodont">
            <h2 id="cdp-dodont" className="cdp__h2">
              Do and Don&rsquo;t
            </h2>
            <DoDont
              cards={[
                {
                  type: "do",
                  label:
                    "Keep the skip link the first interactive element, pointing at a real #main-content landmark on the page.",
                  preview: <AccessibilityBarPreview />,
                },
                {
                  type: "dont",
                  label:
                    "Don't surface the same property in both the bar and the widget's floating button. One property, one visible door: text size is the bar's, contrast and spacing are the widget's, and the floating button is hidden — not unmounted — where the bar already offers the entry.",
                  preview: <AccessibilityBarFontSizePreview />,
                },
              ]}
            />
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-usage">
            <h2 id="cdp-usage" className="cdp__h2">
              Usage
            </h2>
            <p>
              Set <code>onAccessibility</code> <em>or</em> <code>accessibilityHref</code>, not
              both: a handler opens a dialog, the href links to the GIGW-required accessibility
              statement.
            </p>
            <CodeBlock>{USAGE}</CodeBlock>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              Interaction States
            </h2>
            <p>
              Every clickable control on the bar resolves through four states, defined in § 04 of
              the Figma documentation page. <code>:active</code> is declared <em>after</em>{" "}
              <code>:hover</code> at equal specificity — a pointer is almost always hovering the
              control it presses, so the reverse order makes the pressed state unreachable.
            </p>
            <TokenTable
              tokens={[
                { token: "(none)", value: "Default", description: "Resting. No background; the glyph is icon/neutral/inverse." },
                {
                  token: "--sa-cmp-accessibilityBar-hoverBg",
                  value: "Hover · white 8%",
                  description: "Figma overlay/on-brand/hover (#ffffff14). Carried an invented 12% until 2026-08-18.",
                  isColor: true,
                },
                {
                  token: "--sa-text-neutral-inverse",
                  value: "Focus-visible · 2px ring",
                  description: "Never removed. Inverse ink, not focus/ring — see the warning below.",
                  isColor: true,
                },
                {
                  token: "--sa-cmp-accessibilityBar-pillBg",
                  value: "Active · white 16%",
                  description:
                    "Figma overlay/on-brand/pressed (#ffffff29). Pressed — or the step button matching the direction moved in (A− below default, A+ above). Never the centre.",
                  isColor: true,
                },
              ]}
            />
            <Callout type="info" title="The direction button lights — never the centre">
              <strong>A−</strong> lights below the default size, <strong>A+</strong> above it,
              neither at it. Press <strong>A+</strong> and <strong>A+</strong> lights, which is what
              a person expects — and a lit <strong>A−</strong> versus a lit <strong>A+</strong> says
              which way you went. The centre is purely the reset.
              <br />
              <br />
              It lit the <em>centre</em> until 2026-08-19, and that was wrong twice over: the
              highlight sat on a button nobody had pressed, so it read as &ldquo;the centre is
              selected&rdquo;, and one indicator cannot express direction — 90% and 120% looked
              identical.
            </Callout>
            <Callout type="warning" title="Do not use focus/ring on this bar">
              <code>focus/ring</code> is <code>#0373DF</code>, and on the bar&apos;s{" "}
              <code>#005EB9</code> fill it measures <strong>1.37:1</strong> — far below the{" "}
              <strong>3:1</strong> WCAG 1.4.11 and 2.4.11 require of a focus indicator, which is
              close to invisible exactly where a keyboard user needs it. Inverse ink measures{" "}
              <strong>6.36:1</strong>.
            </Callout>
            <Callout type="info" title="Text links are not tinted">
              The Government-of-India and skip links carry the underline affordance instead.
              Tinting them would invent a control affordance the master does not have.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-layout">
            <h2 id="cdp-layout" className="cdp__h2">
              Layout (Content Width)
            </h2>
            <p>
              <code>layout</code> sets the inner content container&apos;s max-width, centred inside
              the full-bleed bar — reproducing UX4G&apos;s per-breakpoint padding with one
              mechanism.
            </p>
            <TokenTable
              tokens={[
                { token: "narrow", value: "720px", description: "Most inset — content matches a 720px page column." },
                { token: "wide", value: "flat 1200px", description: "The default. It never steps, so it is the wrong choice above page content on a wide screen." },
                { token: "page", value: "1200 · 1320 · 1440", description: "The estate's three-step ladder. Use this whenever the bar sits above page content." },
                { token: "fluid", value: "full-bleed", description: "No max-width; edge padding only." },
              ]}
            />
            <Callout type="warning" title="Naming note (carried from UX4G)">
              &ldquo;Fluid&rdquo; is actually the <em>widest</em> (full-bleed) and
              &ldquo;narrow&rdquo; the most inset. The names are kept from UX4G for parity.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tokens">
            <h2 id="cdp-tokens" className="cdp__h2">
              Token Map
            </h2>
            <p>
              Every value binds to an <code>--sa-*</code> token — no raw hex, no raw px.
            </p>
            <TokenTable
              tokens={[
                {
                  token: "--sa-bg-brand-primary-bolder",
                  value: "bar fill",
                  description:
                    "The only fill. It re-resolves to the navy ramp (#003366) under data-brand=\"navy\" — no second token, no tone prop.",
                  isColor: true,
                },
                { token: "--sa-text-neutral-inverse", value: "text / icons", description: "White content on the brand fill (AA on both brands).", isColor: true },
                {
                  token: "--sa-border-neutral-inverse-subtle",
                  value: "separators @ 40%",
                  description: "Reached through the Divider component (Vertical / Inverse subtle), not referenced directly. The bar draws no rule of its own.",
                },
                { token: "--sa-type-body-2-size / -lh", value: "14 / 20", description: "Bar type — Noto Sans Regular. Raised from label-2 (12 / 16) when the master moved to 14." },
                {
                  token: "--sa-shape-2 / --sa-shape-4",
                  value: "flag chip / control radius",
                  description: "Unified 2026-08-19 — the steppers, the reset pill and both icon buttons share shape/4, so one row of controls reads as one shape.",
                },
                {
                  token: "--sa-cmp-accessibilityBar-stepSize / -iconButtonSize",
                  value: "24 / 28",
                  description: "Hit areas. WCAG 2.2 §2.5.8 Target Size (Minimum) is 24×24 at AA; 44×44 is 2.5.5 Enhanced (AAA) and is not claimed.",
                },
              ]}
            />
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-mobile">
          <h2 id="cdp-mobile" className="cdp__h2">
            What Happens on a Phone
          </h2>
          <p>
            Below the tablet breakpoint the Figma master collapses the right-hand cluster — text
            size, accessibility, language — and <code>SiteHeader</code> renders the same controls
            inside <code>NavSheet</code> instead, through the shared{" "}
            <code>AccessibilityControls</code> component. That cluster is a component in its own
            right for exactly this reason: the bar and the sheet must never be able to disagree
            about what the controls do.
          </p>
          <p>
            <strong>The skip link is deliberately kept</strong> at every width. It is the WCAG
            2.4.1 bypass mechanism, and dropping the page&rsquo;s only one to save 90px would fail
            a mandatory criterion.
          </p>
        </section>
      }
    />
  );
}
