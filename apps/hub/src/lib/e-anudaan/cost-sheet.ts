/**
 * The NAPDDR cost sheet, the Statement of Account and the amount pipeline — the three things the
 * Programme Division's Assistant Section Officer adds to a NAPDDR file before forwarding it.
 *
 * What the dev portal shows (eanudaan-admin-dev, ASO-PD review, walkthrough of 07 Oct 2026):
 *   - the cost sheet opens SEEDED from the scheme's cost norm for the project type, and the ASO
 *     proposes an amount per item, adds or removes items, and saves;
 *   - a group's recommended amount may not exceed its ADMISSIBLE CEILING — the lower of the cost
 *     norm and what the NGO claimed;
 *   - the Statement of Account (budgetary allocation, expenditure to date, balance after this
 *     release) is a separate record, saved separately;
 *   - the amount then moves: proposed by the ASO, recommended by the Joint Secretary, concurred by
 *     the Integrated Finance Division, and sanctioned.
 *
 * Three things the dev portal gets wrong, which this module settles so no screen can repeat them:
 *   1. Either/or posts (a Doctor, Rural OR Urban) were both seeded, so every norm total counted two
 *      doctors until the officer deleted one. Here an either/or group is a CHOICE: nothing in the
 *      group counts until one option is chosen, and the sheet cannot be saved before then.
 *   2. "Total recommended grant" printed the non-recurring total alone (₹3,45,000 under a recurring
 *      total of ₹77,24,000). Here the grant is the sum of both heads, from one function.
 *   3. The balance after this release was a field the officer typed. It is arithmetic —
 *      allocation − expenditure − this release — so it is computed and never typed.
 *
 * SOURCES
 *   IRCA 15 / 30 / 50 beds — "Norms for setting up of a 15/30/50-bedded IRCA", Department of
 *     Social Justice & Empowerment, 2021-22 (socialjustice.gov.in/writereaddata/UploadFile/
 *     display-irca-cost-norms-2021-22.pdf). The amended (right-hand) columns. Every printed total
 *     reconciles with the lines below (cost-sheet.test.ts asserts the printed figures).
 *   DDAC — the cost sheet the E-Anudaan dev portal seeds for a District De-Addiction Centre,
 *     transcribed from the walkthrough recording of 07 Oct 2026. No published DDAC schedule is in
 *     the repository; replace these lines with the Department's own when it is supplied.
 *   IRCA — Female and IRCA — Male Children carry no schedule here: the Department's norms for them
 *     are not held, and a sheet seeded from the general IRCA's would state figures nobody published.
 */
import type { BudgetStatement, CostSheet, CostSheetLine, GrantApplication, RoleId } from "./types.ts";

/* ── Schedules ───────────────────────────────────────────────────────────── */

export type CostScheduleId = "DDAC" | "IRCA-15" | "IRCA-30" | "IRCA-50";
export type CostHead = CostSheetLine["head"];

interface NormLine {
  head: CostHead;
  label: string;
  norm: number;
  /** An either/or group, and this line's name within it. */
  choice?: { group: string; option: string };
}

const nr = (label: string, norm: number): NormLine => ({ head: "nonRecurring", label, norm });
const r = (label: string, norm: number): NormLine => ({ head: "recurring", label, norm });
const alt = (group: string, label: string, norm: number, option: string): NormLine => ({ head: "recurring", label, norm, choice: { group, option } });

/** What each either/or group is called where the officer chooses. */
export const CHOICE_GROUP_LABEL: Record<string, string> = { doctor: "Doctor" };

