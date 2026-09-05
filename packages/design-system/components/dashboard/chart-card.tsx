import * as React from "react";
import { cn } from "../../utils/cn";
import { ChartExport, type ChartExportFormat } from "./chart-export";
import { CardState, actionForState, type CardStateKind } from "./card-state";
import { CardSkeleton, type CardSkeletonShape } from "./card-skeleton";
import { ProvenanceLine } from "./provenance";
import type { DataProvenance } from "../data-display/charts/types";
import "./dashboard.css";

export interface ChartCardProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "title" | "children"> {
  title: string;
  subtitle?: string;
  /** Header actions slot (filters, menu, export button). */
  actions?: React.ReactNode;
  /**
   * Add a download control (PNG · SVG · CSV) to the header. It exports the
   * chart rendered inside this card; no wiring needed.
   */
  exportable?: boolean;
  /** Filename stem and download-menu heading. @default `title` */
  exportName?: string;
  /** Restrict which formats the download control offers. */
  exportFormats?: ChartExportFormat[];
  /** Column span (1–12) inside a `DashboardGrid` at ≥768px. Full width on mobile. */
  span?: number;
  /** Show a loading shimmer instead of the body. */
  loading?: boolean;
  /**
   * Why the card has nothing to draw. Supersedes `empty` / `error`, which stay
   * for the call sites that predate it and map onto `"empty"` / `"error"`.
   *
   * Six reasons rather than two because each wants a different next action, and
   * only some of those actions are the reader's to take. See `CardState`.
   */
  state?: CardStateKind;
  /** Show the empty state instead of the body. @deprecated use `state="empty"` */
  empty?: boolean;
  /** One line saying WHY there is nothing, not that there is nothing. */
  emptyLabel?: string;
  /** Headline for the state. Defaults to the one `CardState` carries. */
  emptyTitle?: string;
  /** @deprecated use `state="error"` */
  error?: boolean;
  errorTitle?: string;
  errorLabel?: string;
  /**
   * The one action that would resolve the state in front of the reader. Drawn
   * as a button; omit where nothing the reader can do would help.
   */
  onRetry?: () => void;
  /**
   * Label for that action. Defaults to what the state can actually do —
   * "Try again" where retrying could work, "Clear filters" where widening the
   * selection is the only thing that would.
   */
  retryLabel?: string;
  /**
   * What the loading placeholder should look like. A skeleton earns its place
   * by sharing the silhouette of what is coming, so a donut card must not
   * shimmer as a bar chart. @default "bars"
   */
  skeleton?: CardSkeletonShape;
  footer?: React.ReactNode;
  /**
   * Where the figures came from — printed as one muted line beneath the body,
   * and dropped with the footer whenever the card has nothing to show, because
   * a source line under "This could not be loaded" is describing figures that
   * are not there.
   */
  provenance?: DataProvenance;
  className?: string;
  children?: React.ReactNode;
}

/**
 * MoSJE / SAMAVESH ChartCard — titled container for a chart or any dashboard
 * widget. Standardises header (title + actions), body, loading/empty states and
 * grid span so every portal dashboard composes the same way.
 */
export function ChartCard({
  title,
  subtitle,
  actions,
  exportable = false,
  exportName,
  exportFormats,
  span,
  loading = false,
  state,
  empty = false,
  emptyTitle,
  emptyLabel,
  error = false,
  errorTitle,
  errorLabel,
  onRetry,
  retryLabel,
  skeleton = "bars",
  footer,
  provenance,
  className,
  children,
  style: styleProp,
  ...rest
}: ChartCardProps) {
  const style = span
    ? ({ ...styleProp, ["--cmp-card-span" as string]: String(span) } as React.CSSProperties)
    : styleProp;
  /*
   * A CARD THAT CANNOT SHOW ITS DATA MUST NOT TALK ABOUT ITS DATA.
   *
   * The footer carries the card's reading of its own figures — "2023-2024 is
   * the largest year at 7,343 approvals". Left up while the body says the
   * figures did not arrive, the card contradicts itself and the sentence is
   * indistinguishable from a live finding. The export control goes for the same
   * reason: there is nothing to serialise, and offering the download implies
   * there is.
   */
  // The booleans predate `state` and still work; `state` wins where both are
  // given, because it is the specific instruction.
  const kind: CardStateKind | null =
    state ?? (error ? "error" : empty ? "empty" : null);
  const settled = !loading && kind === null;
  const hasActions = Boolean(actions) || (exportable && settled);
  return (
    /* Rest props land on the card element so a page can annotate it — a
       `data-sa-reveal` for scroll entry, an `id` for a deep link — without the
       card growing a prop for every such need. `title` and `children` are the
       card's own and are excluded from the section attributes above. */
    <section {...rest} className={cn("ds-chart-card", className)} style={style}>
      <header className="ds-chart-card__head">
        <div className="ds-chart-card__titles">
          <h3 className="ds-chart-card__title">{title}</h3>
          {subtitle && <p className="ds-chart-card__subtitle">{subtitle}</p>}
        </div>
        {hasActions && (
          <div className="ds-chart-card__actions">
            {actions}
            {exportable && settled && (
              <ChartExport name={exportName ?? title} formats={exportFormats} />
            )}
          </div>
        )}
      </header>
      {/* KEYED ON WHAT IS BEING SHOWN, so React remounts the body when the card
          moves between loading, a state and its content — and the crossfade in
          the stylesheet gets something to fade. Without the key the swap is a
          hard cut: the skeleton is replaced by a finished chart in one frame,
          which reads as a glitch rather than as data arriving. */}
      <div className="ds-chart-card__body" key={loading ? "loading" : (kind ?? "content")}>
        {loading ? (
          <>
            <CardSkeleton shape={skeleton} />
            <span className="ds-sr-only" role="status">
              Loading {title}
            </span>
          </>
        ) : kind ? (
          <CardState
            kind={kind}
            title={kind === "error" ? errorTitle : emptyTitle}
            description={kind === "error" ? errorLabel : emptyLabel}
            action={
              onRetry ? (
                <button type="button" className="ds-card-state__retry" onClick={onRetry}>
                  {retryLabel ??
                    (actionForState(kind) === "clear" ? "Clear filters" : "Try again")}
                </button>
              ) : null
            }
          />
        ) : (
          children
        )}
      </div>
      {provenance && settled && (
        <ProvenanceLine className="ds-chart-card__provenance" provenance={provenance} />
      )}
      {footer && settled && (
        <footer className="ds-chart-card__footer">{footer}</footer>
      )}
    </section>
  );
}

