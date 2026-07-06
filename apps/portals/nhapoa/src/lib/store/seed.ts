/**
 * Seed data for the NHAPOA mock store.
 *
 * ⚠️ PROVISIONAL — this is realistic, structurally-correct POA-domain data so the
 * store and shells are demonstrable in NHA-1. It MUST be replaced with data
 * captured verbatim from the live portal (categories, districts, schemes,
 * dashboard metrics, table rows) during NHA-2…NHA-8. See epic #8's data-fidelity
 * rule. Any name/mobile here is synthetic, not real PII.
 */

import type {
  AdminUserRecord,
  Allocation,
  Case,
  CategoryRecord,
  Disbursement,
  NotificationItem,
  Rescue,
} from "./types";

// ── Master lists (replace with live-captured masters) ──────────────────────

export const STATES = [
  "Uttar Pradesh",
  "Bihar",
  "Madhya Pradesh",
  "Rajasthan",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
];

/** 2-letter state codes for reference-number generation. */
export const STATE_CODES: Record<string, string> = {
  "Uttar Pradesh": "UP",
  Bihar: "BR",
  "Madhya Pradesh": "MP",
  Rajasthan: "RJ",
  Maharashtra: "MH",
  Karnataka: "KA",
  "Tamil Nadu": "TN",
  Gujarat: "GJ",
};

export const REF_PREFIX = "SAMBAL";

