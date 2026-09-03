"use client";

import { CardSkeleton } from "@mosje/design-system";
import * as React from "react";

/** Each shape matches the chart it stands in for. */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
      <CardSkeleton shape="bars" />
      <CardSkeleton shape="line" />
      <CardSkeleton shape="donut" />
      <CardSkeleton shape="rows" />
    </div>
  );
}
