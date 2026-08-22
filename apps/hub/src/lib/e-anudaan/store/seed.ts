/**
 * Deterministic seed data.
 *
 * Two rules this file exists to enforce:
 *
 * 1. **No `Math.random`, no `Date.now`, no argless `new Date()`.** A seed that varies between
 *    SSR and CSR produces a hydration mismatch, and one that varies between runs makes
 *    screenshots and demos irreproducible. All randomness is an LCG over a fixed constant and
 *    all timestamps are offsets from `SEED_NOW`.
 *
 * 2. **Applications are placed by REPLAY, not by assignment.** Every non-draft record is created
 *    as a Draft and then driven to its target position by calling the real `applyAction`. So the
 *    audit trail is a by-product of the actual state machine and cannot disagree with the status
 *    — and seeding doubles as a smoke test: a broken rule throws at boot.
 */

import { applyAction, type Clock, type WorkflowAction } from "../workflow.ts";
import { demoVerdictFor } from "../doc-verification.ts";
import {
  GRADES,
  type Division,
  type Grade,
  type GrantApplication,
  type Inspection,
  type MockDoc,
  type NgoProfile,
  type NotificationEntry,
  type Scheme,
} from "../types.ts";

/** The demo's "today". Matches the recon capture date so seeded ageing reads sensibly. */
export const SEED_NOW = "2026-08-12T09:00:00.000Z";

const DAY = 86_400_000;

function iso(daysAgo: number): string {
  return new Date(Date.parse(SEED_NOW) - daysAgo * DAY).toISOString();
}

/** Mulberry32 — small, deterministic, good enough for picking demo values. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RNG_SEED = 20260812;

// Generator state is module-level for convenience but MUST be reset at the top of buildSeed().
// Without that, a second call (resetStore(), or React re-invoking the lazy useState initialiser)
// continues the sequence and produces a different dataset — which in an SSR/CSR pair is a
// hydration mismatch. `the seed is deterministic` in workflow.test.ts is the guard.
let rand = rng(RNG_SEED);
let counter = 0;
let legacySeq = 76000;

function resetGenerators(): void {
  rand = rng(RNG_SEED);
  counter = 0;
  legacySeq = 76000;
}

const pick = <T>(xs: readonly T[]): T =>
  xs[Math.floor(rand() * xs.length)] as T;
const between = (lo: number, hi: number) =>
  lo + Math.floor(rand() * (hi - lo + 1));

const nextId = (prefix: string) =>
  `${prefix}-${(++counter).toString().padStart(5, "0")}`;

/** Filled by buildSeed() before any draft is created. */
let ngoPool: NgoProfile[] = [];

function clockAt(daysAgo: number): Clock {
  return { now: iso(daysAgo), id: nextId };
}

/* ── schemes — all four offered on the live NGO portal ─────────────────────── */

export const SEED_SCHEMES: Scheme[] = [
  {
    code: "NAPDDR",
    name: "NAPDDR",
    description:
      "National Action Plan for Drug Demand Reduction. Prevention, treatment, rehabilitation, social-reintegration and aftercare for persons affected by substance abuse.",
    target: "Persons affected by substance abuse",
  },
  {
    code: "AVYAY",
    name: "AVYAY (Atal Vayo Abhyuday Yojana)",
    description:
      "Atal Vayo Abhyuday Yojana — umbrella scheme covering Integrated Programme for Senior Citizens (IPSrC), maintenance of Old Age Homes / Continuous Care Homes, Rashtriya Vayoshri Yojana, Silver Economy etc.",
    target: "Senior citizens",
  },
  {
    code: "SHRESHTA_M2",
    name: "SHRESHTA Mode 2",
    description:
      "SHRESHTA Mode 2 — grant-in-aid to NGO-run / state-government residential schools for SC students (Class 9–12).",
    target: "SC students in NGO-run schools",
  },
  {
    code: "SMILE_GG",
    name: "Support for Marginalized Individuals for Livelihood & Enterprise",
    description:
      "Garima Greh sub-scheme under SMILE — shelter homes for transgender persons providing food, medical care, recreational facilities, skill development and capacity-building support.",
    target: "Transgender persons",
  },
];

