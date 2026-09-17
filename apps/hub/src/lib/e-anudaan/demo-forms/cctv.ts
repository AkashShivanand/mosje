/**
 * The CCTV module of one project (`/ngo/cctv?project=<Project ID>`): the camera register, the
 * installation certificate, footage retention and storage, and the monthly uptime declaration.
 * Every rule is in `lib/e-anudaan/cctv.ts` (`validateCamera`, `validateRecords`, `validateUptime`)
 * or the certificate picker's type and size check; `cctv.test.ts` beside this file proves the
 * correct fill passes and each rule preset trips exactly one rule, and no two trip the same one.
 *
 * Values are strings, as every preset's are. Dates that move with the calendar are tokens the
 * resolvers below turn into dates: `{tomorrow}` for an installation date; for an outage, a day of
 * the declared month ("12"), or `before:28` / `after:2` for a day of the month before or after it.
 *
 * Rules a person cannot reach from the screen have no preset: a month not yet ended (the month list
 * holds only ended months) and a malformed outage date (the date picker writes only real dates).
 */

import { EMPTY_CAMERA, EMPTY_UPTIME, monthKey, type CameraFormValues, type RecordsFormValues, type UptimeFormValues } from "../cctv.ts";
import type { DemoFormDef } from "./index.ts";

const PATH = /^\/ngo\/cctv\/?$/;

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* ── camera ──────────────────────────────────────────────────────────────── */

const camera = {
  location: "Main gate, facing the entrance",
  area: "entrance",
  placement: "Outdoor",
  recording: "Continuous",
  nightVision: "Yes",
  installedOn: "2026-04-10",
  working: "Working",
};

export function cameraValuesOf(v: Readonly<Record<string, string>>, now: Date = new Date()): CameraFormValues {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return {
    ...EMPTY_CAMERA,
    location: v.location ?? "",
    area: (v.area ?? "") as CameraFormValues["area"],
    placement: (v.placement ?? "") as CameraFormValues["placement"],
    recording: (v.recording ?? "") as CameraFormValues["recording"],
    nightVision: (v.nightVision ?? "") as CameraFormValues["nightVision"],
    installedOn: v.installedOn === "{tomorrow}" ? iso(tomorrow) : (v.installedOn ?? ""),
    working: (v.working ?? "") as CameraFormValues["working"],
  };
}

export const CCTV_CAMERA: DemoFormDef = {
  id: "cctv-camera",
  title: "Register Camera",
  path: PATH,
  presets: [
    { id: "valid", label: "Correct Camera", valid: true, values: camera },
    { id: "no-location", label: "Location Left Out", values: { ...camera, location: "" } },
    { id: "privacy", label: "Location Where Cameras Are Not Allowed", values: { ...camera, location: "Ground-floor washroom passage" } },
    { id: "short-location", label: "Location Too Short", values: { ...camera, location: "Gt" } },
    {
      id: "long-location",
      label: "Location Too Long",
      values: { ...camera, location: "Main gate on Magarpatta Road, mounted on the left pillar and facing the entrance, the visitors' register and the ramp" },
    },
    { id: "no-area", label: "Coverage Area Not Chosen", values: { ...camera, area: "" } },
    { id: "no-placement", label: "Indoor or Outdoor Not Chosen", values: { ...camera, placement: "" } },
    { id: "no-recording", label: "Recording Not Chosen", values: { ...camera, recording: "" } },
    { id: "no-night", label: "Night Vision Not Chosen", values: { ...camera, nightVision: "" } },
    { id: "no-installed", label: "Installation Date Left Out", values: { ...camera, installedOn: "" } },
    { id: "bad-installed", label: "Installation Date Not a Date", values: { ...camera, installedOn: "10/04/2026" } },
    { id: "future-installed", label: "Installation Date in the Future", values: { ...camera, installedOn: "{tomorrow}" } },
    { id: "no-working", label: "Working Status Not Chosen", values: { ...camera, working: "" } },
  ],
};

/* ── installation certificate ────────────────────────────────────────────── */

/** The file a certificate preset chooses, as the picker would hand it over. */
export function certificateFileOf(v: Readonly<Record<string, string>>): { name: string; type: string; size: number } {
  return { name: v.fileName ?? "", type: v.fileType ?? "", size: Number(v.sizeKb ?? "0") * 1024 };
}

const certificate = { fileName: "cctv-installation-certificate.pdf", fileType: "application/pdf", sizeKb: "1240" };

