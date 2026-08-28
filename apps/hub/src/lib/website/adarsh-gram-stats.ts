/* ============================================================================
   Adarsh Gram (PM-AJAY) — public progress figures.

   This is the scheme's own reporting, moving onto SAMAVESH as the standalone
   Adarsh Gram site is absorbed into this estate. It is not a mirror of another
   website and must not be presented as one — when the merge completes there is
   no other website to point at.

   The figures that came across are 18 flat counts plus two charts and eight
   convergence indicators. Every one of them is here, sorted into the kinds they
   actually are so the page can give each kind the form it deserves:

     · OUTCOME  — what the scheme is judged on (declared Adarsh Grams)
     · RATIO    — a pair that only means something together (done ÷ planned)
     · REFERENCE— a plain count that sets the scale but measures nothing

   Every `note` is the legacy site's own tooltip definition, verbatim in
   substance. They matter: "No. of Households" counts Format-1 form entries,
   not distinct households, and a reader who assumes otherwise misreads the
   scheme by two orders of magnitude.

   WHEN THE APIs LAND: replace the literals below with the response from the
   PM-AJAY MIS endpoint. The shape is the contract — the component reads
   nothing else.
   ========================================================================= */

/** The reporting timestamp the scheme publishes against its progress figures. */
export const ADARSH_GRAM_AS_ON = "24 August 2026";

/** Matches the design system's `IndiaMapDatum`. */
export interface StateValue {
  state: string;
  value: number;
}

/* ── Mirrored snapshot of the eighteen counters ─────────────────────────────

   The fallback `adarsh-gram-api.ts` serves when the live feed cannot be
   reached. Same keys as the API, so the two are interchangeable.
   ------------------------------------------------------------------------- */

export const ADARSH_GRAM_COUNTS_FALLBACK = {
  states_covered: 26,
  districts_covered: 596,
  villages: 47_247,
  households: 21_42_67_419,
  total_population: 7_36_85_171,
  sc_population: 4_03_36_884,
  assessment_initiated: 36_672,
  assessment_completed: 33_837,
  works_identified: 3_91_317,
  works_gap_filling: 1_56_590,
  works_completed: 47_367,
  gap_filling_release_lakh: 1_20_108.231,
  gap_filling_utilized_lakh: 1_01_855.924,
  beneficiaries_identified: 1_15_67_193,
  beneficiaries_covered: 47_79_441,
  vdp_generated: 25_437,
  vdp_dlcc_approved: 22_281,
  adarsh_gram_declared: 17_946,
};

/* ── The outcome ─────────────────────────────────────────────────────────── */

export const ADARSH_GRAM_OUTCOME = {
  declared: 17_946,
  villages: 47_247,
  note: "Villages officially declared as Adarsh Gram, of all villages selected under the scheme.",
} as const;

/* ── The journey: six stages, one story ──────────────────────────────────── */

export interface JourneyStage {
  label: string;
  value: number;
  note: string;
}

export const ADARSH_GRAM_JOURNEY: JourneyStage[] = [
  { label: "Villages selected", value: 47_247, note: "Selected villages under the scheme for implementation." },
  { label: "Assessment initiated", value: 36_672, note: "Villages where infrastructure surveys have started (Format-2)." },
  { label: "Assessment completed", value: 33_837, note: "Villages where the infrastructure survey is complete (Format-2)." },
  { label: "Village Development Plan drawn", value: 25_437, note: "Villages with a Village Development Plan generated." },
  { label: "Plan approved by DLCC", value: 22_281, note: "Village Development Plans approved by the District Level Convergence Committee." },
  { label: "Declared Adarsh Gram", value: 17_946, note: "Villages scoring 70+ of 100 and Open Defecation Free." },
];

/* ── Ratios: pairs that only mean something together ─────────────────────── */

