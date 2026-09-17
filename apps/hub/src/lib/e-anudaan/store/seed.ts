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

import { applyAction, deficiencyItemsFrom, releaseFunds, type Clock, type WorkflowAction } from "../workflow.ts";
import { seedCctvDetail } from "../cctv.ts";
import {
  GRADES,
  type Division,
  type Grade,
  type GrantApplication,
  type Inspection,
  type MockDoc,
  type ChangeRequest,
  type CctvSetup,
  type DeficiencyItem,
  type NgoProfile,
  type NotificationEntry,
  type ProjectAccount,
  type Scheme,
} from "../types.ts";
import { buildBeneficiaries, buildEmployees, type Beneficiary, type Employee } from "../roster.ts";
import { AVYAY_WIZARD, NAPDDR_WIZARD, SHRESHTA_WIZARD, SMILE_CASE_EXISTING, SMILE_CASE_NEW, SMILE_WIZARD, fieldVisible, visibleSteps, wizardFor } from "../form-schema.ts";
import { applicationRefOf, claimIdFor, instalmentLabel, instalmentPlan, renewalAnswers } from "../instalments.ts";
import { PROJECT_ID_PREFIX, instalmentAfter, notificationBody, notificationTitle, notifiesApplicant } from "../applicant.ts";
import { schemeName } from "../glossary.ts";
import { demoVerdictFor } from "../doc-verification.ts";
import { automaticCheckOf, isFlagged } from "../review-readiness.ts";
import type { EAnudaanState, Institution } from "../types.ts";

/** The demo's "today". Matches the recon capture date so seeded ageing reads sensibly. */
export const SEED_NOW = "2026-08-12T09:00:00.000Z";

const DAY = 86_400_000;

/**
 * A moment `daysAgo` days before the demo's today, at a time of day that varies with the day.
 * Every seeded event used to fall at 02:30 PM (SEED_NOW's own time). The offset spreads them
 * across office hours, 09:45 AM to 05:50 PM IST, drawn from the day itself rather than from the
 * random generator, so no reference, figure or project elsewhere in the seed moves. It is under
 * a day either way, so events on different days keep their order.
 */
/** "12 Mar 1978" → "1978-03-12". */
function isoDateOf(printed: string | undefined): string | undefined {
  if (!printed) return undefined;
  const t = Date.parse(`${printed} UTC`);
  return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10);
}

