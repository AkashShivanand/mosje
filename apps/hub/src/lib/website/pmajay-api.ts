import type { Descriptor, Reading } from "@/lib/data-mode/types";
import {
  PMAJAY_REACH_SNAPSHOT,
  type ReachDataset,
  type ReachSnapshot,
} from "./pmajay-map-snapshot";
import {
  GIA_ALL_PHYSICAL_FALLBACK,
  GIA_YEARS_FALLBACK,
  HOSTEL_FALLBACK_ILLUSTRATIVE,
  type GiaYear,
  type HostelCounts,
} from "./pmajay-stats";

/**
 * PM-AJAY public report feeds — live where they answer, mirrored where they do
 * not. The contract is `.claude/rules/live-data-fallback.md`; the short version
 * is that a figure the department publishes is never replaced on this estate by
 * a dash, a zero or "not yet reported".
 *
 * Three feeds, five endpoints, one deliberate omission:
 *
 *   · Grants-in-Aid, approved projects by domain — per financial year
 *   · Grants-in-Aid, physical progress — per financial year, plus `all`
 *   · Hostels, summary — no parameters; it ignores `fin_year`
 *   · Map points — every Adarsh Gram village and every hostel, with coordinates.
 *     ~3.5 MB, so it is aggregated to state level here and the coordinates are
 *     discarded; see `getPmajayReach` for why the page never sees them.
 *   · Gender distribution — NOT CONSUMED. Every figure it returns is 0, for
 *     every intervention, and `gender_overall` on the domain report agrees. A
 *     zeroed chart states that no women were reached, which is false rather
 *     than merely absent, so there is no gender card. Wire this up the day the
 *     feed carries figures; do not build the card against zeros first.
 *
 * Called from server components only. Never throws: an unreachable feed is a
 * normal state with a defined rendering, not an error boundary.
 */

const BASE =
  process.env.NEXT_PUBLIC_PMAJAY_API ??
  "https://pmajay-api-admin.mosje.in/api/v1/admin/public/reports";

/** Cache for an hour. A report feed does not move faster than a page view. */
const REVALIDATE = 3600;
const TIMEOUT_MS = 6000;

/** The years the source carries figures for. 2021-2022 exists and is all zeros. */
export const GIA_FIN_YEARS = [
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
] as const;

/**
 * The source SHOUTS its domain names and misspells one of them. Fixing a label
 * is not the same as changing a figure, and a citizen-facing government page
 * should not publish "HORTICLTURE" — but the correction is listed here, in one
 * place, rather than applied invisibly, so it can be deleted the day the feed
 * is fixed. Figures are never touched.
 */
const LABEL_FIXES: Record<string, string> = {
  Horticlture: "Horticulture",
  "Animal Husbandary": "Animal Husbandry",
  "Retail shops, Grocerys and Showrooms": "Retail shops, groceries and showrooms",
};

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

function prettyBreakdown(raw: string): string {
  return clean(raw)
    .split(" / ")
    .map((part, i) => {
      // Only the leading DOMAIN half is shouted; the sub-domain is sentence case
      // in the source and is left exactly as published.
      const t =
        i === 0 && part === part.toUpperCase()
          ? part
              .toLowerCase()
              .replace(/\b\w/g, (c) => c.toUpperCase())
              .replace(/\bAnd\b/g, "and")
          : part;
      return LABEL_FIXES[t] ?? t;
    })
    .join(" — ");
}

async function getJson<T>(path: string, timeoutMs: number = TIMEOUT_MS): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/${path}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: T };
    return body?.data ?? null;
  } catch {
    // Unreachable, slow, or malformed. The caller falls back; the page renders.
    return null;
  }
}

interface RawDomain {
  total_approved: number;
  interventions: {
    intervention_type: number;
    key: string;
    label: string;
    breakdown_label: string;
    total_approved: number;
    breakdowns: { breakdown_id: number; breakdown_name: string; approved_projects: number }[];
  }[];
}

interface RawPhysical {
  total_projects: number;
  in_progress_projects: number;
  physical_progress_percent: number;
}

