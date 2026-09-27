"use client";

/* Adarsh Gram — District: Declaration of Selected Villages as "Adarsh Gram".
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/manage-adarsh-gram/declare.

   DS Audit: WorklistScreen ✅ (selection + bulk action, all seven states) ·
   Select ✅ · Button ✅ · Badge ✅ · Alert ✅. Nothing added.

   Template choice: the live H1 itself says "villages" — plural — and the
   Village field is scoped to those that "achieved minimum score", which reads
   as one register of every eligible village rather than a single record to
   decide on one at a time. `WorklistScreen` with selection and a bulk action
   matches that; `DecisionScreen` would force a one-option verdict form onto
   what the live screen draws as a filtered list. */

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  FormField,
  Select,
  WorklistScreen,
  screenCopy,
  type BulkAction,
  type WorklistColumn,
} from "@mosje/design-system";
import {
  BLOCKS,
  DECLARATION_REQUESTS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  VILLAGES,
} from "@/lib/pm-ajay/district/registers";
import {
  EXTRA_ELIGIBLE_VILLAGES,
  MIN_DECLARATION_SCORE,
  type EligibleDeclarationVillage,
} from "@/lib/pm-ajay/district/adarsh-gram-workflow";

const COLUMNS: WorklistColumn<EligibleDeclarationVillage>[] = [
  { key: "village", header: "Village", priority: 1 },
  { key: "gramPanchayat", header: "Gram Panchayat", priority: 2 },
  { key: "block", header: "Block", priority: 3 },
  { key: "score", header: "Latest Village Score", align: "end", priority: 2 },
  {
    key: "status",
    header: "Status",
    priority: 2,
    render: (row) =>
      row.returnedNote ? (
        <Badge status="warning">Returned for Correction</Badge>
      ) : (
        <Badge status="neutral">Not Yet Submitted</Badge>
      ),
  },
];

const BULK_ACTIONS: BulkAction[] = [{ id: "declare", label: "Submit for Declaration" }];

export default function DeclareAdarshGramPage() {
  const [block, setBlock] = React.useState("");
  const [gp, setGp] = React.useState("");
  const [submittedIds, setSubmittedIds] = React.useState<string[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [notice, setNotice] = React.useState<string | null>(null);

  /* Every village the register itself makes eligible: VDP finalised (DLCC
     Approved) and at least the minimum score — the same two criteria the
     banner above the table states. A village already Approved by the state,
     or currently Pending with it, is left out; one Returned for Correction
     stays eligible, because that is exactly what a resubmission is. */
  const eligible = React.useMemo<EligibleDeclarationVillage[]>(() => {
    const fromRegister = VILLAGES.filter(
      (v) => v.stage === "DLCC Approved" && (v.score ?? 0) >= MIN_DECLARATION_SCORE,
    )
      .flatMap<EligibleDeclarationVillage>((v) => {
        const request = DECLARATION_REQUESTS.find((d) => d.village === v.village);
        /* Already with the state, or already approved by it: not this screen's
           business. A village RETURNED for correction is still eligible, because
           that is exactly what a resubmission is. */
        if (request && request.status !== "Returned for Correction") return [];
        return [{
          id: v.id,
          block: v.block,
          gramPanchayat: v.gramPanchayat,
          village: v.village,
          score: v.score ?? 0,
          returnedNote: request?.status === "Returned for Correction" ? request.remarks ?? undefined : undefined,
        }];
      });
    return [...fromRegister, ...EXTRA_ELIGIBLE_VILLAGES].filter((v) => !submittedIds.includes(v.id));
  }, [submittedIds]);

  const gramPanchayats = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const rows = React.useMemo(
    () =>
      eligible.filter(
        (v) => (!block || v.block === block) && (!gp || v.gramPanchayat === gp),
      ),
    [eligible, block, gp],
  );

  const activeFilterCount = (block ? 1 : 0) + (gp ? 1 : 0);
  const onClearFilters = () => {
    setBlock("");
    setGp("");
  };

  const onBulkAction = (id: string) => {
    if (id !== "declare") return;
    const chosen = eligible.filter((v) => selectedIds.includes(v.id));
    if (chosen.length === 0) return;
    setSubmittedIds((prev) => [...prev, ...chosen.map((v) => v.id)]);
    setSelectedIds([]);
    setNotice(
      `${chosen.length} ${chosen.length === 1 ? "village" : "villages"} submitted to the state for Adarsh Gram declaration.`,
    );
  };

  return (
    <WorklistScreen
      eyebrow="Adarsh Gram — District"
      title={'Declaration of Selected Villages as "Adarsh Gram"'}
      meta={`Villages ready to be put forward as Adarsh Gram, for ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}.`}
      summary={
        <>
          <Alert status="info" title="Villages Eligible for Declaration Are Listed Here When:">
            1. VDP is finalised for the village. 2. The village has achieved at least the minimum
            latest village score.
          </Alert>
          {notice ? (
            <Alert status="success" dismissible onDismiss={() => setNotice(null)}>
              {notice}
            </Alert>
          ) : null}
        </>
      }
      filters={
        <>
          <FormField label="Block" id="declare-block">
            {(control) => (
              <Select
                {...control}
                value={block}
                onChange={(event) => {
                  setBlock(event.target.value);
                  setGp("");
                }}
                placeholder="All Blocks"
              >
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Gram Panchayat" id="declare-gp">
            {(control) => (
              <Select
                {...control}
                value={gp}
                onChange={(event) => setGp(event.target.value)}
                placeholder="All Gram Panchayats"
                disabled={!block}
              >
                {gramPanchayats.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <Button appearance="outlined" onClick={onClearFilters} disabled={activeFilterCount === 0}>
            Reset
          </Button>
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={onClearFilters}
      columns={COLUMNS}
      rows={rows}
      registerTotal={eligible.length}
      getRowId={(row) => row.id}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      bulkActions={BULK_ACTIONS}
      onBulkAction={onBulkAction}
      noun="village"
      pluralNoun="villages"
      copy={screenCopy({
        emptyTitle: "No village in this district is eligible for declaration yet",
        emptyDescription:
          "A village becomes eligible once its VDP is finalised and it has achieved at least a score of 70.",
        filteredTitle: "No eligible village matches those filters",
        filteredDescription: "Clear the block or Gram Panchayat filter to see every eligible village.",
      })}
    />
  );
}