function iso(daysAgo: number): string {
  const offsetMinutes = daysAgo >= 1 ? ((daysAgo * 157) % 485) - 285 : 0;
  return new Date(Date.parse(SEED_NOW) - daysAgo * DAY + offsetMinutes * 60_000).toISOString();
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

/**
 * Named ONE way on every screen, from the glossary rather than from a second list here: **Acronym —
 * Full name**, in British spelling (design-director follow-up, 16 Sep 2026 — the seed said "SMILE
 * (Garima Greh)" on one screen and "Support for Marginalized Individuals…" on another, so a
 * returning applicant could not match the card they chose to the row it produced).
 */
export const SEED_SCHEMES: Scheme[] = [
  {
    code: "NAPDDR",
    name: schemeName("NAPDDR").title,
    description:
      "National Action Plan for Drug Demand Reduction. Prevention, treatment, rehabilitation, social-reintegration and aftercare for persons affected by substance abuse.",
    target: "Persons affected by substance abuse",
  },
  {
    code: "AVYAY",
    name: schemeName("AVYAY").title,
    description:
      "Atal Vayo Abhyuday Yojana — umbrella scheme covering Integrated Programme for Senior Citizens (IPSrC), maintenance of Old Age Homes / Continuous Care Homes, Rashtriya Vayoshri Yojana, Silver Economy etc.",
    target: "Senior citizens",
  },
  {
    code: "SHRESHTA_M2",
    name: schemeName("SHRESHTA_M2").title,
    description:
      "SHRESHTA Mode 2 — grant-in-aid to NGO-run / state-government residential schools for SC students (Class 9–12).",
    target: "SC students in NGO-run schools",
  },
  {
    // Must match the form's key in WIZARDS. It read "SMILE_GG", so choosing SMILE on the scheme
    // picker opened "Please choose a scheme first." and SMILE could not be applied for at all
    // (full-wizard walk, 13 Sep 2026).
    code: "SMILE",
    name: schemeName("SMILE").title,
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

/**
 * The statute an organisation is registered under, with a registration number and date that fit it.
 *
 * The record used to say "Registrar of Societies" — the authority that keeps the register, not the
 * Act — so the wizard's "Statute / Act of Registration" (which prefills only from a value naming an
 * Act) was left for the clerk to type (batch B4, 16 Sep 2026). Read from what the organisation calls
 * itself and where it sits: a Trust registers under its state's public-trusts Act, a Foundation as a
 * Section 8 company, and everything else as a society. Section 8 came in with the Companies Act
 * 2013, so a Foundation cannot carry the 1978 date the societies and trusts do.
 *
 * Takes the two digits already drawn for the registration number rather than drawing more, so no
 * figure anywhere else in the seed moves.
 */
function registrationOf(name: string, state: string, a: number, b: number): Pick<NgoProfile, "registeredUnder" | "registrationNo" | "registrationDate"> {
  if (/\bFoundation\b/.test(name)) {
    const code = { Maharashtra: "MH", "Uttar Pradesh": "UP", Delhi: "DL", Gujarat: "GJ", Rajasthan: "RJ", Karnataka: "KA", "Madhya Pradesh": "MP", Odisha: "OR" }[state] ?? "DL";
    return {
      registeredUnder: "Section 8 of the Companies Act, 2013",
      registrationNo: `U85300${code}2014NPL0${a}${b}`,
      registrationDate: "18 Jul 2014",
    };
  }
  if (/\bTrust\b/.test(name)) {
    const act = state === "Maharashtra" ? "Bombay Public Trusts Act, 1950" : state === "Gujarat" ? "Gujarat Public Trusts Act, 1950" : "Indian Trusts Act, 1882";
    return { registeredUnder: act, registrationNo: `E-${a}${b}`, registrationDate: "12 Mar 1978" };
  }
  return { registeredUnder: "Societies Registration Act, 1860", registrationNo: `${a}-${b}`, registrationDate: "12 Mar 1978" };
}

function buildNgos(): NgoProfile[] {
  return NGO_NAMES.map((name, i) => {
    const place = PLACES[i % PLACES.length]!;
    const instCount = i === 0 ? APPLICANT_SITES.length : between(1, 3);
    const registration = registrationOf(name, place.state, between(10, 99), between(10, 99));
    return {
      id: `ngo-${(i + 1).toString().padStart(3, "0")}`,
      name,
      darpanId: `${place.code.split("/")[0]}/2016/${(100000 + i * 137).toString()}`,
      ...registration,
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

/* ── scheme answers — what an AVYAY or NAPDDR file answers beyond the common questions ─────── */

const person = (prefix: string, name: string, qualification: string, designation: string, mobile: string) => ({
  [`${prefix}_name`]: name, [`${prefix}_qualification`]: qualification, [`${prefix}_designation`]: designation, [`${prefix}_mobile`]: mobile,
});
function avyayAnswers(inst: Institution, nature: string, people: number): Record<string, string> {
  return {
    fld_nature_of_project: nature, fld_agency_type: "NGO", fld_city_category: "Z",
    fld_project_location: `${inst.name}, ${inst.district}, ${inst.state} ${inst.pin}`, fld_functional_status: "Functional",
    fld_commencement_date: "2024-06-01", fld_infra_area_sqft: "6400", fld_infra_rooms: "14", fld_infra_toilets: "8",
    infra_kitchen: "Yes", infra_open_area: "Yes", moa_includes_senior_citizens: "Yes", fld_beneficiaries_women: String(Math.floor(people / 2)),
    ...person("fld_incharge", "Meena Deshpande", "Post-graduate", "Superintendent", "9822014455"),
    ...person("fld_key_staff_1", "Ravi Kulkarni", "Professional (Medicine, Nursing, Social Work)", "Nurse", "9822014466"),
  };
}

function napddrAnswers(inst: Institution, website = "https://www.sankalpseva.org.in"): Record<string, string> {
  return {
    fld_project_type: "IRCA — Integrated Rehabilitation Centre", moa_includes_addiction: "Yes", fld_org_website: website,
    fld_name_of_project: inst.name, fld_date_of_commencement: "2023-07-01", fld_year_of_commencement_gia: "2023-24", project_recognized_by_state: "Yes",
    fld_location_address: `${inst.name}, ${inst.district}, ${inst.state} ${inst.pin}`, building_utilized_exclusively: "Yes",
    fld_area_of_building_sqm: "420", fld_no_of_rooms: "12", fld_no_of_toilets: "6", kitchen_facilities: "Yes", hygiene_maintained: "Yes",
    open_area_available: "Yes", counselling_room: "Yes", fld_functional_status: "Functional",
    ...person("fld_incharge", "Arvind Joshi", "Post-graduate", "Project Director", "9822015511"),
    ...person("fld_functionary_1", "Farida Shaikh", "Professional (Medicine, Nursing, Social Work)", "Counsellor", "9822015522"),
    ...person("fld_key_staff_1", "Sunil Pawar", "Graduate", "Social Worker", "9822015533"),
    self_generated_funds: "No", fld_beneficiaries_prev_year: "38", fld_pfms_code: "NGO3817MH04512", eat_module_registered: "Yes",
    prev_instalment_utilised: "Yes", fld_auth_person_designation: "Secretary",
  };
}

/**
 * The activation code the NGO types into the recorder software at the centre. Derived from the
 * Project ID and the number of cameras, so a project reads the same code on every run and no two
 * projects share one. Same rule as the CCTV page's own, which is where a new setup gets its code.
 */
export function cctvActivationCode(projectId: string, cameras: number): string {
  const p = Number(projectId.replace(/\D/g, "").slice(-4)) || 0;
  return `EANU-${((4200 + p + cameras * 37) % 10000).toString().padStart(4, "0")}-${((9100 + p * 3 + cameras * 13) % 10000).toString().padStart(4, "0")}`;
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
      // The NGO record's own date ("12 Mar 1978"), not a constant that contradicted it.
      fld_registration_date: isoDateOf(ngo.registrationDate) ?? "1978-03-12",
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
      // Bank and branch are two questions on the form; one "bank, branch" answer left both unanswered.
      fld_bank_name: "State Bank of India",
      fld_bank_branch: inst.district,
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
 * Move a file to another financial year, and every place the year is written with it: the label, the
 * answer, a structured reference (`GIA/<year>/…`) and a sanction order (`SAN/<year>/…`), including
 * where the audit trail quotes either. A legacy reference (`LGCY/…`) carries no year. Mutates.
 */
function retitleYear(a: GrantApplication, fy: string): void {
  const was = a.financialYear;
  if (was === fy) return;
  const swap = (s: string) => s.replace(`/${was}/`, `/${fy}/`);
  const oldId = a.id;
  const oldOrder = a.sanction?.orderNo;
  a.financialYear = fy;
  a.projectLabel = a.projectLabel.replace(/FY \d{4}-\d{2}$/, `FY ${fy}`);
  if (a.formValues) a.formValues = { ...a.formValues, fld_financial_year: fy };
  if (a.id.startsWith("GIA/")) a.id = swap(a.id);
  if (a.sanction) a.sanction = { ...a.sanction, orderNo: swap(a.sanction.orderNo) };
  a.audit = a.audit.map((e) => {
    let remarks = e.remarks;
    if (remarks && oldOrder) remarks = remarks.split(oldOrder).join(a.sanction!.orderNo);
    if (remarks && oldId !== a.id) remarks = remarks.split(oldId).join(a.id);
    return remarks === e.remarks ? e : { ...e, remarks };
  });
}

/**
 * Default remark per action, so the applicant's Processing History reads like a real file note
 * rather than exposing the seeding machinery.
 */
const SEED_REMARKS: Partial<Record<WorkflowAction, string>> = {
  submit: "Application submitted.",
  certify: "Documents verified and the file certified.",
  concur: "Financial concurrence recorded.",
  sanction: "Sanctioned as recommended.",
  reject: "Application rejected.",
  return: "Returned to the applicant for correction.",
};

/**
 * What each officer writes when moving a file on. Every forward used to read "Forwarded to the next
 * authority."; a file note says what the officer checked. Chosen by the officer and the day, so it
 * varies across files without drawing on the random generator.
 */
const FORWARD_REMARKS: Partial<Record<string, readonly string[]>> = {
  "pd-aso": ["Documents checked against the checklist; recommended for examination.", "Beneficiary figures match the attendance returns. Submitted for orders."],
  "pd-so": ["Examined. Eligibility and cost norms verified; recommended to the Under Secretary.", "Previous utilisation certificate on record. Recommended for approval."],
  "pd-us": ["Proposal in order. Recommended to the Deputy Secretary.", "Inspection report satisfactory; recommended for approval."],
  "pd-ds": ["Agreed with the Under Secretary's note. Put up to the Joint Secretary.", "Recommended; the grant is within the scheme's allocation."],
  "pd-js": ["Approved in principle. Sent to the Integrated Finance Division for concurrence.", "Approved; for financial concurrence."],
  "finance-aso": ["Budget head and funds availability verified.", "Sanction amount checked against the cost norms."],
  "finance-so": ["Financial scrutiny complete. Recommended for concurrence.", "No objection from the finance side; submitted."],
  "finance-us": ["Recommended for concurrence.", "Examined; the proposal is financially in order."],
  "finance-ds": ["Put up for the Joint Secretary's concurrence.", "Recommended for concurrence."],
};

function seedRemark(role: string, action: WorkflowAction, daysAgo: number): string {
  if (action === "forward") {
    const options = FORWARD_REMARKS[role];
    if (options?.length) return options[Math.abs(daysAgo) % options.length]!;
  }
  return SEED_REMARKS[action] ?? "Recorded on the file.";
}

/**
 * The rules one file keeps with itself: a New project reports no grant history, the registration
 * date is the NGO record's, the declaration is signed at submission, a document is uploaded before
 * the file is submitted and before it is verified, and "re-uploaded this year" means this FY.
 */
function tellOneStory(a: GrantApplication): GrantApplication {

  const now = Date.parse(SEED_NOW);
  const fyStart = (fy: string) => Date.parse(`${fy.slice(0, 4)}-04-01T04:30:00.000Z`);
  const when = (x: GrantApplication) => Date.parse(x.submittedAt ?? x.updatedAt);
  const ngo = ngoPool.find((n) => n.id === a.ngoId);
  const fv = { ...(a.formValues ?? {}) };
  // A New project has no grant history to report.
  if (a.caseType === "New") {
    fv.fld_gia_since_year = "";
    fv.fld_gia_released_last_3yrs = "";
    fv.fld_beneficiaries_previous_year = "";
    fv.assistance_3yrs = "No";
    fv.fld_institution_status = "New";
    fv.decl_uc_uploaded = "No";
  }
  // The registration date is the NGO record's.
  const registered = isoDateOf(ngo?.registrationDate);
  if (registered && fv.fld_registration_date) fv.fld_registration_date = registered;
  // The declaration is signed when the application is submitted (or last saved, for a draft).
  const signed = new Date(when(a) + 5.5 * 3_600_000).toISOString();
  if (fv.fld_auth_date) {
    fv.fld_auth_date = signed.slice(0, 10);
    fv.fld_auth_time = signed.slice(11, 16);
  }
  const submittedAt = a.submittedAt ? Date.parse(a.submittedAt) : undefined;
  const fyBegins = fyStart(a.financialYear);
  const documents = a.documents.map((d) => {
    let doc = d;
    // A document is uploaded before the application carrying it is submitted, and before anyone verifies it.
    const ceiling = Math.min(submittedAt ?? Infinity, d.reviewedAt ? Date.parse(d.reviewedAt) : Infinity);
    const before = (at: number) => new Date(at - (doc.slot % 5 + 1) * DAY).toISOString();
    if (doc.versions?.length) {
      // A corrected file is dated its correction — the moment it replaced the file before it. This
      // rule used to pull it back before the submission it corrects, so the review read
      // "Corrected by the NGO on 07 Aug 2026" over a corrected file "uploaded 06 Jul 2026"
      // (design-director audit R-02, 16 Sep 2026). The files it replaced were uploaded with the
      // application, like any other.
      const versions = doc.versions.map((v) => {
        const limit = Math.min(submittedAt ?? Infinity, Date.parse(v.replacedAt));
        return v.uploadedAt && Date.parse(v.uploadedAt) > limit ? { ...v, uploadedAt: before(limit) } : v;
      });
      doc = { ...doc, versions, uploadedAt: versions[versions.length - 1]!.replacedAt };
    } else if (doc.uploadedAt && Date.parse(doc.uploadedAt) > ceiling) {
      doc = { ...doc, uploadedAt: before(ceiling) };
    }
    // "Re-uploaded this year" means within the application's financial year.
    if (doc.reUploadedThisYear && doc.uploadedAt && Date.parse(doc.uploadedAt) < fyBegins) {
      const inYear = fyBegins + (doc.slot % 7 + 1) * DAY;
      doc = inYear < Math.min(ceiling, now) ? { ...doc, uploadedAt: new Date(inYear).toISOString() } : { ...doc, reUploadedThisYear: undefined };
    }
    return doc;
  });
  return { ...a, formValues: fv, documents };
}

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
        remarks: s.remarks ?? seedRemark(s.role, s.action, s.daysAgo),
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
  cctv: CctvSetup[];
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

  // 10b. A project's financial years run in the order its files were filed. The passes above give
  //      each file a year independently, which put Hardoi's "2nd Instalment · 2024-25" under review
  //      (filed Jul 2026) beside its "3rd Instalment · 2025-26" released a year earlier (filed Apr
  //      2025) — a later instalment paid before the one it follows (design-director audit, 16 Sep
  //      2026). The project keeps the same set of years, so "one application per project per year"
  //      still holds; they are handed out oldest first to the files in the order they were filed.
  //      Draws no random numbers.
  {
    const live = (a: GrantApplication) => a.status !== "Draft" && a.status !== "Rejected";
    const filed = (a: GrantApplication) => Date.parse(a.submittedAt ?? a.updatedAt);
    const byProject = new Map<string, GrantApplication[]>();
    for (const a of apps.filter(live)) {
      const k = `${a.schemeCode}|${a.institutionId}`;
      byProject.set(k, [...(byProject.get(k) ?? []), a]);
    }
    for (const files of byProject.values()) {
      const years = files.map((a) => a.financialYear).sort();
      [...files].sort((x, y) => filed(x) - filed(y)).forEach((a, i) => retitleYear(a, years[i]!));
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

  // (A block here once marked documents 3 and 4 "Needs correction" on every fifth certified file, with
  // no remark, under a certification that said the documents were examined and complete — a verdict
  // that should have blocked the certification. The applicant's correction flow is reached through
  // the scripted deficiencies above, which carry their remarks.)

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

  /*
   * One story per file (seed-data review, 16 Sep 2026). The blocks above build files by rotation and
   * then relabel them, which left files that contradicted themselves: an instalment claim with no
   * earlier sanction, a New project with thirty years of grants, set-up money on an instalment, a
   * sanction two years after its financial year, a declaration signed after submission, a document
   * verified before it was uploaded. This pass makes each file agree with itself and with its
   * project's other files. It draws no random numbers, so no reference, project or figure moves.
   * `records-seed.test.ts` holds every rule.
   */
  {
    const ISO_TS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    /** Move every timestamp on a file by `ms`, keeping the file's own order. */
    const shift = (value: unknown, ms: number): unknown => {
      if (typeof value === "string") return ISO_TS.test(value) ? new Date(Date.parse(value) + ms).toISOString() : value;
      if (Array.isArray(value)) return value.map((v) => shift(v, ms));
      if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === "formValues" ? v : shift(v, ms)]));
      }
      return value;
    };
    const fyStart = (fy: string) => Date.parse(`${fy.slice(0, 4)}-04-01T04:30:00.000Z`);
    const now = Date.parse(SEED_NOW);
    let relSeq = 0;
    const releaseClock = (at: number): Clock => ({ now: new Date(at).toISOString(), id: (p) => `${p}-rel-${String(++relSeq).padStart(4, "0")}` });
    const when = (a: GrantApplication) => Date.parse(a.submittedAt ?? a.updatedAt);

    for (let i = 0; i < apps.length; i++) {
      let a = apps[i]!;
      // A sanction falls within its financial year or the year after it (a year-long approval).
      if (a.sanction) {
        const start = fyStart(a.financialYear);
        const latest = Math.min(start + 2 * 365 * DAY - 2 * DAY, now - DAY);
        const at = Date.parse(a.sanction.sanctionedAt);
        const target = at < start ? start + 45 * DAY : at > latest ? latest - 20 * DAY : at;
        if (target !== at) a = shift(a, target - at) as GrantApplication;
      }
      // An instalment claim releases recurring grant only; the non-recurring grant is the New grant's.
      if (a.caseType === "Ongoing" && a.nonRecurring > 0) {
        a = {
          ...a,
          nonRecurring: 0,
          total: a.recurring,
          ...(a.sanction ? { sanction: { ...a.sanction, nonRecurring: 0, total: a.sanction.recurring } } : {}),
          formValues: { ...a.formValues, fld_grant_non_recurring: "0", fld_grant_total: String(a.recurring) },
        };
      }
      apps[i] = a;
    }

    // An instalment is claimed only after an earlier grant on the project was sanctioned AND released.
    const ordered = [...apps].sort((x, y) => when(x) - when(y));
    for (const a of ordered) {
      if (a.caseType !== "Ongoing" || !a.instalment) continue;
      const idx = apps.indexOf(a);
      const files = apps.filter((x) => x !== a && x.institutionId === a.institutionId && x.schemeCode === a.schemeCode);
      const prior = files.filter((x) => x.sanction && Date.parse(x.sanction.sanctionedAt) <= when(a)).sort((x, y) => x.sanction!.sanctionedAt.localeCompare(y.sanction!.sanctionedAt));
      const last = prior.at(-1);
      if (last) {
        if (!last.release) {
          const at = Math.min(Date.parse(last.sanction!.sanctionedAt) + 10 * DAY, when(a) - DAY, now - DAY);
          const released = releaseFunds(last, "pd-us", releaseClock(Math.max(at, Date.parse(last.sanction!.sanctionedAt) + 3_600_000)));
          if (released.ok) apps[apps.indexOf(last)] = released.app;
        }
        continue;
      }
      // Nothing sanctioned before it: this is the project's first grant, so it is a New application.
      apps[idx] = {
        ...a,
        caseType: "New",
        instalment: undefined,
        formValues: { ...a.formValues, fld_institution_status: "New", assistance_3yrs: "No" },
      };
    }

    // Instalment numbers follow the project's claims in order, as `nextInstalment` reads them.
    const byProject = new Map<string, GrantApplication[]>();
    for (const a of [...apps].sort((x, y) => x.financialYear.localeCompare(y.financialYear) || when(x) - when(y))) {
      const k = `${a.schemeCode}|${a.institutionId}`;
      byProject.set(k, [...(byProject.get(k) ?? []), a]);
    }
    for (const files of byProject.values()) {
      let lastInstalment: number | undefined;
      let seenNew = false;
      for (const a of files) {
        if (a.caseType === "New") {
          if (a.status !== "Draft" && a.status !== "Rejected") seenNew = true;
          continue;
        }
        if (!a.instalment) continue;
        const next = instalmentAfter(lastInstalment);
        if (a.instalment !== next) apps[apps.indexOf(a)] = { ...a, instalment: next };
        if (a.status !== "Draft" && a.status !== "Rejected") lastInstalment = next;
        void seenNew;
      }
    }

    for (let i = 0; i < apps.length; i++) apps[i] = tellOneStory(apps[i]!);
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
   * 11. Projects with a sanctioned history under every scheme, so a renewal has something real to
   * renew and each point in the instalment cycle can be shown (`instalments.ts`).
   *
   *   AVYAY 40-40-20    SR/MH/PUN/03601  New 2025-26 · 2026-27 1st           → 2nd open
   *                     SR/DL/NWD/03602  New 2025-26 · 2026-27 1st, 2nd      → 3rd open
   *                     SR/MH/THN/03603  New 2025-26                         → 2026-27 1st open
   *   NAPDDR 40-40-20   DR/MH/PUN/03621 → 2nd · DR/DL/NWD/03622 → 3rd · DR/GJ/AHM/03623 → 1st
   *   SHRESHTA 40-40-20 SC/MH/PUN/03631 → 2nd · SC/DL/NWD/03632 → 3rd · SC/TN/MDR/03633 → 1st
   *   SMILE 50-50       TG/MH/PUN/03641  New 2025-26                         → 2026-27 1st open
   *                     TG/DL/NWD/03642  New 2025-26 · 2026-27 1st           → 2nd open
   *                     TG/TN/MDR/03643  New 2024-25 · 2025-26 1st, 2nd      → 2026-27 1st open (a new year)
   *
   * Built after every random draw above, so nothing earlier moves. Kept lean — only a project's
   * latest file keeps a document register, answers are limited to the scheme form's own questions,
   * the roster is small — because the store is shared by every portal on the origin.
   */
  const historyRoster: Beneficiary[] = [];
  const historyStaff: Employee[] = [];
  const historyProjects = new Set<string>();
  /** Projects made in block 12 for a draft that could not be a claim. A draft names no residents yet. */
  const rehomed = new Set<string>();
  {
    type Claim = { fy: string; instalment?: 1 | 2 | 3; submitted: number; sanctioned: number };
    type History = {
      scheme: "AVYAY" | "NAPDDR" | "SHRESHTA_M2" | "SMILE";
      inst: Institution;
      annual: number;
      nonRecurring: number;
      pfms: boolean;
      bank: readonly [string, string, string];
      people: number;
      claims: readonly Claim[];
      answers: Record<string, string>;
      /** Leave the latest sanction unreleased, so the "opens once released" state has a project. */
      unreleased?: boolean;
    };
    const PATTERNS: Record<History["scheme"], readonly number[]> = { AVYAY: [40, 40, 20], NAPDDR: [40, 40, 20], SHRESHTA_M2: [40, 40, 20], SMILE: [50, 50] };
    const place = (id: string, name: string, district: string, state: string, nature: Institution["nature"], building: Institution["building"], pin: string): Institution => ({
      id, name, district, state, nature, type: "Co-Ed", level: "Secondary", building, pin,
    });
    const newThenFirst: readonly Claim[] = [
      { fy: "2025-26", submitted: 420, sanctioned: 370 },
      { fy: "2026-27", instalment: 1, submitted: 120, sanctioned: 80 },
    ];
    const newThenTwo: readonly Claim[] = [
      { fy: "2025-26", submitted: 460, sanctioned: 400 },
      { fy: "2026-27", instalment: 1, submitted: 125, sanctioned: 90 },
      { fy: "2026-27", instalment: 2, submitted: 70, sanctioned: 32 },
    ];
    const newOnly: readonly Claim[] = [{ fy: "2025-26", submitted: 380, sanctioned: 330 }];
    const common = (h: { inst: Institution; people: number }) => ({
      fld_statute_act: "Societies Registration Act, 1860",
      fld_registration_date: "1978-03-12",
      fld_reg_office_address: `Registered office, ${applicant.district}, ${applicant.state}`,
      fld_total_beneficiaries: String(h.people),
      beneficiaries_identified: "Yes",
      decl_no_money_from_beneficiaries: "Yes",
      decl_not_blacklisted: "Yes",
      // A person signs the declaration, not the organisation.
      fld_auth_person_name: "Meena Deshpande",
      fld_auth_person_contact: "9822014455",
      fld_auth_place: h.inst.district,
    });
    const shreshta = (inst: Institution) => ({
      fld_registration_expiry: "2031-03-31", fld_reg_office_city: applicant.district,
      fld_nature_of_institution: inst.nature, fld_institution_gender_type: inst.type, fld_institution_level: inst.level,
      fld_uc_pending_status: "No Utilisation Certificate Pending", fld_commencement_date: "2012-06-15", fld_gia_since_year: "2014",
      fld_institution_location: `${inst.name}, ${inst.district}`, fld_institution_pin: inst.pin, govt_institution_within_2km: "No",
      fld_beneficiaries_sc: "96", fld_beneficiaries_other: "24", fld_total_beneficiaries: "120", fld_beneficiaries_previous_year: "112",
      decl_uc_uploaded: "Yes", decl_audited_accounts_submitted: "Yes", decl_name_changed_after_grant: "No", decl_not_for_profit: "Yes",
      decl_other_grant: "No", decl_fee_charged: "No", decl_annual_report_uploaded: "Yes", decl_all_docs_signed: "Yes",
    });
    const smile = (inst: Institution) => ({
      fld_nature_of_project: "Garima Greh — Transgender Care Home", website_available: "No", fld_reg_office_city: applicant.district,
      fld_org_geographical_coverage: `${inst.district} and neighbouring districts`, fld_org_area_specialisation: "Shelter and rehabilitation of transgender persons",
      fld_org_tg_experience: "Nine years of shelter, counselling and livelihood work with transgender persons.",
      fld_org_profile_writeup: "The organisation runs a 25-resident Garima Greh with counselling, skill training and placement support.",
      fld_strength_outreach_workers: "6", fld_strength_tg_rehabilitated: "41", fld_proj_tg_id_handheld: "88",
      fld_proj_rehab_strategies: "Skill training, placement with local employers and support for self-employment.",
      fld_registration_act: "Societies Registration Act, 1860", fld_registration_valid_upto: "2031-03-31", fld_establishment_date: "2015-01-10",
      fld_pan_number: "AAATS1234K", fld_pan_date: "2015-02-02", fcra_80g: "No",
      fld_head_name: "Kavita Rao", fld_head_qualification: "Post-graduate", fld_head_mobile: "9822016611", fld_head_address: `${applicant.district}, ${applicant.state}`,
      ...person("fld_key_person_1", "Rekha Singh", "Graduate", "Programme Coordinator", "9822016622"),
      fld_key_person_1_address: `${inst.district}, ${inst.state}`,
      fld_premises_office_area_sqm: "310", fld_premises_ownership: "Owned",
      fld_track_nature_of_work: "Shelter, counselling and livelihood support", fld_track_period_from: "2018-04-01", fld_track_period_to: "2025-03-31",
      fld_track_coverage: "Around 180 residents over seven years", fld_track_outcome: "State award for community service, 2023", fld_track_funding: "State grant and CSR funds",
      fld_site_address: `${inst.name}, ${inst.district}`, fld_site_city: inst.district, fld_site_location_type: "Urban", fld_site_pin: inst.pin,
      fld_site_org_email: "garimagreh@sankalpseva.org.in",
      ...person("fld_site_incharge", "Priya Nair", "Post-graduate", "Project Manager", "9822016633"), fld_site_incharge_email: "priya.nair@sankalpseva.org.in",
      fld_staff_project_director_name: "Anjali Pawar", fld_staff_project_director_qualification: "Graduate",
      fld_pmc_composition: "District Magistrate (Chairperson); organisation nominee; a doctor; a transgender welfare expert; the Project Director (Member Secretary).",
      fld_residents_list: "Held in the Beneficiaries & Staff register.", fld_sanctioned_capacity: "25",
      decl_records_accurate: "true", decl_no_encumbrance: "true", decl_audit_access: "true", decl_economy: "true", decl_progress_reports: "true",
      decl_own_contribution: "true", decl_reservation: "true", decl_no_duplicate_grant: "true", decl_separate_account: "true", decl_pfms_eat: "true",
    });
    const pun = (id: string, name: string, nature: Institution["nature"]) => place(id, name, "Pune", "Maharashtra", nature, "Owned", "411038");
    const nwd = (id: string, name: string, nature: Institution["nature"]) => place(id, name, "North West Delhi", "Delhi", nature, "Rented", "110085");
    const SR: Institution["nature"] = "Senior Citizens' Home";
    const DR: Institution["nature"] = "Integrated Rehabilitation Centre for Addicts";
    const SC: Institution["nature"] = "Secondary Residential School";
    const TG: Institution["nature"] = "Garima Greh (Shelter Home for Transgender Persons)";
    const sr1 = pun("SR/MH/PUN/03601", "Senior Citizens' Home (Unit 3)", SR);
    const sr2 = nwd("SR/DL/NWD/03602", "Continuous Care Home", SR);
    const sr3 = place("SR/MH/THN/03603", "Senior Citizens' Home", "Thane", "Maharashtra", SR, "Owned", "400601");
    const dr1 = pun("DR/MH/PUN/03621", "De-Addiction Centre", DR);
    const dr2 = nwd("DR/DL/NWD/03622", "Integrated Rehabilitation Centre", DR);
    const dr3 = place("DR/GJ/AHM/03623", "De-Addiction Centre", "Ahmedabad", "Gujarat", DR, "Owned", "380015");
    const sc1 = pun("SC/MH/PUN/03631", "Residential School (Kothrud)", SC);
    const sc2 = nwd("SC/DL/NWD/03632", "Residential School (Rohini)", SC);
    const sc3 = place("SC/TN/MDR/03633", "Residential School (Melur)", "Madurai", "Tamil Nadu", SC, "Owned", "625106");
    const tg1 = pun("TG/MH/PUN/03641", "Garima Greh", TG);
    const tg2 = nwd("TG/DL/NWD/03642", "Garima Greh", TG);
    const tg3 = place("TG/TN/MDR/03643", "Garima Greh", "Madurai", "Tamil Nadu", TG, "Owned", "625001");
    const histories: History[] = [
      { scheme: "AVYAY", inst: sr1, annual: 2034140, nonRecurring: 278195, pfms: true, bank: ["State Bank of India", "SBIN0004512", "Kothrud"], people: 25, claims: newThenFirst, answers: avyayAnswers(sr1, "Senior Citizens' Home — 25 beneficiaries", 25) },
      { scheme: "AVYAY", inst: sr2, annual: 3968263, nonRecurring: 370926, pfms: true, bank: ["Punjab National Bank", "PUNB0221300", "Rohini Sector 7"], people: 20, claims: newThenTwo, answers: avyayAnswers(sr2, "Continuous Care Home (CCH) / Dementia / Alzheimer's", 20) },
      { scheme: "AVYAY", inst: sr3, annual: 2034140, nonRecurring: 278195, pfms: false, bank: ["Bank of Baroda", "BARB0THANEX", "Thane West"], people: 25, claims: newOnly, answers: avyayAnswers(sr3, "Senior Citizens' Home — 25 beneficiaries", 25) },
      { scheme: "NAPDDR", inst: dr1, annual: 1850000, nonRecurring: 400000, pfms: true, bank: ["Bank of Maharashtra", "MAHB0000456", "Deccan Gymkhana"], people: 45, claims: newThenFirst, answers: napddrAnswers(dr1) },
      { scheme: "NAPDDR", inst: dr2, annual: 3200000, nonRecurring: 650000, pfms: true, bank: ["Canara Bank", "CNRB0003102", "Pitampura"], people: 60, claims: newThenTwo, answers: napddrAnswers(dr2) },
      { scheme: "NAPDDR", inst: dr3, annual: 1850000, nonRecurring: 400000, pfms: false, bank: ["State Bank of India", "SBIN0060321", "Navrangpura"], people: 40, claims: newOnly, answers: napddrAnswers(dr3) },
      { scheme: "SHRESHTA_M2", inst: sc1, annual: 5400000, nonRecurring: 900000, pfms: true, bank: ["Bank of Baroda", "BARB0KOTHRU", "Kothrud"], people: 120, claims: newThenFirst, answers: shreshta(sc1) },
      { scheme: "SHRESHTA_M2", inst: sc2, annual: 6100000, nonRecurring: 1100000, pfms: true, bank: ["Punjab National Bank", "PUNB0112200", "Rohini Sector 3"], people: 120, claims: newThenTwo, answers: shreshta(sc2) },
      { scheme: "SHRESHTA_M2", inst: sc3, annual: 4800000, nonRecurring: 800000, pfms: false, bank: ["Indian Bank", "IDIB000M015", "Melur"], people: 120, claims: newOnly, answers: shreshta(sc3) },
      { scheme: "SMILE", inst: tg1, annual: 2890000, nonRecurring: 850000, pfms: true, bank: ["State Bank of India", "SBIN0011602", "Shivajinagar"], people: 22, claims: newOnly, answers: smile(tg1), unreleased: true },
      { scheme: "SMILE", inst: tg2, annual: 2890000, nonRecurring: 850000, pfms: true, bank: ["Union Bank of India", "UBIN0531201", "Rohini Sector 11"], people: 24, claims: newThenFirst, answers: smile(tg2) },
      {
        scheme: "SMILE", inst: tg3, annual: 2890000, nonRecurring: 850000, pfms: true, bank: ["Indian Overseas Bank", "IOBA0001432", "Madurai Main"], people: 25,
        claims: [
          { fy: "2024-25", submitted: 760, sanctioned: 700 },
          { fy: "2025-26", instalment: 1, submitted: 480, sanctioned: 440 },
          { fy: "2025-26", instalment: 2, submitted: 300, sanctioned: 260 },
        ],
        answers: smile(tg3),
      },
    ];
    const WIZARD_BY_SCHEME = { AVYAY: AVYAY_WIZARD, NAPDDR: NAPDDR_WIZARD, SHRESHTA_M2: SHRESHTA_WIZARD, SMILE: SMILE_WIZARD } as const;
    const CASE_TYPE: Record<History["scheme"], [string, string] | undefined> = {
      AVYAY: ["New project", "Ongoing / Renewal of an existing project"],
      NAPDDR: ["New project", "Ongoing / Renewal of an existing project"],
      SMILE: ["No — new project (Project ID auto-generated)", "Yes — existing project (select the Project ID)"],
      SHRESHTA_M2: undefined,
    };
    let serial = 3610;
    const applicantPool = ngoPool[MINE]!;
    for (const h of histories) {
      historyProjects.add(h.inst.id);
      applicant.institutions.push(h.inst);
      if (!applicantPool.institutions.includes(h.inst)) applicantPool.institutions.push(h.inst);
      historyRoster.push(...buildBeneficiaries(h.inst.id, h.scheme === "AVYAY" ? 6 : 3, 0, 60 + serial));
      historyStaff.push(...buildEmployees(h.inst.id, h.scheme === "AVYAY" ? 3 : 2));
      const last4 = String(5000 + serial).slice(-4);
      projectAccounts.push({
        id: nextId("acct"),
        projectId: h.inst.id,
        bank: h.bank[0],
        branch: h.bank[2],
        last4,
        ifsc: h.bank[1],
        pfmsRegistered: h.pfms,
        activeFrom: iso(h.claims[0]!.submitted + 30),
      });
      const fields = new Set(WIZARD_BY_SCHEME[h.scheme].steps.flatMap((st) => st.sections.flatMap((x) => x.fields.map((f) => f.name))));
      const pattern = PATTERNS[h.scheme];
      let ref = "";
      for (const c of h.claims) {
        const base = draft(MINE, h.scheme, c.fy, c.submitted);
        const share = c.instalment ? pattern[c.instalment - 1]! : 0;
        const recurring = c.instalment ? Math.round((h.annual * share) / 100) : h.annual;
        const nonRecurring = c.instalment ? 0 : h.nonRecurring;
        if (!c.instalment || c.instalment === 1) ref = `GIA/${c.fy}/${h.scheme}/${h.inst.district.toUpperCase().replace(/\s+/g, "_")}/${String(serial++).padStart(5, "0")}`;
        const id = c.instalment && c.instalment > 1 ? `${ref}/I${c.instalment}` : ref;
        const latest = c === h.claims[h.claims.length - 1];
        // An instalment claim carries no grant-sought answers of its own: its figures are the sanction's
        // (the Summary read ₹15.87 L beside answers of ₹80 L).
        const scheme = Object.fromEntries(Object.entries(base.formValues ?? {}).filter(([k]) => fields.has(k) && !(c.instalment && /^fld_grant_/.test(k))));
        const caseType = CASE_TYPE[h.scheme];
        let a: GrantApplication = {
          ...base,
          // Only a project's latest file keeps its document register (store-persistence.test.ts).
          documents: latest && h.scheme === "AVYAY" ? base.documents : [],
          id,
          institutionId: h.inst.id,
          projectLabel: `${h.inst.name} — ${h.inst.district} · FY ${c.fy}`,
          caseType: c.instalment ? "Ongoing" : "New",
          instalment: c.instalment,
          scBeneficiaries: h.scheme === "SHRESHTA_M2" ? 96 : h.people,
          otherBeneficiaries: h.scheme === "SHRESHTA_M2" ? 24 : 0,
          totalBeneficiaries: h.scheme === "SHRESHTA_M2" ? 120 : h.people,
          recurring,
          nonRecurring,
          total: recurring + nonRecurring,
          formValues: {
            ...scheme,
            ...common(h),
            ...h.answers,
            fld_project_id: h.inst.id,
            // Every file's answers name what its project is (records-seed.test.ts).
            fld_nature_of_institution: h.inst.nature,
            fld_institution_gender_type: h.inst.type,
            fld_building_ownership: h.inst.building,
            ...(h.scheme === "SHRESHTA_M2"
              ? { fld_institution_id: h.inst.id, fld_institution_status: c.instalment ? "Ongoing" : "New", assistance_3yrs: c.instalment ? "Yes" : "No" }
              : {}),
            ...(h.scheme === "SMILE" ? { fld_site_state: h.inst.state, fld_site_district: h.inst.district } : { fld_project_state: h.inst.state, fld_project_district: h.inst.district }),
            ...(caseType ? { case_type: c.instalment ? caseType[1] : caseType[0] } : {}),
            // The instalment is on the record itself (`instalment`), not repeated in the answers.
            ...(c.instalment
              ? { fld_sanctioned_recurring: String(h.annual), fld_instalment_amount: String(recurring) }
              : { fld_grant_recurring: String(recurring), fld_grant_non_recurring: String(nonRecurring), fld_grant_total: String(recurring + nonRecurring) }),
            fld_bank_name: h.bank[0],
            fld_bank_branch: h.bank[2],
            fld_bank_account_number: `XXXX XXXX ${last4}`,
            fld_bank_ifsc: h.bank[1],
            fld_pfms_registered: h.pfms ? "Yes" : "No",
            fld_financial_year: c.fy,
          },
        };
        a = driveToChain(a, "finance", "js", c.sanctioned + 36);
        a = replay(a, [
          { role: "finance-js", action: "concur", daysAgo: c.sanctioned + 6, remarks: "Concurrence recorded." },
          { role: "programme-director", action: "sanction", daysAgo: c.sanctioned, remarks: "Sanctioned as recommended." },
        ]);
        a.submittedAt = a.audit[0]?.at ?? a.submittedAt;
        // Released by the Under Secretary about ten days after sanction — which is what opens the
        // next instalment for claim (instalments.ts). One project keeps its latest sanction unreleased.
        if (!(h.unreleased && latest)) {
          const released = releaseFunds(a, "pd-us", clockAt(Math.max(c.sanctioned - 10, 2)));
          if (!released.ok) throw new Error(`[e-anudaan seed] ${a.id}: cannot release — ${released.error}`);
          a = released.app;
        }
        // The certification rests on the documents, as on every other certified file (above).
        for (const doc of a.documents) {
          if (!a.certifiedAt || doc.reviewedBy) continue;
          if (doc.fileName) doc.reviewStatus = "Verified";
          else if (doc.optional) doc.reviewStatus = "Not applicable";
          else continue;
          doc.reviewedBy = a.certifiedBy ?? "pd-aso";
          doc.reviewedAt = a.certifiedAt;
        }
        a = tellOneStory(a);
        const arrivedAt = a.audit[a.audit.length - 1]?.at ?? a.updatedAt;
        a.updatedAt = arrivedAt;
        a.ageingDays = Math.max(Math.round((Date.parse(SEED_NOW) - Date.parse(arrivedAt)) / DAY), 0);
        apps.push(a);
      }
    }
    const mine = apps.filter((a) => a.ngoId === applicant.id);
    applicant.applicationCount = mine.length;
    applicant.sanctionedCount = mine.filter((a) => a.status === "Sanctioned").length;
    applicant.totalGrant = mine.reduce((sum, a) => sum + (a.sanction?.total ?? 0), 0);
  }

  /*
   * 12. What the applicant's screens read back must agree with the rest of the record
   *     (design-director audit, 16 Sep 2026). Built after every random draw, so nothing above moves.
   */
  {
    const planState: EAnudaanState = {
      version: 0, session: null, schemes: SEED_SCHEMES, ngos, applications: apps, inspections, notifications, projectAccounts, changeRequests, cctv: [], beneficiaries: [], employees: [],
    };
    const seedNow = new Date(SEED_NOW);

    /*
     * N-02 — a draft instalment claim is the claim the dashboard offers. Hostel — Thane offered
     * "Claim 3rd Instalment · FY 2025-26" beside a Draft of its 3rd Instalment labelled FY 2026-27:
     * one instalment with two years and two ways in. A draft now carries the instalment, year and
     * reference `instalmentPlan` gives its project, and the answers a renewal starts with. Where
     * nothing can be claimed on the project (a file is still with the Ministry, or the last grant is
     * unreleased), no claim could have been started, so the draft is a New application for a
     * project of its own — the rule 9b already applies to a second open file.
     */
    let unitSerial = 3900;
    const takenIds = new Set(ngos.flatMap((n) => n.institutions.map((i) => i.id)));
    for (const d of apps.filter((a) => a.status === "Draft" && a.caseType === "Ongoing")) {
      const plan = instalmentPlan(planState, d.schemeCode, d.institutionId, seedNow);
      if (plan.state === "open" && plan.instalment && plan.financialYear) {
        retitleYear(d, plan.financialYear);
        if (plan.applicationRef) d.id = claimIdFor(plan.applicationRef, plan.instalment);
        d.instalment = plan.instalment as 1 | 2 | 3;
        d.recurring = plan.amount ?? d.recurring;
        d.nonRecurring = 0;
        d.total = d.recurring;
        d.formValues = { ...d.formValues, ...renewalAnswers(plan) };
        continue;
      }
      const ngo = ngos.find((n) => n.id === d.ngoId)!;
      const src = ngo.institutions.find((i) => i.id === d.institutionId)!;
      const stem = src.id.split("/").slice(0, -1).join("/");
      let id = "";
      do id = `${stem}/${String(unitSerial++).padStart(5, "0")}`; while (takenIds.has(id));
      takenIds.add(id);
      const baseName = src.name.replace(/ \(Unit \d+\)$/, "");
      const unit = ngo.institutions.filter((i) => i.district === src.district && i.name.replace(/ \(Unit \d+\)$/, "") === baseName).length + 1;
      const inst: Institution = { ...src, id, name: `${baseName} (Unit ${unit})` };
      ngo.institutions.push(inst);
      rehomed.add(id);
      d.institutionId = id;
      d.projectLabel = `${inst.name} — ${inst.district} · FY ${d.financialYear}`;
      d.caseType = "New";
      d.instalment = undefined;
      d.formValues = {
        ...d.formValues,
        fld_project_id: id,
        fld_institution_id: id,
        fld_institution_location: `${inst.name}, ${inst.district}`,
        fld_institution_status: "New",
        assistance_3yrs: "No",
        fld_gia_since_year: "",
        fld_gia_released_last_3yrs: "",
        fld_beneficiaries_previous_year: "",
        decl_uc_uploaded: "No",
      };
    }

    /*
     * N-05 — a field correction shows the answer as submitted. "Beneficiaries in the previous year"
     * was raised on a New project, which reports no previous year, so "Correct Your Application"
     * read "Submitted: —" under a remark that the figure did not match. A field item names a
     * question its file answered, and carries that answer; a corrected one also carries the
     * corrected figure, so "Submitted 104 → Corrected 98" reads on both sides.
     */
    for (const a of apps) {
      const wizard = wizardFor(a.schemeCode);
      const labelOf = (name: string) => wizard?.steps.flatMap((st) => st.sections.flatMap((x) => x.fields)).find((f) => f.name === name)?.label;
      for (const def of a.deficiencies) {
        for (const item of def.items ?? []) {
          if (item.kind !== "field" || !item.fieldName) continue;
          const fv = { ...(a.formValues ?? {}) };
          if (!(fv[item.fieldName] ?? "").trim()) {
            const answered = ["fld_beneficiaries_sc", "fld_total_beneficiaries"].find((k) => (fv[k] ?? "").trim());
            if (!answered) continue;
            item.fieldName = answered;
            item.label = labelOf(answered) ?? item.label;
            item.remark = "The figure does not match the List of Beneficiaries uploaded with the application. Check it against that list.";
          }
          const field = item.fieldName;
          item.originalValue ??= fv[field]!;
          if (item.correctedAt && fv[field] === item.originalValue) {
            const corrected = String(Math.max(Number(item.originalValue) - 6, 1));
            fv[field] = corrected;
            if (field === "fld_beneficiaries_sc") {
              a.scBeneficiaries = Number(corrected);
              a.totalBeneficiaries = a.scBeneficiaries + a.otherBeneficiaries;
              fv.fld_total_beneficiaries = String(a.totalBeneficiaries);
            }
            if (field === "fld_total_beneficiaries") a.totalBeneficiaries = Number(corrected);
          }
          a.formValues = fv;
        }
      }
    }

    /*
     * N-04 — a submitted file answers every question its own path asks. Submitted files read
     * "Bank Account Details — 3 required questions unanswered" to the NGO while the officer's review
     * treated them as complete: the generic files carried the bank as one "name, branch" string the
     * form no longer asks, the AVYAY and NAPDDR files built by `draft()` carried SHRESHTA's answers,
     * and the claims left out what the portal records beside a claim. Answers come from the file's
     * own record; nothing is invented that the record does not already say.
     */
    const CASE_OPTIONS: Record<string, [string, string]> = {
      AVYAY: ["New project", "Ongoing / Renewal of an existing project"],
      NAPDDR: ["New project", "Ongoing / Renewal of an existing project"],
      SMILE: [SMILE_CASE_NEW, SMILE_CASE_EXISTING],
    };
    for (const a of apps) {
      if (a.status === "Draft") continue;
      const wizard = wizardFor(a.schemeCode);
      if (!wizard) continue;
      const ngo = ngos.find((n) => n.id === a.ngoId)!;
      const inst = ngo.institutions.find((i) => i.id === a.institutionId)!;
      const claim = a.caseType === "Ongoing" && a.instalment ? a.instalment : undefined;
      let v: Record<string, string> = { ...(a.formValues ?? {}) };
      // A file built as SHRESHTA's but filed under AVYAY or NAPDDR takes its own scheme's answers.
      if (a.schemeCode === "AVYAY" && !v.fld_nature_of_project) v = { ...avyayAnswers(inst, NAME_BY_SCHEME.AVYAY!, a.totalBeneficiaries), ...v };
      if (a.schemeCode === "NAPDDR" && !v.fld_project_type) {
        v = { ...napddrAnswers(inst, `https://www.${ngo.name.toLowerCase().replace(/[^a-z]+/g, "")}.org.in`), ...v };
      }
      // What the portal records beside a claim's answers (`renewalAnswers`): which claim this is.
      if (claim && (v.fld_instalment_amount || a.schemeCode !== "SHRESHTA_M2")) {
        v.claim_stage ||= claim > 1 ? "later-instalment" : "first-instalment";
        if (claim > 1) v.fld_application_ref ||= applicationRefOf(a);
      }
      const KNOWN: Record<string, string | undefined> = {
        case_type: CASE_OPTIONS[a.schemeCode]?.[claim ? 1 : 0],
        fld_project_state: inst.state,
        fld_project_district: inst.district,
        fld_bank_branch: inst.district,
        fld_pfms_registered: "Yes",
        fld_installment_no: claim ? instalmentLabel(claim) : undefined,
        fld_ongoing_source_application: claim ? `${inst.id} — ${inst.name}, ${inst.district}` : undefined,
        fld_smile_project_select: claim ? `${inst.id} — ${inst.name}, ${inst.district}` : undefined,
        beneficiaries_identified: "Yes",
        decl_no_money_from_beneficiaries: "Yes",
        fld_services_available_in_district: `No other ${NAME_BY_SCHEME[a.schemeCode]?.toLowerCase() ?? "such project"} is run in ${inst.district}; the nearest is in a neighbouring district.`,
        fld_distance_to_nearest_similar: "38",
        has_live_feed_url: "No",
        is_running_institution: "Yes",
        startup_registered_niti: "Yes",
        grant_requirement_type: "General / normal grant",
        fld_annual_recurring_grant: String(a.recurring),
        camera_live_feed: "No",
        prior_grant_received: "No",
        fld_bank_joint_operators: `${ngo.secretary}, Secretary, and ${ngo.treasurer}, Treasurer — Registered office, ${ngo.district}, ${ngo.state}`,
      };
      for (let pass = 0; pass < 4; pass++) {
        let changed = false;
        for (const step of visibleSteps(wizard, v)) {
          if (step.kind === "documents" || step.kind === "review") continue;
          for (const f of step.sections.flatMap((x) => x.fields)) {
            if (!f.required || !fieldVisible(f, v) || (v[f.name] ?? "").trim()) continue;
            const answer = KNOWN[f.name];
            if (!answer) continue;
            v[f.name] = answer;
            changed = true;
          }
        }
        if (!changed) break;
      }
      a.formValues = v;
    }
  }

  /*
   * One document the automatic check cannot vouch for, on the first file the Programme Division's
   * ASO opens (batch B6, 16 Sep 2026). The check read every document on that file as consistent, so
   * "Mark All Remaining as Verified" cleared all nineteen and the path the screen exists for — an
   * officer reading a document and giving it a verdict themselves — was never reached.
   *
   * The queue as the dashboard sorts it (oldest first); the first file in it that the check flags
   * nothing on gets one required annual document it is unsure about. Stamped rather than left to
   * `simulateCheck`, whose reading follows the file name and size and would move with them. The
   * words are the check's own (`demoVerdictFor`), and the officer's verdict stays Pending: this is
   * what the portal thinks, not what the Ministry has decided.
   */
  {
    const queue = apps
      .filter((a) => a.holder.kind === "chain" && a.holder.division === "pd" && a.holder.grade === "aso" && !a.certifiedAt)
      .sort((a, b) => b.ageingDays - a.ageingDays || a.id.localeCompare(b.id));
    const unflagged = queue.find((a) => a.documents.every((d) => !isFlagged(automaticCheckOf(a, d))));
    // Annual Report — Previous Financial Year: a scan an officer can settle by opening it.
    const doc = unflagged?.documents.find((d) => d.slot === 3 && d.fileName && !d.optional && d.reviewStatus === "Pending");
    if (doc) doc.aiVerdict = demoVerdictFor("review", doc.title, unflagged!.financialYear);
  }

  /*
   * CCTV registered at the applicant's projects (design-director follow-up, 16 Sep 2026). The NGO
   * sets this up once per project so an inspecting officer can open the centre's live feed; kept in
   * the store, because a setup saved in the NGO's own browser is invisible to that officer.
   *
   * Not every project is done — the page exists to show which are still outstanding — and one
   * registered recorder has never reached the portal, so "configured" and "live" are two different
   * answers on the officer's side. Deterministic: drawn from the Project ID, no random numbers.
   */
  const cctv: CctvSetup[] = applicant.institutions
    .filter((_, k) => k % 4 !== 3)
    .map((inst, k) => {
      const digits = Number(inst.id.replace(/\D/g, "").slice(-4)) || 0;
      const cameras = 2 + (digits % 5);
      return {
        projectId: inst.id,
        cameras,
        // One in seven recorders is registered but has never reached the portal.
        liveFeed: digits % 7 !== 3,
        activationCode: cctvActivationCode(inst.id, cameras),
        contactName: k % 3 === 0 ? applicant.secretary : undefined,
        contactMobile: k % 3 === 0 ? applicant.mobile : undefined,
        savedAt: iso(40 + ((digits % 23) * 9)),
      } satisfies CctvSetup;
    })
    /*
     * The camera register, certificate, retention and uptime declarations (schema 12). Five projects
     * carry a worked record, one of each story — compliant, partial coverage, certificate missing,
     * declaration overdue, retention too short — and the rest are registered with no cameras yet,
     * so every state of the module is on the demo account.
     */
    .map((setup, k) => {
      if (k >= 5) return setup;
      const worked = seedCctvDetail(setup, k as 0 | 1 | 2 | 3 | 4);
      return { ...worked, activationCode: cctvActivationCode(worked.projectId, worked.cameras) };
    });

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
  const beneficiaries: Beneficiary[] = applicant.institutions.filter((inst) => !historyProjects.has(inst.id) && !rehomed.has(inst.id)).flatMap((inst, k) =>
    buildBeneficiaries(inst.id, k === 0 ? 110 : 16 + (k % 4) * 3, k === 0 ? 14 : 2, k * 11),
  ).concat(historyRoster);
  const employees: Employee[] = applicant.institutions.filter((inst) => !historyProjects.has(inst.id) && !rehomed.has(inst.id)).flatMap((inst, k) => buildEmployees(inst.id, k === 0 ? 7 : 3 + (k % 4))).concat(historyStaff);

  /*
   * Answers the edit policy treats differently (edit-policy.ts), on the applicant's own open
   * corrections, so each outcome can be seen on "Correct Your Application": the audited-accounts file
   * (a new project) asks for the recurring grant — changed only with a reason; the bank letter's file
   * (a 2nd-instalment claim) asks for the IFSC — locked to the project's bank-account request; and the
   * staff-and-rent file asks about the organisation's name, which is read from NGO-DARPAN. Added after every
   * random draw, from answers the files already carry, so nothing above moves.
   */
  {
    const extra: Record<number, { field: string; remark: string }> = {
      10: { field: "fld_bank_ifsc", remark: "The IFSC in the application differs from the one on the bank authorisation letter." },
      7: { field: "fld_grant_recurring", remark: "The recurring grant sought is higher than the expenditure shown in the audited accounts. Check the figure against those accounts." },
      16: { field: "fld_ngo_name", remark: "The organisation's name in the application differs from the name on the list of employees." },
    };
    for (const a of apps) {
      if (a.ngoId !== applicant.id || a.status !== "DeficiencyRaised") continue;
      const open = [...a.deficiencies].reverse().find((d) => d.communicatedAt && !d.respondedAt);
      if (!open?.items) continue;
      for (const item of [...open.items]) {
        const slot = item.docId ? a.documents.find((d) => d.id === item.docId)?.slot : undefined;
        const add = slot != null ? extra[slot] : undefined;
        const answer = add ? (a.formValues?.[add.field] ?? "").trim() : "";
        if (!add || !answer || open.items.some((i) => i.fieldName === add.field)) continue;
        const label = wizardFor(a.schemeCode)?.steps.flatMap((st) => st.sections.flatMap((x) => x.fields)).find((f) => f.name === add.field)?.label ?? add.field;
        open.items.push({ id: `${item.id}-f`, kind: "field", fieldName: add.field, label, remark: add.remark, originalValue: answer });
      }
    }
  }

  return { applications: apps, ngos, inspections, notifications, projectAccounts, changeRequests, cctv, beneficiaries, employees };
}
