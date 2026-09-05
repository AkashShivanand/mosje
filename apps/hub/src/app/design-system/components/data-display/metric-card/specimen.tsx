"use client";

import * as React from "react";
import { MetricCard, Sparkline } from "@mosje/design-system";

const ALLOCATION_TREND = [7_800, 8_100, 8_400, 8_650, 8_900, 9_050, 9_250];

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
      {/* The three readings the portal dashboards draw most: a figure against
          its target, a figure with its status, and a figure with its trend. */}
      <div className="cdp__specimen-row">
        <MetricCard
          label="Utilisation of Release"
          value="79.0%"
          changeValue="1.6 pts"
          changeDirection="down"
          changeLabel="utilised ÷ released"
          progress={{ value: 79, max: 100, target: 85, targetLabel: "Target 85%" }}
        />
        <MetricCard
          label="Hotspots Covered"
          value="10.2%"
          detail="90 of 883 surveyed"
          status={{ label: "≥ 100%", tone: "danger" }}
          progress={{ value: 90, max: 883, target: 883 }}
        />
        <MetricCard
          label="Total Allocation"
          value="₹9,250 Cr"
          changeValue="4.2%"
          changeDirection="up"
          changeLabel="FY budget"
          aside={<Sparkline data={ALLOCATION_TREND} width={72} height={24} />}
        />
      </div>
      {/* A tone is a claim: the queue's "due soon" and "overdue" tiles. */}
      <div className="cdp__specimen-row">
        <MetricCard
          label="Due Soon"
          value="24"
          tone="warning"
          changeValue="5.4%"
          changeDirection="up"
          changeLabel="vs last month"
        />
        <MetricCard
          label="Overdue Applications"
          value="54"
          tone="danger"
          changeValue="14.5%"
          changeDirection="up"
          changeLabel="vs last month"
        />
        <MetricCard
          label="Resolved Cases"
          value="31,200"
          detail="75% resolution rate"
          provenance={{ source: "NHAPOA MIS", asOf: "2026-08-31", status: "provisional" }}
        />
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
