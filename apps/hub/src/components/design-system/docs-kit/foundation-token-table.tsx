import * as React from "react";

import type { FoundationTokenRow } from "@/lib/design-system/foundations-data.generated";

/**
 * The token table every foundation page renders — from GENERATED rows, never typed.
 *
 * Four things a reader is owed on every row, in the order they ask for them:
 *
 *   1. the name they type          `--sa-motion-hover-duration`
 *   2. what it resolves to         `150ms` — the literal, so a designer can check it
 *   3. where it lives in Figma     `Motion · motion/hover/duration`, or WHY it is code-only
 *   4. when to reach for it        the sentence usage-guidance.mjs derives — the same one
 *                                  Figma shows in the variable's description
 *
 * Tier is shown, not hidden: a Tier-1 row is rendered in the muted register with a
 * "reference" chip, because the reader must be able to see at a glance which rows they
 * are allowed to bind. `tier-discipline.test.mjs` bans `--sa-ref-*` in app code; this
 * table says so on every page instead of once in a rule file.
 */

const TIER_LABEL: Record<FoundationTokenRow["tier"], { chip: string; title: string }> = {
  ref: { chip: "Tier 1", title: "Reference — private. Bind the Tier-2 token that aliases it." },
  sys: { chip: "Tier 2", title: "Semantic — the public contract. This is what you bind." },
  cmp: { chip: "Tier 3", title: "Component — bind only when building the component itself." },
};

function Preview({ row }: { row: FoundationTokenRow }): React.JSX.Element | null {
  const v = row.value;
  if (!v) return null;
  if (row.type === "color") return <span className="ftt__swatch" style={{ background: v }} aria-hidden="true" />;
  if (row.type === "shadow") return <span className="ftt__shadow" style={{ boxShadow: v === "none" ? undefined : v }} aria-hidden="true" />;
  if (row.type === "cubicBezier") {
    const m = /cubic-bezier\(([^)]+)\)/.exec(v);
    if (!m?.[1]) return null;
    const pts = m[1].split(",").map((n) => Number(n.trim()));
    if (pts.length !== 4 || pts.some((n) => Number.isNaN(n))) return null;
    const [x1, y1, x2, y2] = pts as [number, number, number, number];
    // A 1:1 curve box: y is flipped because SVG y grows downward.
    const d = `M0,40 C${x1 * 40},${40 - y1 * 40} ${x2 * 40},${40 - y2 * 40} 40,0`;
    return (
      <svg className="ftt__curve" viewBox="0 0 40 40" aria-hidden="true">
        <path d={d} />
      </svg>
    );
  }
  if (/^(inline|stack|padding|section|space)\//.test(row.path) || row.path.startsWith("ref/space")) {
    return <span className="ftt__bar" style={{ width: `min(${v}, 100%)` }} aria-hidden="true" />;
  }
  if (row.type === "dimension" && /^(shape|radius)\//.test(row.path)) {
    return <span className="ftt__corner" style={{ borderTopLeftRadius: v }} aria-hidden="true" />;
  }
  return null;
}

export interface FoundationTokenTableProps {
  rows: FoundationTokenRow[];
  /** Hide Tier-1 rows — for a page whose reader should only ever see the public contract. */
  publicOnly?: boolean;
  caption?: string;
}

export function FoundationTokenTable({ rows, publicOnly, caption }: FoundationTokenTableProps): React.JSX.Element {
  const shown = publicOnly ? rows.filter((r) => r.tier !== "ref") : rows;
  return (
    <div className="ftt__scroll">
      <table className="ftt">
        {caption ? <caption className="ftt__caption">{caption}</caption> : null}
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Value</th>
            <th scope="col">In Figma</th>
            <th scope="col">Use it for</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.path} className={`ftt__row ftt__row--${r.tier}`}>
              <td>
                <span className={`ftt__tier ftt__tier--${r.tier}`} title={TIER_LABEL[r.tier].title}>
                  {TIER_LABEL[r.tier].chip}
                </span>
                <code className="ftt__name">{r.css}</code>
                {r.raw.startsWith("{") ? <span className="ftt__alias">→ {r.raw.slice(1, -1)}</span> : null}
              </td>
              <td className="ftt__value">
                <Preview row={r} />
                <code>{r.value ?? "—"}</code>
              </td>
              <td className="ftt__figma">
                {r.figma ? <code>{r.figma}</code> : <span className="ftt__codeonly">Code-only — {r.excluded ?? "no Figma equivalent"}</span>}
              </td>
              <td className="ftt__use">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
