"use client";

import { FlaskIcon } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "flex", gap: "var(--sa-inline-16)", alignItems: "center" }}>
      <FlaskIcon size={26} />
      <FlaskIcon size={40} />
    </div>
  );
}
