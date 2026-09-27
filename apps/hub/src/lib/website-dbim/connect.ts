/**
 * Content for the DBIM design's Connect pages — Contact Us, Directory, RTI,
 * Grievance Redressal, Events — read from the estate's own registers.
 *
 * Where the estate holds nothing the reference shows (the RTI introduction, the
 * CPGRAMS text), the reference's own words are used and marked `SOURCE:`. The
 * reference is the Department's DBIM 3.0 build, master-socialjustice.digifootprint.gov.in,
 * captured 25 Sep 2026.
 */
import { getCpios, getEvents, getOfficial, getOfficialsByOrganisation, withAssetBasePath } from "@/lib/website/content";
import { officialEmails, tidyAddress, titleCase } from "@/components/website-next/templates/people-format";
import type { CpioRecord, EventRecord, OfficialRecord } from "@/types/website/content";

/* ── Contact Us ──────────────────────────────────────────────────────────── */

/**
 * The Department's contact, as `app/website/contact-us/department-contact.ts` reads
 * it: dosje.gov.in/contact-us/ (read 22 Sep 2026) names one contact, Ms. Kajal Singh,
 * Director, at the Department's address; her telephone and email are her register
 * record (`kajal-singh`).
 *
 * The reference titles this block "Web Information Manager" and names an officer at
 * Shastri Bhawan. The Department has designated no Web Information Manager publicly
 * (docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md, G40), so that title is not
 * borrowed: the block is headed with the Department's name.
 */
export interface DbimContact {
  heading: string;
  lines: string[];
  phone?: string;
  email?: string;
  /** Google Maps embed for the address — no key, no script, lazy. */
  mapSrc: string;
}

const DEPARTMENT_ADDRESS = ["8th Floor, GPOA-3, Netaji Nagar,", "New Delhi-110023"];
const MAP_QUERY = "GPOA-3, Netaji Nagar, New Delhi 110023";

export function getDbimContact(): DbimContact {
  const director = getOfficial("kajal-singh");
  return {
    heading: "Department of Social Justice and Empowerment",
    // As dosje.gov.in/contact-us/ writes it; the register's title omits the "Ms.".
    lines: [...(director ? ["Ms. Kajal Singh, Director"] : []), ...DEPARTMENT_ADDRESS],
    phone: director?.phoneOffice,
    email: director?.email,
    mapSrc: `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`,
  };
}

/* ── Directory ───────────────────────────────────────────────────────────── */

export interface DbimDirectoryRow {
  key: string;
  name: string;
  /** The first letter the A–Z strip files the name under. */
  letter: string;
  /** The register's section — "Under Secretary", "Section Officers". */
  section?: string;
  /** The post, drawn as the chip. */
  post?: string;
  phone?: string;
  /** Printed as the Department prints it: name[at]gov[dot]in. */
  email?: string;
  intercom?: string;
  address?: string;
}

/**
 * THE LETTER RULE. A name is filed under its first letter after a leading honorific
 * is removed — Shri, Sh., Smt., Dr., Mr., Mrs., Ms., Kum., Km. — so "Dr. Virendra
 * Kumar" is under V, not D. Only a leading honorific is removed, and only one.
 */
const HONORIFIC = /^(?:shri|sh|smt|dr|mr|mrs|ms|kum|km)\.?\s+/i;

export function directoryLetter(name: string): string {
  const bare = name.trim().replace(HONORIFIC, "");
  const c = bare.charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}

/**
 * Seniority, restated from the redesign's `OfficialsDirectory` (where it is not
 * exported): the register carries no `menuOrder`, and its CMS order put the Pay and
 * Accounts Office above the Union Minister. Sections are ranked by the Government of
 * India's order of precedence, then A–Z.
 */
const SENIORITY: RegExp[] = [
  /union cabinet minister|^minister(?! of state)|chairperson|chairman/i,
  /minister of state|vice.?chair/i,
  /^secretary|member secretary/i,
  /additional secretary/i,
  /joint secretary/i,
  /adviser|advisor|director general/i,
  /^director/i,
  /deputy secretar/i,
  /deputy director/i,
  /under secretar/i,
  /assistant director/i,
  /section officer/i,
];
const rank = (text: string) => {
  const i = SENIORITY.findIndex((re) => re.test(text));
  return i === -1 ? SENIORITY.length : i;
};

/** A CMS test entry, not an officer (the redesign's rule). */
const isTestRecord = (o: OfficialRecord) =>
  /^test\b/i.test(o.title.trim()) || /\babc$/i.test((o.designation ?? "").trim());

const tidy = (s?: string) => s?.replace(/\s+/g, " ").replace(/\s+,/g, ",").trim() || undefined;

