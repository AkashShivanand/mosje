/**
 * What a submitted form becomes: which project it belongs to, what it is called, how many it
 * serves, and the documents that went with it.
 *
 * The full-wizard walk of 13 Sep 2026 submitted all seven scheme paths and read the records back.
 * Every one had been filed against the NGO's FIRST project whatever was chosen or created, a
 * NAPDDR application recorded 0 beneficiaries because its form asks under a different field, and
 * every uploaded document was dropped on submit — the application page read "0 of 0 uploaded".
 */

import { uploadGate, withYearCheck, type UploadedDoc } from "./doc-verification.ts";
import {
  errorSummary,
  validateStep,
  visibleDocuments,
  visibleSteps,
  type DocDef,
  type WizardDef,
} from "./form-schema.ts";
import { STATE_CODES } from "./geography.ts";
import type { Institution, MockDoc, NgoProfile } from "./types.ts";

/** The first segment of a Project ID, per scheme — the convention the forms already use. */
export const PROJECT_ID_PREFIX: Readonly<Record<string, string>> = { SHRESHTA_M2: "SC", AVYAY: "SR", NAPDDR: "DR", SMILE: "TG" };

/**
 * What a new project under each scheme IS. A SHRESHTA project is a school; the others are not,
 * and filing a new senior citizens' home as a "Secondary Residential School" was the same
 * contradiction the seed had (screen QA, 13 Sep 2026).
 */
export const PROJECT_NATURE_BY_SCHEME: Readonly<Record<string, Institution["nature"]>> = {
  SHRESHTA_M2: "Secondary Residential School",
  AVYAY: "Senior Citizens' Home",
  NAPDDR: "Integrated Rehabilitation Centre for Addicts",
  SMILE: "Garima Greh (Shelter Home for Transgender Persons)",
};

const RENEWAL_PROJECT_FIELDS =["fld_renewal_project", "fld_ongoing_source_application", "fld_smile_project_select"];

const abbreviate = (s: string, n: number) =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .padEnd(n, s.replace(/\s+/g, "").toUpperCase().slice(1))
    .slice(0, n);

export interface SubmittedProject {
  institutionId: string;
  /** A project created by this application, to be added to the NGO. */
  created?: Institution;
  label: string;
}

/**
 * The project an application is filed under. A renewal names its project on step 1 (the value
 * opens with its Project ID); SHRESHTA asks for the institution's ID directly; anything else is
 * a new project and gets a new ID in the scheme / State / district / serial form the call
 * described (T154).
 */
export function projectForSubmission(
  ngo: NgoProfile,
  schemeCode: string,
  values: Record<string, string>,
  serial: number,
): SubmittedProject {
  const code = schemeCode.toUpperCase();
  const fy = values.fld_financial_year ?? "2026-27";
  const named = RENEWAL_PROJECT_FIELDS.map((f) => values[f]).find(Boolean) ?? values.fld_project_id ?? values.fld_institution_id;
  const existingId = named?.split(" — ")[0]?.trim();
  const known = existingId ? ngo.institutions.find((i) => i.id === existingId) : undefined;
  const title = values.fld_project_title?.trim();

  if (existingId && (known || /^[A-Z]{2}\/[A-Z]{2}\/[A-Z]{3}\/\d+$/.test(existingId))) {
    // The option text trails notes meant for the picker ("· awaiting sanction", "· last applied
    // FY 2025-26"); the project's name is what comes before them.
    const fromOption = named!.split(" — ")[1]?.split(" · ")[0]?.trim();
    const name = known ? `${known.name} — ${known.district}` : (fromOption || title || existingId);
    return { institutionId: existingId, label: `${name} · FY ${fy}` };
  }

  const state = values.fld_site_state || values.fld_project_state || values.fld_reg_office_state || ngo.state;
  const district = values.fld_site_district || values.fld_project_district || values.fld_reg_office_district || ngo.district;
  const id = `${PROJECT_ID_PREFIX[code] ?? code.slice(0, 2)}/${STATE_CODES[state] ?? abbreviate(state, 2)}/${district.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase()}/${String(serial).padStart(5, "0")}`;
  const name = title || `${code.replace("_M2", "")} Project`;
  return {
    institutionId: id,
    created: {
      id,
      name,
      district,
      state,
      nature: PROJECT_NATURE_BY_SCHEME[code] ?? "Secondary Residential School",
      type: "Co-Ed",
      level: "Secondary",
      building: values.fld_building_ownership?.startsWith("Rent") ? "Rented" : "Owned",
      pin: values.fld_institution_pin || values.fld_site_pin || "",
    },
    label: `${name} — ${district} · FY ${fy}`,
  };
}

