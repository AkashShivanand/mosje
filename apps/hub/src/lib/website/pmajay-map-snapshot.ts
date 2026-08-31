/**
 * PM-AJAY reach, mirrored from the department's `map-points` feed.
 *
 * GENERATED — do not hand-edit. Refresh with:
 *
 *     node scripts/build-pmajay-map-snapshot.mjs
 *
 * and move `PMAJAY_REACH_AS_ON` in the same commit. It is deliberately NOT
 * rebuilt by `npm run build`: a mirror that silently tracks the feed is not a
 * fallback, it is a second copy of the feed wearing a stale date.
 *
 * ONE DATE PER DATASET, and that is not fussiness. GIA and hostels shared a
 * single `AS_ON` while being captured days apart, and the banner told readers
 * both were mirrored on a day only one of them was. Villages and hostels come
 * out of the same request here, so they genuinely share a date — but the field
 * stays per-run rather than per-file so the next dataset added cannot inherit
 * someone else's capture date by default.
 */

export interface ReachRow {
  /** State name, title-cased. `IndiaMap` matches it case- and "&"-insensitively. */
  state: string;
  value: number;
}

export interface ReachDataset {
  rows: ReachRow[];
  /** Points in the feed, before aggregation. */
  total: number;
  states: number;
  districts: number;
}

export interface ReachSnapshot {
  villages: ReachDataset;
  hostels: ReachDataset;
}

/** The day the figures below were read off the live feed. */
export const PMAJAY_REACH_AS_ON = "31 August 2026";

export const PMAJAY_REACH_SNAPSHOT: ReachSnapshot = {
  villages: {
    total: 19767,
    states: 24,
    districts: 522,
    rows: [
      { state: "West Bengal", value: 5792 },
      { state: "Bihar", value: 2853 },
      { state: "Tamil Nadu", value: 2184 },
      { state: "Uttar Pradesh", value: 2083 },
      { state: "Rajasthan", value: 1493 },
      { state: "Karnataka", value: 1301 },
      { state: "Odisha", value: 776 },
      { state: "Andhra Pradesh", value: 746 },
      { state: "Madhya Pradesh", value: 459 },
      { state: "Maharashtra", value: 311 },
      { state: "Chhattisgarh", value: 277 },
      { state: "Assam", value: 269 },
      { state: "Haryana", value: 264 },
      { state: "Jharkhand", value: 226 },
      { state: "Punjab", value: 182 },
      { state: "Telangana", value: 163 },
      { state: "Uttarakhand", value: 136 },
      { state: "Himachal Pradesh", value: 105 },
      { state: "Jammu and Kashmir", value: 62 },
      { state: "Gujarat", value: 36 },
      { state: "Tripura", value: 35 },
      { state: "Manipur", value: 10 },
      { state: "Meghalaya", value: 3 },
      { state: "Delhi", value: 1 },
    ],
  },
  hostels: {
    total: 202,
    states: 21,
    districts: 114,
    rows: [
      { state: "Assam", value: 33 },
      { state: "Tamil Nadu", value: 32 },
      { state: "Andhra Pradesh", value: 25 },
      { state: "Karnataka", value: 16 },
      { state: "Nagaland", value: 16 },
      { state: "Odisha", value: 15 },
      { state: "Uttarakhand", value: 9 },
      { state: "Manipur", value: 8 },
      { state: "Tripura", value: 8 },
      { state: "Madhya Pradesh", value: 7 },
      { state: "Uttar Pradesh", value: 6 },
      { state: "Meghalaya", value: 5 },
      { state: "Sikkim", value: 5 },
      { state: "Mizoram", value: 3 },
      { state: "Rajasthan", value: 3 },
      { state: "Chhattisgarh", value: 2 },
      { state: "Haryana", value: 2 },
      { state: "Himachal Pradesh", value: 2 },
      { state: "Kerala", value: 2 },
      { state: "Telangana", value: 2 },
      { state: "Punjab", value: 1 },
    ],
  },
};
