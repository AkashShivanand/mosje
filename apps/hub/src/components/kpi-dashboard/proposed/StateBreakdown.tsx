"use client";

import * as React from "react";
import { ChartCard, IndiaMap, RankedBarList, SegmentedControl } from "@mosje/design-system";
import type { StateMeasure } from "./model";
import { compact } from "./story";

/**
 * A PROGRAMME'S FIGURES, STATE/UT BY STATE/UT — the map, a switch between the KPIs it can
 * show, and the same figures ranked beside it, as the SMILE – Beggary handoff draws its
 * State-wise Beneficiary Distribution (Figma `evmNmlK8g4VYwJVu2FwSGV` 8664:49263).
 *
 * The map and the list read ONE resolved measure (`data-state-completeness.md` §2), so they
 * can never disagree. Choosing a State/UT on the map sets the page's area — the same choice
 * the State / UT filter makes — so the map is a way into a State's figures, not a second
 * picture of them. Each chart keeps its table for screen readers only (instruction, 6 Oct
 * 2026: no Chart / Table switch for now).
 *
 * DS Audit: ChartCard ✅ · SegmentedControl ✅ · IndiaMap ✅ · RankedBarList ✅.
 */
export function StateBreakdown({
  measures,
  headingLevel,
  onSelectState,
}: {
  measures: StateMeasure[];
  headingLevel: 3 | 4;
  onSelectState: (state: string) => void;
}) {
  const [picked, setPicked] = React.useState(measures[0]?.kpi.id ?? "");
  const m = measures.find((x) => x.kpi.id === picked) ?? measures[0];
  if (!m) return null;
  const fmt = (v: number) => compact(v, "number");
  const ranked = [...m.rows].sort((a, b) => b.value - a.value);
  return (
    <ChartCard
      variant="outlined"
      headingLevel={headingLevel}
      title="State/UT-wise Figures"
      subtitle={m.kpi.name}
      actions={
        measures.length > 1 ? (
          <SegmentedControl ariaLabel="Figure shown" value={m.kpi.id} onChange={setPicked} options={measures.map((x) => ({ value: x.kpi.id, label: x.label }))} />
        ) : undefined
      }
    >
      <div className="pd-states">
        <IndiaMap
          title={`${m.kpi.name}, by State/UT`}
          data={m.rows}
          valueFormat={fmt}
          legendFormat={fmt}
          scale="quantile"
          onSelect={onSelectState}
          tableView="sr-only"
        />
        <RankedBarList
          title={`${m.kpi.name}, States/UTs ranked`}
          items={ranked.map((r) => ({ label: r.state, value: r.value }))}
          max={ranked[0]?.value}
          valueFormat={fmt}
          showRank
          size="md"
          sort="none"
          pageSize={10}
        />
      </div>
    </ChartCard>
  );
}
