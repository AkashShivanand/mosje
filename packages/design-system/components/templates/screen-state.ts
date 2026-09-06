/**
 * The seven states a data-driven screen can be in, resolved ONCE.
 *
 * `.claude/rules/data-state-completeness.md` makes these mandatory and, measured
 * on 2026-09-06, **236 of the estate's 265 portal pages handled none of loading,
 * empty or error**. Not out of carelessness: obeying the rule by hand costs four
 * extra branches on every page, and nothing in the system offered them
 * ready-made. This module is those branches, written once.
 *
 * ## Why a resolver rather than four booleans
 *
 * The rule's §2 — "one request, one answer" — exists because a section shipped
 * showing `Adarsh Gram villages 0 · Hostels 0` in its key, above a map drawing
 * 19,768 villages and a list of 28 states. Both halves read the same request.
 * One had a defined answer for "the feed said nothing" and the other quietly
 * reached for the mirror instead.
 *
 * Four booleans on a page reproduce that defect by construction, because nothing
 * stops a heading from testing `loading` while its table tests `rows.length`.
 * {@link resolveScreenState} collapses the question to a single value, and the
 * templates branch on it exactly once. A heading and a table cannot disagree
 * about a screen they both read from one variable.
 *
 * ## Why the hooks are safe
 *
 * The usual reason this rule gets broken is that an early return would sit above
 * a `useMemo`. It does not have to: resolve the status, keep deriving against an
 * empty value, and branch the RENDER. Never `?? mockData` here — that is the
 * defect, not the fix.
 */

/**
 * What the screen is currently able to show.
 *
 * Six branches, not seven. "Partial" is not a branch — a partially answered
 * screen is `ready`, and says so with a provenance chip per
 * `.claude/rules/prototype-data-modes.md`. "Too much" is not a branch either:
 * it is a constraint the descriptor types enforce, because a template that can
 * receive more rows than it can hold **requires** a pager rather than
 * discovering at runtime that it needed one.
 */
export type ScreenStatus =
  /**
   * Nothing has been asked yet. A search field before its first query.
   *
   * Distinct from `empty` on purpose. "Not asked" and "asked, nothing there"
   * are different sentences with different remedies, and rendering them the
   * same way is what makes a search field look broken before it has been used.
   */
  | "idle"
  /** Asked; the answer has not arrived. */
  | "loading"
  /** The request failed. Recoverable, and the reader is offered the retry. */
  | "error"
  /** Answered, and the register holds nothing. */
  | "empty"
  /**
   * Answered, and the reader's own filter excluded everything.
   *
   * NOT `empty`. "No village named Bankura is in the register" and "the feed
   * published nothing" are different facts, and a screen that renders one for
   * both is lying about one of them. The reader caused this state and can undo
   * it, so the copy names the filter.
   */
  | "filtered"
  /** There is something to show. */
  | "ready";

/** What {@link resolveScreenState} needs in order to decide. */
export interface ScreenStateInput {
  /**
   * Whether a request has been made at all. Leave `true` for a screen that
   * loads on mount; pass `false` for one gated on the reader's intent, so it
   * resolves to `idle` rather than `empty`.
   * @default true
   */
  asked?: boolean;
  /** A request is outstanding. */
  loading?: boolean;
  /** The request failed. Any truthy value counts; the message is the caller's. */
  error?: unknown;
  /**
   * How many records the screen received. `0` with filters applied resolves to
   * `filtered`; `0` without them resolves to `empty`.
   */
  count?: number;
  /**
   * Whether the reader has narrowed the set. Pass the real predicate — a
   * default-valued select is not a filter, and treating it as one turns every
   * empty register into "try clearing your filters", which is a lie the reader
   * cannot act on.
   * @default false
   */
  filtered?: boolean;
}

/**
 * Resolve the one status the whole screen reads.
 *
 * Order matters and is not negotiable:
 *
 * 1. `error` outranks everything — a screen holding stale rows and a failed
 *    refresh must not present those rows as current.
 * 2. `loading` outranks emptiness, so a screen that has not answered yet never
 *    flashes "nothing found" on its way to finding something.
 * 3. `idle` outranks emptiness, because nothing was asked.
 * 4. Then, and only then, does the count decide — and `filtered` splits it.
 */
export function resolveScreenState({
  asked = true,
  loading = false,
  error,
  count = 0,
  filtered = false,
}: ScreenStateInput): ScreenStatus {
  if (error) return "error";
  if (loading) return "loading";
  if (!asked) return "idle";
  if (count > 0) return "ready";
  return filtered ? "filtered" : "empty";
}

/**
 * The words each state shows, so a template never invents them and a portal can
 * override exactly the ones its register words differently.
 *
 * Every string is here rather than in the components because GIGW requires the
 * estate to be bilingual, and a sentence baked into a template cannot be
 * translated. Title Case on titles, per `.claude/rules/ui-restraint-and-copy.md`.
 */
export interface ScreenStateCopy {
  /** Shown at `idle`. The prompt to act. */
  idleTitle: string;
  idleDescription?: string;
  /** Announced while loading, for a screen reader. Never rendered as text. */
  loadingLabel: string;
  /** Shown at `error`. One sentence. No status codes, no endpoints. */
  errorTitle: string;
  errorDescription?: string;
  retryLabel: string;
  /** Shown at `empty`. The citizen's answer, in the department's register. */
  emptyTitle: string;
  emptyDescription?: string;
  /** Shown at `filtered`. Names the filter and how to clear it. */
  filteredTitle: string;
  filteredDescription?: string;
  clearFiltersLabel: string;
}

/**
 * The estate's default wording.
 *
 * Deliberately generic where a template cannot know better, and deliberately
 * *not* generic where it can: the filtered copy says "your filters" because the
 * reader set them, and the empty copy does not, because they did not.
 */
export const DEFAULT_SCREEN_COPY: ScreenStateCopy = {
  idleTitle: "Search the Register",
  idleDescription: "Enter a term above to see matching records.",
  loadingLabel: "Loading records",
  errorTitle: "This Information Could Not Be Loaded",
  errorDescription: "The service did not respond. Please try again.",
  retryLabel: "Try again",
  emptyTitle: "No Records Published",
  emptyDescription: "Nothing has been recorded here yet.",
  filteredTitle: "No Records Match Your Filters",
  filteredDescription: "Clear the filters to see the full list.",
  clearFiltersLabel: "Clear filters",
};

/**
 * Merge a portal's overrides over the defaults.
 *
 * A portal overrides the two or three sentences its register words differently
 * and inherits the rest, rather than restating ten. Same contract as
 * `DEFAULT_FIELD_COPY` on Form Field.
 */
export function screenCopy(overrides?: Partial<ScreenStateCopy>): ScreenStateCopy {
  return overrides ? { ...DEFAULT_SCREEN_COPY, ...overrides } : DEFAULT_SCREEN_COPY;
}