/** The IRCA lines every bed size shares; only the counts and the kitchen differ (see `irca`). */
function irca(beds: 15 | 30 | 50): NormLine[] {
  const by = <T,>(v: Record<15 | 30 | 50, T>) => v[beds];
  return [
    nr(`${beds} beds, tables, 3 sets of linen, blankets, office furniture, equipment, computer, refrigerator etc.`, by({ 15: 225000, 30: 300000, 50: 375000 })),
    nr("Aadhaar based Biometric Attendance System", 20000),
    r("Project Coordinator cum Vocational Counsellor — 1 post (Rs. 25,000 monthly)", 300000),
    r("Accountant cum Clerk — 1 post (Rs. 12,000 monthly)", 144000),
    r("Cook — 1 post (Rs. 10,000 monthly)", 120000),
    r("Chowkidar — 2 posts (Rs. 9,000 × 2 monthly)", 216000),
    r("House Keeping Staff, full time — 1 post (Rs. 9,000 monthly)", 108000),
    alt("doctor", "Doctor, part time, urban — 1 post (Rs. 20,000 monthly)", 240000, "Part Time, Urban"),
    alt("doctor", "Doctor, part time, rural — 1 post (Rs. 24,000 monthly)", 288000, "Part Time, Rural"),
    alt("doctor", "Doctor, full time — 1 post (Rs. 60,000 monthly), for an IRCA with outpatient treatment facilities", 720000, "Full Time, with Outpatient Facilities"),
    r(`Counsellor / Social Worker / Psychologist — ${by({ 15: 2, 30: 4, 50: 6 })} posts (Rs. 17,500 each monthly)`, by({ 15: 420000, 30: 840000, 50: 1260000 })),
    r("Yoga Therapist / Dance, Music or Art Teacher, part time — 1 post (Rs. 5,000 monthly)", 60000),
    r(`Nurse — ${by({ 15: 2, 30: 3, 50: 4 })} posts (Rs. 15,000 each monthly)`, by({ 15: 360000, 30: 540000, 50: 720000 })),
    r("Ward Boys — 2 posts (Rs. 13,000 × 2 monthly)", 312000),
    r("Peer Educator — 1 post (Rs. 10,000 monthly)", 120000),
    r(`Rent (Rs. ${by({ 15: "18,000", 30: "30,000", 50: "40,000" })} monthly)`, by({ 15: 216000, 30: 360000, 50: 480000 })),
    r(`Medicines (Rs. ${by({ 15: "14,000", 30: "28,000", 50: "46,667" })} monthly)`, by({ 15: 168000, 30: 336000, 50: 560000 })),
    r(
      `Contingencies — stationery, water, electricity, postage, telephone, maintenance and replacement of beds, linen etc. (Rs. ${by({ 15: "8,000", 30: "11,200", 50: "14,400" })} monthly)`,
      by({ 15: 96000, 30: 134400, 50: 172800 }),
    ),
    r(`Transport — petrol and maintenance of vehicle (Rs. ${by({ 15: "6,000", 30: "10,000", 50: "14,000" })} monthly)`, by({ 15: 72000, 30: 100000, 50: 168000 })),
    r(`In-house kitchen — Rs. 110 a day for 3 meals, ${beds} inmates`, by({ 15: 594000, 30: 1204500, 50: 2007500 })),
  ];
}

const DDAC: NormLine[] = [
  nr("15 beds, tables, 3 sets of linen, blankets, office furniture, almirah, equipment, computers, refrigerator etc.", 325000),
  nr("Aadhaar based Biometric Attendance System", 20000),
  r("Manager-cum-Incharge of DDAC (Rs. 40,000 monthly)", 480000),
  r("Project Coordinator — 2 posts, one for outdoor and one for indoor activities (Rs. 25,000 × 2 monthly)", 600000),
  r("Trainer cum Supervisor of peers and community mobilisers — 2 posts (Rs. 15,000 × 2 monthly)", 360000),
  r("Outreach Worker and follow-up supervisors — 2 posts (Rs. 15,000 × 2 monthly)", 360000),
  r("Accountant — 2 posts, one Account cum Clerical Assistant and one Account cum Documentation Assistant (Rs. 12,000 × 2 monthly)", 288000),
  r("Cook — 1 post (Rs. 10,000 monthly)", 120000),
  r("Chowkidar — 2 posts (Rs. 9,000 × 2 monthly)", 216000),
  r("House Keeping Staff — 2 posts (Rs. 9,000 × 2 monthly)", 216000),
  alt("doctor", "Doctor, full time — 1 post, rural (Rs. 60,000 monthly)", 720000, "Rural"),
  alt("doctor", "Doctor, full time — 1 post, urban (Rs. 55,000 monthly)", 660000, "Urban"),
  r("Counsellor / Social Worker / Psychologist — 2 posts (Rs. 17,500 × 2 monthly)", 420000),
  r("Yoga Therapist / Dance, Music or Art Teacher, part time — 1 post (Rs. 5,000 monthly)", 60000),
  r("Ward Boys — 2 posts (Rs. 13,000 × 2 monthly)", 312000),
  r("Maintenance of building, the building provided by the district administration (Rs. 5,000 monthly)", 60000),
  r("Contingencies — office expenses, stationery, water, electricity, postage, telephone, repair of beds and linen, documentation and IEC material, printing etc. (Rs. 20,000 monthly)", 240000),
  r("Medicines (Rs. 19,000 monthly)", 228000),
  r("Transport — petrol and maintenance of vehicles (Rs. 15,000 monthly)", 180000),
  r("In-house kitchen — Rs. 110 a day for 3 meals, 15 inmates (Rs. 49,500 monthly)", 594000),
  r("Honorarium to Peer Educators — 1 session of 2 hours at Rs. 150 a session, 60 sessions a quarter", 720000),
  r("Nutrition / refreshment support at Rs. 10 a day per child, 60 sessions a quarter", 480000),
  r("Life-skills educational kit — printing, flex material, games, scrolls (50 sets)", 50000),
  r("Nurse, full time — 2 posts (Rs. 15,000 × 2 monthly)", 360000),
];

