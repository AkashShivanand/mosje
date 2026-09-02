"use client";

import * as React from "react";
import { DonutChart } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const BUDGET = [
  { label: "Post-Matric", value: 45 },
  { label: "Pre-Matric", value: 30 },
  { label: "Top Class", value: 25 },
];

export function DonutChartSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <div className="cdp__specimen-row">
        <DonutChart title="Budget Distribution" data={BUDGET} centerSub="₹ crore" />
        <DonutChart title="Utilisation Against Target" value={84} max={100} centerSub="utilised" />
      </div>
      <ChartStates
        filterLabel="component filter"
        render={({ state, onRetry, filterLabel }) => (
          <DonutChart
            title="Budget Distribution"
            data={BUDGET}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
