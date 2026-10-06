"use client";

import * as React from "react";
import { Card, CardBody, CardHeader, CardIcon, CardSubtitle, CardTitle, DescriptionList, DonutChart } from "@mosje/design-system";
import { FUND_SHARE, HOSTELS, SCHOLARSHIPS, type DeptAmount } from "@/lib/website-shared/dashboard";

/**
 * THE BENEFICIARY DASHBOARD'S OWN CARDS, IN ONE PLACE. The live page's card structure —
 * which figures a card holds, in what order, under which labels — rendered once and used by
 * both the current dashboard (`DepartmentOverview`) and the proposed one (`proposed/Education`).
 * Two copies of the same card drift; the proposed dashboard's re-arranged copy did, and read
 * busier than the live card it was copied from (design audit, 6 Oct 2026: "keep the live
 * structure intact").
 *
 * DS Audit: Card / CardHeader / CardIcon / CardTitle / CardSubtitle / CardBody ✅ ·
 * DescriptionList ✅ · DonutChart ✅. Nothing here styles a component.
 */

/** "₹4,896 Cr", as the live page prints it. */
export const deptAmount = ({ value, unit }: DeptAmount) => (unit ? `${value} ${unit}` : value);

type ScholarshipCardData = (typeof SCHOLARSHIPS.cards)[number];
type HostelCardData = (typeof HOSTELS.cards)[number];

/** A Scholarships and Fellowship card: a coloured band, an icon, and its figures on a tinted body. */
export function ScholarshipCard({ c }: { c: ScholarshipCardData }) {
  return (
    <Card tone={c.tone} accent="band" tinted>
      <CardHeader>
        <CardIcon name={c.icon} />
        <div>
          <CardTitle size="sm">{c.title}</CardTitle>
          <CardSubtitle>{c.subtitle}</CardSubtitle>
        </div>
      </CardHeader>
      <CardBody>
        <DescriptionList size="figure" columns={1} divided items={c.metrics.map((m) => ({ term: m.label, value: deptAmount(m) }))} />
      </CardBody>
    </Card>
  );
}

/**
 * A Hostels and Top Class Education card: a coloured top edge, the title with its icon at the
 * right, and its figures under capitalised labels. Top Class Education splits into Schools and
 * Colleges, side by side at every width, each with its fund release under it.
 */
export function HostelCard({ c, tone }: { c: HostelCardData; tone?: HostelCardData["tone"] }) {
  return (
    <Card tone={tone ?? c.tone} accent="edge">
      <CardHeader divided>
        <CardTitle size="sm">{c.title}</CardTitle>
        <CardIcon name={c.icon} />
      </CardHeader>
      <CardBody>
        {c.metrics ? (
          <DescriptionList size="figure" caps columns={1} items={c.metrics.map((m) => ({ term: m.label, value: deptAmount(m), hint: m.sub }))} />
        ) : null}
        {c.splits ? (
          <div className="kd-bd__split">
            {c.splits.map((s) => (
              <div key={s.chip}>
                <DescriptionList size="figure" caps columns={1} items={[{ term: s.chip, termBadge: s.chipTone, value: s.value, hint: s.sub }]} />
                <DescriptionList size="sm" columns={1} items={[{ term: "Fund Released", value: s.fund }]} />
              </div>
            ))}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

/** Share of Fund Release as the live page draws it: a ring, with each scheme's amount beside it. */
export function FundShareDonut({ slices = FUND_SHARE.slices }: { slices?: readonly (typeof FUND_SHARE.slices)[number][] }) {
  return (
    <DonutChart
      title={`${FUND_SHARE.title}, ${FUND_SHARE.subtitle}`}
      data={slices.map((s) => ({ label: s.label, value: s.value }))}
      valueFormat={(v) => `₹${Math.round(v).toLocaleString("en-IN")} Cr`}
      center={false}
      legendValue="value"
      layout="side"
    />
  );
}
