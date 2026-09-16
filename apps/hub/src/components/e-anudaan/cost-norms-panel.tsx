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
import { Alert, Button, Card, CardBody, DataTable, DescriptionList, Heading, Icon, Text } from "@mosje/design-system";
import { avyayCostHeads, avyayEntitlement, costedStrength } from "@/lib/e-anudaan/form-schema";
import { formatMoney } from "@/lib/e-anudaan/format";

/**
 * Money in this panel is the EXACT form (format.ts): the Recurring Grant field under it prints the
 * same figure in full, and the two must read alike. Tabular Noto Sans, never monospace (audit W-12).
 */
const money = (n: number) => formatMoney(n, "exact");

export function CostNormsPanel({
  natureOfProject,
  agencyType,
  projectState,
  cityCategory,
  buildingOwnership,
  recurringSought,
  nonRecurringSought,
  beneficiaries,
}: {
  natureOfProject?: string;
  agencyType?: string;
  projectState?: string;
  cityCategory?: string;
  buildingOwnership?: string;
  recurringSought?: string;
  nonRecurringSought?: string;
  /** The beneficiaries entered on the Infrastructure step, read against the strength the norms are costed for. */
  beneficiaries?: string;
}) {
  const [open, setOpen] = React.useState(false);

  // Live recomputes every head from the project type, so a 25-beneficiary home draws different
  // figures from a 50. Resolve the table before any of the arithmetic below reads it.
  const heads = avyayCostHeads(natureOfProject);

  const tier = (cityCategory ?? "").charAt(0) || "Z";

  // One computation, shared with the Recurring Grant field under this panel, so the two cannot differ.
  const { share, recurringAllowed, recurringNorm, ownedDeduction, nonRecurringNorm, attendanceLinked, recurringCentral, nonRecurringCentral, totalCentral: totalAllowed } =
    avyayEntitlement({ natureOfProject, agencyType, projectState, buildingOwnership });

  const strength = costedStrength({ fld_nature_of_project: natureOfProject ?? "" });
  const enteredResidents = /^\d+$/.test((beneficiaries ?? "").trim()) ? Number(beneficiaries) : null;
  const belowStrength = strength != null && enteredResidents != null && enteredResidents < strength;

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
              hint: ownedDeduction > 0 ? `Norm ${money(recurringNorm)}, less ${money(ownedDeduction)} because the building is owned` : undefined,
              value: <span className="font-semibold tabular-nums">{money(recurringCentral)}</span>,
            },
            {
              term: "Non-recurring",
              hint: `Norm ${money(nonRecurringNorm)}`,
              value: <span className="font-semibold tabular-nums">{money(nonRecurringCentral)}</span>,
            },
            { term: "Total", value: <span className="font-bold tabular-nums">{money(totalAllowed)}</span> },
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
              { key: "norm", header: "Norm", className: "text-right tabular-nums", render: (h) => money(h.norm) },
              { key: "central", header: "Central share", className: "text-right tabular-nums", render: (h) => money(h.central) },
            ]}
            data={headRows}
            total={headRows.length}
            pageSizes={[Math.max(headRows.length, 1)]}
            showPageSizes={false}
          />
        )}

        <p className="text-body-3 text-ink-muted">
          Central share {share}% · city category {tier} · norms of 2021-22. {money(attendanceLinked)} of the
          recurring norm is linked to the residents actually served, and is reduced if the home runs below its
          sanctioned strength. Indicative. The amount sanctioned is decided by the Ministry from these same
          norms after scrutiny.
        </p>

        {/* The figure entered, read against the strength the norms are costed for — one application,
            one number of residents (audit W-01). The 25 in a project type's name is not a minimum. */}
        {belowStrength && (
          <Alert status="info">
            {enteredResidents} residents are entered against the {strength} this project type is costed for. The
            attendance-linked part of the recurring grant is reduced when a home runs below that strength.
          </Alert>
        )}

        {overNorm && (
          <Alert status="warning">
            You have asked for more than the norms allow. You may still submit — the officer will see your
            figure beside the norm — but the grant cannot exceed the norm.
          </Alert>
        )}

      </CardBody>
    </Card>
  );
}
