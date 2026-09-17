/**
 * The CCTV module's rules — the camera register, the privacy exclusions, the coverage a project
 * owes, footage retention and the monthly uptime declaration — as pure functions, so the NGO's
 * form, the NGO's summary and the officer's compliance view all read one answer
 * (data-state-completeness §2).
 *
 * Source of the rules: e-Anudaan parity brief §D item 2 (17 Sep 2026). The seven coverage areas,
 * the four places a camera may not be installed and the 30-day retention floor are stated there;
 * the declaration day (the 7th of the following month) is this module's own choice and is stated
 * on the screen where it applies.
 *
 * Run: node --test src/lib/e-anudaan/cctv.test.ts
 */

import type {
  CctvAreaId,
  CctvCamera,
  CctvOutage,
  CctvSetup,
  CctvStorage,
  CctvUptimeDeclaration,
} from "./types.ts";

/* ── what a project owes ──────────────────────────────────────────────────── */

export const CCTV_AREAS: readonly { id: CctvAreaId; label: string }[] = [
  { id: "entrance", label: "Entrance and Exit" },
  { id: "corridors", label: "Corridors" },
  { id: "dining", label: "Dining Hall" },
  { id: "common", label: "Common and Recreation Area" },
  { id: "kitchen", label: "Kitchen" },
  { id: "office", label: "Office and Records Room" },
  { id: "perimeter", label: "Perimeter" },
];

export const areaLabel = (id: CctvAreaId): string => CCTV_AREAS.find((a) => a.id === id)?.label ?? id;

/**
 * Where a camera may never be installed, and why. Matched against the location as typed, so
 * "Girls' washroom, first floor" is refused whatever coverage area was chosen beside it.
 */
export const PRIVACY_EXCLUSIONS: readonly { label: string; pattern: RegExp }[] = [
  { label: "toilets", pattern: /\b(toilets?|washrooms?|lavator(y|ies)|latrines?|urinals?|restrooms?|w\.?c\.?)\b/i },
  { label: "bathrooms", pattern: /\b(bath(room)?s?|shower(s| room)?)\b/i },
  { label: "dormitory sleeping areas", pattern: /\b(dorm(itor(y|ies))?s?|sleeping|bed ?rooms?|bunk ?rooms?)\b/i },
  { label: "medical examination rooms", pattern: /\b(medical|examination|sick ?bay|infirmary|clinic|dispensary)\b/i },
];

/** The privacy exclusion a location falls under, if any. */
export function privacyExclusionOf(location: string): string | undefined {
  return PRIVACY_EXCLUSIONS.find((x) => x.pattern.test(location))?.label;
}

export const RETENTION_MIN_DAYS = 30;
export const RETENTION_MAX_DAYS = 365;
/** A month's uptime declaration is due by this day of the following month. */
export const DECLARATION_DUE_DAY = 7;

export const STORAGE_MEDIA: readonly CctvStorage["medium"][] = [
  "Network Video Recorder (NVR)",
  "Digital Video Recorder (DVR)",
  "Cloud Storage",
];

type Errors<V> = Partial<Record<keyof V, string>>;
export type Validated<V, T> = { ok: true; value: T } | { ok: false; errors: Errors<V> };

const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const localDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* ── camera form ─────────────────────────────────────────────────────────── */

/** One object per form, every value a string, so a form can be filled programmatically. */
export interface CameraFormValues {
  location: string;
  area: CctvAreaId | "";
  placement: CctvCamera["placement"] | "";
  recording: CctvCamera["recording"] | "";
  nightVision: "Yes" | "No" | "";
  installedOn: string;
  working: "Working" | "Not Working" | "";
}

export const EMPTY_CAMERA: CameraFormValues = { location: "", area: "", placement: "", recording: "", nightVision: "", installedOn: "", working: "" };

export function cameraToValues(c: CctvCamera): CameraFormValues {
  return {
    location: c.location,
    area: c.area,
    placement: c.placement,
    recording: c.recording,
    nightVision: c.nightVision ? "Yes" : "No",
    installedOn: c.installedOn,
    working: c.working ? "Working" : "Not Working",
  };
}

