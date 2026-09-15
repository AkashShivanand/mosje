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

import { applyAction, deficiencyItemsFrom, type Clock, type WorkflowAction } from "../workflow.ts";
import {
  GRADES,
  type Division,
  type Grade,
  type GrantApplication,
  type Inspection,
  type MockDoc,
  type ChangeRequest,
  type DeficiencyItem,
  type NgoProfile,
  type NotificationEntry,
  type ProjectAccount,
  type Scheme,
} from "../types.ts";
import { buildBeneficiaries, buildEmployees, type Beneficiary, type Employee } from "../roster.ts";
import { PROJECT_ID_PREFIX, instalmentAfter, notificationBody, notificationTitle, notifiesApplicant } from "../applicant.ts";
import type { Institution } from "../types.ts";

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
    // Must match the form's key in WIZARDS. It read "SMILE_GG", so choosing SMILE on the scheme
    // picker opened "Please choose a scheme first." and SMILE could not be applied for at all
    // (full-wizard walk, 13 Sep 2026).
    code: "SMILE",
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

/**
 * What a project is, by scheme. SHRESHTA Mode 2 funds residential schools for Classes 9 to 12, so
 * every SHRESHTA project is a secondary residential school — the "Hostel" the officer's NGO profile
 * called a "Primary Non-Residential School" was a random pick from all four school natures
 * (screen QA, 13 Sep 2026).
 */
const NATURE_BY_SCHEME: Record<string, Institution["nature"]> = {
  SHRESHTA_M2: "Secondary Residential School",
  AVYAY: "Senior Citizens' Home",
  NAPDDR: "Integrated Rehabilitation Centre for Addicts",
};
const NAME_BY_SCHEME: Record<string, string> = {
  AVYAY: "Senior Citizens' Home",
  NAPDDR: "Integrated Rehabilitation Centre for Addicts",
};

/**
 * Districts the signed-in applicant runs institutions in. The live account shows eleven
 * projects spread over Delhi, Gujarat, Tamil Nadu and Uttar Pradesh; this mirrors that spread
 * so the project selects, the bank-accounts table and the attendance screens are not
 * single-option lists.
 */
const APPLICANT_SITES: readonly {
  scheme: string;
  code: string;
  district: string;
  state: string;
  name: string;
  type: Institution["type"];
}[] = [
  { scheme: "SHRESHTA_M2", code: "DL/NWD", district: "North West Delhi", state: "Delhi", name: "Hostel", type: "Girls" },
  { scheme: "SHRESHTA_M2", code: "DL/STS", district: "South East Delhi", state: "Delhi", name: "Hostel", type: "Boys" },
  { scheme: "SHRESHTA_M2", code: "GJ/AHM", district: "Ahmedabad", state: "Gujarat", name: "Residential School", type: "Co-Ed" },
  { scheme: "SHRESHTA_M2", code: "GJ/AHM", district: "Ahmedabad", state: "Gujarat", name: "Hostel", type: "Girls" },
  { scheme: "SHRESHTA_M2", code: "TN/KLI", district: "Kallakurichi", state: "Tamil Nadu", name: "Residential School", type: "Boys" },
  { scheme: "SHRESHTA_M2", code: "TN/MDR", district: "Madurai", state: "Tamil Nadu", name: "Residential School", type: "Girls" },
  { scheme: "SHRESHTA_M2", code: "UP/BRB", district: "Barabanki", state: "Uttar Pradesh", name: "Residential School", type: "Co-Ed" },
  { scheme: "SHRESHTA_M2", code: "UP/HAR", district: "Hardoi", state: "Uttar Pradesh", name: "Residential School", type: "Boys" },
  { scheme: "SHRESHTA_M2", code: "MH/PUN", district: "Pune", state: "Maharashtra", name: "Hostel", type: "Girls" },
  { scheme: "SHRESHTA_M2", code: "MH/PUN", district: "Pune", state: "Maharashtra", name: "Residential School", type: "Boys" },
  { scheme: "SHRESHTA_M2", code: "MH/THN", district: "Thane", state: "Maharashtra", name: "Hostel", type: "Co-Ed" },
  // The applicant's AVYAY and NAPDDR files need projects of those schemes. They used to be raised
  // against SHRESHTA schools, so one Project ID read as a NAPDDR draft to the applicant and a
  // sanctioned SHRESHTA 3rd instalment to the officer (screen QA, 13 Sep 2026).
  { scheme: "AVYAY", code: "DL/NWD", district: "North West Delhi", state: "Delhi", name: NAME_BY_SCHEME.AVYAY!, type: "Co-Ed" },
  { scheme: "AVYAY", code: "MH/PUN", district: "Pune", state: "Maharashtra", name: NAME_BY_SCHEME.AVYAY!, type: "Co-Ed" },
  { scheme: "NAPDDR", code: "DL/NWD", district: "North West Delhi", state: "Delhi", name: NAME_BY_SCHEME.NAPDDR!, type: "Boys" },
  { scheme: "NAPDDR", code: "GJ/AHM", district: "Ahmedabad", state: "Gujarat", name: NAME_BY_SCHEME.NAPDDR!, type: "Boys" },
];

