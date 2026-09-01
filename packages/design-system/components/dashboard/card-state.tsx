import * as React from "react";
import { cn } from "../../utils/cn";
import "./card-state.css";

/**
 * Every reason a card can have nothing to draw.
 *
 * THE POINT OF SEVEN RATHER THAN TWO: an empty state is a piece of writing
 * before it is a piece of design, and "no data to display" is the sentence that
 * fits all of these and helps with none of them. Each of these wants a different
 * next action, and only some of those actions are the reader's to take.
 */
export type CardStateKind =
  /** The selection is valid and genuinely holds nothing. Nothing to do. */
  | "empty"
  /** A filter matched nothing. The reader can fix this, and the action says how. */
  | "no-results"
  /** The source does not publish this figure yet. Not a failure, and not the reader's to fix. */
  | "not-published"
  /** The request failed. Local to this card; the rest of the page is unaffected. */
  | "error"
  /** The figures exist but this viewer may not see them. */
  | "restricted"
  /** The device is offline. Distinct from an error: nothing is wrong with the service. */
  | "offline";

interface Copy {
  title: string;
  body: string;
  /** `alert` for states a reader must notice; the rest are quiet by design. */
  live: boolean;
  /**
   * What an action could achieve here, and `null` where nothing could.
   *
   * THE STATE DECIDES, NOT THE CALL SITE. "Try again" under "Not published yet"
   * is a button that cannot possibly work — no amount of retrying will make a
   * department publish a figure — and a control that never changes anything
   * teaches people to stop pressing controls. So `action` is IGNORED for the
   * kinds that cannot use one, which makes the wrong thing impossible rather
   * than merely discouraged.
   */
  action: "retry" | "clear" | null;
}

const COPY: Record<CardStateKind, Copy> = {
  empty: {
    title: "Nothing to show yet",
    body: "There are no figures for this selection.",
    live: false,
    // Nothing to retry: the selection is valid and genuinely holds nothing.
    action: null,
  },
  "no-results": {
    title: "No matches",
    body: "No figures match the filters currently applied.",
    live: false,
    // The reader CAN fix this, but not by retrying — by widening the filters.
    action: "clear",
  },
  "not-published": {
    title: "Not published yet",
    body: "The department does not publish this figure at present. It will appear here when it does.",
    live: false,
    // No amount of retrying makes a department publish a figure.
    action: null,
  },
  error: {
    title: "This could not be loaded",
    body: "The figures for this card did not arrive. Everything else on the page is unaffected.",
    live: true,
    action: "retry",
  },
  restricted: {
    title: "Not available to view",
    body: "These figures are not part of the public release.",
    live: false,
    // Retrying does not grant permission. On a portal this would be a sign-in
    // link, which is a different action and belongs to the surface that has one.
    action: null,
  },
  offline: {
    title: "You are offline",
    body: "This card needs a connection. Nothing is wrong with the service.",
    live: true,
    action: "retry",
  },
};

/** Which of the three tones the plate and mark take. */
const TONE: Record<CardStateKind, "neutral" | "warning" | "info"> = {
  empty: "neutral",
  "no-results": "info",
  "not-published": "neutral",
  error: "warning",
  restricted: "neutral",
  offline: "warning",
};

export interface CardStateProps {
  kind: CardStateKind;
  /** Overrides the standard headline. Say what is true, not that something is missing. */
  title?: string;
  /** Overrides the standard explanation. One sentence, saying WHY. */
  description?: React.ReactNode;
  /**
   * The one thing that would resolve this state.
   *
   * IGNORED for kinds that no action can resolve — pass it unconditionally and
   * let the state decide. See `Copy.action`.
   */
  action?: React.ReactNode;
  /** Tighter, for a card that is short to begin with. */
  compact?: boolean;
  className?: string;
}

/**
 * MoSJE / SAMAVESH CardState — what a card shows when it has nothing to draw.
 *
 * DRAWN IN THE SYSTEM'S OWN GRAMMAR. The illustrations are not stock icons in a
 * circle: each is built from the marks the charts themselves draw — an axis, a
 * baseline, a series of bars, a ring — arranged to depict what has happened. A
 * card whose chart is missing shows the chart's own skeleton with the data taken
 * out, which reads as "this is that chart, without its figures" rather than as a
 * generic warning glyph borrowed from somewhere else.
 *
 * Every one carries a two-layer plate: a soft tinted well with a hairline ring
 * catching the top edge. One flat disc reads as a placeholder nobody finished.
 *
 * Pair with `ChartCard`'s `state` prop rather than reaching for this directly —
 * the card handles suppressing its own footer and export control, which a card
 * that cannot show its data must do.
 */
/** Whether an action can resolve this state at all, and what it should say. */
export function actionForState(kind: CardStateKind): "retry" | "clear" | null {
  return COPY[kind].action;
}

/**
 * The system's own words for a state, for surfaces too small to draw the plate.
 *
 * A `MetricCard` is one line of figure: there is no room for an illustration,
 * a headline and a body, but there IS room for the headline — and it must be
 * the SAME headline, or the estate ends up with "This could not be loaded" on a
 * chart and "Error" on the tile beside it, describing one failed request.
 */
