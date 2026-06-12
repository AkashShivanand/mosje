import * as React from "react";
import type { Metadata } from "next";
import { TokenTable, Callout } from "@/components/docs-kit/index";

export const metadata: Metadata = {
  title: "Elevation",
  description:
    "Shadow tokens that give SAMAVESH surfaces a sense of depth — from pressed controls to floating modals.",
};

const LEVELS: { token: string; label: string; use: string }[] = [
  {
    token: "--ds-shadow-xs",
    label: "Extra small",
    use: "Interactive elements on press — a button that lifts slightly, a toggled card.",
  },
  {
    token: "--ds-shadow-lg",
    label: "Large",
    use: "Transient overlays anchored to a trigger — dropdown menus, popovers, tooltips.",
  },
  {
    token: "--ds-shadow-xl",
    label: "Extra large",
    use: "Surfaces that float above everything — modals, dialogs, command palettes.",
  },
];

export default function ElevationPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Elevation</h1>
      <p style={{ fontSize: "var(--ds-text-headline)", color: "var(--ds-ink-muted)", marginTop: "var(--ds-space-3)" }}>
        Elevation tells people what sits on top of what. SAMAVESH uses three
        shadow levels to express depth — the higher the surface, the softer and
        larger its shadow.
      </p>

      <section aria-labelledby="levels" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="levels">The three levels</h2>
        <div
          style={{
            marginTop: "var(--ds-space-6)",
            background: "var(--ds-surface-muted)",
            borderRadius: "var(--ds-radius-md)",
            padding: "var(--ds-space-12) var(--ds-space-8)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--ds-space-8)",
          }}
        >
          {LEVELS.map(({ token, label }) => (
            <div
              key={token}
              style={{
                background: "var(--ds-surface)",
                boxShadow: `var(${token})`,
                borderRadius: "var(--ds-radius-md)",
                padding: "var(--ds-space-6)",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--ds-ink)" }}>{label}</div>
              <code style={{ fontSize: "var(--ds-text-body-2)", display: "inline-block", marginTop: "var(--ds-space-2)" }}>
                {token}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="when" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="when">When to use each</h2>
        <ul style={{ marginTop: "var(--ds-space-4)" }}>
          {LEVELS.map(({ token, use }) => (
            <li key={token}>
              <code className="token-table__name">{token}</code> — {use}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
          <TokenTable
            tokens={[
              {
                token: "--ds-shadow-xs",
                value: "0 2px 3px 1px rgba(33,33,33,0.12)",
                description: "Pressed / active interactive elements",
              },
              {
                token: "--ds-shadow-lg",
                value: "0 12px 16px -4px rgba(33,33,33,0.08), 0 4px 6px -2px rgba(33,33,33,0.03)",
                description: "Dropdowns, popovers, tooltips",
              },
              {
                token: "--ds-shadow-xl",
                value: "0 24px 48px -12px rgba(33,33,33,0.18)",
                description: "Modals and dialogs",
              },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="guidance" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="guidance">Guidance</h2>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
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
