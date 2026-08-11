"use client";

import * as React from "react";

/**
 * The two things the web can do that a Figma page cannot.
 *
 * 1. Repaint the whole document under a different brand, live, so a reader FEELS what a brand
 *    swap changes instead of reading that it changes primary and neutral.
 * 2. Report the contrast of a pair by MEASURING the rendered colours in the browser, rather
 *    than printing a number someone typed. If a token drifts, this number moves with it — the
 *    generated data and the live reading are two independent paths to the same answer, and a
 *    disagreement between them is visible on the page.
 */

const BRANDS = [
  { id: "blue", label: "Blue", note: "default" },
  { id: "navy", label: "Navy", note: "" },
  { id: "dbim-blue", label: "DBIM Blue", note: "preview" },
  { id: "dbim-burgundy", label: "DBIM Burgundy", note: "preview" },
  { id: "dbim-purple", label: "DBIM Purple", note: "preview" },
  { id: "dbim-green", label: "DBIM Green", note: "preview · fails AA" },
  { id: "dbim-chrome-yellow", label: "DBIM Chrome Yellow", note: "preview" },
  { id: "dbim-cinnamon-red", label: "DBIM Cinnamon Red", note: "preview" },
] as const;

function srgb(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}
function luminance(rgb: string): number | null {
  const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(rgb);
  if (!m?.[1] || !m[2] || !m[3]) return null;
  return 0.2126 * srgb(+m[1]) + 0.7152 * srgb(+m[2]) + 0.0722 * srgb(+m[3]);
}
function measure(fg: string, bg: string): number | null {
  const a = luminance(fg);
  const b = luminance(bg);
  if (a === null || b === null) return null;
  return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
}

/** Repaint the page under any brand on the axis, including the code-only DBIM previews. */
export function BrandSwitcher(): React.JSX.Element {
  const [brand, setBrand] = React.useState<string>("blue");

  React.useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("data-brand");
    root.setAttribute("data-brand", brand);
    return () => {
      if (previous) root.setAttribute("data-brand", previous);
      else root.removeAttribute("data-brand");
    };
  }, [brand]);

  return (
    <div className="color-brandbar">
      <span className="color-brandbar__label" id="brandbar-label">
        Repaint this page
      </span>
      <div className="color-brandbar__options" role="radiogroup" aria-labelledby="brandbar-label">
        {BRANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            role="radio"
            aria-checked={brand === b.id}
            className="color-brandbar__option"
            data-active={brand === b.id ? "true" : undefined}
            onClick={() => setBrand(b.id)}
          >
            {/* The dot carries the brand it represents, so it resolves THAT brand's own
                primary from the [data-brand] block in tokens.css. No hex, no lookup table —
                the swatch is the system explaining itself. */}
            <span className="color-brandbar__dot" data-brand={b.id} aria-hidden="true" />
            {b.label}
            {b.note ? <span className="color-brandbar__note">{b.note}</span> : null}
          </button>
        ))}
      </div>
      <p className="color-brandbar__hint">
        Every swatch on this page is painted through its token, so all of them repaint together.
        The six DBIM entries are conformance previews — they exist in code only and are never in
        the Figma library.
      </p>
    </div>
  );
}

/**
 * A fill with the ink the system measured for it, and the ratio READ BACK from the rendered
 * result rather than printed from a table.
 */
export function LivePair({
  bgToken,
  onToken,
  rung,
  expected,
}: {
  bgToken: string;
  onToken: string;
  rung: string;
  expected: number | null;
}): React.JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [live, setLive] = React.useState<number | null>(null);

  React.useEffect(() => {
    const read = () => {
      if (!ref.current) return;
      const cs = getComputedStyle(ref.current);
      setLive(measure(cs.color, cs.backgroundColor));
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-brand"] });
    return () => mo.disconnect();
  }, []);

  const drift = live !== null && expected !== null && Math.abs(live - expected) > 0.05;

  return (
    <div
      ref={ref}
      className="color-pair"
      style={{
        background: `var(--sa-${bgToken.replace(/\//g, "-")})`,
        color: `var(--sa-${onToken.replace(/\//g, "-")})`,
      }}
    >
      <span className="color-pair__rung">{rung}</span>
      <span className="color-pair__ratio">{live !== null ? `${live.toFixed(2)}:1` : "—"}</span>
      <span className="color-pair__note">
        {drift ? `⚠ build says ${expected?.toFixed(2)}` : "measured live"}
      </span>
    </div>
  );
}
