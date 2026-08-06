if (process.env.NODE_ENV === "production") {
  throw new Error(
    "[smile-admin] mock-data.ts must not be imported in production. " +
    "Replace all imports with real API calls before deploying."
  );
}

import { STATES } from "./states";

/* ---------- KPI / Programme Overview ---------- */
export interface ProgrammeKpi {
  identified: number;
  mobilised: number;
  shelterAssigned: number;
  rehabilitated: number;
  fundDisbursed: number;
  fundUtilised: number;
}

export const PROGRAMME_KPI_ALL_INDIA: ProgrammeKpi = {
  identified: 19810,
  mobilised: 4316,
  shelterAssigned: 1248,
  rehabilitated: 2084,
  fundDisbursed: 7_24_60_000,
  fundUtilised: 5_92_30_000,
};

export const PROGRAMME_KPI_MAHARASHTRA: ProgrammeKpi = {
  identified: 4120,
  mobilised: 1820,
  shelterAssigned: 642,
  rehabilitated: 416,
  fundDisbursed: 1_28_40_000,
  fundUtilised: 96_70_000,
};

export const PROGRAMME_KPI_NEW_DELHI: ProgrammeKpi = {
  identified: 1284,
  mobilised: 720,
  shelterAssigned: 312,
  rehabilitated: 188,
  fundDisbursed: 56_20_000,
  fundUtilised: 42_60_000,
};

/* ---------- System users rail ---------- */
export interface SystemUserStat { label: string; value: number; icon: "state" | "district" | "agency" | "surveyor" | "shelter"; }

export const SYSTEM_USERS_ALL: SystemUserStat[] = [
  { label: "State Users", value: 36, icon: "state" },
  { label: "District Users", value: 248, icon: "district" },
  { label: "Agencies", value: 112, icon: "agency" },
  { label: "Surveyors", value: 1_286, icon: "surveyor" },
  { label: "Shelter Homes", value: 312, icon: "shelter" },
];

/* ---------- State-wise beneficiary distribution ---------- */
export interface StateRow { stateId: number; state: string; count: number; }

export const STATE_DISTRIBUTION: StateRow[] = [
  { stateId: 14, state: "Maharashtra", count: 4120 },
  { stateId: 7, state: "Gujarat", count: 3210 },
  { stateId: 12, state: "Kerala", count: 1850 },
  { stateId: 23, state: "Tamil Nadu", count: 1640 },
  { stateId: 21, state: "Rajasthan", count: 1480 },
  { stateId: 11, state: "Karnataka", count: 1310 },
  { stateId: 26, state: "Uttar Pradesh", count: 1240 },
  { stateId: 24, state: "Telangana", count: 1090 },
  { stateId: 13, state: "Madhya Pradesh", count: 980 },
  { stateId: 28, state: "West Bengal", count: 920 },
  { stateId: 4, state: "Bihar", count: 840 },
  { stateId: 19, state: "Odisha", count: 610 },
  { stateId: 5, state: "Chhattisgarh", count: 420 },
  { stateId: 10, state: "Jharkhand", count: 380 },
  { stateId: 33, state: "Delhi", count: 1284 },
  { stateId: 8, state: "Haryana", count: 290 },
  { stateId: 20, state: "Punjab", count: 240 },
];

/* ---------- Survey activity (last 30 days) ---------- */
export interface DailyPoint { date: string; identified: number; mobilised: number; rehabilitated: number; }

function shiftDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export const SURVEY_ACTIVITY: DailyPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = 29 - i;
  const base = 4 + Math.sin(i / 4) * 6;
  const peak = i === 27 ? 73 : i === 25 ? 12 : 0;
  return {
    date: shiftDate(day),
    identified: Math.max(0, Math.round(base + peak)),
    mobilised: Math.max(0, Math.round(base * 0.55 + peak * 0.4)),
    rehabilitated: Math.max(0, Math.round(base * 0.18 + peak * 0.12)),
  };
});

/* ---------- Shelter homes by state ---------- */
export const SHELTER_HOMES_BY_STATE = STATES.slice(0, 18).map((s, i) => ({
  state: s.name,
  count: [4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][i] ?? Math.floor(Math.random() * 4),
}));

/* ---------- Beneficiary profile breakdowns ---------- */
export const GENDER_DISTRIBUTION = [
  { name: "Male", value: 10843, color: "var(--ds-chart-cat-8)" },
  { name: "Female", value: 7156, color: "var(--ds-chart-cat-10)" },
  { name: "Transgender / Other", value: 1811, color: "var(--ds-chart-cat-6)" },
];

export const AGE_DISTRIBUTION = [
  { band: "0–17", value: 1240 },
  { band: "18–25", value: 2980 },
  { band: "26–40", value: 6420 },
  { band: "41–60", value: 5810 },
  { band: "60+", value: 3360 },
];