/* ── NGOs — entirely fictional. The live portal holds real registered NGOs. ─── */

const NGO_NAMES = [
  "Sankalp Seva Sansthan",
  "Prerna Shiksha Samiti",
  "Adarsh Gramin Vikas Mandal",
  "Jyoti Bal Kalyan Trust",
  "Navchetna Shikshan Prasarak Mandal",
  "Ekta Mahila Mandal",
  "Saraswati Vidya Samiti",
  "Bharat Uday Foundation",
  "Ankur Adivasi Seva Sangh",
  "Vikas Jyoti Educational Society",
  "Samarpan Gramodaya Sansthan",
  "Disha Bahujan Shiksha Trust",
] as const;

const PLACES: readonly { state: string; district: string; code: string }[] = [
  { state: "Maharashtra", district: "Pune", code: "MH/PUN" },
  { state: "Uttar Pradesh", district: "Barabanki", code: "UP/BAR" },
  { state: "Delhi", district: "North West Delhi", code: "DL/NWD" },
  { state: "Gujarat", district: "Ahmedabad", code: "GJ/AHM" },
  { state: "Rajasthan", district: "Jaipur", code: "RJ/JAI" },
  { state: "Karnataka", district: "Belagavi", code: "KA/BEL" },
  { state: "Madhya Pradesh", district: "Rewa", code: "MP/REW" },
  { state: "Odisha", district: "Koraput", code: "OD/KOR" },
];

const NATURES = [
  "Primary Residential School",
  "Secondary Residential School",
  "Primary Non-Residential School",
  "Secondary Non-Residential School",
] as const;

/**
 * Districts the signed-in applicant runs institutions in. The live account shows eleven
 * projects spread over Delhi, Gujarat, Tamil Nadu and Uttar Pradesh; this mirrors that spread
 * so the project selects, the bank-accounts table and the attendance screens are not
 * single-option lists.
 */
const APPLICANT_SITES: readonly { code: string; district: string; state: string; name: string }[] = [
  { code: "DL/NWD", district: "North West Delhi", state: "Delhi", name: "Hostel" },
  { code: "DL/STS", district: "South East Delhi", state: "Delhi", name: "Hostel" },
  { code: "GJ/AHM", district: "Ahmedabad", state: "Gujarat", name: "Residential School" },
  { code: "GJ/AHM", district: "Ahmedabad", state: "Gujarat", name: "Hostel" },
  { code: "TN/KLI", district: "Kallakurichi", state: "Tamil Nadu", name: "Residential School" },
  { code: "TN/MDR", district: "Madurai", state: "Tamil Nadu", name: "Residential School" },
  { code: "UP/BRB", district: "Barabanki", state: "Uttar Pradesh", name: "Residential School" },
  { code: "UP/HAR", district: "Hardoi", state: "Uttar Pradesh", name: "Residential School" },
  { code: "MH/PUN", district: "Pune", state: "Maharashtra", name: "Hostel" },
  { code: "MH/PUN", district: "Pune", state: "Maharashtra", name: "Residential School" },
  { code: "MH/THN", district: "Thane", state: "Maharashtra", name: "Hostel" },
];

