import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

/**
 * **Layout** foundation — the page container.
 *
 * One centred column, capped in three steps, with a side margin that steps with the CAP
 * rather than with the viewport. `.sa-container` applies both; a consumer adds neither.
 *
 * ```
 * content = min(cap, viewport) − 2 × margin
 * ```
 *
 * Below 1280 the viewport binds and content is fluid. From 1280 up the cap binds and content
 * takes one of three fixed widths — **1152 → 1272 → 1376**, which only ever grow.
 *
 * **The mismatch between the two ladders is deliberate.** The cap steps at 1440 and 1920; the
 * margin steps at 768 and 1920. A wider margin buys breathing room only while the container is
 * still fluid — once the cap binds, margin stops being air and becomes a tax on content.
 * Stepping it at the desktop anchor did exactly that: crossing 1280 the cap was already 1200,
 * so content went 1152 → 1136, narrower as the screen grew. Holding 24px through Desktop XL is
 * also what makes content there exactly 1272px, the width the Handoff frame draws at 1440.
 *
 * In Figma the **Viewport** collection carries the same six modes, and both `container/page`
 * and `grid/margin/page` resolve per mode — so switching a frame's Viewport mode moves the cap
 * and the margin together, with no media query to transcribe.
 */
const meta: Meta = { title: "Foundations/Layout" };
export default meta;
type Story = StoryObj;


interface Rung {
  mode: string;
  from: number | null;
  cap: number;
  margin: number;
  content: number | null;
}

/** Shipped values: `container/*`, `grid/margin/*` and `ref/breakpoint/*`. */
const LADDER: Rung[] = [
  { mode: "Mobile", from: null, cap: 1200, margin: 16, content: null },
  { mode: "Tablet", from: 768, cap: 1200, margin: 24, content: null },
  { mode: "Laptop", from: 1024, cap: 1200, margin: 24, content: null },
  { mode: "Desktop", from: 1280, cap: 1200, margin: 24, content: 1152 },
  { mode: "Desktop XL", from: 1440, cap: 1320, margin: 24, content: 1272 },
  { mode: "Desktop Wide", from: 1920, cap: 1440, margin: 32, content: 1376 },
];

function Section({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 44 }}>
      <h3 style={{ margin: "0 0 6px", font: "600 17px/1.3 var(--sa-font-latin, system-ui)" }}>
        {title}
      </h3>
      <p
        style={{
          margin: "0 0 18px",
          maxWidth: "68ch",
          font: "400 14px/1.6 var(--sa-font-latin, system-ui)",
          color: "var(--sa-text-neutral-subtle, #5A6B7C)",
        }}
      >
        {blurb}
      </p>
      {children}
    </section>
  );
}

/** The ladder as a table — the numbers, with the binding constraint named. */
export const Ladder: Story = {
  render: () => (
    <div style={{ padding: 24, font: "400 14px/1.6 var(--sa-font-latin, system-ui)" }}>
      <Section
        title="The three-step ladder"
        blurb="Below 1280 the viewport binds and content is fluid. From 1280 up the cap binds and content is fixed. Content only ever grows."
      >
        <table style={{ borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
          <thead>
            <tr>
              {["Viewport mode", "Engages at", "Cap", "Margin", "Content"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "8px 16px 8px 0",
                    borderBottom: "2px solid var(--sa-border-neutral-base, #DCE4EC)",
                    font: "600 11px/1 var(--sa-font-latin, system-ui)",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "var(--sa-text-neutral-subtle, #5A6B7C)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LADDER.map((r) => (
              <tr key={r.mode}>
                <td
                  style={{
                    padding: "9px 16px 9px 0",
                    borderBottom: "1px solid var(--sa-border-neutral-subtle, #EDF2F7)",
                    fontFamily: "var(--sa-font-mono)",
                    fontSize: "var(--sa-type-body-2-size)",
                    lineHeight: "var(--sa-type-body-2-lh)",
                  }}
                >
                  {r.mode}
                </td>
                <td style={cell}>{r.from ?? "—"}</td>
                <td style={cell}>{r.cap}</td>
                <td style={cell}>{r.margin}</td>
                <td style={{ ...cell, fontWeight: 600 }}>
                  {r.content ?? (
                    <span style={{ fontWeight: 400, color: "var(--sa-text-neutral-subtle, #5A6B7C)" }}>
                      fluid — viewport binds
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  ),
};

const cell: React.CSSProperties = {
  padding: "9px 16px 9px 0",
  borderBottom: "1px solid var(--sa-border-neutral-subtle, #EDF2F7)",
  fontFamily: "var(--sa-font-mono)",
  fontSize: "var(--sa-type-body-2-size)",
  lineHeight: "var(--sa-type-body-2-lh)",
};

/**
 * The same ladder drawn to scale, so the relationship between cap, margin and content is
 * visible rather than arithmetic. Each bar is one viewport mode at its engaging width.
 */
export const ToScale: Story = {
  render: () => {
    const WIDEST = 1920;
    const px = (n: number) => `${(n / WIDEST) * 100}%`;
    return (
      <div style={{ padding: 24, font: "400 14px/1.6 var(--sa-font-latin, system-ui)" }}>
        <Section
          title="Drawn to scale"
          blurb="Each row is one mode at the width it engages. The outer bar is the viewport, the inner block is the capped container, and the shaded ends are the margin the container reserves inside itself."
        >
          <div style={{ display: "grid", gap: 14 }}>
            {LADDER.filter((r) => r.from).map((r) => {
              const vw = r.from as number;
              const el = Math.min(r.cap, vw);
              return (
                <div key={r.mode}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "var(--sa-font-mono)",
                      fontSize: "var(--sa-type-label-2-size)",
                      lineHeight: "var(--sa-type-label-2-lh)",
                      fontWeight: 500,
                      color: "var(--sa-text-neutral-subtle, #5A6B7C)",
                      marginBottom: 5,
                    }}
                  >
                    <span>
                      {r.mode} · {vw}px
                    </span>
                    <span>
                      cap {r.cap} · margin {r.margin} · content {el - 2 * r.margin}
                    </span>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      width: px(vw),
                      height: 30,
                      background: "var(--sa-bg-neutral-subtle, #EDF2F7)",
                      borderRadius: 3,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: `${(el / vw) * 100}%`,
                        height: "100%",
                        display: "flex",
                        borderRadius: 3,
                        overflow: "hidden",
                        outline: "1px solid var(--sa-border-brand-primary-base, #0373DF)",
                      }}
                    >
                      <span style={{ width: `${(r.margin / el) * 100}%`, background: "var(--sa-bg-brand-primary-subtle, #D6E8FB)" }} />
                      <span style={{ flex: 1, background: "var(--sa-bg-brand-primary-bolder, #0373DF)" }} />
                      <span style={{ width: `${(r.margin / el) * 100}%`, background: "var(--sa-bg-brand-primary-subtle, #D6E8FB)" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>
    );
  },
};