export const BEGGAR_TYPE = [
  { type: "Adult", value: 14680 },
  { type: "Senior Citizen", value: 3360 },
  { type: "Minor", value: 1240 },
  { type: "Person with Disability", value: 530 },
];

/* ---------- Beneficiary table ---------- */
export type BeneficiaryStatus =
  | "IDENTIFIED"
  | "UNDER_MOBILIZATION"
  | "MOBILIZED"
  | "SHELTER_ASSIGNED"
  | "REHABILITATED";

export interface Beneficiary {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Transgender";
  status: BeneficiaryStatus;
  stateId: number;
  state: string;
  districtId: number;
  district: string;
  ia: string | null;
  type: "Adult" | "Minor" | "Senior";
  aadhaar: string;
}

const DISTRICT_LOOKUP: Record<number, [number, string][]> = {
  14: [[1401, "Mumbai"], [1402, "Thane"], [1403, "Pune"], [1404, "Nagpur"], [1405, "Nashik"]],
  7: [[701, "Ahmedabad"], [702, "Surat"], [703, "Vadodara"]],
  11: [[1102, "Mysuru"], [1103, "Mangaluru"], [1101, "Bengaluru Urban"]],
  33: [[3301, "New Delhi"], [3303, "South Delhi"], [3304, "East Delhi"]],
  12: [[1201, "Thiruvananthapuram"], [1202, "Kochi"]],
  23: [[2301, "Chennai"], [2302, "Coimbatore"]],
};

const STATUSES: BeneficiaryStatus[] = [
  "IDENTIFIED", "UNDER_MOBILIZATION", "MOBILIZED", "SHELTER_ASSIGNED", "REHABILITATED",
];

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const BENEFICIARIES: Beneficiary[] = Array.from({ length: 96 }).map((_, i) => {
  const stateOptions = [14, 7, 11, 33, 12, 23, 21, 24, 13];
  const sId = stateOptions[Math.floor(rand(i + 1) * stateOptions.length)]!;
  const districts = DISTRICT_LOOKUP[sId] ?? [[sId * 100 + 1, "District 1"]];
  const [dId, dName] = districts[Math.floor(rand(i + 2) * districts.length)]!;
  const state = STATES.find((s) => s.id === sId)?.name ?? "—";
  const age = 18 + Math.floor(rand(i + 3) * 60);
  const genderRoll = rand(i + 4);
  const gender: Beneficiary["gender"] = genderRoll < 0.55 ? "Male" : genderRoll < 0.9 ? "Female" : "Transgender";
  const status = STATUSES[Math.floor(rand(i + 5) * STATUSES.length)]!;
  const type = age >= 60 ? "Senior" : age < 18 ? "Minor" : "Adult";
  return {
    id: `seed-${sId}${i.toString().padStart(2, "0")}`,
    name: `Beneficiary ${sId}${i.toString().padStart(2, "0")}`,
    age,
    gender,
    status,
    stateId: sId,
    state,
    districtId: dId,
    district: dName,
    ia: rand(i + 6) > 0.5 ? `IA-${Math.floor(rand(i + 7) * 50) + 100}` : null,
    type,
    aadhaar: "XXXX-XXXX-" + (1000 + i),
  };
});

/* ---------- Roles & Permissions ---------- */
export interface Role {
  id: string;
  name: string;
  scope: "Central" | "State" | "District" | "Field";
  members: number;
  permissions: number;
  status: "Active" | "Draft" | "Archived";
  updatedAt: string;
}

export const ROLES: Role[] = [
  { id: "rl-super",   name: "Super Admin",            scope: "Central",  members: 2,   permissions: 142, status: "Active",   updatedAt: "2026-05-09" },
  { id: "rl-central", name: "Central Admin",          scope: "Central",  members: 6,   permissions: 128, status: "Active",   updatedAt: "2026-05-04" },
  { id: "rl-state",   name: "State Nodal Officer",    scope: "State",    members: 36,  permissions: 94,  status: "Active",   updatedAt: "2026-04-28" },
  { id: "rl-dist",    name: "District Nodal Officer", scope: "District", members: 248, permissions: 72,  status: "Active",   updatedAt: "2026-04-22" },
  { id: "rl-ia",      name: "Implementing Agency",    scope: "Field",    members: 112, permissions: 54,  status: "Active",   updatedAt: "2026-04-18" },
  { id: "rl-surv",    name: "Surveyor",               scope: "Field",    members: 1286, permissions: 36, status: "Active",   updatedAt: "2026-04-12" },
  { id: "rl-shelter", name: "Shelter Manager",        scope: "Field",    members: 312, permissions: 48,  status: "Active",   updatedAt: "2026-04-08" },
  { id: "rl-aud",     name: "Read-only Auditor",      scope: "Central",  members: 4,   permissions: 22,  status: "Draft",    updatedAt: "2026-03-30" },
];

