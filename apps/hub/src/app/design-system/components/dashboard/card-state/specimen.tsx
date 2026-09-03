"use client";

import { CardState } from "@mosje/design-system";
import * as React from "react";

/** Three kinds, three different sentences. */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
      <CardState kind="empty" title="No applications yet" description="Nothing has been submitted for this scheme." />
      <CardState
        kind="no-results"
        title="No districts match this filter"
        description="Clear the district filter to see the full list."
      />
      <CardState kind="not-published" title="Not published" description="The Management Information System does not publish this figure yet." />
    </div>
  );
}
