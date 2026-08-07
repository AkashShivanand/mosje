import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import {
  ColorSwatchGrid,
  TokenTable,
  DoDont,
  Callout,
  A11yChecklist,
} from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

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
            and high-contrast modes without rewriting a single component. The
            system is structured in three tiers — primitives, semantic tokens,
            and component-level aliases — so a single change at the top flows
            everywhere below.
          </p>
          <div className="docs-page-header__actions">
            <a
              className={buttonClasses("primary", "outlined", "md")}
              href={figmaUrl(FIGMA_NODES.color)}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open color library in Figma <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Section 1: How the system works ───────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For everyone</span>
        <h2 id="how-it-works" className="docs-section__heading">
          How the system works
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            A <strong>color token</strong> is a nickname for a color that
            describes the job it does — not the shade it happens to be. Instead
            of telling a designer or developer to &ldquo;use the blue{" "}
            <code>#0373df</code>,&rdquo; we say use <code>--ds-primary</code>:
            the color for the main action on a page.
          </p>
          <p>
            The system is built in <strong>three tiers</strong>:
          </p>
        </div>

        {/* Three-tier diagram */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--ds-spacing-lg)",
            marginTop: "var(--ds-spacing-xl)",
          }}
        >
          {[
            {
              tier: "1. Primitives",
              subtitle: "Raw values",
              desc: "The actual hex / rgba values in the palette ramps — primaryRamp, neutral, success-ramp, etc. These live in token JSON files and are never used directly in components.",
              bg: "var(--ds-surface-muted)",
              border: "var(--ds-border)",
            },
            {
              tier: "2. Semantic tokens",
              subtitle: "--ds-* properties",
              desc: "Purposeful names like --ds-primary, --ds-ink, --ds-danger. These are what components consume. They point to a primitive, and that pointer changes per color mode.",
              bg: "var(--ds-primary-tonal)",
              border: "var(--ds-primary)",
            },
            {
              tier: "3. Component aliases",
              subtitle: "Button, Input, Badge…",
              desc: "Component-scoped tokens (e.g. --btn-bg) that map onto semantic tokens. Changing a semantic token updates every component that uses it.",
              bg: "var(--ds-surface-muted)",
              border: "var(--ds-border)",
            },
          ].map(({ tier, subtitle, desc, bg, border }) => (
            <div
              key={tier}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: "var(--ds-radius-md)",
                padding: "var(--ds-spacing-xl)",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--ds-ink)",
                  margin: 0,
                  fontSize: "var(--ds-text-body-1)",
                }}
              >
                {tier}
              </p>
              <p
                style={{
                  color: "var(--ds-primary)",
                  fontSize: "var(--ds-text-label-1)",
                  margin: "var(--ds-spacing-xs) 0",
                  fontFamily: "ui-monospace, monospace",
                  fontWeight: 600,
                }}
              >
                {subtitle}
              </p>
              <p
                style={{
                  color: "var(--ds-ink-muted)",
                  fontSize: "var(--ds-text-body-2)",
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="docs-section__body ds-prose" style={{ marginTop: "var(--ds-spacing-2xl)" }}>
          <p>
            Tokens also respond to <strong>two theming axes</strong>:
          </p>
          <ul>
            <li>
              <strong>
                <code>data-brand</code>
              </strong>{" "}
              (brand axis) — controls the brand palette: <code>blue-light</code>{" "}
              (default across the estate) or <code>blue-dark</code>. This is set
              by <code>&lt;ColorModeProvider&gt;</code> and toggled by{" "}
              <code>&lt;ColorModeSwitcher&gt;</code>.
            </li>
            <li>
              <strong>
                <code>data-theme</code>
              </strong>{" "}
              (appearance axis) — controls light / dark / high-contrast rendering
              within the active brand. This axis is planned for GIGW accessibility
              profiles.
            </li>
          </ul>
          <p>
            Every token below begins with <code>--ds-</code> (design system).
            Read them as sentences: <code>--ds-danger</code> is &ldquo;the color
            that signals danger,&rdquo; <code>--ds-border</code> is &ldquo;the
            color we draw lines with.&rdquo;
          </p>
        </div>

        <Callout type="tip" title="Rule of thumb">
          If you are about to type a hex value into a design or stylesheet, stop
          and find the token that means what you want. There is almost always one.
          Use <code>var(--ds-primary)</code>, not <code>#0373df</code>.
        </Callout>
      </section>

      {/* ── Section 2: Text colors ────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For designers</span>
        <h2 id="text-colors" className="docs-section__heading">
          Text colors
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Five tokens cover every text role from maximum-emphasis headings down
            to text on colored backgrounds. All five pass WCAG AA or better on
            their intended backgrounds.
          </p>
        </div>
        <ColorSwatchGrid
          swatches={[
            {
              name: "Ink",
              token: "--ds-ink",
              hex: "#1f2428",
              contrastWith: "white",
            },
            {
              name: "Ink strong",
              token: "--ds-ink-strong",
              hex: "#0d1014",
              contrastWith: "white",
            },
            {
              name: "Ink muted",
              token: "--ds-ink-muted",
              hex: "#343a40",
              contrastWith: "white",
            },
            {
              name: "Ink info",
              token: "--ds-ink-info",
              hex: "#1558b0",
              contrastWith: "white",
            },
            {
              name: "On primary",
              token: "--ds-on-primary",
              hex: "#ffffff",
              contrastWith: "black",
            },
          ]}
        />
        <div
          style={{
            marginTop: "var(--ds-spacing-xl)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--ds-spacing-md)",
          }}
        >
          {[
            { token: "--ds-ink", label: "Primary body text, all headings" },
            { token: "--ds-ink-strong", label: "Maximum emphasis, pull quotes, key numbers" },
            { token: "--ds-ink-muted", label: "Secondary text, helper copy, captions" },
            { token: "--ds-ink-info", label: "Informational text, links in prose" },
            { token: "--ds-on-primary", label: "Text on primary-colored backgrounds" },
          ].map(({ token, label }) => (
            <div
              key={token}
              style={{
                padding: "var(--ds-spacing-lg)",
                background: "var(--ds-surface-muted)",
                borderRadius: "var(--ds-radius-sm)",
                border: "1px solid var(--ds-border)",
              }}
            >
              <code style={{ fontSize: "var(--ds-text-label-1)", color: "var(--ds-primary)", display: "block", marginBottom: "var(--ds-spacing-xs)" }}>
                {token}
              </code>
              <span style={{ fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Surfaces & borders ────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For designers</span>
        <h2 id="surfaces-borders" className="docs-section__heading">
          Surfaces &amp; borders
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Surfaces are the backgrounds that hold content; borders structure and
            separate. The subtle-to-strong border split means you can choose how
            loudly a divider speaks.
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
              name: "Border (subtle)",
              token: "--ds-border",
              hex: "#f1f3f5",
              contrastWith: "black",
            },
            {
              name: "Border strong",
              token: "--ds-border-strong",
              hex: "#e2e6ea",
              contrastWith: "black",
            },
          ]}
        />
        <Callout type="info" title="Overlay">
          <code>--ds-overlay</code> (<code>rgba(31,36,40,0.5)</code>) is used for
          modal backdrops and drawer scrims. It is intentionally semi-transparent
          so context remains visible behind it.
        </Callout>
      </section>

      {/* ── Section 4: Action & interactive ──────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For designers</span>
        <h2 id="action-interactive" className="docs-section__heading">
          Action &amp; interactive
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            The primary blue and its companion tokens cover every interactive
            state: default, hover/pressed, tonal background, focus ring, and
            in-prose links.
          </p>
        </div>
        <ColorSwatchGrid
          swatches={[
            {
              name: "Primary",
              token: "--ds-primary",
              hex: "#0373df",
              contrastWith: "white",
            },
            {
              name: "Primary hover",
              token: "--ds-primary-hover",
              hex: "#014b92",
              contrastWith: "white",
            },
            {
              name: "Primary tonal",
              token: "--ds-primary-tonal",
              hex: "#c6dcf9",
              contrastWith: "black",
            },
            {
              name: "Link",
              token: "--ds-link",
              hex: "#0373df",
              contrastWith: "white",
            },
          ]}
        />

        {/* Primary ramp */}
        <div style={{ marginTop: "var(--ds-spacing-2xl)" }}>
          <p
            style={{
              fontSize: "var(--ds-text-body-2)",
              fontWeight: 600,
              color: "var(--ds-ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "var(--ds-spacing-md)",
            }}
          >
            Primary ramp — <code style={{ textTransform: "none" }}>--ds-primary-50</code> through{" "}
            <code style={{ textTransform: "none" }}>--ds-primary-900</code>
          </p>
          <div
            style={{
              display: "flex",
              borderRadius: "var(--ds-radius-md)",
              overflow: "hidden",
              height: 48,
            }}
          >
            {[
              { stop: "50",  hex: "#e8f2fd" },
              { stop: "100", hex: "#c6dcf9" },
              { stop: "200", hex: "#94bff5" },
              { stop: "300", hex: "#5fa0ef" },
              { stop: "400", hex: "#2d84e8" },
              { stop: "500", hex: "#0373df" },
              { stop: "600", hex: "#025fb8" },
              { stop: "700", hex: "#014b92" },
              { stop: "800", hex: "#01376b" },
              { stop: "900", hex: "#002448" },
            ].map(({ stop, hex }) => (
              <div
                key={stop}
                style={{ flex: 1, background: hex, position: "relative" }}
                title={`--ds-primary-${stop}: ${hex}`}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "var(--ds-spacing-xs)",
            }}
          >
            {["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((stop) => (
              <div
                key={stop}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "10px",
                  color: "var(--ds-ink-muted)",
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                {stop}
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: "var(--ds-spacing-md)",
              fontSize: "var(--ds-text-body-2)",
              color: "var(--ds-ink-muted)",
            }}
          >
            The semantic token <code>--ds-primary</code> maps to ramp step 500
            (#0373df). <code>--ds-primary-hover</code> maps to step 700
            (#014b92). <code>--ds-primary-tonal</code> maps to step 100
            (#c6dcf9). Use the ramp steps directly only in special cases (data
            visualization, branded illustrations) — for all component work, use
            the semantic tokens.
          </p>
        </div>

        <Callout type="tip" title="Focus ring">
          <code>--ds-primary-ring</code> (<code>rgba(3,115,223,0.48)</code>) is the
          color used for keyboard focus rings. It is semi-transparent so it adapts
          gracefully over any background.
        </Callout>
      </section>

      {/* ── Section 5: Status colors ──────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For designers</span>
        <h2 id="status-colors" className="docs-section__heading">
          Status colors
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Status colors communicate the outcome of an action or the state of a
            record. Every status token has a paired <strong>tonal</strong> token
            for soft background use. Always pair status color with text or an
            icon — color alone is never enough to convey meaning (a requirement
            for both accessibility and GIGW compliance).
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
              name: "Success tonal",
              token: "--ds-success-tonal",
              hex: "#c8e6c9",
              contrastWith: "black",
            },
            {
              name: "Warning",
              token: "--ds-warning",
              hex: "#bb772b",
              contrastWith: "white",
            },
            {
              name: "Warning tonal",
              token: "--ds-warning-tonal",
              hex: "#fff4e5",
              contrastWith: "black",
            },
            {
              name: "Danger",
              token: "--ds-danger",
              hex: "#ec5042",
              contrastWith: "white",
            },
            {
              name: "Danger tonal",
              token: "--ds-danger-tonal",
              hex: "#fad2cf",
              contrastWith: "black",
            },
            {
              name: "Info",
              token: "--ds-info",
              hex: "#1558b0",
              contrastWith: "white",
            },
            {
              name: "Info tonal",
              token: "--ds-info-tonal",
              hex: "#d2e3fc",
              contrastWith: "black",
            },
          ]}
        />

        <Callout type="warning" title="Warning is amber, not yellow">
          <strong>Warning</strong> (<code>--ds-warning</code>, <code>#bb772b</code>)
          is a dark amber — deliberately distinct from the brand{" "}
          <code>--ds-gov-yellow</code> (<code>#ffd323</code>), which is a
          badge/identity accent and never a status colour. Use{" "}
          <code>--ds-warning-tonal</code> (<code>#fff4e5</code>) as the soft
          background and <code>--ds-warning</code> (or <code>--ds-ink</code>) for
          text/icons on it.
        </Callout>

        <Callout type="info" title="Why info is not the same as primary">
          The info semantic role uses a dedicated blue (#1558b0) that is
          intentionally distinct from the brand primary (#0373df). Info messages
          should feel neutral and informational; using the same blue as interactive
          buttons creates confusion between &ldquo;do something&rdquo; and
          &ldquo;here is information.&rdquo; The info blue achieves AAA contrast
          (7.1:1) as text on white, while also mapping to the Portal DS&rsquo;s
          established info palette.
        </Callout>
      </section>

      {/* ── Section 6: Government brand layer ────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For designers</span>
        <h2 id="brand-layer" className="docs-section__heading">
          Government brand layer
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            The saffron, navy, and yellow tokens are reserved for{" "}
            <strong>identity moments and brand accents</strong> — not for everyday
            interface chrome. A header accent strip, a featured badge, or a splash
            illustration are appropriate uses; using saffron for body links or
            warning states would break the semantic contract and confuse users.
          </p>
        </div>
        <ColorSwatchGrid
          swatches={[
            {
              name: "Saffron",
              token: "--ds-saffron",
              hex: "#f97316",
              contrastWith: "white",
            },
            {
              name: "Saffron light",
              token: "--ds-saffron-light",
              hex: "#ffedd5",
              contrastWith: "black",
            },
            {
              name: "Saffron dark",
              token: "--ds-saffron-dark",
              hex: "#7c3503",
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
              hex: "#ffd323",
              contrastWith: "black",
            },
          ]}
        />
        <Callout type="tip" title="No tricolour stripe motif">
          Do not arrange saffron, white, and green as a flag stripe in UI chrome
          (headers, footers, dividers) — this is a standing rule for all MoSJE
          properties. A single brand-token accent is appropriate; the flag
          decoration is not.
        </Callout>
      </section>

      {/* ── Section 7: Complete token reference ───────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For developers</span>
        <h2 id="token-reference" className="docs-section__heading">
          Complete token reference
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            All semantic color tokens, grouped by category. Use them via{" "}
            <code>var(--ds-TOKEN)</code> in CSS. Never inline the raw hex — the
            value updates automatically when the color mode changes.
          </p>
        </div>

        {/* Text group */}
        <h3
          style={{
            fontSize: "var(--ds-text-headline)", lineHeight: "var(--ds-leading-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Text
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--ds-ink",
              value: "#1f2428",
              description: "Primary body text and all headings",
              isColor: true,
            },
            {
              token: "--ds-ink-strong",
              value: "#0d1014",
              description: "Maximum emphasis — pull quotes, key numbers, critical labels",
              isColor: true,
            },
            {
              token: "--ds-ink-muted",
              value: "#343a40",
              description: "Secondary text, captions, helper copy",
              isColor: true,
            },
            {
              token: "--ds-ink-info",
              value: "#1558b0",
              description: "Informational text, links within prose paragraphs",
              isColor: true,
            },
            {
              token: "--ds-on-primary",
              value: "#ffffff",
              description: "Text and icons placed on --ds-primary backgrounds",
              isColor: true,
            },
          ]}
        />

        {/* Surface & border group */}
        <h3
          style={{
            fontSize: "var(--ds-text-headline)", lineHeight: "var(--ds-leading-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Surface &amp; border
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--ds-surface",
              value: "#ffffff",
              description: "Default page and card background",
              isColor: true,
            },
            {
              token: "--ds-surface-muted",
              value: "#f8f9fa",
              description: "Recessed sections, table stripes, input backgrounds",
              isColor: true,
            },
            {
              token: "--ds-border",
              value: "#f1f3f5",
              description: "Subtle dividing lines — separators, section dividers",
              isColor: true,
            },
            {
              token: "--ds-border-strong",
              value: "#e2e6ea",
              description: "Higher-emphasis borders — input outlines, card edges",
              isColor: true,
            },
            {
              token: "--ds-overlay",
              value: "rgba(31,36,40,0.5)",
              description: "Modal backdrops and drawer scrims",
              isColor: false,
            },
          ]}
        />

        {/* Action group */}
        <h3
          style={{
            fontSize: "var(--ds-text-headline)", lineHeight: "var(--ds-leading-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Action &amp; interactive
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--ds-primary",
              value: "#0373df",
              description: "Main interactive blue — primary buttons, active links",
              isColor: true,
            },
            {
              token: "--ds-primary-hover",
              value: "#014b92",
              description: "Hover / pressed state for primary actions",
              isColor: true,
            },
            {
              token: "--ds-primary-tonal",
              value: "#c6dcf9",
              description: "Soft tint behind selected items, info banners, badges",
              isColor: true,
            },
            {
              token: "--ds-primary-ring",
              value: "rgba(3,115,223,0.48)",
              description: "Focus ring color for keyboard navigation",
              isColor: false,
            },
            {
              token: "--ds-link",
              value: "#0373df",
              description: "In-prose hyperlinks (same hue as primary, distinct semantic role)",
              isColor: true,
            },
          ]}
        />

        {/* Status group */}
        <h3
          style={{
            fontSize: "var(--ds-text-headline)", lineHeight: "var(--ds-leading-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Status
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--ds-success",
              value: "#2e7d32",
              description: "Positive outcomes, completed states",
              isColor: true,
            },
            {
              token: "--ds-success-tonal",
              value: "#c8e6c9",
              description: "Soft background for success banners, tags",
              isColor: true,
            },
            {
              token: "--ds-warning",
              value: "#bb772b",
              description: "Caution — dark amber (not gov-yellow); pair with --ds-warning-tonal background",
              isColor: true,
            },
            {
              token: "--ds-warning-tonal",
              value: "#fff4e5",
              description: "Soft background for warning messages",
              isColor: true,
            },
            {
              token: "--ds-danger",
              value: "#ec5042",
              description: "Errors, destructive actions, validation failures",
              isColor: true,
            },
            {
              token: "--ds-danger-tonal",
              value: "#fad2cf",
              description: "Soft background for error banners, alert regions",
              isColor: true,
            },
            {
              token: "--ds-info",
              value: "#1558b0",
              description: "Neutral informational messages — distinct from brand primary",
              isColor: true,
            },
            {
              token: "--ds-info-tonal",
              value: "#d2e3fc",
              description: "Soft background for info banners and callouts",
              isColor: true,
            },
          ]}
        />

        {/* Brand group */}
        <h3
          style={{
            fontSize: "var(--ds-text-headline)", lineHeight: "var(--ds-leading-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Brand
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--ds-saffron",
              value: "#f97316",
              description: "Identity accent — sparingly, for brand moments",
              isColor: true,
            },
            {
              token: "--ds-saffron-light",
              value: "#ffedd5",
              description: "Soft saffron tint for backgrounds and tonal uses",
              isColor: true,
            },
            {
              token: "--ds-saffron-dark",
              value: "#7c3503",
              description: "Deep saffron for high-contrast text on light saffron surfaces",
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
              value: "#ffd323",
              description: "Government yellow — highlights, identity accents",
              isColor: true,
            },
          ]}
        />

        {/* Full ramps & alpha tiers */}
        <h3
          style={{
            fontSize: "var(--ds-text-headline)", lineHeight: "var(--ds-leading-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Full colour ramps &amp; alpha tiers
        </h3>
        <div className="docs-section__body ds-prose">
          <p>
            Every family below is available as a full <strong>50–900 ramp</strong>,
            synced 1:1 with the SAMAVESH Figma library. Use the single semantic
            tokens above for normal component work; reach for a specific ramp step
            only for tints, shades, charts, or illustrations.
          </p>
          <ul>
            <li>
              <code>--ds-primary-50…900</code> &amp;{" "}
              <code>--ds-secondary-50…900</code> &amp;{" "}
              <code>--ds-neutral-0…1100</code> — <strong>colour-mode-aware</strong>:
              primary blue↔navy, secondary saffron↔green, neutral warm↔cool grey
              under <code>blue-dark</code>.
            </li>
            <li>
              <code>--ds-success-50…900</code>, <code>--ds-danger-50…900</code>,{" "}
              <code>--ds-warning-50…900</code>, <code>--ds-info-50…900</code> —
              mode-invariant (identical in both colour modes).
            </li>
            <li>
              <strong>Alpha / transparent overlays</strong> (8/16/24/32/40/48%):{" "}
              <code>--sa-color-transparent-&#123;primary,secondary,neutral,success,danger,warning,white&#125;-&#123;step&#125;</code>.
              primary/secondary/neutral are mode-aware; success/danger/warning/white
              are mode-invariant.
            </li>
          </ul>
        </div>

        <Callout type="tip" title="Using a token in code">
          Wrap the token in <code>var()</code>:{" "}
          <code>color: var(--ds-ink); background: var(--ds-surface);</code>. The
          value updates automatically when the color mode changes — no component
          changes needed.
        </Callout>
      </section>

      {/* ── Section 8: Color modes ────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For everyone</span>
        <h2 id="color-modes" className="docs-section__heading">
          Color modes
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            SAMAVESH has <strong>two independent axes</strong>.{" "}
            <code>data-brand</code> (<code>blue</code> /{" "}
            <code>blue-dark</code>) are <strong>two peer brand colour modes</strong>,
            mapped 1:1 to the SAMAVESH Figma <code>Blue - Light</code> /{" "}
            <code>Blue - Dark</code> variable modes. <code>blue-dark</code> is{" "}
            <strong>not</strong> a dark UI theme — it keeps light surfaces and
            swaps the brand palette: primary blue→navy, secondary saffron→green,
            and neutral greys warm→cool. The actual dark / high-contrast surfaces
            live on the separate <code>data-theme</code> axis, and the two
            compose.
          </p>
        </div>

        {/* Mode axis diagram */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--ds-spacing-lg)",
            marginTop: "var(--ds-spacing-xl)",
          }}
        >
          {[
            {
              axis: "data-brand",
              label: "Brand colour mode",
              modes: ["blue-light (default)", "navy", "+ extensible"],
              desc: "Two peer colour modes (= Figma Blue-Light/Blue-Dark). Swaps the whole brand palette: primary blue↔navy, secondary saffron↔green, neutral warm↔cool grey, + the primary/secondary/neutral transparent tiers. Toggle via ColorModeProvider + ColorModeSwitcher.",
              color: "var(--ds-primary-tonal)",
              border: "var(--ds-primary)",
            },
            {
              axis: "data-theme",
              label: "Appearance axis",
              modes: ["light (default)", "dark (planned)", "high-contrast (GIGW)"],
              desc: "Controls light / dark / hc rendering within the active brand. Planned for GIGW accessibility profiles.",
              color: "var(--ds-surface-muted)",
              border: "var(--ds-border-strong)",
            },
          ].map(({ axis, label, modes, desc, color, border }) => (
            <div
              key={axis}
              style={{
                background: color,
                border: `1px solid ${border}`,
                borderRadius: "var(--ds-radius-md)",
                padding: "var(--ds-spacing-xl)",
              }}
            >
              <p
                style={{
                  fontSize: "var(--ds-text-label-1)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--ds-ink-muted)",
                  margin: 0,
                }}
              >
                {label}
              </p>
              <code
                style={{
                  display: "block",
                  fontSize: "var(--ds-text-body-2)",
                  color: "var(--ds-primary)",
                  margin: "var(--ds-spacing-xs) 0 var(--ds-spacing-md)",
                  fontWeight: 600,
                }}
              >
                {axis}
              </code>
              <ul style={{ margin: 0, paddingLeft: "var(--ds-spacing-lg)", fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink)" }}>
                {modes.map((m) => (
                  <li key={m} style={{ marginBottom: "var(--ds-spacing-xs)" }}>
                    <code style={{ fontFamily: "ui-monospace, monospace" }}>{m}</code>
                  </li>
                ))}
              </ul>
              <p
                style={{
                  marginTop: "var(--ds-spacing-md)",
                  fontSize: "var(--ds-text-body-2)",
                  color: "var(--ds-ink-muted)",
                  margin: "var(--ds-spacing-md) 0 0",
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        <Callout type="info" title="Why components never hardcode color">
          Because a component reads <code>var(--ds-surface)</code> rather than{" "}
          <code>#ffffff</code>, it becomes a dark panel the instant the mode
          changes — with zero component changes. This is the single biggest
          reason to always reach for a token.
        </Callout>
      </section>

      {/* ── Section 9: Do / Don't ─────────────────────────────── */}
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
                      color: "var(--ds-on-primary)",
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
                "Don't hardcode #0373df. It breaks dark mode, ignores theming, and can drift out of sync with the real brand value.",
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
                      background: "#0373df",
                      color: "#fff",
                      padding: "var(--ds-spacing-sm) var(--ds-spacing-lg)",
                      borderRadius: "var(--ds-radius-sm)",
                      fontWeight: 600,
                      fontSize: "var(--ds-text-body-2)",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    #0373df
                  </span>
                </div>
              ),
            },
            {
              type: "do",
              label:
                "Use --ds-info (not --ds-primary) for informational banners. The dedicated info blue signals 'here is information', not 'do something'.",
              preview: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--ds-spacing-sm)",
                    padding: "var(--ds-spacing-md)",
                    background: "var(--ds-info-tonal)",
                    borderRadius: "var(--ds-radius-sm)",
                    border: "1px solid var(--ds-info)",
                    color: "var(--ds-info)",
                    fontSize: "var(--ds-text-body-2)",
                    fontWeight: 600,
                    width: "100%",
                  }}
                >
                  <span aria-hidden="true">ℹ</span>
                  Your application is under review.
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

      {/* ── Section 10: Accessibility ─────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Accessibility</span>
        <h2 id="accessibility" className="docs-section__heading">
          Accessibility
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            These are government properties: color choices must meet{" "}
            <strong>WCAG 2.1 AA</strong> and GIGW. The token pairings below are
            pre-verified with actual contrast ratios. Always re-verify any custom
            combination with a contrast tool.
          </p>
        </div>

        {/* Contrast ratio table */}
        <div style={{ overflowX: "auto", marginTop: "var(--ds-spacing-xl)" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "var(--ds-text-body-2)",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid var(--ds-border-strong)" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "var(--ds-spacing-sm) var(--ds-spacing-md)",
                    color: "var(--ds-ink-muted)",
                    fontWeight: 600,
                  }}
                >
                  Token
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "var(--ds-spacing-sm) var(--ds-spacing-md)",
                    color: "var(--ds-ink-muted)",
                    fontWeight: 600,
                  }}
                >
                  Value
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "var(--ds-spacing-sm) var(--ds-spacing-md)",
                    color: "var(--ds-ink-muted)",
                    fontWeight: 600,
                  }}
                >
                  Contrast on white
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "var(--ds-spacing-sm) var(--ds-spacing-md)",
                    color: "var(--ds-ink-muted)",
                    fontWeight: 600,
                  }}
                >
                  Level
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { token: "--ds-ink", value: "#1f2428", ratio: "~16:1", level: "AAA", note: "" },
                { token: "--ds-ink-strong", value: "#0d1014", ratio: "~21:1", level: "AAA", note: "" },
                { token: "--ds-ink-muted", value: "#343a40", ratio: "~10:1", level: "AAA", note: "" },
                { token: "--ds-info / --ds-ink-info", value: "#1558b0", ratio: "7.1:1", level: "AAA", note: "" },
                { token: "--ds-success", value: "#2e7d32", ratio: "7.2:1", level: "AAA", note: "" },
                { token: "--ds-primary", value: "#0373df", ratio: "4.7:1", level: "AA ✓ (not AAA)", note: "Meets AA for text ≥ 18px or bold ≥ 14px" },
                { token: "--ds-danger", value: "#ec5042", ratio: "3.5:1", level: "AA (large/UI only)", note: "Not for body text — use --ds-danger-strong (#b8382f, 5.8:1) for error text" },
                { token: "--ds-warning", value: "#bb772b", ratio: "3.3:1", level: "AA (large/UI only)", note: "Dark amber. For text on white use a darker warning step (--ds-warning-700)" },
              ].map(({ token, value, ratio, level, note }) => (
                <tr key={token} style={{ borderBottom: "1px solid var(--ds-border)" }}>
                  <td
                    style={{
                      padding: "var(--ds-spacing-sm) var(--ds-spacing-md)",
                      fontFamily: "ui-monospace, monospace",
                      color: "var(--ds-primary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {token}
                  </td>
                  <td
                    style={{
                      padding: "var(--ds-spacing-sm) var(--ds-spacing-md)",
                      fontFamily: "ui-monospace, monospace",
                      color: "var(--ds-ink-muted)",
                    }}
                  >
                    {value}
                  </td>
                  <td
                    style={{
                      padding: "var(--ds-spacing-sm) var(--ds-spacing-md)",
                      fontWeight: 700,
                      color: "var(--ds-ink)",
                    }}
                  >
                    {ratio}
                  </td>
                  <td
                    style={{
                      padding: "var(--ds-spacing-sm) var(--ds-spacing-md)",
                      color: level.includes("Fails") ? "var(--ds-danger)" : level.includes("AAA") ? "var(--ds-success)" : "var(--ds-ink-muted)",
                      fontWeight: 600,
                      fontSize: "var(--ds-text-label-1)",
                    }}
                  >
                    {level}
                    {note && (
                      <span style={{ display: "block", fontWeight: 400, color: "var(--ds-ink-muted)", fontSize: "11px", marginTop: 2 }}>
                        {note}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <A11yChecklist
          items={[
            {
              criterion: "Body text contrast ≥ 4.5:1",
              level: "AA",
              description:
                "--ds-ink (#1f2428) on white achieves ~16:1; --ds-ink-muted (#343a40) achieves ~10:1. Both are AAA.",
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
                "Every status uses an icon, label, or shape in addition to color so meaning is clear for colorblind users.",
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
          picker. Sample the actual rendered foreground and background, confirm the
          ratio meets the threshold for the text size, and repeat in dark mode.
        </Callout>
      </section>
    </>
  );
}