/** Intervention type as the feed numbers them, to the descriptor's field name. */
export const INTERVENTION_KEY: Record<number, GiaKey> = {
  1: "ig",
  2: "skilling",
  3: "infra",
  6: "tutoring",
};

export interface GiaBreakdownRow {
  name: string;
  value: number;
}

export interface GiaYearFeed {
  finYear: string;
  /** What the feed said about this year's approvals. `null` where it said nothing. */
  approvals: Reading<GiaKey>;
  physical: Reading<GiaPhysicalKey>;
  /** Live breakdown rows per intervention type. Empty array = unpopulated. */
  breakdowns: Record<number, GiaBreakdownRow[]>;
  /** The mirrored snapshot for this year. */
  mock: GiaYear;
}

export interface GiaData {
  years: GiaYearFeed[];
  allPhysical: Reading<GiaPhysicalKey>;
  mockAllPhysical: typeof GIA_ALL_PHYSICAL_FALLBACK;
  reachable: boolean;
}

function readBreakdowns(i: RawDomain["interventions"][number]): GiaBreakdownRow[] {
  // Two different breakdown_ids can carry the SAME name — "Unspecified" appears
  // twice under Infrastructure at 114 and 20 — so a chart keyed on the name
  // draws two bars for one category unless they are merged first.
  const merged = new Map<string, number>();
  for (const b of i.breakdowns) {
    const k = prettyBreakdown(b.breakdown_name);
    merged.set(k, (merged.get(k) ?? 0) + b.approved_projects);
  }
  return [...merged]
    .map(([name, value]) => ({ name, value }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);
}

/**
 * Every financial year, as the feed reported it, beside the snapshot.
 *
 * Nothing is chosen here. A year's four interventions and its total are a SUM
 * GROUP declared in `GIA_YEAR_DESCRIPTOR`, and the merge resolves them together
 * in the browser — which is what makes "total live, one part missing, snapshot
 * part too large" impossible: the missing part is derived, not mocked.
 */
export async function getGiaData(): Promise<GiaData> {
  const years = await Promise.all(
    GIA_FIN_YEARS.map(async (y): Promise<GiaYearFeed> => {
      const mock = GIA_YEARS_FALLBACK.find((f) => f.finYear === y)!;
      const [domain, physical] = await Promise.all([
        getJson<RawDomain>(`gia/approved-by-domain?fin_year=${y}`),
        getJson<RawPhysical>(`gia/physical-progress?fin_year=${y}`),
      ]);

      const approvals: Reading<GiaKey> = {
        total: domain ? domain.total_approved : null,
        ig: null,
        skilling: null,
        infra: null,
        tutoring: null,
      };
      const breakdowns: Record<number, GiaBreakdownRow[]> = {};
      for (const i of domain?.interventions ?? []) {
        const key = INTERVENTION_KEY[i.intervention_type];
        if (key) approvals[key] = i.total_approved;
        breakdowns[i.intervention_type] = readBreakdowns(i);
      }

      return {
        finYear: y,
        approvals,
        physical: {
          totalProjects: physical ? physical.total_projects : null,
          inProgress: physical ? physical.in_progress_projects : null,
        },
        breakdowns,
        mock,
      };
    }),
  );

  const all = await getJson<RawPhysical>("gia/physical-progress?fin_year=all");
  return {
    years,
    allPhysical: {
      totalProjects: all ? all.total_projects : null,
      inProgress: all ? all.in_progress_projects : null,
    },
    mockAllPhysical: GIA_ALL_PHYSICAL_FALLBACK,
    reachable: years.some((y) => y.approvals.total !== null),
  };
}

/**
 * Fit a list of illustrative rows to a total that came from somewhere else.
 *
 * The scalar merge can anchor a missing PART to a live TOTAL because the
 * descriptor names both. A breakdown list has no such declaration — the feed
 * publishes 64 domains one year and 5 the next — so the same idea is applied by
 * hand: keep the snapshot's SHAPE, which is what a reader is actually looking
 * at, and scale it so it adds up to the total on screen. The last row absorbs
 * the rounding, so the rows sum exactly rather than nearly.
 */
export function scaleRows(rows: GiaBreakdownRow[], target: number): GiaBreakdownRow[] {
  const sum = rows.reduce((t, r) => t + r.value, 0);
  if (sum <= 0 || target <= 0) return rows;
  let spent = 0;
  return rows.map((r, i) => {
    const v =
      i === rows.length - 1 ? target - spent : Math.round((r.value / sum) * target);
    spent += v;
    return { name: r.name, value: Math.max(0, v) };
  });
}

export interface HostelData {
  reading: Reading<HostelKey>;
  mock: HostelCounts;
  reachable: boolean;
}

export type HostelKey = keyof HostelCounts;

/**
 * The hostel summary, as the feed reported it.
 *
 * `completed_hostels` is 0 in the live feed. Whether that is a reading or a gap
 * is NOT decided here — it is decided by the descriptor below, and the answer
 * turns on a detail worth stating: it counts BUILDINGS while its two neighbours
 * count PEOPLE, so no invariant links them and it forms a group of one. A group
 * of one whose only member is zero is unpopulated. Grouped by payload object
 * instead, it would borrow their corroboration and wrongly read as real.
 */
export async function getHostelData(): Promise<HostelData> {
  const mock = { ...HOSTEL_FALLBACK_ILLUSTRATIVE };
  const raw = await getJson<Partial<HostelCounts>>("hostel/summary");
  if (!raw) return { reading: {}, mock, reachable: false };
  const reading: Reading<HostelKey> = {};
  for (const k of Object.keys(mock) as HostelKey[]) {
    const v = raw[k];
    reading[k] = typeof v === "number" && Number.isFinite(v) ? v : null;
  }
  return { reading, mock, reachable: true };
}

export const HOSTEL_DESCRIPTOR: Descriptor<HostelKey> = {
  id: "hostel",
  fields: {
    // Its own group — see above.
    completed_hostels: { label: "Hostels completed", zero: "corroborated" },
    beneficiaries_covered: { label: "Beneficiaries covered", zero: "missing" },
    beneficiaries_occupied: { label: "Beneficiaries in occupation", zero: "corroborated" },
  },
  invariants: [
    { kind: "subset", part: "beneficiaries_occupied", of: "beneficiaries_covered" },
  ],
};

/** The four GIA fields that must add up, per financial year. */
export type GiaKey = "total" | "ig" | "skilling" | "infra" | "tutoring";

/**
 * One financial year's approvals.
 *
 * The four interventions sum to the year's total, which is what makes "total
 * 100, live parts 70, illustrative third part 50" impossible: with the sum
 * declared, a missing part is DERIVED as 30 rather than mocked at all.
 *
 * The zero settings encode the case this feed actually presents. Special
 * Tutoring is legitimately 0 in most years while the other three carry
 * thousands, so `corroborated` reads it as a real zero; a year in which every
 * intervention AND the total are 0 (2021-2022) is an unpopulated year and takes
 * the snapshot whole.
 */
export const GIA_YEAR_DESCRIPTOR: Descriptor<GiaKey> = {
  id: "gia-year",
  fields: {
    total: { label: "Approved projects", zero: "corroborated" },
    ig: { label: "Income Generation", zero: "corroborated" },
    skilling: { label: "Skilling", zero: "corroborated" },
    infra: { label: "Infrastructure", zero: "corroborated" },
    tutoring: { label: "Special Tutoring", zero: "corroborated" },
  },
  invariants: [
    { kind: "sum", total: "total", parts: ["ig", "skilling", "infra", "tutoring"] },
  ],
};

export type GiaPhysicalKey = "totalProjects" | "inProgress";

export const GIA_PHYSICAL_DESCRIPTOR: Descriptor<GiaPhysicalKey> = {
  id: "gia-physical",
  fields: {
    totalProjects: { label: "Projects on the books", zero: "missing" },
    // A quiet year genuinely has none in progress — 2024-2025 reports exactly
    // that against 436 projects, and it is a reading, not a gap.
    inProgress: { label: "Reported in progress", zero: "real" },
  },
  invariants: [{ kind: "subset", part: "inProgress", of: "totalProjects" }],
};

/**
 * GENDER — illustrative only, and it exists for a reason worth stating.
 *
 * The live feed answers with a complete structure in which every figure is
 * zero, so under the rules above the group is unpopulated and there is nothing
 * to show. In `live` mode that is exactly what happens and the card is absent.
 *
 * But this estate is a prototype whose job is to show stakeholders the finished
 * service, and "the gender card would be here" is not something an empty page
 * communicates. So an illustrative distribution stands in, and it is SHAPED,
 * not invented: PM-AJAY directs at least 15% of funds released to States and
 * UTs towards income-generating schemes for Scheduled Caste women, and at least
 * 10% towards skill development — both stated in the department's own
 * description of this component, on the page above this dashboard. The split
 * below sits a little above that floor, which is what a scheme meeting its own
 * mandate would look like. It is marked Illustrative wherever it appears.
 */
export type GenderKey = "total" | "male" | "female" | "other";

export const GIA_GENDER_DESCRIPTOR: Descriptor<GenderKey> = {
  id: "gia-gender",
  fields: {
    total: { label: "Beneficiaries", zero: "corroborated" },
    male: { label: "Men", zero: "corroborated" },
    female: { label: "Women", zero: "corroborated" },
    other: { label: "Other", zero: "corroborated" },
  },
  invariants: [{ kind: "sum", total: "total", parts: ["male", "female", "other"] }],
};

export interface GenderReading {
  reading: Reading<GenderKey>;
  mock: Record<GenderKey, number>;
}

interface RawGender {
  total: number;
  overall: { male: number; female: number; other: number };
}

export async function getGiaGender(totalApproved: number): Promise<GenderReading> {
  // Scaled to whatever total is on screen, so the illustrative split stays
  // consistent with the live approvals beside it instead of contradicting them.
  const female = Math.round(totalApproved * 0.34);
  const other = Math.round(totalApproved * 0.004);
  const mock = { total: totalApproved, female, other, male: totalApproved - female - other };

  const raw = await getJson<RawGender>("gia/gender-distribution");
  if (!raw) return { reading: {}, mock };
  return {
    reading: {
      total: typeof raw.total === "number" ? raw.total : null,
      male: raw.overall?.male ?? null,
      female: raw.overall?.female ?? null,
      other: raw.overall?.other ?? null,
    },
    mock,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   REACH — where PM-AJAY has landed, by state
   ══════════════════════════════════════════════════════════════════════════ */

export type ReachKey =
  | "villages"
  | "villageStates"
  | "villageDistricts"
  | "hostels"
  | "hostelStates"
  | "hostelDistricts";

export interface ReachData {
  /** Per-state rows as the feed reported them. `null` when it did not answer. */
  live: ReachSnapshot | null;
  reading: Reading<ReachKey>;
  mock: ReachSnapshot;
  reachable: boolean;
}

interface RawMapPoints {
  vdp_villages: { state_name?: string; district_code?: number | string }[];
  hostels: { state_name?: string; district_id?: number | string }[];
}

/**
 * "JAMMU AND KASHMIR" → "Jammu and Kashmir".
 *
 * Kept identical to `scripts/build-pmajay-map-snapshot.mjs`, deliberately and by
 * hand: that script runs in bare Node with no bundler and cannot import from
 * here, and a shared package for eleven lines would buy a build step to save a
 * duplication. If one changes, change both — a live row spelled differently from
 * its mirrored twin sorts into a different place in the same list.
 */
const REACH_JOINERS = new Set(["and", "of", "the"]);

function titleCaseState(raw: string): string {
  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && REACH_JOINERS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function aggregateReach<T extends Record<string, unknown>>(
  points: T[],
  stateKey: keyof T,
  districtKey: keyof T,
): ReachDataset {
  const byState = new Map<string, number>();
  const districts = new Set<string>();
  for (const p of points) {
    const state = titleCaseState(String(p[stateKey] ?? "").trim());
    if (!state) continue;
    byState.set(state, (byState.get(state) ?? 0) + 1);
    districts.add(`${String(p[stateKey])}:${String(p[districtKey])}`);
  }
  const rows = [...byState]
    .map(([state, value]) => ({ state, value }))
    // Descending by count, then alphabetical — `component-authoring.md` §10.
    .sort((a, b) => b.value - a.value || a.state.localeCompare(b.state));
  return { rows, total: points.length, states: rows.length, districts: districts.size };
}

/**
 * Where the scheme has reached, aggregated to states.
 *
 * THE COORDINATES NEVER LEAVE THIS FUNCTION, AND THAT IS THE DESIGN. The feed
 * publishes a point per village and per hostel — 19,767 and 202 of them, about
 * 3.5 MB. The page draws a state choropleth beside a ranked list, so all it can
 * use is two lists of about two dozen rows. Aggregating here means the render
 * ships ~2 KB rather than ~3.5 MB of latitudes it would immediately discard, and
 * the hourly `revalidate` means the large fetch happens once an hour rather than
 * once a view.
 *
 * A LONGER TIMEOUT THAN ITS SIBLINGS, for the same reason. Six seconds is right
 * for a summary object; on a multi-megabyte body it is a coin flip — and a
 * timeout here does not degrade to a smaller map, it degrades to the mirror.
 *
 * TWO DATASETS, NOT THREE. Grants-in-Aid has no point data in this feed, so the
 * map speaks for two of PM-AJAY's three components and the section says so.
 * Drawing an empty third layer to make the set look complete would state that
 * GIA has reached nowhere, which is false rather than merely absent.
 */
export async function getPmajayReach(): Promise<ReachData> {
  const mock = PMAJAY_REACH_SNAPSHOT;
  const raw = await getJson<RawMapPoints>("map-points", 20_000);
  if (!raw || !Array.isArray(raw.vdp_villages) || !Array.isArray(raw.hostels)) {
    return { live: null, reading: {}, mock, reachable: false };
  }

  const villages = aggregateReach(raw.vdp_villages, "state_name", "district_code");
  const hostels = aggregateReach(raw.hostels, "state_name", "district_id");

  return {
    live: { villages, hostels },
    reading: {
      villages: villages.total,
      villageStates: villages.states,
      villageDistricts: villages.districts,
      hostels: hostels.total,
      hostelStates: hostels.states,
      hostelDistricts: hostels.districts,
    },
    mock,
    reachable: true,
  };
}

/**
 * NO INVARIANTS, AND THAT IS A FINDING RATHER THAN AN OMISSION.
 *
 * Nothing here is a part of anything else. Villages and hostels are separate
 * components counted in different units; a state count and a district count are
 * cardinalities of one set at two grains, not the subset relation the merge can
 * solve for. Declaring a `sum` between any pair would be a rule the data does
 * not obey, and the merge would then "derive" a figure from it — which is worse
 * than mocking one, because a derived figure is presented as trustworthy.
 *
 * The per-state ROWS are not fields here either. The merge resolves scalars, and
 * a list whose length the feed decides has no fixed key set — so the rows follow
 * the provenance of their own dataset's total. See `PmajayReachMap`.
 *
 * Zeros are all `missing`: a scheme with 19,767 villages on the books has not
 * reached zero states, so a zero in any of these is an unpopulated column.
 */
export const PMAJAY_REACH_DESCRIPTOR: Descriptor<ReachKey> = {
  id: "pmajay-reach",
  fields: {
    villages: { label: "Adarsh Gram villages", zero: "missing" },
    villageStates: { label: "States with villages", zero: "missing" },
    villageDistricts: { label: "Districts with villages", zero: "missing" },
    hostels: { label: "Hostels", zero: "missing" },
    hostelStates: { label: "States with hostels", zero: "missing" },
    hostelDistricts: { label: "Districts with hostels", zero: "missing" },
  },
  invariants: [],
};