export const CCTV_CERTIFICATE: DemoFormDef = {
  id: "cctv-certificate",
  title: "CCTV Installation Certificate",
  path: PATH,
  presets: [
    { id: "valid", label: "Correct Certificate", valid: true, values: certificate },
    {
      id: "wrong-type",
      label: "Not a PDF, JPG or PNG",
      values: { fileName: "cctv-installation-certificate.docx", fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", sizeKb: "86" },
    },
    { id: "too-large", label: "Larger Than 5 MB", values: { ...certificate, sizeKb: "7400" } },
  ],
};

/* ── retention and storage ───────────────────────────────────────────────── */

const records = {
  retentionDays: "45",
  storageMedium: "Network Video Recorder (NVR)",
  capacityGb: "2000",
  storageLocation: "Office, locked cabinet beside the Superintendent's desk",
};

export function recordsValuesOf(v: Readonly<Record<string, string>>): RecordsFormValues {
  return {
    retentionDays: v.retentionDays ?? "",
    storageMedium: (v.storageMedium ?? "") as RecordsFormValues["storageMedium"],
    capacityGb: v.capacityGb ?? "",
    storageLocation: v.storageLocation ?? "",
  };
}

export const CCTV_RECORDS: DemoFormDef = {
  id: "cctv-records",
  title: "Retention and Storage",
  path: PATH,
  presets: [
    { id: "valid", label: "Correct Retention and Storage", valid: true, values: records },
    { id: "no-retention", label: "Retention Left Out", values: { ...records, retentionDays: "" } },
    { id: "fraction", label: "Retention Not a Whole Number", values: { ...records, retentionDays: "30.5" } },
    { id: "below-minimum", label: "Retention Below 30 Days", values: { ...records, retentionDays: "15" } },
    { id: "above-maximum", label: "Retention Above 365 Days", values: { ...records, retentionDays: "400" } },
    { id: "no-medium", label: "Recorded On Not Chosen", values: { ...records, storageMedium: "" } },
    { id: "no-capacity", label: "Capacity Left Out", values: { ...records, capacityGb: "" } },
    { id: "zero-capacity", label: "Capacity of 0 GB", values: { ...records, capacityGb: "0" } },
    { id: "huge-capacity", label: "Capacity Above 1,00,000 GB", values: { ...records, capacityGb: "150000" } },
    { id: "no-location", label: "Recorder's Place Left Out", values: { ...records, storageLocation: "" } },
    {
      id: "long-location",
      label: "Recorder's Place Too Long",
      values: {
        ...records,
        storageLocation:
          "Office on the ground floor of Sankalp Seniors' Home, in the locked steel cabinet beside the Superintendent's desk, behind the records almirah",
      },
    },
  ],
};

/* ── monthly uptime declaration ──────────────────────────────────────────── */

const uptime = {
  month: "last",
  uptimePercent: "96.7",
  outage: "yes",
  from: "12",
  to: "12",
  reason: "Power cut in Hadapsar; the recorder's backup battery ran down.",
  declaredBy: "Anil Kulkarni",
  designation: "Superintendent",
  confirmed: "yes",
};

/** A day token in the declared month, or the month either side of it. */
function dayOf(token: string, month: string): string {
  if (!token) return "";
  const [y, m] = month.split("-").map(Number) as [number, number];
  const [, shift, day] = /^(?:(before|after):)?(\d{1,2})$/.exec(token) ?? [];
  if (!day) return token;
  const offset = shift === "before" ? -1 : shift === "after" ? 1 : 0;
  return iso(new Date(y, m - 1 + offset, Number(day)));
}

export function uptimeValuesOf(v: Readonly<Record<string, string>>, now: Date = new Date()): UptimeFormValues {
  const month = v.month === "last" ? monthKey(now, -1) : "";
  // Outage days are placed in the month the preset declares, even when it names none.
  const dayMonth = monthKey(now, -1);
  return {
    ...EMPTY_UPTIME,
    month,
    uptimePercent: v.uptimePercent ?? "",
    outages: v.outage === "yes" ? [{ from: dayOf(v.from ?? "", dayMonth), to: dayOf(v.to ?? "", dayMonth), reason: v.reason ?? "" }] : [],
    declaredBy: v.declaredBy ?? "",
    designation: v.designation ?? "",
    confirmed: v.confirmed === "yes",
  };
}

export const CCTV_UPTIME: DemoFormDef = {
  id: "cctv-uptime",
  title: "Declare Monthly Uptime",
  path: PATH,
  presets: [
    { id: "valid", label: "Correct Declaration", valid: true, values: uptime },
    { id: "no-month", label: "Month Not Chosen", values: { ...uptime, month: "" } },
    { id: "no-uptime", label: "Uptime Left Out", values: { ...uptime, uptimePercent: "" } },
    { id: "out-of-range", label: "Uptime Above 100%", values: { ...uptime, uptimePercent: "104" } },
    { id: "two-decimals", label: "Uptime to Two Decimal Places", values: { ...uptime, uptimePercent: "96.75" } },
    { id: "no-outage", label: "Uptime Below 100% With No Outage", values: { ...uptime, outage: "" } },
    { id: "full-with-outage", label: "Uptime of 100% With an Outage", values: { ...uptime, uptimePercent: "100" } },
    { id: "no-from", label: "Outage Start Left Out", values: { ...uptime, from: "" } },
    { id: "from-outside", label: "Outage Starts Before the Month", values: { ...uptime, from: "before:28" } },
    { id: "no-to", label: "Outage End Left Out", values: { ...uptime, to: "" } },
    { id: "to-outside", label: "Outage Ends After the Month", values: { ...uptime, to: "after:2" } },
    { id: "to-before-from", label: "Outage Ends Before It Began", values: { ...uptime, from: "13", to: "12" } },
    { id: "no-reason", label: "Outage Reason Left Out", values: { ...uptime, reason: "" } },
    { id: "short-reason", label: "Outage Reason Too Short", values: { ...uptime, reason: "UPS" } },
    { id: "no-declared-by", label: "Declared By Left Out", values: { ...uptime, declaredBy: "" } },
    { id: "no-designation", label: "Designation Left Out", values: { ...uptime, designation: "" } },
    { id: "not-confirmed", label: "Declaration Not Confirmed", values: { ...uptime, confirmed: "" } },
  ],
};

