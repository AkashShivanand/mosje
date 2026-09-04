"use client";

import * as React from "react";
import { Icon, Search } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { DataTable, type ColumnDef } from "@/components/nmba/data-table";

/** Resolve a column's exportable cell value (handles render-only columns via exportValue). */
function cellValue<T extends Record<string, unknown>>(c: ColumnDef<T>, row: T): string {
  if (c.exportValue) return c.exportValue(row);
  const raw = row[c.key];
  return raw == null ? "" : String(raw);
}

/** Columns that carry data (action/render-only columns are excluded). */
function exportColumns<T extends Record<string, unknown>>(columns: ColumnDef<T>[]): ColumnDef<T>[] {
  return columns.filter((c) => !c.noExport && !(c.render && !c.exportValue && c.key === "actions"));
}

function toCsv<T extends Record<string, unknown>>(columns: ColumnDef<T>[], rows: T[]): string {
  const cols = exportColumns(columns);
  const header = cols.map((c) => `"${c.header}"`).join(",");
  const body = rows
    .map((row) => cols.map((c) => `"${cellValue(c, row).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A real Excel-openable workbook (SpreadsheetML/HTML-table that Excel imports natively). */
function toXlsHtml<T extends Record<string, unknown>>(columns: ColumnDef<T>[], rows: T[]): string {
  const cols = exportColumns(columns);
  const head = cols.map((c) => `<th>${escapeHtml(c.header)}</th>`).join("");
  const body = rows
    .map((row) => `<tr>${cols.map((c) => `<td>${escapeHtml(cellValue(c, row))}</td>`).join("")}</tr>`)
    .join("");
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><table border="1"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`;
}

interface TCListPageProps<T extends Record<string, unknown>> {
  title: string;
  columns: ColumnDef<T>[];
  data: T[];
  /** Keys used for the free-text search. Defaults to all string columns. */
  searchKeys?: string[];
  /** Optional action button rendered on the right of the title bar. */
  action?: React.ReactNode;
  fileName?: string;
  /** Message shown when the table has no rows. */
  emptyLabel?: React.ReactNode;
}

export function TCListPage<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  searchKeys,
  action,
  fileName = "treatment-centre-export",
  emptyLabel,
}: TCListPageProps<T>) {
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");

  const keys = searchKeys ?? columns.map((c) => c.key);
  const filtered = query.trim()
    ? data.filter((row) =>
        keys.some((k) => String(row[k] ?? "").toLowerCase().includes(query.toLowerCase())),
      )
    : data;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toCsv(columns, filtered));
      toast("Copied table to clipboard.", "success");
    } catch {
      toast("Copy failed — clipboard unavailable.", "warning");
    }
  };

  const handleDownload = (format: "csv" | "xls") => {
    const isXls = format === "xls";
    const blob = new Blob([isXls ? toXlsHtml(columns, filtered) : toCsv(columns, filtered)], {
      type: isXls
        ? "application/vnd.ms-excel;charset=utf-8;"
        : "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${format}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`Exported ${filtered.length} rows.`, "success");
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Navy title bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy px-5 py-3.5 text-white">
        <h1 className="text-headline-1">{title}</h1>
        {action}
      </div>

      {/* Table card — white card with shadow, matching the training-page pattern */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md">

        {/* Toolbar: search left · export right */}
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
          <div className="flex-1 min-w-0 max-w-xs">
            <Search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label={`Search ${title}`}
            />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={`Copy ${title} table to clipboard`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-label-2 font-semibold text-ink-muted transition-colors hover:bg-surface-muted"
            >
              <Icon name="content_copy" size={14} aria-hidden /> Copy
            </button>
            <button
              type="button"
              onClick={() => handleDownload("xls")}
              aria-label={`Export ${title} as an Excel spreadsheet`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-label-2 font-semibold text-ink-muted transition-colors hover:bg-surface-muted"
            >
              <Icon name="table_chart" size={14} aria-hidden /> Excel
            </button>
            <button
              type="button"
              onClick={() => handleDownload("csv")}
              aria-label={`Export ${title} as CSV`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-label-2 font-semibold text-ink-muted transition-colors hover:bg-surface-muted"
            >
              <Icon name="description" size={14} aria-hidden /> CSV
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          total={filtered.length}
          caption={title}
          emptyLabel={query.trim() ? `No results for "${query}".` : emptyLabel}
        />

      </div>
    </div>
  );
}
