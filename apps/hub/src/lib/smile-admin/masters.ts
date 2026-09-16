/**
 * Master Settings — the ten master tables behind the tab rail.
 *
 * Every one of them is read-only on the web, which is not a limitation to work
 * around: the live portal states it in the page's own sentence ("Edits are
 * reserved for Super Admin") and marks every row's action cell "Read-only". The
 * Actions column exists so a reader can see that the row HAS no action, rather
 * than wondering where the edit control went.
 */
import { STATES } from "./states";

export interface MasterTab {
  id: string;
  label: string;
  /** Locked tabs draw the padlock the live rail draws. */
  locked?: boolean;
  columns: string[];
  rows: string[][];
}

const LOCAL_NAME: Record<string, string> = {
  "Andaman & Nicobar Islands": "अंडमान और निकोबार द्वीप समूह",
  "Andhra Pradesh": "ఆంధ్ర ప్రదేశ్",
  "Arunachal Pradesh": "अरुणाचल प्रदेश",
  Assam: "অসম",
  Bihar: "बिहार",
  Chandigarh: "ਚੰਡੀਗੜ੍ਹ",
  Chhattisgarh: "छत्तीसगढ़",
  Delhi: "दिल्ली",
  Goa: "गोंय",
  Gujarat: "ગુજરાત",
  Haryana: "हरियाणा",
  "Himachal Pradesh": "हिमाचल प्रदेश",
  Jharkhand: "झारखंड",
  Karnataka: "ಕರ್ನಾಟಕ",
  Kerala: "കേരളം",
  "Madhya Pradesh": "मध्य प्रदेश",
  Maharashtra: "महाराष्ट्र",
  Manipur: "মণিপুর",
  Meghalaya: "মেঘালয়",
  Mizoram: "मिजोरम",
  Odisha: "ଓଡ଼ିଶା",
  Punjab: "ਪੰਜਾਬ",
  Rajasthan: "राजस्थान",
  Sikkim: "सिक्किम",
  "Tamil Nadu": "தமிழ்நாடு",
  Telangana: "తెలంగాణ",
  Tripura: "ত্রিপুরা",
  Uttarakhand: "उत्तराखंड",
  "Uttar Pradesh": "उत्तर प्रदेश",
  "West Bengal": "পশ্চিমবঙ্গ",
};

const geography: string[][] = STATES.map((s) => [
  String(s.id),
  s.name,
  LOCAL_NAME[s.name] ?? "—",
]);

const roles: string[][] = [
  ["Super Admin", "Central", "All modules", "System"],
  ["Central Authority", "Central", "Programme, Funds, Reports", "System"],
  ["NISD", "Central", "Funds, Reports", "System"],
  ["US / SO", "Central", "Sanction, Release", "System"],
  ["State Nodal Officer", "State", "Programme, Reports", "System"],
  ["District Nodal Officer", "District", "Programme", "System"],
  ["Implementing Agency", "Agency", "Survey, Mobilisation, Rehab", "System"],
  ["Surveyor", "Field", "Survey capture", "System"],
  ["Shelter Manager", "Facility", "Occupancy", "System"],
];

const questionnaire: string[][] = [
  ["Q-01", "Name of the person", "Text", "Yes"],
  ["Q-02", "Age", "Number", "Yes"],
  ["Q-03", "Gender", "Single choice", "Yes"],
  ["Q-04", "Aadhaar available", "Single choice", "No"],
  ["Q-05", "Type of beggary", "Single choice", "Yes"],
  ["Q-06", "Duration in current location", "Single choice", "No"],
  ["Q-07", "Family members accompanying", "Number", "No"],
  ["Q-08", "Willing to be mobilised", "Single choice", "Yes"],
  ["Q-09", "Photograph", "Media", "Yes"],
  ["Q-10", "Geo-coordinates", "Auto", "Yes"],
];

const agencyTypes: string[][] = [
  ["AT-1", "NGO", "Non-governmental organisation"],
  ["AT-2", "Trust", "Registered public trust"],
  ["AT-3", "Society", "Registered society"],
  ["AT-4", "Institute", "Training or academic institute"],
  ["AT-5", "Government body", "State or district department"],
];