export function cardStateCopy(kind: CardStateKind): { title: string; body: string; live: boolean } {
  /*
   * FALLS BACK RATHER THAN THROWING. TypeScript makes an unknown kind
   * impossible at the call sites in this repo, but this function exists to be
   * read at the exact moment something has already gone wrong — and a state
   * layer that destructures `undefined` and takes the page down with it is a
   * far worse failure than the one it was rendering. Caught by rendering a
   * `MetricCard` with a kind that does not exist and watching it throw.
   */
  const { title, body, live } = COPY[kind] ?? COPY.empty;
  return { title, body, live };
}

export function CardState({
  kind,
  title,
  description,
  action,
  compact = false,
  className,
}: CardStateProps) {
  const copy = COPY[kind];
  const tone = TONE[kind];
  return (
    <div
      className={cn(
        "ds-card-state",
        `ds-card-state--${tone}`,
        compact && "ds-card-state--compact",
        className,
      )}
      role={copy.live ? "alert" : undefined}
    >
      <span className="ds-card-state__plate" aria-hidden="true">
        <span className="ds-card-state__plate-ring" />
        <StateArt kind={kind} />
      </span>
      <p className="ds-card-state__title">{title ?? copy.title}</p>
      <p className="ds-card-state__body">{description ?? copy.body}</p>
      {action && copy.action ? (
        <div className="ds-card-state__action">{action}</div>
      ) : null}
    </div>
  );
}

/**
 * The illustration set.
 *
 * Inline SVG rather than the `Icon` component on purpose: these render at the
 * exact moment something has already gone wrong, and a state that draws as a
 * tofu box because an icon font has not loaded is worse than the state it is
 * describing. They are also not icons — each is a small scene built from the
 * chart vocabulary, which no icon set contains.
 *
 * Two tones in every one: a `--ghost` layer carrying the chart that would have
 * been there, and a `--ink` layer carrying what happened to it. That split is
 * what makes six drawings read as one family.
 */
function StateArt({ kind }: { kind: CardStateKind }) {
  const common = {
    viewBox: "0 0 64 48",
    width: 64,
    height: 48,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  // The axis every drawing stands on, so the family shares a floor.
  const Axis = () => (
    <path d="M8 40h48" className="ds-state-art__axis" strokeWidth="2" />
  );

  switch (kind) {
    case "empty":
      // The chart's own footprint, with the bars taken out.
      return (
        <svg {...common} className="ds-state-art">
          <Axis />
          {[14, 26, 38, 50].map((x) => (
            <path
              key={x}
              d={`M${x} 40v-2`}
              className="ds-state-art__ghost"
              strokeWidth="2"
              strokeDasharray="2 3"
            />
          ))}
        </svg>
      );

    case "no-results":
      // Bars that exist, and a lens finding none of them.
      return (
        <svg {...common} className="ds-state-art">
          <Axis />
          <path d="M12 40V28M22 40v-8M32 40V22" className="ds-state-art__ghost" strokeWidth="4" />
          <circle cx="44" cy="22" r="9" className="ds-state-art__ink" strokeWidth="3" />
          <path d="M50.5 28.5 56 34" className="ds-state-art__ink" strokeWidth="3" />
        </svg>
      );

    case "not-published":
      // The shape is known; the figures have not been released into it.
      return (
        <svg {...common} className="ds-state-art">
          <Axis />
          <path
            d="M14 40V24M26 40V14M38 40V20M50 40V10"
            className="ds-state-art__ghost"
            strokeWidth="4"
            strokeDasharray="3 4"
          />
        </svg>
      );

    case "error":
      // The series arrives, then breaks. The gap is the whole message.
      return (
        <svg {...common} className="ds-state-art">
          <Axis />
          <path d="M10 32l8-9 6 6" className="ds-state-art__ink" strokeWidth="3" />
          <path d="M40 26l6-7 8 5" className="ds-state-art__ink" strokeWidth="3" />
          <path d="M28 14v10M28 30v2" className="ds-state-art__ink" strokeWidth="3" />
        </svg>
      );

    case "restricted":
      // The chart is there, behind something shut.
      return (
        <svg {...common} className="ds-state-art">
          <Axis />
          <path d="M12 40V26M20 40v-9" className="ds-state-art__ghost" strokeWidth="4" />
          <rect
            x="30"
            y="24"
            width="22"
            height="15"
            rx="3"
            className="ds-state-art__ink"
            strokeWidth="3"
          />
          <path d="M35 24v-4a6 6 0 0 1 12 0v4" className="ds-state-art__ink" strokeWidth="3" />
        </svg>
      );

    case "offline":
      // The link to the source, severed. Nothing wrong with the chart itself.
      return (
        <svg {...common} className="ds-state-art">
          <Axis />
          <path d="M12 40V30M20 40v-6" className="ds-state-art__ghost" strokeWidth="4" />
          <path
            d="M34 30a6 6 0 0 1 0-8l3-3a6 6 0 0 1 8 8l-1 1"
            className="ds-state-art__ink"
            strokeWidth="3"
          />
          <path
            d="M46 22a6 6 0 0 1 0 8l-3 3a6 6 0 0 1-8-8"
            className="ds-state-art__ink"
            strokeWidth="3"
          />
          <path d="M28 14 54 38" className="ds-state-art__cut" strokeWidth="3" />
        </svg>
      );
  }
}
