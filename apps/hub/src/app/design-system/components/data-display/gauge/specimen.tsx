"use client";

import * as React from "react";
import { Gauge } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

export function GaugeSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <div className="cdp__specimen-row">
        <Gauge title="Grievances Resolved Within SLA" value={84} unit="%" />
        <Gauge title="Hostels Occupied" value={1240} max={1800} unit=" of 1,800" />
      </div>
      <ChartStates
        filterLabel="state filter"
        render={({ state, onRetry, filterLabel }) => (
          <Gauge
            title="Grievances Resolved Within SLA"
            value={84}
            unit="%"
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
