/**
 * Schedule an inspection — the PMU field officer, on an assignment awaiting a date (Inspection
 * Dashboard and PMU Inspections). Its rule (officer-forms.ts `inspectionScheduleError`): the visit
 * date is required.
 *
 * Values: `date` — "" or "+N" days; `visitType` — "Physical" or "Online".
 */

import type { DemoFormDef } from "./index.ts";

export const PMU_INSPECTION_PATH = /^\/dashboard\/(pmu\/field|sm2\/pmu)\/?$/;

const valid = { date: "+10", visitType: "Physical" };

export const INSPECTION_SCHEDULE: DemoFormDef = {
  id: "inspection-schedule",
  title: "Schedule Inspection",
  path: PMU_INSPECTION_PATH,
  presets: [
    { id: "valid", label: "Correct Schedule", valid: true, values: valid },
    { id: "no-date", label: "Visit Date Left Out", values: { ...valid, date: "" } },
  ],
};
