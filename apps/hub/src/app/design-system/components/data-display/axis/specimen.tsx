"use client";

import * as React from "react";
import { BarChart, formatCompact, formatIndian, formatPercent } from "@mosje/design-system";

const RELEASES = [
  { label: "Uttar Pradesh", value: 4500000 },
  { label: "Maharashtra", value: 3800000 },
  { label: "Bihar", value: 2900000 },
];

export function AxisSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <BarChart
        title="Releases by State, Indian Grouping"
        yLabel="₹"
        data={RELEASES}
        valueFormat={formatIndian}
      />
      <BarChart
        title="Releases by State, Compact"
        yLabel="₹"
        data={RELEASES}
        valueFormat={formatCompact}
      />
      <ul>
        <li>
          <code>formatIndian(4500000)</code> → {formatIndian(4500000)}
        </li>
        <li>
          <code>formatCompact(4500000)</code> → {formatCompact(4500000)}
        </li>
        <li>
          <code>formatPercent(84.216)</code> → {formatPercent(84.216)}
        </li>
        <li>
          <code>formatPercent(84.216, 0)</code> → {formatPercent(84.216, 0)}
        </li>
      </ul>
    </div>
  );
}
