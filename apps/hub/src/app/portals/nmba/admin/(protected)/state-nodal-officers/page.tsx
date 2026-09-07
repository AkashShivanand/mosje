"use client";

import * as React from "react";
import { AdminShell } from "@/components/nmba/admin-shell";

import { SNO_LIST, SNO_TOTAL } from "@/lib/nmba/mock-data";
import { STATES } from "@/lib/nmba/states";
import type { NodalOfficer } from "@/lib/nmba/types";
import { useToast } from "@/components/nmba/toast";
import { Button, Icon, Select, WorklistScreen, type WorklistColumn } from "@mosje/design-system";

const columns: WorklistColumn<NodalOfficer>[] = [
  { key: "name", header: "Name", priority: 1 },
  { key: "designation", header: "Designation", priority: 2 },
  { key: "stateName", header: "State", priority: 2 },
  { key: "districtName", header: "District", priority: 2 },
  { key: "email", header: "Email", priority: 3 },
  { key: "mobile", header: "Mobile", priority: 3 },
];

export default function StateNodalOfficersPage() {
  const { toast } = useToast();
  const [filterState, setFilterState] = React.useState("");

  const filtered = filterState
    ? SNO_LIST.filter((o) => o.stateName === filterState)
    : SNO_LIST;

  return (
    <AdminShell>
      <WorklistScreen
        title="List of State Nodal Officers"
        columns={columns}
        /* The pager counts `rows`; `registerTotal` only words the count line.
           This page handed the register's 35 to a table holding 20, so two of
           its four pages were empty. */
        rows={filtered}
        registerTotal={SNO_TOTAL}
        getRowId={(o) => `${o.email}`}
        noun="officer"
        /* The real predicate, not the presence of a control: an unset "All
           States" is not a filter, and counting it would tell a reader with an
           empty register to try clearing filters they never set. */
        activeFilterCount={filterState ? 1 : 0}
        onClearFilters={() => setFilterState("")}
        actions={
          <Button
            appearance="outlined"
            onClick={() => toast("Export starting…", "info")}
            iconLeft={<Icon name="download" size={16} />}
          >
            Export
          </Button>
        }
        filters={
          <Select
            aria-label="Filter by state"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        }
        copy={{
          idleTitle: "Search the Register",
          loadingLabel: "Loading State Nodal Officers",
          errorTitle: "This Information Could Not Be Loaded",
          errorDescription: "The service did not respond. Please try again.",
          retryLabel: "Try again",
          emptyTitle: "No State Nodal Officers Registered",
          emptyDescription: "No state has nominated a nodal officer on this portal yet.",
          filteredTitle: "No Officers Match the Selected State",
          filteredDescription: "Clear the state filter to see every registered officer.",
          clearFiltersLabel: "Clear filters",
        }}
      />
    </AdminShell>
  );
}
