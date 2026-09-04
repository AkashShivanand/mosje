import * as React from "react";

interface TypeSpecimenProps {
  role: string;
  size: string;
  weight: string;
  leading: string;
  sample: string;
  sampleHi?: string;
  /** Optional responsive size range shown in meta, e.g. "40px → 48px → 56px" */
  range?: string;
}

export function TypeSpecimen({ role, size, weight, leading, sample, sampleHi, range }: TypeSpecimenProps): React.JSX.Element {
  return (
    <div className="type-specimen">
      <div className="type-specimen__meta">
        {role} · {range ?? size} · {weight} · lh {leading}
      </div>
      <div style={{ fontSize: size, fontWeight: weight, lineHeight: leading }}>
        {sample}
      </div>
      {sampleHi && (
        <div lang="hi" style={{ fontSize: size, fontWeight: weight, lineHeight: leading, marginTop: "var(--sa-stack-8)", fontFamily: "var(--sa-font-devanagari)" }}>
          {sampleHi}
        </div>
      )}
    </div>
  );
}