export function validateCamera(v: CameraFormValues, id: string, now: Date = new Date()): Validated<CameraFormValues, CctvCamera> {
  const e: Errors<CameraFormValues> = {};
  const location = v.location.trim();
  const excluded = privacyExclusionOf(location);
  if (!location) e.location = "Enter where the camera is installed.";
  else if (excluded)
    e.location = `A camera cannot be installed in ${excluded}. Residents' privacy is protected there, so this location cannot be registered.`;
  else if (location.length < 3) e.location = "Describe the location in at least 3 characters.";
  else if (location.length > 80) e.location = "Keep the location to 80 characters.";
  if (!v.area) e.area = "Select the area this camera covers.";
  if (!v.placement) e.placement = "Select whether the camera is indoor or outdoor.";
  if (!v.recording) e.recording = "Select how the camera records.";
  if (!v.nightVision) e.nightVision = "Select whether the camera has night vision.";
  if (!v.installedOn) e.installedOn = "Enter the date the camera was installed.";
  else if (!isDate(v.installedOn)) e.installedOn = "Enter the date as dd/mm/yyyy.";
  else if (v.installedOn > localDay(now)) e.installedOn = "The installation date cannot be in the future.";
  if (!v.working) e.working = "Select whether the camera is working.";
  if (Object.keys(e).length) return { ok: false, errors: e };
  return {
    ok: true,
    value: {
      id,
      location,
      area: v.area as CctvAreaId,
      placement: v.placement as CctvCamera["placement"],
      recording: v.recording as CctvCamera["recording"],
      nightVision: v.nightVision === "Yes",
      installedOn: v.installedOn,
      working: v.working === "Working",
    },
  };
}

/* ── installation certificate ────────────────────────────────────────────── */

export const CERTIFICATE_TYPES: readonly string[] = ["application/pdf", "image/jpeg", "image/png"];
export const CERTIFICATE_MAX_KB = 5 * 1024;

/** Why a chosen certificate file is refused, or null when it may be uploaded. */
export function certificateFileProblem(file: { name: string; type: string; size: number }): string | null {
  if (!CERTIFICATE_TYPES.includes(file.type)) return `${file.name} is not a PDF, JPG or PNG file. Choose the certificate in one of those formats.`;
  if (file.size / 1024 > CERTIFICATE_MAX_KB) return `${file.name} is larger than 5 MB. Choose a smaller copy of the certificate.`;
  return null;
}

/* ── retention and storage form ──────────────────────────────────────────── */

export interface RecordsFormValues {
  retentionDays: string;
  storageMedium: CctvStorage["medium"] | "";
  capacityGb: string;
  storageLocation: string;
}

export function recordsToValues(s: Pick<CctvSetup, "retentionDays" | "storage"> | undefined): RecordsFormValues {
  return {
    retentionDays: s?.retentionDays != null ? String(s.retentionDays) : "",
    storageMedium: s?.storage?.medium ?? "",
    capacityGb: s?.storage ? String(s.storage.capacityGb) : "",
    storageLocation: s?.storage?.location ?? "",
  };
}

export function validateRecords(v: RecordsFormValues): Validated<RecordsFormValues, { retentionDays: number; storage: CctvStorage }> {
  const e: Errors<RecordsFormValues> = {};
  const days = Number(v.retentionDays);
  if (!v.retentionDays.trim()) e.retentionDays = "Enter how many days footage is kept.";
  else if (!Number.isInteger(days)) e.retentionDays = "Enter a whole number of days.";
  else if (days < RETENTION_MIN_DAYS) e.retentionDays = `Footage must be kept for at least ${RETENTION_MIN_DAYS} days. ${days} day${days === 1 ? " is" : "s are"} not enough.`;
  else if (days > RETENTION_MAX_DAYS) e.retentionDays = `Enter no more than ${RETENTION_MAX_DAYS} days.`;
  if (!v.storageMedium) e.storageMedium = "Select where footage is recorded.";
  const gb = Number(v.capacityGb);
  if (!v.capacityGb.trim()) e.capacityGb = "Enter the storage capacity in GB.";
  else if (!Number.isFinite(gb) || gb <= 0) e.capacityGb = "Enter a capacity greater than 0 GB.";
  else if (gb > 100_000) e.capacityGb = "Enter the capacity in GB, no more than 1,00,000.";
  const where = v.storageLocation.trim();
  if (!where) e.storageLocation = "Enter where the recorder or storage is kept.";
  else if (where.length > 120) e.storageLocation = "Keep this to 120 characters.";
  if (Object.keys(e).length) return { ok: false, errors: e };
  return { ok: true, value: { retentionDays: days, storage: { medium: v.storageMedium as CctvStorage["medium"], capacityGb: gb, location: where } } };
}

