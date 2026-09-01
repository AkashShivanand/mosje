"use client";

import * as React from "react";
import { IndiaMap } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const COVERAGE = [
  { state: "Uttar Pradesh", value: 1200 },
  { state: "Maharashtra", value: 950 },
  { state: "Bihar", value: 780 },
  { state: "Karnataka", value: 640 },
  { state: "Odisha", value: 410 },
];

export function IndiaMapSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <IndiaMap title="State Beneficiary Coverage" data={COVERAGE} />
      <ChartStates
        filterLabel="scheme filter"
        render={({ state, onRetry, filterLabel }) => (
          <IndiaMap
            title="State Beneficiary Coverage"
            data={COVERAGE}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
