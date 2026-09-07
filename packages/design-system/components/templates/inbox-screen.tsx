"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { EventList, type EventItem } from "../data-display/event-list";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { Pagination } from "../navigation/pagination";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

export interface InboxScreenProps extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  /** Filters — by kind, by date, unread only. */
  filters?: React.ReactNode;
  activeFilterCount?: number;
  onClearFilters?: () => void;

  /**
   * The entries, **newest first**. This template does not sort — the order is
   * the caller's claim, as it is on `EventList`.
   */
  events: EventItem[];
  /** Names the list for a screen reader — "Notifications", "Audit log". */
  label: string;
  /**
   * `day` puts a dated heading above each day's entries, which is the right
   * shape for anything longer than a screen. @default "day"
   */
  grouping?: "none" | "day";

  /** Offered when anything is unread. Omit for a log nobody marks. */
  onMarkAllRead?: () => void;
  /** @default "Mark all as read" */
  markAllReadLabel?: string;

  page?: number;
  totalPages?: number;
  hrefForPage?: (page: number) => string;
  onPageChange?: (page: number) => void;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * InboxScreen — many records, each a dated attributed event.
 *
 * The distinguishing question against `WorklistScreen` is what one row IS: an
 * **event** (dated, attributed, already happened) or an **object** (a thing with
 * a current state that the reader changes)
 * (`docs/design-system/screen-templates.md` §2a). An application is an object; a
 * notification that the application was returned is an event.
 *
 * **A notification, a comment and an audit entry are one object with three
 * views.** They share a shape — when, who, what, about what — and the estate
 * renders all three through `EventList` rather than three near-identical
 * components that drift apart. What differs is grouping, filtering and whether
 * anything is read.
 *
 * **Unread is marked with a word, not a dot alone.** `EventList` enforces that;
 * this template only has to not undo it. A coloured dot carries no meaning for a
 * screen-reader user and none for a reader who cannot distinguish it from the
 * background.
 */
export function InboxScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  actions,
  headingLevel = 1,
  filters,
  activeFilterCount = 0,
  onClearFilters,
  events,
  label,
  grouping = "day",
  onMarkAllRead,
  markAllReadLabel = "Mark all as read",
  page = 1,
  totalPages = 1,
  hrefForPage,
  onPageChange,
  onRetry,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: InboxScreenProps): React.JSX.Element {
  const status = resolveScreenState({
    ...state,
    count: events.length,
    filtered: activeFilterCount > 0,
  });

  const unread = events.filter((event) => event.unread).length;

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader
        as={headingLevel}
        eyebrow={eyebrow}
        title={title}
        meta={meta}
        actions={
          /* The mark-all control is offered only when there IS something
             unread. A permanently visible button that does nothing on most
             visits teaches the reader to stop seeing it. */
          onMarkAllRead && unread > 0 ? (
            <>
              <Button appearance="outlined" size="sm" onClick={onMarkAllRead}>
                {markAllReadLabel}
              </Button>
              {actions}
            </>
          ) : (
            actions
          )
        }
      />

      {filters ? <div className="sa-inbox__filters">{filters}</div> : null}

      {status === "ready" && unread > 0 ? (
        <p className="sa-screen__count" aria-live="polite">
          {`${unread.toLocaleString("en-IN")} unread.`}
        </p>
      ) : null}

      <ScreenBody
        status={status}
        copy={copy}
        skeleton="table"
        onRetry={onRetry}
        onClearFilters={onClearFilters}
      >
        <div className="sa-inbox">
          <EventList events={events} label={label} grouping={grouping} />

          {totalPages > 1 ? (
            <div className="sa-inbox__pager">
              <Pagination
                page={page}
                totalPages={totalPages}
                hrefFor={hrefForPage}
                onPageChange={onPageChange}
                label="Entry pages"
              />
            </div>
          ) : null}
        </div>
      </ScreenBody>
    </div>
  );
}
