/**
 * District Nodal Officers, Implementing Agency onboarding requests, and the
 * quarterly shelter audit checklist.
 *
 * The three screens these feed are the ones the live dev portal does not serve
 * — it has no `/do-list`, `/ia-approvals` or `/shelter-homes/checklist` route.
 * Each was therefore built from the sentence its own placeholder carried, and
 * from the vocabulary the rest of the portal already uses, rather than from a
 * capture. Where a field had to be chosen it follows the register it belongs
 * to: an officer has the scope a `User` has, an onboarding request carries the
 * fields the Implementing Agency Report prints.
 */
import { IMPLEMENTING_AGENCIES } from "./mis-reports";
import { SHELTER_HOMES } from "./mock-data";

/* ---------- District Nodal Officers ---------- */

export interface DistrictOfficer {
  id: string;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  state: string;
  district: string;
  /** Survey locations the officer's district is running. */
  locations: number;
  beneficiaries: number;
  lastActive: string;
  status: "Active" | "Invited" | "Suspended";
}

const OFFICER_NAMES = [
  ["Pranav Joshi", "District Social Welfare Officer"],
  ["Anita Kale", "District Programme Officer"],
  ["Mehul Patel", "District Social Welfare Officer"],
  ["Riya Shah", "Assistant Commissioner (Social Welfare)"],
  ["Karthik Rao", "District Programme Officer"],
  ["Lakshmi V.", "District Social Welfare Officer"],
  ["Arjun Khanna", "Deputy Commissioner (Welfare)"],
  ["Thomas Kurian", "District Programme Officer"],
  ["Nabanita Das", "District Social Welfare Officer"],
  ["Ravi Prasad", "District Programme Officer"],
  ["Suresh Yadav", "District Social Welfare Officer"],
  ["Shukla D.", "Assistant Commissioner (Social Welfare)"],
  ["Aarti Naik", "District Programme Officer"],
];

export const DISTRICT_OFFICERS: DistrictOfficer[] = IMPLEMENTING_AGENCIES.map((a, i) => {
  const [name, designation] = OFFICER_NAMES[i % OFFICER_NAMES.length]!;
  const slug = a.district.toLowerCase().replace(/[^a-z]/g, "");
  return {
    id: `dno-${String(i + 1).padStart(3, "0")}`,
    name: name!,
    designation: designation!,
    email: `dno.${slug}@gov.test.in`,
    mobile: `98765${String(45000 + i).slice(0, 5)}`,
    state: a.state,
    district: a.district,
    locations: 2 + ((i * 3) % 9),
    beneficiaries: a.identified,
    lastActive: `2026-09-${String(1 + ((i * 2) % 9)).padStart(2, "0")}`,
    // The last two are deliberately not Active: a register where every row is
    // the same is a register that never shows the reader what a problem
    // looks like.
    status: i === IMPLEMENTING_AGENCIES.length - 1 ? "Suspended" : i === IMPLEMENTING_AGENCIES.length - 2 ? "Invited" : "Active",
  };
});

/* ---------- Implementing Agency onboarding requests ---------- */

export type ApprovalState = "Pending" | "Approved" | "Returned" | "Rejected";

export interface IaRequest {
  id: string;
  agency: string;
  agencyType: string;
  registration: string;
  darpan: string;
  state: string;
  district: string;
  submittedBy: string;
  submittedOn: string;
  /** How many of the six onboarding documents are attached. */
  documents: number;
  state_: ApprovalState;
}

export const IA_DOCUMENT_COUNT = 6;

export const IA_REQUESTS: IaRequest[] = IMPLEMENTING_AGENCIES.map((a, i) => ({
  id: `iar-${String(i + 1).padStart(3, "0")}`,
  agency: a.name,
  agencyType: a.agencyType,
  registration: a.registration,
  darpan: a.darpan,
  state: a.state,
  district: a.district,
  submittedBy: `NO ${a.state}`,
  submittedOn: `2026-08-${String(2 + ((i * 2) % 26)).padStart(2, "0")}`,
  documents: i % 5 === 4 ? 4 : IA_DOCUMENT_COUNT,
  state_: (["Pending", "Approved", "Pending", "Returned", "Rejected"] as ApprovalState[])[i % 5]!,
}));

/* ---------- Quarterly shelter audit checklist ---------- */

export type AuditState = "missing" | "attached" | "review" | "rejected";

export interface AuditRequirement {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  state: AuditState;
  fileName?: string;
  findings?: string[];
}

export interface AuditGroup {
  id: string;
  title: string;
  description: string;
  items: AuditRequirement[];
}

/** The shelter the checklist is filed against. The first Active one leads. */
export const AUDITED_SHELTERS = SHELTER_HOMES.filter((s) => s.status !== "Closed");

