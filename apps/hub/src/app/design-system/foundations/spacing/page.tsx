import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { TokenTable, DoDont } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Spacing",
  description:
    "The SAMAVESH spacing scale — an 8px base grid that keeps layout rhythm consistent across every MoSJE site and portal.",
};

const SCALE: { token: string; px: number }[] = [
  { token: "--sa-stack-2xs", px: 4 },
  { token: "--sa-stack-xs", px: 8 },
  { token: "--sa-stack-s", px: 12 },
  { token: "--sa-stack-m", px: 16 },
  { token: "--sa-padding-l", px: 20 },
  { token: "--sa-stack-l", px: 24 },
  { token: "--sa-stack-xl", px: 32 },
  { token: "--sa-stack-2xl", px: 40 },
  { token: "--sa-section-m", px: 48 },
  { token: "--sa-section-l", px: 56 },
];

export default function SpacingPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Spacing</h1>
      <p style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-s)" }}>
        A consistent spacing rhythm is what makes an interface feel calm and
        trustworthy. SAMAVESH uses one shared scale so every gap, pad and margin
        lines up across 13 websites and 20 portals.
      </p>
      <div style={{ marginTop: "var(--sa-stack-m)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.spacing)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="how-it-works" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="how-it-works">How spacing works</h2>
        <p style={{ marginTop: "var(--sa-stack-m)" }}>
          Spacing in SAMAVESH follows an 8px base grid. Almost every value is a
          multiple of 8 (8, 16, 24, 32, 40, 48, 56), with a single 4px half-step
          for the tightest gaps inside dense controls. Working in these fixed
          steps means designers and developers never have to guess a number —
          they reach for the next token up or down. The result is predictable
          vertical rhythm and horizontal alignment without a pile of one-off
          pixel values.
        </p>
      </section>

      <section aria-labelledby="scale" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="scale">The scale</h2>
        <p style={{ marginTop: "var(--sa-stack-m)" }}>
          Each bar below is rendered at its real pixel height, so the steps are
          shown literally to scale.
        </p>
        <div style={{ marginTop: "var(--sa-stack-l)", display: "flex", flexDirection: "column", gap: "var(--sa-stack-s)" }}>
          {SCALE.map(({ token, px }) => (
            <div key={token} style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-m)" }}>
              <div style={{ width: "140px", flexShrink: 0 }}>
                <code className="token-table__name">{token}</code>
              </div>
              <div
                style={{
                  height: `var(${token})`,
                  width: `var(${token})`,
                  minWidth: `var(${token})`,
                  background: "var(--sa-bg-brand-primary-bolder)",
                  borderRadius: "var(--sa-shape-xs)",
                }}
                aria-hidden="true"
              />
              <div
                style={{
                  height: `var(${token})`,
                  flex: 1,
                  background: "var(--sa-bg-brand-primary-subtler)",
                  borderRadius: "var(--sa-shape-xs)",
                }}
                aria-hidden="true"
              />
              <div style={{ width: "56px", flexShrink: 0, textAlign: "right", color: "var(--sa-color-text-muted)", fontSize: "var(--sa-type-body-2-size)" }}>
                {px}px
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--sa-stack-m)" }}>
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

      <section aria-labelledby="guidance" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="guidance">Do &amp; Don&apos;t</h2>
        <div style={{ marginTop: "var(--sa-stack-m)" }}>
          <DoDont
            cards={[
              {
                type: "do",
                label:
                  "Use spacing tokens for every gap, padding and margin so layouts stay on the 8px grid.",
                preview: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-m)", padding: "var(--sa-stack-m)" }}>
                    <div style={{ height: "16px", background: "var(--sa-color-action-primary-tonal)", borderRadius: "var(--sa-shape-xs)" }} />
                    <div style={{ height: "16px", background: "var(--sa-color-action-primary-tonal)", borderRadius: "var(--sa-shape-xs)" }} />
                    <code style={{ fontSize: "var(--sa-type-body-2-size)" }}>gap: var(--sa-stack-m)</code>
                  </div>
                ),
              },
              {
                type: "dont",
                label:
                  "Don't hardcode arbitrary pixel values like 13px or 27px — they break the grid and drift between screens.",
                preview: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "13px", padding: "11px" }}>
                    <div style={{ height: "16px", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-xs)" }} />
                    <div style={{ height: "16px", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-xs)" }} />
                    <code style={{ fontSize: "var(--sa-type-body-2-size)" }}>gap: 13px</code>
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