/** A project of `scheme` for an NGO that has none — where its AVYAY or NAPDDR file sits. */
function projectFor(ngo: NgoProfile, scheme: string): Institution {
  const place = PLACES.find((p) => p.district === ngo.district) ?? PLACES[0]!;
  const inst: Institution = {
    id: `${PROJECT_ID_PREFIX[scheme] ?? "SC"}/${place.code}/${(2900 + ngoPool.indexOf(ngo) * 7 + ngo.institutions.length).toString().padStart(5, "0")}`,
    name: NAME_BY_SCHEME[scheme] ?? "Residential School",
    district: ngo.district,
    state: ngo.state,
    nature: NATURE_BY_SCHEME[scheme] ?? "Secondary Residential School",
    type: "Co-Ed",
    level: "Secondary",
    building: "Owned",
    pin: String(between(110001, 799999)),
  };
  ngo.institutions.push(inst);
  return inst;
}

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
      institutions: Array.from({ length: instCount }, (_, k): Institution => {
        const site = i === 0 ? APPLICANT_SITES[k]! : undefined;
        const scheme = site?.scheme ?? "SHRESHTA_M2";
        return {
          id: site
            ? `${PROJECT_ID_PREFIX[scheme]}/${site.code}/${(2400 + k * 13).toString().padStart(5, "0")}`
            : `SC/${place.code}/${(2000 + i * 7 + k).toString().padStart(5, "0")}`,
          name: site ? site.name : k === 0 ? "Hostel" : "Residential School",
          district: site?.district ?? place.district,
          state: site?.state ?? place.state,
          nature: NATURE_BY_SCHEME[scheme]!,
          type: site?.type ?? pick(["Boys", "Girls", "Co-Ed"] as const),
          level: "Secondary",
          building: pick(["Owned", "Rented"] as const),
          pin: String(between(110001, 799999)),
        };
      }),
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
      // Left off rather than `false` where it does not apply: the flag on 2,500 seeded documents
      // was 68,000 characters of the one localStorage entry, and the verdict attribution the
      // certified files now carry needed the room (store-persistence.test.ts sizes the seed).
      reUploadedThisYear: (PERMANENT_DOCS.has(d.title) && i % 2 === 0) || undefined,
      ...(filled
        ? {
            fileName: `annexure-${i + 1}.pdf`,
            sizeKb: between(60, 1400),
            uploadedAt: iso(between(20, 200)),
            // No automated-check verdict: see the note on sizing at the end of `buildSeed`.
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
  // Rotate through the NGO's projects OF THIS SCHEME, so its register is not one project repeated
  // and no project carries files under two schemes.
  const prefix = `${PROJECT_ID_PREFIX[schemeCode] ?? "SC"}/`;
  const ofScheme = ngo.institutions.filter((i) => i.id.startsWith(prefix));
  const pool = ofScheme.length ? ofScheme : [projectFor(ngo, schemeCode)];
  const inst = pool[counter % pool.length]!;
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
    caseType: "New",
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
      fld_reg_office_address: `Registered office, ${ngo.district}, ${ngo.state}`,
      fld_reg_office_city: ngo.district,
      fld_reg_office_district: ngo.district,
      fld_reg_office_state: ngo.state,
      fld_contact_mobile: ngo.mobile ?? "",
      fld_contact_email: ngo.email ?? "",
      fld_project_id: inst.id,
      fld_institution_id: inst.id,
      fld_financial_year: fy,
      // The project's own record, not constants: the form and the NGO profile describe one place.
      fld_nature_of_institution: inst.nature,
      fld_institution_gender_type: inst.type,
      fld_institution_level: inst.level,
      fld_institution_status: "Ongoing",
      assistance_3yrs: "Yes",
      fld_uc_pending_status: "No Utilisation Certificate Pending",
      fld_commencement_date: "1983-05-01",
      fld_gia_since_year: "1983",
      fld_institution_location: `${inst.name}, ${inst.district}`,
      fld_institution_pin: inst.pin,
      govt_institution_within_2km: "No",
      fld_building_ownership: inst.building,
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
        // A deficiency is raised from the review as it stands, the same way the review screen
        // raises one; the scripted ones overwrite these items with their own afterwards.
        items: s.action === "raiseDeficiency" ? deficiencyItemsFrom(cur, s.remarks ?? "") : undefined,
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

/**
 * Replace every flagged document on the open deficiency with a corrected upload, keeping the
 * earlier file as a version, and mark each item corrected — what the applicant does before
 * pressing "Submit Correction".
 */
function markCorrected(app: GrantApplication, daysAgo: number): GrantApplication {
  const def = app.deficiencies.find((d) => !d.respondedAt);
  if (!def?.items) return app;
  const at = iso(daysAgo);
  for (const item of def.items) {
    item.correctedAt = at;
    item.response = item.kind === "document" ? "Corrected file uploaded." : "Figure corrected.";
    const doc = item.docId ? app.documents.find((d) => d.id === item.docId) : undefined;
    if (doc?.fileName) {
      doc.versions = [...(doc.versions ?? []), { fileName: doc.fileName, sizeKb: doc.sizeKb, uploadedAt: doc.uploadedAt, replacedAt: at }];
      doc.fileName = doc.fileName.replace(/\.pdf$/, "-corrected.pdf");
      doc.uploadedAt = at;
      doc.reviewStatus = "Pending";
    }
  }
  return app;
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
  projectAccounts: ProjectAccount[];
  changeRequests: ChangeRequest[];
  beneficiaries: Beneficiary[];
  employees: Employee[];
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
        remarks: "Upload a legible copy of last year's audited accounts, then resubmit the application.",
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
    // Spread across schemes: an applicant does not hold thirteen drafts for one scheme.
    const scheme = (["SHRESHTA_M2", "AVYAY", "NAPDDR"] as const)[mineCount() % 3]!;
    apps.push(draft(MINE, scheme, "2026-27", between(1, 45)));
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

  // 9b. One project, one story. The blocks above rotate a handful of institutions across 126
  //     files, which put the same project in the officer's queue as "New" and "3rd Instalment"
  //     at once, and gave one project two applications in the same year — contradictions the
  //     review panel of 13 Sep 2026 caught on the first screen they read. The department's
  //     rule is one application per project per financial year, and one open file per project
  //     at a time. Historical legacy files move to a free earlier year (their LGCY references
  //     carry no year, so nothing else changes); anything else becomes its own project.
  {
    const LEGACY_FYS = ["2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"];
    const closed = (a: GrantApplication) => a.status === "Sanctioned" || a.status === "Rejected";
    const byStory = new Map<string, { years: Set<string>; open: boolean }>();
    const story = (a: GrantApplication) => {
      const k = `${a.institutionId}|${a.schemeCode}`;
      if (!byStory.has(k)) byStory.set(k, { years: new Set(), open: false });
      return byStory.get(k)!;
    };
    let serial = 3000;
    const units = new Map<string, number>();
    const newProject = (a: GrantApplication) => {
      const ngo = ngoPool.find((x) => x.id === a.ngoId)!;
      const src = ngo.institutions.find((i) => i.id === a.institutionId)!;
      const id = `${src.id.split("/").slice(0, -1).join("/")}/${(serial++).toString().padStart(5, "0")}`;
      // A second project in the same district is a second unit, and says so — two projects both
      // called "Hostel — North West Delhi" under different IDs read as one hostel with two IDs
      // (review panel, 13 Sep 2026, cycle 2).
      const base = src.name.replace(/ \(Unit \d+\)$/, "");
      const unit = (units.get(`${ngo.id}|${base}|${src.district}`) ?? 1) + 1;
      units.set(`${ngo.id}|${base}|${src.district}`, unit);
      const name = `${base} (Unit ${unit})`;
      ngo.institutions.push({ ...src, id, name });
      a.institutionId = id;
      a.projectLabel = a.projectLabel.replace(src.name, name);
      if (a.formValues) {
        a.formValues = {
          ...a.formValues,
          fld_project_id: id,
          fld_institution_id: id,
          fld_institution_location: `${name}, ${src.district}`,
        };
      }
    };
    const retitle = (a: GrantApplication, fy: string) => {
      a.financialYear = fy;
      a.projectLabel = a.projectLabel.replace(/FY \d{4}-\d{2}$/, `FY ${fy}`);
      if (a.formValues) a.formValues = { ...a.formValues, fld_financial_year: fy };
    };
    // Closed history first, oldest year first, so the earliest file on a project keeps its place.
    const ordered = [...apps].sort((x, y) => Number(closed(y)) - Number(closed(x)) || x.financialYear.localeCompare(y.financialYear));
    for (const a of ordered) {
      let st = story(a);
      if (closed(a)) {
        if (!st.years.has(a.financialYear)) {
          st.years.add(a.financialYear);
          continue;
        }
        const free = a.id.startsWith("LGCY/") ? LEGACY_FYS.find((y) => !st.years.has(y)) : undefined;
        if (free) {
          retitle(a, free);
          st.years.add(free);
          continue;
        }
        newProject(a);
        story(a).years.add(a.financialYear);
        continue;
      }
      // A late approval can leave last year's file open while this year's is raised (T358–362),
      // so an open file only collides with another in the SAME year.
      if (a.id.startsWith("LGCY/") && a.financialYear < "2024-25") {
        const recent = ["2025-26", "2024-25"].find((y) => !st.years.has(y));
        if (recent) retitle(a, recent);
      }
      if (st.years.has(a.financialYear)) {
        // An OPEN file only moves to a recent year: a 2016-17 file "under examination" in 2026
        // inflates every ageing count and is not a thing the department has.
        const free = a.id.startsWith("LGCY/") ? ["2025-26", "2024-25"].find((y) => !st.years.has(y)) : undefined;
        if (free) {
          retitle(a, free);
        } else {
          newProject(a);
          st = story(a);
        }
      }
      st.open = true;
      st.years.add(a.financialYear);
    }
  }

  // 10. Deficiencies the way the department raises them — several items on one file, and several
  //     files at once (review call 11 Sep 2026, T43–75). Three of the applicant's own files sit
  //     with the NGO awaiting correction, one has already been corrected and resubmitted, and two
  //     other NGOs' files are back with the SO after correction, so the officer's "Resubmitted"
  //     status has members.
  const DEFICIENCY_SCRIPTS: readonly {
    summary: string;
    items: readonly { slot?: number; field?: string; label?: string; remark: string }[];
  }[] = [
    {
      summary: "Accounts and beneficiary figures need correction before the file can proceed.",
      items: [
        { slot: 7, remark: "Pages 3 to 6 of the audited accounts are blurred and cannot be read. Upload a clear scan." },
        { slot: 8, remark: "The Utilisation Certificate is not signed by the Chartered Accountant." },
        {
          field: "fld_beneficiaries_previous_year",
          label: "Beneficiaries in the previous year",
          remark: "The figure does not match your monthly attendance returns for 2025-26. Check it against those returns.",
        },
      ],
    },
    {
      summary: "Staff list and rent agreement are incomplete.",
      items: [
        { slot: 16, remark: "Photo identity details are missing for four employees." },
        { slot: 17, remark: "The rent agreement expired on 31 March 2026. Upload the renewed agreement." },
      ],
    },
    {
      summary: "Bank authorisation letter does not match the account on record.",
      items: [{ slot: 10, remark: "The IFSC on the letter differs from the account recorded for this project." }],
    },
  ];

  const itemsFor = (app: GrantApplication, script: (typeof DEFICIENCY_SCRIPTS)[number], raisedDaysAgo: number): DeficiencyItem[] =>
    script.items.map((it) => {
      if (it.slot) {
        const doc = app.documents.find((d) => d.slot === it.slot)!;
        doc.reviewStatus = "Deficient";
        doc.officerRemarks = it.remark;
        return { id: nextId("dfi"), kind: "document", docId: doc.id, label: doc.title, remark: it.remark } as DeficiencyItem;
      }
      void raisedDaysAgo;
      return { id: nextId("dfi"), kind: "field", fieldName: it.field, label: it.label ?? it.field ?? "Answer", remark: it.remark } as DeficiencyItem;
    });

  const raiseScripted = (app: GrantApplication, script: (typeof DEFICIENCY_SCRIPTS)[number], age: number): GrantApplication => {
    const a = replay(app, [
      { role: "pd-aso", action: "raiseDeficiency", daysAgo: age + 3, remarks: script.summary },
      { role: "pd-so", action: "communicateDeficiency", daysAgo: age, remarks: `${script.summary} Correct each item listed below and resubmit.` },
    ]);
    const def = a.deficiencies[a.deficiencies.length - 1]!;
    def.items = itemsFor(a, script, age);
    return a;
  };

  // The applicant's own open deficiencies, on three different projects.
  {
    const mineAtAso = apps.filter(
      (a) => a.ngoId === ngoPool[MINE]!.id && a.holder.kind === "chain" && a.holder.division === "pd" && a.holder.grade === "aso",
    );
    const usedProjects = new Set<string>();
    let scripted = 0;
    for (const target of mineAtAso) {
      if (scripted === DEFICIENCY_SCRIPTS.length) break;
      if (usedProjects.has(target.institutionId)) continue;
      usedProjects.add(target.institutionId);
      const idx = apps.indexOf(target);
      apps[idx] = raiseScripted(target, DEFICIENCY_SCRIPTS[scripted]!, 2 + scripted * 3);
      scripted++;
    }
    // One more of the applicant's files, already corrected and back with the Ministry.
    const corrected = mineAtAso.find((a) => !usedProjects.has(a.institutionId));
    if (corrected) {
      const idx = apps.indexOf(corrected);
      let a = raiseScripted(corrected, DEFICIENCY_SCRIPTS[2]!, 14);
      a = markCorrected(a, 9);
      apps[idx] = replay(a, [
        { role: "ngo", action: "respondDeficiency", daysAgo: 9, remarks: "Corrected bank authorisation letter uploaded." },
      ]);
    }
  }

  // Two other NGOs' files resubmitted after correction.
  {
    const pool = apps.filter(
      (a) => a.ngoId !== ngoPool[MINE]!.id && a.holder.kind === "chain" && a.holder.division === "pd" && a.holder.grade === "aso",
    );
    pool.slice(0, 2).forEach((target, i) => {
      const idx = apps.indexOf(target);
      let a = raiseScripted(target, DEFICIENCY_SCRIPTS[i]!, 12 + i);
      a = markCorrected(a, 5 + i);
      apps[idx] = replay(a, [
        { role: "ngo", action: "respondDeficiency", daysAgo: 5 + i, remarks: "Corrected documents uploaded." },
      ]);
    });
  }

  // Deficiencies raised before items existed get one item each, so no deficiency is a bare sentence.
  for (const app of apps) {
    for (const def of app.deficiencies) {
      if (def.items) continue;
      const doc = app.documents.find((d) => d.slot === 7)!;
      doc.reviewStatus = "Deficient";
      doc.officerRemarks = def.detail;
      def.items = [{ id: nextId("dfi"), kind: "document", docId: doc.id, label: doc.title, remark: def.detail }];
    }
  }

  // Case type and instalment. A first grant is New; everything after it is an Ongoing claim on
  // the next recurring instalment — derived per project in the order its files were raised.
  {
    // Year first: a project's first grant is its earliest financial year, whatever order the
    // seed happened to create the files in.
    const ordered = [...apps].sort(
      (a, b) =>
        a.financialYear.localeCompare(b.financialYear) ||
        Date.parse(a.audit[0]?.at ?? a.updatedAt) - Date.parse(b.audit[0]?.at ?? b.updatedAt),
    );
    // The instalment a live claim reached, per project — the same reading `nextInstalment` makes,
    // so the next file the applicant raises claims the instalment the seed would have given it.
    const lastClaim = new Map<string, { instalment?: 1 | 2 | 3 }>();
    for (const app of ordered) {
      const k = `${app.schemeCode}|${app.institutionId}`;
      const prior = lastClaim.get(k);
      if (!prior) {
        // Projects migrated from the earlier NIC system carry sanctions the portal never saw
        // (review call, T129, T721). A current-year file on such a project is an instalment claim
        // even though it is the first file here — two in three of them, deterministically.
        const migrated = app.financialYear === "2026-27" && app.status !== "Draft" && app.holder.kind !== "ngo" && ordered.indexOf(app) % 3 !== 0;
        app.caseType = migrated ? "Ongoing" : "New";
        app.instalment = migrated ? (((ordered.indexOf(app) % 3) + 1) as 1 | 2 | 3) : undefined;
      } else {
        // 1st, 2nd, 3rd, then the next cycle's 1st — one rule, `instalmentAfter`, here and in the wizard.
        app.caseType = "Ongoing";
        app.instalment = instalmentAfter(prior.instalment);
      }
      // A draft or a rejected file is not a claim, so it does not move the project on.
      if (app.status !== "Draft" && app.status !== "Rejected") lastClaim.set(k, { instalment: app.instalment });
      // The answers say the same as the record: a new project has no grant history to report.
      if (app.formValues && app.caseType === "New") {
        app.formValues = {
          ...app.formValues,
          fld_institution_status: "New",
          assistance_3yrs: "No",
          fld_gia_released_last_3yrs: "",
          decl_uc_uploaded: "No",
        };
      }
    }
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

  /*
   * A certified file carries the verdicts the certification rests on. The ASO certifies that the
   * documents "have been examined", yet every seeded certified file reached the Under Secretary
   * and the Programme Director reading "0 of 20 reviewed" under "Examined and certified by…"
   * (follow-up to the officer audit, 14 Sep 2026). Each uploaded document not replaced since
   * the certification is Verified by the certifying officer on that day; an optional one never
   * uploaded is Not applicable; a verdict already recorded keeps its status and gains the same
   * attribution. A file corrected after certification keeps its new upload Not reviewed.
   * Draws no random numbers.
   */
  for (const app of apps) {
    if (!app.certifiedAt) continue;
    const by = app.certifiedBy ?? "pd-aso";
    for (const doc of app.documents) {
      if (doc.reviewedBy) continue;
      if (doc.reviewStatus === "Pending") {
        const correctedSince = doc.versions?.some((v) => v.replacedAt > app.certifiedAt!);
        if (doc.fileName && !correctedSince) doc.reviewStatus = "Verified";
        else if (!doc.fileName && doc.optional) doc.reviewStatus = "Not applicable";
        else continue;
      }
      doc.reviewedBy = by;
      doc.reviewedAt = app.certifiedAt;
    }
  }

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
    const reported = status === "Submitted" || status === "Reviewed";
    // Drawn in the same order as before, so no reference or date elsewhere in the seed moves.
    const visited = status === "Pending" ? undefined : between(1, 40);
    const filed = reported ? between(1, 20) : undefined;
    /*
     * A submitted report carries its recommendation and findings (follow-up to the officer audit,
     * 14 Sep 2026). "Submitted" reports had none, so three read "Recommendation: Not recorded" —
     * a report cannot be submitted from the form without one. One of them records shortfalls, so
     * the dashboard is not uniformly favourable. A report is filed on or after the visit: the two
     * draws are ordered rather than re-drawn.
     */
    const shortfall = status === "Submitted" && i % 8 === 6;
    return {
      id: nextId("insp"),
      applicationId: a.id,
      ngoId: a.ngoId,
      institutionId: a.institutionId,
      status,
      visitType: i % 3 === 0 ? "Online" : "Physical",
      scheduledFor: visited === undefined ? undefined : iso(filed === undefined ? visited : Math.max(visited, filed)),
      submittedAt: filed === undefined ? undefined : iso(Math.min(visited ?? filed, filed)),
      findings: !reported
        ? undefined
        : shortfall
          ? "Hostel occupancy is below the sanctioned strength and the attendance register was not kept up to date. Kitchen and sanitation facilities are in order."
          : "Facilities verified against the sanctioned proposal. Hostel occupancy consistent with the beneficiary count.",
      recommendation: !reported ? undefined : shortfall ? "Needs improvement" : "Satisfactory",
    };
  });
  for (const insp of inspections) {
    const a = apps.find((x) => x.id === insp.applicationId);
    if (a) a.inspectionId = insp.id;
  }

  // Notifications derive from what actually happened, so they can't contradict the audit trail.
  // Addressed to the people the event concerns: the officer who acted, the seat now holding the
  // file, and the applicant — but only the applicant whose file it is. Every notice used to go to
  // the signed-in NGO and the five PD grades, so the NGO read other organisations' files and the
  // Finance Division, Programme Director and PMU had empty in-trays (screen crawl, 13 Sep 2026).
  const holderRole = (a: GrantApplication): string | null =>
    a.holder.kind === "chain" ? `${a.holder.division}-${a.holder.grade}` : a.holder.kind === "pd" ? "programme-director" : null;
  const inspected = new Set(inspections.map((x) => x.applicationId));
  const notifications: NotificationEntry[] = apps
    .flatMap((a) => a.audit.slice(-1).map((e) => ({ app: a, e })))
    .sort((x, y) => Date.parse(y.e.at) - Date.parse(x.e.at))
    .slice(0, 80)
    .map(({ app, e }, i) => {
      const audience = [
        ...new Set(
          [e.byRole, holderRole(app), inspected.has(app.id) ? "pmu-field" : null]
            // "ngo" is the signed-in applicant; another organisation's file never reaches them.
            .filter((r): r is string => !!r && r !== "ngo")
            .concat(app.ngoId === ngoPool[MINE]!.id && notifiesApplicant(e.action) ? ["ngo"] : []),
        ),
      ] as NotificationEntry["audience"];
      return {
        id: nextId("ntf"),
        at: e.at,
        title: notificationTitle(e.action),
        body: notificationBody(app.id, e.remarks),
        audience,
        applicationId: app.id,
        // The six newest are new to everyone they reach; the rest have been read by all of them.
        readBy: i > 5 ? [...audience] : [],
      };
    });

  // Project bank accounts, change requests and the roster — the applicant's own projects only.
  const applicant = ngos[MINE]!;
  const BANKS = [
    ["State Bank of India", "SBIN"],
    ["Bank of Baroda", "BARB"],
    ["Punjab National Bank", "PUNB"],
    ["Canara Bank", "CNRB"],
  ] as const;
  const projectAccounts: ProjectAccount[] = [];
  applicant.institutions.forEach((inst, k) => {
    const [bank, code] = BANKS[k % BANKS.length]!;
    if (k === 2) {
      // One project changed its account last year: the earlier one stays on record.
      projectAccounts.push({
        id: nextId("acct"),
        projectId: inst.id,
        bank: "Bank of India",
        branch: inst.district,
        last4: "7781",
        ifsc: "BKID0000411",
        pfmsRegistered: true,
        activeFrom: iso(1400),
        activeTo: iso(300),
      });
    }
    projectAccounts.push({
      id: nextId("acct"),
      projectId: inst.id,
      bank,
      branch: `${inst.district} Main`,
      last4: String(4417 + k * 211).slice(-4),
      ifsc: `${code}000${(1234 + k * 97).toString().slice(-4)}`,
      pfmsRegistered: k !== 5,
      activeFrom: iso(k === 2 ? 300 : 900 + k * 20),
    });
  });

  const changeRequests: ChangeRequest[] = [
    {
      id: nextId("req"),
      kind: "bank",
      projectId: applicant.institutions[1]!.id,
      submittedAt: iso(6),
      status: "Pending",
      reason: "The branch has been merged and the existing account will be closed on 30 September 2026.",
      documentName: "bank-merger-letter.pdf",
      bank: "Union Bank of India",
      branch: "Okhla Phase II",
      last4: "0932",
      ifsc: "UBIN0553921",
      pfmsRegistered: false,
    },
    {
      id: nextId("req"),
      kind: "location",
      projectId: applicant.institutions[3]!.id,
      submittedAt: iso(18),
      status: "Pending",
      reason: "The lease on the rented building ends in October; the hostel is moving within the same district.",
      address: "Plot 14, Sector 5, Naroda GIDC, Ahmedabad, Gujarat 382330",
      latitude: 23.0707,
      longitude: 72.6576,
    },
    {
      id: nextId("req"),
      kind: "location",
      projectId: applicant.institutions[0]!.id,
      submittedAt: iso(210),
      status: "Approved",
      decidedAt: iso(180),
      reason: "Moved to a larger owned building to accommodate the sanctioned strength.",
      address: "C-42, Sultanpuri Road, Mangolpuri, North West Delhi, Delhi 110083",
    },
  ];

  /*
   * Sized to fit the browser (serious audit S03, 14 Sep 2026). The whole store is one
   * localStorage entry shared with every other portal on the origin, and at 2.78 million
   * characters a submitted application could not be written. Two cuts, both made AFTER every
   * random draw so no reference, project or figure above changes:
   *
   * - The first project keeps its full roll of 110; the others hold 16–25 residents each
   *   instead of 27–132 (725,306 → about 190,000 characters). Each roll still matches the
   *   attendance return, which counts whatever the roll holds.
   * - Seeded documents carry no automated-check verdict. No screen reads one from a seeded file —
   *   the applicant's verdicts are the ones the upload step records — and they were 665,659
   *   characters. A file uploaded through the form keeps its verdict. (`demoVerdictFor` draws no
   *   random numbers, so leaving it out moves nothing else.)
   */
  const beneficiaries: Beneficiary[] = applicant.institutions.flatMap((inst, k) =>
    buildBeneficiaries(inst.id, k === 0 ? 110 : 16 + (k % 4) * 3, k === 0 ? 14 : 2, k * 11),
  );
  const employees: Employee[] = applicant.institutions.flatMap((inst, k) => buildEmployees(inst.id, k === 0 ? 7 : 3 + (k % 4)));

  return { applications: apps, ngos, inspections, notifications, projectAccounts, changeRequests, beneficiaries, employees };
}