/** Back to the notation the Department prints, once free-mail has been dropped (CON-09). */
const printedEmail = (raw?: string) =>
  officialEmails(raw)
    .map((e) => e.replace("@", "[at]").replace(/\./g, "[dot]"))
    .join(", ") || undefined;

/** The Department's telephone directory — the Ministry's officers in the register. */
export function getDbimDirectory(): DbimDirectoryRow[] {
  const rows = getOfficialsByOrganisation("MoSJE")
    .filter((o) => !isTestRecord(o))
    .map((o) => {
      const name = tidy(o.title) ?? o.title;
      const phone = tidy(o.phoneOffice ?? o.phoneResidence);
      return {
        key: o.slug,
        name,
        letter: directoryLetter(name),
        section: o.group?.trim() ? titleCase(o.group.trim()) : undefined,
        post: tidy(o.designation),
        phone,
        email: printedEmail(o.email),
        intercom: tidy(o.intercom),
        address: tidyAddress(o.address, phone),
      } satisfies DbimDirectoryRow;
    });
  /* The register holds some officers twice — "Dr. Virendra Kumar" and "Dr. Virendra
     Kumar, HMSJE" are one Minister. Same person = same name before any comma, in the
     same section; the record with more contact detail is the one kept. */
  const filled = (r: DbimDirectoryRow) => [r.phone, r.email, r.intercom, r.address, r.post].filter(Boolean).length;
  const byPerson = new Map<string, DbimDirectoryRow>();
  for (const r of rows) {
    const id = `${r.section ?? ""}|${r.name.split(",")[0]!.trim().toLowerCase()}`;
    const kept = byPerson.get(id);
    if (!kept || filled(r) > filled(kept)) byPerson.set(id, r);
  }
  return [...byPerson.values()].sort(
    (a, b) =>
      rank(a.section ?? "~") - rank(b.section ?? "~") ||
      (a.section ?? "~").localeCompare(b.section ?? "~", "en-IN") ||
      rank(a.post ?? "") - rank(b.post ?? "") ||
      a.name.localeCompare(b.name, "en-IN"),
  );
}

/* ── RTI ─────────────────────────────────────────────────────────────────── */

/**
 * SOURCE: the reference's /connect/rti, captured 25 Sep 2026 — the Department's DBIM
 * site. The estate holds no Department-level RTI introduction (the ingested RTI pages
 * belong to DAF, NCSK and NSFDC). The fee and the payee are the RTI Rules' own.
 */
export const RTI_INTRO =
  "Right to Information Act 2005 mandates timely response to citizen requests for government information. Right to Information empowers every citizen to seek any information from the Government, inspect any Government documents and seek certified photocopies thereof.";

export const RTI_SUBMISSION =
  "Applications for information under RTI Act, 2005 from Department of Social Justice & Empowerment, Ministry of Social Justice & Empowerment may be addressed to Department’s Central Public Information Officer clearly specifying the information required from the records of Department of Social Justice & Empowerment. The fee of Rs.10/- (Rupees Ten only) in respect of such application is to be made by way of Indian Postal Order/Bank Draft/Banker’s Cheque payable to “Pay & Accounts Officer, Department of Social Justice & Empowerment, Ministry of Social Justice & Empowerment”.";

/** Where applications go: the Department's address from the register (not the reference's Shastri Bhawan). */
export const RTI_ADDRESS = ["Department of Social Justice & Empowerment", ...DEPARTMENT_ADDRESS];

/**
 * SOURCE: dosje.gov.in/organisation/national-portal-for-transgender-persons/rti/ —
 * "First Appellate Authority and CPIOs of D/O SJ&E for RTI" and "Information Handbook
 * under Section 4(1)(b) of the RTI Act, 2005", both the Department's own (ingested in
 * content/website/organisation.json).
 */
export const RTI_HANDBOOK_URL =
  "https://dpdxu36pks2tw.cloudfront.net/wp-content/uploads/2026/02/Information-Handbook-under-Section-41b-of-the-RTI-Act-2005.pdf";
export const RTI_CPIO_LIST_URL = "https://dpdxu36pks2tw.cloudfront.net/wp-content/uploads/2026/02/LIST-OF-CPIOs-FAAS.pdf";

export interface RtiOfficer {
  key: string;
  name: string;
  designation?: string;
  office?: string;
  email?: string;
}

const isAppellate = (c: CpioRecord) => /appellate|\bFAA\b/i.test(`${c.name ?? ""} ${c.title} ${c.designation ?? ""}`);

const toOfficer = (c: CpioRecord): RtiOfficer => ({
  key: c.slug,
  name: tidy(c.name ?? c.title) ?? c.title,
  designation: tidy(c.designation),
  office: tidy(c.office),
  email: officialEmails(c.email)[0],
});

