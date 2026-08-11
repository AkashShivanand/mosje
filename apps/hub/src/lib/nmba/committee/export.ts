// Consolidated report builders + .XLS / .PDF exporters (requirement item 7).
// XLS uses an HTML-table Blob (Excel opens it) — same dependency-free approach
// as the Treatment-Centre export. PDF uses jsPDF + autotable, loaded lazily so
// it never runs on the server.

import type { CommitteeRecord } from "./types";
import { tierLabel } from "./session";

// jsPDF autoTable needs a raw numeric RGB triplet (it can't read CSS vars).
// Kept traceable to the brand token: primary #0373DF.
const GOV_BLUE_RGB: [number, number, number] = [3, 115, 223];

const COMMITTEE_HEADERS = [
  "Tier",
  "State",
  "District",
  "Block",
  "Chairperson / Chief Secretary",
  "Designation",
  "Member Secretary",
  "Nodal Department",
  "Date of Formation",
  "No. of Members",
  "Notification File",
  "Minutes Uploaded",
];

const MINUTES_HEADERS = ["Committee", "State", "District", "Block", "Meeting Date", "Minutes File"];

function committeeRows(records: CommitteeRecord[]): string[][] {
  return records.map((r) => [
    tierLabel(r.tier),
    r.state,
    r.district ?? "—",
    r.block ?? "—",
    r.chiefSecretaryName ?? r.chairpersonName ?? "—",
    r.chairpersonDesignation ?? "—",
    r.memberSecretaryName ?? "—",
    r.nodalDepartment ?? "—",
    r.formationDate,
    String(r.memberCount),
    r.notification.name,
    String(r.minutes.length),
  ]);
}

function minutesRows(records: CommitteeRecord[]): string[][] {
  const rows: string[][] = [];
  for (const r of records) {
    for (const m of r.minutes) {
      rows.push([
        m.committeeName,
        r.state,
        r.district ?? "—",
        r.block ?? "—",
        m.meetingDate,
        m.file.name,
      ]);
    }
  }
  return rows;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function htmlTable(title: string, headers: string[], rows: string[][]): string {
  const head = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const body = rows.length
    ? rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${headers.length}">No records</td></tr>`;
  return `<h3>${escapeHtml(title)}</h3><table border="1"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Download a consolidated .XLS of committee notifications + meeting minutes. */
export function exportXls(records: CommitteeRecord[], scopeLabel: string): void {
  const html =
    `<html><head><meta charset="utf-8"></head><body>` +
    `<h2>NAPDDR Three-Tier Committee Report — ${escapeHtml(scopeLabel)}</h2>` +
    htmlTable("Committee Notifications", COMMITTEE_HEADERS, committeeRows(records)) +
    htmlTable("Meeting Minutes", MINUTES_HEADERS, minutesRows(records)) +
    `</body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  triggerDownload(blob, `napddr-committee-report-${slug(scopeLabel)}.xls`);
}

/** Download a consolidated .PDF of committee notifications + meeting minutes. */
export async function exportPdf(records: CommitteeRecord[], scopeLabel: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFontSize(14);
  doc.text(`NAPDDR Three-Tier Committee Report — ${scopeLabel}`, 40, 40);

  autoTable(doc, {
    startY: 60,
    head: [COMMITTEE_HEADERS],
    body: committeeRows(records),
    styles: { fontSize: 7, cellPadding: 3 },
    headStyles: { fillColor: GOV_BLUE_RGB },
    margin: { left: 40, right: 40 },
  });

  const afterFirst = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
  const startY = afterFirst ? afterFirst.finalY + 30 : 60;
  doc.setFontSize(12);
  doc.text("Meeting Minutes", 40, startY - 10);
  autoTable(doc, {
    startY,
    head: [MINUTES_HEADERS],
    body: minutesRows(records),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: GOV_BLUE_RGB },
    margin: { left: 40, right: 40 },
  });

  doc.save(`napddr-committee-report-${slug(scopeLabel)}.pdf`);
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "all";
}
