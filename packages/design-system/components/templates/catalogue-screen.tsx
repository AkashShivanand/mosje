"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Badge } from "../feedback/badge";
import { Icon } from "../utilities/icon";
import { Link } from "../navigation/link";
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

/** Something the reader can open or download. */
export interface CatalogueItem {
  id: string;
  title: string;
  description?: React.ReactNode;
  /** Date, department, circular number — the line under the title. */
  meta?: React.ReactNode;
  /**
   * What the reader will get — "PDF · 2.4 MB", "Excel · 812 KB".
   *
   * **Taken from the destination, never guessed from the title.** A link
   * labelled "Guidelines" that opens a 40 MB scan on a rural connection is the
   * case this field exists to prevent, and the department publishes the type
   * and size, so there is no reason to omit it.
   */
  kind?: string;
  href: string;
  /** Leaves the estate. Announced, and marked. */
  external?: boolean;
  /** Downloads rather than opens. Filename to save as, or `true`. */
  download?: string | boolean;
  /** "New", "Revised" — a short state word, not a sentence. */
  badge?: string;
}

export interface CatalogueScreenProps extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  /** Filter chips or selects. Drop DS controls straight in. */
  filters?: React.ReactNode;
  activeFilterCount?: number;
  onClearFilters?: () => void;

  items: CatalogueItem[];
  /**
   * `rows` for documents, `cards` for anything with a description worth reading.
   * @default "rows"
   */
  layout?: "rows" | "cards";
  /** What one item is called, for the count line. @default "document" */
  noun?: string;
  pluralNoun?: string;

  /** 1-based. Omit paging only when the whole set genuinely fits. */
  page?: number;
  totalPages?: number;
  /** Prefer this — a page number belongs in the URL. */
  hrefForPage?: (page: number) => string;
  onPageChange?: (page: number) => void;
  /** How large the catalogue is before filtering. Count line only. */
  registerTotal?: number;

  onRetry?: () => void;
  emptyAction?: React.ReactNode;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * CatalogueScreen — many records the reader browses rather than acts on.
 *
 * The distinguishing question against `WorklistScreen` is whether the reader
 * **does something to** the rows or **reads** them
 * (`docs/design-system/screen-templates.md` §2a). Acts on ⇒ worklist. Against
 * `SearchScreen`: is there a ranking? Ranked ⇒ search. A catalogue is ordered
 * by the department — newest first, or by circular number — not by relevance to
 * anything the reader typed.
 *
 * **It pages, always.** `Pagination` appears in exactly one of the estate's 265
 * portal pages, and a document listing is the surface where that hurts most: a
 * scheme's circulars run to hundreds, and the alternative that keeps being
 * reached for is a scroll region inside a card, which
 * `data-state-completeness.md` §4 bans — on a phone a reader flicking the page
 * down moves the list instead of the page.
 */
export function CatalogueScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  actions,
  headingLevel = 1,
  filters,
  activeFilterCount = 0,
  onClearFilters,
  items,
  layout = "rows",
  noun = "document",
  pluralNoun,
  page = 1,
  totalPages = 1,
  hrefForPage,
  onPageChange,
  registerTotal,
  onRetry,
  emptyAction,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: CatalogueScreenProps): React.JSX.Element {
  const status = resolveScreenState({
    ...state,
    count: items.length,
    filtered: activeFilterCount > 0,
  });

  const shown = items.length;
  const matched = registerTotal ?? shown;
  const plural = pluralNoun ?? `${noun}s`;

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} actions={actions} />

      {filters ? <div className="sa-catalogue__filters">{filters}</div> : null}

      {status === "ready" ? (
        <p className="sa-screen__count">
          {shown === matched
            ? `${shown.toLocaleString("en-IN")} ${shown === 1 ? noun : plural}.`
            : activeFilterCount > 0
              ? `Showing ${shown.toLocaleString("en-IN")} of ${matched.toLocaleString("en-IN")} ${plural}, filtered.`
              : `Showing ${shown.toLocaleString("en-IN")} of ${matched.toLocaleString("en-IN")} ${plural}.`}
        </p>
      ) : null}

      <ScreenBody
        status={status}
        copy={copy}
        skeleton={layout === "cards" ? "cards" : "table"}
        onRetry={onRetry}
        onClearFilters={onClearFilters}
        emptyAction={emptyAction}
      >
        <div className="sa-catalogue">
          <ul className="sa-catalogue__list" data-layout={layout}>
            {items.map((item) => (
              <li key={item.id} className="sa-catalogue__item">
                <Icon
                  name={item.download ? "download" : item.external ? "open_in_new" : "description"}
                  size={24}
                  className="sa-catalogue__item-icon"
                  aria-hidden
                />

                <div className="sa-catalogue__item-main">
                  <p className="sa-catalogue__item-title">
                    {/* The whole title is the link. A separate "Download" link
                        beside a title gives a screen-reader user two entries
                        per row, one of which is called "Download" seventeen
                        times. */}
                    <Link
                      href={item.href}
                      external={item.external}
                      download={item.download}
                      variant="standalone"
                    >
                      {item.title}
                    </Link>
                    {item.badge ? (
                      <Badge status="info" size="sm">
                        {item.badge}
                      </Badge>
                    ) : null}
                  </p>
                  {item.description ? (
                    <p className="sa-catalogue__item-desc">{item.description}</p>
                  ) : null}
                  {item.meta ? <p className="sa-catalogue__item-meta">{item.meta}</p> : null}
                </div>

                {item.kind ? <span className="sa-catalogue__item-kind">{item.kind}</span> : null}
              </li>
            ))}
          </ul>

          {totalPages > 1 ? (
            <div className="sa-catalogue__pager">
              <Pagination
                page={page}
                totalPages={totalPages}
                hrefFor={hrefForPage}
                onPageChange={onPageChange}
                label={`${plural} pages`}
              />
            </div>
          ) : null}
        </div>
      </ScreenBody>
    </div>
  );
}
