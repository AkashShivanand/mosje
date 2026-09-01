"use client";

import * as React from "react";
import { BarChart } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const STATE_TOTALS = [
  { label: "Uttar Pradesh", value: 450 },
  { label: "Maharashtra", value: 380 },
  { label: "Bihar", value: 290 },
];

export function BarChartSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <BarChart title="State Beneficiary Totals" data={STATE_TOTALS} showValues />
      <ChartStates
        filterLabel="state filter"
        render={({ state, onRetry, filterLabel }) => (
          <BarChart
            title="State Beneficiary Totals"
            data={STATE_TOTALS}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