const SCHEDULES: Record<CostScheduleId, NormLine[]> = {
  DDAC,
  "IRCA-15": irca(15),
  "IRCA-30": irca(30),
  "IRCA-50": irca(50),
};

export const SCHEDULE_LABEL: Record<CostScheduleId, string> = {
  DDAC: "District De-Addiction Centre",
  "IRCA-15": "IRCA, 15 Beds",
  "IRCA-30": "IRCA, 30 Beds",
  "IRCA-50": "IRCA, 50 Beds",
};

/** The norm lines of a schedule, as a reader of the source would count them. Exported for tests. */
export function normLines(schedule: CostScheduleId): readonly NormLine[] {
  return SCHEDULES[schedule];
}

/**
 * Which schedules a file can be costed against. A DDAC has one; a general IRCA has three, because
 * the reviewing officer sets its bed capacity (the NAPDDR form tells the NGO so). Empty for every
 * file this module holds no norms for — the cost sheet is then not drawn.
 *
 * An ongoing project is costed too: the dev portal costs every NAPDDR instalment (read of 8 Oct
 * 2026), on its recurring heads only — `seedSheet` leaves the one-time items off.
 */
export function schedulesFor(app: GrantApplication): CostScheduleId[] {
  if (app.schemeCode !== "NAPDDR") return [];
  const type = app.formValues?.fld_project_type ?? "";
  if (type.startsWith("DDAC")) return ["DDAC"];
  if (type === "IRCA — Integrated Rehabilitation Centre") return ["IRCA-15", "IRCA-30", "IRCA-50"];
  return [];
}

/** The bed capacity a general IRCA's sheet opens at: the smallest that seats the file's beneficiaries. */
export function defaultSchedule(app: GrantApplication): CostScheduleId | null {
  const options = schedulesFor(app);
  if (options.length <= 1) return options[0] ?? null;
  const people = app.totalBeneficiaries;
  return options.find((s) => Number(s.split("-")[1]) >= people) ?? options[options.length - 1]!;
}

/**
 * A fresh sheet at the norm. Not saved: `savedAt` stays empty until the officer saves it.
 * `recurringOnly` for an ongoing project, whose one-time set-up was granted with its first sanction.
 */
export function seedSheet(schedule: CostScheduleId, opts: { recurringOnly?: boolean } = {}): Omit<CostSheet, "savedAt" | "savedBy"> {
  return {
    schedule,
    lines: SCHEDULES[schedule].flatMap((l, i) =>
      opts.recurringOnly && l.head === "nonRecurring"
        ? []
        : [
            {
              id: `${schedule}-${i + 1}`,
              head: l.head,
              label: l.label,
              norm: l.norm,
              proposed: l.norm,
              ...(l.choice ? { choice: l.choice } : {}),
            },
          ],
    ),
    choices: {},
  };
}

/* ── Arithmetic ──────────────────────────────────────────────────────────── */

/** Whether a line counts: not removed, and — in an either/or group — the option chosen. */
export function lineCounts(line: CostSheetLine, choices: Readonly<Record<string, string>>): boolean {
  if (line.removed) return false;
  if (line.choice) return choices[line.choice.group] === line.id;
  return true;
}

export interface HeadTotals {
  /** The norm for the lines that count. */
  norm: number;
  /** What the NGO claimed under this head. */
  claimed: number;
  /** The lower of the two — the most the head may be recommended at. */
  admissible: number;
  proposed: number;
  /** How far the proposal is above the ceiling; 0 when it is within it. */
  over: number;
}