export interface ProgressRatio {
  id: string;
  label: string;
  done: number;
  total: number;
  doneLabel: string;
  totalLabel: string;
  /**
   * Display overrides. Money carries a unit the raw number does not, and the
   * source states funds *in lakh* — so the figures are converted to crore here,
   * where the unit is known, rather than in the component where it is not.
   */
  doneDisplay?: string;
  totalDisplay?: string;
  note: string;
}

export const ADARSH_GRAM_RATIOS: ProgressRatio[] = [
  {
    id: "works",
    label: "Infrastructure works completed",
    done: 47_367,
    total: 3_91_317,
    doneLabel: "completed",
    totalLabel: "identified for execution",
    note: "Works planned across surveyed villages, against those finished.",
  },
  {
    id: "funds",
    // Source publishes these in lakh: 1,01,855.924 L and 1,20,108.231 L.
    // Restated in crore, the unit Indian government reporting uses at this size.
    label: "Gap-filling funds utilised",
    done: 1_01_855.924,
    total: 1_20_108.231,
    doneLabel: "utilised",
    totalLabel: "released",
    doneDisplay: "\u20B910,185.59 Cr",
    totalDisplay: "\u20B912,010.82 Cr",
    note: "Gap-filling funds released to complete works, against funds actually spent.",
  },
  {
    id: "beneficiaries",
    label: "Beneficiaries reached",
    done: 47_79_441,
    total: 1_15_67_193,
    doneLabel: "provided the service",
    totalLabel: "identified as prospective",
    note: "Beneficiaries identified under household need assessment, against those served.",
  },
];

/* ── The pipeline over time (Chartdata31.php, cumulative, year-end) ──────── */

export const ADARSH_GRAM_TIMELINE = {
  years: ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
  /** Villages taken into the programme. Steps up in tranches, then plateaus. */
  villagesSelected: [8_815, 12_332, 18_321, 29_654, 29_654, 29_654, 29_654, 29_654],
  vdpGenerated: [39, 2_156, 3_497, 6_592, 11_416, 14_501, 18_826, 25_439],
  vdpApproved: [3, 1_429, 2_519, 5_374, 8_826, 12_985, 16_785, 22_281],
  declared: [0, 0, 0, 3_299, 5_005, 9_917, 12_801, 17_959],
  note: "Cumulative totals at each year end. 2026 is to August.",
} as const;

/* ── Geography: the ten states with the most completed works ─────────────── */

export interface StateWorks {
  state: string;
  completed: number;
  inProgress: number;
  notStarted: number;
  gapFilling: number;
}

export const ADARSH_GRAM_TOP_STATES: StateWorks[] = [
  { state: "Odisha", completed: 9_718, inProgress: 303, notStarted: 16_933, gapFilling: 5_626 },
  { state: "Karnataka", completed: 7_082, inProgress: 1_087, notStarted: 11_834, gapFilling: 5_099 },
  { state: "Tamil Nadu", completed: 6_862, inProgress: 269, notStarted: 28_205, gapFilling: 3_100 },
  { state: "Madhya Pradesh", completed: 6_240, inProgress: 2_328, notStarted: 23_487, gapFilling: 5_186 },
  { state: "Rajasthan", completed: 4_297, inProgress: 945, notStarted: 9_248, gapFilling: 4_113 },
  { state: "Chhattisgarh", completed: 3_552, inProgress: 1_634, notStarted: 8_871, gapFilling: 2_266 },
  { state: "Uttar Pradesh", completed: 2_543, inProgress: 119, notStarted: 1_04_505, gapFilling: 2_554 },
  { state: "Himachal Pradesh", completed: 1_969, inProgress: 216, notStarted: 5_399, gapFilling: 1_857 },
  { state: "Assam", completed: 1_013, inProgress: 106, notStarted: 5_575, gapFilling: 410 },
  { state: "Maharashtra", completed: 953, inProgress: 116, notStarted: 5_121, gapFilling: 818 },
];

