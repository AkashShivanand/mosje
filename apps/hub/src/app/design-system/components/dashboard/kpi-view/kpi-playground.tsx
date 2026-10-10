"use client";

import * as React from "react";
import {
  Badge,
  DashboardGrid,
  KpiRow,
  KpiView,
  SegmentedControl,
  formatKpi,
  isKpiTile,
  type KpiReading,
  type KpiSpec,
  type KpiViewState,
} from "@mosje/design-system";
import {
  BENEFICIARY_TRENDS,
  DEPARTMENT_DASHBOARD_AS_ON,
  DEPARTMENT_DASHBOARD_SOURCE,
  FUND_SHARE,
} from "@/lib/website-shared/dashboard";
import { NMBA_STATES_SNAPSHOT } from "@/lib/kpi/feeds/nmba-states-snapshot";

/*
 * Four readings of four shapes, every one a published figure: the Department's Beneficiary
 * Dashboard as received (read 5 Oct 2026, `lib/website-shared/dashboard.ts`) and NMBA's
 * State/UT snapshot (7 Oct 2026, `lib/kpi/feeds/nmba-states-snapshot.ts`). The specs are
 * written here; the values are read from those records and never re-typed.
 */
const received = (value: KpiReading["value"]): KpiReading => ({
  value,
  origin: "received",
  source: DEPARTMENT_DASHBOARD_SOURCE,
  asOn: DEPARTMENT_DASHBOARD_AS_ON,
});

const shreyasView = BENEFICIARY_TRENDS.views[2];
const shreyasScholars = shreyasView.series[0].data;

interface Entry {
  kpi: KpiSpec;
  reading: KpiReading;
}

const ENTRIES: Entry[] = [
  {
    kpi: { id: "dept.shreyas-latest", name: "SHREYAS Scholars Funded, 2025-26", unit: "number" },
    reading: received({ kind: "figure", value: shreyasScholars[shreyasScholars.length - 1] ?? 0 }),
  },
  {
    kpi: { id: "dept.fund-share", name: FUND_SHARE.title, unit: "crore", definition: FUND_SHARE.subtitle, span: 6, totalled: true },
    reading: received({ kind: "breakdown", chart: "donut", items: FUND_SHARE.slices.map((s) => ({ label: s.label, value: s.value })) }),
  },
  {
    kpi: { id: "dept.shreyas-trend", name: "SHREYAS Scholars Funded, Year by Year", unit: "number", definition: "National Fellowship for OBC Students", span: 6 },
    reading: received({
      kind: "series",
      chart: "line",
      labels: [...shreyasView.labels],
      series: [{ name: shreyasView.series[0].name, data: [...shreyasScholars] }],
    }),
  },
  {
    kpi: { id: "nmba.outreach-by-state", name: "Total Outreach by State/UT", unit: "number", definition: "Persons reached by awareness activities, since launch", span: 12 },
    reading: {
      value: { kind: "areas", total: NMBA_STATES_SNAPSHOT.national, rows: NMBA_STATES_SNAPSHOT.rows.map((r) => ({ area: r.area, value: r.value })) },
      origin: "snapshot",
      source: NMBA_STATES_SNAPSHOT.source,
      asOn: NMBA_STATES_SNAPSHOT.asOn,
    },
  },
];

type Chrome = "quiet" | "analyst";
type Shown = "ready" | "loading" | "error";

/** The same four readings, in either chrome and any card state. Tiles go to a KPI Row; the rest to KPI View. */
export function KpiPlayground(): React.JSX.Element {
  const [chrome, setChrome] = React.useState<Chrome>("quiet");
  const [shown, setShown] = React.useState<Shown>("ready");
  const card: KpiViewState = shown === "loading" ? { loading: true } : shown === "error" ? { state: "error", onRetry: () => setShown("ready") } : {};
  const tiles = ENTRIES.filter((e) => isKpiTile(e.reading));
  const charts = ENTRIES.filter((e) => !isKpiTile(e.reading));
  return (
    <div className="cdp-stack">
      <div className="cdp-row">
        <span className="cdp-states__label">Chrome</span>
        <SegmentedControl
          ariaLabel="Chrome"
          value={chrome}
          onChange={(v) => setChrome(v as Chrome)}
          options={[
            { value: "quiet", label: "Public (quiet)" },
            { value: "analyst", label: "Analyst" },
          ]}
        />
        <span className="cdp-states__label">Card State</span>
        <SegmentedControl
          ariaLabel="Card State"
          value={shown}
          onChange={(v) => setShown(v as Shown)}
          options={[
            { value: "ready", label: "Ready" },
            { value: "loading", label: "Loading" },
            { value: "error", label: "Error" },
          ]}
        />
      </div>
      <DashboardGrid>
        <KpiRow
          span={12}
          items={tiles.map((e) => ({
            label: e.kpi.name,
            value: e.reading.value.kind === "figure" ? formatKpi(e.reading.value.value, e.kpi.unit) : "",
          }))}
        />
        {charts.map((e) => (
          <KpiView
            key={e.kpi.id}
            kpi={e.kpi}
            reading={e.reading}
            card={card}
            areasAreStates
            quiet={chrome === "quiet"}
            donutLayout="auto"
            // The website's Received mark, as its OriginChip draws it — a Badge, `info`, with a dot.
            renderOrigin={(origin) => (origin === "received" ? <Badge status="info" size="sm" dot>Received</Badge> : null)}
          />
        ))}
      </DashboardGrid>
    </div>
  );
}
