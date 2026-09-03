"use client";

import { MaskedContactRow } from "@mosje/design-system";
import * as React from "react";

/** Masked to the last four digits — recognisable, not identifying. */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ maxWidth: "24rem" }}>
      <MaskedContactRow channel="phone" maskedValue="+91 98••••1234" onEdit={() => {}} />
    </div>
  );
}
