import * as React from "react";
import type { Metadata } from "next";
import { TokenTable, DoDont } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Layout Grid",
  description:
    "The SAMAVESH page container — a three-step cap with a margin ladder that steps with the cap, so content width only ever grows.",
};

/**
 * Every number on this page is the shipped value, not a restatement.
 *
 * The cap rungs come from `container/content` | `contentXl` | `contentWide`, the margin rungs
 * from `grid/margin/mobile` | `tablet` | `desktop`, and the anchors from `ref/breakpoint/*`.
 * `container/page` and `grid/margin/page` are the resolved values — the pair `.sa-container`
 * actually applies — and each carries one mode per viewport in the Figma **Viewport**
 * collection, which is why a designer opening a Desktop XL frame sees 1320 without needing to
 * know the media query behind it.
 */
const LADDER: {
  mode: string;
  from: string;
  cap: number;
  margin: number;
  content: string;
  binds: "viewport" | "cap";
}[] = [
  { mode: "Mobile", from: "—", cap: 1200, margin: 16, content: "fluid", binds: "viewport" },
  { mode: "Tablet", from: "768", cap: 1200, margin: 24, content: "fluid", binds: "viewport" },
  { mode: "Laptop", from: "1024", cap: 1200, margin: 24, content: "fluid", binds: "viewport" },
  { mode: "Desktop", from: "1280", cap: 1200, margin: 24, content: "1152", binds: "cap" },
  { mode: "Desktop XL", from: "1440", cap: 1320, margin: 24, content: "1272", binds: "cap" },
  { mode: "Desktop Wide", from: "1920", cap: 1440, margin: 32, content: "1376", binds: "cap" },
];

const TOKENS = [
  {
    token: "--sa-container-page",
    value: "1200 → 1320 → 1440",
    description:
      "The RESOLVED cap at the current window size. Bind this, not a rung. Carries one mode per viewport in Figma.",
  },
  {
    token: "--sa-grid-margin-page",
    value: "16 → 24 → 32",
    description:
      "The RESOLVED side margin, and the companion to the cap. `.sa-container` applies it as inline padding.",
  },
  {
    token: "--sa-container-content",
    value: "1200px",
    description: "Rung 1. UX4G 3.0's published desktop content width.",
  },
  {
    token: "--sa-container-contentXl",
    value: "1320px",
    description: "Rung 2, from 1440. Aliases `container/2xl` so the estate cap and UX4G's ladder cannot drift.",
  },
  {
    token: "--sa-container-contentWide",
    value: "1440px",
    description: "Rung 3, from 1920. Stops here: past ~1440 a 12-column grid costs more in eye travel than it returns.",
  },
];

export default function LayoutGridPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Layout Grid</h1>
      <p className="ds-lead">
        One centred column, capped in three steps, with a side margin that steps
        with the cap rather than with the viewport. Everything on a SAMAVESH page
        sits inside it, and the class that applies it is <code>.sa-container</code>.
      </p>

      <h2>The rule</h2>
      <p>
        <code>.sa-container</code> caps the <strong>element</strong> and pads{" "}
        <strong>inside</strong> it. The cap is a ceiling; the margin is a floor
        that keeps content off the edge on any viewport narrower than the cap.
      </p>
      <pre>
        <code>content = min(cap, viewport) − 2 × margin</code>
      </pre>

      <h2>The ladder</h2>
      <p>
        Below 1280 the viewport binds and content is fluid. From 1280 up the cap
        binds and content takes one of three fixed widths.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table className="token-table">
          <thead>
            <tr>
              <th scope="col">Viewport mode</th>
              <th scope="col">Engages at</th>
              <th scope="col">Cap</th>
              <th scope="col">Margin</th>
              <th scope="col">Content</th>
            </tr>
          </thead>
          <tbody>
            {LADDER.map((r) => (
              <tr key={r.mode}>
                <td>
                  <code className="token-table__name">{r.mode}</code>
                </td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{r.from}</td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{r.cap}</td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{r.margin}</td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>
                  <strong>{r.content}</strong>
                  {r.binds === "viewport" && (
                    <span style={{ color: "var(--sa-color-text-muted)" }}> (viewport binds)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Why the margin is out of step with the cap</h2>
      <p>
        The cap steps at <strong>1440</strong> and <strong>1920</strong>; the margin
        steps at <strong>768</strong> and <strong>1920</strong>. That mismatch is
        deliberate, and it is the part most likely to look like a mistake.
      </p>
      <p>
        A wider margin buys breathing room only while the container is still fluid.
        Once the cap binds, the margin stops being air and starts being a tax on
        content. Stepping it at the desktop anchor did exactly that: crossing 1280
        the cap was already 1200, so content went{" "}
        <strong>1152&nbsp;→&nbsp;1136</strong> — narrower as the screen grew.
      </p>
      <p>
        Holding 24px through Desktop&nbsp;XL is also what makes content there exactly{" "}
        <strong>1272px</strong>, the width the Figma Handoff frame draws at 1440.
        Taking 32px there would give 1256 and miss it.
      </p>
      <p>
        The result is monotonic — content only ever grows:{" "}
        <strong>1152&nbsp;→&nbsp;1272&nbsp;→&nbsp;1376</strong>.
      </p>

      <h2>Tokens</h2>
      <TokenTable tokens={TOKENS} />
      <p>
        Bind <code>--sa-container-page</code> rather than a rung. The rungs are
        fixed at every window size; <code>page</code> is the one that resolves.
        Reach for it directly only where a media query is unavailable — an inline
        style, for instance, which is how <code>SiteHeader</code> caps its own column.
      </p>

      <h2>Using it</h2>
      <DoDont
        cards={[
          {
            type: "do",
            label:
              "Wrap section content in .sa-container and let it own both the cap and the margin.",
            preview: <code>{`<div className="sa-container">…</div>`}</code>,
          },
          {
            type: "dont",
            label:
              "Add your own horizontal padding. The container already reserves the margin, and a second one double-insets the column.",
            preview: <code>{`<div className="sa-container px-6">…</div>`}</code>,
          },
          {
            type: "dont",
            label:
              "Restate a width as a literal. It cannot follow the ladder, and it is how the estate ended up running four different caps at once.",
            preview: <code>{`<div className="mx-auto max-w-[1280px]">…</div>`}</code>,
          },
        ]}
      />

      <h2>In Figma</h2>
      <p>
        The <strong>Viewport</strong> collection carries six modes — Mobile, Tablet,
        Laptop, Desktop, Desktop&nbsp;XL, Desktop&nbsp;Wide — and both{" "}
        <code>container/page</code> and <code>grid/margin/page</code> resolve per mode.
        Switching a frame&rsquo;s Viewport mode moves the cap and the margin together,
        so the column in the file matches the column in the build without anyone
        transcribing a media query.
      </p>
      <p>
        This was previously impossible to represent: the CSS derived the cap inside a
        media query, and a Figma variable cannot express one, so the page cap was the
        single layout value the library could not carry.
      </p>
    </article>
  );
}
