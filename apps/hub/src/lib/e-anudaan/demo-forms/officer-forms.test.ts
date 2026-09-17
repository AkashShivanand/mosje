/**
 * The officer forms' demo presets against the rules the forms enforce (officer-forms.ts): the
 * correct fill trips none, and each rule preset trips exactly the rule it is named for — and a
 * different one from every other preset of its form.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { FORMS, formsForPath, type DemoFormDef, type DemoFormPreset } from "./index.ts";
import { resolveDate, resolveSanction } from "./officer-values.ts";
import { RULES } from "../workflow.ts";
import {
  changeDecisionError,
  decisionProblems,
  inspectionReportErrors,
  inspectionScheduleError,
  onlineInspectionError,
  queryResponseError,
  showCauseError,
} from "../officer-forms.ts";
import { REVIEW_DEFICIENCY } from "./review-deficiency.ts";
import { REVIEW_FORWARD } from "./review-forward.ts";
import { REVIEW_REJECT } from "./review-reject.ts";
import { REVIEW_RESPOND } from "./review-respond.ts";
import { REVIEW_RETURN_DIRECTOR } from "./review-return-director.ts";
import { REVIEW_RETURN_PREVIOUS } from "./review-return-previous.ts";
import { REVIEW_SANCTION } from "./review-sanction.ts";
import { REVIEW_SEND_DEFICIENCY } from "./review-send-deficiency.ts";
import { SHOW_CAUSE_NOTICE } from "./show-cause-notice.ts";
import { ONLINE_INSPECTION } from "./online-inspection.ts";
import { INSPECTION_SCHEDULE } from "./inspection-schedule.ts";
import { INSPECTION_REPORT } from "./inspection-report.ts";
import { BANK_CHANGE_APPROVE, BANK_CHANGE_REFUSE, LOCATION_CHANGE_APPROVE, LOCATION_CHANGE_REFUSE } from "./change-request-decisions.ts";
import { QUERY_RESPONSE } from "./query-response.ts";

// Late in the UTC day, so "today at 00:00" is in the past in every time zone the test may run in.
const NOW = "2026-09-17T23:00:00.000Z";
const TODAY = NOW.slice(0, 10);
/** A file sought at ₹48,00,000 whose cost norms admit ₹40,00,000. */
const FILE = { recurring: 4_000_000, nonRecurring: 800_000, norm: { recurring: 3_500_000, nonRecurring: 500_000, total: 4_000_000 } };

/** The rules a preset trips, by name. */
type Tripped = string[];

function decisionTrips(v: Readonly<Record<string, string>>): Tripped {
  const rule = RULES.find((r) => r.action === v.decision);
  assert.ok(rule, `no rule for ${v.decision}`);
  const amounts = resolveSanction(v, FILE);
  // What the review screen sends: the marked document's reason, or the remarks as a clarification.
  const items =
    v.mark === "with-reason"
      ? [{ remark: v.markReason ?? "" }]
      : v.mark === "without-reason"
        ? [{ remark: "" }]
        : (v.remarks ?? "").trim()
          ? [{ remark: v.remarks! }]
          : [];
  const p = decisionProblems(rule, {
    remarks: v.remarks ?? "",
    recurring: amounts.recurring,
    nonRecurring: amounts.nonRecurring,
    sought: FILE.recurring + FILE.nonRecurring,
    items,
  });
  const out = Object.keys(p).filter((k) => p[k as keyof typeof p]);
  if (rule.action === "sanction" && Number(amounts.recurring) + Number(amounts.nonRecurring) > FILE.norm.total) out.push("aboveNorm");
  if (rule.action === "forward" && v.mark) out.push("forwardOverMarked");
  return out;
}

const at = (date: string, time: string) => (date && time ? new Date(`${date}T${time}:00`).toISOString() : "");

