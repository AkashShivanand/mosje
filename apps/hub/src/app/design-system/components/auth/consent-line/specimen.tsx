"use client";

import { ConsentLine } from "@mosje/design-system";
import * as React from "react";

/** The wording is fixed; only the destinations change. */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ maxWidth: "24rem" }}>
      <ConsentLine termsHref="#terms" privacyHref="#privacy" />
    </div>
  );
}