export interface PermissionGroup {
  group: string;
  permissions: { key: string; label: string; granted: boolean }[];
}

export const PERMISSION_MATRIX: PermissionGroup[] = [
  {
    group: "Access Control",
    permissions: [
      { key: "users.read", label: "View users",    granted: true },
      { key: "users.write", label: "Create / edit users", granted: true },
      { key: "users.delete", label: "Deactivate users", granted: true },
      { key: "roles.write", label: "Manage roles", granted: true },
      { key: "permissions.write", label: "Manage permissions", granted: true },
    ],
  },
  {
    group: "Beneficiaries",
    permissions: [
      { key: "persons.read", label: "View beneficiary list", granted: true },
      { key: "persons.write", label: "Edit beneficiary records", granted: true },
      { key: "persons.transition", label: "Move stage (mobilise, rehabilitate)", granted: true },
      { key: "persons.export", label: "Export CSV / PDF", granted: true },
    ],
  },
  {
    group: "Field Operations",
    permissions: [
      { key: "survey.read", label: "View surveys", granted: true },
      { key: "survey.write", label: "Create / edit surveys", granted: true },
      { key: "surveyor.assign", label: "Assign surveyors", granted: true },
      { key: "locations.write", label: "Manage survey locations", granted: true },
    ],
  },
  {
    group: "Funds",
    permissions: [
      { key: "funds.read", label: "View fund monitoring", granted: true },
      { key: "funds.sanction", label: "Create sanction orders", granted: true },
      { key: "funds.release", label: "Issue release orders", granted: true },
      { key: "funds.report", label: "Run MIS reports", granted: true },
    ],
  },
  {
    group: "System",
    permissions: [
      { key: "audit.read", label: "View audit log", granted: true },
      { key: "settings.write", label: "Edit master settings", granted: true },
      { key: "notifications.broadcast", label: "Broadcast notifications", granted: true },
      { key: "review.act", label: "Action immediate-review items", granted: true },
    ],
  },
];

/* ---------- Performance Statistics ---------- */
export interface PerfMonthly { month: string; identified: number; mobilised: number; rehab: number; }

export const PERF_MONTHLY: PerfMonthly[] = [
  { month: "Jun '25", identified: 980,  mobilised: 410, rehab: 110 },
  { month: "Jul '25", identified: 1140, mobilised: 520, rehab: 138 },
  { month: "Aug '25", identified: 1320, mobilised: 612, rehab: 154 },
  { month: "Sep '25", identified: 1480, mobilised: 698, rehab: 182 },
  { month: "Oct '25", identified: 1620, mobilised: 742, rehab: 198 },
  { month: "Nov '25", identified: 1810, mobilised: 820, rehab: 218 },
  { month: "Dec '25", identified: 1960, mobilised: 884, rehab: 248 },
  { month: "Jan '26", identified: 2110, mobilised: 930, rehab: 274 },
  { month: "Feb '26", identified: 2240, mobilised: 1010, rehab: 296 },
  { month: "Mar '26", identified: 2380, mobilised: 1110, rehab: 318 },
  { month: "Apr '26", identified: 2580, mobilised: 1180, rehab: 332 },
  { month: "May '26", identified: 2710, mobilised: 1220, rehab: 354 },
];

export const PERF_TOP_AGENCIES = [
  { name: "Mumbai Rehab Foundation", state: "Maharashtra", identified: 1240, mobilised: 720, rehab: 248 },
  { name: "Gujarat Shelter Trust",  state: "Gujarat",     identified: 1180, mobilised: 690, rehab: 232 },
  { name: "Karnataka Outreach",     state: "Karnataka",   identified: 980,  mobilised: 542, rehab: 196 },
  { name: "Tamil Nadu Asha",        state: "Tamil Nadu",  identified: 920,  mobilised: 498, rehab: 184 },
  { name: "Delhi Urban Outreach",   state: "Delhi",       identified: 880,  mobilised: 462, rehab: 168 },
  { name: "Kerala Sahaya Sangam",   state: "Kerala",      identified: 760,  mobilised: 402, rehab: 142 },
];

/* ---------- Users ---------- */
export interface AppUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  state: string;
  district: string | null;
  status: "Active" | "Invited" | "Suspended";
  lastLogin: string;
}

