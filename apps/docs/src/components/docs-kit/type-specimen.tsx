import * as React from "react";

interface TypeSpecimenProps {
  role: string;
  size: string;
  weight: string;
  leading: string;
  sample: string;
  sampleHi?: string;
}

export function TypeSpecimen({ role, size, weight, leading, sample, sampleHi }: TypeSpecimenProps): React.JSX.Element {
  return (
    <div className="type-specimen">
      <div className="type-specimen__meta">
        {role} · {size} · {weight} · lh {leading}
      </div>
      <div style={{ fontSize: size, fontWeight: weight, lineHeight: leading }}>
        {sample}
      </div>
      {sampleHi && (
        <div style={{ fontSize: size, fontWeight: weight, lineHeight: "1.7", marginTop: "var(--ds-spacing-sm)", fontFamily: "\"Noto Sans Devanagari\", var(--ds-font-sans)" }}>
          {sampleHi}
        </div>
      )}
    </div>
  );
}
