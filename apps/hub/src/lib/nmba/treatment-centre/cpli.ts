// CPLI helpers — deterministic synthetic rosters & training records for the
// peer-educator demo. Pure functions (no Date.now / Math.random) so a given
// educator always renders the same volunteers and training history across
// re-opens of the "View" dialogs within a session.

import type { PeerEducator, Volunteer, TrainingRecord } from "./types";

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
    age: 18 + (seed % 25), // 18–42 years
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

// ---------------------------------------------------------------------------
// Training helpers — fields match the live NMBA portal
// (Date · No. of volunteers attended · Location · Details & Outcomes · Remarks)
// ---------------------------------------------------------------------------

const TRAINING_LOCATIONS = [
  "Community Health Centre, Vasant Kunj",
  "NMBA Regional Office, New Delhi",
  "District Hospital, Rohini",
  "Primary Health Centre, Laxmi Nagar",
  "NGO Training Hall, Janakpuri",
  "Block Resource Centre, Dwarka",
  "Civil Hospital, Sadar Bazar",
];

const TRAINING_DETAILS = [
  "Session on substance use identification and early intervention counselling techniques for field-level peer educators.",
  "Hands-on community outreach mapping and Nasha Mukt Bharat campaign coordination workshop.",
  "Overdose response protocols and naloxone administration awareness programme for CPLI volunteers.",
  "Peer support group facilitation techniques and relapse prevention strategies training.",
  "Record-keeping systems, data entry procedures, and beneficiary follow-up best practices.",
  "Refresher training on CPLI data collection tools and beneficiary registration process.",
];

const TRAINING_REMARKS = [
  "Refresher session. All attendees cleared the assessment.",
  "Field visit component included. Transport arranged by district office.",
  "Ministry resource team facilitated. Resource materials distributed.",
  "Practical demonstration by district health officer.",
  "Follow-up quiz conducted. 92% participants scored above passing threshold.",
  "Certificates of participation issued to all attendees.",
];

const PHOTO_COLORS = ["#0373df", "#1a6b3c", "#c45a1a", "#5e3ea1", "#00796b", "#7a2e2e"];

/** Deterministic SVG data-URL standing in for an uploaded training photo. */
function syntheticPhoto(seed: number): string {
  const c = PHOTO_COLORS[seed % PHOTO_COLORS.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='60'><rect width='80' height='60' fill='${c}'/><rect x='14' y='12' width='52' height='36' rx='3' fill='white' fill-opacity='0.15'/><circle cx='40' cy='29' r='10' fill='white' fill-opacity='0.35'/><circle cx='40' cy='29' r='5' fill='white' fill-opacity='0.55'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** 1–3 deterministic synthetic photo data-URLs for a training record. */
function syntheticPhotos(seed: number): string[] {
  const count = 1 + (seed % 3); // 1, 2, or 3 photos
  return Array.from({ length: count }, (_, i) => syntheticPhoto(seed + i * 7));
}

/**
 * Resolve the training history for an educator. If records have been added/
 * edited this session they are used as-is; otherwise a stable synthetic list
 * of 2–3 sessions is generated from the educator id.
 */
export function trainingFor(educator: PeerEducator): TrainingRecord[] {
  if (educator.trainings && educator.trainings.length > 0) return educator.trainings;

  const seed = hash(educator.id);
  const count = 2 + (seed % 2); // 2 or 3 sessions
  return Array.from({ length: count }, (_, i) => {
    const s = hash(`${educator.id}~t${i}`);
    return {
      id: `${educator.id}-tr${i}`,
      date: joinedFor(s),
      numberOfVolunteers: 5 + (s % 20), // 5–24 attendees
      location: TRAINING_LOCATIONS[s % TRAINING_LOCATIONS.length] ?? "",
      detailsAndOutcomes: TRAINING_DETAILS[s % TRAINING_DETAILS.length] ?? "",
      remarks: s % 4 !== 2 ? (TRAINING_REMARKS[s % TRAINING_REMARKS.length] ?? "") : undefined,
      photoUrls: syntheticPhotos(s),
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
}
