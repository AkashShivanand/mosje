"use client";

import * as React from "react";
import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { DNO_LIST, DNO_TOTAL } from "@/lib/mock-data";
import type { NodalOfficer } from "@/lib/types";
import { useToast } from "@/components/toast";
import { Download } from "lucide-react";
import { Button } from "@mosje/design-system";

const columns = [
  { key: "name" as const, header: "Name" },
  { key: "designation" as const, header: "Designation" },
  { key: "stateName" as const, header: "State" },
  { key: "districtName" as const, header: "District" },
  { key: "email" as const, header: "Email" },
  { key: "mobile" as const, header: "Mobile" },
];

export default function DistrictNodalOfficersPage() {
  const { toast } = useToast();

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">List of District Nodal Officers</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {DNO_TOTAL} District Nodal Officers registered
          </p>
        </div>
        <Button appearance="outlined" onClick={() => toast("Export starting…", "info")} iconLeft={<Download className="h-4 w-4" />}>
          Export
        </Button>
      </div>

      <DataTable<NodalOfficer>
        data={DNO_LIST}
        columns={columns}
        caption="NMBA District Nodal Officers"
        total={DNO_TOTAL}
      />
    </AdminShell>
  );
}
