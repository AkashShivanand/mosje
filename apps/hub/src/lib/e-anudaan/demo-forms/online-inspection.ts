/**
 * Schedule an online inspection (BharatVC) — every grade above the Assistant Section Officer,
 * Programme Division, every Integrated Finance Division grade and the Programme Director, from
 * "More Actions" on the review screen. Its rules (officer-forms.ts `onlineInspectionError`): a
 * title; a date and start time; a start later than now; an end later than the start.
 *
 * Values: `title`, `description`; `date` — "", "today" or "+N" days; `start`, `end` — "HH:MM".
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

const valid = {
  title: "Verification of Residents and Staff",
  description: "A video walk-through of the dormitories, kitchen and attendance register with the Superintendent, to verify the number of beneficiaries claimed.",
  date: "+7",
  start: "11:00",
  end: "12:00",
};

export const ONLINE_INSPECTION: DemoFormDef = {
  id: "online-inspection",
  title: "Schedule Online Inspection",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Schedule", valid: true, values: valid },
    { id: "no-title", label: "Title Left Out", values: { ...valid, title: "" } },
    { id: "no-date", label: "Date Left Out", values: { ...valid, date: "" } },
    { id: "past-start", label: "Start Not Later Than Now", values: { ...valid, date: "today", start: "00:00", end: "00:30" } },
    { id: "end-before-start", label: "End Before the Start", values: { ...valid, start: "12:00", end: "11:00" } },
  ],
};
