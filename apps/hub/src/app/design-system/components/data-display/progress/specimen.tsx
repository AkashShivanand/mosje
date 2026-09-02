"use client";

import * as React from "react";
import { Progress } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

export function ProgressSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <Progress value={65} label="Application Form Progress" />
      <Progress value={1240} max={1800} label="Hostel Places Occupied" />
      <Progress label="Places Occupied — figure not yet published" />
      <ChartStates
        filterLabel="state filter"
        render={({ state, onRetry, filterLabel }) => (
          <Progress
            value={65}
            label="Application Form Progress"
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