const TRIPS: [DemoFormDef, (v: Readonly<Record<string, string>>) => Tripped, Record<string, string | string[]>][] = [
  [REVIEW_FORWARD, decisionTrips, { "no-remarks": "remarks", marked: "forwardOverMarked" }],
  [REVIEW_RETURN_PREVIOUS, decisionTrips, { "no-remarks": "remarks" }],
  [REVIEW_DEFICIENCY, decisionTrips, { "no-remarks": "remarks", "no-reason": "deficiency" }],
  [REVIEW_SEND_DEFICIENCY, decisionTrips, { "no-message": "remarks" }],
  [REVIEW_RESPOND, decisionTrips, { "no-response": "remarks" }],
  [REVIEW_RETURN_DIRECTOR, decisionTrips, { "no-reason": "remarks" }],
  [REVIEW_REJECT, decisionTrips, { "no-reason": "remarks" }],
  [
    REVIEW_SANCTION,
    decisionTrips,
    { "no-remarks": "remarks", "no-amount": "sanction", // Above the amount sought is above the norms too, and the screen states both: they are different facts.
    "above-sought": ["sanction", "aboveNorm"], nil: "sanction", "above-norm": "aboveNorm" },
  ],
  [
    SHOW_CAUSE_NOTICE,
    (v) => {
      const e = showCauseError({ grounds: v.grounds ?? "", respondBy: resolveDate(v.respondBy, TODAY) || undefined }, NOW);
      return e ? [e] : [];
    },
    { "no-grounds": "State the grounds for the notice.", "deadline-today": "The response deadline must be a date after today." },
  ],
  [
    ONLINE_INSPECTION,
    (v) => {
      const date = resolveDate(v.date, TODAY);
      const e = onlineInspectionError({ title: v.title ?? "", startsAt: at(date, v.start ?? ""), endsAt: at(date, v.end ?? "") }, NOW);
      return e ? [e] : [];
    },
    {
      "no-title": "Give the inspection a title.",
      "no-date": "Enter the start date and time.",
      "past-start": "The start must be later than now.",
      "end-before-start": "The end must be later than the start.",
    },
  ],
  [
    INSPECTION_SCHEDULE,
    (v) => {
      const e = inspectionScheduleError(resolveDate(v.date, TODAY));
      return e ? [e] : [];
    },
    { "no-date": "Choose the date of the visit." },
  ],
  [
    INSPECTION_REPORT,
    (v) => Object.keys(inspectionReportErrors({ findings: v.findings ?? "", recommendation: v.recommendation ?? "" })),
    { "no-findings": "findings", "no-recommendation": "recommendation" },
  ],
  ...[BANK_CHANGE_APPROVE, BANK_CHANGE_REFUSE, LOCATION_CHANGE_APPROVE, LOCATION_CHANGE_REFUSE].map(
    (form) =>
      [
        form,
        (v: Readonly<Record<string, string>>) => {
          const e = changeDecisionError(v.remarks ?? "");
          return e ? [e] : [];
        },
        { "no-remarks": "Enter your remarks before deciding." },
      ] as (typeof TRIPS)[number],
  ),
  [
    QUERY_RESPONSE,
    (v) => {
      const e = queryResponseError(v.response ?? "");
      return e ? [e] : [];
    },
    { "no-response": "Write your response to the query." },
  ],
];

test("every officer form is registered and tested here", () => {
  const officer = TRIPS.map(([f]) => f.id);
  for (const id of officer) assert.ok(FORMS.some((f) => f.id === id), `${id} is not in FORMS`);
});

for (const [form, trips, expected] of TRIPS) {
  test(`${form.title}: the correct fill passes and each rule preset trips exactly its rule`, () => {
    const valid = form.presets.find((p: DemoFormPreset) => p.valid)!;
    assert.deepEqual(trips(valid.values), [], `${form.id} · correct fill trips a rule`);
    const rules = form.presets.filter((p) => !p.valid);
    assert.deepEqual(rules.map((p) => p.id).sort(), Object.keys(expected).sort(), `${form.id}: every rule preset has an expectation`);
    for (const p of rules) assert.deepEqual(trips(p.values), [expected[p.id]].flat(), `${form.id} · ${p.id}`);
    assert.equal(new Set(rules.map((p) => `${expected[p.id]}|${JSON.stringify(p.values)}`)).size, rules.length);
  });
}

test("the officer forms are offered on their own screens", () => {
  const review = formsForPath("/portals/e-anudaan/dashboard/sm2/pd/review/GIA%2F2026-27%2FSHRESHTA_M2%2FAHMEDABAD%2F00944").map((f) => f.id);
  assert.ok(review.includes("review-sanction") && review.includes("show-cause-notice") && review.includes("online-inspection"));
  assert.deepEqual(formsForPath("/portals/e-anudaan/dashboard/pmu/field").map((f) => f.id), ["inspection-schedule", "inspection-report"]);
  assert.deepEqual(formsForPath("/portals/e-anudaan/dashboard/sm2/bank-changes").map((f) => f.id), ["bank-change-approve", "bank-change-refuse"]);
  assert.deepEqual(formsForPath("/portals/e-anudaan/dashboard/finance/us/queries").map((f) => f.id), ["query-response"]);
  assert.deepEqual(formsForPath("/portals/e-anudaan/dashboard/sm2/pd"), []);
});

test("preset dates and amounts resolve against the day and the file", () => {
  assert.equal(resolveDate("+15", "2026-09-17"), "2026-10-02");
  assert.equal(resolveDate("today", "2026-09-17"), "2026-09-17");
  assert.deepEqual(resolveSanction({ recurring: "above-norm", nonRecurring: "sought" }, FILE), { recurring: "3300000", nonRecurring: "800000" });
  assert.deepEqual(resolveSanction({ recurring: "above-norm", nonRecurring: "sought" }, { ...FILE, norm: null }), { recurring: "4000000", nonRecurring: "800000" });
  assert.deepEqual(resolveSanction({ recurring: "admissible", nonRecurring: "admissible" }, FILE), { recurring: "3500000", nonRecurring: "500000" });
  assert.deepEqual(resolveSanction({ recurring: "admissible", nonRecurring: "admissible" }, { ...FILE, norm: null }), { recurring: "4000000", nonRecurring: "800000" });
});
