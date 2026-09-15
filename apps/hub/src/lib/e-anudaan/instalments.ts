/**
 * Instalments: which one a project may claim next, how much it releases, under which
 * application ID, and when it opens.
 *
 * The review call of 11 September 2026 settled four things this module applies:
 *
 *   - The instalment is never chosen from a list. The system knows what the project has been
 *     sanctioned, so the next instalment is derived (T370–384, T419–422).
 *   - The recurring grant is released in instalments; the non-recurring grant is a one-time
 *     set-up amount with no instalments (T335–347). The vendor gave the split as 40-40-20 for
 *     NAPDDR, AVYAY and SHRESHTA and 50-50 for SMILE (T339).
 *   - One application ID runs across a year's instalments: the 1st instalment creates it, and
 *     the 2nd and 3rd are claimed on the same ID (T372–375).
 *   - A 2nd or 3rd instalment asks only for what changes; the rest is carried forward (T667–675).
 *
 * ASSUMPTIONS, recorded because no departmental document in the repository states them:
 *   1. AVYAY releases 40% / 40% / 20% of the year's sanctioned recurring grant. The live form's
 *      grant lead says "two half-yearly instalments" instead; the call is later and names AVYAY
 *      explicitly, so the call's split is used. To be confirmed with the Ministry.
 *   2. The 1st instalment is the first ONGOING claim after a project's New grant. The New grant
 *      itself releases the non-recurring set-up amount and is not numbered (as the seed and
 *      `nextInstalment` already count).
 *   3. A claim for the next instalment opens only once the one before it is RELEASED — decided
 *      16 Sep 2026 after the live Under Secretary's "Instalments & Fund Release" screen, which
 *      releases the funds and then opens the next instalment (`funding.ts`, `workflow.ts`
 *      `releaseFunds`). A sanction alone opens nothing. A new year's 1st instalment also waits for
 *      that year to begin; before then the portal says it opens "when the Ministry opens
 *      applications" for that year.
 *   4. The 20% withheld from the 3rd instalment being added to the next year's 2nd (T340) is
 *      not modelled: each instalment releases its own share.
 */

import { ordinal } from "./applicant.ts";
import { RELEASE_PATTERN, RENEWAL_PICKER, type SchemeCode } from "./form-schema.ts";
import type { EAnudaanState, GrantApplication, Institution, ProjectAccount } from "./types.ts";

// The split per scheme lives with the forms that label it (form-schema.ts); re-exported here.
export { RELEASE_PATTERN, RENEWAL_PICKER };

const patternOf = (scheme: string): readonly number[] => RELEASE_PATTERN[scheme.toUpperCase()] ?? [40, 40, 20];

/** The financial year running on a date: April to March, "2026-27". */
export function currentFinancialYear(now: Date = new Date()): string {
  const y = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
}

