import * as React from "react";
import type { Metadata } from "next";
import { TokenTable, DoDont } from "@/components/docs-kit/index";

export const metadata: Metadata = {
  title: "Spacing",
  description:
    "The SAMAVESH spacing scale — an 8px base grid that keeps layout rhythm consistent across every MoSJE site and portal.",
};

const SCALE: { token: string; px: number }[] = [
  { token: "--ds-space-1", px: 4 },
  { token: "--ds-space-2", px: 8 },
  { token: "--ds-space-3", px: 12 },
  { token: "--ds-space-4", px: 16 },
  { token: "--ds-space-5", px: 20 },
  { token: "--ds-space-6", px: 24 },
  { token: "--ds-space-8", px: 32 },
  { token: "--ds-space-10", px: 40 },
  { token: "--ds-space-12", px: 48 },
  { token: "--ds-space-14", px: 56 },
];

export default function SpacingPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Spacing</h1>
      <p style={{ fontSize: "var(--ds-text-headline)", color: "var(--ds-ink-muted)", marginTop: "var(--ds-space-3)" }}>
        A consistent spacing rhythm is what makes an interface feel calm and
        trustworthy. SAMAVESH uses one shared scale so every gap, pad and margin
        lines up across 13 websites and 20 portals.
      </p>

      <section aria-labelledby="how-it-works" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="how-it-works">How spacing works</h2>
        <p style={{ marginTop: "var(--ds-space-4)" }}>
          Spacing in SAMAVESH follows an 8px base grid. Almost every value is a
          multiple of 8 (8, 16, 24, 32, 40, 48, 56), with a single 4px half-step
          for the tightest gaps inside dense controls. Working in these fixed
          steps means designers and developers never have to guess a number —
          they reach for the next token up or down. The result is predictable
          vertical rhythm and horizontal alignment without a pile of one-off
          pixel values.
        </p>
      </section>

      <section aria-labelledby="scale" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="scale">The scale</h2>
        <p style={{ marginTop: "var(--ds-space-4)" }}>
          Each bar below is rendered at its real pixel height, so the steps are
          shown literally to scale.
        </p>
        <div style={{ marginTop: "var(--ds-space-6)", display: "flex", flexDirection: "column", gap: "var(--ds-space-3)" }}>
          {SCALE.map(({ token, px }) => (
            <div key={token} style={{ display: "flex", alignItems: "center", gap: "var(--ds-space-4)" }}>
              <div style={{ width: "140px", flexShrink: 0 }}>
                <code className="token-table__name">{token}</code>
              </div>
              <div
                style={{
                  height: `var(${token})`,
                  width: `var(${token})`,
                  minWidth: `var(${token})`,
                  background: "var(--ds-primary)",
                  borderRadius: "var(--ds-radius-xs)",
                }}
                aria-hidden="true"
              />
              <div
                style={{
                  height: `var(${token})`,
                  flex: 1,
                  background: "var(--ds-primary-tonal)",
                  borderRadius: "var(--ds-radius-xs)",
                }}
                aria-hidden="true"
              />
              <div style={{ width: "56px", flexShrink: 0, textAlign: "right", color: "var(--ds-ink-muted)", fontSize: "var(--ds-text-body-2)" }}>
                {px}px
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
          <TokenTable
            tokens={SCALE.map(({ token, px }) => ({
              token,
              value: `${px}px`,
              description:
                px <= 8
                  ? "Tight gaps inside controls and inline elements"
                  : px <= 24
                  ? "Padding and gaps within components"
                  : "Section spacing and layout gutters",
            }))}
          />
        </div>
      </section>

      <section aria-labelledby="guidance" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="guidance">Do &amp; Don&apos;t</h2>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
          <DoDont
            cards={[
              {
                type: "do",
                label:
                  "Use spacing tokens for every gap, padding and margin so layouts stay on the 8px grid.",
                preview: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-4)", padding: "var(--ds-space-4)" }}>
                    <div style={{ height: "16px", background: "var(--ds-primary-tonal)", borderRadius: "var(--ds-radius-xs)" }} />
                    <div style={{ height: "16px", background: "var(--ds-primary-tonal)", borderRadius: "var(--ds-radius-xs)" }} />
                    <code style={{ fontSize: "var(--ds-text-body-2)" }}>gap: var(--ds-space-4)</code>
                  </div>
                ),
              },
              {
                type: "dont",
                label:
                  "Don't hardcode arbitrary pixel values like 13px or 27px — they break the grid and drift between screens.",
                preview: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "13px", padding: "11px" }}>
                    <div style={{ height: "16px", background: "var(--ds-surface-muted)", borderRadius: "var(--ds-radius-xs)" }} />
                    <div style={{ height: "16px", background: "var(--ds-surface-muted)", borderRadius: "var(--ds-radius-xs)" }} />
                    <code style={{ fontSize: "var(--ds-text-body-2)" }}>gap: 13px</code>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
    </article>
  );
}
