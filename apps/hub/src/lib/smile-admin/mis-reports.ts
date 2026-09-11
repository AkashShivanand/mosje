/**
 * The eight MIS reports.
 *
 * On the live portal these are one screen rendered eight times: the same
 * breadcrumb, the same four counters, the same Data-version / State / District
 * filters, the same CSV and PDF buttons, the same paged register. Only the
 * title, the sentence under it and the columns change — so that is all a report
 * declares here, and `MisReportPage` renders the rest.
 *
 * Rows are derived from the fixtures the rest of the portal already uses rather
 * than invented per report, so a beneficiary who appears in the Beneficiary
 * Report is the same person in the Mobilised Report.
 */
import {
  BENEFICIARIES,
  SHELTER_HOMES,
  SURVEY_LOCATIONS,
  type Beneficiary,
} from "./mock-data";
import { STATES } from "./states";

export interface MisColumn {
  key: string;
  header: string;
  /** Right-align and tabular-figure a numeric column. */
  numeric?: boolean;
  /** Narrow columns the register reads down rather than across. */
  width?: string;
}

export interface MisReport {
  slug: string;
  title: string;
  subtitle: string;
  columns: MisColumn[];
  rows: Array<Record<string, string | number>>;
  /** Reports that also filter by year carry the extra select. */
  hasYear?: boolean;
}

const DASH = "—";
const iso = (d: string) => d;

/** A stable pseudo-date derived from an index, so a rebuild does not reshuffle. */
function dateFor(i: number, month = 8) {
  return `2026-${String(month).padStart(2, "0")}-${String(1 + (i % 27)).padStart(2, "0")}`;
}

const shelterFor = (i: number) => SHELTER_HOMES[i % SHELTER_HOMES.length]!;
const locationFor = (i: number) => SURVEY_LOCATIONS[i % SURVEY_LOCATIONS.length]!;

const BEGGAR_TYPE = ["Not classified", "Homelessness / lack of shelter", "Person with physical disability", "Others (may be specified)"];
const SURVEYORS = ["Aswin PM", "Nikhil Rao", "Meera Joshi", "Farhan Ali", "Sunita Devi"];

/* ---------- Implementing agencies ---------- */
export interface ImplementingAgency {
  id: string;
  name: string;
  agencyType: "NGO" | "Institute" | "Trust" | "Society";
  registration: string;
  darpan: string;
  state: string;
  district: string;
  onboardedOn: string;
  surveyors: number;
  identified: number;
  status: "Active" | "Suspended";
  contact: string;
}

export const IMPLEMENTING_AGENCIES: ImplementingAgency[] = [
  ["Udayam Charitable Society", "Society", "Kerala", "Kozhikode", 6, 412, "Aswin PM"],
  ["Mumbai Rehab Foundation", "NGO", "Maharashtra", "Mumbai", 9, 1240, "Pranav Joshi"],
  ["Pune Outreach", "NGO", "Maharashtra", "Pune", 5, 486, "Anita Kale"],
  ["Gujarat Shelter Trust", "Trust", "Gujarat", "Ahmedabad", 7, 1180, "Riya Shah"],
  ["Karnataka Outreach", "NGO", "Karnataka", "Mysuru", 4, 980, "Karthik Rao"],
  ["Tamil Nadu Asha", "Society", "Tamil Nadu", "Chennai", 6, 920, "Lakshmi V."],
  ["Delhi Urban Outreach", "NGO", "Delhi", "New Delhi", 8, 880, "Arjun Khanna"],
  ["Kerala Sahaya Sangam", "Society", "Kerala", "Ernakulam", 3, 760, "Thomas Kurian"],
  ["Param Pujya Ramtirak Aadinath Welfare Trust", "Trust", "Madhya Pradesh", "Indore", 4, 318, "Shukla D."],
  ["Barak Valley Welfare Development Society", "Society", "Assam", "Cachar", 3, 264, "Nabanita Das"],
  ["District Programme Management Unit, Saksham", "Institute", "Bihar", "Nalanda", 5, 296, "Ravi Prasad"],
  ["Jankalyan Parishad", "NGO", "Uttar Pradesh", "Gautam Budh Nagar", 6, 512, "Suresh Yadav"],
  ["Test NGO Goa", "NGO", "Goa", "North Goa", 1, 0, "Aarti"],
].map(([name, agencyType, state, district, surveyors, identified, contact], i) => ({
  id: `ia-${String(i + 1).padStart(3, "0")}`,
  name: name as string,
  agencyType: agencyType as ImplementingAgency["agencyType"],
  registration: `${(state as string).slice(0, 2).toUpperCase()}/2026/${1234560 + i}`,
  darpan: `${(state as string).slice(0, 2).toUpperCase()}/2026/${1234560 + i}`,
  state: state as string,
  district: district as string,
  onboardedOn: dateFor(i, 7),
  surveyors: surveyors as number,
  identified: identified as number,
  status: i === 12 ? ("Suspended" as const) : ("Active" as const),
  contact: contact as string,
}));

