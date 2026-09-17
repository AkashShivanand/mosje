/**
 * Which answers an application may change, at which stage — ONE policy, per field.
 *
 * Before this module the rule lived in four places that did not agree: `readOnly` flags in the
 * form schema (draft only), help text ("it cannot be changed on a renewal"), the officer's choice of
 * which field to raise a deficiency on, and the change-request desks for bank accounts and project
 * locations. An officer could ask for a correction to a field the applicant had no way to change on
 * the correction screen, and nothing said where it was changed instead.
 *
 * Every field in `form-schema.ts` is listed in exactly one GROUP below, by name. There is no
 * fallback: a field added to a wizard without a group fails `edit-policy.test.ts`, so the policy
 * cannot silently fall behind the form.
 *
 * Three outcomes per field and stage:
 *
 *   editable              — the applicant changes it in place.
 *   editable-with-reason  — the applicant changes it in place and states why; the reason goes on the
 *                           file with the correction (the audit trail's remarks).
 *   locked                — shown as read-only text with the reason, and — where one exists — the
 *                           place the applicant changes it instead (NGO-DARPAN, the Project Bank
 *                           Accounts request, the Project Location Change request, …).
 *
 * Four stages, from the application's status (`editStageOf`):
 *
 *   draft       — not yet submitted.
 *   submitted   — with the Ministry for examination; nothing changes until a correction is asked.
 *   correction  — a deficiency has been sent to the applicant (`DeficiencyRaised`).
 *   sanctioned  — sanctioned or released; the project is ongoing and claims its instalments.
 *
 * The routes named here are the applicant's own screens (`roles.ts` NGO nav). NGO-DARPAN is the
 * NITI Aayog registry the portal reads the organisation's identity from.
 */

import { applyAllAutoFields, wizardFor, type FieldDef } from "./form-schema.ts";
import { beneficiariesOf } from "./submission.ts";
import type { AppStatus, GrantApplication } from "./types.ts";

const BASE = "/portals/e-anudaan";

export type EditStage = "draft" | "submitted" | "correction" | "sanctioned";
export const EDIT_STAGES: readonly EditStage[] = ["draft", "submitted", "correction", "sanctioned"] as const;

/** Where a locked answer is changed instead. */
export interface ChangeRoute {
  label: string;
  href: string;
  /** Opens outside the portal. */
  external?: boolean;
}

export type EditRule =
  | { kind: "editable" }
  | {
      kind: "editable-with-reason";
      /** Why a reason is asked, shown as the hint under the reason box. */
      why: string;
    }
  | {
      kind: "locked";
      /** Why the answer cannot be changed here, in the applicant's terms. */
      reason: string;
      changeAt?: ChangeRoute;
    };

/* ── Where locked answers are changed ─────────────────────────────────────── */

export const CHANGE_ROUTES = {
  darpan: { label: "Update on NGO-DARPAN", href: "https://ngodarpan.gov.in", external: true },
  bankAccounts: { label: "Request a Bank Account Change", href: `${BASE}/ngo/bank-accounts` },
  location: { label: "Request a Project Location Change", href: `${BASE}/ngo/project-location-change` },
  roster: { label: "Update Beneficiaries & Staff", href: `${BASE}/ngo/beneficiaries` },
  cctv: { label: "Update CCTV Setup", href: `${BASE}/ngo/cctv` },
  newApplication: { label: "Apply for Grant", href: `${BASE}/apply-grant` },
} as const satisfies Record<string, ChangeRoute>;

/* ── Rules shared by several groups ───────────────────────────────────────── */

const EDITABLE: EditRule = { kind: "editable" };

/** Once submitted, nothing changes until the Ministry asks for a correction. */
const UNDER_EXAMINATION: EditRule = {
  kind: "locked",
  reason: "The application is with the Ministry for examination. Answers can be changed only when the Ministry asks for a correction.",
};

const withReason = (why: string): EditRule => ({ kind: "editable-with-reason", why });
const locked = (reason: string, changeAt?: ChangeRoute): EditRule => ({ kind: "locked", reason, ...(changeAt ? { changeAt } : {}) });

type StagePolicy = Readonly<Record<EditStage, EditRule>>;

/* ── The groups ───────────────────────────────────────────────────────────── */

interface Group {
  /** What the group is, for the reader of this file. */
  about: string;
  policy: StagePolicy;
  fields: readonly string[];
}

