"use client";

/* Adarsh Gram — District: Format – III(A), Manage Household.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-3a/household.

   DS Audit: WorklistScreen ✅ (owns all seven states, the pager and the phone cards) ·
   Button ✅ · IconButton ✅ · Icon ✅ · Select ✅ · FormField ✅ · Badge ✅. Nothing added.

   The live screen asks for Block, Gram Panchayat and Village before it will show any
   household, and says so in one line rather than an empty table — that is `idle`, not
   `empty` (`.claude/rules/data-state-completeness.md` §1). The register itself, and its
   Household ID / Category / Survey Status columns, are not in the live capture (nothing
   was selected when it was taken); they are read off `HOUSEHOLDS` in the registers file,
   which already carries a survey status per household for exactly this table. */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  FormField,
  Icon,
  IconButton,
  Select,
  WorklistScreen,
  screenCopy,
  type BadgeStatus,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  BLOCKS,
  GRAM_PANCHAYATS,
  HOUSEHOLDS,
  PROVENANCE_LINE,
  VILLAGES,
  type HouseholdRecord,
} from "@/lib/pm-ajay/district/registers";
import { HOUSEHOLD_CATEGORIES } from "@/lib/pm-ajay/district/format-3a";

const ALL_CATEGORIES = "All";

const SURVEY_STATUS_TONE: Record<HouseholdRecord["surveyStatus"], BadgeStatus> = {
  Surveyed: "success",
  Pending: "warning",
  "Re-survey Required": "danger",
};

const COLUMNS: WorklistColumn<HouseholdRecord>[] = [
  { key: "id", header: "Household ID", priority: 1 },
  { key: "head", header: "Head of Household", priority: 1 },
  { key: "category", header: "Category", priority: 2 },
  { key: "members", header: "Number of Persons", align: "end", priority: 3 },
  {
    key: "surveyStatus",
    header: "Survey Status",
    priority: 2,
    render: (row) => <Badge status={SURVEY_STATUS_TONE[row.surveyStatus]}>{row.surveyStatus}</Badge>,
  },
  { key: "surveyedOn", header: "Surveyed On", priority: 3, render: (row) => row.surveyedOn ?? "Not yet surveyed" },
];

export default function ManageHouseholdPage() {
  const [block, setBlock] = React.useState("");
  const [gramPanchayat, setGramPanchayat] = React.useState("");
  const [village, setVillage] = React.useState("");
  const [category, setCategory] = React.useState(ALL_CATEGORIES);

  const gramPanchayats = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villages = React.useMemo(
    () => (gramPanchayat ? VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat) : []),
    [block, gramPanchayat],
  );

  const asked = village !== "";

  const rows = React.useMemo(() => {
    if (!asked) return [];
    return HOUSEHOLDS.filter((h) => {
      if (h.village !== village) return false;
      if (category !== ALL_CATEGORIES && h.category !== category) return false;
      return true;
    });
  }, [asked, village, category]);

  const registerTotal = asked ? HOUSEHOLDS.filter((h) => h.village === village).length : 0;
  const activeFilterCount = category !== ALL_CATEGORIES ? 1 : 0;

  return (
    <WorklistScreen
      eyebrow="Adarsh Gram — District"
      title="Format – III(A): Manage Household"
      meta={`The household register for Adarsh Gram villages, with each household's Format III(A) survey status. ${PROVENANCE_LINE}`}
      actions={
        <>
          <Button href={`${DISTRICT_BASE}/dashboard`} linkAs={Link} appearance="outlined" iconLeft={<Icon name="arrow_back" size={20} />}>
            Back to Dashboard
          </Button>
          <Button href={`${DISTRICT_BASE}/format-3a/add`} linkAs={Link} iconLeft={<Icon name="add" size={20} />}>
            Add Household
          </Button>
        </>
      }
      filters={
        <>
          <FormField label="Block" id="hh-filter-block" required>
            {(control) => (
              <Select
                {...control}
                placeholder="Select Block"
                value={block}
                onChange={(event) => {
                  setBlock(event.target.value);
                  setGramPanchayat("");
                  setVillage("");
                }}
              >
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Gram Panchayat" id="hh-filter-gp" required disabled={!block}>
            {(control) => (
              <Select
                {...control}
                placeholder="Select Gram Panchayat"
                value={gramPanchayat}
                onChange={(event) => {
                  setGramPanchayat(event.target.value);
                  setVillage("");
                }}
              >
                {gramPanchayats.map((gp) => (
                  <option key={gp} value={gp}>
                    {gp}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Village" id="hh-filter-village" required disabled={!gramPanchayat}>
            {(control) => (
              <Select {...control} placeholder="Select Village" value={village} onChange={(event) => setVillage(event.target.value)}>
                {villages.map((v) => (
                  <option key={v.id} value={v.village}>
                    {v.village}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Category" id="hh-filter-category">
            {(control) => (
              <Select {...control} value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value={ALL_CATEGORIES}>All</option>
                {HOUSEHOLD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={() => setCategory(ALL_CATEGORIES)}
      asked={asked}
      columns={COLUMNS}
      rows={rows}
      registerTotal={registerTotal}
      getRowId={(row) => row.id}
      noun="household"
      pluralNoun="households"
      rowActions={(row) => (
        <IconButton
          icon={<Icon name="edit" size={20} />}
          aria-label={`Edit household ${row.id}`}
          variant="neutral"
          appearance="text"
          size="sm"
          tooltip
          href={`${DISTRICT_BASE}/format-3a/add?household=${row.id}`}
          linkAs={Link}
        />
      )}
      emptyAction={
        <Button href={`${DISTRICT_BASE}/format-3a/add`} linkAs={Link}>
          Add the First Household
        </Button>
      }
      copy={screenCopy({
        idleTitle: "Choose a Village",
        idleDescription: "Select Gram Panchayat and Village to view household records.",
        emptyTitle: "No Household Is on the Register for This Village",
        emptyDescription: "Add the first household to begin its Format III(A) record.",
        filteredTitle: "No Household Matches That Category",
        filteredDescription: "Clear the category filter to see every household in this village.",
      })}
    />
  );
}
