import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { TokenTable, Callout } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Elevation",
  description:
    "Shadow tokens that give SAMAVESH surfaces a sense of depth — from pressed controls to floating modals.",
};

const LEVELS: { token: string; label: string; use: string }[] = [
  {
    token: "--sa-elevation-card",
    label: "Extra small",
    use: "Interactive elements on press — a button that lifts slightly, a toggled card.",
  },
  {
    token: "--sa-elevation-modal",
    label: "Large",
    use: "Transient overlays anchored to a trigger — dropdown menus, popovers, tooltips.",
  },
  {
    token: "--sa-elevation-toast",
    label: "Extra large",
    use: "Surfaces that float above everything — modals, dialogs, command palettes.",
  },
];

export default function ElevationPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Elevation</h1>
      <p style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-s)" }}>
        Elevation tells people what sits on top of what. SAMAVESH uses three
        shadow levels to express depth — the higher the surface, the softer and
        larger its shadow.
      </p>
      <div style={{ marginTop: "var(--sa-stack-m)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.elevation)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="levels" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="levels">The three levels</h2>
        <div
          style={{
            marginTop: "var(--sa-stack-l)",
            background: "var(--sa-bg-neutral-subtler)",
            borderRadius: "var(--sa-shape-md)",
            padding: "var(--sa-section-m) var(--sa-padding-2xl)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--sa-stack-xl)",
          }}
        >
          {LEVELS.map(({ token, label }) => (
            <div
              key={token}
              style={{
                background: "var(--sa-bg-neutral-base)",
                boxShadow: `var(${token})`,
                borderRadius: "var(--sa-shape-md)",
                padding: "var(--sa-padding-xl)",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--sa-color-text-default)" }}>{label}</div>
              <code style={{ fontSize: "var(--sa-type-body-2-size)", display: "inline-block", marginTop: "var(--sa-stack-xs)" }}>
                {token}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="when" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="when">When to use each</h2>
        <ul style={{ marginTop: "var(--sa-stack-m)" }}>
          {LEVELS.map(({ token, use }) => (
            <li key={token}>
              <code className="token-table__name">{token}</code> — {use}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--sa-stack-m)" }}>
          <TokenTable
            tokens={[
              {
                token: "--sa-elevation-card",
                value: "0 2px 3px 1px rgba(33,33,33,0.12)",
                description: "Pressed / active interactive elements",
              },
              {
                token: "--sa-elevation-modal",
                value: "0 12px 16px -4px rgba(33,33,33,0.08), 0 4px 6px -2px rgba(33,33,33,0.03)",
                description: "Dropdowns, popovers, tooltips",
              },
              {
                token: "--sa-elevation-toast",
                value: "0 24px 48px -12px rgba(33,33,33,0.18)",
                description: "Modals and dialogs",
              },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="guidance" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="guidance">Guidance</h2>
        <div style={{ marginTop: "var(--sa-stack-m)" }}>
          <Callout type="warning" title="Shadows are for surfaces, not text">
            Don&apos;t apply a drop-shadow to text to fake emphasis — it hurts
            legibility and fails contrast checks. Use elevation only on
            surfaces (cards, menus, dialogs) to communicate depth and stacking
            order.
          </Callout>
        </div>
      </section>
    </article>
  );
}
