"use client";

/* Adarsh Gram — District: Format II — Infrastructure Development & Action Plan.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-2.

   DS Audit: WorklistScreen ✅ (owns all seven states, the pager and the phone cards) ·
   Button ✅ · Icon ✅ · Select ✅ · FormField ✅ · Badge ✅. Nothing added.

   The live screen is a Block / Gram Panchayat / Village filter row above a register
   that only fills once a village is fully chosen — no village, no request has been
   made, which is `idle`, not `empty` (`.claude/rules/data-state-completeness.md`).
   The live capture shows nothing at all below the filters at that point; this screen
   states the idle prompt instead, because a data-driven surface with no rendering
   for one of its seven states is the defect the estate's own rule exists to close.

   The register is the WORKS list (`registers.ts`) narrowed to the selected village
   and to the five domains Format II treats as infrastructure
   (`lib/pm-ajay/district/infrastructure-plan.ts`). */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  FormField,
  Icon,
  Select,
  WorklistScreen,
  screenCopy,
  type BadgeStatus,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import { useVillageCascade } from "@/lib/pm-ajay/district/village-cascade";
import { isInfrastructureDomain } from "@/lib/pm-ajay/district/infrastructure-plan";
import {
  BLOCKS,
  DISTRICT_SCOPE,
  PROVENANCE_LINE,
  WORKS,
  lakh,
  type WorkRecord,
} from "@/lib/pm-ajay/district/registers";

const STATUS_TONE: Record<WorkRecord["status"], BadgeStatus> = {
  Identified: "info",
  "In Progress": "warning",
  Completed: "success",
  Withheld: "danger",
};

const COLUMNS: WorklistColumn<WorkRecord>[] = [
  { key: "work", header: "Work", priority: 1 },
  { key: "domain", header: "Domain", priority: 2 },
  { key: "agency", header: "Executing Agency", priority: 2 },
  {
    key: "status",
    header: "Status",
    priority: 2,
    render: (row) => <Badge status={STATUS_TONE[row.status]}>{row.status}</Badge>,
  },
  { key: "sanctioned", header: "Sanctioned Cost", align: "end", priority: 3, render: (row) => lakh(row.sanctioned) },
  { key: "targetDate", header: "Target Date", priority: 3 },
];

export default function Format2Page() {
  const cascade = useVillageCascade();

  const rows = React.useMemo(() => {
    if (!cascade.selected) return [];
    const village = cascade.selected.village;
    return WORKS.filter((w) => w.village === village && isInfrastructureDomain(w.domain));
  }, [cascade.selected]);

  return (
    <WorklistScreen
      eyebrow="Adarsh Gram — District"
      title="Format – II: Infrastructure Development & Action Plan"
      meta={`${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} · the infrastructure works planned for a chosen village. ${PROVENANCE_LINE}`}
      actions={
        <>
          <Button href={`${DISTRICT_BASE}/format-2/create`} linkAs={Link} iconLeft={<Icon name="add" size={20} />}>
            Add New
          </Button>
          <Button
            href={`${DISTRICT_BASE}/dashboard`}
            linkAs={Link}
            variant="neutral"
            appearance="outlined"
            iconLeft={<Icon name="arrow_back" size={20} />}
          >
            Back to Dashboard
          </Button>
        </>
      }
      filters={
        <>
          <FormField label="Block" id="f2-block" required>
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
          <FormField label="Gram Panchayat" id="f2-gp" required>
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
          <FormField label="Village" id="f2-village" required>
            {(control) => (
              <Select
                {...control}
                value={cascade.village}
                onChange={(e) => cascade.setVillage(e.target.value)}
                placeholder="Select Village Name"
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
      columns={COLUMNS}
      rows={rows}
      getRowId={(row) => row.id}
      noun="work"
      pluralNoun="works"
      emptyAction={
        <Button href={`${DISTRICT_BASE}/format-2/create`} linkAs={Link}>
          Add the first work
        </Button>
      }
      copy={screenCopy({
        idleTitle: "Choose a Village",
        idleDescription: "Select the block, Gram Panchayat and village to view its infrastructure plan.",
        emptyTitle: "No Infrastructure Work Is Recorded for This Village",
        emptyDescription: cascade.selected
          ? `No work has been raised for ${cascade.selected.village} under Format II yet.`
          : "No work has been raised under Format II yet.",
      })}
    />
  );
}
