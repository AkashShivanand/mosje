"use client";

import * as React from "react";
import { AdminShell } from "@/components/nmba/admin-shell";
import { WorklistScreen, type WorklistColumn } from "@mosje/design-system";
import { DNO_LIST, DNO_TOTAL } from "@/lib/nmba/mock-data";
import type { NodalOfficer } from "@/lib/nmba/types";
import { useToast } from "@/components/nmba/toast";
import { Button, Icon } from "@mosje/design-system";

const columns: WorklistColumn<NodalOfficer>[] = [
  { key: "name", header: "Name", priority: 1 },
  { key: "designation", header: "Designation", priority: 2 },
  { key: "stateName", header: "State", priority: 2 },
  { key: "districtName", header: "District", priority: 2 },
  { key: "email", header: "Email", priority: 3 },
  { key: "mobile", header: "Mobile", priority: 3 },
];

export default function DistrictNodalOfficersPage() {
  const { toast } = useToast();

  return (
    <AdminShell>
      <WorklistScreen
        title="List of District Nodal Officers"
        columns={columns}
        /* `rows` is what the pager counts and `registerTotal` is the count line
           only. Keeping them apart is not a nicety here: this page passed the
           register's 723 straight to the table while holding 20 rows, so the
           pager offered 73 pages and 71 of them were empty. */
        rows={DNO_LIST}
        registerTotal={DNO_TOTAL}
        getRowId={(o) => `${o.email}`}
        noun="officer"
        actions={
          <Button
            appearance="outlined"
            onClick={() => toast("Export starting…", "info")}
            iconLeft={<Icon name="download" size={16} />}
          >
            Export
          </Button>
        }
        copy={{
          idleTitle: "Search the Register",
          loadingLabel: "Loading District Nodal Officers",
          errorTitle: "This Information Could Not Be Loaded",
          errorDescription: "The service did not respond. Please try again.",
          retryLabel: "Try again",
          emptyTitle: "No District Nodal Officers Registered",
          emptyDescription: "No district has nominated a nodal officer on this portal yet.",
          filteredTitle: "No Officers Match Your Filters",
          clearFiltersLabel: "Clear filters",
        }}
      />
    </AdminShell>
  );
}
