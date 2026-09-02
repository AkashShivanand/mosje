"use client";

import * as React from "react";
import { ScatterChart } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const SERIES = [
  {
    name: "Districts",
    points: [
      { x: 10, y: 20 },
      { x: 25, y: 45 },
      { x: 32, y: 38 },
      { x: 48, y: 71 },
      { x: 55, y: 62 },
      { x: 68, y: 90 },
    ],
  },
];

export function ScatterChartSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <ScatterChart
        title="District Inspections Against Grievances Closed"
        series={SERIES}
        xLabel="Inspections"
        yLabel="Grievances closed"
      />
      <ChartStates
        filterLabel="state filter"
        render={({ state, onRetry, filterLabel }) => (
          <ScatterChart
            title="District Inspections Against Grievances Closed"
            series={SERIES}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