export function auditGroups(shelterId: string): AuditGroup[] {
  const s = AUDITED_SHELTERS.find((x) => x.id === shelterId) ?? AUDITED_SHELTERS[0]!;
  // Deterministic, and different between shelters, so switching the selector
  // visibly changes the checklist rather than looking stuck.
  const n = AUDITED_SHELTERS.indexOf(s);
  const pick = (i: number): AuditState =>
    (["attached", "attached", "review", "missing", "rejected"] as AuditState[])[(i + n) % 5]!;

  return [
    {
      id: "premises",
      title: "Premises and safety",
      description: "Evidence that the building is fit to house occupants this quarter.",
      items: [
        { id: "fire", label: "Fire safety certificate", description: "Issued by the district fire officer, valid on the audit date.", state: pick(0), fileName: "fire-noc-2026.pdf" },
        { id: "building", label: "Building fitness certificate", description: "Structural fitness, issued by the municipal authority.", state: pick(1), fileName: "fitness-2026.pdf" },
        { id: "sanitation", label: "Sanitation inspection report", description: "Water, toilets and waste handling, inspected this quarter.", state: pick(2) },
        { id: "accessibility", label: "Accessibility audit", description: "Ramps, handrails and an accessible toilet, per the Rights of Persons with Disabilities Act.", state: pick(3) },
      ],
    },
    {
      id: "occupants",
      title: "Occupants and care",
      description: "What the shelter recorded about the people in it.",
      items: [
        { id: "register", label: "Occupancy register extract", description: `Daily occupancy against the sanctioned capacity of ${s.capacity}.`, state: pick(4) },
        { id: "medical", label: "Medical screening records", description: "Entry screening and any referral made during the quarter.", state: pick(0) },
        { id: "meals", label: "Meal and nutrition log", description: "Menu served, and any deviation recorded.", state: pick(1) },
        { id: "grievance", label: "Grievance register", description: "Complaints received from occupants, and how each was closed.", required: false, state: pick(2) },
      ],
    },
    {
      id: "staff",
      title: "Staff and finance",
      description: "Who ran the shelter, and what it cost.",
      items: [
        { id: "roster", label: "Staff roster and qualifications", description: `Signed by the manager on record, ${s.manager}.`, state: pick(3) },
        { id: "police", label: "Police verification of staff", description: "For every member of staff in contact with occupants.", state: pick(4) },
        { id: "utilisation", label: "Utilisation certificate", description: "Quarterly expenditure against the funds released to the shelter.", state: pick(0) },
        { id: "assets", label: "Asset register", description: "Beds, bedding, kitchen and medical equipment held.", required: false, state: pick(1) },
      ],
    },
  ];
}

/*
 * What the checker found, worded so it is true of ANY document on the list.
 *
 * The first version said "the certificate expired" and "the issuing authority
 * does not match", which read as nonsense against an occupancy register or a
 * staff roster — the findings are keyed on the document's STATE, not on which
 * document it is, so anything specific to one artefact is wrong on the rest. A
 * finding that does not describe the document it sits under is worse than no
 * finding: the reader cannot act on it, and may distrust the ones that are right.
 */
export const AUDIT_FINDINGS: Record<AuditState, string[] | undefined> = {
  missing: undefined,
  attached: undefined,
  review: ["The signature on the last page is not legible.", "The period it covers is not stated."],
  rejected: [
    "It is dated outside the quarter being audited.",
    "It does not name the shelter it was issued for.",
  ],
};

/* ---------- Field surveyors ---------- */

export interface Surveyor {
  id: string;
  name: string;
  agency: string;
  mobile: string;
  email: string;
  status: "Active" | "Inactive";
}

const SURVEYOR_NAMES = [
  "Sania", "Aswin PM", "Nikhil Rao", "Meera Joshi", "Farhan Ali",
  "Sunita Devi", "Rakesh Meena", "Priya Nair", "Imran Shaikh", "Kavita Bhosale",
  "Deepak Verma", "Anjali Kurup", "Rohit Kamble",
];

export const SURVEYORS: Surveyor[] = SURVEYOR_NAMES.map((name, i) => {
  const agency = IMPLEMENTING_AGENCIES[i % IMPLEMENTING_AGENCIES.length]!;
  const handle = name.toLowerCase().replace(/[^a-z]/g, "");
  return {
    id: `sur-${String(i + 1).padStart(3, "0")}`,
    name,
    agency: agency.name,
    mobile: `7495${String(60000 + i * 137).slice(0, 6)}`,
    email: `${handle}@${agency.name.split(" ")[0]!.toLowerCase()}.test.in`,
    status: i % 7 === 6 ? "Inactive" : "Active",
  };
});
