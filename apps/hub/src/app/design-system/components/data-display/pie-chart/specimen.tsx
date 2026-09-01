"use client";

import * as React from "react";
import { PieChart } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const FUNDS = [
  { label: "Direct Benefit", value: 60 },
  { label: "Infrastructure", value: 40 },
];

export function PieChartSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <PieChart title="Fund Distribution" data={FUNDS} />
      <ChartStates
        filterLabel="component filter"
        render={({ state, onRetry, filterLabel }) => (
          <PieChart
            title="Fund Distribution"
            data={FUNDS}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