/**
 * Whether an application is New or Ongoing, from the answers — never from one scheme's field.
 *
 * AVYAY, NAPDDR and SMILE ask it (`case_type`). SHRESHTA Mode 2 does not ask it at all: it
 * asks the Status of Institution and whether assistance has been received for the last three
 * years. Reading only `case_type` filed a SHRESHTA institution marked Ongoing, with three years
 * of grants, as a New case (form-path QA, 13 Sep 2026).
 */
export function caseTypeOf(values: Record<string, string>): "New" | "Ongoing" {
  const caseType = values.case_type ?? "";
  if (caseType) return /ongoing|renewal|existing/i.test(caseType) ? "Ongoing" : "New";
  if (values.fld_institution_status === "Ongoing" || values.assistance_3yrs === "Yes") return "Ongoing";
  return "New";
}

/** Beneficiaries, from whichever field this scheme asks it under. */
export function beneficiariesOf(values: Record<string, string>): { sc: number; other: number; total: number } {
  const n = (k: string) => Number(values[k] || 0) || 0;
  const sc = n("fld_beneficiaries_sc");
  const other = n("fld_beneficiaries_other");
  const total = n("fld_total_beneficiaries") || n("fld_target_beneficiaries") || n("fld_sanctioned_strength") || sc + other;
  return { sc, other, total };
}

/** The uploads, as the documents the application carries into review. */
export function documentsOf(
  docs: readonly DocDef[],
  uploaded: Record<number, UploadedDoc>,
  id: (prefix: string) => string,
  now: string,
): MockDoc[] {
  return docs.map((d, i) => {
    const up = uploaded[d.n];
    return {
      id: id("doc"),
      slot: i + 1,
      title: d.title,
      group: "annual",
      optional: d.optional,
      conditional: d.note,
      reviewStatus: "Pending",
      ...(up ? { fileName: up.fileName, sizeKb: up.sizeKb, uploadedAt: now, aiVerdict: up.verdict } : {}),
    };
  });
}

/**
 * The whole application checked as the wizard walks it, every visible step in order.
 *
 * The wizard only validated the step it was leaving, and Submit only checked the declaration.
 * Opening `…/scheme/NAPDDR/review` directly, or `?step=7`, and ticking the declaration filed an
 * application with ₹0, no answers and no documents into the Programme Division's queue (serious
 * audit S01, 14 Sep 2026). Submit and every forward move now run this over each step before the
 * one being moved to, and the applicant is taken to the first step that fails.
 *
 * `beforeIndex` limits the check to the steps before a target; leave it out to check them all.
 */
export type ApplicationCheck =
  | { ok: true }
  | { ok: false; stepIndex: number; errors: Record<string, string>; reason: string };

export function checkApplication(
  wizard: WizardDef,
  values: Record<string, string>,
  uploaded: Record<number, UploadedDoc>,
  beforeIndex = Number.POSITIVE_INFINITY,
  today?: string,
): ApplicationCheck {
  const steps = visibleSteps(wizard, values);
  for (let i = 0; i < steps.length && i < beforeIndex; i++) {
    const step = steps[i]!;
    if (step.kind === "review") continue;
    if (step.kind === "documents") {
      const list = visibleDocuments(wizard, values);
      const gate = uploadGate(list, withYearCheck(list, uploaded, values.fld_financial_year));
      if (gate.blocked) return { ok: false, stepIndex: i, errors: {}, reason: gate.reason ?? "Upload the documents to proceed." };
      continue;
    }
    const errors = validateStep(step, values, today);
    if (Object.keys(errors).length > 0) {
      return { ok: false, stepIndex: i, errors, reason: errorSummary(step, errors) ?? "" };
    }
  }
  return { ok: true };
}
