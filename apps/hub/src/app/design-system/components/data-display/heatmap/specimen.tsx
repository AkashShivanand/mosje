"use client";

import * as React from "react";
import { Heatmap } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

const X = ["Jan", "Feb", "Mar", "Apr"];
const Y = ["Uttar Pradesh", "Maharashtra", "Bihar"];
const MATRIX = [
  [10, 24, 31, 28],
  [40, 38, 52, 61],
  [12, 9, 18, 22],
];

export function HeatmapSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <Heatmap title="Inspections by State and Month" xLabels={X} yLabels={Y} matrix={MATRIX} />
      <ChartStates
        filterLabel="month range"
        render={({ state, onRetry, filterLabel }) => (
          <Heatmap
            title="Inspections by State and Month"
            xLabels={X}
            yLabels={Y}
            matrix={MATRIX}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
