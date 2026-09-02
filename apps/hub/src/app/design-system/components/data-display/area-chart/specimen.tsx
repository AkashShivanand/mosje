"use client";

import * as React from "react";
import { AreaChart } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const LABELS = ["Apr", "May", "Jun", "Jul", "Aug"];
const SERIES = [{ name: "Disbursed", data: [120, 240, 380, 520, 610] }];

export function AreaChartSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <AreaChart title="Disbursals by Month" yLabel="₹ crore" labels={LABELS} series={SERIES} />
      <ChartStates
        filterLabel="financial year"
        render={({ state, onRetry, filterLabel }) => (
          <AreaChart
            title="Disbursals by Month"
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