const DARPAN_REASON = "This is read from the organisation's registration on NGO-DARPAN. Change it there and the portal shows the new details.";
const SANCTION_REASON = "This is part of the proposal the grant was sanctioned on, so it is fixed by the sanction order.";

export const EDIT_GROUPS = {
  darpanRecord: {
    about: "The organisation's identity as NGO-DARPAN holds it. Read-only on the form at every stage.",
    policy: {
      draft: locked(DARPAN_REASON, CHANGE_ROUTES.darpan),
      submitted: locked(DARPAN_REASON, CHANGE_ROUTES.darpan),
      correction: locked(DARPAN_REASON, CHANGE_ROUTES.darpan),
      sanctioned: locked(DARPAN_REASON, CHANGE_ROUTES.darpan),
    },
    fields: ["fld_ngo_name", "fld_darpan_id", "fld_reg_office_district", "fld_reg_office_state"],
  },
  registration: {
    about: "Registration particulars the applicant types; they must agree with the certificate and NGO-DARPAN.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: withReason("Registration particulars must agree with the registration certificate. Say what the corrected figure is taken from."),
      sanctioned: locked(DARPAN_REASON, CHANGE_ROUTES.darpan),
    },
    fields: [
      "fld_statute_act",
      "fld_registration_number",
      "fld_registration_date",
      "fld_registration_expiry",
      "fld_reg_office_address",
      "fld_reg_office_city",
      "fld_registration_act",
      "fld_registration_valid_upto",
      "fld_establishment_date",
      "fld_pan_number",
      "fld_pan_date",
      "fcra_80g",
      "fld_fcra_80g_details",
    ],
  },
  contact: {
    about: "How the Ministry reaches the organisation.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: EDITABLE,
      sanctioned: withReason("A change of contact details is recorded on the project's file."),
    },
    fields: ["fld_contact_mobile", "fld_contact_email", "fld_contact_telephone", "fld_contact_fax", "fld_site_org_email", "website_available", "fld_website_url", "fld_org_website"],
  },
  claimIdentity: {
    about: "What the application is FOR — scheme branch, project, year, project type. These decide the questions and the norms.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: locked(
        "This decides which questions the application asks and which cost norms apply, so it cannot change after submission. A different project, year or type needs a new application.",
        CHANGE_ROUTES.newApplication,
      ),
      sanctioned: locked(SANCTION_REASON),
    },
    fields: [
      "fld_institution_select",
      "fld_institution_id",
      "fld_financial_year",
      "case_type",
      "fld_ongoing_source_application",
      "fld_smile_project_select",
      "fld_project_type",
      "fld_nature_of_project",
      "fld_agency_type",
      "grant_requirement_type",
      "fld_institution_status",
    ],
  },
  systemRecord: {
    about: "Set by the portal from the sanctioned project's record. Read-only on the form.",
    policy: {
      draft: locked("The portal fills this in from the project's sanctioned record."),
      submitted: locked("The portal fills this in from the project's sanctioned record."),
      correction: locked("The portal fills this in from the project's sanctioned record."),
      sanctioned: locked("The portal fills this in from the project's sanctioned record."),
    },
    fields: ["fld_installment_no", "fld_project_id", "fld_sanctioned_recurring", "fld_instalment_amount", "fld_grant_applied_prior", "fld_grant_remaining"],
  },
  derived: {
    about: "Calculated from other answers. Changing the answers it is calculated from changes it.",
    policy: {
      draft: locked("Calculated from the answers it is made up of. Change those answers instead."),
      submitted: locked("Calculated from the answers it is made up of. Change those answers instead."),
      correction: locked("Calculated from the answers it is made up of. Change those answers instead."),
      sanctioned: locked("Calculated from the answers it is made up of."),
    },
    fields: ["fld_city_category", "fld_grant_total"],
  },
  signatureStamp: {
    about: "The date and time of the declaration, stamped on submission.",
    policy: {
      draft: locked("Recorded when the application is submitted."),
      submitted: locked("Recorded when the application was submitted."),
      correction: locked("Recorded when the application was submitted."),
      sanctioned: locked("Recorded when the application was submitted."),
    },
    fields: ["fld_auth_date", "fld_auth_time"],
  },
  bankAccount: {
    about: "The account the project is paid into. Once sanctioned, it changes only by the Joint Secretary's approval.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: withReason("The account a grant is paid into is checked against the bank authorisation letter. Say why it differs."),
      sanctioned: locked("Grants are paid into the account on record for the project. A new account is approved by the Ministry before any payment goes to it.", CHANGE_ROUTES.bankAccounts),
    },
    fields: [
      "bank_ngo_name_declared",
      "bank_joint_operation",
      "bank_hq_at_institution",
      "bank_joint_secretary_head",
      "bank_separate_institution_accounts",
      "fld_bank_name",
      "fld_bank_account_number",
      "fld_bank_ifsc",
      "fld_bank_branch",
      "fld_pfms_registered",
      "fld_bank_rtgs_micr",
      "fld_bank_joint_operators",
      "fld_pfms_code",
      "eat_module_registered",
    ],
  },
  pfmsRecord: {
    about: "The account's PFMS registration as the portal holds it. Read-only on the form.",
    policy: {
      draft: locked("This is the PFMS registration recorded for the account."),
      submitted: locked("This is the PFMS registration recorded for the account."),
      correction: locked("This is the PFMS registration recorded for the account. It changes with the account.", CHANGE_ROUTES.bankAccounts),
      sanctioned: locked("This is the PFMS registration recorded for the account. It changes with the account.", CHANGE_ROUTES.bankAccounts),
    },
    fields: ["fld_pfms_status"],
  },
  projectLocation: {
    about: "Where the project runs. Once sanctioned, a move is verified by the Project Monitoring Unit.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: withReason("The project's location decides its district and its norms. Say why the location differs from the one first given."),
      sanctioned: locked("A sanctioned project's location is verified by the Project Monitoring Unit before it changes.", CHANGE_ROUTES.location),
    },
    fields: [
      "fld_institution_location",
      "fld_institution_pin",
      "fld_project_state",
      "fld_project_district",
      "fld_project_location",
      "fld_site_address",
      "fld_site_landmark",
      "fld_site_city",
      "fld_site_state",
      "fld_site_district",
      "fld_site_location_type",
      "fld_site_pin",
      "fld_location_address",
      "fld_railway_station_bus_stand",
      "govt_institution_within_2km",
    ],
  },
  grantSought: {
    about: "The money requested.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: withReason("A change to the amount requested is examined again. Say why the figure has changed."),
      sanctioned: locked("The amount is fixed by the sanction order."),
    },
    fields: [
      "fld_grant_recurring",
      "fld_grant_non_recurring",
      "fld_annual_recurring_grant",
      "fld_grant_non_recurring_furniture",
      "fld_grant_non_recurring_it",
      "fld_grant_non_recurring_equipment",
      "fld_grant_non_recurring_kitchen",
      "fld_grant_non_recurring_safety",
      "fld_grant_non_recurring_skill_dev",
      "fld_grant_recurring_rent",
      "fld_grant_recurring_food",
      "fld_grant_recurring_salaries",
      "fld_grant_recurring_admin",
    ],
  },
  financialHistory: {
    about: "Grants received before, funds raised, utilisation — the organisation's financial record.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: withReason("The financial record is checked against audited accounts and utilisation certificates. Say what the corrected figure is taken from."),
      sanctioned: locked(SANCTION_REASON),
    },
    fields: [
      "fld_bank_resource_mobilisation",
      "fld_gia_released_last_3yrs",
      "fld_gia_since_year",
      "assistance_3yrs",
      "fld_uc_pending_status",
      "prior_grant_received",
      "self_generated_funds",
      "fld_self_generated_funds_amount",
      "prev_instalment_utilised",
    ],
  },
  beneficiaries: {
    about: "Who the project serves. After sanction the roster is kept on Beneficiaries & Staff.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: EDITABLE,
      sanctioned: locked("A sanctioned project's beneficiaries are kept on its register.", CHANGE_ROUTES.roster),
    },
    fields: [
      "fld_beneficiaries_sc",
      "fld_beneficiaries_other",
      // Calculated on SHRESHTA (SC + other), typed on the other three — `editRuleFor` locks the calculated one.
      "fld_total_beneficiaries",
      "fld_beneficiaries_previous_year",
      "fld_beneficiaries_women",
      "beneficiaries_identified",
      "fld_beneficiaries_prev_year",
      "fld_residents_list",
      "fld_sanctioned_capacity",
      "fld_tg_beneficiaries_details",
    ],
  },
  staff: {
    about: "The people who run the project. After sanction the staff list is kept on Beneficiaries & Staff.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: EDITABLE,
      sanctioned: locked("A sanctioned project's staff are kept on its register.", CHANGE_ROUTES.roster),
    },
    fields: [
      "fld_incharge_name",
      "fld_incharge_qualification",
      "fld_incharge_designation",
      "fld_incharge_mobile",
      "fld_key_staff_1_name",
      "fld_key_staff_1_qualification",
      "fld_key_staff_1_designation",
      "fld_key_staff_1_mobile",
      "fld_key_staff_2_name",
      "fld_key_staff_2_qualification",
      "fld_key_staff_2_designation",
      "fld_key_staff_2_mobile",
      "fld_head_name",
      "fld_head_qualification",
      "fld_head_mobile",
      "fld_head_address",
      "fld_key_person_1_name",
      "fld_key_person_1_qualification",
      "fld_key_person_1_designation",
      "fld_key_person_1_mobile",
      "fld_key_person_1_address",
      "fld_site_incharge_name",
      "fld_site_incharge_qualification",
      "fld_site_incharge_designation",
      "fld_site_incharge_mobile",
      "fld_site_incharge_email",
      "fld_staff_project_director_name",
      "fld_staff_project_director_qualification",
      "fld_staff_project_manager_name",
      "fld_staff_project_manager_qualification",
      "fld_staff_accountant_name",
      "fld_staff_accountant_qualification",
      "fld_staff_bridge_coordinator_name",
      "fld_staff_bridge_coordinator_qualification",
      "fld_staff_counsellor_name",
      "fld_staff_counsellor_qualification",
      "fld_staff_doctor_name",
      "fld_staff_doctor_qualification",
      "fld_staff_cook_name",
      "fld_staff_cook_qualification",
      "fld_staff_multi_task_name",
      "fld_staff_multi_task_qualification",
      "fld_staff_sweeper_name",
      "fld_staff_sweeper_qualification",
      "fld_staff_watchman_1_name",
      "fld_staff_watchman_1_qualification",
      "fld_staff_watchman_2_name",
      "fld_staff_watchman_2_qualification",
      "fld_staff_watchman_3_name",
      "fld_staff_watchman_3_qualification",
      "fld_functionary_1_name",
      "fld_functionary_1_qualification",
      "fld_functionary_1_designation",
      "fld_functionary_1_mobile",
      "fld_ddac_chief_name",
      "fld_ddac_chief_qualification",
      "fld_ddac_chief_designation",
      "fld_ddac_chief_mobile",
      "fld_managing_committee_note",
      "fld_pmc_composition",
      "fld_strength_outreach_workers",
    ],
  },
  projectProfile: {
    about: "What kind of institution or project it is and when it began.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: withReason("The nature and history of the project are checked against its records. Say what the corrected answer is taken from."),
      sanctioned: locked(SANCTION_REASON),
    },
    fields: [
      "fld_nature_of_institution",
      "fld_institution_gender_type",
      "fld_institution_level",
      "fld_commencement_date",
      "fld_date_of_commencement",
      "fld_year_of_commencement_gia",
      "fld_name_of_project",
      "project_recognized_by_state",
      "fld_functional_status",
      "is_running_institution",
      "fld_startup_company_name",
      "startup_registered_niti",
      "moa_includes_senior_citizens",
      "moa_includes_addiction",
    ],
  },
  premises: {
    about: "The building and its facilities. These change over time and are seen at inspection.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: EDITABLE,
      sanctioned: withReason("A change to the premises is checked at the next inspection. Say what has changed."),
    },
    fields: [
      "fld_building_ownership",
      "fld_infra_area_sqft",
      "fld_infra_rooms",
      "fld_infra_toilets",
      "infra_kitchen",
      "infra_open_area",
      "fld_premises_office_area_sqm",
      "fld_premises_ownership",
      "fld_rent_particulars",
      "building_utilized_exclusively",
      "fld_area_of_building_sqm",
      "fld_no_of_rooms",
      "fld_no_of_class_rooms",
      "fld_no_of_veranda",
      "fld_no_of_toilets",
      "fld_details_of_usages",
      "kitchen_facilities",
      "fld_kitchen_details",
      "fld_toilet_details",
      "hygiene_maintained",
      "fld_hygiene_details",
      "open_area_available",
      "counselling_room",
      "fld_counselling_room_details",
    ],
  },
  cctv: {
    about: "Cameras and the live feed an inspecting officer opens.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: EDITABLE,
      sanctioned: locked("A sanctioned project's cameras are registered on its CCTV setup, which the inspecting officer reads.", CHANGE_ROUTES.cctv),
    },
    fields: ["camera_live_feed", "has_live_feed_url", "fld_live_feed_url"],
  },
  proposal: {
    about: "The written case for the grant — justification, experience, track record, strategy.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: EDITABLE,
      sanctioned: locked(SANCTION_REASON),
    },
    fields: [
      "fld_other_justification",
      "fld_services_available_in_district",
      "fld_distance_to_nearest_similar",
      "fld_org_geographical_coverage",
      "fld_org_area_specialisation",
      "fld_org_tg_experience",
      "fld_org_govt_projects",
      "fld_org_profile_writeup",
      "fld_strength_convergence",
      "fld_strength_tg_rehabilitated",
      "fld_proj_tg_id_handheld",
      "fld_proj_rehab_strategies",
      "fld_track_nature_of_work",
      "fld_track_period_from",
      "fld_track_period_to",
      "fld_track_coverage",
      "fld_track_outcome",
      "fld_track_funding",
      "fld_prior_projects_other",
    ],
  },
  declarations: {
    about: "Statements the organisation is bound by. Made again with each instalment claim.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: withReason("A declaration is a statement the organisation is bound by. Say why it has changed."),
      sanctioned: locked("Declarations are made again with the next instalment claim.", CHANGE_ROUTES.newApplication),
    },
    fields: [
      "decl_uc_uploaded",
      "decl_audited_accounts_submitted",
      "decl_name_changed_after_grant",
      "decl_not_for_profit",
      "decl_other_grant",
      "decl_fee_charged",
      "decl_not_blacklisted",
      "decl_annual_report_uploaded",
      "decl_all_docs_signed",
      "decl_no_money_from_beneficiaries",
      "decl_records_accurate",
      "decl_no_encumbrance",
      "decl_audit_access",
      "decl_economy",
      "decl_progress_reports",
      "decl_own_contribution",
      "decl_reservation",
      "decl_no_duplicate_grant",
      "decl_separate_account",
      "decl_pfms_eat",
    ],
  },
  signatory: {
    about: "The person who signs the declaration for the organisation.",
    policy: {
      draft: EDITABLE,
      submitted: UNDER_EXAMINATION,
      correction: withReason("The authorised person signs for the organisation. Say why the signatory's details have changed."),
      sanctioned: withReason("The authorised person signs for the organisation. Say why the signatory's details have changed."),
    },
    fields: ["fld_auth_person_name", "fld_auth_person_contact", "fld_auth_place", "fld_auth_person_designation", "fld_auth_person_email"],
  },
} as const satisfies Record<string, Group>;