export const APP_USERS: AppUser[] = [
  { id: "u-001", name: "Test Super Admin",         email: "test.superadmin@smile.gov.in",  mobile: "9000000900", role: "Super Admin",            state: "All India",   district: null,        status: "Active",    lastLogin: "2026-05-14 21:10" },
  { id: "u-002", name: "Test Central Admin",       email: "test.centraladmin@smile.gov.in", mobile: "9000000901", role: "Central Admin",          state: "All India",   district: null,        status: "Active",    lastLogin: "2026-05-14 18:48" },
  { id: "u-003", name: "Test State Nodal Officer", email: "test.snokms@smile.gov.in",       mobile: "9000000902", role: "State Nodal Officer",    state: "Maharashtra", district: null,        status: "Active",    lastLogin: "2026-05-14 14:02" },
  { id: "u-004", name: "Test NO Mumbai",           email: "test.no.mumbai@smile.gov.in",    mobile: "9000000903", role: "District Nodal Officer", state: "Maharashtra", district: "Mumbai",    status: "Active",    lastLogin: "2026-05-14 12:11" },
  { id: "u-005", name: "Test NO Pune",             email: "test.no.pune@smile.gov.in",      mobile: "9000000904", role: "District Nodal Officer", state: "Maharashtra", district: "Pune",      status: "Active",    lastLogin: "2026-05-14 09:32" },
  { id: "u-006", name: "Test NO New Delhi",        email: "test.no.newdelhi@smile.gov.in",  mobile: "9000000905", role: "District Nodal Officer", state: "Delhi",       district: "New Delhi", status: "Active",    lastLogin: "2026-05-13 18:55" },
  { id: "u-007", name: "Anushka Rao",              email: "anushka.rao@smile.gov.in",       mobile: "9876500110", role: "Implementing Agency",    state: "Karnataka",   district: "Mysuru",    status: "Active",    lastLogin: "2026-05-14 16:42" },
  { id: "u-008", name: "Ravi Menon",               email: "ravi.menon@smile.gov.in",        mobile: "9876500111", role: "Surveyor",               state: "Kerala",      district: "Kochi",     status: "Active",    lastLogin: "2026-05-14 10:21" },
  { id: "u-009", name: "Sneha Pillai",             email: "sneha.pillai@smile.gov.in",      mobile: "9876500112", role: "Shelter Manager",        state: "Tamil Nadu",  district: "Chennai",   status: "Invited",   lastLogin: "—" },
  { id: "u-010", name: "Dilip Singh",              email: "dilip.singh@smile.gov.in",       mobile: "9876500113", role: "Surveyor",               state: "Rajasthan",   district: "Jaipur",    status: "Suspended", lastLogin: "2026-04-21 09:14" },
];

/* ---------- Schemes ---------- */
export interface Scheme {
  id: string;
  name: string;
  type: "Identification" | "Mobilisation" | "Shelter" | "Rehabilitation";
  budget: number;
  utilised: number;
  states: number;
  beneficiaries: number;
  status: "Active" | "Pilot" | "Closed";
}

export const SCHEMES: Scheme[] = [
  { id: "sch-001", name: "SMILE-Outreach Identification Drive", type: "Identification", budget: 12_50_00_000, utilised: 9_24_30_000, states: 36, beneficiaries: 19810, status: "Active" },
  { id: "sch-002", name: "Urban Mobilisation Programme",         type: "Mobilisation",   budget: 18_40_00_000, utilised: 11_22_80_000, states: 28, beneficiaries: 4316,  status: "Active" },
  { id: "sch-003", name: "Shelter Home Strengthening",           type: "Shelter",        budget: 24_60_00_000, utilised: 16_40_20_000, states: 22, beneficiaries: 1248,  status: "Active" },
  { id: "sch-004", name: "Comprehensive Rehab Skill Track",      type: "Rehabilitation", budget: 32_80_00_000, utilised: 18_90_40_000, states: 30, beneficiaries: 2084,  status: "Active" },
  { id: "sch-005", name: "Pilot — Senior Citizen Reintegration", type: "Rehabilitation", budget: 4_20_00_000,  utilised: 1_84_60_000,  states: 6,  beneficiaries: 312,   status: "Pilot"  },
];

/* ---------- Shelter homes ---------- */
export interface ShelterHome {
  id: string;
  name: string;
  state: string;
  district: string;
  capacity: number;
  occupancy: number;
  manager: string;
  ia: string;
  status: "Active" | "Audit" | "Closed";
}

