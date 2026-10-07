/**
 * The NAPDDR cost sheet, Statement of Account and amount pipeline (cost-sheet.ts), against the
 * Department's printed IRCA norms and the three defects the dev portal's walkthrough of 07 Oct 2026
 * showed: both either/or doctors counted, a "total recommended grant" of one head, and a typed balance.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  amountPipeline,
  balanceAfter,
  defaultSchedule,
  normLines,
  schedulesFor,
  seedSheet,
  sheetProblems,
  sheetTotals,
  statementProblems,
  type CostScheduleId,
} from "./cost-sheet.ts";
import { buildSeed } from "./store/seed.ts";
import type { GrantApplication } from "./types.ts";

const money = (n: number) => `₹${n}`;
const sum = (xs: readonly { norm: number }[]) => xs.reduce((s, l) => s + l.norm, 0);

test("the IRCA schedules add up to the totals the Department printed", () => {
  // Total-A Urban (staff, part-time urban doctor) + Total B + non-recurring, per bed size.
  const printed: Record<"IRCA-15" | "IRCA-30" | "IRCA-50", { urban: number; nonRecurring: number }> = {
    "IRCA-15": { urban: 3546000, nonRecurring: 245000 },
    "IRCA-30": { urban: 5134900, nonRecurring: 320000 },
    "IRCA-50": { urban: 6988300, nonRecurring: 395000 },
  };
  for (const [id, want] of Object.entries(printed) as [CostScheduleId, { urban: number; nonRecurring: number }][]) {
    const lines = normLines(id);
    const recurring = lines.filter((l) => l.head === "recurring" && (!l.choice || l.choice.option === "Part Time, Urban"));
    assert.equal(sum(recurring), want.urban, `${id} recurring (urban)`);
    assert.equal(sum(lines.filter((l) => l.head === "nonRecurring")), want.nonRecurring, `${id} non-recurring`);
  }
});

test("the DDAC sheet carries the dev portal's figures", () => {
  const lines = normLines("DDAC");
  assert.equal(sum(lines.filter((l) => l.head === "nonRecurring")), 345000);
  // ₹77,24,000 on the dev portal counted BOTH doctors; one of them is ₹70,04,000 or ₹70,64,000.
  assert.equal(sum(lines.filter((l) => l.head === "recurring")), 7724000);
  assert.equal(sum(lines.filter((l) => l.head === "recurring" && l.choice?.option !== "Rural")), 7004000);
});

const app = (over: Partial<GrantApplication> = {}): GrantApplication =>
  ({
    id: "GIA/2026-27/NAPDDR/X/1", schemeCode: "NAPDDR", caseType: "New", recurring: 7200000, nonRecurring: 400000, total: 7600000,
    totalBeneficiaries: 15, formValues: { fld_project_type: "DDAC — District De-Addiction Centre" }, audit: [], ...over,
  }) as GrantApplication;

test("an either/or post counts only once chosen, and the sheet cannot be saved before", () => {
  const sheet = seedSheet("DDAC");
  const before = sheetTotals(sheet, app());
  assert.equal(before.recurring.norm, 7724000 - 720000 - 660000, "neither doctor counts yet");
  assert.match(sheetProblems(sheet, app(), money)[0]!.message, /Choose which Doctor post applies/);
  const urban = sheet.lines.find((l) => l.choice?.option === "Urban")!;
  const after = sheetTotals({ ...sheet, choices: { doctor: urban.id } }, app());
  assert.equal(after.recurring.norm, 7004000);
  assert.deepEqual(sheetProblems({ ...sheet, choices: { doctor: urban.id } }, app(), money), []);
});

test("the recommended grant is both heads, and each head is capped at the lower of norm and claim", () => {
  const sheet = seedSheet("DDAC");
  sheet.choices = { doctor: sheet.lines.find((l) => l.choice?.option === "Rural")!.id };
  const t = sheetTotals(sheet, app({ recurring: 7000000, nonRecurring: 400000 }));
  assert.equal(t.proposed, 7064000 + 345000, "never the non-recurring total alone");
  assert.equal(t.recurring.admissible, 7000000, "the claim is lower than the norm");
  assert.equal(t.nonRecurring.admissible, 345000, "the norm is lower than the claim");
  assert.equal(t.recurring.over, 64000);
  assert.match(sheetProblems(sheet, app({ recurring: 7000000 }), money).at(-1)!.message, /Recurring items are ₹64000 above the admissible ₹7000000/);
});

test("a removed item leaves the totals; an added one with no name cannot be saved", () => {
  const sheet = seedSheet("IRCA-15");
  sheet.choices = { doctor: sheet.lines.find((l) => l.choice?.option === "Part Time, Urban")!.id };
  const peer = sheet.lines.find((l) => l.label.startsWith("Peer Educator"))!;
  peer.removed = true;
  const t = sheetTotals(sheet, app({ recurring: 9000000 }));
  assert.equal(t.recurring.norm, 3546000 - 120000);
  sheet.lines.push({ id: "x", head: "recurring", label: " ", norm: 0, proposed: 5000, added: true });
  assert.ok(sheetProblems(sheet, app({ recurring: 9000000 }), money).some((p) => p.message === "Name the item you added."));
});

test("the balance after this release is computed, and a release beyond it is refused", () => {
  assert.equal(balanceAfter({ allocation: 25000000, expenditure: 16240000 }, 3790000), 4970000);
  assert.deepEqual(statementProblems({ allocation: "25000000", expenditure: "16240000" }, 3790000, money), {});
  assert.ok(statementProblems({ allocation: "1000", expenditure: "2000" }, 0, money).expenditure);
  assert.match(statementProblems({ allocation: "100", expenditure: "50" }, 60, money).balance!, /more than the ₹50 left/);
  assert.ok(statementProblems({ allocation: "", expenditure: "" }, 0, money).allocation);
});

test("schedules: a DDAC has one, a general IRCA three by bed size, other projects none", () => {
  assert.deepEqual(schedulesFor(app()), ["DDAC"]);
  const ircaApp = app({ formValues: { fld_project_type: "IRCA — Integrated Rehabilitation Centre" }, totalBeneficiaries: 30 });
  assert.deepEqual(schedulesFor(ircaApp), ["IRCA-15", "IRCA-30", "IRCA-50"]);
  assert.equal(defaultSchedule(ircaApp), "IRCA-30");
  assert.deepEqual(schedulesFor(app({ formValues: { fld_project_type: "IRCA — Female" } })), []);
  assert.deepEqual(schedulesFor(app({ caseType: "Ongoing" })), []);
  assert.deepEqual(schedulesFor(app({ schemeCode: "AVYAY" })), []);
});

test("the pipeline: proposed is current until the ASO saves; later stages follow the file", () => {
  const fresh = amountPipeline(app())!;
  assert.deepEqual(fresh.map((s) => s.state), ["current", "upcoming", "upcoming", "upcoming"]);
  assert.equal(amountPipeline(app({ schemeCode: "SHRESHTA_M2" })), null);
});

/* ── The seed ─────────────────────────────────────────────────────────────── */