export type EditGroupId = keyof typeof EDIT_GROUPS;

/** Field name → its group. Built once; a field in two groups is a defect the test reports. */
export const FIELD_GROUP: ReadonlyMap<string, EditGroupId> = new Map(
  (Object.entries(EDIT_GROUPS) as [EditGroupId, Group][]).flatMap(([id, g]) => g.fields.map((f) => [f, id] as const)),
);

/** The stage an application's answers are at. `null` for a closed file, where nothing changes. */
export function editStageOf(status: AppStatus): EditStage | null {
  switch (status) {
    case "Draft":
      return "draft";
    case "DeficiencyRaised":
      return "correction";
    case "Sanctioned":
    case "Released":
      return "sanctioned";
    case "Rejected":
      return null;
    default:
      return "submitted";
  }
}

const CLOSED: EditRule = locked("The application is closed. Nothing on it can be changed.");

/**
 * The rule for one field at one stage. `undefined` only for a field no group lists — which the
 * test forbids for every field the wizards define, so a screen may treat it as a defect.
 */
export function editRule(fieldName: string, stage: EditStage | null): EditRule | undefined {
  const group = FIELD_GROUP.get(fieldName);
  if (!group) return undefined;
  if (stage === null) return CLOSED;
  return EDIT_GROUPS[group].policy[stage];
}

