// Mass Pledge master data and configuration.
//
// The open questions in the source requirement, and the resolution each one is
// built to, are recorded in docs/nmba-mass-pledge-clarifications.md. They are
// deliberately NOT surfaced in the product UI: officers filing a report on the
// day should see a form, not a commentary on the requirement.

import type { PortalSession } from "../committee/types";
import type { ReporterKind } from "./types";

// ── Event and window ────────────────────────────────────────

/** The event date. Locked: the form renders it read-only and never accepts input. */
export const EVENT_DATE = "2026-08-18";
export const EVENT_DATE_LABEL = "18 August 2026";

/**
 * Reporting is open on the day of the event only. A report filed on any other
 * date would not be a record of what happened on 18 August.
 */
export const WINDOW_OPENS = EVENT_DATE;
export const WINDOW_CLOSES = EVENT_DATE;

export type WindowState = "BEFORE" | "OPEN" | "CLOSED";

/** Indian Standard Time, UTC+5:30. A fixed offset — India observes no DST. */
const IST_OFFSET_MINUTES = 5 * 60 + 30;

/**
 * The calendar date in India, as `yyyy-mm-dd`.
 *
 * Deliberately NOT `toISOString().slice(0,10)`, which is the UTC date: for the
 * first 5 hours 30 minutes of any Indian day that still reads as *yesterday*,
 * which would keep the form shut until 05:30 on the morning of the pledge.
 */
export function istDate(now: Date): string {
  const shifted = new Date(now.getTime() + IST_OFFSET_MINUTES * 60_000);
  return shifted.toISOString().slice(0, 10);
}

/**
 * Where "today" sits relative to the event, in Indian local time.
 *
 * `override` exists so reviewers can see all three states without changing the
 * system clock; it is only ever passed from a dev-only control.
 */
export function windowState(now: Date, override?: WindowState): WindowState {
  if (override) return override;
  const today = istDate(now);
  if (today < EVENT_DATE) return "BEFORE";
  if (today > EVENT_DATE) return "CLOSED";
  return "OPEN";
}

/** True only on 18 August 2026, Indian local time. */
export function isFormOpen(now: Date, override?: WindowState): boolean {
  return windowState(now, override) === "OPEN";
}

// ── Photo limits ─────────────────────────────────────────────

export const MIN_PHOTOS = 1;
export const MAX_PHOTOS = 4;
/** Per photo, not per submission. */
export const MAX_PHOTO_MB = 10;

// ── Participation bucket definitions ─────────────────────────

export const COUNT_HINTS = {
  youth: "Participants under 30, any gender.",
  women: "Female participants aged 30 and above.",
  others: "Everyone else — males 30 and above, and any other gender 30 and above.",
} as const;

// ── Lists ───────────────────────────────────────────────────

/**
 * Union Ministries and Departments. Real, from the public Government of India
 * allocation of business. MoSJE is pinned first per the requirement.
 */
export const LINE_MINISTRIES: string[] = [
  "Ministry of Social Justice & Empowerment",
  "Ministry of Agriculture & Farmers Welfare",
  "Ministry of AYUSH",
  "Ministry of Coal",
  "Ministry of Culture",
  "Ministry of Defence",
  "Ministry of Development of North Eastern Region",
  "Ministry of Education",
  "Ministry of Electronics & Information Technology",
  "Ministry of Environment, Forest & Climate Change",
  "Ministry of External Affairs",
  "Ministry of Finance",
  "Ministry of Fisheries, Animal Husbandry & Dairying",
  "Ministry of Food Processing Industries",
  "Ministry of Health & Family Welfare",
  "Ministry of Home Affairs",
  "Ministry of Housing & Urban Affairs",
  "Ministry of Information & Broadcasting",
  "Ministry of Jal Shakti",
  "Ministry of Labour & Employment",
  "Ministry of Law & Justice",
  "Ministry of Micro, Small & Medium Enterprises",
  "Ministry of Minority Affairs",
  "Ministry of Panchayati Raj",
  "Ministry of Petroleum & Natural Gas",
  "Ministry of Power",
  "Ministry of Railways",
  "Ministry of Road Transport & Highways",
  "Ministry of Rural Development",
  "Ministry of Science & Technology",
  "Ministry of Skill Development & Entrepreneurship",
  "Ministry of Textiles",
  "Ministry of Tribal Affairs",
  "Ministry of Women & Child Development",
  "Ministry of Youth Affairs & Sports",
];

