"use client";

import * as React from "react";
import { DataTable, InlineBar, RankedBarList } from "@mosje/design-system";

import { ChartStates } from "@/components/design-system/docs-kit";

/* Illustrative figures in real shapes — a state ranking, a compliance rate
   against a target, and a district table whose one column is drawn. */
const PLEDGES = [
  { label: "Maharashtra", value: 2_29_400 },
  { label: "Uttar Pradesh", value: 2_18_100 },
  { label: "Gujarat", value: 1_45_300 },
  { label: "Madhya Pradesh", value: 1_36_800 },
  { label: "Rajasthan", value: 1_02_600 },
  { label: "Haryana", value: 88_700 },
  { label: "Punjab", value: 76_200 },
  { label: "Bihar", value: 64_900, withheld: undefined },
  { label: "Odisha", value: 0, withheld: { kind: "not-reported" as const } },
  { label: "Kerala", value: 41_300 },
  { label: "Assam", value: 38_100 },
  { label: "Delhi", value: 33_500 },
];

const SLA = [
  { label: "Lucknow", value: 88 },
  { label: "Kanpur", value: 94 },
  { label: "Varanasi", value: 79 },
  { label: "Agra", value: 83 },
  { label: "Meerut", value: 71 },
  { label: "Prayagraj", value: 76 },
];

interface DistrictRow extends Record<string, unknown> {
  district: string;
  utilised: number;
  sanctioned: number;
}
const DISTRICTS: DistrictRow[] = [
  { district: "Lucknow", utilised: 9_20_000, sanctioned: 30_00_000 },
  { district: "Varanasi", utilised: 7_80_000, sanctioned: 28_00_000 },
  { district: "Kanpur", utilised: 6_40_000, sanctioned: 25_00_000 },
  { district: "Agra", utilised: 5_10_000, sanctioned: 22_00_000 },
];
const lakh = (n: number) => `₹${(n / 1_00_000).toFixed(1)}L`;

export function RankedBarListSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <div className="cdp__specimen-row">
        <div style={{ flex: "1 1 320px" }}>
          <RankedBarList title="Top states by pledges" items={PLEDGES} pageSize={6} />
        </div>
        <div style={{ flex: "1 1 320px" }}>
          <RankedBarList
            title="SLA compliance by district"
            items={SLA}
            max={100}
            showRank={false}
            valueFormat={(n) => `${n}%`}
            toneFor={(item) => (item.value >= 90 ? "success" : item.value >= 80 ? "warning" : "danger")}
            caption="Target 90%. Green meets it, amber is within ten points, red is further."
          />
        </div>
      </div>
      <DataTable<DistrictRow>
        caption="District-wise fund utilisation, FY 2025–26"
        data={DISTRICTS}
        total={DISTRICTS.length}
        columns={[
          { key: "district", header: "District" },
          {
            key: "utilised",
            header: "Utilisation",
            render: (r) => (
              <span style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-8)" }}>
                <InlineBar value={r.utilised} max={r.sanctioned} />
                <span style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  {lakh(r.utilised)} of {lakh(r.sanctioned)}
                </span>
              </span>
            ),
          },
        ]}
      />
      <ChartStates
        filterLabel="state filter"
        render={({ state, onRetry, filterLabel }) => (
          <RankedBarList
            title="Top states by pledges"
            items={PLEDGES.slice(0, 5)}
            state={state}
            onRetry={onRetry}
            filterLabel={filterLabel}
          />
        )}
      />
    </div>
  );
}
