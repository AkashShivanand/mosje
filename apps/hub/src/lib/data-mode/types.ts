/**
 * The prototype's data contract: what a figure is allowed to be, what must add
 * up, and where a number came from.
 *
 * This estate is a prototype whose job is to show stakeholders how the finished
 * service looks — against feeds that are, today, partly unpopulated. Hiding
 * every card the feed cannot fill defeats the purpose; filling them with
 * plausible-looking noise is worse than defeating it. What follows is the
 * middle path, and the whole of it exists so that two failure modes are
 * impossible rather than merely unlikely:
 *
 *   1. FIGURES THAT DO NOT ADD UP. A total of 100 with two live parts summing
 *      to 70 and a mocked third part of 50. Solved by merging GROUPS, never
 *      fields — see `merge.ts`.
 *   2. A MOCKED FIGURE MISTAKEN FOR A REAL ONE. Solved by carrying provenance
 *      on every value out of the merge, and by never rendering a card without
 *      showing it.
 *
 * The rule this implements is `.claude/rules/prototype-data-modes.md`.
 */

/** What the viewer asked to see. Chosen in the demo rail. */
export type DataMode = "live" | "mock" | "hybrid";

export const DATA_MODES: DataMode[] = ["live", "mock", "hybrid"];
export const DEFAULT_DATA_MODE: DataMode = "hybrid";

/**
 * A state forced from the demo rail, so a walkthrough can show what the page
 * does when things go wrong without having to break a feed to get there.
 *
 * `normal` is the real behaviour and the default. Nothing here is ever entered
 * by accident: every one of the others is a deliberate choice made in the demo
 * tools, and none of them survives a reload into a different browser.
 */
export type PreviewState =
  | "normal"
  | "loading"
  | "empty"
  | "no-results"
  | "not-published"
  | "error"
  | "restricted"
  | "offline";

export const PREVIEW_STATES: PreviewState[] = [
  "normal",
  "loading",
  "empty",
  "no-results",
  "not-published",
  "error",
  "restricted",
  "offline",
];

/** Whether a forced state applies to the whole section or just its first card. */
export type PreviewScope = "all" | "one";

/** Where a single figure came from, after merging. */
export type Provenance =
  /** The feed answered with this value. */
  | "live"
  /** Computed from live figures via a declared invariant. As trustworthy as its inputs. */
  | "derived"
  /** Illustrative. Never a departmental figure. */
  | "mock";

/**
 * Whether a literal `0` from the feed is a reading or a gap.
 *
 * The ambiguity exists because these payloads have no `null` — an unpopulated
 * column and a genuine zero arrive identically. Where the API offers a
 * structural signal (a missing key, an empty array) prefer that and never reach
 * for this; where it does not, one of these three has to be declared.
 */
export type ZeroMeaning =
  /** 0 is a real reading. "Projects in progress" can honestly be none. */
  | "real"
  /** 0 is always a gap. A running scheme has not covered zero beneficiaries. */
  | "missing"
  /**
   * 0 is real ONLY if a sibling in the same group carries a figure.
   *
   * This is the one that does most of the work, and it is why grouping is by
   * INVARIANT rather than by payload object. Special Tutoring at 0 inside a
   * group whose total is 8,772 is a real zero; every gender field at 0 inside a
   * group whose total is also 0 is an unpopulated feed.
   */
  | "corroborated";

export interface FieldSpec {
  /** Human name, used in provenance tooling and test failures. */
  label: string;
  zero: ZeroMeaning;
}

/**
 * A rule that must hold across several fields.
 *
 * Invariants do two jobs at once, and the second is the point: they say what
 * "coherent" means so the merge can never break it, AND they let a hole be
 * SOLVED instead of mocked. A missing part of a known sum is arithmetic, not
 * invention.
 */
export type Invariant<K extends string> =
  /** `parts` sum exactly to `total`. */
  | { kind: "sum"; total: K; parts: K[] }
  /** `part` is a subset of `of`, so `0 <= part <= of`. */
  | { kind: "subset"; part: K; of: K }
  /** A funnel: each stage is at most the one before it. */
  | { kind: "monotone"; series: K[] };

export interface Descriptor<K extends string> {
  /** Named for error messages and the provenance panel. */
  id: string;
  fields: Record<K, FieldSpec>;
  invariants: Invariant<K>[];
}

/** A feed reading. `null` means the field was absent or unusable. */
export type Reading<K extends string> = Partial<Record<K, number | null>>;

export interface MergeResult<K extends string> {
  values: Record<K, number>;
  provenance: Record<K, Provenance>;
  /** True when nothing in the result is mock. */
  allLive: boolean;
  /** True when nothing in the result is live. */
  allMock: boolean;
}