export interface SheetTotals {
  nonRecurring: HeadTotals;
  recurring: HeadTotals;
  /** The recommended grant: both heads. Never one head alone (the dev portal's defect 2). */
  proposed: number;
  admissible: number;
}

export function sheetTotals(sheet: Pick<CostSheet, "lines" | "choices">, app: Pick<GrantApplication, "recurring" | "nonRecurring">): SheetTotals {
  const head = (h: CostHead): HeadTotals => {
    const lines = sheet.lines.filter((l) => l.head === h && lineCounts(l, sheet.choices));
    const norm = lines.reduce((s, l) => s + l.norm, 0);
    const proposed = lines.reduce((s, l) => s + (Number.isFinite(l.proposed) ? l.proposed : 0), 0);
    const claimed = h === "recurring" ? app.recurring : app.nonRecurring;
    const admissible = Math.min(norm, claimed);
    return { norm, claimed, admissible, proposed, over: Math.max(proposed - admissible, 0) };
  };
  const nonRecurring = head("nonRecurring");
  const recurring = head("recurring");
  return {
    nonRecurring,
    recurring,
    proposed: nonRecurring.proposed + recurring.proposed,
    admissible: nonRecurring.admissible + recurring.admissible,
  };
}

export interface SheetProblem {
  /** Where the officer fixes it: a group to choose in, a line, or a head's total. */
  target: { kind: "choice"; group: string } | { kind: "line"; id: string } | { kind: "head"; head: CostHead };
  message: string;
}

/** Everything that stops the sheet being saved, in the order the officer meets it on the page. */
export function sheetProblems(sheet: Pick<CostSheet, "lines" | "choices">, app: Pick<GrantApplication, "recurring" | "nonRecurring">, money: (n: number) => string): SheetProblem[] {
  const out: SheetProblem[] = [];
  const groups = [...new Set(sheet.lines.filter((l) => l.choice && !l.removed).map((l) => l.choice!.group))];
  for (const g of groups) {
    if (!sheet.choices[g]) out.push({ target: { kind: "choice", group: g }, message: `Choose which ${CHOICE_GROUP_LABEL[g] ?? g} post applies.` });
  }
  for (const l of sheet.lines) {
    if (!lineCounts(l, sheet.choices)) continue;
    if (l.added && !l.label.trim()) out.push({ target: { kind: "line", id: l.id }, message: "Name the item you added." });
    if (!Number.isFinite(l.proposed) || l.proposed < 0) out.push({ target: { kind: "line", id: l.id }, message: "Enter an amount of ₹0 or more." });
  }
  const t = sheetTotals(sheet, app);
  for (const h of ["nonRecurring", "recurring"] as const) {
    if (t[h].over > 0) {
      out.push({
        target: { kind: "head", head: h },
        message: `${h === "recurring" ? "Recurring" : "Non-recurring"} items are ${money(t[h].over)} above the admissible ${money(t[h].admissible)}. Reduce them before saving.`,
      });
    }
  }
  return out;
}

/** Whether the sheet on screen differs from the one saved on the file. */
export function sheetChanged(draft: Pick<CostSheet, "schedule" | "lines" | "choices">, saved: CostSheet | undefined): boolean {
  if (!saved) return true;
  const key = (s: Pick<CostSheet, "schedule" | "lines" | "choices">) =>
    JSON.stringify([s.schedule, s.choices, s.lines.map((l) => [l.id, l.label, l.proposed, l.remark ?? "", !!l.removed])]);
  return key(draft) !== key(saved);
}

/* ── Statement of Account ────────────────────────────────────────────────── */

/**
 * The amount this file releases, which the Statement of Account deducts. A New file releases its
 * recommended grant once the sheet is saved, and what it claimed until then; a claim releases the
 * instalment it claims.
 */
export function releaseOf(app: GrantApplication): number {
  if (app.sanction) return app.sanction.total;
  if (app.costSheet) return sheetTotals(app.costSheet, app).proposed;
  return app.total;
}

/** Balance available under the scheme after this release — computed, never typed (defect 3). */
export function balanceAfter(stmt: Pick<BudgetStatement, "allocation" | "expenditure">, release: number): number {
  return stmt.allocation - stmt.expenditure - release;
}

