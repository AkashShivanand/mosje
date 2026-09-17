/**
 * Weekly Attendance (`/ngo/attendance`, the Weekly Attendance tab). The register has no field that
 * can be left wrong; it enforces two rules instead, and each preset shows one:
 *
 *  • nothing is presumed present — an unmarked person is certified absent, and Submit shows the
 *    totals being certified before it records them;
 *  • a day that has not come yet cannot be marked, and the totals count only the days so far.
 *
 * Values: `who` — "beneficiaries" or "staff"; `week` — "current" or "previous"; `marks` — "all-but-two"
 * (everyone present on every open day but two absences), "none", or "whole-week" (an attempt to
 * mark all seven days); `confirm` — "yes" opens the confirmation that Submit Week shows.
 */

import type { DemoFormDef } from "./index.ts";

const valid = { who: "beneficiaries", week: "previous", marks: "all-but-two", confirm: "" };

export const WEEKLY_ATTENDANCE: DemoFormDef = {
  id: "weekly-attendance",
  title: "Weekly Attendance",
  path: /^\/ngo\/attendance\/?$/,
  presets: [
    { id: "valid", label: "Last Week Marked", valid: true, values: valid },
    { id: "nothing-marked", label: "Nothing Marked, Certified Absent", values: { ...valid, marks: "none", confirm: "yes" } },
    { id: "days-to-come", label: "Days Still to Come", values: { ...valid, week: "current", marks: "whole-week", confirm: "yes" } },
  ],
};