/** The financial year after `fy`. */
export function nextFinancialYear(fy: string): string {
  const y = Number(fy.slice(0, 4)) + 1;
  return `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
}

/**
 * The application ID a claim runs under. A 2nd or 3rd instalment is filed as `<ID>/I2` or
 * `<ID>/I3` — one record per claim, so each keeps its own review trail, under the one ID the
 * year's 1st instalment created.
 */
export function applicationRefOf(app: Pick<GrantApplication, "id">): string {
  return app.id.replace(/\/I\d$/, "");
}

/** The record ID for instalment `n` of an application. */
export function claimIdFor(applicationRef: string, instalment: number): string {
  return instalment <= 1 ? applicationRef : `${applicationRef}/I${instalment}`;
}

const isOpen = (a: GrantApplication) => !a.sanction && a.status !== "Draft" && a.status !== "Rejected" && a.status !== "Sanctioned" && a.status !== "Released";

/** A project's files under one scheme, oldest first. */
function filesOf(state: EAnudaanState, scheme: string, projectId: string): GrantApplication[] {
  return state.applications
    .filter((a) => a.schemeCode === scheme && a.institutionId === projectId)
    .sort(
      (a, b) =>
        a.financialYear.localeCompare(b.financialYear) ||
        (a.instalment ?? 0) - (b.instalment ?? 0) ||
        Date.parse(a.submittedAt ?? a.updatedAt) - Date.parse(b.submittedAt ?? b.updatedAt),
    );
}

/**
 * The year's sanctioned recurring grant, read from a sanctioned claim. A New grant's sanction
 * order carries it whole; an instalment's order carries only that instalment's share of it.
 */
export function annualRecurringOf(app: GrantApplication): number {
  const recorded = Number(app.formValues?.fld_sanctioned_recurring || 0);
  if (recorded > 0) return recorded;
  const released = app.sanction?.recurring ?? 0;
  if (app.caseType !== "Ongoing" || !app.instalment) return released;
  const share = patternOf(app.schemeCode)[app.instalment - 1] ?? 100;
  return Math.round((released * 100) / share);
}

export type InstalmentState =
  /** Can be claimed now. */
  | "open"
  /** Due, but not before the Ministry opens applications for that year. */
  | "not-yet"
  /** The claim before it is sanctioned but its funds are not yet released. */
  | "not-released"
  /** A claim on this project is with the Ministry; nothing else can be claimed until it is decided. */
  | "in-progress"
  /** Never sanctioned: there is nothing to claim an instalment of. */
  | "none";

export interface InstalmentPlan {
  state: InstalmentState;
  scheme: string;
  project?: Institution;
  projectId: string;
  /** The instalment due next. */
  instalment?: number;
  /** How many instalments the scheme releases a year. */
  of?: number;
  /** Its share of the year's recurring grant, in per cent. */
  share?: number;
  financialYear?: string;
  /** Set for a 2nd or 3rd instalment: the ID the year's 1st instalment created. */
  applicationRef?: string;
  /** The year's sanctioned recurring grant. */
  annualRecurring?: number;
  /** What this instalment releases. */
  amount?: number;
  /** What the year's earlier instalments released. */
  appliedPrior?: number;
  /** What the year still has to release after this instalment. */
  remaining?: number;
  /** The last sanctioned file on the project. */
  lastSanctioned?: GrantApplication;
  /** The financial year of the project's first sanctioned grant. */
  firstSanctionedFy?: string;
  /** The file in progress, when `state` is `in-progress`. */
  inProgress?: GrantApplication;
  account?: ProjectAccount;
}

/** Where a project stands on its instalments. `now` decides which financial year is running. */
export function instalmentPlan(state: EAnudaanState, scheme: string, projectId: string, now: Date = new Date()): InstalmentPlan {
  const code = scheme.toUpperCase();
  const project = state.ngos.flatMap((n) => n.institutions).find((i) => i.id === projectId);
  const account = state.projectAccounts.find((a) => a.projectId === projectId && !a.activeTo);
  const files = filesOf(state, code, projectId);
  const base = { scheme: code, project, projectId, account };

  const inProgress = files.find(isOpen);
  const sanctioned = files.filter((a) => a.sanction);
  const last = sanctioned.at(-1);
  if (inProgress) return { ...base, state: "in-progress", inProgress, lastSanctioned: last };
  if (!last) return { ...base, state: "none" };

  const pattern = patternOf(code);
  const annualRecurring = annualRecurringOf(last);
  const lastInstalment = last.caseType === "Ongoing" ? (last.instalment ?? 0) : 0;
  const within = lastInstalment >= 1 && lastInstalment < pattern.length;
  const instalment = within ? lastInstalment + 1 : 1;
  const share = pattern[instalment - 1] ?? 0;
  // A 2nd or 3rd instalment belongs to the year its 1st was claimed for, on the same ID. A 1st
  // instalment is the next year's, after a New grant or a completed year.
  const financialYear = within ? last.financialYear : nextFinancialYear(last.financialYear);
  const released = Boolean(last.release);
  const opensNow = released && (within || currentFinancialYear(now) >= financialYear);
  const amount = Math.round((annualRecurring * share) / 100);
  const appliedPrior = Math.round((annualRecurring * pattern.slice(0, instalment - 1).reduce((a, b) => a + b, 0)) / 100);
  return {
    ...base,
    state: opensNow ? "open" : !released ? "not-released" : "not-yet",
    instalment,
    of: pattern.length,
    share,
    financialYear,
    applicationRef: within ? applicationRefOf(last) : undefined,
    annualRecurring,
    amount,
    appliedPrior,
    remaining: Math.max(annualRecurring - appliedPrior - amount, 0),
    lastSanctioned: last,
    firstSanctionedFy: sanctioned[0]?.financialYear,
  };
}

/** "2nd Instalment" */
export const instalmentLabel = (n: number) => `${ordinal(n)} Instalment`;

/** The picker's option for a plan: "<Project ID> — <name>, <district>". The ID leads, so it parses. */
export function renewalOption(plan: InstalmentPlan): string {
  const p = plan.project;
  return `${plan.projectId} — ${p ? `${p.name}, ${p.district}` : plan.projectId}`;
}

/** The NGO's own projects under a scheme with an instalment open to claim now — the previous one released. */
export function renewableProjects(state: EAnudaanState, ngoId: string, scheme: string, now: Date = new Date()): InstalmentPlan[] {
  const code = scheme.toUpperCase();
  const ngo = state.ngos.find((n) => n.id === ngoId);
  if (!ngo) return [];
  const withFiles = new Set(state.applications.filter((a) => a.ngoId === ngoId && a.schemeCode === code).map((a) => a.institutionId));
  return ngo.institutions
    .filter((i) => withFiles.has(i.id))
    .map((i) => instalmentPlan(state, code, i.id, now))
    .filter((p) => p.state === "open");
}

/** The plan behind a picker option, if the option names one of the NGO's open projects. */
export function planForOption(state: EAnudaanState, ngoId: string, scheme: string, option: string, now: Date = new Date()): InstalmentPlan | undefined {
  const id = option.split(" — ")[0]?.trim();
  if (!id) return undefined;
  return renewableProjects(state, ngoId, scheme, now).find((p) => p.projectId === id);
}

/** "XXXX XXXX 4417" — the account number as the applicant is shown it, once. */
export const maskedNumber = (last4: string) => `XXXX XXXX ${last4}`;

/** The account on record, as one option string: bank · masked number · IFSC · branch. */
export function accountOption(a: ProjectAccount): string {
  return `${a.bank} · ${maskedNumber(a.last4)} · ${a.ifsc} · ${a.branch}`;
}

/**
 * The answers a renewal starts with: last year's answers on the project (T418, T423), then what
 * the portal knows for certain — the project, the instalment, the sanctioned figures and the
 * account on record. Identity fields come from DARPAN and are laid on by the wizard, not here.
 */
export function renewalAnswers(plan: InstalmentPlan): Record<string, string> {
  const last = plan.lastSanctioned;
  const carried = { ...(last?.formValues ?? {}) };
  // Never carried: the previous claim's own facts. They are this claim's to state.
  for (const k of [
    "fld_auth_date", "fld_auth_time", "fld_installment_no", "claim_stage", "case_type", "fld_financial_year",
    "fld_grant_non_recurring", "fld_grant_total", "fld_grant_recurring", "fld_annual_recurring_grant",
    "fld_instalment_amount", "fld_grant_applied_prior", "fld_grant_remaining", "fld_application_ref",
    ...Object.values(RENEWAL_PICKER),
  ]) {
    delete carried[k];
  }
  // Declarations and undertakings are given afresh for every claim: carried forward ticked, a
  // clerk confirms last year's promise without reading it.
  for (const k of Object.keys(carried)) if (k.startsWith("decl_") || k === "prev_instalment_utilised") delete carried[k];
  const p = plan.project;
  // Where each form keeps the project's place — fixed on a renewal (T449).
  const place: Record<string, [string, string] | undefined> = {
    AVYAY: ["fld_project_state", "fld_project_district"],
    NAPDDR: ["fld_project_state", "fld_project_district"],
    SMILE: ["fld_site_state", "fld_site_district"],
  };
  const [stateField, districtField] = place[plan.scheme] ?? [];
  return {
    ...carried,
    fld_project_id: plan.projectId,
    ...(plan.scheme === "SHRESHTA_M2"
      ? {
          fld_institution_id: plan.projectId,
          // An institution claiming an instalment is ongoing, and has received grant since its first sanction.
          fld_institution_status: "Ongoing",
          fld_gia_since_year: carried.fld_gia_since_year || plan.firstSanctionedFy?.slice(0, 4) || "",
        }
      : {}),
    ...(p && stateField && districtField ? { [stateField]: p.state, [districtField]: p.district } : {}),
    ...(p ? { fld_building_ownership: carried.fld_building_ownership ?? p.building } : {}),
    fld_installment_no: plan.instalment ? instalmentLabel(plan.instalment) : "",
    claim_stage: (plan.instalment ?? 1) > 1 ? "later-instalment" : "first-instalment",
    fld_financial_year: plan.financialYear ?? "",
    fld_application_ref: plan.applicationRef ?? "",
    fld_sanctioned_recurring: plan.annualRecurring ? String(plan.annualRecurring) : "",
    fld_instalment_amount: plan.amount ? String(plan.amount) : "",
    fld_grant_applied_prior: String(plan.appliedPrior ?? 0),
    fld_grant_remaining: String(plan.remaining ?? 0),
    ...(plan.account
      ? {
          fld_bank_name: plan.account.bank,
          fld_bank_account_number: maskedNumber(plan.account.last4),
          fld_bank_ifsc: plan.account.ifsc,
          fld_bank_branch: plan.account.branch,
          fld_pfms_on_record: plan.account.pfmsRegistered ? "Yes" : "No",
          fld_pfms_status: plan.account.pfmsRegistered ? "Registered" : "",
          fld_pfms_registered: plan.account.pfmsRegistered ? "Yes" : "",
        }
      : {}),
  };
}

/**
 * What the applicant is told about a sanctioned file's next instalment, for My Applications and
 * the application page. Only the LATEST sanctioned file on a project carries it — an older
 * sanction's next instalment has already been claimed.
 */
export interface NextInstalmentNotice {
  plan: InstalmentPlan;
  /** "2nd Instalment is open" / "1st Instalment for 2027-28 opens when the Ministry opens applications" */
  title: string;
  /** Where to claim it, when it is open. */
  href?: string;
}

/**
 * The schemes whose renewal form derives its instalment from this module — all four since
 * 16 Sep 2026. An applicant is told an instalment is open only where the form can claim it.
 */
export const DERIVED_CLAIM_SCHEMES: ReadonlySet<string> = new Set<SchemeCode>(["AVYAY", "NAPDDR", "SHRESHTA_M2", "SMILE"]);

export function nextInstalmentNotice(state: EAnudaanState, app: GrantApplication, now: Date = new Date()): NextInstalmentNotice | undefined {
  if (!app.sanction || !DERIVED_CLAIM_SCHEMES.has(app.schemeCode)) return undefined;
  const plan = instalmentPlan(state, app.schemeCode, app.institutionId, now);
  if (plan.lastSanctioned?.id !== app.id || !plan.instalment) return undefined;
  if (plan.state === "open") {
    return {
      plan,
      title: `${instalmentLabel(plan.instalment)} is open to claim`,
      href: `/portals/e-anudaan/apply-grant/scheme/${plan.scheme}/step-1?project=${encodeURIComponent(plan.projectId)}`,
    };
  }
  if (plan.state === "not-released") {
    const previous = plan.lastSanctioned?.caseType === "Ongoing" && plan.lastSanctioned.instalment ? instalmentLabel(plan.lastSanctioned.instalment) : "New Grant";
    return { plan, title: `${instalmentLabel(plan.instalment)} opens once the ${previous} is released` };
  }
  if (plan.state === "not-yet") {
    return { plan, title: `${instalmentLabel(plan.instalment)} for ${plan.financialYear} opens when the Ministry opens applications for that year` };
  }
  return undefined;
}

/** Every project of the NGO's with an instalment open now or due next, for the dashboard. */
export function upcomingInstalments(state: EAnudaanState, ngoId: string, now: Date = new Date()): NextInstalmentNotice[] {
  return state.applications
    .filter((a) => a.ngoId === ngoId && a.sanction)
    .map((a) => nextInstalmentNotice(state, a, now))
    .filter((n): n is NextInstalmentNotice => !!n)
    .sort((a, b) => Number(b.plan.state === "open") - Number(a.plan.state === "open") || a.plan.projectId.localeCompare(b.plan.projectId));
}
