import * as React from "react";
import type { Metadata } from "next";
import { Callout, CodeBlock, Syn } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Contributing",
  description:
    "How to contribute to SAMAVESH — propose a new component, add or change a design token, run the system locally, and pass the pull-request checklist.",
};

const CHECKLIST: { label: string; detail: string }[] = [
  {
    label: "Token-only CSS",
    detail:
      "No hardcoded colors, sizes, or spacing. Every value comes from a --sa-* custom property.",
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
              roles like <code>--sa-color-action-primary-default</code>).
            </li>
            <li>
              <strong>Regenerate the outputs</strong> with Style Dictionary:
            </li>
          </ol>
        </div>
        <CodeBlock>
          <div><Syn.Comment># Regenerate CSS / TS / Tailwind / Figma outputs</Syn.Comment></div>
          <div>
            <Syn.Builtin>npm</Syn.Builtin> run build -w
            @mosje/tokens
          </div>
          <div style={{ marginTop: "var(--sa-stack-16)" }}>
            <Syn.Comment># Confirm the token contract still holds</Syn.Comment>
          </div>
          <div>
            <Syn.Builtin>npm</Syn.Builtin> test -w @mosje/tokens
          </div>
        </CodeBlock>
        <div className="docs-section__body ds-prose" style={{ marginTop: "var(--sa-stack-16)" }}>
          <ol start={3}>
            <li>
              <strong>Check the contract test passes.</strong> The 50-token
              snapshot test guards the backward-compatible <code>--sa-*</code>{" "}
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
            <code>localhost:3007</code>.
          </p>
        </div>
        <CodeBlock>
          <div><Syn.Comment># From the repo root — boots the whole estate on :3007</Syn.Comment></div>
          <div>
            <Syn.Builtin>npm</Syn.Builtin> run dev
          </div>
        </CodeBlock>
        <div className="docs-section__body ds-prose" style={{ marginTop: "var(--sa-stack-16)" }}>
          <p>
            There is no per-app dev server to reach for. Since the single-origin
            consolidation the portals are route groups inside the hub, so{" "}
            <code>npm run dev</code> is the whole estate — the website at{" "}
            <code>/website</code>, these docs at <code>/design-system</code>, and each
            portal at <code>/portals/&lt;slug&gt;</code>. The one exception is{" "}
            <code>npm run dev:storybook</code>, and only when you are authoring stories.
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
            margin: "var(--sa-stack-16) 0 0",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--sa-stack-12)",
          }}
        >
          {CHECKLIST.map((item) => (
            <li
              key={item.label}
              style={{
                display: "flex",
                gap: "var(--sa-stack-12)",
                alignItems: "flex-start",
                padding: "var(--sa-padding-16)",
                border: "1px solid var(--sa-border-neutral-subtle)",
                borderRadius: "var(--sa-shape-md)",
                background: "var(--sa-bg-neutral-base)",
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
                  borderRadius: "var(--sa-shape-sm)",
                  background: "var(--sa-color-status-success)",
                  color: "var(--sa-on-bg-status-success-bolder)",
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
                    color: "var(--sa-text-neutral-base)",
                    fontSize: "var(--sa-type-body-1-size)",
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: "var(--sa-type-body-2-size)",
                    color: "var(--sa-text-neutral-subtle)",
                    lineHeight: "var(--sa-type-body-2-lh)",
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