/**
 * The rule for a field as a particular scheme's form defines it. A field name shared by schemes is
 * calculated on some and typed on others (`fld_total_beneficiaries`), and a calculated answer is
 * never typed, whatever its group says.
 */
export function editRuleFor(field: Pick<FieldDef, "name" | "auto">, stage: EditStage | null): EditRule | undefined {
  if (field.auto && stage !== null) return EDIT_GROUPS.derived.policy[stage];
  return editRule(field.name, stage);
}

/** A field as `schemeCode`'s own form defines it. */
export function fieldDefOf(schemeCode: string, fieldName: string): FieldDef | undefined {
  return wizardFor(schemeCode)
    ?.steps.flatMap((st) => st.sections.flatMap((sec) => sec.fields))
    .find((f) => f.name === fieldName);
}

/**
 * The rule for an answer on a particular file. One refinement over `editRuleFor`: a correction on a
 * CLAIM against a sanctioned project (a 2nd or 3rd instalment) is still bound by the sanctioned
 * project's record, so whatever is locked once sanctioned — the bank account, the location, the
 * grant — stays locked while the claim is corrected, and says where it is changed instead.
 */
export function editRuleOnFile(app: Pick<GrantApplication, "schemeCode" | "status" | "instalment">, fieldName: string): EditRule | undefined {
  const field = fieldDefOf(app.schemeCode, fieldName) ?? { name: fieldName };
  const stage = editStageOf(app.status);
  const rule = editRuleFor(field, stage);
  if (stage !== "correction" || !app.instalment) return rule;
  const onRecord = editRuleFor(field, "sanctioned");
  return onRecord?.kind === "locked" ? onRecord : rule;
}

