import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import {
  ColorSwatchGrid,
  TokenTable,
  DoDont,
  Callout,
  A11yChecklist,
} from "@/components/docs-kit/index";
import { figmaUrl } from "@/lib/figma";

export const metadata: Metadata = { title: "Color — Foundations" };

export default function ColorPage(): React.JSX.Element {
  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Color</h1>
          <p className="docs-page-header__desc">
            Color in SAMAVESH is named by <strong>purpose</strong>, not by
            appearance. A button is &ldquo;primary&rdquo; — it is not
            &ldquo;blue.&rdquo; This lets the same screens adapt to light, dark,
            and high-contrast modes without rewriting a single component.
          </p>
          <div className="docs-page-header__actions">
            <a
              className={buttonClasses("primary", "outlined", "md")}
              href={figmaUrl()}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open color library in Figma <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Section 1: Understanding color tokens (non-technical) ─ */}
      <section className="docs-section">
        <span className="docs-section__label">For everyone</span>
        <h2 id="understanding-tokens" className="docs-section__heading">
          Understanding color tokens
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            A <strong>color token</strong> is a nickname for a color that
            describes the job it does — not the shade it happens to be. Instead
            of telling a designer or developer to &ldquo;use the blue
            <code> #0373DF</code>,&rdquo; we tell them to use{" "}
            <code>--ds-primary</code>: the color for the main action on a page.
          </p>
          <p>Why this matters in plain terms:</p>
          <ul>
            <li>
              <strong>One change, everywhere.</strong> If the government brand
              blue is ever updated, we change it in one place and every button,
              link, and highlight across all 13 websites and 20 portals updates
              automatically.
            </li>
            <li>
              <strong>Modes just work.</strong> Because the token means
              &ldquo;the main action color,&rdquo; it can quietly become a
              lighter blue in dark mode or a stronger one in high-contrast mode —
              no design rework needed.
            </li>
            <li>
              <strong>Shared language.</strong> Designers in Figma and developers
              in code use the exact same names, so nothing gets lost in handoff.
            </li>
          </ul>
          <p>
            Every token below begins with <code>--ds-</code> (design system).
            When you see one, read it as a sentence: <code>--ds-danger</code> is
            &ldquo;the color that signals danger,&rdquo; <code>--ds-border</code>{" "}
            is &ldquo;the color we draw lines with,&rdquo; and so on.
          </p>
        </div>
        <Callout type="tip" title="Rule of thumb">
          If you are about to type a hex value (like <code>#0373DF</code>) into a
          design or a stylesheet, stop and find the token that means what you
          want instead. There is almost always one.
        </Callout>
      </section>

      {/* ── Section 2: Primary palette (designer) ────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For designers</span>
        <h2 id="primary-palette" className="docs-section__heading">
          Primary palette
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            The primary palette carries the government identity. Brand blue is
            the anchor — it is the color of every primary action, active state,
            and key link. The supporting saffron, navy, and yellow are reserved
            for identity moments and accents, not everyday interface chrome.
          </p>
        </div>
        <ColorSwatchGrid
          swatches={[
            {
              name: "Brand blue (primary)",
              token: "--ds-primary",
              hex: "#0373DF",
              contrastWith: "white",
            },
            {
              name: "Primary hover",
              token: "--ds-primary-hover",
              hex: "#014B92",
              contrastWith: "white",
            },
            {
              name: "Primary tonal",
              token: "--ds-primary-tonal",
              hex: "#e8f2fd",
              contrastWith: "black",
            },
            {
              name: "Saffron",
              token: "--ds-saffron",
              hex: "#F97316",
              contrastWith: "white",
            },
            {
              name: "Navy",
              token: "--ds-gov-navy",
              hex: "#003366",
              contrastWith: "white",
            },
            {
              name: "Government yellow",
              token: "--ds-gov-yellow",
              hex: "#FFD323",
              contrastWith: "black",
            },
          ]}
        />
        <Callout type="info" title="Tonal = quiet backgrounds">
          <strong>Primary tonal</strong> (<code>--ds-primary-tonal</code>) is the
          soft tint used behind selected items, info banners, and badges. It is
          a background, never text — its pale tone fails contrast for foreground
          use.
        </Callout>
      </section>

      {/* ── Section 3: Status colors ─────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For designers</span>
        <h2 id="status-colors" className="docs-section__heading">
          Status colors
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Status colors communicate the outcome of an action or the state of a
            record. Always pair them with text or an icon — color alone is never
            enough to convey meaning (a requirement for both accessibility and
            GIGW compliance).
          </p>
        </div>
        <ColorSwatchGrid
          swatches={[
            {
              name: "Success",
              token: "--ds-success",
              hex: "#2e7d32",
              contrastWith: "white",
            },
            {
              name: "Warning",
              token: "--ds-warning",
              hex: "#FFD323",
              contrastWith: "black",
            },
            {
              name: "Danger",
              token: "--ds-danger",
              hex: "#EC5042",
              contrastWith: "white",
            },
            {
              name: "Info",
              token: "--ds-info",
              hex: "#0373DF",
              contrastWith: "white",
            },
          ]}
        />
        <Callout type="warning" title="Warning yellow needs dark text">
          <strong>Warning</strong> (<code>--ds-warning</code>) is a light yellow.
          White text on it fails contrast — always place dark ink (
          <code>--ds-ink</code>) on warning surfaces.
        </Callout>
      </section>

      {/* ── Section 4: Neutral scale ─────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For designers</span>
        <h2 id="neutral-scale" className="docs-section__heading">
          Neutral scale
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Neutrals do the quiet, structural work: page and panel backgrounds,
            dividing lines, and body text. They run from the brightest surface
            down to the darkest ink. Most of any screen is built from these.
          </p>
        </div>
        <ColorSwatchGrid
          swatches={[
            {
              name: "Surface",
              token: "--ds-surface",
              hex: "#ffffff",
              contrastWith: "black",
            },
            {
              name: "Surface muted",
              token: "--ds-surface-muted",
              hex: "#f8f9fa",
              contrastWith: "black",
            },
            {
              name: "Border",
              token: "--ds-border",
              hex: "#e2e6ea",
              contrastWith: "black",
            },
            {
              name: "Ink muted",
              token: "--ds-ink-muted",
              hex: "#343a40",
              contrastWith: "white",
            },
            {
              name: "Ink",
              token: "--ds-ink",
              hex: "#212121",
              contrastWith: "white",
            },
          ]}
        />
      </section>

      {/* ── Section 5: Token reference (developer) ───────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For developers</span>
        <h2 id="token-reference" className="docs-section__heading">
          Token reference
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Reference every semantic color token below by its CSS custom
            property. These resolve through the active{" "}
            <code>data-color-mode</code> — read them with{" "}
            <code>var(--ds-primary)</code> in CSS or inline styles. Never inline
            the raw value.
          </p>
        </div>
        <TokenTable
          tokens={[
            {
              token: "--ds-primary",
              value: "#0373DF",
              description: "Main interactive blue — primary buttons, active links",
              isColor: true,
            },
            {
              token: "--ds-primary-hover",
              value: "#014B92",
              description: "Hover / pressed state for primary actions",
              isColor: true,
            },
            {
              token: "--ds-primary-tonal",
              value: "#e8f2fd",
              description: "Soft tint behind selected items, info banners, badges",
              isColor: true,
            },
            {
              token: "--ds-primary-ring",
              value: "rgba(3,115,223,0.45)",
              description: "Focus ring color for keyboard navigation",
              isColor: false,
            },
            {
              token: "--ds-saffron",
              value: "#F97316",
              description: "Identity accent — sparingly, for brand moments",
              isColor: true,
            },
            {
              token: "--ds-gov-navy",
              value: "#003366",
              description: "Deep brand navy — headers, emphasis bands",
              isColor: true,
            },
            {
              token: "--ds-gov-yellow",
              value: "#FFD323",
              description: "Government yellow — highlights, identity accents",
              isColor: true,
            },
            {
              token: "--ds-success",
              value: "#2e7d32",
              description: "Positive outcomes, completed states",
              isColor: true,
            },
            {
              token: "--ds-warning",
              value: "#FFD323",
              description: "Caution — pair with dark ink, never white text",
              isColor: true,
            },
            {
              token: "--ds-danger",
              value: "#EC5042",
              description: "Errors, destructive actions, validation failures",
              isColor: true,
            },
            {
              token: "--ds-info",
              value: "#0373DF",
              description: "Neutral informational messages",
              isColor: true,
            },
            {
              token: "--ds-surface",
              value: "#ffffff",
              description: "Default page and card background",
              isColor: true,
            },
            {
              token: "--ds-surface-muted",
              value: "#f8f9fa",
              description: "Recessed sections, table stripes, inputs",
              isColor: true,
            },
            {
              token: "--ds-border",
              value: "#e2e6ea",
              description: "Default dividing lines and component outlines",
              isColor: true,
            },
            {
              token: "--ds-border-strong",
              value: "#ced4da",
              description: "Higher-emphasis borders, input focus outlines",
              isColor: true,
            },
            {
              token: "--ds-ink-muted",
              value: "#343a40",
              description: "Secondary text, captions, helper copy",
              isColor: true,
            },
            {
              token: "--ds-ink",
              value: "#212121",
              description: "Primary body text and headings",
              isColor: true,
            },
          ]}
        />
        <Callout type="tip" title="Using a token in code">
          In any stylesheet or inline style, wrap the token in{" "}
          <code>var()</code>:{" "}
          <code>color: var(--ds-ink); background: var(--ds-surface);</code>. The
          value updates automatically when the color mode changes.
        </Callout>
      </section>

      {/* ── Section 6: Color modes ───────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For everyone</span>
        <h2 id="color-modes" className="docs-section__heading">
          Color modes
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            SAMAVESH supports multiple <strong>color modes</strong> on a single
            brand axis. Each mode redefines what the same tokens resolve to, so a
            page written once can render light, dark, or high-contrast without
            touching its markup.
          </p>
          <p>How it works:</p>
          <ul>
            <li>
              The active mode lives on a single <code>data-color-mode</code>{" "}
              attribute near the root of the page (for example{" "}
              <code>data-color-mode=&quot;blue-light&quot;</code> or{" "}
              <code>data-color-mode=&quot;blue-dark&quot;</code>).
            </li>
            <li>
              The token stylesheet defines each <code>--ds-*</code> value
              per-mode. Switching the attribute swaps every color at once.
            </li>
            <li>
              In React, the <code>&lt;ColorModeProvider&gt;</code> wraps the app
              (see <code>apps/docs/src/app/layout.tsx</code>) and writes that
              attribute for you. A <code>&lt;ColorModeSwitcher&gt;</code> lets
              users change it, and the choice is remembered between visits.
            </li>
          </ul>
          <p>
            The default across the estate is <code>blue-light</code>.{" "}
            <code>blue-dark</code> is available now, and the system is built to
            extend to additional modes such as high-contrast for GIGW
            accessibility profiles.
          </p>
        </div>
        <Callout type="info" title="Why components never hardcode color">
          Because a component reads <code>var(--ds-surface)</code> rather than{" "}
          <code>#ffffff</code>, it becomes a dark panel the instant the mode
          changes — with zero component changes. This is the single biggest
          reason to always reach for a token.
        </Callout>
      </section>

      {/* ── Section 7: Do / Don't ────────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Guidance</span>
        <h2 id="do-and-dont" className="docs-section__heading">
          Do &amp; Don&rsquo;t
        </h2>
        <DoDont
          cards={[
            {
              type: "do",
              label:
                "Use --ds-primary for the interactive blue. It adapts across modes and updates everywhere if the brand changes.",
              preview: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <span
                    style={{
                      background: "var(--ds-primary)",
                      color: "#fff",
                      padding: "var(--ds-spacing-sm) var(--ds-spacing-lg)",
                      borderRadius: "var(--ds-radius-sm)",
                      fontWeight: 600,
                      fontSize: "var(--ds-text-body-2)",
                    }}
                  >
                    Apply now
                  </span>
                </div>
              ),
            },
            {
              type: "dont",
              label:
                "Don't hardcode #0373DF. It breaks dark mode, ignores theming, and can drift out of sync with the real brand value.",
              preview: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <span
                    style={{
                      background: "#0373DF",
                      color: "#fff",
                      padding: "var(--ds-spacing-sm) var(--ds-spacing-lg)",
                      borderRadius: "var(--ds-radius-sm)",
                      fontWeight: 600,
                      fontSize: "var(--ds-text-body-2)",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    #0373DF
                  </span>
                </div>
              ),
            },
            {
              type: "do",
              label:
                "Pair status color with text or an icon (e.g. a red dot beside the word “Rejected”).",
              preview: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--ds-spacing-sm)",
                    height: "100%",
                    color: "var(--ds-danger)",
                    fontWeight: 600,
                    fontSize: "var(--ds-text-body-2)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--ds-danger)",
                      display: "inline-block",
                    }}
                  />
                  Rejected
                </div>
              ),
            },
            {
              type: "dont",
              label:
                "Don't rely on color alone to signal status — colorblind users and screen readers will miss it.",
              preview: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--ds-spacing-md)",
                    height: "100%",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "var(--ds-success)",
                      display: "inline-block",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "var(--ds-danger)",
                      display: "inline-block",
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* ── Section 8: Accessibility ─────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Accessibility</span>
        <h2 id="accessibility" className="docs-section__heading">
          Accessibility
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            These are government properties: color choices must meet{" "}
            <strong>WCAG 2.1 AA</strong> and GIGW. The token pairings below are
            pre-checked, but always re-verify any custom combination with a
            contrast tool.
          </p>
        </div>
        <A11yChecklist
          items={[
            {
              criterion: "Body text contrast ≥ 4.5:1",
              level: "AA",
              description:
                "--ds-ink on --ds-surface and --ds-ink-muted on --ds-surface both clear 4.5:1 for normal-size text.",
            },
            {
              criterion: "Large text & UI contrast ≥ 3:1",
              level: "AA",
              description:
                "Headings ≥ 24px and component boundaries (borders, focus rings) meet at least 3:1 against their background.",
            },
            {
              criterion: "Color is never the only signal",
              level: "A",
              description:
                "Every status uses an icon, label, or shape in addition to color so meaning survives for colorblind users.",
            },
            {
              criterion: "Visible focus indicator",
              level: "AA",
              description:
                "Interactive elements show a --ds-primary-ring outline on keyboard focus with sufficient contrast and offset.",
            },
            {
              criterion: "Dark / high-contrast parity",
              level: "GIGW",
              description:
                "Every token pairing maintains its contrast ratio across all color modes, not just blue-light.",
            },
          ]}
        />
        <Callout type="tip" title="How to check contrast">
          Use the WebAIM Contrast Checker or your browser&rsquo;s DevTools color
          picker. Sample the actual rendered foreground and background, confirm
          the ratio meets the threshold for the text size, and repeat in dark
          mode.
        </Callout>
      </section>
    </>
  );
}
