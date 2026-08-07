import * as React from "react";
import type { Metadata } from "next";
import { Callout } from "@/components/design-system/docs-kit/index";
import { FIGMA_FILE_URL } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Quick links to the SAMAVESH Figma library, Storybook, GitHub, changelog, governance, contributing guide, and roadmap — plus how to get help.",
};

interface QuickLink {
  title: string;
  desc: string;
  href: string;
  external?: boolean;
  icon: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    title: "Figma library",
    desc: "The source-of-truth design library — colors, type, components, all in sync with code.",
    href: FIGMA_FILE_URL,
    external: true,
    icon: "◭",
  },
  {
    title: "Storybook",
    desc: "Live, interactive component playground with the a11y addon and theme/density toolbar.",
    href: "/docs",
    external: true,
    icon: "▦",
  },
  {
    title: "GitHub",
    desc: "Source code for @mosje/tokens and @mosje/design-system. Open issues and RFCs here.",
    href: "https://github.com/AkashShivanand/MoSJE",
    external: true,
    icon: "⎇",
  },
  {
    title: "AI design context",
    desc: "The authoritative brief an AI agent reads before building UI — rendered live from design.md, the source of truth.",
    href: "/design-system/resources/design-context",
    icon: "✦",
  },
  {
    title: "Design tokens",
    desc: "Every token and resolved value with live colour swatches — rendered from the generated DTCG export.",
    href: "/design-system/resources/tokens",
    icon: "◇",
  },
  {
    title: "Changelog",
    desc: "Every release of the design system, what was added, changed, and fixed.",
    href: "/design-system/resources/changelog",
    icon: "⊞",
  },
  {
    title: "Governance",
    desc: "How components move from idea to stable, our semver policy, and the deprecation window.",
    href: "/design-system/resources/governance",
    icon: "⚖",
  },
  {
    title: "Contributing",
    desc: "How to propose a component, change a token, run the system locally, and pass the PR checklist.",
    href: "/design-system/resources/contributing",
    icon: "✎",
  },
  {
    title: "Roadmap",
    desc: "What's shipped now, what's coming next, and the longer-term plan toward v1.0.",
    href: "/design-system/resources/roadmap",
    icon: "→",
  },
];

export default function ResourcesPage(): React.JSX.Element {
  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Resources</h1>
          <p className="docs-page-header__desc">
            Everything you need to design and build on SAMAVESH in one place —
            the Figma library, the live component playground, the source code,
            and the rules of the road. New to the system? Start with the
            Contributing guide and the Roadmap.
          </p>
        </div>
      </header>

      {/* ── Quick links grid ──────────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Jump to</span>
        <h2 id="quick-links" className="docs-section__heading">
          Quick links
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "var(--ds-spacing-lg)",
            marginTop: "var(--ds-spacing-lg)",
          }}
        >
          {QUICK_LINKS.map((link) => (
            <a
              key={link.title}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              style={{
                display: "block",
                padding: "var(--ds-spacing-xl)",
                borderRadius: "var(--ds-radius-md)",
                border: "1px solid var(--ds-border)",
                background: "var(--ds-surface)",
                textDecoration: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--ds-spacing-md)",
                  marginBottom: "var(--ds-spacing-sm)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--ds-radius-sm)",
                    background: "var(--ds-primary-tonal)",
                    color: "var(--ds-primary)",
                    fontSize: 18,
                  }}
                >
                  {link.icon}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--ds-ink)",
                    fontSize: "var(--ds-text-body-1)",
                  }}
                >
                  {link.title}
                  {link.external ? (
                    <span aria-hidden="true" style={{ marginLeft: 4 }}>
                      ↗
                    </span>
                  ) : null}
                </span>
              </div>
              <div
                style={{
                  fontSize: "var(--ds-text-body-2)",
                  color: "var(--ds-ink-muted)",
                  lineHeight: "var(--ds-leading-body-2)",
                }}
              >
                {link.desc}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── For AI & agents ───────────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For AI &amp; agents</span>
        <h2 id="for-ai" className="docs-section__heading">
          Building with an AI agent?
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            SAMAVESH is built to be consumed by AI coding agents, not just
            people. Point your agent at these, in order, before it writes any UI:
          </p>
          <ol>
            <li>
              <strong>
                <a href="/design-system/resources/design-context">AI design context</a>
              </strong>{" "}
              — the design contract: token vocabulary, theming axes, component
              inventory, and the hard rules (tokens-first, Noto Sans, National
              Emblem, no tricolour stripe, WCAG 2.1 AA + GIGW).
            </li>
            <li>
              <strong>
                <a href="/design-system/resources/tokens">Design tokens</a>
              </strong>{" "}
              — every token and resolved value, with live swatches.
            </li>
          </ol>
          <p>
            Prefer raw machine endpoints? Point tools at{" "}
            <a href="/design-system/llms.txt" target="_blank" rel="noopener noreferrer">
              <code>/llms.txt</code>
            </a>{" "}
            (portal index) and{" "}
            <a href="/design-system/tokens.json" target="_blank" rel="noopener noreferrer">
              <code>/tokens.json</code>
            </a>{" "}
            (DTCG tokens).
          </p>
        </div>
        <Callout type="tip" title="One rule above all">
          Build only from the <code>--ds-*</code> tokens and the{" "}
          <code>@mosje/design-system</code> components. If a value isn&apos;t a
          token, it&apos;s a token gap — add it to <code>@mosje/tokens</code>,
          never hardcode it.
        </Callout>
      </section>

      {/* ── Get help ──────────────────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Support</span>
        <h2 id="get-help" className="docs-section__heading">
          Get help
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Stuck, unsure which component to use, or found a bug? Reach the
            design system team through any of the channels below. We aim to
            respond within one working day.
          </p>
          <ul>
            <li>
              <strong>Found a bug or want a new component?</strong> Open an issue
              or RFC on{" "}
              <a
                href="https://github.com/AkashShivanand/MoSJE/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Issues ↗
              </a>
              . This is the fastest, most trackable route.
            </li>
            <li>
              <strong>Quick questions?</strong> Ask in the internal{" "}
              <code>#samavesh-design-system</code> channel. Someone from the core
              team monitors it through the working day.
            </li>
            <li>
              <strong>Email the maintainers</strong> at{" "}
              <a href="mailto:design-system@mosje.gov.in">
                design-system@mosje.gov.in
              </a>{" "}
              for anything that needs a longer conversation, an onboarding
              session, or a confidential report.
            </li>
            <li>
              <strong>Office hours</strong> run every Wednesday — bring designs
              to review, migration questions, or proposals to discuss with the
              team live.
            </li>
          </ul>
        </div>
        <Callout type="tip" title="Before you ask">
          A quick search of the Changelog and the Contributing guide answers most
          questions — especially &ldquo;how do I add a token?&rdquo; and
          &ldquo;is this component stable yet?&rdquo;
        </Callout>
      </section>
    </>
  );
}