const iaFor = (i: number) => IMPLEMENTING_AGENCIES[i % IMPLEMENTING_AGENCIES.length]!;

/* ---------- Row builders ---------- */

function beneficiaryRows() {
  return BENEFICIARIES.map((b, i) => ({
    id: b.id,
    name: b.name,
    age: b.age,
    gender: b.gender,
    beggarType: BEGGAR_TYPE[i % BEGGAR_TYPE.length]!,
    aadhaar: b.aadhaar ? "Yes" : "No",
    state: b.state,
    district: b.district,
    surveyLocation: locationFor(i).name,
    ia: b.ia ?? iaFor(i).name,
    surveyor: SURVEYORS[i % SURVEYORS.length]!,
    identifiedOn: dateFor(i),
    status: b.status.replace(/_/g, " "),
  }));
}

function mobilisedRows() {
  return BENEFICIARIES.filter((b) => b.status !== "IDENTIFIED").map((b, i) => ({
    id: b.id,
    name: b.name,
    age: b.age,
    gender: b.gender,
    beggarType: BEGGAR_TYPE[i % BEGGAR_TYPE.length]!,
    state: b.state,
    district: b.district,
    ia: b.ia ?? iaFor(i).name,
    mobilisedOn: dateFor(i),
    shelter: b.status === "MOBILIZED" ? DASH : shelterFor(i).name,
  }));
}

const REHAB_TYPE = ["Skill Training", "Wage Employment", "Self Employment"];

function rehabilitatedRows() {
  return BENEFICIARIES.filter(
    (b) => b.status === "REHABILITATED" || b.status === "SHELTER_ASSIGNED",
  ).map((b, i) => ({
    id: b.id,
    name: b.name,
    age: b.age,
    gender: b.gender,
    beggarType: BEGGAR_TYPE[i % BEGGAR_TYPE.length]!,
    state: b.state,
    district: b.district,
    shelter: shelterFor(i).name,
    rehabType: REHAB_TYPE[i % REHAB_TYPE.length]!,
    startedOn: dateFor(i, 6),
    completedOn: b.status === "REHABILITATED" ? dateFor(i, 8) : DASH,
    outcome: b.status === "REHABILITATED" ? "Placed" : DASH,
  }));
}

function shelterRows() {
  return SHELTER_HOMES.map((s, i) => ({
    name: s.name,
    shelterType: i % 3 === 0 ? "Government" : "NGO-run",
    state: s.state,
    district: s.district,
    address: `${s.district} Civic Centre, Ward ${4 + i}`,
    capacity: s.capacity,
    occupancy: s.occupancy,
    status: s.status,
    onboardedOn: dateFor(i, 7),
    manager: s.manager,
    mobile: `98765${String(40000 + i).slice(0, 5)}`,
  }));
}

function surveyLocationRows() {
  return SURVEY_LOCATIONS.map((l, i) => ({
    name: l.name,
    specific: l.address ?? DASH,
    state: l.state,
    district: l.district,
    areaType: l.type,
    year: 2026 - (i % 3),
    ia: l.ia ?? DASH,
    surveyors: l.surveyors,
    identified: l.identified,
    status: i % 7 === 6 ? "Closed" : "Active",
  }));
}

function agencyRows() {
  return IMPLEMENTING_AGENCIES.map((a) => ({
    name: a.name,
    agencyType: a.agencyType,
    registration: a.registration,
    darpan: a.darpan,
    state: a.state,
    district: a.district,
    onboardedOn: a.onboardedOn,
    surveyors: a.surveyors,
    identified: a.identified,
    status: a.status,
    contact: a.contact,
  }));
}