export const SHELTER_HOMES: ShelterHome[] = [
  { id: "sh-001", name: "Asha Niketan Mumbai",     state: "Maharashtra", district: "Mumbai",    capacity: 120, occupancy: 96,  manager: "Pranav Joshi",  ia: "Mumbai Rehab Foundation", status: "Active" },
  { id: "sh-002", name: "Pune Sahyog Sadan",       state: "Maharashtra", district: "Pune",      capacity: 80,  occupancy: 64,  manager: "Anita Kale",    ia: "Pune Outreach",           status: "Active" },
  { id: "sh-003", name: "Surat Punarvas Kendra",   state: "Gujarat",     district: "Surat",     capacity: 60,  occupancy: 51,  manager: "Mehul Patel",   ia: "Gujarat Shelter Trust",   status: "Active" },
  { id: "sh-004", name: "Ahmedabad Asha Bhavan",   state: "Gujarat",     district: "Ahmedabad", capacity: 90,  occupancy: 72,  manager: "Riya Shah",     ia: "Gujarat Shelter Trust",   status: "Audit"  },
  { id: "sh-005", name: "Mysuru Karunya Kendra",   state: "Karnataka",   district: "Mysuru",    capacity: 70,  occupancy: 58,  manager: "Karthik Rao",   ia: "Karnataka Outreach",      status: "Active" },
  { id: "sh-006", name: "Chennai Anbu Illam",      state: "Tamil Nadu",  district: "Chennai",   capacity: 100, occupancy: 84,  manager: "Lakshmi V.",    ia: "Tamil Nadu Asha",         status: "Active" },
  { id: "sh-007", name: "Delhi Urban Shelter NDLS", state: "Delhi",      district: "New Delhi", capacity: 150, occupancy: 121, manager: "Arjun Khanna",  ia: "Delhi Urban Outreach",    status: "Active" },
];

/* ---------- Surveys / Locations ---------- */
export type SurveyLocationType =
  | "Red light areas"
  | "Religious Places (Temple, Mosque, Gurudwara, Church, Shrines)"
  | "Traffic Signals"
  | "Railway Station"
  | "Metro Station"
  | "Bus Stop"
  | "Beggar Survey";

export interface SurveyLocation {
  id: string;
  name: string;
  ia: string | null;
  state: string;
  district: string;
  address: string | null;
  pincode: string | null;
  type: SurveyLocationType;
  surveyors: number;
  identified: number;
  lastSurveyed: string;
}

const NIKETAN_ADDR =
  "National E-Governance Division, 4th Floor, Electronics Niketan, 6 CGO Complex, Lodhi Road, New Delhi - 110003";

