// Realistic multi-state demo seed so Admin / State views and the reports +
// coverage panels look alive across the country.
//
// Deliberate gaps for the live demo:
//   · Maharashtra STATE committee is NOT seeded → the demo State Nodal Officer
//     (Maharashtra) always lands on the registration flow.
//   · Pune DISTRICT committee is NOT seeded → the demo District Nodal Officer
//     (Pune) always lands on the registration flow.
//   Their child data (other MH districts, Pune blocks) IS seeded so those pages
//   are populated. Use "Reset demo data" (account menu) to restore this baseline.
//
// Uploaded-file bytes are absent (blobUrl null) — illustrative "already on file".

import type { CommitteeRecord, MeetingMinute, UploadedFile } from "./types";
import { DESIGNATIONS } from "./masters";

const STATE_NAME = "State-Level Steering & Monitoring Committee";
const DISTRICT_NAME = "District-Level Drug Demand Reduction Committee";
const BLOCK_NAME = "Block-Level Drug Demand Reduction Committee";

function file(name: string): UploadedFile {
  return { name, sizeBytes: 380_000, mime: "application/pdf", blobUrl: null };
}
function minute(committeeId: string, committeeName: string, meetingDate: string, name: string): MeetingMinute {
  return { id: `${committeeId}-m-${meetingDate}`, committeeId, committeeName, meetingDate, file: file(name) };
}
function slug(...parts: string[]): string {
  return parts.join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function state(
  st: string,
  chiefSecretaryName: string,
  memberSecretaryName: string,
  nodalDepartment: string,
  formationDate: string,
  memberCount: number,
  minutes: { date: string; file: string }[] = [],
): CommitteeRecord {
  const id = slug("st", st);
  return {
    id,
    tier: "STATE",
    state: st,
    chiefSecretaryName,
    memberSecretaryName,
    memberSecretaryDesignation: "Secretary, Social Justice / Social Welfare Dept.",
    nodalDepartment,
    formationDate,
    memberCount,
    notification: file(`${slug(st)}-state-committee-notification.pdf`),
    minutes: minutes.map((m) => minute(id, STATE_NAME, m.date, m.file)),
    createdBy: "seed",
    createdAt: `${formationDate}T09:00:00.000Z`,
  };
}

function district(
  st: string,
  dist: string,
  chairpersonName: string,
  memberSecretaryName: string,
  formationDate: string,
  memberCount: number,
  minutes: { date: string; file: string }[] = [],
): CommitteeRecord {
  const id = slug("dt", st, dist);
  return {
    id,
    tier: "DISTRICT",
    state: st,
    district: dist,
    chairpersonName,
    chairpersonDesignation: DESIGNATIONS.districtChairperson,
    memberSecretaryName,
    memberSecretaryDesignation: DESIGNATIONS.districtMemberSecretary,
    nodalDepartment: `District Social Welfare Office, ${dist}`,
    formationDate,
    memberCount,
    notification: file(`${slug(dist)}-district-committee-notification.pdf`),
    minutes: minutes.map((m) => minute(id, DISTRICT_NAME, m.date, m.file)),
    createdBy: "seed",
    createdAt: `${formationDate}T09:00:00.000Z`,
  };
}

function block(
  st: string,
  dist: string,
  blk: string,
  chairpersonName: string,
  formationDate: string,
  memberCount: number,
  minutes: { date: string; file: string }[] = [],
): CommitteeRecord {
  const id = slug("bk", st, dist, blk);
  return {
    id,
    tier: "BLOCK",
    state: st,
    district: dist,
    block: blk,
    chairpersonName,
    chairpersonDesignation: DESIGNATIONS.blockChairperson,
    formationDate,
    memberCount,
    notification: file(`${slug(blk)}-block-committee-notification.pdf`),
    minutes: minutes.map((m) => minute(id, BLOCK_NAME, m.date, m.file)),
    createdBy: "seed",
    createdAt: `${formationDate}T09:00:00.000Z`,
  };
}

export const SEED_COMMITTEES: CommitteeRecord[] = [
  // ── State committees (7 States/UTs; Maharashtra intentionally absent) ──────
  state("Punjab", "Sh. K.A.P. Sinha", "Sh. Gurkirat Kirpal Singh", "Dept. of Social Security, Women & Child Development", "2025-07-30", 20, [
    { date: "2025-09-12", file: "punjab-state-mom-sep2025.pdf" },
    { date: "2025-11-20", file: "punjab-state-mom-nov2025.pdf" },
  ]),
  state("Karnataka", "Smt. Shalini Rajneesh", "Sh. Ravi Kumar", "Dept. of Social Welfare", "2025-08-05", 18, [
    { date: "2025-10-03", file: "karnataka-state-mom-oct2025.pdf" },
  ]),
  state("Tamil Nadu", "Sh. N. Muruganandam", "Smt. Kavitha R.", "Dept. of Social Welfare & Women Empowerment", "2025-08-11", 22),
  state("Uttar Pradesh", "Sh. Manoj Kumar Singh", "Sh. Anil Verma", "Dept. of Social Welfare", "2025-07-22", 24, [
    { date: "2025-09-28", file: "up-state-mom-sep2025.pdf" },
  ]),
  state("Gujarat", "Smt. Kamal Dayani", "Sh. Hardik Shah", "Dept. of Social Justice & Empowerment", "2025-08-18", 19),
  state("Rajasthan", "Sh. Sudhansh Pant", "Sh. Bhawani Singh", "Dept. of Social Justice & Empowerment", "2025-08-25", 17),
  state("Kerala", "Sh. Sarada Muraleedharan", "Smt. Divya S.", "Dept. of Social Justice", "2025-09-01", 16, [
    { date: "2025-11-05", file: "kerala-state-mom-nov2025.pdf" },
  ]),

  // ── District committees (Maharashtra: NOT Pune) ───────────────────────────
  district("Maharashtra", "Nagpur", "Sh. Vipin Itankar", "Smt. Rohini Kulkarni", "2025-09-05", 12, [
    { date: "2025-10-18", file: "nagpur-district-mom-oct2025.pdf" },
  ]),
  district("Maharashtra", "Nashik", "Sh. Jalaj Sharma", "Sh. D. Patil", "2025-09-14", 11),
  district("Maharashtra", "Thane", "Sh. Ashok Shingare", "Smt. M. Joshi", "2025-09-20", 13),
  district("Maharashtra", "Aurangabad", "Sh. Dilip Swami", "Sh. R. Deshmukh", "2025-09-25", 10),
  district("Punjab", "Ludhiana", "Sh. Sakshi Sawhney", "Smt. Harpreet Kaur", "2025-08-22", 14, [
    { date: "2025-10-30", file: "ludhiana-district-mom-oct2025.pdf" },
  ]),
  district("Punjab", "Amritsar", "Smt. Sakattar Singh", "Sh. Baljinder Singh", "2025-08-27", 12),
  district("Karnataka", "Bengaluru", "Sh. K. Srinivas", "Smt. Lakshmi Devi", "2025-09-02", 15),
  district("Karnataka", "Mysuru", "Sh. K.V. Rajendra", "Sh. Manjunath H.", "2025-09-09", 11),
  district("Tamil Nadu", "Chennai", "Sh. Rajesh Lakhoni", "Smt. Priya M.", "2025-09-03", 16),
  district("Tamil Nadu", "Coimbatore", "Sh. Kranthi Kumar Pati", "Sh. Senthil K.", "2025-09-16", 12),
  district("Uttar Pradesh", "Lucknow", "Sh. Suryapal Gangwar", "Smt. Anjali Singh", "2025-08-15", 18),
  district("Gujarat", "Ahmedabad", "Sh. Sandip Sagale", "Sh. Nikhil Patel", "2025-09-04", 13),
  district("Rajasthan", "Jaipur", "Sh. Jitendra Kumar Soni", "Smt. Neha Sharma", "2025-09-07", 12),

  // ── Block committees (incl. Pune blocks for the demo District officer) ─────
  block("Maharashtra", "Pune", "Mulshi", "Smt. Anjali Patil", "2025-10-01", 9, [
    { date: "2025-11-11", file: "mulshi-block-mom-nov2025.pdf" },
  ]),
  block("Maharashtra", "Pune", "Haveli", "Sh. Prakash Jadhav", "2025-10-05", 8),
  block("Maharashtra", "Nagpur", "Kamptee", "Sh. R. Meshram", "2025-09-20", 8),
  block("Punjab", "Ludhiana", "Khanna", "Sh. Gurpreet Singh", "2025-09-12", 7),
  block("Karnataka", "Mysuru", "Hunsur", "Smt. Geetha R.", "2025-09-22", 9),
  block("Tamil Nadu", "Coimbatore", "Pollachi", "Sh. Murugan S.", "2025-09-28", 8),
];
