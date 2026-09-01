"use client";

import * as React from "react";
import { FunnelChart } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const STAGES = [
  { label: "Applications Received", value: 100000 },
  { label: "Documents Verified", value: 85000 },
  { label: "District Approved", value: 72000 },
  { label: "Amount Disbursed", value: 68000 },
];

export function FunnelChartSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <FunnelChart title="Application Pipeline" stages={STAGES} />
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
