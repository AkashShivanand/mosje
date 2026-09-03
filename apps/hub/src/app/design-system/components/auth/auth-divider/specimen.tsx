"use client";

import { AuthDivider } from "@mosje/design-system";
import * as React from "react";

/** The label names the route below it, not merely "or". */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ maxWidth: "24rem" }}>
      <AuthDivider label="Or sign in with your credentials" />
    </div>
  );
}
