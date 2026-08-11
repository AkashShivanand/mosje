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
            <code>#0373df</code>,&rdquo; we say use <code>--sa-color-action-primary-default</code>:
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
            gap: "var(--sa-stack-m)",
            marginTop: "var(--sa-padding-l)",
          }}
        >
          {[
            {
              tier: "1. Primitives",
              subtitle: "Raw values",
              desc: "The actual hex / rgba values in the palette ramps — primaryRamp, neutral, success-ramp, etc. These live in token JSON files and are never used directly in components.",
              bg: "var(--sa-bg-neutral-subtler)",
              border: "var(--sa-border-neutral-subtle)",
            },
            {
              tier: "2. Semantic tokens",
              subtitle: "--sa-* properties",
              desc: "Purposeful names like --sa-color-action-primary-default, --sa-color-text-default, --sa-color-status-danger. These are what components consume. They point to a primitive, and that pointer changes per color mode.",
              bg: "var(--sa-color-action-primary-tonal)",
              border: "var(--sa-color-action-primary-default)",
            },
            {
              tier: "3. Component aliases",
              subtitle: "Button, Input, Badge…",
              desc: "Component-scoped tokens (e.g. --btn-bg) that map onto semantic tokens. Changing a semantic token updates every component that uses it.",
              bg: "var(--sa-bg-neutral-subtler)",
              border: "var(--sa-border-neutral-subtle)",
            },
          ].map(({ tier, subtitle, desc, bg, border }) => (
            <div
              key={tier}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: "var(--sa-shape-md)",
                padding: "var(--sa-padding-l)",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--sa-color-text-default)",
                  margin: 0,
                  fontSize: "var(--sa-type-body-1-size)",
                }}
              >
                {tier}
              </p>
              <p
                style={{
                  color: "var(--sa-color-action-primary-default)",
                  fontSize: "var(--sa-type-label-1-size)",
                  margin: "var(--sa-stack-2xs) 0",
                  fontFamily: "var(--sa-font-mono)",
                  fontWeight: 600,
                }}
              >
                {subtitle}
              </p>
              <p
                style={{
                  color: "var(--sa-color-text-muted)",
                  fontSize: "var(--sa-type-body-2-size)",
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="docs-section__body ds-prose" style={{ marginTop: "var(--sa-stack-l)" }}>
          <p>
            Tokens also respond to <strong>two theming axes</strong>:
          </p>
          <ul>
            <li>
              <strong>
                <code>data-brand</code>
              </strong>{" "}
              (brand axis) — controls the brand palette: <code>blue-light</code>{" "}
              (default across the estate) or <code>navy</code>. This is set
              by <code>&lt;ColorModeProvider&gt;</code> and toggled via{" "}
              <code>useColorMode()</code> — DemoDock&rsquo;s Colour tab is the
              estate&rsquo;s shared control; there is no standalone switcher
              component.
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
            Every token below begins with <code>--sa-</code> (SAMAVESH).
            Read them as sentences: <code>--sa-color-status-danger</code> is &ldquo;the color
            that signals danger,&rdquo; <code>--sa-border-neutral-subtle</code> is &ldquo;the
            color we draw lines with.&rdquo;
          </p>
        </div>

        <Callout type="tip" title="Rule of thumb">
          If you are about to type a hex value into a design or stylesheet, stop
          and find the token that means what you want. There is almost always one.
          Use <code>var(--sa-color-action-primary-default)</code>, not <code>#0373df</code>.
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
              token: "--sa-color-text-default",
              hex: "#1f2428",
              contrastWith: "white",
            },
            {
              name: "Ink strong",
              token: "--sa-text-neutral-bolder",
              hex: "#0d1014",
              contrastWith: "white",
            },
            {
              name: "Ink muted",
              token: "--sa-color-text-muted",
              hex: "#343a40",
              contrastWith: "white",
            },
            {
              name: "Ink info",
              token: "--sa-color-text-info",
              hex: "#1558b0",
              contrastWith: "white",
            },
            {
              name: "On primary",
              token: "--sa-color-text-onPrimary",
              hex: "#ffffff",
              contrastWith: "black",
            },
          ]}
        />
        <div
          style={{
            marginTop: "var(--sa-padding-l)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--sa-stack-s)",
          }}
        >
          {[
            { token: "--sa-color-text-default", label: "Primary body text, all headings" },
            { token: "--sa-text-neutral-bolder", label: "Maximum emphasis, pull quotes, key numbers" },
            { token: "--sa-color-text-muted", label: "Secondary text, helper copy, captions" },
            { token: "--sa-color-text-info", label: "Informational text, links in prose" },
            { token: "--sa-color-text-onPrimary", label: "Text on primary-colored backgrounds" },
          ].map(({ token, label }) => (
            <div
              key={token}
              style={{
                padding: "var(--sa-padding-m)",
                background: "var(--sa-bg-neutral-subtler)",
                borderRadius: "var(--sa-shape-sm)",
                border: "1px solid var(--sa-border-neutral-subtle)",
              }}
            >
              <code style={{ fontSize: "var(--sa-type-label-1-size)", color: "var(--sa-color-action-primary-default)", display: "block", marginBottom: "var(--sa-stack-2xs)" }}>
                {token}
              </code>
              <span style={{ fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-color-text-muted)" }}>
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
              token: "--sa-bg-neutral-base",
              hex: "#ffffff",
              contrastWith: "black",
            },
            {
              name: "Surface muted",
              token: "--sa-bg-neutral-subtler",
              hex: "#f8f9fa",
              contrastWith: "black",
            },
            {
              name: "Border (subtle)",
              token: "--sa-border-neutral-subtle",
              hex: "#f1f3f5",
              contrastWith: "black",
            },
            {
              name: "Border strong",
              token: "--sa-border-neutral-base",
              hex: "#e2e6ea",
              contrastWith: "black",
            },
          ]}
        />
        <Callout type="info" title="Overlay">
          <code>--sa-overlay-neutral-boldest</code> (<code>rgba(31,36,40,0.5)</code>) is used for
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
              token: "--sa-color-action-primary-default",
              hex: "#0373df",
              contrastWith: "white",
            },
            {
              name: "Primary hover",
              token: "--sa-color-action-primary-hover",
              hex: "#014b92",
              contrastWith: "white",
            },
            {
              name: "Primary tonal",
              token: "--sa-color-action-primary-tonal",
              hex: "#c6dcf9",
              contrastWith: "black",
            },
            {
              name: "Link",
              token: "--sa-text-link-brand-default",
              hex: "#0373df",
              contrastWith: "white",
            },
          ]}
        />

        {/* Primary ramp */}
        <div style={{ marginTop: "var(--sa-stack-l)" }}>
          <p
            style={{
              fontSize: "var(--sa-type-body-2-size)",
              fontWeight: 600,
              color: "var(--sa-color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "var(--sa-stack-s)",
            }}
          >
            Primary ramp — <code style={{ textTransform: "none" }}>--sa-color-primaryScale-50</code> through{" "}
            <code style={{ textTransform: "none" }}>--sa-color-primaryScale-900</code>
          </p>
          <div
            style={{
              display: "flex",
              borderRadius: "var(--sa-shape-md)",
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
                title={`--sa-color-primaryScale-${stop}: ${hex}`}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "var(--sa-stack-2xs)",
            }}
          >
            {["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((stop) => (
              <div
                key={stop}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "10px",
                  color: "var(--sa-color-text-muted)",
                  fontFamily: "var(--sa-font-mono)",
                }}
              >
                {stop}
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: "var(--sa-stack-s)",
              fontSize: "var(--sa-type-body-2-size)",
              color: "var(--sa-color-text-muted)",
            }}
          >
            The semantic token <code>--sa-color-action-primary-default</code> maps to ramp step 500
            (#0373df). <code>--sa-color-action-primary-hover</code> maps to step 700
            (#014b92). <code>--sa-color-action-primary-tonal</code> maps to step 100
            (#c6dcf9). Use the ramp steps directly only in special cases (data
            visualization, branded illustrations) — for all component work, use
            the semantic tokens.
          </p>
        </div>

        <Callout type="tip" title="Focus ring">
          <code>--sa-focus-ring</code> (<code>rgba(3,115,223,0.48)</code>) is the
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
              token: "--sa-color-status-success",
              hex: "#004220",
              contrastWith: "white",
            },
            {
              name: "Success tonal",
              token: "--sa-color-status-successTonal",
              hex: "#c8e6c9",
              contrastWith: "black",
            },
            {
              name: "Warning",
              token: "--sa-color-status-warning",
              hex: "#bb772b",
              contrastWith: "white",
            },
            {
              name: "Warning tonal",
              token: "--sa-color-status-warningTonal",
              hex: "#fff4e5",
              contrastWith: "black",
            },
            {
              name: "Danger",
              token: "--sa-color-status-danger",
              hex: "#ec5042",
              contrastWith: "white",
            },
            {
              name: "Danger tonal",
              token: "--sa-color-status-dangerTonal",
              hex: "#fad2cf",
              contrastWith: "black",
            },
            {
              name: "Info",
              token: "--sa-color-status-info",
              hex: "#1558b0",
              contrastWith: "white",
            },
            {
              name: "Info tonal",
              token: "--sa-color-status-infoTonal",
              hex: "#d2e3fc",
              contrastWith: "black",
            },
          ]}
        />

        <Callout type="warning" title="Warning is amber, not yellow">
          <strong>Warning</strong> (<code>--sa-color-status-warning</code>, <code>#bb772b</code>)
          is a dark amber — deliberately distinct from the brand{" "}
          <code>--sa-color-brand-yellow</code> (<code>#ffd323</code>), which is a
          badge/identity accent and never a status colour. Use{" "}
          <code>--sa-color-status-warningTonal</code> (<code>#fff4e5</code>) as the soft
          background and <code>--sa-color-status-warning</code> (or <code>--sa-color-text-default</code>) for
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
              token: "--sa-color-brand-saffron",
              hex: "#ff671f",
              contrastWith: "white",
            },
            {
              name: "Saffron light",
              token: "--sa-color-brand-saffronLight",
              hex: "#ffedd5",
              contrastWith: "black",
            },
            {
              name: "Saffron dark",
              token: "--sa-color-brand-saffronDark",
              hex: "#7c3503",
              contrastWith: "white",
            },
            {
              name: "Navy",
              token: "--sa-color-brand-navy",
              hex: "#162f6a",
              contrastWith: "white",
            },
            {
              name: "Government yellow",
              token: "--sa-color-brand-yellow",
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
            <code>var(--sa-TOKEN)</code> in CSS. Never inline the raw hex — the
            value updates automatically when the color mode changes.
          </p>
        </div>

        {/* Text group */}
        <h3
          style={{
            fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)",
            fontWeight: 600,
            marginTop: "var(--sa-stack-l)",
            marginBottom: "var(--sa-stack-xs)",
            scrollMarginTop: "calc(56px + var(--sa-stack-l))",
          }}
        >
          Text
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--sa-color-text-default",
              value: "#1f2428",
              description: "Primary body text and all headings",
              isColor: true,
            },
            {
              token: "--sa-text-neutral-bolder",
              value: "#0d1014",
              description: "Maximum emphasis — pull quotes, key numbers, critical labels",
              isColor: true,
            },
            {
              token: "--sa-color-text-muted",
              value: "#343a40",
              description: "Secondary text, captions, helper copy",
              isColor: true,
            },
            {
              token: "--sa-color-text-info",
              value: "#1558b0",
              description: "Informational text, links within prose paragraphs",
              isColor: true,
            },
            {
              token: "--sa-color-text-onPrimary",
              value: "#ffffff",
              description: "Text and icons placed on --sa-color-action-primary-default backgrounds",
              isColor: true,
            },
          ]}
        />

        {/* Surface & border group */}
        <h3
          style={{
            fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)",
            fontWeight: 600,
            marginTop: "var(--sa-stack-l)",
            marginBottom: "var(--sa-stack-xs)",
            scrollMarginTop: "calc(56px + var(--sa-stack-l))",
          }}
        >
          Surface &amp; border
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--sa-bg-neutral-base",
              value: "#ffffff",
              description: "Default page and card background",
              isColor: true,
            },
            {
              token: "--sa-bg-neutral-subtler",
              value: "#f8f9fa",
              description: "Recessed sections, table stripes, input backgrounds",
              isColor: true,
            },
            {
              token: "--sa-border-neutral-subtle",
              value: "#f1f3f5",
              description: "Subtle dividing lines — separators, section dividers",
              isColor: true,
            },
            {
              token: "--sa-border-neutral-base",
              value: "#e2e6ea",
              description: "Higher-emphasis borders — input outlines, card edges",
              isColor: true,
            },
            {
              token: "--sa-overlay-neutral-boldest",
              value: "rgba(31,36,40,0.5)",
              description: "Modal backdrops and drawer scrims",
              isColor: false,
            },
          ]}
        />

        {/* Action group */}
        <h3
          style={{
            fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)",
            fontWeight: 600,
            marginTop: "var(--sa-stack-l)",
            marginBottom: "var(--sa-stack-xs)",
            scrollMarginTop: "calc(56px + var(--sa-stack-l))",
          }}
        >
          Action &amp; interactive
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--sa-color-action-primary-default",
              value: "#0373df",
              description: "Main interactive blue — primary buttons, active links",
              isColor: true,
            },
            {
              token: "--sa-color-action-primary-hover",
              value: "#014b92",
              description: "Hover / pressed state for primary actions",
              isColor: true,
            },
            {
              token: "--sa-color-action-primary-tonal",
              value: "#c6dcf9",
              description: "Soft tint behind selected items, info banners, badges",
              isColor: true,
            },
            {
              token: "--sa-focus-ring",
              value: "rgba(3,115,223,0.48)",
              description: "Focus ring color for keyboard navigation",
              isColor: false,
            },
            {
              token: "--sa-text-link-brand-default",
              value: "#0373df",
              description: "In-prose hyperlinks (same hue as primary, distinct semantic role)",
              isColor: true,
            },
          ]}
        />

        {/* Status group */}
        <h3
          style={{
            fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)",
            fontWeight: 600,
            marginTop: "var(--sa-stack-l)",
            marginBottom: "var(--sa-stack-xs)",
            scrollMarginTop: "calc(56px + var(--sa-stack-l))",
          }}
        >
          Status
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--sa-color-status-success",
              value: "#004220",
              description: "Positive outcomes, completed states",
              isColor: true,
            },
            {
              token: "--sa-color-status-successTonal",
              value: "#c8e6c9",
              description: "Soft background for success banners, tags",
              isColor: true,
            },
            {
              token: "--sa-color-status-warning",
              value: "#bb772b",
              description: "Caution — dark amber (not yellow); pair with --sa-color-status-warningTonal background",
              isColor: true,
            },
            {
              token: "--sa-color-status-warningTonal",
              value: "#fff4e5",
              description: "Soft background for warning messages",
              isColor: true,
            },
            {
              token: "--sa-color-status-danger",
              value: "#ec5042",
              description: "Errors, destructive actions, validation failures",
              isColor: true,
            },
            {
              token: "--sa-color-status-dangerTonal",
              value: "#fad2cf",
              description: "Soft background for error banners, alert regions",
              isColor: true,
            },
            {
              token: "--sa-color-status-info",
              value: "#1558b0",
              description: "Neutral informational messages — distinct from brand primary",
              isColor: true,
            },
            {
              token: "--sa-color-status-infoTonal",
              value: "#d2e3fc",
              description: "Soft background for info banners and callouts",
              isColor: true,
            },
          ]}
        />

        {/* Brand group */}
        <h3
          style={{
            fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)",
            fontWeight: 600,
            marginTop: "var(--sa-stack-l)",
            marginBottom: "var(--sa-stack-xs)",
            scrollMarginTop: "calc(56px + var(--sa-stack-l))",
          }}
        >
          Brand
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--sa-color-brand-saffron",
              value: "#ff671f",
              description: "Identity accent — sparingly, for brand moments",
              isColor: true,
            },
            {
              token: "--sa-color-brand-saffronLight",
              value: "#ffedd5",
              description: "Soft saffron tint for backgrounds and tonal uses",
              isColor: true,
            },
            {
              token: "--sa-color-brand-saffronDark",
              value: "#7c3503",
              description: "Deep saffron for high-contrast text on light saffron surfaces",
              isColor: true,
            },
            {
              token: "--sa-color-brand-navy",
              value: "#162f6a",
              description: "Deep brand navy — headers, emphasis bands",
              isColor: true,
            },
            {
              token: "--sa-color-brand-yellow",
              value: "#ffd323",
              description: "Government yellow — highlights, identity accents",
              isColor: true,
            },
          ]}
        />

        {/* Full ramps & alpha tiers */}
        <h3
          style={{
            fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)",
            fontWeight: 600,
            marginTop: "var(--sa-stack-l)",
            marginBottom: "var(--sa-stack-xs)",
            scrollMarginTop: "calc(56px + var(--sa-stack-l))",
          }}
        >
          Full colour ramps &amp; alpha tiers
        </h3>
        <div className="docs-section__body ds-prose">
          <p>
            Every family below is available as a full <strong>50–950 ramp</strong> (11 steps, matching UX4G 3.0),
            synced 1:1 with the SAMAVESH Figma library. Use the single semantic
            tokens above for normal component work; reach for a specific ramp step
            only for tints, shades, charts, or illustrations.
          </p>
          <ul>
            <li>
              <code>--sa-color-primaryScale-50…900</code> &amp;{" "}
              <code>--sa-color-secondaryScale-50…900</code> &amp;{" "}
              <code>--sa-color-neutralScale-0…1100</code> — <strong>colour-mode-aware</strong>:
              primary blue↔navy and neutral warm↔cool grey under <code>navy</code>.
              Secondary and accent do NOT change — both are SAMAVESH logo colours.
            </li>
            <li>
              <code>--sa-color-successScale-50…900</code>, <code>--sa-color-dangerScale-50…900</code>,{" "}
              <code>--sa-color-warningScale-50…900</code>, <code>--sa-color-infoScale-50…900</code> —
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
          <code>color: var(--sa-color-text-default); background: var(--sa-bg-neutral-base);</code>. The
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
            <code>navy</code>) are <strong>two peer brand colour modes</strong>,
            mapped 1:1 to the SAMAVESH Figma <code>Blue - Light</code> /{" "}
            <code>Navy</code> variable modes. <code>navy</code> is{" "}
            <strong>not</strong> a dark UI theme — it keeps light surfaces and
            swaps the primary ramp and the neutral greys — primary blue→navy —
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
            gap: "var(--sa-stack-m)",
            marginTop: "var(--sa-padding-l)",
          }}
        >
          {[
            {
              axis: "data-brand",
              label: "Brand colour mode",
              modes: ["blue-light (default)", "navy", "+ extensible"],
              desc: "Two peer colour modes (= Figma Blue/Navy). Swaps the PRIMARY ramp (blue↔navy, navy being the DBIM key colour #162f6a) and the neutral greys (warm↔cool), plus their transparent tiers. Secondary (India Saffron) and accent (India Green) are brand-INVARIANT — both come from the SAMAVESH logo. Toggle via ColorModeProvider + useColorMode() — DemoDock's Colour tab is the estate's shared control.",
              color: "var(--sa-color-action-primary-tonal)",
              border: "var(--sa-color-action-primary-default)",
            },
            {
              axis: "data-theme",
              label: "Appearance axis",
              modes: ["light (default)", "dark (planned)", "high-contrast (GIGW)"],
              desc: "Controls light / dark / hc rendering within the active brand. Planned for GIGW accessibility profiles.",
              color: "var(--sa-bg-neutral-subtler)",
              border: "var(--sa-border-neutral-base)",
            },
          ].map(({ axis, label, modes, desc, color, border }) => (
            <div
              key={axis}
              style={{
                background: color,
                border: `1px solid ${border}`,
                borderRadius: "var(--sa-shape-md)",
                padding: "var(--sa-padding-l)",
              }}
            >
              <p
                style={{
                  fontSize: "var(--sa-type-label-1-size)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--sa-color-text-muted)",
                  margin: 0,
                }}
              >
                {label}
              </p>
              <code
                style={{
                  display: "block",
                  fontSize: "var(--sa-type-body-2-size)",
                  color: "var(--sa-color-action-primary-default)",
                  margin: "var(--sa-stack-2xs) 0 var(--sa-stack-s)",
                  fontWeight: 600,
                }}
              >
                {axis}
              </code>
              <ul style={{ margin: 0, paddingLeft: "var(--sa-stack-m)", fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-color-text-default)" }}>
                {modes.map((m) => (
                  <li key={m} style={{ marginBottom: "var(--sa-stack-2xs)" }}>
                    <code style={{ fontFamily: "var(--sa-font-mono)" }}>{m}</code>
                  </li>
                ))}
              </ul>
              <p
                style={{
                  marginTop: "var(--sa-stack-s)",
                  fontSize: "var(--sa-type-body-2-size)",
                  color: "var(--sa-color-text-muted)",
                  margin: "var(--sa-stack-s) 0 0",
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        <Callout type="info" title="Why components never hardcode color">
          Because a component reads <code>var(--sa-bg-neutral-base)</code> rather than{" "}
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
                "Use --sa-color-action-primary-default for the interactive blue. It adapts across modes and updates everywhere if the brand changes.",
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
                      background: "var(--sa-color-action-primary-default)",
                      color: "var(--sa-color-text-onPrimary)",
                      padding: "var(--sa-padding-xs) var(--sa-padding-m)",
                      borderRadius: "var(--sa-shape-sm)",
                      fontWeight: 600,
                      fontSize: "var(--sa-type-body-2-size)",
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
                      padding: "var(--sa-padding-xs) var(--sa-padding-m)",
                      borderRadius: "var(--sa-shape-sm)",
                      fontWeight: 600,
                      fontSize: "var(--sa-type-body-2-size)",
                      fontFamily: "var(--sa-font-mono)",
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
                "Use --sa-color-status-info (not --sa-color-action-primary-default) for informational banners. The dedicated info blue signals 'here is information', not 'do something'.",
              preview: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--sa-stack-xs)",
                    padding: "var(--sa-padding-s)",
                    background: "var(--sa-color-status-infoTonal)",
                    borderRadius: "var(--sa-shape-sm)",
                    border: "1px solid var(--sa-color-status-info)",
                    color: "var(--sa-color-status-info)",
                    fontSize: "var(--sa-type-body-2-size)",
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
                    gap: "var(--sa-stack-s)",
                    height: "100%",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "var(--sa-color-status-success)",
                      display: "inline-block",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "var(--sa-color-status-danger)",
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
        <div style={{ overflowX: "auto", marginTop: "var(--sa-padding-l)" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "var(--sa-type-body-2-size)",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid var(--sa-border-neutral-base)" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "var(--sa-padding-xs) var(--sa-padding-s)",
                    color: "var(--sa-color-text-muted)",
                    fontWeight: 600,
                  }}
                >
                  Token
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "var(--sa-padding-xs) var(--sa-padding-s)",
                    color: "var(--sa-color-text-muted)",
                    fontWeight: 600,
                  }}
                >
                  Value
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "var(--sa-padding-xs) var(--sa-padding-s)",
                    color: "var(--sa-color-text-muted)",
                    fontWeight: 600,
                  }}
                >
                  Contrast on white
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "var(--sa-padding-xs) var(--sa-padding-s)",
                    color: "var(--sa-color-text-muted)",
                    fontWeight: 600,
                  }}
                >
                  Level
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { token: "--sa-color-text-default", value: "#1f2428", ratio: "~16:1", level: "AAA", note: "" },
                { token: "--sa-text-neutral-bolder", value: "#0d1014", ratio: "~21:1", level: "AAA", note: "" },
                { token: "--sa-color-text-muted", value: "#343a40", ratio: "~10:1", level: "AAA", note: "" },
                { token: "--sa-color-status-info / --sa-color-text-info", value: "#1558b0", ratio: "7.1:1", level: "AAA", note: "" },
                { token: "--sa-color-status-success", value: "#004220", ratio: "11.67:1", level: "AAA", note: "" },
                { token: "--sa-color-action-primary-default", value: "#0373df", ratio: "4.7:1", level: "AA ✓ (not AAA)", note: "Meets AA for text ≥ 18px or bold ≥ 14px" },
                { token: "--sa-color-status-danger", value: "#ec5042", ratio: "3.5:1", level: "AA (large/UI only)", note: "Not for body text — use --sa-text-status-error-base (#b8382f, 5.8:1) for error text" },
                { token: "--sa-color-status-warning", value: "#bb772b", ratio: "3.3:1", level: "AA (large/UI only)", note: "Dark amber. For text on white use a darker warning step (--sa-color-warningScale-700)" },
              ].map(({ token, value, ratio, level, note }) => (
                <tr key={token} style={{ borderBottom: "1px solid var(--sa-border-neutral-subtle)" }}>
                  <td
                    style={{
                      padding: "var(--sa-padding-xs) var(--sa-padding-s)",
                      fontFamily: "var(--sa-font-mono)",
                      color: "var(--sa-color-action-primary-default)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {token}
                  </td>
                  <td
                    style={{
                      padding: "var(--sa-padding-xs) var(--sa-padding-s)",
                      fontFamily: "var(--sa-font-mono)",
                      color: "var(--sa-color-text-muted)",
                    }}
                  >
                    {value}
                  </td>
                  <td
                    style={{
                      padding: "var(--sa-padding-xs) var(--sa-padding-s)",
                      fontWeight: 700,
                      color: "var(--sa-color-text-default)",
                    }}
                  >
                    {ratio}
                  </td>
                  <td
                    style={{
                      padding: "var(--sa-padding-xs) var(--sa-padding-s)",
                      color: level.includes("Fails") ? "var(--sa-color-status-danger)" : level.includes("AAA") ? "var(--sa-color-status-success)" : "var(--sa-color-text-muted)",
                      fontWeight: 600,
                      fontSize: "var(--sa-type-label-1-size)",
                    }}
                  >
                    {level}
                    {note && (
                      <span style={{ display: "block", fontWeight: 400, color: "var(--sa-color-text-muted)", fontSize: "11px", marginTop: 2 }}>
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
                "--sa-color-text-default (#1f2428) on white achieves ~16:1; --sa-color-text-muted (#343a40) achieves ~10:1. Both are AAA.",
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
                "Interactive elements show a --sa-focus-ring outline on keyboard focus with sufficient contrast and offset.",
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
