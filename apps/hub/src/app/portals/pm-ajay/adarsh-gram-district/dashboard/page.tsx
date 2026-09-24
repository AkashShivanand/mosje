"use client";

/* Adarsh Gram — District: Dashboard.
   Rebuilt from the live screen at pm-ajay.dosje.gov.in/adarsh-gram-district/dashboard.

   DS Audit: OverviewScreen ✅ · MetricCard ✅ (through OverviewScreen's kpis) ·
   ChartCard ✅ · Progress ✅ · Select ✅ · Checkbox ✅ · Icon ✅. Nothing added.

   Two deliberate divergences from the live screen, both recorded in
   docs/specs/pm-ajay-portal-rebuild.md:
   1. The live screen prints a sentence under each card telling the reader that the
      numbers are clickable and which district is shown. The numbers here ARE links,
      and the district is in the page header, so the narration is gone —
      `.claude/rules/ui-restraint-and-copy.md` §1.
   2. Figures carry a provenance chip, because they are illustrative. */

import * as React from "react";
import Link from "next/link";
import {
  Checkbox,
  ChartCard,
  FormField,
  OverviewScreen,
  Progress,
  Select,
  type DataProvenance,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  DASHBOARD,
  DISTRICT_SCOPE,
  INDICATOR_DOMAINS,
  INDICATOR_STATUS,
  PROVENANCE_LINE,
  count,
  lakh,
} from "@/lib/pm-ajay/district/registers";

/* One line, on the panels only. It read eight times on this page when every KPI card
   carried it as well, and `ui-restraint-and-copy.md` allows the mark, not the paragraph:
   the sentence itself is in the page's meta, once. */
const PROVENANCE: DataProvenance = {
  source: "Illustrative district register",
  asOf: DISTRICT_SCOPE.asOf,
  status: "provisional",
};

const ALL = "All Indicators";