/** The CPIO register split into Central Public Information Officers and First Appellate Authorities. */
export function getRtiOfficers(): { cpio: RtiOfficer[]; faa: RtiOfficer[] } {
  const all = getCpios();
  return {
    cpio: all.filter((c) => !isAppellate(c)).map(toOfficer),
    faa: all.filter(isAppellate).map(toOfficer),
  };
}

/* ── Grievance Redressal ─────────────────────────────────────────────────── */

/**
 * SOURCE: the reference's /connect/grievance-redressal, captured 25 Sep 2026. The
 * estate carries no grievance text of the Department's own (searched app/,
 * components/ and content/ on 25 Sep 2026: only one-line pointers to CPGRAMS), and
 * CPGRAMS is the Government-wide mechanism, so its standard description is used.
 */
export const GRIEVANCE = {
  lead: "An accessible 24/7 online platform for citizens to lodge service-related complaints.",
  paragraphs: [
    { text: "The Centralised Public Grievance Redress and Monitoring System (CPGRAMS) is an accessible 24/7 online platform for citizens to lodge service-related complaints. Linking all Ministries/Departments of the Government of India and States, CPGRAMS ensures role-based access. Users can easily access CPGRAMS through a mobile app downloadable from the Google Play store or integrated with UMANG." },
    { heading: "How to Track" },
    { text: "To track grievances, use the unique registration ID provided during submission. CPGRAMS allows appeals for unsatisfied complainants, and after closure, feedback can be provided. A ‘Poor’ rating enables an appeal, tracked with the grievance registration number." },
    { heading: "Issues outside CPGRAMS scope:" },
    { text: "RTI matters, court-related cases, religious matters, suggestions, and certain government employee grievances, unless channels are exhausted per DoPT OM No. 11013/08/2013-Estt.(A-III) dated 31.08.2015." },
    { heading: "Note:" },
    { text: "If you lack satisfactory redress for Ministries/Departments and Organizations under DPG, Cabinet Secretariat, GOI, seek DPG assistance. No fee is charged for filing grievances; all funds go to M/s CSC." },
  ] as { heading?: string; text?: string }[],
  link: { label: "Public Grievance Redressal Mechanism", href: "https://pgportal.gov.in/" },
} as const;

/* ── Events ──────────────────────────────────────────────────────────────── */

export interface DbimEvent {
  key: string;
  title: string;
  /** "Sikkim", "Delhi" — the last part of the venue, as the reference leads with the place. */
  place?: string;
  start?: string;
  end?: string;
  venue?: string;
  venueHref?: string;
  descriptionHtml?: string;
  /** YYYY-MM-DD the event is over (end, else start) — the upcoming/past split. */
  until: string;
  startIso: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** 2025-08-28 → "28 August 2025", the reference's form. */
function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
}

/** The two clock times in the register's `when` line ("Sep 2nd, 2026 • 02:10 PM to Sep 3rd, 2026 • 03:15 PM"). */
const times = (when?: string) => [...(when ?? "").matchAll(/\b(\d{1,2}:\d{2}\s?[AP]M)\b/gi)].map((m) => m[1]!.toUpperCase());

function toEvent(e: EventRecord): DbimEvent | undefined {
  const startIso = e.startDate ?? e.date;
  if (!startIso) return undefined;
  const [t1, t2] = times(e.when);
  const endIso = e.endDate && e.endDate !== startIso ? e.endDate : undefined;
  const venue = tidy(e.location);
  const place = venue?.split(",").map((s) => s.trim()).filter(Boolean).pop();
  return {
    key: e.slug,
    title: tidy(e.title) ?? e.title,
    place,
    start: [longDate(startIso), t1].filter(Boolean).join(" "),
    end: endIso ? [longDate(endIso), t2].filter(Boolean).join(" ") : undefined,
    venue,
    venueHref: venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}` : undefined,
    descriptionHtml: e.descriptionHtml ? withAssetBasePath(e.descriptionHtml) : undefined,
    until: endIso ?? startIso,
    startIso,
  };
}

/** Events split at `today` (YYYY-MM-DD): upcoming soonest first, past newest first. */
export function getDbimEvents(today: string): { upcoming: DbimEvent[]; past: DbimEvent[] } {
  const all = getEvents().map(toEvent).filter((e): e is DbimEvent => e != null);
  return {
    upcoming: all.filter((e) => e.until >= today).sort((a, b) => a.startIso.localeCompare(b.startIso)),
    past: all.filter((e) => e.until < today).sort((a, b) => b.startIso.localeCompare(a.startIso)),
  };
}
