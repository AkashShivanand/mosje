/**
 * One-click fills for the e-Anudaan forms outside the grant application — the demo dock's Fill tab
 * on every page that has a form.
 *
 * The grant wizard has its own, richer panel (demo-scenarios.ts, sample-files.ts). Every other form
 * registers here: for each, ONE correct fill and one preset per rule the form enforces, so a
 * reviewer can see the valid submission and every message without typing.
 *
 * HOW A FORM TAKES PART. A preset is data — `values`, keyed by names the form itself chooses — and
 * the form applies it: `useDemoFormFill(formId, apply)` (components/e-anudaan/use-demo-form-fill.ts)
 * hands the preset to a callback that sets the form's own state, opens its dialog if it has one, and
 * shows its errors for a rule preset. Values that depend on the seeded records (which project, which
 * account) are named by the ROLE they play — `project: "free"`, `project: "pending"` — and the form
 * resolves them, so a reseeded store does not break a preset.
 *
 * Adding a form: write `demo-forms/<form>.ts` exporting a `DemoFormDef`, add it to FORMS below, and
 * call the hook in the form. The test beside this file checks ids and that every form has one
 * correct fill.
 */

import { BANK_ACCOUNT_CHANGE } from "./bank-account-change.ts";
import { CCTV_CAMERA, CCTV_CERTIFICATE, CCTV_RECORDS, CCTV_UPTIME } from "./cctv.ts";
import { CORRECT_APPLICATION } from "./correct-application.ts";
import { PROJECT_LOCATION_CHANGE } from "./project-location-change.ts";
import { ADD_BENEFICIARY, ADD_EMPLOYEE } from "./roster.ts";
import { UTILISATION_CERTIFICATE } from "./utilisation-certificate.ts";
import { WEEKLY_ATTENDANCE } from "./weekly-attendance.ts";

export const DEMO_FORM_FILL_EVENT = "e-anudaan:demo-form-fill";

export interface DemoFormPreset {
  id: string;
  /** Title Case. For a rule preset, the rule it trips — "Reason Left Out". */
  label: string;
  /** The one correct fill; every form has exactly one. */
  valid?: boolean;
  /** Keys and meanings are the form's own. */
  values: Readonly<Record<string, string>>;
}

export interface DemoFormDef {
  id: string;
  /** Title Case; the heading the panel shows the presets under. */
  title: string;
  /** The routes the form is on, below `/portals/e-anudaan`. */
  path: RegExp;
  presets: readonly DemoFormPreset[];
}

export interface DemoFormFillDetail {
  formId: string;
  preset: DemoFormPreset;
}

export const FORMS: readonly DemoFormDef[] = [
  PROJECT_LOCATION_CHANGE,
  BANK_ACCOUNT_CHANGE,
  ADD_BENEFICIARY,
  ADD_EMPLOYEE,
  WEEKLY_ATTENDANCE,
  CCTV_CAMERA,
  CCTV_CERTIFICATE,
  CCTV_RECORDS,
  CCTV_UPTIME,
  CORRECT_APPLICATION,
  UTILISATION_CERTIFICATE,
];

/** The forms on this page, in the order the page shows them. */
export function formsForPath(pathname: string | null): DemoFormDef[] {
  const rest = (pathname ?? "").replace(/^\/portals\/e-anudaan/, "");
  return FORMS.filter((f) => f.path.test(rest));
}
