/**
 * The two things the grant wizard does to an application, as functions a test can call: record
 * one answer, and turn the answers into a submitted file.
 *
 * They lived inside the wizard component and the store's context. The serious audit of 14 Sep
 * 2026 (UX-01) found a submitted AVYAY application recording ₹0 and "3 required questions
 * unanswered" although the amounts had been entered, and no test could reach the path that lost
 * them. `apply-grant-walk.test.ts` now walks every scheme and branch through these same functions.
 */

import { mintReference, nextInstalment, notificationTitle, ordinal } from "./applicant.ts";
import { cityCategoryFor } from "./geography.ts";
import { applyAllAutoFields, applyAutoFields, stepFields, type StepDef, type WizardDef } from "./form-schema.ts";
import { CARRIED_FORWARD } from "./prefill.ts";
import { beneficiariesOf, caseTypeOf } from "./submission.ts";
import type { Clock } from "./workflow.ts";
import type { EAnudaanState, GrantApplication } from "./types.ts";

/** The renewal field that names the project, per scheme — choosing it states the instalment. */
export const RENEWAL_PROJECT_FIELDS: ReadonlySet<string> = new Set([
  "fld_renewal_project",
  "fld_ongoing_source_application",
  "fld_smile_project_select",
]);

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
): Record<string, string> {
  let next = { ...values, [name]: value };
  // Changing the branch clears the project the other branch had chosen. A hidden answer is
  // still an answer: a renewal's project left behind under "New project" filed the new
  // application against that existing project, and kept its Project ID on screen.
  if (name === "case_type" && value !== values.case_type) {
    for (const f of RENEWAL_PROJECT_FIELDS) next[f] = "";
    next.fld_installment_no = "";
    next = applyAllAutoFields(wizard, next);
  }
  // The instalment is stated, never chosen (review call 11 Sep 2026, T370–383), and only once
  // there is a project to state it for. A renewal claims an instalment of what was sanctioned,
  // so the sanctioned figures come with the project — locking those fields without filling them
  // left required answers nobody could type (full-wizard walk, 13 Sep 2026).
  if (RENEWAL_PROJECT_FIELDS.has(name)) {
    const projectId = value.split(" — ")[0]?.trim() ?? "";
    next = {
      ...next,
      fld_installment_no: value ? `${ordinal(nextInstalment(state, wizard.code, projectId))} Instalment` : "",
      ...(value ? (CARRIED_FORWARD[wizard.code] ?? {}) : {}),
    };
    next = applyAllAutoFields(wizard, next);
  }
  // A State change clears its dependent District, as the live cascade does.
  for (const f of stepFields(step)) {
    if (f.districtsOf === name) next = { ...next, [f.name]: "" };
    if (f.auto?.kind === "cityCategory" && f.auto.from === name) next = { ...next, [f.name]: cityCategoryFor(value) };
  }
  return applyAutoFields(step, next);
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
  const { id, project } = mintReference(ngo, state.applications.map((a) => a.id), schemeCode, financialYear, values);

  const people = beneficiariesOf(values);
  const recurring = Number(values.fld_grant_recurring || 0) || 0;
  const nonRecurring = Number(values.fld_grant_non_recurring || 0) || 0;
  const total = Number(values.fld_grant_total || 0) || recurring + nonRecurring;
  const ongoing = caseTypeOf(values) === "Ongoing";
  const instalment = Number((values.fld_installment_no ?? "").match(/^(\d)/)?.[1] ?? 0);
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
