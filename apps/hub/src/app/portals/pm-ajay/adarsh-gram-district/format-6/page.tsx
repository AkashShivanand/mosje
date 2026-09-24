"use client";

/* Adarsh Gram — District: Format-VI — Status of Monitorable Indicators.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-6.

   DS Audit: WorklistScreen ✅ (owns all seven states, and its `summary` slot for the
   village's score) · MetricCard ✅ · Badge ✅ · Select ✅ · FormField ✅ · Icon ✅.
   Nothing added.

   Chose WorklistScreen over OverviewScreen: the live screen's job, once a village is
   chosen, is the ten monitorable-indicator domains AS A REGISTER — one row per
   domain, each with its own achievement status and remark — with the village's
   total score as a single figure above it. That is a list the officer reads row by
   row, not a set of KPI panels to compare, so the ten domains are the table and the
   score is the `summary` MetricCard WorklistScreen already has a slot for.

   The live screen disables Gram Panchayat and Village until their upstream is
   chosen, and shows the sentence "Select Block, Gram Panchayat and Village to view
   indicator scores." before any village is picked — reproduced here verbatim as the
   `idle` state's description, per `.claude/rules/data-state-completeness.md`. */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  FormField,
  Icon,
  MetricCard,
  Select,
  WorklistScreen,
  screenCopy,
  type BadgeStatus,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import { useVillageCascade } from "@/lib/pm-ajay/district/village-cascade";
import {
  scoreBand,
  scoreTone,
  scorecardFor,
  statusTone,
  type IndicatorScoreRow,
} from "@/lib/pm-ajay/district/indicator-scorecard";
import { BLOCKS, DISTRICT_SCOPE, PROVENANCE_LINE } from "@/lib/pm-ajay/district/registers";

const COLUMNS: WorklistColumn<IndicatorScoreRow>[] = [
  { key: "domain", header: "Indicator Domain", priority: 1 },
  {
    key: "status",
    header: "Status",
    priority: 1,
    render: (row) => <Badge status={statusTone(row.status) as BadgeStatus}>{row.status}</Badge>,
  },
  { key: "points", header: "Score", priority: 2, render: (row) => `${row.points} / 10` },
  { key: "remarks", header: "Remarks", priority: 3 },
];

export default function Format6Page() {
  const cascade = useVillageCascade();

  const rows = React.useMemo(
    () => (cascade.selected ? (scorecardFor(cascade.selected) ?? []) : []),
    [cascade.selected],
  );
  /* One read of the village's score, shared by the summary tile and (through
     `rows`) the register below it — the "one request, one answer" rule. */
  const villageScore = cascade.selected?.score ?? null;

  return (
    <WorklistScreen
      eyebrow="Adarsh Gram — District"
      title="Format-VI: Status of Monitorable Indicators"
      meta={`${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} · the ten monitorable-indicator domains for a chosen village. ${PROVENANCE_LINE}`}
      actions={
        <Button
          href={`${DISTRICT_BASE}/dashboard`}
          linkAs={Link}
          variant="neutral"
          appearance="outlined"
          iconLeft={<Icon name="arrow_back" size={20} />}
        >
          Back to Dashboard
        </Button>
      }
      filters={
        <>
          <FormField label="Block" id="f6-block" required>
            {(control) => (
              <Select {...control} value={cascade.block} onChange={(e) => cascade.setBlock(e.target.value)} placeholder="Select Block">
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Gram Panchayat" id="f6-gp" required>
            {(control) => (
              <Select
                {...control}
                value={cascade.gramPanchayat}
                onChange={(e) => cascade.setGramPanchayat(e.target.value)}
                placeholder="Select Gram Panchayat"
                disabled={!cascade.block}
              >
                {cascade.gramPanchayatOptions.map((gp) => (
                  <option key={gp} value={gp}>
                    {gp}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Village" id="f6-village" required>
            {(control) => (
              <Select
                {...control}
                value={cascade.village}
                onChange={(e) => cascade.setVillage(e.target.value)}
                placeholder="Select Village"
                disabled={!cascade.gramPanchayat}
              >
                {cascade.villageOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </>
      }
      asked={cascade.complete}
      summary={
        villageScore != null ? (
          <MetricCard
            label="Village Score"
            value={String(villageScore)}
            detail="out of 100"
            progress={{ value: villageScore, max: 100 }}
            tone={scoreTone(villageScore)}
            status={{ label: scoreBand(villageScore), tone: scoreTone(villageScore) }}
            provenance={{ source: "Illustrative district register", asOf: DISTRICT_SCOPE.asOf, status: "provisional", note: PROVENANCE_LINE }}
          />
        ) : undefined
      }
      columns={COLUMNS}
      rows={rows}
      getRowId={(row) => row.domain}
      noun="domain"
      pluralNoun="domains"
      copy={screenCopy({
        idleTitle: "Select a Village",
        idleDescription: "Select Block, Gram Panchayat and Village to view indicator scores.",
        emptyTitle: "Format VI Has Not Been Generated for This Village",
        emptyDescription: cascade.selected
          ? `${cascade.selected.village} has no monitorable-indicator score yet. Generate the village score from "Generate Village Score (Format-VI)" before its indicator status can be shown here.`
          : "This village has no monitorable-indicator score yet.",
      })}
    />
  );
}
