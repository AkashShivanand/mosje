"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import type { ExplorationStatus, ExplorationSurface } from "@/lib/explorations/registry";
import "./explorations.css";

/**
 * THE REGISTER'S FRONT DOOR, AND THE QUESTION IT HAS TO ANSWER.
 *
 * A reader arrives here with one question — **"what needs me?"** — and until now
 * the page could not answer it. Eleven cards in insertion order, each card's foot
 * a stack of long coloured pills naming every option and repeating its status in
 * full; fifteen options were awaiting a decision and the only way to find them
 * was to read all eleven. Two of the pills ran off the edge of their own card.
 *
 * Three changes, and each does a different job:
 *
 * 1. **A filter, so the question can be asked.** Four states, counted from the
 *    register, and a decision matches when any of its options is in that state.
 * 2. **Open decisions first**, so the answer is at the top before anything is
 *    pressed. This is presentation, not the record: the REGISTER's order is
 *    chronological and is untouched — see `registry.ts`.
 * 3. **A tally instead of a pill per option.** "5 awaiting a decision · 1 not
 *    chosen" says what the eleven pills said, in one line that cannot clip, and
 *    it gives the card's own title back the top of the card. The option NAMES
 *    stay — as plain text, now that they are short — because a reader scanning
 *    for "the one with the chat" needs the scent.
 *
 * ── WHY THE FILTER IS NOT IN THE URL ────────────────────────────────────────
 *
 * `?option=` on a module page is in the URL because a link to a specific option
 * is a thing people send each other. A filter is a thing you do for four seconds
 * on your way somewhere, and putting it in the URL would make this page render
 * per request for a control nobody links to. It is client state, deliberately.
 */

/** Plural forms the tally needs. A count line reading "1 options" is a defect. */
const STATUS_TALLY: Record<ExplorationStatus, string> = {
  chosen: "chosen",
  proposed: "awaiting a decision",
  superseded: "not chosen",
  parked: "parked",
};

/** The filter's own vocabulary. `parked` is folded into "not chosen" — the
 *  register holds none today, and a chip that always reads zero is chrome. */
const FILTERS = [
  { id: "all", label: "All" },
  { id: "proposed", label: "Awaiting a Decision" },
  { id: "chosen", label: "Chosen" },
  { id: "superseded", label: "Not Chosen" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

/** How each filter reads inside a sentence, for the filtered-to-nothing state. */
const FILTER_PHRASE: Record<FilterId, string> = {
  all: "in the register",
  proposed: "awaiting a decision",
  chosen: "chosen",
  superseded: "recorded as not chosen",
};

export function ExplorationIndex({
  surfaces,
}: {
  surfaces: readonly ExplorationSurface[];
}): React.JSX.Element {
  const [filter, setFilter] = React.useState<FilterId>("all");

  const matches = React.useCallback(
    (statuses: ExplorationStatus[]) => {
      if (filter === "all") return true;
      if (filter === "superseded") return statuses.some((s) => s === "superseded" || s === "parked");
      return statuses.some((s) => s === filter);
    },
    [filter],
  );

  /**
   * Counted from the register for the chips themselves, so a chip can never
   * offer a filter that would empty the page — and so the numbers on the chips
   * are the same numbers the cards below add up to.
   */
  const chipCounts = React.useMemo(() => {
    const all = surfaces.flatMap((s) => s.modules).flatMap((m) => m.options);
    return {
      all: all.length,
      proposed: all.filter((o) => o.status === "proposed").length,
      chosen: all.filter((o) => o.status === "chosen").length,
      superseded: all.filter((o) => o.status === "superseded" || o.status === "parked").length,
    } satisfies Record<FilterId, number>;
  }, [surfaces]);

  const shown = React.useMemo(
    () =>
      surfaces
        .map((surface) => ({
          surface,
          modules: surface.modules
            .filter((m) => matches(m.options.map((o) => o.status)))
            /*
             * OPEN DECISIONS FIRST. `sort` mutates, so this runs on the array
             * `filter` just produced, never on the register's own. Stable in
             * every engine we ship to, so two modules that are both open keep
             * the order they were drawn in.
             */
            .sort((a, b) => {
              const open = (m: typeof a) => (m.options.some((o) => o.status === "proposed") ? 0 : 1);
              return open(a) - open(b);
            }),
        }))
        .filter((entry) => entry.modules.length > 0),
    [surfaces, matches],
  );

  return (
    <>
      <div className="xpl-filters" role="group" aria-label="Filter decisions by the state of their options">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="xpl-filter"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            <span>{f.label}</span>
            <span className="xpl-filter__count">{chipCounts[f.id]}</span>
          </button>
        ))}
      </div>

      {/*
       * FILTERED TO NOTHING IS NOT EMPTY, and `data-state-completeness.md` §1 is
       * explicit that rendering one for the other lies about which it is. The
       * register is never empty — it ships with the estate — so the only way to
       * see nothing here is to have asked for it, and the way out is named.
       */}
      {shown.length === 0 ? (
        <p className="xpl-nothing">
          No decision has an option {FILTER_PHRASE[filter]}.{" "}
          <button type="button" className="xpl-nothing__clear" onClick={() => setFilter("all")}>
            Show every decision
          </button>
        </p>
      ) : null}

      {shown.map(({ surface, modules }) => (
        <section key={surface.id} className="xpl-surface" aria-labelledby={`xpl-${surface.id}`}>
          <h2 id={`xpl-${surface.id}`} className="text-headline-3 text-ink">
            {surface.title}
          </h2>
          <p className="mt-2 max-w-measure text-body-2 text-ink-muted">{surface.summary}</p>
          {surface.route ? (
            <p className="mt-2 text-body-3">
              <Link href={surface.route} className="text-primary hover:underline">
                Open the live page
              </Link>
            </p>
          ) : null}

          <div className="xpl-modules">
            {modules.map((m) => {
              const tally = (["proposed", "chosen", "superseded", "parked"] as const)
                .map((status) => ({
                  status,
                  n: m.options.filter((o) => o.status === status).length,
                }))
                .filter((t) => t.n > 0);

              return (
                <Link
                  key={m.id}
                  href={`/explorations/${surface.id}/${m.id}`}
                  className="xpl-module-card"
                >
                  <span className="xpl-module-card__title">{m.title}</span>
                  <span className="xpl-module-card__question">{m.question}</span>

                  {/* The option names, as plain text. They were one pill each,
                      carrying the name AND the status joined by an em dash — in a
                      register where three names contain an em dash of their own,
                      so nothing said where the name stopped. */}
                  <span className="xpl-module-card__labels">
                    {m.options.map((o) => o.label).join(" · ")}
                  </span>

                  <span className="xpl-module-card__foot">
                    {tally.map((t) => (
                      <span key={t.status} className="xpl-tally">
                        <span className={`xpl-dot xpl-dot--${t.status}`} aria-hidden />
                        {t.n} {STATUS_TALLY[t.status]}
                      </span>
                    ))}
                    <span className="xpl-module-card__date">
                      <Icon name="event" size={14} aria-hidden />
                      {m.date}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
