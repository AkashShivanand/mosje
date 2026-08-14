import * as React from "react";
import type { Metadata } from "next";
import { Button, buttonClasses } from "@mosje/design-system";
import { StatusBadge, Callout, TerminalCode, Syn } from "@/components/design-system/docs-kit";
import { HeroShowcase } from "@/components/design-system/hero/hero";
import { FIGMA_FILE_URL } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "What is SAMAVESH? — SAMAVESH Design System",
  description:
    "SAMAVESH (समावेश, inclusion) is the shared design language for the MoSJE digital estate — 13 websites and 20 portals serving 33+ organisations and schemes.",
};

export default function WelcomePage(): React.JSX.Element {
  return (
    <>
      {/* ── Hero ── */}
      <div style={{ marginBottom: "var(--sa-section-m)" }}>
        {/* Live, animated brand hero — the cover rebuilt in code with real,
            interactive design-system components instead of a flat image. */}
        <HeroShowcase />

        <p style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: 400, color: "var(--sa-color-text-default)", maxWidth: "60ch", lineHeight: 1.5, marginBottom: "var(--sa-padding-l)" }}>
          The shared visual and interaction language for the <strong>Ministry of Social Justice &amp; Empowerment</strong> digital estate.
        </p>
        <p style={{ fontSize: "var(--sa-type-body-1-size)", color: "var(--sa-color-text-muted)", maxWidth: "64ch", lineHeight: "var(--sa-type-body-1-lh)" }}>
          SAMAVESH (समावेश, &ldquo;inclusion / bringing together&rdquo;) ensures every citizen-facing website and portal — from the main DoSJE site to PM-AJAY, SMILE, and 20+ scheme portals — looks, feels, and works consistently. One system, one standard, serving every team.
        </p>

        <div style={{ display: "flex", gap: "var(--sa-stack-s)", marginTop: "var(--sa-stack-l)", flexWrap: "wrap" }}>
          <Button
            href="/design-system/foundations/color"
            variant="primary"
            appearance="filled"
            iconRight={<span aria-hidden="true">→</span>}
          >
            Explore Foundations
          </Button>
          <Button href="/design-system/components/button" variant="primary" appearance="outlined">
            Browse Components
          </Button>
          {/* External link — DS button styling via buttonClasses so it can open
              in a new tab (the Button component's props are button-only). */}
          <a
            className={buttonClasses("primary", "outlined", "md")}
            href={FIGMA_FILE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Figma <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="home-stats">
        {[
          { stat: "30+", label: "Components" },
          { stat: "13", label: "Websites" },
          { stat: "20", label: "Portals" },
          { stat: "33+", label: "Organisations" },
          { stat: "WCAG AA", label: "Accessibility" },
          { stat: "Bilingual", label: "EN + हिन्दी" },
        ].map((card) => (
          <div key={card.stat} className="home-stat">
            <div className="home-stat__value">{card.stat}</div>
            <div className="home-stat__label">{card.label}</div>
          </div>
        ))}
      </div>

      <Callout type="tip" title="Release gate">
        Every component and pattern must work accessibly, in Hindi and English, on a ₹6,000 Android phone on 3G. If it doesn&apos;t, it doesn&apos;t ship.
      </Callout>

      {/* ── For each audience ── */}
      <section style={{ marginTop: "var(--sa-section-l)" }} id="for-designers">
        <span className="home-kicker">Design</span>
        <h2 style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, marginBottom: "var(--sa-stack-m)", scrollMarginTop: "var(--docs-anchor-offset)" }}>
          For Designers
        </h2>
        <p style={{ color: "var(--sa-text-neutral-subtle)", marginBottom: "var(--sa-padding-l)", lineHeight: "var(--sa-type-body-1-lh)" }}>
          SAMAVESH gives you a complete Figma library — colors, typography, spacing, components — all in sync with the code. When a token changes in the system, your designs update automatically.
        </p>
        <div className="home-cards">
          {[
            { title: "Token-based colors", desc: "Every color has a name and purpose. No guessing which blue to use.", href: "/design-system/foundations/color" },
            { title: "Type scale", desc: "Predefined type roles (Display, Headline, Body) for EN and हिन्दी.", href: "/design-system/foundations/typography" },
            { title: "Component library", desc: "Every Figma component maps directly to code — zero translation gap.", href: "/design-system/components/button" },
            { title: "Accessibility built in", desc: "Touch targets, contrast, and focus states are part of every component design.", href: "/design-system/foundations/accessibility" },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="docs-welcome-card"
            >
              <div style={{ fontWeight: 600, color: "var(--sa-color-text-default)", marginBottom: "var(--sa-stack-xs)" }}>{card.title}</div>
              <div style={{ fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-color-text-muted)" }}>{card.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--sa-section-l)" }} id="for-developers">
        <span className="home-kicker">Develop</span>
        <h2 style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, marginBottom: "var(--sa-stack-m)", scrollMarginTop: "var(--docs-anchor-offset)" }}>
          For Developers
        </h2>
        <p style={{ color: "var(--sa-text-neutral-subtle)", marginBottom: "var(--sa-padding-l)", lineHeight: "var(--sa-type-body-1-lh)" }}>
          Import the package, import the tokens, use the components. Design system decisions are pre-made — focus on building features, not reimplementing buttons.
        </p>
        <TerminalCode
          title="Terminal"
          codeText={`npm install @mosje/design-system\n\nimport { Button, Card, FormField } from '@mosje/design-system';\nimport '@mosje/design-system/tokens.css';`}
        >
          <div style={{ marginBottom: "var(--sa-stack-s)" }}><Syn.Comment># Install</Syn.Comment></div>
          <div><Syn.Builtin>npm</Syn.Builtin> install @mosje/design-system</div>
          <div style={{ marginTop: "var(--sa-stack-m)" }}><Syn.Comment># Use in your app</Syn.Comment></div>
          <div><Syn.Keyword>import</Syn.Keyword> {`{ Button, Card, FormField }`} <Syn.Keyword>from</Syn.Keyword> <Syn.Str>&apos;@mosje/design-system&apos;</Syn.Str>;</div>
          <div><Syn.Keyword>import</Syn.Keyword> <Syn.Str>&apos;@mosje/design-system/tokens.css&apos;</Syn.Str>;</div>
        </TerminalCode>
        <div className="home-cards" style={{ marginTop: "var(--sa-padding-l)" }}>
          {[
            { title: "No hardcoded values", desc: "All styling via --sa-* CSS custom properties. Change the theme, nothing breaks." },
            { title: "Accessibility included", desc: "ARIA labels, focus management, and keyboard navigation are in the components." },
            { title: "TypeScript-first", desc: "Every component is typed. Your IDE tells you which props are valid." },
            { title: "Works without Tailwind", desc: "Design system tokens are plain CSS variables — no framework dependency." },
          ].map((item) => (
            <div key={item.title} style={{ fontSize: "var(--sa-type-body-2-size)" }}>
              <div style={{ fontWeight: 600, color: "var(--sa-color-text-default)", marginBottom: "var(--sa-stack-2xs)" }}>✓ {item.title}</div>
              <div style={{ color: "var(--sa-text-neutral-subtle)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--sa-section-l)" }}>
        <span className="home-kicker">Library</span>
        <h2 style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, marginBottom: "var(--sa-padding-l)", scrollMarginTop: "var(--docs-anchor-offset)" }}>
          What&apos;s available
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--sa-stack-s)" }}>
          {[
            { name: "Button", status: "Stable" as const, href: "/design-system/components/button" },
            { name: "Card", status: "Stable" as const, href: "/design-system/components/card" },
            { name: "Badge", status: "Stable" as const, href: "/design-system/components/badge" },
            { name: "Input / Textarea", status: "Stable" as const, href: "/design-system/components/input" },
            { name: "Select", status: "Beta" as const, href: "/design-system/components/input#select" },
            { name: "Form Field", status: "Stable" as const, href: "/design-system/components/input#form-field" },
            { name: "App Switcher", status: "Beta" as const, href: "/design-system/components/badge#appswitcher" },
            { name: "Color Mode", status: "Stable" as const, href: "/design-system/foundations/color#color-modes" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "var(--sa-padding-s) var(--sa-padding-m)",
                borderRadius: "var(--sa-shape-sm)", border: "1px solid var(--sa-border-neutral-subtle)",
                fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-color-text-default)", textDecoration: "none",
                transition: "border-color 0.1s",
              }}
            >
              {item.name}
              <StatusBadge status={item.status} />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
