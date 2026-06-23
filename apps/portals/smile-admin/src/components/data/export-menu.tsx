"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveRegion, useLiveRegion } from "@/components/ui/live-region";
import { exportToCSV, exportToPDF, type ExportColumn } from "@/lib/export";

interface ExportMenuProps<Row> {
  filename: string;
  title: string;
  subtitle?: string;
  columns: ExportColumn<Row>[];
  rows: Row[];
  /** Hide individual buttons if needed. */
  formats?: Array<"csv" | "pdf">;
  size?: "xs" | "sm" | "md";
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
          variant="outline"
          size={size}
          onClick={onCSV}
          aria-label={`Export ${title} as CSV (${rows.length} ${rows.length === 1 ? "record" : "records"})`}
        >
          <FileSpreadsheet aria-hidden className="h-3.5 w-3.5 text-success-600" />
          CSV
        </Button>
      ) : null}
      {formats.includes("pdf") ? (
        <Button
          variant="outline"
          size={size}
          onClick={onPDF}
          aria-label={`Export ${title} as PDF (${rows.length} ${rows.length === 1 ? "record" : "records"})`}
        >
          <FileText aria-hidden className="h-3.5 w-3.5 text-danger-600" />
          PDF
        </Button>
      ) : null}
    </div>
  );
}
