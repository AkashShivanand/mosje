/**
 * The areas a portal reading can be split over, and the weights the ILLUSTRATIVE
 * model splits by. Nothing here is a departmental figure.
 *
 * State names follow `IndiaMap`'s spelling (`india-states.paths.ts`) so a reading can
 * be drawn on the map without a translation table.
 */

/**
 * Census 2011 population, in lakh, by State/UT — used ONLY as a weight, so a modelled
 * national total spreads in proportion to people rather than at random. Jammu and
 * Kashmir and Ladakh are split as the 2019 reorganisation drew them; Andhra Pradesh and
 * Telangana as the 2014 one did.
 */
export const POPULATION_2011_LAKH: Record<string, number> = {
  "Uttar Pradesh": 1998.12, Maharashtra: 1123.74, Bihar: 1040.99, "West Bengal": 912.76,
  "Madhya Pradesh": 726.27, "Tamil Nadu": 721.47, Rajasthan: 685.48, Karnataka: 610.95,
  Gujarat: 604.4, "Andhra Pradesh": 493.87, Odisha: 419.74, Telangana: 350.04,
  Kerala: 334.06, Jharkhand: 329.88, Assam: 312.06, Punjab: 277.43, Chhattisgarh: 255.45,
  Haryana: 253.51, Delhi: 167.88, "Jammu and Kashmir": 122.67, Uttarakhand: 100.86,
  "Himachal Pradesh": 68.65, Tripura: 36.74, Meghalaya: 29.67, Manipur: 28.56,
  Nagaland: 19.79, Goa: 14.59, "Arunachal Pradesh": 13.84, Puducherry: 12.48,
  Mizoram: 10.97, Chandigarh: 10.55, Sikkim: 6.11, "Dadra and Nagar Haveli and Daman and Diu": 5.86,
  "Andaman and Nicobar Islands": 3.81, Ladakh: 2.74, Lakshadweep: 0.64,
};

/**
 * Projected population as on 1 March 2026, in lakh — the per-person denominator.
 *
 * SOURCE: Report of the Technical Group on Population Projections, 2011-2036 (National
 * Commission on Population, MoHFW), Table 21, "Projected Total Population by Sex as on 1st
 * March" ('000), Persons, 2026 — https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf,
 * read 6 Oct 2026. India: 14,23,435 thousand; the 36 rows below sum to 14,23,437 — the
 * report rounds each row on its own.
 *
 * Why not Census 2011: a 2026 figure divided by a 2011 population overstates every rate,
 * and unevenly — Delhi has grown by a third since, Kerala by an eighth. The report prints
 * Dadra and Nagar Haveli (836) and Daman and Diu (705) separately, from before their 2020
 * merger; they are added here, as the map draws them as one.
 */
export const POPULATION_2026_LAKH: Record<string, number> = {
  "Uttar Pradesh": 2428.59, Bihar: 1322.65, Maharashtra: 1293.08, "West Bengal": 1005.22,
  "Madhya Pradesh": 896.73, Rajasthan: 836.42, "Tamil Nadu": 775.46, Gujarat: 740.86,
  Karnataka: 689.62, "Andhra Pradesh": 537.09, Odisha: 446.77, Jharkhand: 409.58,
  Telangana: 386.36, Assam: 367.17, Kerala: 362.07, Punjab: 313.18, Haryana: 312.99,
  Chhattisgarh: 312.11, Delhi: 225.4, "Jammu and Kashmir": 138.96, Uttarakhand: 119.93,
  "Himachal Pradesh": 75.79, Tripura: 42.6, Meghalaya: 34.4, Manipur: 33.11, Nagaland: 22.94,
  Puducherry: 17.57, "Arunachal Pradesh": 16.04, Goa: 15.99,
  "Dadra and Nagar Haveli and Daman and Diu": 15.41, Mizoram: 12.72, Chandigarh: 12.67,
  Sikkim: 7.08, "Andaman and Nicobar Islands": 4.06, Ladakh: 3.05, Lakshadweep: 0.7,
};

export interface AreaNode {
  name: string;
  weight: number;
  children?: AreaNode[];
}

/** Cities first-named carry the largest share: weights n, n−1, …, 1. */
function cities(names: string[]): AreaNode[] {
  return names.map((name, i) => ({ name, weight: names.length - i }));
}

/**
 * SMILE – Beggary's states and the cities surveyed in each.
 *
 * The STATE weights are the state-wise beneficiary distribution the SMILE Admin
 * prototype already draws (`lib/smile-admin/mock-data.ts`, `STATE_DISTRIBUTION`), so the
 * two prototypes rank the states the same way. They are copied, not imported: that
 * module throws in a production build by design. The cities are real cities; which of
 * them the scheme covers is illustrative.
 */
export const SMILE_AREAS: AreaNode[] = [
  { name: "Maharashtra", weight: 4120, children: cities(["Mumbai", "Pune", "Nagpur", "Nashik"]) },
  { name: "Gujarat", weight: 3210, children: cities(["Ahmedabad", "Surat", "Vadodara"]) },
  { name: "Kerala", weight: 1850, children: cities(["Thiruvananthapuram", "Ernakulam", "Kozhikode"]) },
  { name: "Tamil Nadu", weight: 1640, children: cities(["Chennai", "Madurai", "Coimbatore"]) },
  { name: "Rajasthan", weight: 1480, children: cities(["Jaipur", "Ajmer", "Jodhpur"]) },
  { name: "Delhi", weight: 1284, children: cities(["New Delhi", "Central Delhi", "South Delhi"]) },
  { name: "Karnataka", weight: 1310, children: cities(["Bengaluru Urban", "Mysuru"]) },
  { name: "Uttar Pradesh", weight: 1240, children: cities(["Lucknow", "Varanasi", "Prayagraj"]) },
  { name: "Telangana", weight: 1090, children: cities(["Hyderabad", "Warangal"]) },
  { name: "Madhya Pradesh", weight: 980, children: cities(["Indore", "Bhopal"]) },
  { name: "West Bengal", weight: 920, children: cities(["Kolkata", "Howrah"]) },
  { name: "Bihar", weight: 840, children: cities(["Patna", "Gaya"]) },
  { name: "Odisha", weight: 610, children: cities(["Khordha", "Puri"]) },
  { name: "Chhattisgarh", weight: 420, children: cities(["Raipur"]) },
  { name: "Jharkhand", weight: 380, children: cities(["Ranchi"]) },
  { name: "Haryana", weight: 290, children: cities(["Gurugram"]) },
  { name: "Punjab", weight: 240, children: cities(["Amritsar"]) },
];

/** Every State/UT, weighted by population. NMBA works in all of them. */
export const ALL_STATES: AreaNode[] = Object.entries(POPULATION_2011_LAKH)
  .map(([name, weight]) => ({ name, weight }))
  .sort((a, b) => b.weight - a.weight);

/** Every State/UT name, alphabetical, for a filter. */
export const STATE_NAMES = Object.keys(POPULATION_2011_LAKH).sort((a, b) => a.localeCompare(b));
