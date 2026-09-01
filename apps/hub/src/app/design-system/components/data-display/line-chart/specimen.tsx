"use client";

import * as React from "react";
import { LineChart } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const SERIES = [{ name: "Applications", data: [400, 600, 520, 800, 760, 910] }];

export function LineChartSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <LineChart title="Monthly Applications" labels={LABELS} series={SERIES} showDots />
      <ChartStates
        filterLabel="date range"
        render={({ state, onRetry, filterLabel }) => (
          <LineChart
            title="Monthly Applications"
            labels={LABELS}
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