export function statementProblems(
  stmt: { allocation: string; expenditure: string },
  release: number,
  money: (n: number) => string,
): { allocation?: string; expenditure?: string; balance?: string } {
  const a = stmt.allocation === "" ? NaN : Number(stmt.allocation);
  const e = stmt.expenditure === "" ? NaN : Number(stmt.expenditure);
  const out: { allocation?: string; expenditure?: string; balance?: string } = {};
  if (!Number.isFinite(a) || a <= 0) out.allocation = "Enter the scheme's budgetary allocation for the year.";
  if (!Number.isFinite(e) || e < 0) out.expenditure = "Enter the expenditure to date. Enter 0 if nothing has been spent.";
  else if (Number.isFinite(a) && e > a) out.expenditure = "Expenditure cannot be more than the allocation.";
  if (!out.allocation && !out.expenditure && balanceAfter({ allocation: a, expenditure: e }, release) < 0) {
    out.balance = `This release of ${money(release)} is more than the ${money(a - e)} left under the scheme.`;
  }
  return out;
}

/** An ongoing instalment's net payable: payable this instalment, less what the utilisation certificate shows unspent. */
export function netPayable(s: { payable: number; unspentUc: number }): number {
  return s.payable - s.unspentUc;
}

/** What is wrong with a settlement as typed, by field. Empty when it can be saved. */
export function settlementProblems(s: { payable: string; unspentUc: string }): { payable?: string; unspentUc?: string } {
  const p = s.payable === "" ? NaN : Number(s.payable);
  const u = s.unspentUc === "" ? NaN : Number(s.unspentUc);
  const out: { payable?: string; unspentUc?: string } = {};
  if (!Number.isFinite(p) || p <= 0) out.payable = "Enter the amount payable as this instalment.";
  if (!Number.isFinite(u) || u < 0) out.unspentUc = "Enter the unspent amount on the utilisation certificate. Enter 0 if none.";
  else if (Number.isFinite(p) && u > p) out.unspentUc = "The unspent amount cannot be more than the amount payable.";
  return out;
}

/* ── Amount pipeline ─────────────────────────────────────────────────────── */

export type PipelineState = "done" | "current" | "upcoming";

export interface PipelineStage {
  id: "proposed" | "recommended" | "concurred" | "sanctioned";
  label: string;
  /** Who records this stage, in full. */
  by: string;
  state: PipelineState;
  /** The amount at this stage, once it is recorded. */
  amount?: number;
  at?: string;
}

const lastBy = (app: GrantApplication, role: RoleId, action: string) =>
  [...app.audit].reverse().find((e) => e.byRole === role && e.action === action);

/**
 * Where the amount has reached. One reading, read by the pipeline strip and by the decision panel,
 * so the two never disagree. Null where the file has no cost sheet to move — a scheme or project
 * type this module holds no norms for.
 */
export function amountPipeline(app: GrantApplication): PipelineStage[] | null {
  if (!schedulesFor(app).length) return null;
  const proposed = app.costSheet ? sheetTotals(app.costSheet, app).proposed : undefined;
  const recommended = lastBy(app, "pd-js", "forward");
  const concurred = lastBy(app, "finance-js", "concur");
  // Each stage states its own figure where it recorded one; otherwise it carried the last one on.
  const recommendedAmount = recommended ? (recommended.amount ?? proposed) : undefined;
  const steps: Omit<PipelineStage, "state">[] = [
    { id: "proposed", label: "Proposed", by: "Assistant Section Officer, Programme Division", amount: proposed, at: app.costSheet?.savedAt },
    { id: "recommended", label: "Recommended", by: "Joint Secretary, Programme Division", amount: recommendedAmount, at: recommended?.at },
    { id: "concurred", label: "Concurred", by: "Joint Secretary, Integrated Finance Division", amount: concurred ? (concurred.amount ?? recommendedAmount) : undefined, at: concurred?.at },
    { id: "sanctioned", label: "Sanctioned", by: "Programme Director", amount: app.sanction?.total, at: app.sanction?.sanctionedAt },
  ];
  const doneUpTo = steps.reduce((n, s, i) => (s.amount != null ? i : n), -1);
  return steps.map((s, i) => ({ ...s, state: i <= doneUpTo && s.amount != null ? "done" : i === doneUpTo + 1 ? "current" : "upcoming" }));
}