/**
 * PLACEHOLDER — the requirement says "Drop-down (of 08 orgs)" but the list was
 * never supplied. These eight are organisations with a public record of social
 * service work; they are stand-ins so the form is testable, NOT a confirmed
 * roster, and the UI labels them as such. Replace wholesale on confirmation.
 */
export const SPIRITUAL_ORGANISATIONS: string[] = [
  "Art of Living Foundation",
  "Brahma Kumaris",
  "Chinmaya Mission",
  "Gayatri Pariwar",
  "ISKCON",
  "Isha Foundation",
  "Ramakrishna Mission",
  "Sri Sathya Sai Seva Organisation",
];

export const SPIRITUAL_ORGANISATIONS_ARE_PLACEHOLDER = true;

/**
 * Higher Education Institutions. A real but partial set (central universities
 * and national institutes); the full AISHE list replaces this on confirmation.
 * "Others" lets any institution outside the list self-identify.
 */
export const HIGHER_EDUCATION_INSTITUTIONS: string[] = [
  "Aligarh Muslim University",
  "Ambedkar University Delhi",
  "Banaras Hindu University",
  "Delhi University",
  "IIT Bombay",
  "IIT Delhi",
  "IIT Kanpur",
  "IIT Kharagpur",
  "IIT Madras",
  "Indira Gandhi National Open University",
  "Jamia Millia Islamia",
  "Jawaharlal Nehru University",
  "Jadavpur University",
  "NIT Tiruchirappalli",
  "NIT Warangal",
  "Osmania University",
  "Panjab University",
  "Savitribai Phule Pune University",
  "Tata Institute of Social Sciences",
  "University of Calcutta",
  "University of Hyderabad",
  "University of Madras",
  "University of Mumbai",
  "Visva-Bharati University",
];

/** The escape hatch on the Line Ministry and HEI dropdowns. */
export const OTHER_OPTION = "Others (specify)";

// ── Which form a session may file ────────────────────────────────────────────

/** The form a logged-in session reports on, or null if it may not report. */
export function reporterKindForSession(session: PortalSession): ReporterKind | null {
  switch (session.role) {
    case "STATE":
    case "DISTRICT":
    case "BLOCK":
      return "ADMIN_TIER";
    case "ENTITY":
      return session.entityKind ?? null;
    case "ADMIN":
      // Admin oversees the national rollup and does not file participation.
      return null;
  }
}

// ── Demo accounts (extends the existing NMBA portal logins) ──────────────────

export const DEMO_PASSWORD = "Demo@123";

export interface MassPledgeDemoAccount {
  id: string;
  password: string;
  session: PortalSession;
  /** Shown in the demo credentials panel so reviewers know what each one proves. */
  purpose: string;
  /**
   * True for accounts that exist purely so the reporting form can be filled in
   * live. Every other demo account already owns a seeded submission, and the
   * one-report-per-account rule (A9) correctly refuses a second one — which
   * would otherwise leave the form itself undemonstrable.
   */
  spare?: boolean;
}

/**
 * New logins for Mass Pledge. The existing Admin / State / District accounts in
 * `../committee/masters.ts` are unchanged and still work; these add the bottom
 * of the approval chain and the four non-geographic reporters.
 */
export const MASS_PLEDGE_DEMO_ACCOUNTS: MassPledgeDemoAccount[] = [
  {
    id: "9890005678",
    password: DEMO_PASSWORD,
    purpose: "Files a Block report; starts the full three-tier chain",
    session: {
      role: "BLOCK",
      accountId: "9890005678",
      displayName: "Sunil Kamble (Haveli BNO)",
      state: "Maharashtra",
      district: "Pune",
      block: "Haveli",
    },
  },
  {
    id: "9810007001",
    password: DEMO_PASSWORD,
    purpose: "Line Ministry self-declared report",
    session: {
      role: "ENTITY",
      accountId: "9810007001",
      displayName: "Meera Raghavan (Ministry of Education)",
      entityKind: "LINE_MINISTRY",
      entityName: "Ministry of Education",
    },
  },
  {
    id: "9810007002",
    password: DEMO_PASSWORD,
    purpose: "Spiritual Organisation self-declared report",
    session: {
      role: "ENTITY",
      accountId: "9810007002",
      displayName: "Devendra Joshi (Brahma Kumaris)",
      entityKind: "SPIRITUAL_ORG",
      entityName: "Brahma Kumaris",
    },
  },
  {
    id: "9810007003",
    password: DEMO_PASSWORD,
    purpose: "Higher Education Institution self-declared report",
    session: {
      role: "ENTITY",
      accountId: "9810007003",
      displayName: "Ritu Sharma (Delhi University)",
      entityKind: "HEI",
      entityName: "Delhi University",
    },
  },
  {
    id: "9810007004",
    password: DEMO_PASSWORD,
    purpose: "GIA report with the organisation name auto-filled from login",
    session: {
      role: "ENTITY",
      accountId: "9810007004",
      displayName: "Anand Kulkarni (Muktangan Rehabilitation Centre)",
      entityKind: "GIA",
      entityName: "Muktangan Rehabilitation Centre",
    },
  },
];