const operational: string[][] = [
  ["OP-1", "Survey-location type", "Red light areas, Religious place, Traffic signal, Market, Transport hub, Public park"],
  ["OP-2", "Beneficiary status", "Identified, Under mobilisation, Mobilised, Shelter assigned, Rehabilitated"],
  ["OP-3", "Facility status", "Active, Audit, Closed"],
  ["OP-4", "Consent document state", "Uploaded, Awaited"],
  ["OP-5", "Follow-up state", "Active, 3-month due, Lost to follow-up, Relapsed"],
];

const fundMasters: string[][] = [
  ["FM-1", "Installment", "1st, 2nd, 3rd"],
  ["FM-2", "Phase", "Phase 1, Phase 2, Phase 3"],
  ["FM-3", "Utilisation certificate state", "Received, Pending, N/A"],
  ["FM-4", "Release channel", "NISD, Nodal Officer onward"],
  ["FM-5", "Financial year", "2024-25, 2025-26, 2026-27"],
];

const rehabMasters: string[][] = [
  ["RM-1", "Rehabilitation type", "Skill Training, Wage Employment, Self Employment"],
  ["RM-2", "Wage type", "Daily, Monthly, Piece rate"],
  ["RM-3", "Finance source", "NSKFDC loan, Bank loan, Self-financed, SHG"],
  ["RM-4", "Scheme convergence", "PM-AJAY, NSKFDC, PMKVY, State scheme"],
  ["RM-5", "Follow-up window", "3 month, 6 month, 12 month"],
];

const surveyLocationMasters: string[][] = [
  ["SL-1", "Red light areas", "Field survey"],
  ["SL-2", "Religious place", "Field survey"],
  ["SL-3", "Traffic signal", "Field survey"],
  ["SL-4", "Market", "Field survey"],
  ["SL-5", "Transport hub", "Field survey"],
  ["SL-6", "Public park", "Field survey"],
];

const beggarTypeMasters: string[][] = [
  ["BT-1", "Not classified"],
  ["BT-2", "Homelessness / lack of shelter"],
  ["BT-3", "Person with physical disability"],
  ["BT-4", "Person with mental illness"],
  ["BT-5", "Substance dependence"],
  ["BT-6", "Others (may be specified)"],
];

const skillMasters: string[][] = [
  ["SK-1", "Hospitality Assistant", "3 months"],
  ["SK-2", "Retail Sales Associate", "3 months"],
  ["SK-3", "Tailoring", "6 months"],
  ["SK-4", "Housekeeping", "2 months"],
  ["SK-5", "Driving (LMV)", "4 months"],
  ["SK-6", "Electrical Assistant", "6 months"],
];

export const MASTER_TABS: MasterTab[] = [
  { id: "geography", label: "Geography Masters", locked: true, columns: ["State Code", "State Name", "Local Name"], rows: geography },
  { id: "role-permission", label: "Role & Permission Masters", locked: true, columns: ["Role", "Scope", "Modules", "Source"], rows: roles },
  { id: "survey-questionnaire", label: "Survey Questionnaire Masters", locked: true, columns: ["Code", "Question", "Answer type", "Mandatory"], rows: questionnaire },
  { id: "agency", label: "Agency Masters", columns: ["Code", "Agency type", "Description"], rows: agencyTypes },
  { id: "operational", label: "Operational Masters", columns: ["Code", "List", "Values"], rows: operational },
  { id: "fund-management", label: "Fund Management Masters", columns: ["Code", "List", "Values"], rows: fundMasters },
  { id: "rehabilitation", label: "Rehabilitation Masters", columns: ["Code", "List", "Values"], rows: rehabMasters },
  { id: "survey-location", label: "Survey Location Masters", columns: ["Code", "Location type", "Captured by"], rows: surveyLocationMasters },
  { id: "beggar-type", label: "Beggar Type Masters", columns: ["Code", "Type"], rows: beggarTypeMasters },
  { id: "skill-training", label: "Skill & Training Masters", columns: ["Code", "Course", "Duration"], rows: skillMasters },
];
