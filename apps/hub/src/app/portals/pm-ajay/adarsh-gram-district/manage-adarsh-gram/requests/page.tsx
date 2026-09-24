"use client";

/* Adarsh Gram — District: Villages Submitted to State for Adarsh Gram Declaration.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/manage-adarsh-gram/requests.

   DS Audit: WorklistScreen ✅ (owns all seven states, paging, the phone cards)
   · FormField ✅ · Select ✅ · Search ✅ · Badge ✅ · Button ✅. Nothing added.

   Read-only register: the live screen's own H2 counts "Declaration Requests"
   and nothing on it invites the officer to act on a row, so — unlike the
   Declare screen — there is no selection and no bulk action here. */

import * as React from "react";
import {
  Badge,
  Button,
  FormField,
  Search,
  Select,
  WorklistScreen,
  screenCopy,
  type WorklistColumn,
} from "@mosje/design-system";
import {
  BLOCKS,
  DECLARATION_REQUESTS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  PROVENANCE_LINE,
  VILLAGES,
  type DeclarationRequest,
} from "@/lib/pm-ajay/district/registers";

const STATUS_TONE: Record<DeclarationRequest["status"], "warning" | "success" | "danger"> = {
  "Pending with State": "warning",
  Approved: "success",
  "Returned for Correction": "danger",
};

const COLUMNS: WorklistColumn<DeclarationRequest>[] = [
  { key: "village", header: "Village", priority: 1 },
  { key: "gramPanchayat", header: "Gram Panchayat", priority: 2 },
  { key: "score", header: "Latest Village Score", align: "end", priority: 2 },
  { key: "submittedOn", header: "Submitted On", priority: 2 },
  {
    key: "status",
    header: "Status",
    priority: 1,
    render: (row) => <Badge status={STATUS_TONE[row.status]}>{row.status}</Badge>,
  },
  {
    key: "remarks",
    header: "State's Remarks",
    priority: 3,
    render: (row) => row.remarks ?? "No remarks",
  },
];

/** Every request keyed to the village it belongs to, for the Block/GP filters. */
function villageOf(name: string) {
  return VILLAGES.find((v) => v.village === name);
}

export default function AdarshGramDeclarationRequestsPage() {
  const [block, setBlock] = React.useState("");
  const [gp, setGp] = React.useState("");
  const [village, setVillage] = React.useState("");
  const [query, setQuery] = React.useState("");

  const gramPanchayats = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villageOptions = React.useMemo(
    () =>
      VILLAGES.filter((v) => (!block || v.block === block) && (!gp || v.gramPanchayat === gp)),
    [block, gp],
  );

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return DECLARATION_REQUESTS.filter((r) => {
      const v = villageOf(r.village);
      if (block && v?.block !== block) return false;
      if (gp && v?.gramPanchayat !== gp) return false;
      if (village && r.village !== village) return false;
      if (!q) return true;
      return `${r.village} ${r.gramPanchayat} ${r.status} ${r.remarks ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [block, gp, village, query]);

  const activeFilterCount =
    (block ? 1 : 0) + (gp ? 1 : 0) + (village ? 1 : 0) + (query.trim() ? 1 : 0);

  const onClearFilters = () => {
    setBlock("");
    setGp("");
    setVillage("");
    setQuery("");
  };

  return (
    <WorklistScreen
      eyebrow="Adarsh Gram — District"
      title="Villages Submitted to State for Adarsh Gram Declaration"
      meta={`Declarations raised to the state for ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}, and the state's decision on each. ${PROVENANCE_LINE}`}
      filters={
        <>
          <FormField label="Block" id="requests-block">
            {(control) => (
              <Select
                {...control}
                value={block}
                onChange={(event) => {
                  setBlock(event.target.value);
                  setGp("");
                  setVillage("");
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
          <FormField label="Gram Panchayat" id="requests-gp">
            {(control) => (
              <Select
                {...control}
                value={gp}
                onChange={(event) => {
                  setGp(event.target.value);
                  setVillage("");
                }}
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
          <FormField label="Village" id="requests-village">
            {(control) => (
              <Select
                {...control}
                value={village}
                onChange={(event) => setVillage(event.target.value)}
                placeholder="All Villages"
                disabled={!gp}
              >
                {villageOptions.map((v) => (
                  <option key={v.id} value={v.village}>
                    {v.village}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <Button appearance="outlined" onClick={onClearFilters} disabled={activeFilterCount === 0}>
            Reset
          </Button>
          <Search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Village or status"
            aria-label="Search declaration requests"
          />
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={onClearFilters}
      columns={COLUMNS}
      rows={rows}
      registerTotal={DECLARATION_REQUESTS.length}
      getRowId={(row) => row.id}
      noun="declaration request"
      pluralNoun="declaration requests"
      copy={screenCopy({
        emptyTitle: "No village has been submitted for Adarsh Gram declaration yet",
        emptyDescription:
          "A village appears here once it is submitted from the Declare Adarsh Gram screen.",
        filteredTitle: "No declaration request matches those filters",
        filteredDescription: "Clear the filters or the search to see the whole register.",
      })}
    />
  );
}
