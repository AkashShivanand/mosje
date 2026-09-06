"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { EmptyState } from "../feedback/empty-state";
import { Icon } from "../utilities/icon";
import { Skeleton } from "../feedback/skeleton";
import { DEFAULT_SCREEN_COPY, type ScreenStateCopy, type ScreenStatus } from "./screen-state";
import "./screen-templates.css";

/**
 * The shape a loading skeleton should take.
 *
 * Deliberately short. Where a component already owns its own loading silhouette
 * — `KpiRow`'s `loading` count, `ChartCard`'s `skeleton`, `CardSkeleton`'s six
 * shapes — the template hands the wait to that component instead of drawing a
 * second, blunter placeholder over it. A screen has one skeleton vocabulary,
 * not two.
 */
export type SkeletonShape = "table" | "cards" | "form" | "detail";

export interface ScreenBodyProps {
  /** The one resolved status. See {@link resolveScreenState}. */
  status: ScreenStatus;
  /** Words for every state. Defaults to the estate's; pass overrides per portal. */
  copy?: ScreenStateCopy;
  /**
   * What the skeleton looks like. It must be **the shape of the result** — a
   * spinner in a void tells the reader nothing about what is coming, and a
   * skeleton of the wrong shape moves the page when the data lands.
   * @default "table"
   */
  skeleton?: SkeletonShape;
  /** Called when the reader presses **Try again**. Omit and no retry is offered. */
  onRetry?: () => void;
  /** Called when the reader clears their filters, from the `filtered` state. */
  onClearFilters?: () => void;
  /** An action offered from the `empty` state — "Add the first record". */
  emptyAction?: React.ReactNode;
  /** The populated screen. Rendered only at `ready`. */
  children: React.ReactNode;
  className?: string;
}

/**
 * ScreenBody — renders whichever of the six states the screen is in.
 *
 * Every template routes its content through this, which is what makes the seven
 * states structural rather than remembered. A template author cannot forget the
 * empty state, because there is no code path that skips it.
 *
 * **It branches the render, never the hooks.** The status is resolved above,
 * every `useMemo` in the template runs unconditionally against an empty value,
 * and only the return is conditional. That is the arrangement
 * `data-state-completeness.md` §3 prescribes, and it is why a template can own
 * these states without forcing its caller into conditional hooks.
 */
export function ScreenBody({
  status,
  copy = DEFAULT_SCREEN_COPY,
  skeleton = "table",
  onRetry,
  onClearFilters,
  emptyAction,
  children,
  className,
}: ScreenBodyProps): React.JSX.Element {
  if (status === "ready") {
    return <div className={cn("sa-screen-body", className)}>{children}</div>;
  }

  if (status === "loading") {
    return (
      <div
        className={cn("sa-screen-body", className)}
        /* The wait is deliberate, so a screen reader is told so rather than
           meeting a silent region. `aria-busy` pairs with it: `role="status"`
           announces, `aria-busy` says the announcement is not final. */
        role="status"
        aria-busy="true"
        aria-label={copy.loadingLabel}
      >
        <ScreenSkeleton shape={skeleton} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={cn("sa-screen-body", className)}>
        <EmptyState
          icon={<Icon name="error" size={32} />}
          title={copy.errorTitle}
          description={copy.errorDescription}
          action={
            onRetry ? (
              <Button appearance="outlined" onClick={onRetry} iconLeft={<Icon name="refresh" size={20} />}>
                {copy.retryLabel}
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  if (status === "filtered") {
    return (
      <div className={cn("sa-screen-body", className)}>
        <EmptyState
          icon={<Icon name="filter_alt_off" size={32} />}
          title={copy.filteredTitle}
          description={copy.filteredDescription}
          action={
            onClearFilters ? (
              <Button appearance="outlined" onClick={onClearFilters}>
                {copy.clearFiltersLabel}
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className={cn("sa-screen-body", className)}>
        <EmptyState
          icon={<Icon name="search" size={32} />}
          title={copy.idleTitle}
          description={copy.idleDescription}
        />
      </div>
    );
  }

  return (
    <div className={cn("sa-screen-body", className)}>
      <EmptyState
        icon={<Icon name="inbox" size={32} />}
        title={copy.emptyTitle}
        description={copy.emptyDescription}
        action={emptyAction}
      />
    </div>
  );
}

/**
 * The skeleton, in the shape of the result it is standing in for.
 *
 * `aria-hidden` throughout: the wait is announced once by the region above, and
 * a screen reader meeting forty empty boxes learns nothing from them.
 */
function ScreenSkeleton({ shape }: { shape: SkeletonShape }): React.JSX.Element {
  if (shape === "cards") {
    return (
      <div className="sa-screen-skeleton sa-screen-skeleton--cards" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} height="var(--sa-padding-120)" />
        ))}
      </div>
    );
  }

  if (shape === "form" || shape === "detail") {
    return (
      <div className="sa-screen-skeleton sa-screen-skeleton--form" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="sa-screen-skeleton__field">
            {/* Label then control, at the real control height, so the form does
                not resettle when the fields arrive. */}
            <Skeleton height="var(--sa-padding-16)" width="30%" />
            <Skeleton height="var(--sa-control-height-md)" />
          </div>
        ))}
      </div>
    );
  }

  /* A header rule and eight rows at the density scale's own row height — the
     same measure DataTable uses, so the table lands where the skeleton stood. */
  return (
    <div className="sa-screen-skeleton sa-screen-skeleton--table" aria-hidden="true">
      <Skeleton height="var(--sa-density-row-height)" />
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} height="var(--sa-density-row-height)" />
      ))}
    </div>
  );
}
