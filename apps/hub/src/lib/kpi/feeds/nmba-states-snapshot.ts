/**
 * NMBA TOTAL OUTREACH BY STATE/UT — A MIRRORED SNAPSHOT of the NMBA public API, read on
 * 07.10.2026 from `dashboard/metrics?state_id=<id>` for each of the 36 States/UTs the
 * API's `states` list names, and `dashboard/metrics` for the national total. Nothing here is
 * modelled or spread: every figure is the API's `people_reached`, as published.
 *
 * WHY IT EXISTS (`live-data-fallback.md`: live first, snapshot second, never an empty state).
 * The live map needs all 36 State/UT requests to answer inside the feed's timeout; one
 * slow answer and the map used to vanish from the landing page and NMBA's page. The live
 * reading still wins wherever it is complete; this is drawn only when it is not, marked as a
 * snapshot with its date. The national total is larger than the States/UTs' sum because the
 * API counts outreach not attributed to a State/UT in the total only.
 *
 * Refresh: re-read the two endpoints and replace the rows and the date together.
 */
export const NMBA_STATES_SNAPSHOT = {
  asOn: "07.10.2026",
  source: "Nasha Mukt Bharat Abhiyaan portal (State/UT figures, mirrored)",
  national: 348334090,
  rows: [
  { area: "Andaman and Nicobar Islands", value: 80549 },
  { area: "Andhra Pradesh", value: 8421444 },
  { area: "Arunachal Pradesh", value: 195223 },
  { area: "Assam", value: 2745841 },
  { area: "Bihar", value: 7137350 },
  { area: "Chandigarh", value: 4400267 },
  { area: "Chhattisgarh", value: 3632763 },
  { area: "Dadra and Nagar Haveli and Daman and Diu", value: 2157178 },
  { area: "Delhi", value: 2483163 },
  { area: "Goa", value: 206028 },
  { area: "Gujarat", value: 14935802 },
  { area: "Haryana", value: 4614256 },
  { area: "Himachal Pradesh", value: 1847265 },
  { area: "Jammu and Kashmir", value: 12443493 },
  { area: "Jharkhand", value: 3603297 },
  { area: "Karnataka", value: 18336783 },
  { area: "Kerala", value: 3987841 },
  { area: "Ladakh", value: 74888 },
  { area: "Lakshadweep", value: 10609 },
  { area: "Madhya Pradesh", value: 118529034 },
  { area: "Maharashtra", value: 5290883 },
  { area: "Manipur", value: 840205 },
  { area: "Meghalaya", value: 1479611 },
  { area: "Mizoram", value: 488429 },
  { area: "Nagaland", value: 384071 },
  { area: "Odisha", value: 3689679 },
  { area: "Puducherry", value: 367506 },
  { area: "Punjab", value: 2749093 },
  { area: "Rajasthan", value: 13672060 },
  { area: "Sikkim", value: 685548 },
  { area: "Tamil Nadu", value: 6633936 },
  { area: "Telangana", value: 26673114 },
  { area: "Tripura", value: 2972060 },
  { area: "Uttar Pradesh", value: 3396956 },
  { area: "Uttarakhand", value: 1736369 },
  { area: "West Bengal", value: 3312007 },
  ],
} as const;
