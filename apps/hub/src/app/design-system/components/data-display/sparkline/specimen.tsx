"use client";

import * as React from "react";
import { Sparkline } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const TREND = [10, 15, 8, 22, 18, 30, 27, 34];

export function SparklineSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <div className="cdp__specimen-row">
        <Sparkline data={TREND} label="Applications, last eight months" />
        <Sparkline data={TREND} label="Applications, last eight months" fill />
      </div>
      <ChartStates
        filterLabel="date range"
        render={({ state, onRetry, filterLabel }) => (
          <Sparkline
            data={TREND}
            label="Applications, last eight months"
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
