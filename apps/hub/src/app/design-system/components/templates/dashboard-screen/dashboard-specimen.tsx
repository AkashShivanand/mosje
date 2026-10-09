"use client";

import Link from "next/link";
import * as React from "react";
import {
  DashboardCard,
  DashboardCardList,
  DashboardScreen,
  FilterSelect,
  HeadlineBand,
  HeadlineFigure,
  OrgLogo,
  compactCount,
  shownDate,
} from "@mosje/design-system";
import { FUND_SHARE } from "@/lib/website-shared/dashboard";
import { NMBA_STATES_SNAPSHOT } from "@/lib/kpi/feeds/nmba-states-snapshot";

/*
 * The nineteenth template's specimen, beside its page rather than in `../specimens.tsx`.
 *
 * WHY NOT THE SHARED FILE. The other eighteen share one demo register — Harijan Sevak Sangh's
 * grant-in-aid applications — and one client module. A dashboard is not a register of
 * applications: it draws the website's Beneficiary Dashboard records, and
 * `lib/website-shared/dashboard.ts` brings the KPI register (about 60 KB of source) with it.
 * In the shared module that weight would reach every template page; here only this one pays.
 *
 * The figures are NMBA's Total Outreach by State/UT (the snapshot, 7 Oct 2026) and the
 * Department's fund release as received (5 Oct 2026), read from those records, never re-typed.
 */
const ALL_INDIA = "All India";
const DEPT_FUND = `₹${Math.round(FUND_SHARE.slices.reduce((t, s) => t + s.value, 0)).toLocaleString("en-IN")} Cr`;

export function DashboardSpecimen(): React.JSX.Element {
  const [area, setArea] = React.useState(ALL_INDIA);
  const stateRow = NMBA_STATES_SNAPSHOT.rows.find((r) => r.area === area);
  const outreach = stateRow ? stateRow.value : NMBA_STATES_SNAPSHOT.national;
  const asOn = shownDate(NMBA_STATES_SNAPSHOT.asOn);
  return (
    <DashboardScreen
      back={{ href: "/website/dashboard", label: "All Dashboards" }}
      linkAs={Link}
      area={area}
      filters={
        <FilterSelect
          label="State / UT"
          value={area}
          onChange={(v) => setArea(v || ALL_INDIA)}
          options={[{ value: ALL_INDIA, label: ALL_INDIA }, ...NMBA_STATES_SNAPSHOT.rows.map((r) => ({ value: r.area, label: r.area }))]}
        />
      }
      areaNote={
        stateRow
          ? `Figures for ${area} are published for Nasha Mukt Bharat Abhiyaan. Other sections show All-India figures.`
          : undefined
      }
      viewKey={area}
      /* A filter keeps the reader's focus on the filter, so they can choose again. */
      shouldMoveFocus={() => false}
      count={1}
    >
      <HeadlineBand
        /* 2, not 1: the documentation page already owns the page's h1. */
        headingLevel={2}
        title={`At a Glance, ${area}`}
        lead={{
          value: compactCount(outreach),
          label: stateRow ? `Total Outreach, ${area}` : "Total Outreach",
          context: `Persons reached by awareness activities under Nasha Mukt Bharat Abhiyaan, since launch. As on ${asOn}`,
        }}
      />
      <DashboardCardList
        aria-label="Department and Portal Dashboards"
        items={[
          {
            key: "department",
            content: (
              <DashboardCard
                tone="primary"
                mark={<OrgLogo path={null} size="md" name="" />}
                title="Department of Social Justice and Empowerment"
                subtitle="Beneficiary Dashboard"
                note={stateRow ? "Publishes All-India figures only." : undefined}
                href="/website/dashboard?programme=department"
                linkAs={Link}
                linkLabel="View the Department's Beneficiary Dashboard"
                figure={<HeadlineFigure size="md" value={DEPT_FUND} label={FUND_SHARE.subtitle} />}
              />
            ),
          },
          {
            key: "nmba",
            content: (
              <DashboardCard
                tone="success"
                mark={<OrgLogo path="/portals/nmba" size="md" />}
                title="NMBA"
                subtitle="Nasha Mukt Bharat Abhiyaan"
                href="/website/dashboard?programme=nmba"
                linkAs={Link}
                linkLabel="View the NMBA Dashboard"
                figure={<HeadlineFigure size="md" value={compactCount(outreach)} label="Total Outreach" context={`As on ${asOn}`} />}
              />
            ),
          },
        ]}
      />
    </DashboardScreen>
  );
}