/* ── monthly uptime declaration ──────────────────────────────────────────── */

export interface UptimeFormValues {
  /** `yyyy-mm`. */
  month: string;
  uptimePercent: string;
  outages: CctvOutage[];
  declaredBy: string;
  designation: string;
  confirmed: boolean;
}

export const EMPTY_UPTIME: UptimeFormValues = { month: "", uptimePercent: "", outages: [], declaredBy: "", designation: "", confirmed: false };

/** `yyyy-mm` of the month `offset` months from the one `now` falls in. */
export function monthKey(now: Date, offset = 0): string {
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** The completed months a declaration may be made for: the last twelve, newest first. */
export function declarableMonths(now: Date): string[] {
  return Array.from({ length: 12 }, (_, i) => monthKey(now, -(i + 1)));
}

export type UptimeErrors = Errors<UptimeFormValues> & { outageErrors?: Record<number, Partial<Record<keyof CctvOutage, string>>> };

export function validateUptime(
  v: UptimeFormValues,
  now: Date = new Date(),
): { ok: true; value: Omit<CctvUptimeDeclaration, "declaredAt"> } | { ok: false; errors: UptimeErrors } {
  const e: UptimeErrors = {};
  if (!v.month) e.month = "Select the month being declared.";
  else if (!/^\d{4}-\d{2}$/.test(v.month)) e.month = "Select a month from the list.";
  else if (v.month >= monthKey(now)) e.month = "A month can be declared only once it has ended.";
  const pct = Number(v.uptimePercent);
  if (!v.uptimePercent.trim()) e.uptimePercent = "Enter the uptime for the month.";
  else if (!Number.isFinite(pct) || pct < 0 || pct > 100) e.uptimePercent = "Enter a percentage from 0 to 100.";
  else if (!/^\d{1,3}(\.\d)?$/.test(v.uptimePercent.trim())) e.uptimePercent = "Enter the percentage to one decimal place at most.";
  else if (pct < 100 && v.outages.length === 0) e.uptimePercent = "Uptime below 100% needs the outage that caused it. Add the outage below.";
  else if (pct === 100 && v.outages.length > 0) e.uptimePercent = "Uptime of 100% means there was no outage. Remove the outages or correct the uptime.";

  const outageErrors: NonNullable<UptimeErrors["outageErrors"]> = {};
  v.outages.forEach((o, i) => {
    const oe: Partial<Record<keyof CctvOutage, string>> = {};
    const inMonth = (d: string) => !v.month || d.slice(0, 7) === v.month;
    if (!o.from) oe.from = "Enter the date the outage began.";
    else if (!isDate(o.from)) oe.from = "Enter the date as dd/mm/yyyy.";
    else if (!inMonth(o.from)) oe.from = "The outage must fall within the month being declared.";
    if (!o.to) oe.to = "Enter the date the outage ended.";
    else if (!isDate(o.to)) oe.to = "Enter the date as dd/mm/yyyy.";
    else if (!inMonth(o.to)) oe.to = "The outage must fall within the month being declared.";
    else if (o.from && isDate(o.from) && o.to < o.from) oe.to = "The end date cannot be before the start date.";
    if (!o.reason.trim()) oe.reason = "State the reason for the outage.";
    else if (o.reason.trim().length < 5) oe.reason = "Describe the reason in at least 5 characters.";
    if (Object.keys(oe).length) outageErrors[i] = oe;
  });
  if (Object.keys(outageErrors).length) e.outageErrors = outageErrors;

  if (!v.declaredBy.trim()) e.declaredBy = "Enter the name of the authorised person.";
  if (!v.designation.trim()) e.designation = "Enter the authorised person's designation.";
  if (!v.confirmed) e.confirmed = "Confirm the declaration.";
  if (Object.keys(e).length) return { ok: false, errors: e };
  return {
    ok: true,
    value: {
      month: v.month,
      uptimePercent: pct,
      outages: v.outages.map((o) => ({ from: o.from, to: o.to, reason: o.reason.trim() })),
      declaredBy: v.declaredBy.trim(),
      designation: v.designation.trim(),
    },
  };
}

/** Add or replace one month's declaration, newest month first. */
export function withDeclaration(list: readonly CctvUptimeDeclaration[] | undefined, d: CctvUptimeDeclaration): CctvUptimeDeclaration[] {
  return [d, ...(list ?? []).filter((x) => x.month !== d.month)].sort((a, b) => b.month.localeCompare(a.month));
}

/* ── coverage and compliance ─────────────────────────────────────────────── */

export type AreaCoverage = "covered" | "not-working" | "uncovered";

export interface CoverageRow {
  id: CctvAreaId;
  label: string;
  status: AreaCoverage;
  /** Cameras registered against this area, working or not. */
  cameras: number;
}

/**
 * Which mandated areas a register covers. An area is covered only by a WORKING camera: a camera
 * that is registered and broken watches nothing, and saying "covered" would hide the gap.
 */
export function coverageOf(cameras: readonly CctvCamera[] | undefined): CoverageRow[] {
  return CCTV_AREAS.map(({ id, label }) => {
    const own = (cameras ?? []).filter((c) => c.area === id);
    const status: AreaCoverage = own.some((c) => c.working) ? "covered" : own.length ? "not-working" : "uncovered";
    return { id, label, status, cameras: own.length };
  });
}

/**
 * The month whose declaration is the latest one due on `now`. On 7 September the July declaration
 * is the latest due; from 8 September, August's.
 */
export function dueDeclarationMonth(now: Date): string {
  return monthKey(now, now.getDate() > DECLARATION_DUE_DAY ? -1 : -2);
}

export type CctvStatus = "not-configured" | "no-cameras" | "action-needed" | "compliant";

export const CCTV_STATUS_LABEL: Record<CctvStatus, string> = {
  "not-configured": "Not Configured",
  "no-cameras": "No Cameras Registered",
  "action-needed": "Action Needed",
  compliant: "Compliant",
};

export const CCTV_STATUS_TONE: Record<CctvStatus, "success" | "warning" | "danger" | "neutral"> = {
  "not-configured": "neutral",
  "no-cameras": "warning",
  "action-needed": "danger",
  compliant: "success",
};

export interface CctvCompliance {
  status: CctvStatus;
  coverage: CoverageRow[];
  covered: number;
  /** Mandated areas with no working camera. */
  gaps: CoverageRow[];
  certificate: "uploaded" | "missing";
  retention: "met" | "short" | "not-stated";
  latestDeclaration?: CctvUptimeDeclaration;
  /** The month whose declaration is due now, `yyyy-mm`. */
  dueMonth: string;
  /** Every owed month, from registration to `dueMonth`, with no declaration filed. */
  missingMonths: string[];
  declarationOverdue: boolean;
  /** Each failing requirement, one short sentence each, in the order an officer checks them. */
  flags: string[];
}

/** `yyyy-mm` months from `from` to `to`, inclusive. */
function monthsBetween(from: string, to: string): string[] {
  const out: string[] = [];
  let [y, m] = from.split("-").map(Number) as [number, number];
  for (let guard = 0; guard < 240; guard++) {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    if (key > to) break;
    out.push(key);
    m += 1;
    if (m > 12) { m = 1; y += 1; }
  }
  return out;
}

const monthName = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][(m ?? 1) - 1]} ${y}`;
};
export { monthName as cctvMonthLabel };

/**
 * One project's CCTV compliance — the single reading behind the NGO's summary, the officer's
 * compliance view and every badge. A declaration is owed only for a month that ended after the
 * setup was registered.
 */
export function cctvCompliance(setup: CctvSetup | undefined, now: Date = new Date()): CctvCompliance {
  const coverage = coverageOf(setup?.cameraRegister);
  const gaps = coverage.filter((c) => c.status !== "covered");
  const dueMonth = dueDeclarationMonth(now);
  const latestDeclaration = [...(setup?.uptime ?? [])].sort((a, b) => b.month.localeCompare(a.month))[0];
  const certificate = setup?.certificate ? "uploaded" : "missing";
  const retention = setup?.retentionDays == null ? "not-stated" : setup.retentionDays >= RETENTION_MIN_DAYS ? "met" : "short";
  const registered = setup ? setup.savedAt.slice(0, 7) : "";
  const owesDeclaration = !!setup?.cameraRegister?.length && registered <= dueMonth;
  // Every month owed, not only the latest: filing August must not make a skipped July disappear.
  const filed = new Set((setup?.uptime ?? []).map((d) => d.month));
  const missingMonths = owesDeclaration ? monthsBetween(registered, dueMonth).filter((m) => !filed.has(m)) : [];
  const declarationOverdue = missingMonths.length > 0;
  const base = { coverage, covered: coverage.length - gaps.length, gaps, certificate, retention, latestDeclaration, dueMonth, missingMonths, declarationOverdue } as const;

  if (!setup) return { ...base, status: "not-configured", flags: [] };
  // No flag sentence: the status itself says it, and a sentence under the badge would say it twice.
  if (!setup.cameraRegister?.length) return { ...base, status: "no-cameras", flags: [] };

  const flags: string[] = [];
  const uncovered = gaps.filter((g) => g.status === "uncovered");
  const broken = gaps.filter((g) => g.status === "not-working");
  if (uncovered.length) flags.push(`${uncovered.length} of ${coverage.length} mandated areas have no camera: ${uncovered.map((g) => g.label).join(", ")}.`);
  if (broken.length) flags.push(`Camera not working in ${broken.map((g) => g.label).join(", ")}.`);
  if (certificate === "missing") flags.push("Installation certificate not uploaded.");
  if (retention === "not-stated") flags.push("Footage retention period not stated.");
  if (retention === "short") flags.push(`Footage kept for ${setup.retentionDays} days, below the ${RETENTION_MIN_DAYS}-day minimum.`);
  if (declarationOverdue) {
    flags.push(missingMonths.length === 1
      ? `Uptime declaration for ${monthName(missingMonths[0]!)} not filed.`
      : `Uptime declarations not filed for ${missingMonths.length} months: ${missingMonths.map(monthName).join(", ")}.`);
  }
  return { ...base, status: flags.length ? "action-needed" : "compliant", flags };
}

/* ── seed ─────────────────────────────────────────────────────────────────── */

/**
 * A worked CCTV record for the demo, one of five stories: fully compliant, partial coverage,
 * certificate missing, declaration overdue, retention too short. Deterministic.
 *
 * Declarations are dated early in the month after the one declared, on the calendar rather than
 * the seed clock, because whether one is overdue is read against today.
 */
export function seedCctvDetail(setup: CctvSetup, story: 0 | 1 | 2 | 3 | 4): CctvSetup {
  const installed = setup.savedAt.slice(0, 10);
  const all: [CctvAreaId, string, CctvCamera["placement"]][] = [
    ["entrance", "Main gate, facing the entrance", "Outdoor"],
    ["corridors", "Ground-floor corridor", "Indoor"],
    ["corridors", "First-floor corridor", "Indoor"],
    ["dining", "Dining hall, north wall", "Indoor"],
    ["common", "Recreation room", "Indoor"],
    ["kitchen", "Kitchen, above the serving counter", "Indoor"],
    ["office", "Office and records room", "Indoor"],
    ["perimeter", "Rear boundary wall", "Outdoor"],
  ];
  const keep = story === 1 ? all.filter(([a]) => a !== "dining" && a !== "kitchen") : all;
  const cameraRegister: CctvCamera[] = keep.map(([area, location, placement], i) => ({
    id: `cam-${setup.projectId}-${i + 1}`,
    location,
    area,
    placement,
    recording: placement === "Outdoor" ? "Motion-Activated" : "Continuous",
    nightVision: placement === "Outdoor",
    installedOn: installed,
    // The partial story also has its only recreation-room camera out of order.
    working: !(story === 1 && area === "common"),
  }));
  // Every month owed since registration is declared, newest first; the overdue story stops at June.
  const months = monthsBetween(setup.savedAt.slice(0, 7), "2026-08").reverse().filter((m) => story !== 3 || m <= "2026-06");
  const uptime: CctvUptimeDeclaration[] = months.map((month, i) => {
    const [y, m] = month.split("-").map(Number) as [number, number];
    const next = new Date(Date.UTC(y, m, 3 + i, 5, 30)).toISOString();
    const outage = i === 1;
    return {
      month,
      uptimePercent: outage ? 97.4 : 100,
      outages: outage ? [{ from: `${month}-14`, to: `${month}-15`, reason: "Power supply interrupted; recorder restarted after repair." }] : [],
      declaredBy: setup.contactName ?? "Project In-charge",
      designation: "Superintendent",
      declaredAt: next,
    };
  });
  return {
    ...setup,
    cameras: cameraRegister.length,
    cameraRegister,
    ...(story === 2 ? {} : { certificate: { fileName: "cctv-installation-certificate.pdf", sizeKb: 412, uploadedAt: `${installed}T08:00:00.000Z` } }),
    retentionDays: story === 4 ? 15 : 30,
    storage: { medium: "Network Video Recorder (NVR)", capacityGb: 2000, location: "Office and records room, locked cabinet" },
    uptime,
  };
}
