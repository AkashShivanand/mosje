/**
 * Programme figures broken down by State/UT and by district.
 *
 * The dashboard already draws a state heat map and a top-twelve list; these are
 * the FULL registers behind the two geography screens, where every State/UT
 * appears — including the ones reporting nothing, which is a finding in itself
 * and the reason a zero row is kept rather than filtered out.
 */
import { STATE_DISTRIBUTION } from "./mock-data";
import { STATES } from "./states";

export interface GeoRow {
  key: string;
  state: string;
  /** Absent on a state row. */
  district?: string;
  identified: number;
  mobilised: number;
  rehabilitated: number;
}

const identifiedFor = new Map(STATE_DISTRIBUTION.map((s) => [s.state, s.count]));

/** Every State/UT, in the register's own alphabetical order. */
export const STATE_ROWS: GeoRow[] = STATES.map((s, i) => {
  const identified = identifiedFor.get(s.name) ?? 0;
  // Mobilised runs at roughly a third of identified, rehabilitation a little
  // under that — derived, not invented separately, so the three columns cannot
  // contradict each other the way three independent fixtures would.
  const mobilised = identified === 0 ? 0 : Math.round(identified * (0.24 + ((s.id * 7) % 21) / 100));
  const rehabilitated = mobilised === 0 ? 0 : Math.max(0, mobilised - ((s.id + i) % 4));
  return { key: s.name, state: s.name, identified, mobilised, rehabilitated };
});

const DISTRICTS: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Mumbai Suburban", "Thane", "Pune", "Nagpur", "Nashik"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Karnataka: ["Bengaluru Urban", "Mysuru", "Mangaluru", "Dharwad"],
  Delhi: ["New Delhi", "South Delhi", "East Delhi", "North Delhi"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Ernakulam"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur Dehat", "Gautam Budh Nagar", "Agra"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior"],
  Bihar: ["Patna", "Gaya", "Nalanda"],
  Assam: ["Cachar", "Dibrugarh", "Golaghat"],
  Rajasthan: ["Jaipur", "Jodhpur"],
  "West Bengal": ["Kolkata", "Howrah"],
};

/** Districts, for the states the programme publishes district figures for. */
export const DISTRICT_ROWS: GeoRow[] = Object.entries(DISTRICTS).flatMap(([state, districts]) => {
  const parent = STATE_ROWS.find((r) => r.state === state);
  if (!parent) return [];
  const weights = districts.map((_, i) => 3 + ((i * 5) % 7));
  const total = weights.reduce((a, b) => a + b, 0);
  return districts.map((district, i) => {
    // The district figures SUM to the state's, so a reader cannot find the two
    // screens disagreeing about the same state.
    const share = weights[i]! / total;
    const identified = i === districts.length - 1
      ? parent.identified - districts.slice(0, -1).reduce((a, _, j) => a + Math.round(parent.identified * (weights[j]! / total)), 0)
      : Math.round(parent.identified * share);
    const mobilised = i === districts.length - 1
      ? parent.mobilised - districts.slice(0, -1).reduce((a, _, j) => a + Math.round(parent.mobilised * (weights[j]! / total)), 0)
      : Math.round(parent.mobilised * share);
    const rehabilitated = i === districts.length - 1
      ? parent.rehabilitated - districts.slice(0, -1).reduce((a, _, j) => a + Math.round(parent.rehabilitated * (weights[j]! / total)), 0)
      : Math.round(parent.rehabilitated * share);
    return {
      key: `${state}|${district}`,
      state,
      district,
      identified: Math.max(0, identified),
      mobilised: Math.max(0, mobilised),
      rehabilitated: Math.max(0, rehabilitated),
    };
  });
});

/**
 * States that publish district figures, ordered by how many beneficiaries each
 * has identified — NOT alphabetically.
 *
 * Alphabetical put Assam first, and Assam has reported nothing, so the district
 * screen opened on a register of zeros and read as broken before a reader had
 * touched it. The state with the most to show leads.
 */
export const DISTRICT_STATES = Object.keys(DISTRICTS).sort((a, b) => {
  const of = (n: string) => STATE_ROWS.find((r) => r.state === n)?.identified ?? 0;
  return of(b) - of(a) || a.localeCompare(b);
});

export function totals(rows: GeoRow[]) {
  return rows.reduce(
    (a, r) => ({
      identified: a.identified + r.identified,
      mobilised: a.mobilised + r.mobilised,
      rehabilitated: a.rehabilitated + r.rehabilitated,
    }),
    { identified: 0, mobilised: 0, rehabilitated: 0 },
  );
}
