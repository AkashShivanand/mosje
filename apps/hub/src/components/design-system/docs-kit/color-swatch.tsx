import * as React from "react";

interface SwatchProps {
  name: string;
  token: string;
  hex: string;
  contrastWith?: "white" | "black";
  /**
   * Paint the chip through `var(--sa-…)` instead of the literal hex.
   *
   * Prefer this. A chip painted with a hex shows what the value WAS when the page was written;
   * a chip painted through its token shows what it is. The colour page printed 14 values that
   * had stopped matching any token in the system before this existed. The hex is still passed
   * so it can be displayed as text — that half is generated, and stating a value beside a
   * swatch that renders it is the point.
   */
  cssVar?: string;
}

export function ColorSwatchGrid({ swatches }: { swatches: SwatchProps[] }): React.JSX.Element {
  return (
    <div className="color-swatch-grid">
      {swatches.map((s) => (
        <div key={s.token} className="color-swatch">
          <div
            className="color-swatch__chip"
            style={{ backgroundColor: s.cssVar ? `var(${s.cssVar})` : s.hex }}
            aria-hidden="true"
          />
          <div className="color-swatch__info">
            <div className="color-swatch__name">{s.name}</div>
            <div className="color-swatch__token">{s.token}</div>
            <div className="color-swatch__value">{s.hex}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