const WAGE_TYPE = ["Daily", "Monthly", "Piece rate"];
const SECTOR = ["Hospitality", "Retail", "Construction", "Manufacturing"];
const FOLLOW_UP = ["Active", "3-month due", "Lost to Follow-up", "Relapsed"];

function comprehensiveRehabRows() {
  return BENEFICIARIES.filter((b) => b.status === "REHABILITATED").map((b, i) => {
    const type = REHAB_TYPE[i % REHAB_TYPE.length]!;
    const wage = type === "Wage Employment";
    const self = type === "Self Employment";
    return {
      admin: `${b.id}-${i + 1}`,
      name: b.name,
      city: b.district,
      gender: b.gender,
      age: b.age,
      rehabType: type,
      category: type === "Skill Training" ? "Hospitality Assistant" : DASH,
      specify: DASH,
      employer: wage ? `${SECTOR[i % SECTOR.length]} Pvt Ltd` : DASH,
      employerAddress: wage ? `${b.district} Industrial Estate` : DASH,
      sector: wage ? SECTOR[i % SECTOR.length]! : DASH,
      designation: wage ? "Assistant" : DASH,
      wageType: wage ? WAGE_TYPE[i % WAGE_TYPE.length]! : DASH,
      wageIncome: wage ? 12000 + (i % 5) * 1500 : DASH,
      businessType: self ? "Tea stall" : DASH,
      businessLocation: self ? `${b.district} Market` : DASH,
      financeSupport: self ? "Yes" : DASH,
      financeSource: self ? "NSKFDC loan" : DASH,
      selfIncome: self ? 9000 + (i % 4) * 1200 : DASH,
      convergence: i % 3 === 0 ? "Yes" : "No",
      schemeName: i % 3 === 0 ? "PM-AJAY" : DASH,
      benefit: i % 3 === 0 ? "Received" : DASH,
      followUp: FOLLOW_UP[i % FOLLOW_UP.length]!,
      state: b.state,
      district: b.district,
    };
  });
}

/** One row per district, aggregated — the sheet the ministry circulates. */
function masterRows() {
  const byDistrict = new Map<string, { state: string; district: string; list: Beneficiary[] }>();
  for (const b of BENEFICIARIES) {
    const key = `${b.state}|${b.district}`;
    if (!byDistrict.has(key)) byDistrict.set(key, { state: b.state, district: b.district, list: [] });
    byDistrict.get(key)!.list.push(b);
  }
  return [...byDistrict.values()]
    .sort((a, b) => a.state.localeCompare(b.state) || a.district.localeCompare(b.district))
    .map(({ state, district, list }, i) => {
      const by = (g: Beneficiary["gender"]) => list.filter((b) => b.gender === g).length;
      const mobilised = list.filter((b) => b.status !== "IDENTIFIED" && b.status !== "UNDER_MOBILIZATION");
      const rehab = list.filter((b) => b.status === "REHABILITATED");
      const ia = iaFor(i);
      return {
        state,
        district,
        commencement: "2026-27",
        consent: i % 4 === 3 ? "No" : "Yes",
        nodalOfficer: `NO ${district}`,
        nodalContact: `98765${String(43000 + i).slice(0, 5)}`,
        nodalEmail: `no.${district.toLowerCase().replace(/[^a-z]/g, "")}@gov.test.in`,
        phase: `Phase ${1 + (i % 3)}`,
        firstInstalment: 40 + (i % 9) * 5,
        secondInstalment: i % 2 === 0 ? 30 + (i % 5) * 5 : 0,
        thirdInstalment: i % 3 === 0 ? 20 : 0,
        agency: ia.name,
        agencyContact: `98765${String(44000 + i).slice(0, 5)}`,
        shelterSecured: i % 5 === 4 ? "No" : "Yes",
        surveyTotal: list.length,
        surveyMale: by("Male"),
        surveyFemale: by("Female"),
        surveyTransgender: by("Transgender"),
        mobilisedTotal: mobilised.length,
        rehabTotal: rehab.length,
      };
    });
}

/* ---------- The eight reports ---------- */

const num = (key: string, header: string): MisColumn => ({ key, header, numeric: true });

