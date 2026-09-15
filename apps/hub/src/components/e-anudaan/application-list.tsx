"use client";

import * as React from "react";
import { Search, WorklistScreen, screenCopy } from "@mosje/design-system";
import type { GrantApplication, RoleId } from "@/lib/e-anudaan/types";
import { useWorklistOptions, worklistColumns, type WorklistVariant, splitRowActions } from "./worklist-table";

/**
 * Build a CSV from the selected rows.
 *
 * The columns decide what is exported, so a column added to the table appears in
 * the file without anyone remembering to add it — and `noExport` columns (the
 * selection box, the row action) stay out, which is what that flag is for.
 * Values come from `exportValue` where a column defines one, and otherwise from
 * the raw field, never from the rendered node: a `<Badge>` exports as
 * "[object Object]".
 */
function toCsv(rows: GrantApplication[], columns: ReturnType<typeof worklistColumns>): string {
  const cols = columns.filter((c) => !c.noExport && c.key !== "action");
  const cell = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = cols.map((c) => cell(c.header)).join(",");
  const body = rows.map((r) =>
    cols
      .map((c) =>
        cell(
          c.exportValue
            ? c.exportValue(r)
            : (r as unknown as Record<string, unknown>)[c.key],
        ),
      )
      .join(","),
  );
  return [head, ...body].join("\n");
}

export interface ApplicationListProps {
  /** Which of the five column sets this screen shows. */
  variant: WorklistVariant;
  title: string;
  description: string;
  rows: GrantApplication[];
  /** Where a row's Review / View link goes. Omit for a read-only register. */
  reviewBase?: string;
  /**
   * Offer selection and a CSV export of what is selected.
   *
   * Deliberately the ONLY bulk action here. A grant sanction is an individual
   * statutory act carried out with remarks against one application; a "bulk
   * approve" would be inventing a workflow the department does not have. Export
   * is a real capability — `DataTable` already models it per column — and it is
   * the one an officer working a register actually asks for.
   */
  exportable?: boolean;
  /** On the Forwarded register: the officer whose forwards are listed, for the "Forwarded On" date. */
  forwardedBy?: RoleId;
  /** On the Sanction Register: where each file's payment status opens. */
  paymentBase?: string;
}

const LIST_COPY = screenCopy({
  loadingLabel: "Loading applications",
  // The heading form of the embedded table's sentence (EMPTY_LIST), so both say the same thing.
  emptyTitle: "No Applications in This List",
  emptyDescription: undefined,
  filteredTitle: "No Application Matches This Search",
  filteredDescription: "Clear the search to see the full list.",
  clearFiltersLabel: "Clear Search",
});

/**
 * The standalone officer list screens — Sanctioned, Rejected, Forwarded,
 * Queries and the Application Explorer — composed from `WorklistScreen`.
 *
 * Five pages were each a heading block plus `WorklistTable`, and `WorklistTable`
 * carried its own search field and its own "Showing n of m" line. Both of those
 * are what `WorklistScreen` provides, so moving here removed a copy rather than
 * adding one. `WorklistTable` stays for the embedded case — the Action Queue
 * renders it inside `OverviewScreen`'s recent slot, where a second `<h1>` and a
 * second search bar would be wrong.
 */
export function ApplicationList({
  variant,
  title,
  description,
  rows,
  reviewBase,
  exportable = false,
  forwardedBy,
  paymentBase,
}: ApplicationListProps): React.JSX.Element {
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);

  // Every register names the State and links the organisation to its NGO 360 (inventory §17–19, §33).
  const opts = useWorklistOptions(reviewBase, forwardedBy, { paymentBase, withPlace: true, withNgoLink: true });
  const columns = React.useMemo(() => worklistColumns(variant, opts), [variant, opts]);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (r) =>
        r.id.toLowerCase().includes(needle) ||
        r.institutionId.toLowerCase().includes(needle) ||
        (opts.ngoName?.(r.ngoId) ?? "").toLowerCase().includes(needle),
    );
  }, [rows, q, opts]);

  /* The reader's search IS the filter, so it decides whether an empty result
     reads as "nothing matches what you typed" or as "the register holds
     nothing". Those are different sentences and the template picks between them
     from this number. */
  const activeFilterCount = q.trim() ? 1 : 0;

  const handleBulk = (id: string): void => {
    if (id !== "export") return;
    const chosen = filtered.filter((r) => selected.includes(r.id));
    const blob = new Blob([toCsv(chosen, columns)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\W+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WorklistScreen<GrantApplication>
      title={title}
      meta={description}
      {...splitRowActions(columns)}
      rows={filtered}
      registerTotal={rows.length}
      getRowId={(row) => row.id}
      noun="application"
      pluralNoun="applications"
      activeFilterCount={activeFilterCount}
      onClearFilters={() => setQ("")}
      filters={
        <Search
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by Project ID, application or NGO"
          aria-label="Search applications"
        />
      }
      selectedIds={exportable ? selected : undefined}
      onSelectionChange={exportable ? setSelected : undefined}
      bulkActions={exportable ? [{ id: "export", label: "Export selected", icon: "download" }] : undefined}
      onBulkAction={handleBulk}
      /* One empty-state sentence across the console. The template's default ("No Records
         Published") read as a publishing notice, and the embedded table said something else. */
      copy={LIST_COPY}
    />
  );
}
