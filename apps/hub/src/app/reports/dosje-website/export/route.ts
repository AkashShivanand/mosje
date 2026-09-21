/**
 * The register as a spreadsheet, with every issue's current status — the
 * "download the updated tracker" button. Honours the same filters as the page,
 * so what you see is what you download. CSV with a byte-order mark, so Excel
 * opens it with the Hindi and rupee characters intact.
 */

import { ISSUES } from "@/lib/website-issues/data";
import { applyFilters, parseFilters, statusOf } from "@/lib/website-issues/filters";
import { readAllStatuses } from "@/lib/website-issues/status-store";

export const dynamic = "force-dynamic";

const HEAD = ["ID", "Title", "Severity", "Category", "Who fixes it", "Scope", "Affects", "Page", "Where on the page", "What is wrong", "Steps to see it",
  "Fix", "Design tokens", "Standards failed", "Report page", "Status", "Assigned to", "Target date", "Note", "Last updated", "Updated by", "Link"];

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const statuses = (await readAllStatuses()) ?? {};
  const rows = applyFilters(ISSUES, statuses, parseFilters(Object.fromEntries(url.searchParams)));
  const lines = [HEAD.map(cell).join(",")];
  for (const i of rows) {
    const st = statuses[i.id];
    lines.push([
      i.id, i.title, i.severity, i.category, i.owner, i.scope, i.reach, i.url, i.where, i.issue,
      i.steps.map((s, n) => `${n + 1}. ${s}`).join("\n"), i.fix,
      i.tokens.map((t) => `${t.token} (${t.value})`).join("; "), i.standards.map((s) => s.label).join("; "),
      i.reportPage ?? "", statusOf(i.id, statuses), st?.assignee ?? "", st?.targetDate ?? "", st?.note ?? "",
      st?.updatedAt ?? "", st?.updatedBy ?? "", `${url.origin}/reports/dosje-website/${i.id}`,
    ].map(cell).join(","));
  }
  const date = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dosje-website-issues-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
