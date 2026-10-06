/**
 * The areas a portal reading can be split over, and the weights the ILLUSTRATIVE
 * model splits by. Nothing here is a departmental figure.
 *
 * State names follow `IndiaMap`'s spelling (`india-states.paths.ts`) so a reading can
 * be drawn on the map without a translation table.
 */

/**
 * Every State/UT, alphabetical, spelled as `IndiaMap` spells it — for the area filter and
 * for checking an area a feed names.
 *
 * NAMES ONLY, NO FIGURES. This file used to carry Census 2011 and projected 2026
 * populations, as weights for illustrative state splits and as the divisor of an
 * "outreach per 100 residents" rate. Neither was supplied by the Department, and a 2026
 * count divided by a 2011 population is not a comparison anyone can defend. Removed on
 * instruction, 6 Oct 2026: the dashboard shows only what the Department supplies, and a
 * figure the Department does not publish for a State/UT is not shown for it.
 */
export const STATE_NAMES: string[] = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

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
