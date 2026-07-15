import * as React from "react";

interface SwatchProps {
  name: string;
  token: string;
  hex: string;
  contrastWith?: "white" | "black";
}

export function ColorSwatchGrid({ swatches }: { swatches: SwatchProps[] }): React.JSX.Element {
  return (
    <div className="color-swatch-grid">
      {swatches.map((s) => (
        <div key={s.token} className="color-swatch">
          <div className="color-swatch__chip" style={{ backgroundColor: s.hex }} aria-hidden="true" />
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