export const DISTRICTS: Record<string, string[]> = {
  "Uttar Pradesh": ["Lucknow", "Kanpur Nagar", "Varanasi", "Agra"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur"],
  Karnataka: ["Bengaluru Urban", "Mysuru", "Belagavi"],
};

export const SCHEMES = [
  "Relief under PoA (Rule 12)",
  "Rehabilitation Assistance",
  "Pension to Dependents",
  "Legal Aid Support",
];

/** Store-owned grievance-category master (statutory PoA Act Section 3 offences).
 *  Single source of truth: managed on the System-Admin Categories screen and read
 *  by the Citizen grievance wizard. slaDays/amountCeiling drive SLA + relief limits. */
export const GRIEVANCE_CATEGORIES: CategoryRecord[] = [
  { id: "cat-1", name: "Abusing by caste name in any place within public view", active: true, slaDays: 30, amountCeiling: 100000 },
  { id: "cat-2", name: "Forcing to eat or drink any inedible or obnoxious substance", active: true, slaDays: 30, amountCeiling: 425000 },
  { id: "cat-3", name: "Dumping excreta, waste, or carcasses in premises or neighbourhood", active: true, slaDays: 30, amountCeiling: 425000 },
  { id: "cat-4", name: "Garlanding with footwear or parading naked or semi-naked", active: true, slaDays: 30, amountCeiling: 850000 },
  { id: "cat-5", name: "Wrongful occupation or cultivation of land", active: true, slaDays: 45, amountCeiling: 425000 },
  { id: "cat-6", name: "Social or economic boycott", active: true, slaDays: 30, amountCeiling: 200000 },
  { id: "cat-7", name: "Denial of access to public services or places", active: true, slaDays: 30, amountCeiling: 100000 },
  { id: "cat-8", name: "Assault or use of force on a woman with intent to dishonour", active: true, slaDays: 15, amountCeiling: 850000 },
];

// ── Seed cases (exercise every status in the state machine) ─────────────────

export const SEED_CASES: Case[] = [
  {
    id: "case-1001",
    refNo: "SAMBAL/2026/UP/001001",
    type: "Relief",
    category: "Physical Assault / Hurt",
    status: "SUBMITTED",
    state: "Uttar Pradesh",
    district: "Lucknow",
    source: "citizen",
    complainantRole: "Victim",
    complainant: { name: "Ramesh Kumar", mobile: "98XXXXXX01", district: "Lucknow", state: "Uttar Pradesh" },
    victim: { name: "Ramesh Kumar", mobile: "98XXXXXX01" },
    details: "Assaulted at the village well; FIR pending.",
    hasFir: false,
    timeline: [{ status: "SUBMITTED", at: "2026-06-28T09:12:00.000Z", byRole: "citizen" }],
    createdAt: "2026-06-28T09:12:00.000Z",
  },
  {
    id: "case-1002",
    refNo: "SAMBAL/2026/BR/001002",
    type: "FIR",
    category: "Social Boycott",
    status: "UNDER_INVESTIGATION",
    state: "Bihar",
    district: "Gaya",
    source: "citizen",
    complainantRole: "Informer",
    complainant: { name: "Sunita Devi", mobile: "98XXXXXX02", district: "Gaya", state: "Bihar" },
    hasFir: true,
    firNumber: "GAYA/PS/2026/145",
    assignedOfficer: "so_govindnagar_kn",
    timeline: [
      { status: "SUBMITTED", at: "2026-06-20T06:00:00.000Z", byRole: "citizen" },
      { status: "ASSIGNED", at: "2026-06-21T05:30:00.000Z", byRole: "district-officer" },
      { status: "UNDER_INVESTIGATION", at: "2026-06-22T04:45:00.000Z", byRole: "sho" },
    ],
    createdAt: "2026-06-20T06:00:00.000Z",
  },
  {
    id: "case-1003",
    refNo: "SAMBAL/2026/KA/001003",
    type: "Relief",
    category: "Land / Property Dispossession",
    status: "PENDING_APPROVAL",
    state: "Karnataka",
    district: "Belagavi",
    source: "call-center",
    complainantRole: "NGO",
    complainant: { name: "Samata Foundation", mobile: "98XXXXXX03", district: "Belagavi", state: "Karnataka" },
    reliefAmount: 425000,
    assignedOfficer: "ba.districtofficer",
    timeline: [
      { status: "SUBMITTED", at: "2026-06-10T10:00:00.000Z", byRole: "call-center" },
      { status: "ASSIGNED", at: "2026-06-11T09:00:00.000Z", byRole: "district-officer" },
      { status: "UNDER_INVESTIGATION", at: "2026-06-13T08:00:00.000Z", byRole: "district-officer" },
      { status: "PENDING_APPROVAL", at: "2026-06-18T07:00:00.000Z", byRole: "district-officer" },
    ],
    createdAt: "2026-06-10T10:00:00.000Z",
  },
  {
    id: "case-1004",
    refNo: "SAMBAL/2026/UP/001004",
    type: "Relief",
    category: "Atrocity against Women",
    status: "APPROVED",
    state: "Uttar Pradesh",
    district: "Varanasi",
    source: "citizen",
    complainantRole: "Victim",
    complainant: { name: "Meena Kumari", mobile: "98XXXXXX04", district: "Varanasi", state: "Uttar Pradesh" },
    reliefAmount: 850000,
    assignedOfficer: "ba.districtofficer",
    timeline: [
      { status: "SUBMITTED", at: "2026-05-30T10:00:00.000Z", byRole: "citizen" },
      { status: "ASSIGNED", at: "2026-05-31T09:00:00.000Z", byRole: "district-officer" },
      { status: "UNDER_INVESTIGATION", at: "2026-06-02T08:00:00.000Z", byRole: "district-officer" },
      { status: "PENDING_APPROVAL", at: "2026-06-08T07:00:00.000Z", byRole: "district-officer" },
      { status: "APPROVED", at: "2026-06-12T06:00:00.000Z", byRole: "state-authority" },
    ],
    createdAt: "2026-05-30T10:00:00.000Z",
  },
];

export const SEED_RESCUES: Rescue[] = [
  {
    id: "rescue-2001",
    refNo: "SAMBAL/RSC/2026/2001",
    name: "Anonymous Caller",
    mobile: "98XXXXXX09",
    location: "NH-19, near Dobhi, Gaya",
    problem: "Family stranded after threats; needs immediate protection.",
    status: "IN_PROGRESS",
    createdAt: "2026-07-01T14:20:00.000Z",
  },
];

export const SEED_DISBURSEMENTS: Disbursement[] = [];

export const SEED_ALLOCATIONS: Allocation[] = [
  { id: "alloc-1", state: "Uttar Pradesh", scheme: "Relief under PoA (Rule 12)", amount: 25000000, at: "2026-04-01T00:00:00.000Z" },
  { id: "alloc-2", state: "Bihar", scheme: "Rehabilitation Assistance", amount: 18000000, at: "2026-04-01T00:00:00.000Z" },
];

export const SEED_USERS: AdminUserRecord[] = [
  { id: "u-1", name: "District Officer", username: "ba.districtofficer", role: "district-officer", district: "Lucknow", state: "Uttar Pradesh", active: true },
  { id: "u-2", name: "SHO Govind Nagar", username: "so_govindnagar_kn", role: "sho", district: "Bengaluru Urban", state: "Karnataka", active: true },
  { id: "u-3", name: "State Authority", username: "ba.stateauthority", role: "state-authority", state: "Uttar Pradesh", active: true },
  { id: "u-4", name: "Finance Officer", username: "ba.financeofficer", role: "finance-officer", state: "Uttar Pradesh", active: true },
  { id: "u-5", name: "Central Authority", username: "ba.centralauthority", role: "central-authority", active: true },
  { id: "u-6", name: "System Administrator", username: "nhapoa_sysadmin", role: "system-admin", active: true },
  { id: "u-7", name: "Ankit Sharma", username: "ankitSharma", role: "call-center", active: true },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: "n-1", role: "district-officer", title: "New grievance assigned", body: "Case SAMBAL/2026/UP/001001 awaits triage.", read: false, at: "2026-06-28T09:15:00.000Z" },
  { id: "n-2", role: "state-authority", title: "Case pending approval", body: "Case SAMBAL/2026/KA/001003 is pending your approval.", read: false, at: "2026-06-18T07:05:00.000Z" },
  { id: "n-3", role: "finance-officer", title: "Case approved for disbursement", body: "Case SAMBAL/2026/UP/001004 approved (₹8,50,000).", read: false, at: "2026-06-12T06:05:00.000Z" },
];
