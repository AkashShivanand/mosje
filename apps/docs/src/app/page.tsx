import * as React from "react";
import type { Metadata } from "next";
import { Button, buttonClasses } from "@mosje/design-system";
import { StatusBadge } from "@/components/docs-kit/status-badge";
import { Callout } from "@/components/docs-kit/callout";
import { HeroShowcase } from "@/components/hero/hero";
import { FIGMA_FILE_URL } from "@/lib/figma";

export const metadata: Metadata = {
  title: "What is SAMAVESH? — SAMAVESH Design System",
  description:
    "SAMAVESH (समावेश, inclusion) is the shared design language for the MoSJE digital estate — 13 websites and 20 portals serving 33+ organisations and schemes.",
};

export default function WelcomePage(): React.JSX.Element {
  return (
    <>
      {/* ── Hero ── */}
      <div style={{ marginBottom: "var(--ds-spacing-5xl)" }}>
        {/* Live, animated brand hero — the cover rebuilt in code with real,
            interactive design-system components instead of a flat image. */}
        <HeroShowcase />

        <p style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 400, color: "var(--ds-ink)", maxWidth: "60ch", lineHeight: 1.5, marginBottom: "var(--ds-spacing-xl)" }}>
          The shared visual and interaction language for the <strong>Ministry of Social Justice &amp; Empowerment</strong> digital estate.
        </p>
        <p style={{ fontSize: "var(--ds-text-body-1)", color: "var(--ds-ink-muted)", maxWidth: "64ch", lineHeight: "var(--ds-leading-body-1)" }}>
          SAMAVESH (समावेश, &ldquo;inclusion / bringing together&rdquo;) ensures every citizen-facing website and portal — from the main DoSJE site to PM-AJAY, SMILE, and 20+ scheme portals — looks, feels, and works consistently. One system, one standard, serving every team.
        </p>

        <div style={{ display: "flex", gap: "var(--ds-spacing-md)", marginTop: "var(--ds-spacing-2xl)", flexWrap: "wrap" }}>
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
      <section style={{ marginTop: "var(--ds-spacing-6xl)" }} id="for-designers">
        <span className="home-kicker">Design</span>
        <h2 style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 600, marginBottom: "var(--ds-spacing-lg)", scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))" }}>
          For Designers
        </h2>
        <p style={{ color: "var(--ds-ink-muted)", marginBottom: "var(--ds-spacing-xl)", lineHeight: "var(--ds-leading-body-1)" }}>
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
              <div style={{ fontWeight: 600, color: "var(--ds-ink)", marginBottom: "var(--ds-spacing-sm)" }}>{card.title}</div>
              <div style={{ fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)" }}>{card.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--ds-spacing-6xl)" }} id="for-developers">
        <span className="home-kicker">Develop</span>
        <h2 style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 600, marginBottom: "var(--ds-spacing-lg)", scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))" }}>
          For Developers
        </h2>
        <p style={{ color: "var(--ds-ink-muted)", marginBottom: "var(--ds-spacing-xl)", lineHeight: "var(--ds-leading-body-1)" }}>
          Import the package, import the tokens, use the components. Design system decisions are pre-made — focus on building features, not reimplementing buttons.
        </p>
        <div style={{ background: "#1e2130", borderRadius: "var(--ds-radius-md)", padding: "var(--ds-spacing-xl)", fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#e2e8f0", lineHeight: 1.7 }}>
          <div style={{ color: "#8892a4", marginBottom: "var(--ds-spacing-md)" }}># Install</div>
          <div><span style={{ color: "#7dd3fc" }}>npm</span> install @mosje/design-system</div>
          <div style={{ marginTop: "var(--ds-spacing-lg)", color: "#8892a4" }}># Use in your app</div>
          <div><span style={{ color: "#c084fc" }}>import</span> {`{ Button, Card, FormField }`} <span style={{ color: "#c084fc" }}>from</span> <span style={{ color: "#86efac" }}>&apos;@mosje/design-system&apos;</span>;</div>
          <div><span style={{ color: "#c084fc" }}>import</span> <span style={{ color: "#86efac" }}>&apos;@mosje/design-system/tokens.css&apos;</span>;</div>
        </div>
        <div className="home-cards" style={{ marginTop: "var(--ds-spacing-xl)" }}>
          {[
            { title: "No hardcoded values", desc: "All styling via --ds-* CSS custom properties. Change the theme, nothing breaks." },
            { title: "Accessibility included", desc: "ARIA labels, focus management, and keyboard navigation are in the components." },
            { title: "TypeScript-first", desc: "Every component is typed. Your IDE tells you which props are valid." },
            { title: "Works without Tailwind", desc: "Design system tokens are plain CSS variables — no framework dependency." },
          ].map((item) => (
            <div key={item.title} style={{ fontSize: "var(--ds-text-body-2)" }}>
              <div style={{ fontWeight: 600, color: "var(--ds-ink)", marginBottom: "var(--ds-spacing-xs)" }}>✓ {item.title}</div>
              <div style={{ color: "var(--ds-ink-muted)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--ds-spacing-6xl)" }}>
        <span className="home-kicker">Library</span>
        <h2 style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 600, marginBottom: "var(--ds-spacing-xl)", scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))" }}>
          What&apos;s available
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--ds-spacing-md)" }}>
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
                padding: "var(--ds-spacing-md) var(--ds-spacing-lg)",
                borderRadius: "var(--ds-radius-sm)", border: "1px solid var(--ds-border)",
                fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink)", textDecoration: "none",
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
