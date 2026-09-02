"use client";

import * as React from "react";
import { BarChart, DonutChart, FunnelChart } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const DATA = [
  { label: "Approved", value: 62 },
  { label: "Pending", value: 26 },
  { label: "Rejected", value: 12 },
];

const STAGES = [
  { label: "Received", value: 100000 },
  { label: "Verified", value: 85000 },
  { label: "Disbursed", value: 68000 },
];

/**
 * `ChartFrame` is internal to the chart layer and is not exported from the
 * package barrel, so the specimen shows it the only way a reader will ever meet
 * it: through the charts that render it. The point being demonstrated is that
 * three different marks produce ONE object on the page in every state.
 */
export function ChartFrameSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <div className="cdp__specimen-row">
        <BarChart title="Applications by Status" data={DATA} />
        <DonutChart title="Applications by Status" data={DATA} />
      </div>
      <ChartStates
        filterLabel="district filter"
        render={({ state, onRetry, filterLabel }) => (
          <BarChart
            title="Applications by Status"
            data={DATA}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
      <ChartStates
        filterLabel="district filter"
        render={({ state, onRetry, filterLabel }) => (
          <FunnelChart
            title="Application Pipeline"
            stages={STAGES}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