/** The applicant may type a new answer (with or without a reason). */
export function canEdit(rule: EditRule | undefined): boolean {
  return rule?.kind === "editable" || rule?.kind === "editable-with-reason";
}

/* ── What changed ─────────────────────────────────────────────────────────── */

export interface ChangedAnswer {
  fieldName: string;
  label: string;
  from: string;
  to: string;
  reason?: string;
}

/**
 * The answers that differ between two readings of a form, labelled. `labelOf` names a field; a
 * field it cannot name keeps its field name, so a change is never dropped for want of a label.
 */
export function changedAnswers(
  before: Readonly<Record<string, string>>,
  after: Readonly<Record<string, string>>,
  labelOf: (fieldName: string) => string | undefined,
  reasons: Readonly<Record<string, string | undefined>> = {},
): ChangedAnswer[] {
  const names = new Set([...Object.keys(before), ...Object.keys(after)]);
  const out: ChangedAnswer[] = [];
  for (const name of names) {
    const from = (before[name] ?? "").trim();
    const to = (after[name] ?? "").trim();
    if (from === to) continue;
    out.push({ fieldName: name, label: labelOf(name) ?? name, from, to, ...(reasons[name] ? { reason: reasons[name] } : {}) });
  }
  return out;
}

/**
 * An application with one answer changed, and everything calculated from its answers brought into
 * line: the form's own totals, and the figures the registers and the review read (beneficiaries,
 * grant sought). A corrected recurring grant that left "Total Grant Sought" and the officer's
 * summary at the old figure would put two answers to one question on the file.
 *
 * Only for a file that is not claiming a sanctioned instalment — an instalment's figures come from
 * the sanction, and the policy locks them.
 */