/**
 * Spare logins that own no seeded submission, so the reporting form itself can
 * be filled in live from every one of the five documented forms.
 *
 * The Block spare sits in Pune deliberately: filing from it produces a report
 * that the existing Pune District officer (9890001234) can approve, which the
 * existing Maharashtra State officer (9890123456) can then approve — a complete
 * three-tier chain demonstrated live rather than read off the seed.
 */
export const MASS_PLEDGE_SPARE_ACCOUNTS: MassPledgeDemoAccount[] = [
  {
    id: "9890005679",
    password: DEMO_PASSWORD,
    spare: true,
    purpose: "Empty Block login — file a report and walk it up the full chain",
    session: {
      role: "BLOCK",
      accountId: "9890005679",
      displayName: "Kavita Jadhav (Maval BNO)",
      state: "Maharashtra",
      district: "Pune",
      block: "Maval",
    },
  },
  {
    id: "9890001299",
    password: DEMO_PASSWORD,
    spare: true,
    purpose: "Empty District login — file a district report, or approve Nashik blocks",
    session: {
      role: "DISTRICT",
      accountId: "9890001299",
      displayName: "Ravi Pawar (Nashik DNO)",
      state: "Maharashtra",
      district: "Nashik",
    },
  },
  {
    id: "9810007011",
    password: DEMO_PASSWORD,
    spare: true,
    purpose: "Empty Line Ministry login — file a self-declared report",
    session: {
      role: "ENTITY",
      accountId: "9810007011",
      displayName: "Sanjay Iyer (Ministry of Youth Affairs & Sports)",
      entityKind: "LINE_MINISTRY",
      entityName: "Ministry of Youth Affairs & Sports",
    },
  },
  {
    id: "9810007012",
    password: DEMO_PASSWORD,
    spare: true,
    purpose: "Empty Spiritual Organisation login — file a self-declared report",
    session: {
      role: "ENTITY",
      accountId: "9810007012",
      displayName: "Sunita Rao (Ramakrishna Mission)",
      entityKind: "SPIRITUAL_ORG",
      entityName: "Ramakrishna Mission",
    },
  },
  {
    id: "9810007013",
    password: DEMO_PASSWORD,
    spare: true,
    purpose: "Empty Higher Education Institution login — file a self-declared report",
    session: {
      role: "ENTITY",
      accountId: "9810007013",
      displayName: "Arvind Mishra (Banaras Hindu University)",
      entityKind: "HEI",
      entityName: "Banaras Hindu University",
    },
  },
  {
    id: "9810007014",
    password: DEMO_PASSWORD,
    spare: true,
    purpose: "Empty GIA login — file a self-declared report, name auto-filled from login",
    session: {
      role: "ENTITY",
      accountId: "9810007014",
      displayName: "Farida Shaikh (Navjeevan Rehabilitation Centre)",
      entityKind: "GIA",
      entityName: "Navjeevan Rehabilitation Centre",
    },
  },
];

/** Every Mass Pledge login: the seeded reporters plus the spares. */
export const ALL_MASS_PLEDGE_ACCOUNTS: MassPledgeDemoAccount[] = [
  ...MASS_PLEDGE_DEMO_ACCOUNTS,
  ...MASS_PLEDGE_SPARE_ACCOUNTS,
];

export function massPledgeAccountFromMobile(mobile: string): MassPledgeDemoAccount | null {
  const trimmed = mobile.trim();
  return ALL_MASS_PLEDGE_ACCOUNTS.find((a) => a.id === trimmed) ?? null;
}