const seed = buildSeed();
const atAso = seed.applications.filter((a) => a.schemeCode === "NAPDDR" && a.holder.kind === "chain" && a.holder.division === "pd" && a.holder.grade === "aso");

test("the ASO's NAPDDR files are a DDAC and a 30-bed IRCA, each with NAPDDR's own documents", () => {
  const types = atAso.map((a) => a.formValues?.fld_project_type).sort();
  assert.deepEqual(types, ["DDAC — District De-Addiction Centre", "IRCA — Integrated Rehabilitation Centre"]);
  for (const a of atAso) {
    assert.equal(a.documents.length, 12, a.id);
    assert.ok(!a.documents.some((d) => /School/.test(d.title)), `${a.id} carries a school's document`);
    assert.equal(a.formValues?.fld_total_beneficiaries, String(a.totalBeneficiaries), a.id);
    assert.equal(a.formValues?.fld_grant_total, String(a.total), a.id);
    assert.ok(!a.costSheet && !a.budgetStatement, "the ASO has not costed it yet");
  }
});

test("the costed file further up shows its pipeline done to the Joint Secretary", () => {
  const costed = seed.applications.find((a) => a.schemeCode === "NAPDDR" && a.costSheet)!;
  assert.ok(costed, "a costed NAPDDR file is seeded");
  const stages = amountPipeline(costed)!;
  assert.deepEqual(stages.map((s) => s.state), ["done", "done", "current", "upcoming"]);
  assert.equal(stages[0]!.amount, 3510000 + 245000);
  assert.equal(costed.budgetStatement!.release, stages[0]!.amount);
});
