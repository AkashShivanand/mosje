"use client";

import * as React from "react";
import { Select } from "@mosje/design-system";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { CentreActivity } from "@/lib/treatment-centre/types";
import { ACTIVITY_CATEGORIES } from "@/lib/treatment-centre/masters-extra";

type Row = CentreActivity & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "activity", header: "Activity" },
  { key: "category", header: "Category", render: (r) => r.category ?? "—" },
  { key: "date", header: "Date" },
  { key: "location", header: "Location" },
  { key: "beneficiaries", header: "Beneficiaries" },
];

const CATEGORY_OPTIONS = [
  { label: "All categories", value: "" },
  ...ACTIVITY_CATEGORIES.map((c) => ({ label: c.label, value: c.label })),
];

export default function ActivitiesPage() {
  const store = useTCStore();
  const [category, setCategory] = React.useState("");

  const rows: Row[] = store.activities
    .filter((a) => !category || a.category === category)
    .map((a, i) => ({ ...a, sno: i + 1 }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-white p-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="activity-category-filter" className="text-xs font-semibold text-ink-muted">
            Filter by Activity Category
          </label>
          <Select
            id="activity-category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
          />
        </div>
        {category && (
          <button
            type="button"
            onClick={() => setCategory("")}
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-muted hover:bg-surface-muted"
          >
            Reset
          </button>
        )}
      </div>

      <TCListPage
        title="Activity List"
        columns={columns}
        data={rows}
        searchKeys={["activity", "category", "location"]}
        fileName="activity-list"
        emptyLabel="No activities match the selected category."
      />
    </div>
  );
}
