/**
 * The two things the grant wizard does to an application, as functions a test can call: record
 * one answer, and turn the answers into a submitted file.
 *
 * They lived inside the wizard component and the store's context. The serious audit of 14 Sep
 * 2026 (UX-01) found a submitted AVYAY application recording ₹0 and "3 required questions
 * unanswered" although the amounts had been entered, and no test could reach the path that lost
 * them. `apply-grant-walk.test.ts` now walks every scheme and branch through these same functions.
 */

import { mintReference, nextInstalment, notificationTitle } from "./applicant.ts";
import { cityCategoryFor } from "./geography.ts";
import { RENEWAL_PICKER, applyAllAutoFields, applyAutoFields, stepFields, type StepDef, type WizardDef } from "./form-schema.ts";
import { DERIVED_CLAIM_SCHEMES, claimIdFor, currentFinancialYear, planForOption, renewalAnswers } from "./instalments.ts";
import { darpanSeed } from "./prefill.ts";
import { beneficiariesOf, caseTypeOf } from "./submission.ts";
import type { Clock } from "./workflow.ts";
import type { EAnudaanState, GrantApplication } from "./types.ts";

/** The renewal field that names the project, per scheme — choosing it states the whole claim. */
export const RENEWAL_PROJECT_FIELDS: ReadonlySet<string> = new Set(Object.values(RENEWAL_PICKER));

/** An answer that says "a new project": AVYAY's and NAPDDR's "New project", SMILE's "No — new project…". */
const isNewAnswer = (value: string) => /^(new|no —)/i.test(value);

/**
 * The answers after one field changes, with everything that change implies: a branch change
 * clears the other branch's project, a renewal project states its instalment and carries its
 * sanctioned figures, a State clears its District, and the totals are worked out again.
 */
export function answerField(
  state: EAnudaanState,
  wizard: WizardDef,
  step: StepDef,
  values: Record<string, string>,
  name: string,
  value: string,
  /** Which financial year is running; injected by tests. */
  now: Date = new Date(),
): Record<string, string> {
  let next = { ...values, [name]: value };
  const picker = RENEWAL_PICKER[wizard.code];
  // Changing the branch clears the project the other branch had chosen, and everything that
  // project brought with it. A hidden answer is still an answer: a renewal's project left behind
  // under "New project" filed the new application against that existing project.
  if (name === "case_type" && value !== values.case_type) {
    for (const f of RENEWAL_PROJECT_FIELDS) next[f] = "";
    for (const k of CLAIM_FIELDS) next[k] = "";
    // A new application is for the year now running (T328–329).
    if (isNewAnswer(value)) next.fld_financial_year = currentFinancialYear(now);
    return applyAllAutoFields(wizard, next);
  }
  // The instalment is stated, never chosen (T370–384). The project's own sanctioned record decides
  // the instalment, its amount, the year and the application ID, and last year's answers fill the
  // form (T418–423). The form is filled FROM the project: answers typed for another project or for
  // a new one do not survive into it. What stays is the portal's — DARPAN and the declaration stamp.
  if (name === picker && DERIVED_CLAIM_SCHEMES.has(wizard.code)) {
    const ngo = state.ngos[0];
    const plan = ngo && value ? planForOption(state, ngo.id, wizard.code, value, now) : undefined;
    for (const k of CLAIM_FIELDS) next[k] = "";
    if (plan) {
      next = {
        ...darpanSeed(ngo, now),
        ...renewalAnswers(plan),
        ...darpanIdentity(darpanSeed(ngo, now)),
        ...(next.case_type !== undefined ? { case_type: next.case_type } : {}),
        [name]: value,
        fld_auth_date: values.fld_auth_date ?? "",
        fld_auth_time: values.fld_auth_time ?? "",
      };
    } else if (!value) {
      // SHRESHTA's institution left blank again: an application not on record, for the year now running.
      next.fld_financial_year = currentFinancialYear(now);
    }
    return applyAllAutoFields(wizard, next);
  }
  // A State change clears its dependent District, as the live cascade does.
  for (const f of stepFields(step)) {
    if (f.districtsOf === name) next = { ...next, [f.name]: "" };
    if (f.auto?.kind === "cityCategory" && f.auto.from === name) next = { ...next, [f.name]: cityCategoryFor(value) };
  }
  return applyAutoFields(step, next);
}

/** The answers a chosen project supplies, cleared whenever the project or the branch changes. */
const CLAIM_FIELDS = [
  "claim_stage",
  "fld_installment_no",
  "fld_application_ref",
  "fld_sanctioned_recurring",
  "fld_instalment_amount",
  "fld_grant_applied_prior",
  "fld_grant_remaining",
  "fld_project_id",
  "fld_institution_id",
  "fld_bank_name",
  "fld_bank_branch",
  "fld_bank_account_number",
  "fld_bank_ifsc",
  "fld_pfms_on_record",
  "fld_pfms_status",
  "fld_pfms_registered",
] as const;

