"use client";

import * as React from "react";

/**
 * THE FOUR STATES A CHART PAGE OWES ITS READER.
 *
 * `.claude/rules/data-state-completeness.md` names loading, empty, error and
 * filtered-to-nothing as "the four that get skipped" — and until the charts
 * gained `state`, `onRetry` and `filterLabel`, every one of the seventeen chart
 * pages in this estate documented exactly one state out of five. A portal team
 * reading those pages had no way to know what a chart does on the day a feed is
 * down, so each of them designed it again, differently.
 *
 * This renders all four beside each other, at the chart's own proportions. The
 * `render` callback is why every chart specimen is a client component: a
 * function cannot cross the server boundary, and the retry control has to be
 * real for the error state to be worth showing.
 */
const STATES = [
  { state: "loading", label: "Loading" },
  { state: "empty", label: "Empty" },
  { state: "error", label: "Error" },
  { state: "no-results", label: "Filtered to Nothing" },
] as const;

export type DocsChartState = (typeof STATES)[number]["state"];

export interface ChartStatesProps {
  /** Renders one chart in the given state. Called once per state. */
  render: (args: {
    state: DocsChartState;
    onRetry: () => void;
    filterLabel: string;
  }) => React.ReactNode;
  /**
   * Named on `no-results` so the specimen shows the sentence a reader actually
   * gets — "No figures match the current district filter", not "No matches".
   */
  filterLabel?: string;
}

export function ChartStates({
  render,
  filterLabel = "district filter",
}: ChartStatesProps): React.JSX.Element {
  /* The controls are live. Pressing "Try again" or "Clear …" remounts the row,
     so a reader can see that the control does something rather than take the
     screenshot on trust. */
  const [nonce, retry] = React.useReducer((n: number) => n + 1, 0);
  return (
    <div className="cdp-states">
      {STATES.map((s) => (
        <div key={s.state} className="cdp-states__cell">
          <span className="cdp-states__label">{s.label}</span>
          <React.Fragment key={`${s.state}-${nonce}`}>
            {render({ state: s.state, onRetry: retry, filterLabel })}
          </React.Fragment>
        </div>
      ))}
    </div>
  );
}
