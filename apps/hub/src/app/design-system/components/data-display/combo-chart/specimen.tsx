"use client";

import * as React from "react";
import { ComboChart } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const LABELS = ["Q1", "Q2", "Q3", "Q4"];
const BARS = [{ name: "Target", data: [100, 150, 200, 250] }];
const LINES = [{ name: "Utilisation", data: [95, 94, 99, 96] }];

export function ComboChartSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <ComboChart
        title="Quarterly Target Against Utilisation"
        labels={LABELS}
        bars={BARS}
        lines={LINES}
        leftLabel="₹ crore released"
        rightLabel="Per cent utilised"
      />
      <ChartStates
        filterLabel="quarter filter"
        render={({ state, onRetry, filterLabel }) => (
          <ComboChart
            title="Quarterly Target Against Utilisation"
            labels={LABELS}
            bars={BARS}
            lines={LINES}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