export const MIS_REPORTS: MisReport[] = [
  {
    slug: "mobilised",
    title: "Mobilised Persons Report",
    subtitle: "Beneficiaries mobilised from survey locations to Swashraya (Shelter Homes).",
    columns: [
      { key: "id", header: "Beneficiary ID" },
      { key: "name", header: "Beneficiary Name" },
      num("age", "Age"),
      { key: "gender", header: "Gender" },
      { key: "beggarType", header: "Beggar Type" },
      { key: "state", header: "State" },
      { key: "district", header: "District / City" },
      { key: "ia", header: "IA Name" },
      { key: "mobilisedOn", header: "Mobilisation Date" },
      { key: "shelter", header: "Swashraya (Shelter Home) Name" },
    ],
    rows: mobilisedRows(),
  },
  {
    slug: "rehabilitated",
    title: "Rehabilitated Persons Report",
    subtitle: "Beneficiaries who have completed or are undergoing rehabilitation.",
    columns: [
      { key: "id", header: "Beneficiary ID" },
      { key: "name", header: "Beneficiary Name" },
      num("age", "Age"),
      { key: "gender", header: "Gender" },
      { key: "beggarType", header: "Beggar Type" },
      { key: "state", header: "State" },
      { key: "district", header: "District / City" },
      { key: "shelter", header: "Swashraya (Shelter Home) / Rehab Centre" },
      { key: "rehabType", header: "Rehabilitation Type" },
      { key: "startedOn", header: "Start Date" },
      { key: "completedOn", header: "Completion Date" },
      { key: "outcome", header: "Outcome / Remarks" },
    ],
    rows: rehabilitatedRows(),
  },
  {
    slug: "beneficiary",
    title: "Beneficiary Report",
    subtitle: "Master beneficiary register with identification and status details.",
    columns: [
      { key: "id", header: "Beneficiary ID" },
      { key: "name", header: "Beneficiary Name" },
      num("age", "Age"),
      { key: "gender", header: "Gender" },
      { key: "beggarType", header: "Beggar Type" },
      { key: "aadhaar", header: "Aadhaar Available" },
      { key: "state", header: "State" },
      { key: "district", header: "District / City" },
      { key: "surveyLocation", header: "Survey Location" },
      { key: "ia", header: "IA Name" },
      { key: "surveyor", header: "Surveyor Name" },
      { key: "identifiedOn", header: "Date of Identification" },
      { key: "status", header: "Current Status" },
    ],
    rows: beneficiaryRows(),
  },
  {
    slug: "shelter-home",
    title: "Swashraya (Shelter Home) Report",
    subtitle: "Shelter home capacity, occupancy and operational status overview.",
    columns: [
      { key: "name", header: "Swashraya (Shelter Home) Name" },
      { key: "shelterType", header: "Swashraya (Shelter Home) Type" },
      { key: "state", header: "State" },
      { key: "district", header: "District / City" },
      { key: "address", header: "Address" },
      num("capacity", "Capacity"),
      num("occupancy", "Current Occupancy"),
      { key: "status", header: "Operational Status" },
      { key: "onboardedOn", header: "Onboarded On" },
      { key: "manager", header: "Contact Person" },
      { key: "mobile", header: "Contact Person Mobile" },
    ],
    rows: shelterRows(),
  },
  {
    slug: "survey-location",
    title: "Survey Location Report",
    subtitle: "Survey location performance and coverage statistics.",
    hasYear: true,
    columns: [
      { key: "name", header: "Survey Location" },
      { key: "specific", header: "Specific Survey Location" },
      { key: "state", header: "State" },
      { key: "district", header: "District / City" },
      { key: "areaType", header: "Survey Type / Area Category" },
      num("year", "Year"),
      { key: "ia", header: "IA Assigned" },
      num("surveyors", "Surveyors Mapped"),
      num("identified", "Beneficiaries Identified"),
      { key: "status", header: "Status" },
    ],
    rows: surveyLocationRows(),
  },
  {
    slug: "ia-agency-institute",
    title: "Implementing Agency Report",
    subtitle: "Implementing agencies and institutions participating in the SMILE programme.",
    columns: [
      { key: "name", header: "IA / Agency / Institute Name" },
      { key: "agencyType", header: "Agency Type" },
      { key: "registration", header: "Registration Number" },
      { key: "darpan", header: "Darpan ID" },
      { key: "state", header: "State" },
      { key: "district", header: "District / City" },
      { key: "onboardedOn", header: "Date of Onboarding" },
      num("surveyors", "Surveyors Mapped"),
      num("identified", "Beneficiaries Identified"),
      { key: "status", header: "Status" },
      { key: "contact", header: "Contact Person" },
    ],
    rows: agencyRows(),
  },
  {
    slug: "comprehensive-rehab",
    title: "Comprehensive Rehab Report",
    subtitle:
      "Full rehabilitation form per beneficiary — employment, enterprise, scheme convergence and follow-up.",
    columns: [
      { key: "admin", header: "Admin No. / Participant ID" },
      { key: "name", header: "Name of Beneficiary" },
      { key: "city", header: "City" },
      { key: "gender", header: "Sex" },
      num("age", "Age"),
      { key: "rehabType", header: "Type of Rehabilitation" },
      { key: "category", header: "Rehab / Skilling Category" },
      { key: "specify", header: "If Other – Specify" },
      { key: "employer", header: "Employer Name" },
      { key: "employerAddress", header: "Employer Address" },
      { key: "sector", header: "Sector / Industry" },
      { key: "designation", header: "Designation / Role" },
      { key: "wageType", header: "Wage Type" },
      num("wageIncome", "Monthly Income (Wage)"),
      { key: "businessType", header: "Type of Business" },
      { key: "businessLocation", header: "Business Location" },
      { key: "financeSupport", header: "Finance Support" },
      { key: "financeSource", header: "Source of Finance" },
      num("selfIncome", "Monthly Income (Self-Emp)"),
      { key: "convergence", header: "Govt Scheme Convergence" },
      { key: "schemeName", header: "Govt Scheme Name" },
      { key: "benefit", header: "Benefit Received" },
      { key: "followUp", header: "3-Month Follow-up" },
      { key: "state", header: "State" },
      { key: "district", header: "District / City" },
    ],
    rows: comprehensiveRehabRows(),
  },
  {
    slug: "master",
    title: "Master Report",
    subtitle:
      "Aggregated per-district programme snapshot — surveys, mobilisation, shelter, rehabilitation, consent and fund monitoring.",
    columns: [
      { key: "state", header: "States/UTs" },
      { key: "district", header: "Name of District" },
      { key: "commencement", header: "Year of Commencement" },
      { key: "consent", header: "Consent received" },
      { key: "nodalOfficer", header: "Nodal Officer Details" },
      { key: "nodalContact", header: "Nodal Officer Contact No." },
      { key: "nodalEmail", header: "Nodal Officer E Mail id" },
      { key: "phase", header: "Phase" },
      num("firstInstalment", "1st Installment Released in Lac"),
      num("secondInstalment", "2nd Installment Initiated in Lac"),
      num("thirdInstalment", "3rd Installment Initiated in Lacs."),
      { key: "agency", header: "Name of Implementing Agency/NGO" },
      { key: "agencyContact", header: "Contact No. of Implementing Agency/NGO" },
      { key: "shelterSecured", header: "Shelter Home Availability Secured" },
      num("surveyTotal", "Survey Total"),
      num("surveyMale", "Survey Male"),
      num("surveyFemale", "Survey Female"),
      num("surveyTransgender", "Survey Transgender"),
      num("mobilisedTotal", "Moblised to Shelter Home Total"),
      num("rehabTotal", "Rehabilitation Total"),
    ],
    rows: masterRows(),
  },
];

/*
 * Every row carries `_id`, minted here rather than derived at render time.
 *
 * A report's natural columns are not unique: two states both have a district
 * called Aurangabad, and "Red light areas" is the name of a survey location in
 * six of them. Keying a row on its name or district gave React two children
 * with the same key on the Master and Survey Location reports, which is how a
 * row gets duplicated or dropped when the register is filtered.
 */
for (const report of MIS_REPORTS) {
  report.rows.forEach((row, i) => {
    row._id = `${report.slug}-${i + 1}`;
  });
}

export function misReport(slug: string) {
  return MIS_REPORTS.find((r) => r.slug === slug);
}

/** Every state named by any report row, for the State filter. */
export const REPORT_STATES = [
  "All States / UTs",
  ...STATES.map((s) => s.name),
];

export const DATA_VERSIONS = ["Consolidated (All)", "Version 2 - New", "Version 1 - Old"];

export { iso };