export function applyAnswer(app: GrantApplication, fieldName: string, value: string): GrantApplication {
  const wizard = wizardFor(app.schemeCode);
  const raw = { ...(app.formValues ?? {}), [fieldName]: value };
  const values = wizard ? applyAllAutoFields(wizard, raw) : raw;
  if (app.instalment) return { ...app, formValues: values };
  const people = beneficiariesOf(values);
  const n = (k: string) => Number(values[k] || 0) || 0;
  const recurring = n("fld_grant_recurring") || n("fld_annual_recurring_grant") || app.recurring;
  const nonRecurring = values.fld_grant_non_recurring != null ? n("fld_grant_non_recurring") : app.nonRecurring;
  return {
    ...app,
    formValues: values,
    scBeneficiaries: values.fld_beneficiaries_sc != null ? people.sc : app.scBeneficiaries,
    otherBeneficiaries: values.fld_beneficiaries_other != null ? people.other : app.otherBeneficiaries,
    totalBeneficiaries: people.total || app.totalBeneficiaries,
    recurring,
    nonRecurring,
    total: n("fld_grant_total") || recurring + nonRecurring,
  };
}

/** One line per change for the audit trail's remarks: "Label: 227 → 220 (reason: …)". */
export function changesForAudit(changes: readonly ChangedAnswer[]): string {
  return changes
    .map((c) => `${c.label}: ${c.from || "not answered"} → ${c.to || "not answered"}${c.reason ? ` (reason: ${c.reason.replace(/[.\s]+$/, "")})` : ""}`)
    .join("; ");
}
