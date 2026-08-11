import * as React from "react";
import type { Metadata } from "next";
import { Callout } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Contributing",
  description:
    "How to contribute to SAMAVESH — propose a new component, add or change a design token, run the system locally, and pass the pull-request checklist.",
};

const CHECKLIST: { label: string; detail: string }[] = [
  {
    label: "Token-only CSS",
    detail:
      "No hardcoded colors, sizes, or spacing. Every value comes from a --ds-* custom property.",
  },
  {
    label: "TypeScript strict",
    detail: "No `any`. Named exports. Props are fully typed and documented.",
  },
  {
    label: "Accessibility auditor passes",
    detail:
      "Run the accessibility-auditor agent. Keyboard nav, focus, contrast, and ARIA all clear WCAG 2.1 AA / GIGW.",
  },
  {
    label: "Storybook story updated",
    detail:
      "Add or update a story covering the new states, with the a11y addon showing no violations.",
  },
  {
    label: "CHANGELOG entry added",
    detail:
      "Add an Added / Changed / Fixed line so the next release notes write themselves.",
  },
];

const codeBlockStyle: React.CSSProperties = {
  background: "#1e2130",
  borderRadius: "var(--ds-radius-md)",
  padding: "var(--ds-spacing-xl)",
  fontFamily: "var(--ds-font-mono)",
  fontSize: 13,
  color: "#e2e8f0",
  lineHeight: 1.7,
  marginTop: "var(--ds-spacing-lg)",
  overflowX: "auto",
};

export default function ContributingPage(): React.JSX.Element {
  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Contributing</h1>
          <p className="docs-page-header__desc">
            SAMAVESH gets better when teams contribute back. Whether you want a
            brand-new component, a tweak to a color token, or just to run the
            system on your machine, this page walks you through it step by step.
          </p>
        </div>
      </header>

      {/* ── Section 1: Propose a component ────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Contribute</span>
        <h2 id="propose-component" className="docs-section__heading">
          Propose a new component
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            New components start with a conversation, not a pull request. This
            stops the same thing being built three different ways across portals.
          </p>
          <ol>
            <li>
              <strong>Open an RFC issue</strong> on{" "}
              <a
                href="https://github.com/AkashShivanand/MoSJE/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>{" "}
              using the RFC template. Describe the problem, who needs it, and at
              least one real portal that will use it.
            </li>
            <li>
              <strong>Discuss and refine</strong> with the core team in the issue.
              See the{" "}
              <a href="/design-system/resources/governance#rfc">full RFC process</a> for what
              happens next and how a component graduates from Alpha to Stable.
            </li>
          </ol>
        </div>
        <Callout type="info" title="Reuse before you build">
          Before proposing, check the existing components — there is often one that
          already fits, or composes into what you need. The smallest system is the
          most consistent one.
        </Callout>
      </section>

      {/* ── Section 2: Add or change a token ──────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Contribute</span>
        <h2 id="change-token" className="docs-section__heading">
          Add or change a design token
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Tokens are the single source of truth for every color, size, and
            spacing value. You never hand-edit the generated{" "}
            <code>tokens.css</code> — you edit the source JSON and let the
            pipeline regenerate it.
          </p>
          <ol>
            <li>
              <strong>Edit the source.</strong> Change{" "}
              <code>packages/tokens/src/primitive.json</code> (raw values like
              hex codes) or <code>packages/tokens/src/semantic.json</code> (named
              roles like <code>--ds-primary</code>).
            </li>
            <li>
              <strong>Regenerate the outputs</strong> with Style Dictionary:
            </li>
          </ol>
        </div>
        <div style={codeBlockStyle}>
          <div style={{ color: "#8892a4" }}># Regenerate CSS / TS / Tailwind / Figma outputs</div>
          <div>
            <span style={{ color: "#7dd3fc" }}>npm</span> run build -w
            @mosje/tokens
          </div>
          <div style={{ marginTop: "var(--ds-spacing-lg)", color: "#8892a4" }}>
            # Confirm the token contract still holds
          </div>
          <div>
            <span style={{ color: "#7dd3fc" }}>npm</span> test -w @mosje/tokens
          </div>
        </div>
        <div className="docs-section__body ds-prose" style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <ol start={3}>
            <li>
              <strong>Check the contract test passes.</strong> The 50-token
              snapshot test guards the backward-compatible <code>--ds-*</code>{" "}
              contract. If it fails, you have removed or renamed a token other
              apps depend on — that is a breaking change and needs a major-version
              discussion.
            </li>
          </ol>
        </div>
        <Callout type="danger" title="Never hand-edit tokens.css">
          The files in <code>packages/tokens/dist/</code> (and any{" "}
          <code>tokens.css</code>) are <strong>generated</strong>. Edits there are
          overwritten on the next build and break sync with Figma. Always edit the
          source JSON.
        </Callout>
      </section>

      {/* ── Section 3: Run locally ────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Setup</span>
        <h2 id="run-locally" className="docs-section__heading">
          Run the system locally
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            One command from the repository root brings up everything — the hub
            gate, the website, the portals, and this documentation site behind{" "}
            <code>localhost:3000</code>.
          </p>
        </div>
        <div style={codeBlockStyle}>
          <div style={{ color: "#8892a4" }}># From the repo root — boots all apps behind :3000</div>
          <div>
            <span style={{ color: "#7dd3fc" }}>npm</span> run dev
          </div>
        </div>
        <div className="docs-section__body ds-prose" style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <p>
            Need just one app? Use the targeted scripts:{" "}
            <code>npm run dev:website</code>, <code>npm run dev:smile</code>,{" "}
            <code>npm run dev:pm-ajay</code>, or <code>npm run dev:docs</code> for
            this site.
          </p>
        </div>
        <Callout type="tip" title="Editing tokens while running">
          Run <code>npm run build -w @mosje/tokens</code> after a token change and
          the dev servers pick up the regenerated CSS — no need to restart the
          whole stack.
        </Callout>
      </section>

      {/* ── Section 4: PR checklist ───────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Before you open a PR</span>
        <h2 id="pr-checklist" className="docs-section__heading">
          Pull-request checklist
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Every pull request into the design system must clear these five gates.
            Tick them off before requesting review — it makes merges fast and
            keeps the system trustworthy.
          </p>
        </div>
        <ul
          style={{
            listStyle: "none",
            margin: "var(--ds-spacing-lg) 0 0",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--ds-spacing-md)",
          }}
        >
          {CHECKLIST.map((item) => (
            <li
              key={item.label}
              style={{
                display: "flex",
                gap: "var(--ds-spacing-md)",
                alignItems: "flex-start",
                padding: "var(--ds-spacing-lg)",
                border: "1px solid var(--ds-border)",
                borderRadius: "var(--ds-radius-md)",
                background: "var(--ds-surface)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--ds-radius-sm)",
                  background: "var(--ds-success)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
              <span>
                <span
                  style={{
                    display: "block",
                    fontWeight: 600,
                    color: "var(--ds-ink)",
                    fontSize: "var(--ds-text-body-1)",
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: "var(--ds-text-body-2)",
                    color: "var(--ds-ink-muted)",
                    lineHeight: "var(--ds-leading-body-2)",
                  }}
                >
                  {item.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