function buildNgos(): NgoProfile[] {
  return NGO_NAMES.map((name, i) => {
    const place = PLACES[i % PLACES.length]!;
    const instCount = i === 0 ? APPLICANT_SITES.length : between(1, 3);
    return {
      id: `ngo-${(i + 1).toString().padStart(3, "0")}`,
      name,
      darpanId: `${place.code.split("/")[0]}/2016/${(100000 + i * 137).toString()}`,
      registrationNo: `${between(10, 99)}-${between(10, 99)}`,
      registrationDate: "12 Mar 1978",
      registeredUnder: "Registrar of Societies",
      state: place.state,
      district: place.district,
      // Invented office bearers. The live demo account belongs to a real registered NGO, and its
      // real chairman, secretary and treasurer are named on its dashboard — none of that belongs
      // in this repo.
      chairman: "Devendra Rao Kulkarni",
      secretary: "Meenakshi Iyer",
      treasurer: "Harpreet Singh Bedi",
      authorisedUser: name,
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`,
      mobile: `9441747${(200 + i).toString()}`,
      applicationCount: 0,
      sanctionedCount: 0,
      totalGrant: 0,
      lastInspection: i % 3 === 0 ? iso(between(30, 400)) : undefined,
      institutions: Array.from({ length: instCount }, (_, k) => ({
        id:
          i === 0
            ? `SC/${APPLICANT_SITES[k]!.code}/${(2400 + k * 13).toString().padStart(5, "0")}`
            : `SC/${place.code}/${(2000 + i * 7 + k).toString().padStart(5, "0")}`,
        name: i === 0 ? APPLICANT_SITES[k]!.name : k === 0 ? "Hostel" : "Residential School",
        district: i === 0 ? APPLICANT_SITES[k]!.district : place.district,
        state: i === 0 ? APPLICANT_SITES[k]!.state : place.state,
        nature: pick(NATURES),
        type: pick(["Boys", "Girls", "Co-Ed"] as const),
        level: pick(["Primary", "Secondary"] as const),
        building: pick(["Owned", "Rented"] as const),
        pin: String(between(110001, 799999)),
      })),
    };
  });
}

/* ── the 20-slot document checklist, verbatim from the live portal ─────────── */

const DOC_TITLES: readonly {
  title: string;
  optional?: boolean;
  conditional?: string;
}[] = [
  {
    title:
      "Registration Certificate (Societies Registration Act 1860 / Charitable Trust)",
  },
  { title: "PAN of the Organisation" },
  { title: "Annual Report — Previous Financial Year" },
  { title: "List of Beneficiaries — Previous Year" },
  { title: "List of Managing Committee Members" },
  { title: "Budget Estimates — Current Year" },
  {
    title:
      "Audited Accounts (Balance Sheet, Income & Expenditure, Receipt & Payment)",
  },
  {
    title: "Utilisation Certificate (GFR 12-A) — Previous Year, CA-signed",
    conditional: "Required when the institution received a grant last year",
  },
  {
    title: "Provisional UCs — Grants Released Previous Year (GFR 12-A)",
    conditional: "Required when the institution received a grant last year",
  },
  { title: "Bank Authorisation Letter (name, A/C no., address, IFSC / MICR)" },
  { title: "Agreement Bond / PSR on Non-Judicial Stamp Paper" },
  { title: "Compliance Status — Proactive Disclosures & CCTV Installation" },
  { title: "EAT Module Implementation Status" },
  {
    title: "Justification for Continuation of Ongoing Institution",
    conditional: "Required when the institution is ongoing",
  },
  { title: "Accounts in Parts (I&E, R&P, Balance Sheet, Auditor's Report)" },
  {
    title: "List of Employees (name, designation, category, photo ID, Aadhaar)",
  },
  {
    title: "Rent Agreement, Institution Location & Route Map",
    optional: true,
    conditional: "Required when the institution is rented",
  },
  { title: "Details of Income and Expenditure" },
  { title: "School Recognition Certificate" },
  { title: "Audit Report — Previous Year" },
];

/** Titles the review screen groups as permanent rather than annual. */
const PERMANENT_DOCS = new Set([
  "Registration Certificate (Societies Registration Act 1860 / Charitable Trust)",
  "PAN of the Organisation",
  "Bank Authorisation Letter (name, A/C no., address, IFSC / MICR)",
  "School Recognition Certificate",
]);

function docsFor(complete: boolean): MockDoc[] {
  return DOC_TITLES.map((d, i) => {
    const filled = complete || i < 12;
    return {
      id: nextId("doc"),
      slot: i + 1,
      title: d.title,
      group: PERMANENT_DOCS.has(d.title) ? "permanent" : "annual",
      optional: d.optional,
      conditional: d.conditional,
      reviewStatus: "Pending",
      reUploadedThisYear: PERMANENT_DOCS.has(d.title) && i % 2 === 0,
      ...(filled
        ? {
            fileName: `annexure-${i + 1}.pdf`,
            sizeKb: between(60, 1400),
            uploadedAt: iso(between(20, 200)),
            // Cycle the four verdicts so the applicant screen shows every branch.
            aiVerdict: demoVerdictFor(
              i % 7 === 0 ? "invalid" : i % 5 === 0 ? "review" : i % 3 === 0 ? "verified" : "pending",
              d.title,
            ),
          }
        : {}),
    };
  });
}

/* ── application factory ──────────────────────────────────────────────────── */

const FYS = ["2024-25", "2025-26", "2026-27"] as const;
function draft(
  ngoIdx: number,
  schemeCode: string,
  fy: string,
  ageDays: number,
): GrantApplication {
  const ngo = ngoPool[ngoIdx % ngoPool.length]!;
  // Rotate through the NGO's institutions so its register is not one project repeated.
  const inst = ngo.institutions[counter % ngo.institutions.length]!;
  const sc = between(40, 260);
  const other = between(0, 40);
  const recurring = between(18, 70) * 100000;
  const nonRecurring = between(4, 30) * 100000;
  // Legacy records use the LGCY/nnnnn namespace; new ones the structured GIA form. Both live.
  const useLegacy = fy !== "2026-27";
  const id = useLegacy
    ? `LGCY/${++legacySeq}`
    : `GIA/${fy}/${schemeCode}/${inst.district.toUpperCase().replace(/\s+/g, "_")}/${(++counter).toString().padStart(5, "0")}`;
  return {
    id,
    schemeCode,
    ngoId: ngo.id,
    institutionId: inst.id,
    projectLabel: `${inst.name} — ${inst.district} · FY ${fy}`,
    financialYear: fy,
    status: "Draft",
    holder: { kind: "ngo" },
    scBeneficiaries: sc,
    otherBeneficiaries: other,
    totalBeneficiaries: sc + other,
    recurring,
    nonRecurring,
    total: recurring + nonRecurring,
    documents: docsFor(true),
    // The answers as submitted, keyed by the scheme form's field names. Two fields are left
    // blank on purpose so the applicant's read-back reads "n of m answered" rather than a
    // uniform 100%, exactly as the live screen does.
    formValues: {
      fld_ngo_name: ngo.name,
      fld_darpan_id: ngo.darpanId,
      fld_statute_act: ngo.registeredUnder ?? "Registrar of Societies",
      fld_registration_number: ngo.registrationNo,
      fld_registration_date: "1934-08-06",
      fld_registration_expiry: "2028-09-04",
      fld_reg_office_address: `${inst.name}, ${inst.district}, ${ngo.state}`,
      fld_reg_office_city: inst.district,
      fld_reg_office_district: ngo.district,
      fld_reg_office_state: ngo.state,
      fld_contact_mobile: ngo.mobile ?? "",
      fld_contact_email: ngo.email ?? "",
      fld_project_id: inst.id,
      fld_institution_id: inst.id,
      fld_financial_year: fy,
      fld_nature_of_institution: "Secondary Residential School",
      fld_institution_gender_type: "Co-Ed",
      fld_institution_level: "Secondary",
      fld_institution_status: "Ongoing",
      assistance_3yrs: "Yes",
      fld_uc_pending_status: "No UC Pending",
      fld_commencement_date: "1983-05-01",
      fld_gia_since_year: "1983",
      fld_institution_location: `${inst.name}, ${inst.district}`,
      fld_institution_pin: "411045",
      govt_institution_within_2km: "No",
      fld_building_ownership: "Owned",
      bank_ngo_name_declared: "Yes",
      bank_joint_operation: "Yes",
      bank_hq_at_institution: "Yes",
      bank_joint_secretary_head: "No",
      bank_separate_institution_accounts: "Yes",
      fld_bank_account_number: "123456789012",
      fld_bank_ifsc: "SBIN0001234",
      fld_bank_name_branch: `State Bank of India, ${inst.district}`,
      fld_bank_resource_mobilisation: "Community donations and CSR grants",
      fld_gia_released_last_3yrs: "Sanction 12/2024 dated 14 Aug 2024",
      fld_beneficiaries_sc: String(sc),
      fld_beneficiaries_other: String(other),
      fld_total_beneficiaries: String(sc + other),
      fld_beneficiaries_previous_year: String(Math.max(sc + other - 8, 0)),
      fld_grant_recurring: String(recurring),
      fld_grant_non_recurring: String(nonRecurring),
      fld_grant_total: String(recurring + nonRecurring),
      decl_uc_uploaded: "Yes",
      decl_audited_accounts_submitted: "Yes",
      decl_name_changed_after_grant: "No",
      decl_not_for_profit: "Yes",
      decl_other_grant: "No",
      decl_fee_charged: "No",
      decl_not_blacklisted: "Yes",
      decl_annual_report_uploaded: "Yes",
      decl_all_docs_signed: "Yes",
      fld_auth_person_name: ngo.authorisedUser ?? ngo.name,
      fld_auth_person_contact: ngo.mobile ?? "",
      fld_auth_place: ngo.district,
      fld_auth_date: "2026-08-07",
      fld_auth_time: "18:25",
      // fld_contact_telephone and fld_contact_fax deliberately left unanswered.
    },
    deficiencies: [],
    queries: [],
    showCauseNotices: [],
    audit: [],
    updatedAt: iso(ageDays),
    ageingDays: ageDays,
  };
}

/**
 * Default remark per action, so the applicant's Processing History reads like a real file note
 * rather than exposing the seeding machinery.
 */
const SEED_REMARKS: Partial<Record<WorkflowAction, string>> = {
  submit: "Application submitted.",
  certify: "Documents verified and the file certified.",
  forward: "Forwarded to the next authority.",
  concur: "Financial concurrence recorded.",
  sanction: "Sanctioned as recommended.",
  reject: "Application rejected.",
  return: "Returned to the applicant for correction.",
};

/** Drive a draft through a scripted sequence of actions, failing loudly if a rule rejects one. */
function replay(
  app: GrantApplication,
  steps: readonly {
    role: Parameters<typeof applyAction>[1];
    action: WorkflowAction;
    daysAgo: number;
    remarks?: string;
  }[],
): GrantApplication {
  let cur = app;
  for (const s of steps) {
    const res = applyAction(
      cur,
      s.role,
      s.action,
      {
        remarks: s.remarks ?? SEED_REMARKS[s.action] ?? "Recorded on the file.",
        certified: true,
      },
      clockAt(s.daysAgo),
    );
    if (!res.ok) {
      throw new Error(
        `[e-anudaan seed] ${app.id}: ${s.role} cannot ${s.action} — ${res.error}`,
      );
    }
    cur = res.app;
  }
  return cur;
}

/** How many PD grades a file must pass through to reach the target seat. */
function pdTargetFor(division: Division, grade: Grade): number {
  return division === "pd" ? GRADES.indexOf(grade) : GRADES.length;
}

/** Walk a fresh draft up to (and including) the given division/grade seat. */
function driveToChain(
  app: GrantApplication,
  division: Division,
  grade: Grade,
  startDaysAgo: number,
): GrantApplication {
  const steps: {
    role: Parameters<typeof applyAction>[1];
    action: WorkflowAction;
    daysAgo: number;
  }[] = [
    { role: "ngo", action: "submit", daysAgo: startDaysAgo },
  ];
  // PD:ASO's "Certify & Forward" is gated on Record Certification, so a file that moves
  // PAST the ASO must carry one. A file that STOPS at the ASO deliberately does not — that
  // is the "awaiting certification" state the review screen is built to show.
  if (pdTargetFor(division, grade) > 0) {
    steps.push({
      role: "pd-aso",
      action: "certify",
      daysAgo: Math.max(startDaysAgo - 1, 1),
    });
  }
  let d = startDaysAgo - 2;
  const pdTarget = pdTargetFor(division, grade);
  for (let i = 0; i < pdTarget; i++) {
    steps.push({
      role: `pd-${GRADES[i] as Grade}`,
      action: "forward",
      daysAgo: Math.max(d, 1),
    });
    d -= 2;
  }
  if (division === "finance") {
    const ifdTarget = GRADES.indexOf(grade);
    for (let i = 0; i < ifdTarget; i++) {
      steps.push({
        role: `finance-${GRADES[i] as Grade}`,
        action: "forward",
        daysAgo: Math.max(d, 1),
      });
      d -= 2;
    }
  }
  return replay(app, steps);
}

/**
 * Where the seeded files sit. Every officer login must land on a non-empty worklist — an empty
 * queue on first sign-in reads as a broken portal, not as an empty one.
 */
const TARGETS: readonly { division: Division; grade: Grade; count: number }[] =
  [
    { division: "pd", grade: "aso", count: 5 },
    { division: "pd", grade: "so", count: 4 },
    { division: "pd", grade: "us", count: 4 },
    { division: "pd", grade: "ds", count: 3 },
    { division: "pd", grade: "js", count: 3 },
    { division: "finance", grade: "aso", count: 4 },
    { division: "finance", grade: "so", count: 3 },
    { division: "finance", grade: "us", count: 3 },
    { division: "finance", grade: "ds", count: 3 },
    { division: "finance", grade: "js", count: 3 },
  ];

export function buildSeed(): {
  applications: GrantApplication[];
  ngos: NgoProfile[];
  inspections: Inspection[];
  notifications: NotificationEntry[];
} {
  resetGenerators();
  ngoPool = buildNgos();

  const apps: GrantApplication[] = [];
  let n = 0;

  // 1. Files parked at every seat in both chains.
  for (const t of TARGETS) {
    for (let i = 0; i < t.count; i++) {
      const age = between(3, 26);
      apps.push(
        driveToChain(
          draft(n, "SHRESHTA_M2", "2026-27", age + 10),
          t.division,
          t.grade,
          age + 8,
        ),
      );
      n++;
    }
  }

  // 2. Awaiting the Programme Director's decision.
  for (let i = 0; i < 4; i++) {
    const age = between(4, 15);
    let a = driveToChain(
      draft(n++, "SHRESHTA_M2", "2026-27", age + 20),
      "finance",
      "js",
      age + 18,
    );
    a = replay(a, [
      {
        role: "finance-js",
        action: "concur",
        daysAgo: age,
        remarks: "Financial concurrence recorded.",
      },
    ]);
    apps.push(a);
  }

  // 3. Sanctioned, and one released-style record per FY for the Sanction Register.
  for (let i = 0; i < 6; i++) {
    const age = between(30, 200);
    let a = driveToChain(
      draft(n++, "SHRESHTA_M2", pick(FYS), age + 40),
      "finance",
      "js",
      age + 36,
    );
    a = replay(a, [
      {
        role: "finance-js",
        action: "concur",
        daysAgo: age + 6,
        remarks: "Concurrence recorded.",
      },
      {
        role: "programme-director",
        action: "sanction",
        daysAgo: age,
        remarks: "Sanctioned as recommended.",
      },
    ]);
    apps.push(a);
  }

  // 4. Returned by the PD — back at the bottom of the PD chain, re-climbing.
  for (let i = 0; i < 2; i++) {
    const age = between(5, 20);
    let a = driveToChain(
      draft(n++, "SHRESHTA_M2", "2026-27", age + 30),
      "finance",
      "js",
      age + 26,
    );
    a = replay(a, [
      {
        role: "finance-js",
        action: "concur",
        daysAgo: age + 8,
        remarks: "Concurrence recorded.",
      },
      {
        role: "programme-director",
        action: "return",
        daysAgo: age,
        remarks: "Beneficiary figures need reconciliation before sanction.",
      },
    ]);
    apps.push(a);
  }

  // 5. Deficiency loop — sitting with the NGO awaiting a response.
  for (let i = 0; i < 3; i++) {
    const age = between(2, 12);
    let a = driveToChain(
      draft(n++, "SHRESHTA_M2", "2026-27", age + 16),
      "pd",
      "aso",
      age + 14,
    );
    a = replay(a, [
      {
        role: "pd-aso",
        action: "raiseDeficiency",
        daysAgo: age + 4,
        remarks: "Audited accounts for the previous year are not legible.",
      },
      {
        role: "pd-so",
        action: "communicateDeficiency",
        daysAgo: age,
        remarks: "Deficiency communicated to the applicant.",
      },
    ]);
    apps.push(a);
  }

  // 6. Query loop — US pushed a file back to SO.
  for (let i = 0; i < 2; i++) {
    const age = between(2, 10);
    let a = driveToChain(
      draft(n++, "SHRESHTA_M2", "2026-27", age + 18),
      "pd",
      "us",
      age + 16,
    );
    a = replay(a, [
      {
        role: "pd-us",
        action: "raiseQuery",
        daysAgo: age,
        remarks:
          "Clarify the non-recurring component against last year's release.",
      },
    ]);
    apps.push(a);
  }

  // 7. Rejected.
  for (let i = 0; i < 2; i++) {
    const age = between(40, 160);
    let a = driveToChain(
      draft(n++, "SHRESHTA_M2", pick(FYS), age + 20),
      "pd",
      "ds",
      age + 18,
    );
    a = replay(a, [
      {
        role: "pd-ds",
        action: "reject",
        daysAgo: age,
        remarks:
          "Institution no longer meets the residential-school criterion.",
      },
    ]);
    apps.push(a);
  }

  // 8. NGO-side drafts and a couple of other-scheme records, so the applicant dashboard is real.
  for (let i = 0; i < 4; i++)
    apps.push(draft(n++, "SHRESHTA_M2", "2026-27", between(1, 20)));
  for (const code of ["AVYAY", "NAPDDR"] as const) {
    const age = between(3, 15);
    apps.push(
      driveToChain(draft(n++, code, "2026-27", age + 6), "pd", "aso", age + 4),
    );
  }

  // 9. The signed-in applicant's own back-catalogue.
  //
  // Blocks 1–8 spread their files across the whole NGO pool, which left the applicant screens
  // with a handful of rows while the live portal shows this organisation 71 applications across
  // two schemes and six financial years. Everything below is raised for ngoPool[0] — the NGO the
  // demo signs in as — so My Applications paginates, the status chips all have members, and the
  // dashboard's donut and Applications-by-Scheme cards carry live-like proportions.
  const MINE = 0;
  const BACKLOG_FYS = ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26", "2026-27"] as const;

  const mineCount = () => apps.filter((a) => a.ngoId === ngoPool[MINE]!.id).length;

  // Sanctioned history — the bulk of an established NGO's record.
  while (mineCount() < 36) {
    const fy = BACKLOG_FYS[mineCount() % BACKLOG_FYS.length]!;
    const age = between(60, 900);
    let a = driveToChain(draft(MINE, "SHRESHTA_M2", fy, age + 40), "finance", "js", age + 36);
    a = replay(a, [
      { role: "finance-js", action: "concur", daysAgo: age + 6, remarks: "Concurrence recorded." },
      { role: "programme-director", action: "sanction", daysAgo: age, remarks: "Sanctioned as recommended." },
    ]);
    apps.push(a);
  }

  // In review — spread across both chains so every seat has one of this NGO's files.
  const REVIEW_SEATS = [
    { division: "pd", grade: "aso" },
    { division: "pd", grade: "so" },
    { division: "pd", grade: "us" },
    { division: "pd", grade: "ds" },
    { division: "pd", grade: "js" },
    { division: "finance", grade: "aso" },
    { division: "finance", grade: "so" },
    { division: "finance", grade: "us" },
    { division: "finance", grade: "ds" },
  ] as const;
  while (mineCount() < 53) {
    const seat = REVIEW_SEATS[mineCount() % REVIEW_SEATS.length]!;
    const fy = BACKLOG_FYS[mineCount() % BACKLOG_FYS.length]!;
    const age = between(4, 40);
    apps.push(driveToChain(draft(MINE, "SHRESHTA_M2", fy, age + 12), seat.division, seat.grade, age + 8));
  }

  // Drafts the applicant has not sent yet.
  while (mineCount() < 66) {
    apps.push(draft(MINE, "SHRESHTA_M2", "2026-27", between(1, 45)));
  }

  // Submitted, still to be picked up.
  while (mineCount() < 70) {
    const age = between(1, 9);
    apps.push(driveToChain(draft(MINE, "SHRESHTA_M2", "2026-27", age + 3), "pd", "aso", age));
  }

  // One AVYAY file, so the applicant spans two schemes exactly as the live account does.
  {
    const age = between(3, 12);
    apps.push(driveToChain(draft(MINE, "AVYAY", "2026-27", age + 6), "pd", "aso", age + 4));
  }

  // Flag a couple of documents on files an officer has already certified, so the applicant's
  // "N Documents Require Attention" callout — and the "You will be able to upload a corrected
  // file once the application is returned to you." note under each flagged row — are reachable.
  apps.forEach((app, i) => {
    if (i % 5 !== 0) return;
    if (!app.audit.some((e) => e.action === "certify")) return;
    for (const slot of [3, 4]) {
      const doc = app.documents.find((d) => d.slot === slot);
      if (doc) doc.reviewStatus = "Deficient";
    }
  });

  // Ageing must be recomputed AFTER the replay. `applyAction` resets ageingDays to 0 on every
  // transition — correct at runtime, since a file that just moved has been with its new holder
  // for no time at all — but it means a seeded file would always read as 0 days old and the
  // "Pending — Ageing" panel would be empty on every dashboard. Derive it from the last audit
  // entry instead, which is when the file actually arrived where it now sits.
  for (const app of apps) {
    const arrivedAt = app.audit[app.audit.length - 1]?.at ?? app.updatedAt;
    const days = Math.round((Date.parse(SEED_NOW) - Date.parse(arrivedAt)) / DAY);
    app.ageingDays = Math.max(days, 0);
    app.updatedAt = arrivedAt;
  }

  // Roll NGO aggregates up from the applications rather than inventing them.
  const ngos = ngoPool.map((ngo) => {
    const mine = apps.filter((a) => a.ngoId === ngo.id);
    return {
      ...ngo,
      applicationCount: mine.length,
      sanctionedCount: mine.filter((a) => a.status === "Sanctioned").length,
      totalGrant: mine.reduce((s, a) => s + (a.sanction?.total ?? 0), 0),
    };
  });

  // Inspections — attached to files at or past PD:US, which is where the inspection desk sits.
  const inspectable = apps.filter(
    (a) =>
      a.holder.kind !== "ngo" &&
      (a.holder.kind !== "chain" ||
        GRADES.indexOf(a.holder.grade) >= 2 ||
        a.holder.division === "finance"),
  );
  const inspections: Inspection[] = inspectable.slice(0, 12).map((a, i) => {
    const status = (["Pending", "Scheduled", "Submitted", "Reviewed"] as const)[
      i % 4
    ]!;
    return {
      id: nextId("insp"),
      applicationId: a.id,
      ngoId: a.ngoId,
      institutionId: a.institutionId,
      status,
      visitType: i % 3 === 0 ? "Online" : "Physical",
      scheduledFor: status === "Pending" ? undefined : iso(between(1, 40)),
      submittedAt:
        status === "Submitted" || status === "Reviewed"
          ? iso(between(1, 20))
          : undefined,
      findings:
        status === "Submitted" || status === "Reviewed"
          ? "Facilities verified against the sanctioned proposal. Hostel occupancy consistent with the beneficiary count."
          : undefined,
      recommendation: status === "Reviewed" ? "Satisfactory" : undefined,
    };
  });
  for (const insp of inspections) {
    const a = apps.find((x) => x.id === insp.applicationId);
    if (a) a.inspectionId = insp.id;
  }

  // Notifications derive from what actually happened, so they can't contradict the audit trail.
  const notifications: NotificationEntry[] = apps
    .flatMap((a) => a.audit.slice(-1).map((e) => ({ app: a, e })))
    .slice(0, 24)
    .map(({ app, e }, i) => ({
      id: nextId("ntf"),
      at: e.at,
      title:
        e.action === "sanction"
          ? "Application sanctioned"
          : e.action === "communicateDeficiency"
            ? "Deficiency raised"
            : e.action === "reject"
              ? "Application rejected"
              : e.action === "return"
                ? "Application returned for reconsideration"
                : "Application moved forward",
      body: `Application ${app.id} — ${e.remarks ?? "status updated"}.`,
      audience: ["ngo", "pd-aso", "pd-so", "pd-us", "pd-ds", "pd-js"],
      applicationId: app.id,
      read: i > 3,
    }));

  return { applications: apps, ngos, inspections, notifications };
}