export const SURVEY_LOCATIONS: SurveyLocation[] = [
  { id: "loc-001", name: "Red light areas",                                               type: "Red light areas",    ia: "Gaurav",                                  state: "Delhi",         district: "New Delhi",          address: "B-3\\152 Raghubir Nagar",                                           pincode: "110027", surveyors: 2, identified: 18, lastSurveyed: "2026-05-13" },
  { id: "loc-002", name: "NO Ahmedabad — May 2026 Beggar Survey",                         type: "Beggar Survey",      ia: "Ahmedabad Welfare Trust",                  state: "Gujarat",       district: "Ahmedabad",          address: null,                                                                pincode: null,     surveyors: 3, identified: 14, lastSurveyed: "2026-05-12" },
  { id: "loc-003", name: "NO Kolkata — May 2026 Beggar Survey",                           type: "Beggar Survey",      ia: "Kolkata Sisters of Hope",                  state: "West Bengal",   district: "Kolkata",            address: null,                                                                pincode: null,     surveyors: 3, identified: 11, lastSurveyed: "2026-05-11" },
  { id: "loc-004", name: "NO Nagpur — May 2026 Beggar Survey",                            type: "Beggar Survey",      ia: "Nagpur Vidarbha Trust",                    state: "Maharashtra",   district: "Nagpur",             address: null,                                                                pincode: null,     surveyors: 2, identified: 7,  lastSurveyed: "2026-05-10" },
  { id: "loc-005", name: "NO Mysuru — May 2026 Beggar Survey",                            type: "Beggar Survey",      ia: "Mysuru Outreach NGO",                      state: "Karnataka",     district: "Mysuru",             address: null,                                                                pincode: null,     surveyors: 2, identified: 5,  lastSurveyed: "2026-05-09" },
  { id: "loc-006", name: "NO Jaipur — May 2026 Beggar Survey",                            type: "Beggar Survey",      ia: "Jaipur Pink City Aid",                     state: "Rajasthan",     district: "Jaipur",             address: null,                                                                pincode: null,     surveyors: 2, identified: 9,  lastSurveyed: "2026-05-09" },
  { id: "loc-007", name: "NO Hyderabad — May 2026 Beggar Survey",                         type: "Beggar Survey",      ia: "Hyderabad Charminar Trust",                state: "Telangana",     district: "Hyderabad",          address: null,                                                                pincode: null,     surveyors: 4, identified: 12, lastSurveyed: "2026-05-13" },
  { id: "loc-008", name: "NO Kanpur — May 2026 Beggar Survey",                            type: "Beggar Survey",      ia: "Kanpur Leather City NGO",                  state: "Uttar Pradesh", district: "Kanpur",             address: null,                                                                pincode: null,     surveyors: 2, identified: 6,  lastSurveyed: "2026-05-09" },
  { id: "loc-009", name: "NO Chennai — May 2026 Beggar Survey",                           type: "Beggar Survey",      ia: "Chennai Marina Welfare",                   state: "Tamil Nadu",    district: "Chennai",            address: null,                                                                pincode: null,     surveyors: 3, identified: 10, lastSurveyed: "2026-05-12" },
  { id: "loc-010", name: "NO South Delhi — May 2026 Beggar Survey",                       type: "Beggar Survey",      ia: "South Delhi Care Mission",                 state: "Delhi",         district: "South Delhi",        address: null,                                                                pincode: null,     surveyors: 3, identified: 8,  lastSurveyed: "2026-05-11" },
  { id: "loc-011", name: "NO Surat — May 2026 Beggar Survey",                             type: "Beggar Survey",      ia: "Surat Diamond Care",                       state: "Gujarat",       district: "Surat",              address: null,                                                                pincode: null,     surveyors: 2, identified: 6,  lastSurveyed: "2026-05-10" },
  { id: "loc-012", name: "NO Bhopal — May 2026 Beggar Survey",                            type: "Beggar Survey",      ia: "Bhopal Compassion Foundation",             state: "Madhya Pradesh", district: "Bhopal",            address: null,                                                                pincode: null,     surveyors: 2, identified: 5,  lastSurveyed: "2026-05-08" },
  { id: "loc-013", name: "NO Thiruvananthapuram — May 2026 Beggar Survey",                type: "Beggar Survey",      ia: "Trivandrum Helping Hands",                 state: "Kerala",        district: "Thiruvananthapuram", address: null,                                                                pincode: null,     surveyors: 2, identified: 4,  lastSurveyed: "2026-05-08" },
  { id: "loc-014", name: "Railway Station",                                               type: "Railway Station",    ia: "Mumbai Social Welfare Trust",              state: "Maharashtra",   district: "Mumbai",             address: NIKETAN_ADDR,                                                        pincode: "400001", surveyors: 4, identified: 26, lastSurveyed: "2026-05-13" },
  { id: "loc-015", name: "Traffic Signals",                                               type: "Traffic Signals",    ia: "Mumbai Social Welfare Trust",              state: "Maharashtra",   district: "Mumbai",             address: NIKETAN_ADDR,                                                        pincode: "400001", surveyors: 3, identified: 18, lastSurveyed: "2026-05-13" },
  { id: "loc-016", name: "Railway Station",                                               type: "Railway Station",    ia: null,                                       state: "Maharashtra",   district: "Mumbai",             address: "Block A, Platform 3",                                               pincode: "110001", surveyors: 0, identified: 0,  lastSurveyed: "—" },
  { id: "loc-017", name: "Railway Station",                                               type: "Railway Station",    ia: "Mumbai Social Welfare Trust",              state: "Maharashtra",   district: "Mumbai",             address: "Chhatrapati Shivaji Maharaj Terminus",                              pincode: "400001", surveyors: 4, identified: 32, lastSurveyed: "2026-05-14" },
  { id: "loc-018", name: "Religious Places (Temple, Mosque, Gurudwara, Church, Shrines)", type: "Religious Places (Temple, Mosque, Gurudwara, Church, Shrines)", ia: "Pune Upliftment Society", state: "Maharashtra", district: "Pune",            address: "Dagdusheth Halwai Ganpati, Budhwar Peth, Pune",                     pincode: "411002", surveyors: 3, identified: 22, lastSurveyed: "2026-05-13" },
  { id: "loc-019", name: "Railway Station",                                               type: "Railway Station",    ia: "Pune Upliftment Society",                  state: "Maharashtra",   district: "Pune",               address: "Pune Junction, Agarkar Nagar, Pune",                                pincode: "411001", surveyors: 3, identified: 19, lastSurveyed: "2026-05-12" },
  { id: "loc-020", name: "Metro Station",                                                 type: "Metro Station",      ia: "Delhi Care Foundation, Mosje Verify IA",   state: "Delhi",         district: "New Delhi",          address: "Rajiv Chowk Metro, Connaught Place, New Delhi",                     pincode: "110001", surveyors: 4, identified: 35, lastSurveyed: "2026-05-14" },
  { id: "loc-021", name: "Bus Stop",                                                      type: "Bus Stop",           ia: "Mumbai Social Welfare Trust",              state: "Maharashtra",   district: "Mumbai",             address: "CST Bus Terminus, Fort, Mumbai",                                    pincode: "400001", surveyors: 2, identified: 12, lastSurveyed: "2026-05-11" },
  { id: "loc-022", name: "Traffic Signals",                                               type: "Traffic Signals",    ia: "Mumbai Social Welfare Trust",              state: "Maharashtra",   district: "Mumbai",             address: "SV Road x Hill Road junction, Bandra West",                         pincode: "400050", surveyors: 2, identified: 14, lastSurveyed: "2026-05-12" },
  { id: "loc-023", name: "Mumbai Temple Survey",                                          type: "Religious Places (Temple, Mosque, Gurudwara, Church, Shrines)", ia: null, state: "Maharashtra",   district: "Mumbai",             address: null,                                                                pincode: null,     surveyors: 0, identified: 0,  lastSurveyed: "—" },
  { id: "loc-024", name: "Delhi Karol Bagh Pilot",                                        type: "Beggar Survey",      ia: null,                                       state: "Delhi",         district: "New Delhi",          address: null,                                                                pincode: null,     surveyors: 0, identified: 0,  lastSurveyed: "—" },
];

