"use client";

/**
 * AVYAY's cost-norms entitlement panel — the live "What the AVYAY cost norms allow for this
 * project" block above the grant fields, with its collapsible 18-head table.
 *
 * DS Audit: Card ✅ existing · Heading / Text ✅ · DescriptionList ✅ · DataTable ✅ · Alert ✅ · Badge ✅ ·
 * Button ✅ · Icon ✅ — nothing new needed.
 *
 * The arithmetic follows the rule the live footnote states: central share is 100% for a
 * State Govt / ULB / PRI / RRTC agency, 95% in NE & Himalayan States and 90% elsewhere; an
 * owned building deducts 10% of the notional rent from the recurring norm.
 */

import * as React from "react";
import { Alert, Badge, Button, Card, CardBody, DataTable, DescriptionList, Heading, Icon, Text } from "@mosje/design-system";
import { avyayCostHeads } from "@/lib/e-anudaan/form-schema";
import { NE_HIMALAYAN_STATES } from "@/lib/e-anudaan/geography";
import { rupees } from "@/lib/e-anudaan/format";

const FULL_SHARE_AGENCIES = [
  "State Government",
  "Urban Local Body (ULB)",
  "Panchayati Raj Institution (PRI)",
  "Regional Resource & Training Centre (RRTC)",
];


export function centralSharePercent(agencyType?: string, projectState?: string): number {
  if (agencyType && FULL_SHARE_AGENCIES.includes(agencyType)) return 100;
  if (projectState && NE_HIMALAYAN_STATES.includes(projectState)) return 95;
  return 90;
}

export function CostNormsPanel({
  natureOfProject,
  agencyType,
  projectState,
  cityCategory,
  buildingOwnership,
  recurringSought,
  nonRecurringSought,
}: {
  natureOfProject?: string;
  agencyType?: string;
  projectState?: string;
  cityCategory?: string;
  buildingOwnership?: string;
  recurringSought?: string;
  nonRecurringSought?: string;
}) {
  const [open, setOpen] = React.useState(false);

  // Live recomputes every head from the project type, so a 25-beneficiary home draws different
  // figures from a 50. Resolve the table before any of the arithmetic below reads it.
  const heads = avyayCostHeads(natureOfProject);

  const share = centralSharePercent(agencyType, projectState);
  const tier = (cityCategory ?? "").charAt(0) || "Z";

  // The 18 heads already carry the OWNED figure (10% of rent), so their sum IS the allowed
  // recurring. The live panel presents it the other way round — full rent as the norm, less the
  // 90% an owned building does not draw — so derive that presentation back out of the heads.
  const ownedLine = heads.find((h) => h.head.startsWith("Owned Building"))?.norm ?? 0;
  const fullRent = ownedLine * 10;
  const ownedDeduction = buildingOwnership === "Owned" ? fullRent - ownedLine : 0;

  const recurringAllowed = heads.filter((h) => !h.nonRecurring).reduce((a, h) => a + h.norm, 0);
  const recurringNorm = recurringAllowed + ownedDeduction;
  const nonRecurringNorm = heads.filter((h) => h.nonRecurring).reduce((a, h) => a + h.norm, 0);
  const attendanceLinked = heads.filter((h) => h.attendanceLinked).reduce((a, h) => a + h.norm, 0);

  // Live's right-hand column is the CENTRAL SHARE, not the norm — its Total is the two shares
  // added, not the two norms. Verified 2026-08-23 against a 25-beneficiary NGO home in a Z city:
  // recurring 22,60,156 -> 20,34,140, non-recurring 3,09,105 -> 2,78,195, total 23,12,335.
  const recurringCentral = Math.round((recurringAllowed * share) / 100);
  const nonRecurringCentral = Math.round((nonRecurringNorm * share) / 100);
  const totalAllowed = recurringCentral + nonRecurringCentral;

  const overNorm =
    Number(recurringSought || 0) > recurringAllowed || Number(nonRecurringSought || 0) > nonRecurringNorm;

  type HeadRow = { id: string; head: string; norm: number; central: number };
  const headRows: HeadRow[] = heads.map((h) => ({ id: h.head, head: h.head, norm: h.norm, central: (h.norm * share) / 100 }));

  return (
    <Card variant="outlined">
      <CardBody className="space-y-3">
        {/* A panel INSIDE the "Grant Sought" section, so its heading sits a step below that
            section's SectionTitle — SectionTitle has one size, and at it this heading outranked
            the section it belongs to. */}
        <div>
          <Heading level={3} variant="title-3">
            What the AVYAY cost norms allow for this project
          </Heading>
          <Text as="p" variant="body-3" tone="subtle" className="mt-0.5">
            Based on the project type, district, agency type and building ownership you have entered.
            {natureOfProject ? ` (${natureOfProject})` : ""}
          </Text>
        </div>

        <DescriptionList
          columns={1}
          layout="inline"
          size="sm"
          divided
          items={[
            {
              term: "Recurring",
              hint: ownedDeduction > 0 ? `Norm ${rupees(recurringNorm)}, less ${rupees(ownedDeduction)} because the building is owned` : undefined,
              value: <span className="font-mono font-semibold">{rupees(recurringCentral)}</span>,
            },
            {
              term: "Non-recurring",
              hint: `Norm ${rupees(nonRecurringNorm)}`,
              value: <span className="font-mono font-semibold">{rupees(nonRecurringCentral)}</span>,
            },
            { term: "Total", value: <span className="font-mono font-bold">{rupees(totalAllowed)}</span> },
          ]}
        />

        <div>
          <Button appearance="text" size="sm" onClick={() => setOpen(!open)} aria-expanded={open}>
            <Icon name={open ? "expand_less" : "expand_more"} size={16} aria-hidden />
            {open ? "Hide the 18 heads behind these figures" : `Show the ${heads.length} heads behind these figures`}
          </Button>
        </div>

        {open && (
          <DataTable<HeadRow>
            caption="AVYAY cost norms, head by head"
            columns={[
              { key: "head", header: "Head" },
              { key: "norm", header: "Norm", className: "text-right font-mono", render: (h) => rupees(h.norm) },
              { key: "central", header: "Central share", className: "text-right font-mono", render: (h) => rupees(h.central) },
            ]}
            data={headRows}
            total={headRows.length}
            pageSizes={[Math.max(headRows.length, 1)]}
            showPageSizes={false}
          />
        )}

        <p className="text-body-3 text-ink-muted">
          Central share {share}% · city category {tier} · norms of 2021-22. {rupees(attendanceLinked)} of the
          recurring norm is linked to the residents actually served, and is reduced if the home runs below its
          sanctioned strength. Indicative. The amount sanctioned is decided by the Ministry from these same
          norms after scrutiny.
        </p>

        {overNorm && (
          <Alert status="warning">
            You have asked for more than the norms allow. You may still submit — the officer will see your
            figure beside the norm — but the grant cannot exceed the norm.
          </Alert>
        )}

        <div>
          <Badge status="info">Indicative entitlement</Badge>
        </div>
      </CardBody>
    </Card>
  );
}
