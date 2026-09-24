"use client";

/* Adarsh Gram — District: Format I, Village Level Data.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-1.

   DS Audit: WorklistScreen ✅ (owns all seven states, the pager and the phone cards) ·
   Button ✅ · IconButton ✅ · Icon ✅ · Select ✅ · Search ✅ · FormField ✅ · Badge ✅.
   Nothing added.

   Two deliberate departures from the live screen:
   - The live table leads with S.No. `agency/list` already reasoned through the same
     column on this district's register and dropped it: DataTable numbers nothing the
     reader can act on, and a serial that renumbers itself under a filter is not a
     reference. Village is the row's name instead (priority 1).
   - "Financial Year" is not offered as a filter. The register carries one financial
     year (`DISTRICT_SCOPE.financialYear`); a select with one live option and one
     "All Years" default filters nothing, and `data-state-completeness.md` §1's
     `filtered` rule requires a filter to be a real predicate. Block, Gram Panchayat
     and Village — the three that actually narrow the register — are kept. */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  FormField,
  Icon,
  IconButton,
  Search,
  Select,
  WorklistScreen,
  screenCopy,
  type BadgeStatus,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  BLOCKS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  PROVENANCE_LINE,
  VILLAGES,
  type VdpStage,
  type VillageRecord,
} from "@/lib/pm-ajay/district/registers";

const ALL_BLOCKS = "All Blocks";
const ALL_GPS = "All Gram Panchayats";
const ALL_VILLAGES = "All Villages";

/** VDP stage → the badge tone that reads the status at a glance, paired with its word. */
const STAGE_TONE: Record<VdpStage, BadgeStatus> = {
  "VDP Not Generated": "neutral",
  "VDP Drafted": "warning",
  "DLCC Approved": "info",
  "Declared Adarsh Gram": "success",
};

const COLUMNS: WorklistColumn<VillageRecord>[] = [
  { key: "village", header: "Village", priority: 1 },
  { key: "block", header: "Block", priority: 2 },
  { key: "gramPanchayat", header: "Gram Panchayat", priority: 2 },
  { key: "population", header: "Population", align: "end", priority: 2 },
  { key: "scPopulation", header: "SC Population", align: "end", priority: 3 },
  { key: "households", header: "Households", align: "end", priority: 3 },
  {
    key: "stage",
    header: "VDP Status",
    priority: 2,
    render: (row) => (
      <Badge status={STAGE_TONE[row.stage]}>{row.stage}</Badge>
    ),
  },
  { key: "createdOn", header: "Created On", priority: 3 },
];

export default function Format1ListPage() {
  const [query, setQuery] = React.useState("");
  const [block, setBlock] = React.useState(ALL_BLOCKS);
  const [gramPanchayat, setGramPanchayat] = React.useState(ALL_GPS);
  const [village, setVillage] = React.useState(ALL_VILLAGES);

  const gpOptions = block === ALL_BLOCKS ? [] : (GRAM_PANCHAYATS[block] ?? []);
  const villageOptions =
    gramPanchayat === ALL_GPS
      ? []
      : VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat).map((v) => v.village);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return VILLAGES.filter((v) => {
      if (block !== ALL_BLOCKS && v.block !== block) return false;
      if (gramPanchayat !== ALL_GPS && v.gramPanchayat !== gramPanchayat) return false;
      if (village !== ALL_VILLAGES && v.village !== village) return false;
      if (!q) return true;
      return `${v.village} ${v.block} ${v.gramPanchayat} ${v.censusCode}`.toLowerCase().includes(q);
    });
  }, [query, block, gramPanchayat, village]);

  const activeFilterCount =
    (query.trim() ? 1 : 0) +
    (block !== ALL_BLOCKS ? 1 : 0) +
    (gramPanchayat !== ALL_GPS ? 1 : 0) +
    (village !== ALL_VILLAGES ? 1 : 0);

  return (
    <WorklistScreen
      eyebrow="Adarsh Gram — District · Village Format I to IV"
      title="Format – I: Village Level Data"
      meta={`Population, households and VDP status recorded for every village taken up under Adarsh Gram in ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}. ${PROVENANCE_LINE}`}
      actions={
        <Button href={`${DISTRICT_BASE}/format-1/add`} linkAs={Link} iconLeft={<Icon name="add" size={20} />}>
          Add Village Data
        </Button>
      }
      filters={
        <>
          <Search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Village or LGD code"
            aria-label="Search villages by LGD code or name"
          />
          <FormField label="Block" id="f1-filter-block">
            {(control) => (
              <Select
                {...control}
                value={block}
                onChange={(event) => {
                  setBlock(event.target.value);
                  setGramPanchayat(ALL_GPS);
                  setVillage(ALL_VILLAGES);
                }}
              >
                <option value={ALL_BLOCKS}>{ALL_BLOCKS}</option>
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Gram Panchayat" id="f1-filter-gp">
            {(control) => (
              <Select
                {...control}
                disabled={block === ALL_BLOCKS}
                value={gramPanchayat}
                onChange={(event) => {
                  setGramPanchayat(event.target.value);
                  setVillage(ALL_VILLAGES);
                }}
              >
                <option value={ALL_GPS}>{ALL_GPS}</option>
                {gpOptions.map((gp) => (
                  <option key={gp} value={gp}>
                    {gp}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Village" id="f1-filter-village">
            {(control) => (
              <Select
                {...control}
                disabled={gramPanchayat === ALL_GPS}
                value={village}
                onChange={(event) => setVillage(event.target.value)}
              >
                <option value={ALL_VILLAGES}>{ALL_VILLAGES}</option>
                {villageOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={() => {
        setQuery("");
        setBlock(ALL_BLOCKS);
        setGramPanchayat(ALL_GPS);
        setVillage(ALL_VILLAGES);
      }}
      columns={COLUMNS}
      rows={rows}
      registerTotal={VILLAGES.length}
      getRowId={(row) => row.id}
      noun="village"
      pluralNoun="villages"
      rowActions={(row) => (
        <IconButton
          icon={<Icon name="edit" size={20} />}
          aria-label={`Edit Format I data for ${row.village}`}
          variant="neutral"
          appearance="text"
          size="sm"
          tooltip
          href={`${DISTRICT_BASE}/format-1/add?village=${row.id}`}
          linkAs={Link}
        />
      )}
      emptyAction={
        <Button href={`${DISTRICT_BASE}/format-1/add`} linkAs={Link}>
          Add the first village
        </Button>
      }
      copy={screenCopy({
        emptyTitle: "No village is on the district's Format I register yet",
        emptyDescription:
          "Add a village's Format I data once it is taken up under Adarsh Gram, so its population, households and VLCC members are on record.",
        filteredTitle: "No village matches those filters",
        filteredDescription: "Clear the search, or the block, Gram Panchayat and village filters, to see the whole register.",
      })}
    />
  );
}
