"use client";

import { SigningIntoBar } from "@mosje/design-system";
import * as React from "react";

/** The scheme name in full — never the acronym. */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ maxWidth: "26rem" }}>
      <SigningIntoBar portalName="Senior Citizens Welfare" tone="surface" onChange={() => {}} />
    </div>
  );
}
