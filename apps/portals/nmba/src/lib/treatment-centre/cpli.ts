// CPLI helpers — deterministic synthetic rosters & training records for the
// peer-educator demo. Pure functions (no Date.now / Math.random) so a given
// educator always renders the same volunteers and training history across
// re-opens of the "View" dialogs within a session.

import type { PeerEducator, Volunteer } from "./types";

/** Tiny deterministic string hash → unsigned int (FNV-1a style). */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const FIRST_NAMES = [
  "Ramesh", "Sunita", "Amit", "Priya", "Vikram", "Anjali", "Suresh", "Kavita",
  "Manoj", "Deepa", "Rahul", "Pooja", "Arjun", "Neha", "Sanjay", "Geeta",
  "Imran", "Fatima", "Joseph", "Mary", "Tenzin", "Lakshmi", "Gurpreet", "Sahil",
];
const LAST_NAMES = [
  "Kumar", "Sharma", "Patel", "Singh", "Das", "Reddy", "Nair", "Yadav",
  "Khan", "Verma", "Gupta", "Mishra", "Roy", "Pillai", "Chauhan", "Bhat",
];

/** A stable 10-digit-looking mobile number derived from the seed. */
function phoneFor(seed: number): string {
  const tail = String(1000000 + (seed % 8999999)).slice(0, 7);
  return `9${String(60 + (seed % 39))}${tail}`.slice(0, 10);
}

/** A stable ISO date within the last ~14 months, derived from the seed. */
function joinedFor(seed: number): string {
  const month = (seed % 12) + 1;
  const day = (seed % 27) + 1;
  const year = seed % 2 === 0 ? 2025 : 2026;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Build a single deterministic volunteer for an educator at index `i`. */
function volunteerFor(educatorId: string, i: number): Volunteer {
  const seed = hash(`${educatorId}#${i}`);
  const first = FIRST_NAMES[seed % FIRST_NAMES.length];
  // Unsigned shift: `hash` returns a 32-bit unsigned value, so a signed `>>`
  // could go negative and yield a negative (undefined) array index.
  const last = LAST_NAMES[(seed >>> 5) % LAST_NAMES.length];
  return {
    name: `${first} ${last}`,
    phone: phoneFor(seed),
    // ~1 in 6 volunteers shown as Inactive for a believable mix.
    status: seed % 6 === 0 ? "Inactive" : "Active",
    joinedOn: joinedFor(seed),
  };
}

/**
 * Resolve the volunteer roster to display for an educator. If real volunteers
 * have been uploaded this session they are used as-is; otherwise a stable
 * roster of `numberOfVolunteers` synthetic volunteers is generated.
 */
export function rosterFor(educator: PeerEducator): Volunteer[] {
  if (educator.volunteers && educator.volunteers.length) return educator.volunteers;
  return Array.from({ length: Math.max(0, educator.numberOfVolunteers) }, (_, i) =>
    volunteerFor(educator.id, i),
  );
}

export type TrainingRecord = {
  date: string;
  topic: string;
  duration: string;
  trainer: string;
};

const TRAINING_TOPICS = [
  { topic: "Substance Use Identification & Counselling", duration: "1 Day", trainer: "Dr. A. K. Sen" },
  { topic: "Community Outreach & Nasha Mukt Campaigning", duration: "2 Days", trainer: "Ministry Resource Team" },
  { topic: "Overdose Response & Naloxone Awareness", duration: "1 Day", trainer: "District Health Officer" },
  { topic: "Peer Support & Relapse Prevention", duration: "3 Days", trainer: "State Nodal Trainer" },
  { topic: "Record-keeping & Beneficiary Follow-up", duration: "1 Day", trainer: "NMBA Field Coordinator" },
];

/** A stable per-educator training history (2–3 sessions). */
export function trainingFor(educator: PeerEducator): TrainingRecord[] {
  const seed = hash(educator.id);
  const count = 2 + (seed % 2); // 2 or 3 sessions
  return Array.from({ length: count }, (_, i) => {
    const t = TRAINING_TOPICS[(seed + i * 3) % TRAINING_TOPICS.length];
    return { ...t, date: joinedFor(hash(`${educator.id}~t${i}`)) };
  }).sort((a, b) => a.date.localeCompare(b.date));
}