export default function DistrictDashboardPage() {
  const [indicator, setIndicator] = React.useState<string>(ALL);
  const [gapFillingOnly, setGapFillingOnly] = React.useState(false);

  /* One resolution, read by every tile and every bar below it. A dashboard whose
     key and whose bars answer the same question separately is the defect
     `data-state-completeness.md` §2 records. */
  const rows = React.useMemo(
    () => (indicator === ALL ? INDICATOR_STATUS : INDICATOR_STATUS.filter((r) => r.domain === indicator)),
    [indicator],
  );
  const scoped = React.useMemo(() => {
    const factor = gapFillingOnly ? 0.42 : 1;
    const sum = (key: "identified" | "completed" | "inProgress" | "pending" | "estimatedCost") =>
      rows.reduce((n, r) => n + r[key], 0) * factor;
    return {
      identified: Math.round(sum("identified")),
      completed: Math.round(sum("completed")),
      inProgress: Math.round(sum("inProgress")),
      pending: Math.round(sum("pending")),
      estimatedCost: sum("estimatedCost"),
    };
  }, [rows, gapFillingOnly]);

  const eligible = DASHBOARD.eligibleVillages;
  const share = (n: number) => (eligible === 0 ? "0%" : `${Math.round((n / eligible) * 1000) / 10}% of eligible`);

  return (
    <OverviewScreen
      eyebrow="Adarsh Gram — District"
      title="Dashboard"
      meta={`${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} · FY ${DISTRICT_SCOPE.financialYear} · eligibility, village plans, works and the fund cascade. ${PROVENANCE_LINE}`}
      kpis={[
        {
          label: "Eligible Villages",
          value: count(DASHBOARD.eligibleVillages),
          detail: "SC-majority villages that meet the scheme's eligibility",
          href: `${DISTRICT_BASE}/format-1`,
          linkAs: Link,
        },
        {
          label: "VDP Drafted",
          value: count(DASHBOARD.vdpDrafted),
          detail: share(DASHBOARD.vdpDrafted),
          href: `${DISTRICT_BASE}/manage-vdp/generate-complete-vdp`,
          linkAs: Link,
        },
        {
          label: "DLCC-approved VDP",
          value: count(DASHBOARD.dlccApproved),
          detail: share(DASHBOARD.dlccApproved),
          href: `${DISTRICT_BASE}/manage-vdp/generate-complete-vdp`,
          linkAs: Link,
        },
        {
          label: "Declared Adarsh Gram",
          value: count(DASHBOARD.declared),
          detail: share(DASHBOARD.declared),
          href: `${DISTRICT_BASE}/manage-adarsh-gram/declare`,
          linkAs: Link,
          status: { label: "Declared", tone: "success" },
        },
      ]}
      panels={[
        <ChartCard
          key="journey"
          title="Adarsh Gram Progress"
          subtitle="Eligibility → VDP → DLCC approval → declaration"
          provenance={PROVENANCE}
        >
          <Progress label={`Eligible Villages — ${count(eligible)}`} value={eligible} max={eligible} showValue />
          <Progress label={`VDP Drafted — ${count(DASHBOARD.vdpDrafted)}`} value={DASHBOARD.vdpDrafted} max={eligible} showValue />
          <Progress label={`DLCC-approved VDP — ${count(DASHBOARD.dlccApproved)}`} value={DASHBOARD.dlccApproved} max={eligible} showValue />
          <Progress label={`Declared Adarsh Gram — ${count(DASHBOARD.declared)}`} value={DASHBOARD.declared} max={eligible} showValue tone="success" />
        </ChartCard>,

        <ChartCard
          key="pendency"
          title="Pendency Status"
          subtitle="Where villages are held up, and what each one needs next"
          provenance={PROVENANCE}
        >
          <Progress
            label={`VDP Not Generated — ${count(DASHBOARD.vdpNotGenerated)}`}
            value={DASHBOARD.vdpNotGenerated}
            max={eligible}
            tone="danger"
            showValue
          />
          <Progress
            label={`DLCC Approval Pending — ${count(DASHBOARD.dlccPending)}`}
            value={DASHBOARD.dlccPending}
            max={eligible}
            tone="warning"
            showValue
          />
          <Progress
            label={`Eligible, Not Declared — ${count(DASHBOARD.eligibleNotDeclared)}`}
            value={DASHBOARD.eligibleNotDeclared}
            max={eligible}
            tone="info"
            showValue
          />
        </ChartCard>,

        <ChartCard
          key="indicators"
          title="Monitorable Indicator Progress"
          subtitle={indicator === ALL ? "Across all ten indicator domains" : indicator}
          provenance={PROVENANCE}
          actions={
            <div className="pm-district-toolbar">
              <FormField label="Monitorable Indicator" id="indicator-filter" labelHidden>
                {(control) => (
                  <Select
                    {...control}
                    appearance="filter"
                    value={indicator}
                    onChange={(event) => setIndicator(event.target.value)}
                  >
                    <option value={ALL}>{ALL}</option>
                    {INDICATOR_DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
              <Checkbox
                label="Gap-filling funded only"
                checked={gapFillingOnly}
                onChange={(event) => setGapFillingOnly(event.target.checked)}
              />
            </div>
          }
        >
          <Progress label={`Projects Identified — ${count(scoped.identified)}`} value={scoped.identified} max={scoped.identified || 1} showValue />
          <Progress label={`Completed — ${count(scoped.completed)}`} value={scoped.completed} max={scoped.identified || 1} tone="success" showValue />
          <Progress label={`In Progress — ${count(scoped.inProgress)}`} value={scoped.inProgress} max={scoped.identified || 1} tone="info" showValue />
          <Progress label={`Pending — ${count(scoped.pending)}`} value={scoped.pending} max={scoped.identified || 1} tone="warning" showValue />
        </ChartCard>,

        <ChartCard
          key="funds"
          title="Financial Progress"
          subtitle="Sanction → release → utilisation, in ₹ lakh"
          provenance={PROVENANCE}
        >
          <Progress
            label={`Sanctioned — ${lakh(DASHBOARD.fundsSanctioned)}`}
            value={DASHBOARD.fundsSanctioned}
            max={DASHBOARD.fundsSanctioned || 1}
            showValue
          />
          <Progress
            label={`Released — ${lakh(DASHBOARD.fundsReleased)}`}
            value={DASHBOARD.fundsReleased}
            max={DASHBOARD.fundsSanctioned || 1}
            showValue
          />
          <Progress
            label={`Utilised — ${lakh(DASHBOARD.fundsUtilised)}`}
            value={DASHBOARD.fundsUtilised}
            max={DASHBOARD.fundsSanctioned || 1}
            tone="success"
            showValue
          />
        </ChartCard>,
      ]}
    />
  );
}
