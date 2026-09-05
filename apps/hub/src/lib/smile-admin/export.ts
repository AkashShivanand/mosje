// Lightweight client-side data export helpers.
//
// CSV: assembles a UTF-8 CSV with BOM (for Excel), proper quoting, and triggers a download.
// PDF: opens a print-friendly window with a styled table and triggers print → "Save as PDF".
// Both work without third-party deps so the app stays lean.

export type ExportColumn<Row> = {
  header: string;
  /** Either a key on the row or a function producing the cell value. */
  accessor: keyof Row | ((row: Row) => string | number | null | undefined);
};

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function resolve<Row>(row: Row, col: ExportColumn<Row>): unknown {
  if (typeof col.accessor === "function") return col.accessor(row);
  return (row as Record<string, unknown>)[col.accessor as string];
}

export function exportToCSV<Row>({
  filename,
  columns,
  rows,
}: {
  filename: string;
  columns: ExportColumn<Row>[];
  rows: Row[];
}) {
  const header = columns.map((c) => csvEscape(c.header)).join(",");
  const body = rows
    .map((row) => columns.map((c) => csvEscape(resolve(row, c))).join(","))
    .join("\r\n");
  const csv = `﻿${header}\r\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so Safari doesn't cancel the download.
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function exportToPDF<Row>({
  title,
  subtitle,
  columns,
  rows,
}: {
  title: string;
  subtitle?: string;
  columns: ExportColumn<Row>[];
  rows: Row[];
}) {
  const win = window.open("", "_blank", "width=1024,height=768");
  if (!win) return;
  const today = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const escapeHtml = (s: unknown) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const head = columns.map((c) => `<th>${escapeHtml(c.header)}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${columns.map((c) => `<td>${escapeHtml(resolve(row, c))}</td>`).join("")}</tr>`,
    )
    .join("");

  win.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)} — SMILE Admin Export</title>
  /* ds-exempt-start(third-party): a standalone print/export window that never loads tokens.css, so a var() here resolves to nothing; sizes are the print sheet's own */
<style>
  * { box-sizing: border-box; }
  body {
    font: 12px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    margin: 24px;
  }
  header {
    border-bottom: 2px solid #003366;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }
  .brand {
    color: #003366;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 11px;
  }
  h1 { margin: 4px 0 0 0; font-size: 22px; letter-spacing: -0.01em; }
  .meta { color: #475569; margin-top: 4px; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th {
    text-align: left;
    background: #f1f5f9;
    color: #475569;
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 8px 10px;
    border-bottom: 1px solid #cbd5e1;
  }
  td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  tr:nth-child(even) td { background: #fafbfc; }
  footer { margin-top: 16px; font-size: 10px; color: #94a3b8; text-align: right; }
  @media print {
    body { margin: 12mm; }
    header { page-break-after: avoid; }
    tr { page-break-inside: avoid; }
  }
</style>
  /* ds-exempt-end */
</head>
<body>
  <header>
    <div class="brand">SMILE Beggary Rehabilitation Portal · Ministry of Social Justice &amp; Empowerment</div>
    <h1>${escapeHtml(title)}</h1>
    ${subtitle ? `<div class="meta">${escapeHtml(subtitle)}</div>` : ""}
    <div class="meta">${rows.length} records · Exported ${escapeHtml(today)}</div>
  </header>
  <table>
    <thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table>
  <footer>© 2026 MoSJE, Government of India · This is a system-generated export.</footer>
  <script>
    window.addEventListener('load', () => { setTimeout(() => { window.print(); }, 250); });
  <\/script>
</body>
</html>`);
  win.document.close();
}
