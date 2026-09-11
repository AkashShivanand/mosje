/**
 * Skill & Training enrolments, and the Comprehensive Rehabilitation register.
 *
 * Both are read-only on the web — the rehabilitation form is captured by the
 * Implementing Agency in the field app — so neither screen offers an edit path,
 * and the Rehab Data page says so in its own sentence rather than leaving a
 * reader hunting for a control that is not there.
 */
import { BENEFICIARIES, SHELTER_HOMES, SURVEY_LOCATIONS } from "./mock-data";

export interface SkillTrainingRow {
  id: string;
  name: string;
  gender: string;
  age: number;
  duration: string;
  course: string;
  surveyLocation: string;
  shelter: string;
  state: string;
  district: string;
  status: "Completed" | "Ongoing" | "Dropped";
}

const COURSES = [
  ["Hospitality Assistant", "3 months"],
  ["Retail Sales Associate", "3 months"],
  ["Tailoring", "6 months"],
  ["Housekeeping", "2 months"],
  ["Driving (LMV)", "4 months"],
  ["Electrical Assistant", "6 months"],
  ["Relocated to Family", "—"],
];

const ST_STATUS: SkillTrainingRow["status"][] = ["Completed", "Ongoing", "Ongoing", "Completed", "Dropped"];

export const SKILL_TRAINING: SkillTrainingRow[] = BENEFICIARIES.filter(
  (b) => b.status === "REHABILITATED" || b.status === "SHELTER_ASSIGNED",
).map((b, i) => {
  const [course, duration] = COURSES[i % COURSES.length]!;
  return {
    id: b.id,
    name: b.name,
    gender: b.gender,
    age: b.age,
    duration: duration!,
    course: course!,
    surveyLocation: SURVEY_LOCATIONS[i % SURVEY_LOCATIONS.length]!.name,
    shelter: SHELTER_HOMES[i % SHELTER_HOMES.length]!.name,
    state: b.state,
    district: b.district,
    status: ST_STATUS[i % ST_STATUS.length]!,
  };
});

export type RehabType = "Wage Employment" | "Self Employment" | "Skill Training";
export type FollowUp = "Active" | "3-month due" | "Lost to Follow-up" | "Relapsed";

export interface RehabRow {
  id: string;
  beneficiary: string;
  gender: string;
  age: number;
  type: RehabType;
  category: string;
  state: string;
  district: string;
  followUp: FollowUp;
  capturedOn: string;
  year: string;
}

const TYPES: RehabType[] = ["Wage Employment", "Self Employment", "Skill Training"];
const FOLLOW: FollowUp[] = ["Active", "3-month due", "Lost to Follow-up", "Relapsed"];
const CATEGORY: Record<RehabType, string> = {
  "Wage Employment": "Hospitality",
  "Self Employment": "Tea stall",
  "Skill Training": "Hospitality Assistant",
};

export const REHAB_DATA: RehabRow[] = BENEFICIARIES.filter(
  (b) => b.status === "REHABILITATED",
).map((b, i) => {
  const type = TYPES[i % TYPES.length]!;
  const year = String(2026 - (i % 3));
  return {
    id: `${b.id}-${i + 1}`,
    beneficiary: `${b.name} · ${b.age}y · ${b.gender}`,
    gender: b.gender,
    age: b.age,
    type,
    category: CATEGORY[type],
    state: b.state,
    district: b.district,
    followUp: FOLLOW[i % FOLLOW.length]!,
    capturedOn: `${year}-0${1 + (i % 8)}-${String(1 + (i % 27)).padStart(2, "0")}`,
    year,
  };
});
