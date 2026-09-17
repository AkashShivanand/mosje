/**
 * Record an inspection — the PMU field officer, on a scheduled visit. Its rules (officer-forms.ts
 * `inspectionReportErrors`): the findings and a recommendation are required; the report is read
 * back before it is submitted.
 *
 * Values: `findings`; `recommendation` — "Satisfactory", "Needs improvement", "Unsatisfactory" or "".
 */

import type { DemoFormDef } from "./index.ts";
import { PMU_INSPECTION_PATH } from "./inspection-schedule.ts";

const valid = {
  findings:
    "The institution was visited on the scheduled date. 58 of the 60 residents were present and the attendance register agrees with the claim. The kitchen, dormitories and toilets were clean, and the fire extinguishers were within their service date. The Superintendent and two wardens were on duty.",
  recommendation: "Satisfactory",
};

export const INSPECTION_REPORT: DemoFormDef = {
  id: "inspection-report",
  title: "Record Inspection",
  path: PMU_INSPECTION_PATH,
  presets: [
    { id: "valid", label: "Correct Report", valid: true, values: valid },
    { id: "no-findings", label: "Findings Left Out", values: { ...valid, findings: "" } },
    { id: "no-recommendation", label: "Recommendation Not Selected", values: { ...valid, recommendation: "" } },
  ],
};