/* ---------- Surveyor mappings ---------- */
export interface SurveyorMapping {
  id: string;
  name: string;
  state: string;
  city: string;
  surveyLocation: string;
  createdOn: string;
  status: "Active" | "Inactive" | "Pending";
}

export const SURVEYOR_MAPPINGS: SurveyorMapping[] = [
  { id: "sm-001", name: "Ravi Kulkarni",   state: "Maharashtra",   city: "Mumbai",    surveyLocation: "Chhatrapati Shivaji Maharaj Terminus", createdOn: "2026-04-12", status: "Active" },
  { id: "sm-002", name: "Anita Deshmukh",  state: "Maharashtra",   city: "Pune",      surveyLocation: "Pune Junction, Agarkar Nagar",         createdOn: "2026-04-14", status: "Active" },
  { id: "sm-003", name: "Karthik Rao",     state: "Karnataka",     city: "Bengaluru", surveyLocation: "Bengaluru City Junction",              createdOn: "2026-04-18", status: "Active" },
  { id: "sm-004", name: "Priya Menon",     state: "Kerala",        city: "Kochi",     surveyLocation: "Ernakulam Junction",                   createdOn: "2026-04-20", status: "Pending" },
  { id: "sm-005", name: "Suresh Yadav",    state: "Uttar Pradesh", city: "Kanpur",    surveyLocation: "NO Kanpur — Beggar Survey",            createdOn: "2026-04-22", status: "Active" },
  { id: "sm-006", name: "Meera Iyer",      state: "Tamil Nadu",    city: "Chennai",   surveyLocation: "Chennai Marina Welfare Survey",        createdOn: "2026-04-25", status: "Active" },
  { id: "sm-007", name: "Vijay Singh",     state: "Delhi",         city: "New Delhi", surveyLocation: "Rajiv Chowk Metro",                    createdOn: "2026-04-28", status: "Active" },
  { id: "sm-008", name: "Lakshmi Naidu",   state: "Telangana",     city: "Hyderabad", surveyLocation: "NO Hyderabad — Beggar Survey",         createdOn: "2026-05-01", status: "Active" },
  { id: "sm-009", name: "Aman Verma",      state: "Rajasthan",     city: "Jaipur",    surveyLocation: "NO Jaipur — Beggar Survey",            createdOn: "2026-05-03", status: "Pending" },
  { id: "sm-010", name: "Pooja Patel",     state: "Gujarat",       city: "Ahmedabad", surveyLocation: "Manek Chowk",                          createdOn: "2026-05-05", status: "Active" },
  { id: "sm-011", name: "Rohit Sharma",    state: "Maharashtra",   city: "Mumbai",    surveyLocation: "Bandra West Traffic Signals",          createdOn: "2026-05-07", status: "Inactive" },
  { id: "sm-012", name: "Neha Khan",       state: "West Bengal",   city: "Kolkata",   surveyLocation: "NO Kolkata — Beggar Survey",           createdOn: "2026-05-09", status: "Active" },
];

/* ---------- Notifications ---------- */
export interface Notification {
  id: string;
  title: string;
  body: string;
  audience: string;
  status: "Sent" | "Scheduled" | "Draft";
  channel: ("SMS" | "Email" | "In-App")[];
  sentAt: string;
}