/** The identity NGO-Darpan supplies. Never overwritten by a carried-forward or demo answer. */
export function darpanIdentity(seed: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of ["fld_ngo_name", "fld_darpan_id", "fld_reg_office_state", "fld_reg_office_district"]) if (seed[k]) out[k] = seed[k]!;
  return out;
}

export interface SubmitApplicationInput {
  schemeCode: string;
  financialYear: string;
  /** Every answer the wizard collected, keyed by the scheme form's field names. */
  values: Record<string, string>;
  /** The documents uploaded on the checklist step, already shaped by `documentsOf`. */
  documents?: GrantApplication["documents"];
  /**
   * The register's Draft application this submission completes (a Draft row continued from My
   * Applications). It is replaced by the filed application rather than left behind as a Draft.
   */
  replacesDraftId?: string;
}

/**
 * The state with a new application filed from the wizard's answers. Mirrors the live portal: the
 * file lands with the Programme Division's ASO, a timeline entry is written, and the applicant
 * gets an "Application submitted" notice. Pure — the store writes the result, and only shows it
 * once the write has succeeded.
 */
export function fileApplication(
  state: EAnudaanState,
  { schemeCode, financialYear, values, documents, replacesDraftId }: SubmitApplicationInput,
  clock: Clock,
): { app: GrantApplication; state: EAnudaanState } {
  const ngo = state.ngos[0]!;
  // The district of the project the file is raised under — never an address typed into the
  // form — and a serial one past the highest issued.
  const minted = mintReference(ngo, state.applications.map((a) => a.id), schemeCode, financialYear, values);
  const { project } = minted;
  const instalment = Number((values.fld_installment_no ?? "").match(/^(\d)/)?.[1] ?? 0);
  // A 2nd or 3rd instalment is claimed on the ID its year's 1st instalment created (T372–375).
  const applicationRef = values.fld_application_ref?.trim();
  const id = applicationRef && instalment > 1 ? claimIdFor(applicationRef, instalment) : minted.id;

  const people = beneficiariesOf(values);
  const ongoing = caseTypeOf(values) === "Ongoing";
  // A renewal releases one instalment of the sanctioned recurring grant, and no non-recurring grant.
  const instalmentAmount = Number(values.fld_instalment_amount || 0) || 0;
  const recurring = ongoing && instalmentAmount ? instalmentAmount : Number(values.fld_grant_recurring || values.fld_annual_recurring_grant || 0) || 0;
  const nonRecurring = ongoing && instalmentAmount ? 0 : Number(values.fld_grant_non_recurring || 0) || 0;
  const total = ongoing && instalmentAmount ? instalmentAmount : Number(values.fld_grant_total || 0) || recurring + nonRecurring;
  const code = schemeCode.toUpperCase();

  const app: GrantApplication = {
    id,
    schemeCode: code,
    ngoId: ngo.id,
    institutionId: project.institutionId,
    projectLabel: project.label,
    financialYear,
    caseType: ongoing ? "Ongoing" : "New",
    // The instalment the form stated; where a scheme's form does not ask (SHRESHTA), the one the
    // project is due — the same `nextInstalment` the wizard shows.
    instalment: !ongoing
      ? undefined
      : instalment >= 1 && instalment <= 3
        ? (instalment as 1 | 2 | 3)
        : nextInstalment(state, code, project.institutionId),
    status: "Submitted",
    holder: { kind: "chain", division: "pd", grade: "aso" },
    scBeneficiaries: people.sc,
    otherBeneficiaries: people.other,
    totalBeneficiaries: people.total,
    recurring,
    nonRecurring,
    total,
    documents: documents ?? [],
    formValues: values,
    deficiencies: [],
    queries: [],
    showCauseNotices: [],
    submittedAt: clock.now,
    updatedAt: clock.now,
    ageingDays: 0,
    audit: [
      {
        id: clock.id("aud"),
        at: clock.now,
        byRole: "ngo",
        byName: ngo.name,
        action: "submit",
        to: { kind: "chain", division: "pd", grade: "aso" },
        remarks: `Application submitted (${id})`,
      },
    ],
  };

  return {
    app,
    state: {
      ...state,
      // A new project joins the NGO's projects, so its bank account, roster and attendance have
      // somewhere to live.
      ngos: project.created
        ? state.ngos.map((n) => (n.id === ngo.id ? { ...n, institutions: [...n.institutions, project.created!] } : n))
        : state.ngos,
      // Only this applicant's own Draft is ever replaced; any other record with that id stays.
      applications: [
        app,
        ...state.applications.filter((a) => !(replacesDraftId && a.id === replacesDraftId && a.status === "Draft" && a.ngoId === ngo.id)),
      ],
      notifications: [
        {
          id: `ntf-live-${app.audit[0]!.id}`,
          at: clock.now,
          title: notificationTitle("submit"),
          body: `Your application ${id} has been submitted and is now with the Ministry for review.`,
          audience: ["ngo"],
          applicationId: id,
          readBy: [],
        },
        ...state.notifications,
      ],
    },
  };
}
