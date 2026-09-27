"use client";

/* Adarsh Gram — District: Agency Master.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/agency/list.

   DS Audit: WorklistScreen ✅ (owns all seven states, the pager and the phone cards) ·
   Button ✅ · IconButton ✅ · Icon ✅ · Select ✅ · Search ✅. Nothing added.

   The live screen's table is S.No. / State / District / Agency Name with a row menu.
   The serial column is dropped: DataTable numbers nothing the reader can act on, and a
   serial number that renumbers itself when the list is filtered is not a reference. */

import * as React from "react";
import Link from "next/link";
import {
  Button,
  FormField,
  Icon,
  IconButton,
  Search,
  Select,
  WorklistScreen,
  screenCopy,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  AGENCIES,
  AGENCY_TYPES,
  DISTRICT_SCOPE,
  type AgencyRecord,
} from "@/lib/pm-ajay/district/registers";

const ALL_TYPES = "All types";

const COLUMNS: WorklistColumn<AgencyRecord>[] = [
  { key: "name", header: "Agency Name", priority: 1 },
  { key: "type", header: "Type", priority: 2 },
  { key: "contactPerson", header: "Contact Person", priority: 2 },
  { key: "mobile", header: "Mobile", priority: 3 },
  { key: "district", header: "District", priority: 3 },
  { key: "state", header: "State", priority: 3 },
];

export default function AgencyListPage() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState(ALL_TYPES);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return AGENCIES.filter((a) => {
      if (type !== ALL_TYPES && a.type !== type) return false;
      if (!q) return true;
      return `${a.name} ${a.contactPerson} ${a.type}`.toLowerCase().includes(q);
    });
  }, [query, type]);

  const activeFilterCount = (query.trim() ? 1 : 0) + (type !== ALL_TYPES ? 1 : 0);

  return (
    <WorklistScreen
      eyebrow="Adarsh Gram — District"
      title="Agency Master"
      meta={`Agencies that carry out Adarsh Gram works in ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}.`}
      actions={
        <Button href={`${DISTRICT_BASE}/agency/add`} linkAs={Link} iconLeft={<Icon name="add" size={20} />}>
          Add Agency
        </Button>
      }
      filters={
        <>
          <Search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Agency or contact person"
            aria-label="Search agencies"
          />
          <FormField label="Agency Type" id="agency-type-filter">
            {(control) => (
              <Select {...control} value={type} onChange={(event) => setType(event.target.value)}>
                <option value={ALL_TYPES}>{ALL_TYPES}</option>
                {AGENCY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
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
        setType(ALL_TYPES);
      }}
      columns={COLUMNS}
      rows={rows}
      registerTotal={AGENCIES.length}
      getRowId={(row) => row.id}
      noun="agency"
      pluralNoun="agencies"
      rowActions={(row) => (
        <IconButton
          icon={<Icon name="edit" size={20} />}
          aria-label={`Edit ${row.name}`}
          variant="neutral"
          appearance="text"
          size="sm"
          tooltip
          href={`${DISTRICT_BASE}/agency/add?agency=${row.id}`}
          linkAs={Link}
        />
      )}
      emptyAction={
        <Button href={`${DISTRICT_BASE}/agency/add`} linkAs={Link}>
          Add the first agency
        </Button>
      }
      copy={screenCopy({
        emptyTitle: "No agency is on the district's register yet",
        emptyDescription:
          "Add the line departments and implementing agencies that carry out Adarsh Gram works, so they can be named on Format II and Format IV.",
        filteredTitle: "No agency matches those filters",
        filteredDescription: "Clear the search or the type to see the whole register.",
      })}
    />
  );
}
