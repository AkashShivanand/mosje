"use client";

import { SegmentedControl } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  const [period, setPeriod] = React.useState("fy");
  return (
    <SegmentedControl
      ariaLabel="Reporting period"
      value={period}
      onChange={setPeriod}
      options={[
        { label: "Financial Year", value: "fy" },
        { label: "Quarter", value: "q" },
        { label: "Month", value: "m" },
      ]}
    />
  );
}
