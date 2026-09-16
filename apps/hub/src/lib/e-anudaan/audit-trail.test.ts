// The Audit Trail's search, filters, date range and download, and the Reports totals and charts
// (design-director audit A-01 and RP-01, 16 Sep 2026). An auditor must be able to find one file's
// trail, and the file they download must be the rows they were shown.
//
// Run: node --test src/lib/e-anudaan/audit-trail.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";

import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import type { EAnudaanState } from "./types.ts";
import {
  AUDIT_OFFICES,
  NO_AUDIT_FILTERS,
  activeAuditFilterCount,
  auditFilterOptions,
  auditOfficeOf,
  auditTrail,
  filterAuditTrail,
  istDay,
  officerApplications,
} from "./registers.ts";
import { REPORTS, auditTrailCsv, formatCell, reportById, reportTotals } from "./reports.ts";
import { formatDate } from "./format.ts";

function state(): EAnudaanState {
  return { version: 11, session: null, schemes: SEED_SCHEMES, ...buildSeed() };
}

test("the audit trail lists every recorded action once, newest first", () => {
  const s = state();
  const rows = auditTrail(s);
  assert.equal(rows.length, s.applications.reduce((k, a) => k + a.audit.length, 0));
  assert.equal(new Set(rows.map((r) => r.id)).size, rows.length, "ids are unique");
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i - 1]!.at >= rows[i]!.at, "newest first");
  assert.ok(rows.every((r) => AUDIT_OFFICES.includes(r.office)), "every row belongs to a known office");
  assert.ok(rows.every((r) => !/[a-z][A-Z]/.test(r.action)), "no stored action key reaches the screen");
});

test("with no filter set, every row passes and nothing counts as filtered", () => {
  const rows = auditTrail(state());
  assert.equal(activeAuditFilterCount(NO_AUDIT_FILTERS), 0);
  assert.equal(filterAuditTrail(rows, NO_AUDIT_FILTERS).length, rows.length);
});

test("search finds one file's whole trail by application number, project ID or NGO", () => {
  const s = state();
  const rows = auditTrail(s);
  const app = s.applications.find((a) => a.audit.length > 2)!;
  const byApp = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, q: app.id.toLowerCase() });
  assert.equal(byApp.length, app.audit.length);
  assert.ok(byApp.every((r) => r.application === app.id));

  const byProject = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, q: app.institutionId });
  assert.ok(byProject.some((r) => r.application === app.id));
  assert.ok(byProject.every((r) => r.project === app.institutionId));

  const ngo = s.ngos.find((n) => n.id === app.ngoId)!;
  const byNgo = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, q: `  ${ngo.name.toUpperCase()} ` });
  assert.ok(byNgo.length >= app.audit.length);
  assert.ok(byNgo.every((r) => r.ngoId === ngo.id || r.remarks.toLowerCase().includes(ngo.name.toLowerCase()) || r.user.toLowerCase().includes(ngo.name.toLowerCase())));

  assert.equal(filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, q: "zzqx-no-such-file" }).length, 0);
  assert.equal(activeAuditFilterCount({ ...NO_AUDIT_FILTERS, q: "zzqx" }), 1);
  assert.equal(activeAuditFilterCount({ ...NO_AUDIT_FILTERS, q: "   " }), 0, "whitespace is not a search");
});

test("office, seat and action filters narrow, and combine", () => {
  const rows = auditTrail(state());
  const ifd = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, office: "Integrated Finance Division" });
  assert.ok(ifd.length > 0 && ifd.length < rows.length);
  assert.ok(ifd.every((r) => r.roleId.startsWith("finance-")));

  const seat = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, role: "pd-aso" });
  assert.ok(seat.length > 0 && seat.every((r) => r.roleId === "pd-aso"));

  const forwarded = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, action: "forward" });
  assert.ok(forwarded.length > 0 && forwarded.every((r) => r.actionKey === "forward"));

  const both = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, office: "Integrated Finance Division", action: "forward" });
  assert.equal(both.length, ifd.filter((r) => r.actionKey === "forward").length);
  assert.equal(activeAuditFilterCount({ ...NO_AUDIT_FILTERS, office: "Integrated Finance Division", action: "forward" }), 2);

  // A seat outside the chosen office matches nothing — the menus prevent it, the filter does not lie about it.
  assert.equal(filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, office: "Programme Division", role: "finance-js" }).length, 0);
});

