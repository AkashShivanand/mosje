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
      <div style={{ marginBottom: "var(--sa-section-48)" }}>
        {/* Live, animated brand hero — the cover rebuilt in code with real,
            interactive design-system components instead of a flat image. */}
        <HeroShowcase />

        <p style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: "var(--sa-font-weight-regular)", color: "var(--sa-color-text-default)", maxWidth: "var(--sa-container-measure)", lineHeight: "var(--sa-type-headline-2-lh)", marginBottom: "var(--sa-padding-20)" }}>
          The shared visual and interaction language for the <strong>Ministry of Social Justice &amp; Empowerment</strong> digital estate.
        </p>
        <p style={{ fontSize: "var(--sa-type-body-1-size)", color: "var(--sa-color-text-muted)", maxWidth: "var(--sa-container-measure)", lineHeight: "var(--sa-type-body-1-lh)" }}>
          SAMAVESH (<span lang="hi">समावेश</span>, &ldquo;inclusion / bringing together&rdquo;) ensures every citizen-facing website and portal — from the main DoSJE site to PM-AJAY, SMILE, and 20+ scheme portals — looks, feels, and works consistently. One system, one standard, serving every team.
        </p>

        <div style={{ display: "flex", gap: "var(--sa-stack-12)", marginTop: "var(--sa-stack-24)", flexWrap: "wrap" }}>
          <Button
            href="/design-system/foundations/color"
            variant="primary"
            appearance="filled"
            iconRight={<span aria-hidden="true">→</span>}
          >
            Explore Foundations
          </Button>
          <Button href="/design-system/components/actions/button" variant="primary" appearance="outlined">
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
      <section style={{ marginTop: "var(--sa-section-56)" }} id="for-designers">
        <span className="home-kicker">Design</span>
        <h2 style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: "var(--sa-font-weight-semibold)", marginBottom: "var(--sa-stack-16)", scrollMarginTop: "var(--docs-anchor-offset)" }}>
          For Designers
        </h2>
        <p style={{ color: "var(--sa-text-neutral-subtle)", marginBottom: "var(--sa-padding-20)", lineHeight: "var(--sa-type-body-1-lh)" }}>
          SAMAVESH gives you a complete Figma library — colors, typography, spacing, components — all in sync with the code. When a token changes in the system, your designs update automatically.
        </p>
        <div className="home-cards">
          {[
            { title: "Token-based colors", desc: "Every color has a name and purpose. No guessing which blue to use.", href: "/design-system/foundations/color" },
            { title: "Type scale", desc: "Predefined type roles (Display, Headline, Body) for EN and हिन्दी.", href: "/design-system/foundations/typography" },
            { title: "Component library", desc: "Every Figma component maps directly to code — zero translation gap.", href: "/design-system/components/actions/button" },
            { title: "Accessibility built in", desc: "Touch targets, contrast, and focus states are part of every component design.", href: "/design-system/foundations/accessibility" },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="docs-welcome-card"
            >
              <div style={{ fontWeight: "var(--sa-font-weight-semibold)", color: "var(--sa-color-text-default)", marginBottom: "var(--sa-stack-8)" }}>{card.title}</div>
              <div style={{ fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-color-text-muted)" }}>{card.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--sa-section-56)" }} id="for-developers">
        <span className="home-kicker">Develop</span>
        <h2 style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: "var(--sa-font-weight-semibold)", marginBottom: "var(--sa-stack-16)", scrollMarginTop: "var(--docs-anchor-offset)" }}>
          For Developers
        </h2>
        <p style={{ color: "var(--sa-text-neutral-subtle)", marginBottom: "var(--sa-padding-20)", lineHeight: "var(--sa-type-body-1-lh)" }}>
          Import the package, import the tokens, use the components. Design system decisions are pre-made — focus on building features, not reimplementing buttons.
        </p>
        <TerminalCode
          title="Terminal"
          codeText={`npm install @mosje/design-system\n\nimport { Button, Card, FormField } from '@mosje/design-system';\nimport '@mosje/design-system/tokens.css';`}
        >
          <div style={{ marginBottom: "var(--sa-stack-12)" }}><Syn.Comment># Install</Syn.Comment></div>
          <div><Syn.Builtin>npm</Syn.Builtin> install @mosje/design-system</div>
          <div style={{ marginTop: "var(--sa-stack-16)" }}><Syn.Comment># Use in your app</Syn.Comment></div>
          <div><Syn.Keyword>import</Syn.Keyword> {`{ Button, Card, FormField }`} <Syn.Keyword>from</Syn.Keyword> <Syn.Str>&apos;@mosje/design-system&apos;</Syn.Str>;</div>
          <div><Syn.Keyword>import</Syn.Keyword> <Syn.Str>&apos;@mosje/design-system/tokens.css&apos;</Syn.Str>;</div>
        </TerminalCode>
        <div className="home-cards" style={{ marginTop: "var(--sa-padding-20)" }}>
          {[
            { title: "No hardcoded values", desc: "All styling via --sa-* CSS custom properties. Change the theme, nothing breaks." },
            { title: "Accessibility included", desc: "ARIA labels, focus management, and keyboard navigation are in the components." },
            { title: "TypeScript-first", desc: "Every component is typed. Your IDE tells you which props are valid." },
            { title: "Works without Tailwind", desc: "Design system tokens are plain CSS variables — no framework dependency." },
          ].map((item) => (
            <div key={item.title} style={{ fontSize: "var(--sa-type-body-2-size)" }}>
              <div style={{ fontWeight: "var(--sa-font-weight-semibold)", color: "var(--sa-color-text-default)", marginBottom: "var(--sa-stack-4)" }}>✓ {item.title}</div>
              <div style={{ color: "var(--sa-text-neutral-subtle)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--sa-section-56)" }} id="for-ai-agents">
        <span className="home-kicker">Automate</span>
        <h2 style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: "var(--sa-font-weight-semibold)", marginBottom: "var(--sa-stack-16)", scrollMarginTop: "var(--docs-anchor-offset)" }}>
          For AI Agents
        </h2>
        <p style={{ color: "var(--sa-text-neutral-subtle)", marginBottom: "var(--sa-padding-20)", lineHeight: "var(--sa-type-body-1-lh)" }}>
          SAMAVESH provides a machine-readable contract. Agents can consume our registry, <code>llms.txt</code>, and Code Connect to confidently assemble compliant UI without guessing structural tokens.
        </p>
        <div className="home-cards">
          {[
            { title: "AGENTS.md & Rules", desc: "Canonical system prompts and rulesets located centrally.", href: "#" },
            { title: "llms.txt", desc: "A compiled navigation map for agents to traverse the docs.", href: "/design-system/llms.txt" },
          ].map((card) => (
            <a key={card.title} href={card.href} className="docs-welcome-card">
              <div style={{ fontWeight: "var(--sa-font-weight-semibold)", color: "var(--sa-color-text-default)", marginBottom: "var(--sa-stack-8)" }}>{card.title}</div>
              <div style={{ fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-color-text-muted)" }}>{card.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--sa-section-56)" }} id="white-label">
        <span className="home-kicker">Extend</span>
        <h2 style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: "var(--sa-font-weight-semibold)", marginBottom: "var(--sa-stack-16)", scrollMarginTop: "var(--docs-anchor-offset)" }}>
          White-label your portal
        </h2>
        <p style={{ color: "var(--sa-text-neutral-subtle)", marginBottom: "var(--sa-padding-20)", lineHeight: "var(--sa-type-body-1-lh)" }}>
          The SAMAVESH universal core is brand-blind. Stand up a new government portal by supplying one brand pack (colours, emblem, typography) and inherit every accessible component for free.
        </p>
        <div className="home-cards">
          {[
            { title: "Brand packs", desc: "Learn how to author a brand pack for a new department.", href: "#" },
            { title: "Contrast-gating", desc: "CI checks ensure new brand ramps clear WCAG AA automatically.", href: "#" },
          ].map((card) => (
            <a key={card.title} href={card.href} className="docs-welcome-card">
              <div style={{ fontWeight: "var(--sa-font-weight-semibold)", color: "var(--sa-color-text-default)", marginBottom: "var(--sa-stack-8)" }}>{card.title}</div>
              <div style={{ fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-color-text-muted)" }}>{card.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--sa-section-56)" }}>
        <span className="home-kicker">Library</span>
        <h2 style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: "var(--sa-font-weight-semibold)", marginBottom: "var(--sa-padding-20)", scrollMarginTop: "var(--docs-anchor-offset)" }}>
          What&apos;s available
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--sa-stack-12)" }}>
          {[
            { name: "Button", status: "Stable" as const, href: "/design-system/components/actions/button" },
            { name: "Card", status: "Stable" as const, href: "/design-system/components/data-display/card" },
            { name: "Badge", status: "Stable" as const, href: "/design-system/components/feedback/badge" },
            { name: "Input / Textarea", status: "Stable" as const, href: "/design-system/components/forms/input" },
            { name: "Select", status: "Beta" as const, href: "/design-system/components/forms/select" },
            { name: "Form Field", status: "Stable" as const, href: "/design-system/components/forms/form-field" },
            { name: "Accessibility Widget", status: "Stable" as const, href: "/design-system/components/utilities/ux4g-accessibility-widget" },
            { name: "Color Mode", status: "Stable" as const, href: "/design-system/foundations/color#brands" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "var(--sa-padding-12) var(--sa-padding-16)",
                borderRadius: "var(--sa-shape-6)", border: "1px solid var(--sa-border-neutral-subtle)",
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