/* ── Declared Adarsh Grams by state (all 26, for the choropleth) ────────────

   Taken from the implementation series rather than the tile set, so it totals
   17,959 against the headline 17,946 — the two are separate queries against the
   same database a few hours apart. The difference is 13 villages in ~18,000 and
   is disclosed on the page rather than quietly reconciled.
   ------------------------------------------------------------------------- */

export const ADARSH_GRAM_BY_STATE: StateValue[] = [
  { state: "Uttar Pradesh", value: 3_801 },
  { state: "Tamil Nadu", value: 3_110 },
  { state: "Madhya Pradesh", value: 1_783 },
  { state: "Rajasthan", value: 1_770 },
  { state: "Karnataka", value: 1_767 },
  { state: "Odisha", value: 1_353 },
  { state: "Andhra Pradesh", value: 824 },
  { state: "Chhattisgarh", value: 702 },
  { state: "Maharashtra", value: 580 },
  { state: "Haryana", value: 483 },
  { state: "Himachal Pradesh", value: 444 },
  { state: "Uttarakhand", value: 325 },
  { state: "Assam", value: 300 },
  { state: "Jammu and Kashmir", value: 279 },
  { state: "Punjab", value: 261 },
  { state: "Gujarat", value: 74 },
  { state: "Telangana", value: 44 },
  { state: "Tripura", value: 30 },
  { state: "Manipur", value: 20 },
  { state: "Jharkhand", value: 5 },
  { state: "Kerala", value: 3 },
  { state: "Meghalaya", value: 1 },
  { state: "Bihar", value: 0 },
  { state: "Delhi", value: 0 },
  { state: "Puducherry", value: 0 },
  { state: "West Bengal", value: 0 },
];

/* ── Convergence: what the villages actually received ────────────────────── */

export interface ConvergenceOutcome {
  label: string;
  achieved: number;
  target: number;
}

export const ADARSH_GRAM_CONVERGENCE: ConvergenceOutcome[] = [
  { label: "Household toilets (IHHL)", achieved: 3_57_544, target: 7_94_377 },
  { label: "Health protection cover", achieved: 4_17_568, target: 9_01_938 },
  { label: "Housing under PMAY-G", achieved: 4_16_890, target: 12_56_601 },
  { label: "Old-age pension", achieved: 78_933, target: 1_78_764 },
  { label: "Children in primary school", achieved: 53_018, target: 1_06_081 },
  { label: "Widow pension", achieved: 29_690, target: 68_256 },
  { label: "Children in middle school", achieved: 25_904, target: 53_121 },
  { label: "Children immunised", achieved: 6_710, target: 16_363 },
];

/* ── Reference: the plain counts that set the scale ──────────────────────── */

export interface ReferenceStat {
  label: string;
  value: number;
  icon: string;
  note: string;
}

export const ADARSH_GRAM_REFERENCE: ReferenceStat[] = [
  { label: "States covered", value: 26, icon: "public", note: "States currently part of the scheme." },
  { label: "Districts covered", value: 596, icon: "map", note: "Districts in which villages are selected for implementation." },
  { label: "Gram Panchayats", value: 35_770, icon: "account_balance", note: "Gram Panchayats containing the selected villages." },
  { label: "Villages selected", value: 47_247, icon: "location_city", note: "Selected villages under the scheme for implementation." },
  { label: "Total population", value: 7_36_85_171, icon: "groups", note: "Population of all selected villages, Census 2011." },
  { label: "SC population", value: 4_03_36_884, icon: "diversity_3", note: "Scheduled Caste population of all selected villages, Census 2011." },
  { label: "Need assessments filed", value: 21_42_67_419, icon: "assignment", note: "Format-1 household need-assessment entries — form entries, not distinct households." },
  { label: "Works under gap-filling", value: 1_56_590, icon: "handyman", note: "Infrastructure works planned from Gap Filling Funds." },
];