test("the seat menu offers only seats in the chosen office, and only actions that occur", () => {
  const rows = auditTrail(state());
  const all = auditFilterOptions(rows);
  assert.ok(all.roles.length > 0 && all.actions.length > 0);
  for (const a of all.actions) assert.ok(rows.some((r) => r.actionKey === a.value), `${a.value} occurs`);
  const pd = auditFilterOptions(rows, "Programme Division");
  assert.ok(pd.roles.length > 0 && pd.roles.every((r) => r.value.startsWith("pd-")));
  assert.equal(auditOfficeOf("programme-director"), "Programme Director");
  assert.equal(auditOfficeOf("pmu-field"), "PMU");
  assert.equal(auditOfficeOf("ngo"), "NGO");
});

test("the date range is inclusive, read in India Standard Time, and forgiving of reversed ends", () => {
  const rows = auditTrail(state());
  // An instant after 18:30 UTC is the next day in India — the day formatDate prints.
  assert.equal(istDay("2026-08-10T19:00:00.000Z"), "2026-08-11");
  assert.equal(istDay("2026-08-10T18:00:00.000Z"), "2026-08-10");
  assert.ok(rows.every((r) => formatDate(r.at) === formatDate(r.day)), "the range compares the date the screen shows");

  const day = rows[Math.floor(rows.length / 2)]!.day;
  const one = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, from: day, to: day });
  assert.ok(one.length > 0 && one.every((r) => r.day === day));
  assert.equal(one.length, rows.filter((r) => r.day === day).length);

  const since = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, from: day });
  assert.ok(since.every((r) => r.day >= day));
  const until = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, to: day });
  assert.ok(until.every((r) => r.day <= day));
  assert.equal(since.length + until.length - one.length, rows.length, "from and to split the log with the day in both");

  const earliest = rows.at(-1)!.day;
  const forward = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, from: earliest, to: day });
  const reversed = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, from: day, to: earliest });
  assert.deepEqual(reversed, forward);
  assert.equal(activeAuditFilterCount({ ...NO_AUDIT_FILTERS, from: earliest, to: day }), 1, "a range is one filter");
  assert.equal(filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, from: "2099-01-01" }).length, 0);
});

test("the download is exactly the filtered rows, with exact figures and quoted remarks", () => {
  const s = state();
  const rows = auditTrail(s);
  const app = s.applications.find((a) => a.audit.length > 2)!;
  const shown = filterAuditTrail(rows, { ...NO_AUDIT_FILTERS, q: app.id });
  const lines = auditTrailCsv(shown).split("\n");
  assert.equal(lines[0], "Timestamp,Application,Project ID,NGO,User,Role,Action,Remarks");
  assert.equal(lines.length, shown.length + 1);
  assert.ok(lines.slice(1).every((l) => l.includes(app.id)));
  // "11 Aug 2026, 12:22 PM" carries a comma, so the timestamp cell is quoted rather than split.
  assert.ok(lines.slice(1).every((l, i) => l.startsWith(`"${formatCell(shown[i]!.at, "datetime")}",`)));
  // An empty filtered set is a header and nothing else, never a stale page.
  assert.equal(auditTrailCsv([]), lines[0]);
  // The Audit Log report and the Audit Trail download share one set of columns.
  assert.equal(reportById("audit-log")!.columns.map((c) => c.header).join(","), lines[0]);
});

/* ── Reports: totals and charts ──────────────────────────────────────────── */

test("each report's totals and chart are read from the rows the table lists", () => {
  const s = state();
  const now = new Date("2026-09-16T00:00:00Z");
  for (const r of REPORTS) {
    const rows = r.rows(s, { scheme: "", fy: "", ngo: "" }, now);
    assert.ok(r.noun && r.pluralNoun, `${r.id}: names its rows`);
    const totals = reportTotals(r, rows);
    for (const t of totals) assert.equal(t.value, rows.reduce((k, row) => k + Number(row[t.key] ?? 0), 0), `${r.id}.${t.key}`);
    const chart = r.chart(rows);
    assert.ok(chart.title, `${r.id}: chart titled`);
    assert.ok(chart.items.every((i) => Number.isFinite(i.value) && i.label), `${r.id}: chart items`);
  }
  const ngo = reportById("ngo-applications")!;
  const rows = ngo.rows(s, { scheme: "", fy: "", ngo: "" }, now);
  const sanctioned = reportTotals(ngo, rows).find((t) => t.key === "sanctionedAmount")!;
  assert.equal(sanctioned.value, officerApplications(s).reduce((k, a) => k + (a.sanction?.total ?? 0), 0));
  // A longest wait does not add up.
  assert.ok(!reportTotals(reportById("pending-by-role")!, []).some((t) => t.key === "oldest"));
});

test("report money cells use the summary form, as every other screen does", () => {
  assert.equal(formatCell(222797125, "money"), "₹22.28 Cr");
  assert.equal(formatCell(4800000, "money"), "₹48.00 L");
  assert.equal(formatCell(0, "money"), "₹0");
  assert.equal(formatCell(null, "money"), "—");
});