export const NOTIFICATIONS: Notification[] = [
  { id: "n-001", title: "May field-survey drive",   body: "Surveyors in Maharashtra are requested to log identifications by 6pm IST.", audience: "Surveyors · Maharashtra", status: "Sent",      channel: ["SMS", "In-App"], sentAt: "2026-05-14 09:00" },
  { id: "n-002", title: "Quarterly fund release",   body: "Release orders for Q1 FY26 have been issued. Nodal officers please acknowledge.", audience: "State Nodal Officers", status: "Sent",      channel: ["Email", "In-App"], sentAt: "2026-05-12 11:30" },
  { id: "n-003", title: "Shelter occupancy audit",  body: "Quarterly shelter occupancy audit scheduled for 2026-05-20.", audience: "Shelter Managers",     status: "Scheduled", channel: ["Email"], sentAt: "—" },
  { id: "n-004", title: "Training module 3 live",   body: "New surveyor training module published. Mandatory completion by 2026-05-30.", audience: "Surveyors",            status: "Sent",      channel: ["In-App"], sentAt: "2026-05-10 16:15" },
];

/* ---------- Audit log ---------- */
export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  result: "Success" | "Failure";
}

export const AUDIT_LOG: AuditEntry[] = Array.from({ length: 24 }, (_, i) => ({
  id: `aud-${1000 + i}`,
  actor: ["Test Super Admin", "Test Central Admin", "Test State Nodal Officer", "Test NO Mumbai", "Test NO Pune"][i % 5]!,
  action: [
    "Updated role permissions",
    "Created sanction order",
    "Approved IA onboarding",
    "Edited beneficiary record",
    "Issued release order",
    "Acknowledged shelter audit",
    "Broadcasted notification",
    "Logged in",
  ][i % 8]!,
  target: ["roles/state-no", "sanction/2026-05-04", "ia/Mumbai-RF", "person/seed-14-21", "release/2026-Q1", "audit/sh-001", "notif/n-001", "auth/login"][i % 8]!,
  timestamp: `2026-05-${(14 - (i % 14)).toString().padStart(2, "0")} ${(18 - (i % 12)).toString().padStart(2, "0")}:${(60 - (i * 7) % 60).toString().padStart(2, "0")}`,
  ip: `10.${(i % 20) + 1}.${(i * 11) % 250}.${(i * 7) % 250}`,
  result: i % 11 === 0 ? "Failure" : "Success",
}));

/* ---------- Fund Monitoring ---------- */
export interface SanctionOrder { id: string; fy: string; scheme: string; state: string; amount: number; status: "Approved" | "Pending" | "Rejected"; date: string; }

export const SANCTION_ORDERS: SanctionOrder[] = [
  { id: "SO-26-001", fy: "FY26", scheme: "Urban Mobilisation Programme", state: "Maharashtra", amount: 2_40_00_000, status: "Approved", date: "2026-04-04" },
  { id: "SO-26-002", fy: "FY26", scheme: "Shelter Home Strengthening",   state: "Gujarat",     amount: 1_80_00_000, status: "Approved", date: "2026-04-11" },
  { id: "SO-26-003", fy: "FY26", scheme: "Comprehensive Rehab Skill",    state: "Karnataka",   amount: 1_60_00_000, status: "Approved", date: "2026-04-18" },
  { id: "SO-26-004", fy: "FY26", scheme: "Outreach Identification",      state: "Tamil Nadu",  amount: 1_20_00_000, status: "Pending",  date: "2026-04-22" },
  { id: "SO-26-005", fy: "FY26", scheme: "Senior Citizen Reintegration", state: "Delhi",       amount: 80_00_000,   status: "Pending",  date: "2026-04-28" },
];

/* ---------- Immediate Review queue ---------- */
export interface ReviewItem {
  id: string;
  type: "Survey" | "Beneficiary" | "Shelter Capacity" | "Fund Discrepancy";
  description: string;
  raisedBy: string;
  ageHours: number;
  severity: "High" | "Medium" | "Low";
}

export const REVIEW_QUEUE: ReviewItem[] = [
  { id: "rv-001", type: "Fund Discrepancy",  description: "Sanction SO-26-002 utilisation > 102%",                       raisedBy: "Audit Bot",         ageHours: 6,  severity: "High"   },
  { id: "rv-002", type: "Shelter Capacity",  description: "Mumbai Asha Niketan crossed 95% capacity",                   raisedBy: "Pranav Joshi",      ageHours: 9,  severity: "High"   },
  { id: "rv-003", type: "Survey",            description: "Duplicate Aadhaar found in seed-1103 survey batch",          raisedBy: "Dedupe Engine",     ageHours: 11, severity: "Medium" },
  { id: "rv-004", type: "Beneficiary",       description: "Age mismatch flagged on Beneficiary 14021 by Anushka Rao",   raisedBy: "Anushka Rao",       ageHours: 14, severity: "Medium" },
  { id: "rv-005", type: "Shelter Capacity",  description: "Delhi Urban Shelter NDLS reporting 0 occupancy 48h",        raisedBy: "Arjun Khanna",      ageHours: 22, severity: "Low"    },
];
