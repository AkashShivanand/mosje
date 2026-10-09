"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Icon } from "../utilities/icon";
import { ScreenBody, type SkeletonShape } from "./screen-body";
import { DEFAULT_SCREEN_COPY, resolveScreenState, type ScreenStateCopy, type ScreenStateInput } from "./screen-state";
import "./screen-templates.css";
import "./dashboard-screen.css";

export interface DashboardScreenProps extends ScreenStateInput {
  /** A line above everything else — who the page is being drawn for, when that is not the public. */
  notice?: React.ReactNode;
  /** The way back to the list of dashboards, above the area bar, where it reads as the way out. */
  back?: { href: string; label: string };
  /**
   * The app's router link, for `back`.
   *
   * linkAs-gate(href-only): a screen with no `back` renders no link.
   */
  linkAs?: React.ElementType;
  /**
   * The area the figures are for — "All India", "Kerala", "Pune, Maharashtra". It is announced
   * when it changes (`role="status"`). Leave it out for a view with no area: a sign-in page.
   */
  area?: string;
  /** The words before the area. @default "Figures for" */
  areaLabel?: string;
  /** The filters that change the figures — State/UT, District, Financial Year — on one baseline. */
  filters?: React.ReactNode;
  /**
   * One sentence under the area bar saying what an area choice actually changed, where most of
   * the page publishes All-India figures only. Without it, a reader who picks a State and finds
   * five of seven sections unchanged concludes the picker did not work.
   */
  areaNote?: React.ReactNode;
  /**
   * The view's identity — the URL's search string. When it changes, focus moves to the view's
   * first heading and the view scrolls to the top, as a page change would.
   */
  viewKey?: string;
  /**
   * Asked before focus moves on a `viewKey` change; return false to keep it where it is. A
   * filter keeps the reader's focus on the filter, so they can choose again.
   */
  shouldMoveFocus?: () => boolean;
  onRetry?: () => void;
  onClearFilters?: () => void;
  copy?: ScreenStateCopy;
  /** The skeleton's shape while the figures load. @default "cards" */
  skeleton?: SkeletonShape;
  /** The view: sections built from HeadlineBand, DashboardCardList, DashboardHeader, KpiView… */
  children: React.ReactNode;
  className?: string;
}

/**
 * DashboardScreen — figures about a programme, or several, for a reader who wants to know how
 * things stand, filtered by area and period. The nineteenth screen template.
 *
 * Built for the website's Beneficiary Dashboard (Oct 2026) and drawn the same way on every
 * dashboard after it: the way back, the area bar ("Figures for All India" with its filters on
 * one baseline), one sentence where an area choice changes only part of the page, then the
 * view. It owns the seven states through `ScreenBody`, the focus move when the view changes,
 * and the area's live announcement.
 *
 * `OverviewScreen` is a portal's signed-in home — a greeting, four KPI tiles, recent records.
 * This is a dashboard a citizen or an officer reads: one or many programmes, an area filter,
 * views that open from one another. Compose the view from `HeadlineBand`, `DashboardCardList`
 * of `DashboardCard`s, `DashboardHeader`, `KpiView`, `AreaBreakdown` and `AreaExplorer`.
 */
export function DashboardScreen({
  notice,
  back,
  linkAs,
  area,
  areaLabel = "Figures for",
  filters,
  areaNote,
  viewKey,
  shouldMoveFocus,
  onRetry,
  onClearFilters,
  copy = DEFAULT_SCREEN_COPY,
  skeleton = "cards",
  children,
  className,
  ...state
}: DashboardScreenProps): React.JSX.Element {
  const status = resolveScreenState(state);
  const panelRef = React.useRef<HTMLDivElement>(null);
  // The view last focused for. Compared by VALUE, not counted: React runs an effect twice on
  // mount in development, and a "skip the first run" flag spent on the first of the two moved
  // focus — and scrolled the page — on every load.
  const shownKey = React.useRef(viewKey);

  React.useEffect(() => {
    if (shownKey.current === viewKey) return;
    shownKey.current = viewKey;
    if (shouldMoveFocus && !shouldMoveFocus()) return;
    const target = panelRef.current?.querySelector<HTMLElement>("h2, h3") ?? panelRef.current;
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start" });
    // Only a new view moves focus; `shouldMoveFocus` is read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewKey]);

  return (
    <div className={cn("sa-dashboard", className)}>
      {notice}
      {back ? (
        <Button appearance="text" size="sm" href={back.href} linkAs={linkAs} iconLeft={<Icon name="arrow_back" size={16} />} className="sa-dashboard__back">
          {back.label}
        </Button>
      ) : null}
      {area != null ? (
        <div className="sa-dashboard__bar">
          <p className="sa-dashboard__where" role="status">
            <span className="sa-dashboard__label">{areaLabel}</span>
            {area}
          </p>
          {filters ? <div className="sa-dashboard__controls">{filters}</div> : null}
        </div>
      ) : null}
      {areaNote ? <p className="sa-dashboard__note">{areaNote}</p> : null}
      <ScreenBody status={status} copy={copy} skeleton={skeleton} onRetry={onRetry} onClearFilters={onClearFilters}>
        <div ref={panelRef} className="sa-dashboard__panel">
          {children}
        </div>
      </ScreenBody>
    </div>
  );
}
