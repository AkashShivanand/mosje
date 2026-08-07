"use client";

import { exportToCSV, exportToPDF, type ExportColumn } from "@/lib/smile-admin/export";
import { Button, Icon, LiveRegion, type ButtonSize, useLiveRegion } from "@mosje/design-system";

interface ExportMenuProps<Row> {
  filename: string;
  title: string;
  subtitle?: string;
  columns: ExportColumn<Row>[];
  rows: Row[];
  /** Hide individual buttons if needed. */
  formats?: Array<"csv" | "pdf">;
  /** Forwarded to the DS Button. No call site overrides it today. */
  size?: ButtonSize;
}

export function ExportMenu<Row>({
  filename,
  title,
  subtitle,
  columns,
  rows,
  formats = ["csv", "pdf"],
  size = "sm",
}: ExportMenuProps<Row>) {
  const { ref: liveRef, announce } = useLiveRegion();

  const onCSV = () => {
    exportToCSV({ filename, columns, rows });
    announce(`Downloaded ${rows.length} ${rows.length === 1 ? "record" : "records"} as CSV.`);
  };

  const onPDF = () => {
    exportToPDF({ title, subtitle, columns, rows });
    announce(`Prepared PDF print view with ${rows.length} ${rows.length === 1 ? "record" : "records"}.`);
  };

  return (
    <div className="flex items-center gap-xs">
      <LiveRegion ref={liveRef} />
      {formats.includes("csv") ? (
        <Button
          appearance="outlined"
          size={size}
          onClick={onCSV}
          aria-label={`Export ${title} as CSV (${rows.length} ${rows.length === 1 ? "record" : "records"})`}
        >
          <Icon name="table_chart" size={14} aria-hidden className="text-success-600" />
          CSV
        </Button>
      ) : null}
      {formats.includes("pdf") ? (
        <Button
          appearance="outlined"
          size={size}
          onClick={onPDF}
          aria-label={`Export ${title} as PDF (${rows.length} ${rows.length === 1 ? "record" : "records"})`}
        >
          <Icon name="description" size={14} aria-hidden className="text-danger-600" />
          PDF
        </Button>
      ) : null}
    </div>
  );
}
