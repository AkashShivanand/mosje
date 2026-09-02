"use client";

import * as React from "react";
import { MetricCard } from "@mosje/design-system";

export function MetricCardSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <div className="cdp__specimen-row">
        <MetricCard
          label="Total Scholarships Awarded"
          value="14,25,890"
          changeValue="12.4%"
          changeDirection="up"
          changeLabel="vs last year"
        />
        <MetricCard
          label="Applications Returned for Correction"
          value="3,214"
          changeValue="4.1%"
          changeDirection="down"
          changeLabel="vs last year"
        />
        <MetricCard label="Hostels Sanctioned" value="1,802" size="sm" />
      </div>
      <div className="cdp__specimen-row">
        <MetricCard label="Total Scholarships Awarded" loading />
        <MetricCard label="Places Occupied" state="not-published" />
        <MetricCard label="Grievances Closed" state="error" />
        <MetricCard label="Districts Covered" state="no-results" />
      </div>
    </div>
  );
}
