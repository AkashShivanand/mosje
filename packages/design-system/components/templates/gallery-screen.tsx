"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { Lightbox, type LightboxItem } from "../feedback/lightbox";
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

/** One piece of media the reader manages. */
export interface GalleryItem extends LightboxItem {
  id: string;
  /** A smaller image for the tile. Falls back to `poster`, then `src`. */
  thumbnail?: string;
  /** Date, event, photographer — the line under the caption in list view. */
  meta?: React.ReactNode;
  /**
   * Per-item controls — download, remove, set as cover.
   *
   * **The same set in both layouts.** The toggle changes density, not
   * capability: a reader who switched to grid to see more at once has not
   * asked to lose the ability to delete anything.
   */
  actions?: React.ReactNode;
}

export interface GalleryScreenProps extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  filters?: React.ReactNode;
  activeFilterCount?: number;
  onClearFilters?: () => void;

  items: GalleryItem[];
  /** Names the collection for a screen reader — "Photographs from the camp". */
  label: string;

  /** @default "grid" */
  layout?: "grid" | "list";
  /** Drive it from the URL where the choice should survive a share. */
  onLayoutChange?: (layout: "grid" | "list") => void;

  page?: number;
  totalPages?: number;
  hrefForPage?: (page: number) => string;
  onPageChange?: (page: number) => void;

  onRetry?: () => void;
  emptyAction?: React.ReactNode;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * GalleryScreen — media a reader manages.
 *
 * **Grid and list are the same capability at two densities.** Every per-item
 * action is present in both; the grid shows more at once, the list shows more
 * about each. A toggle that also removes controls is a toggle readers learn to
 * distrust, and it strands anyone who chose the denser view for a reason.
 *
 * **Every image carries alt text and every video carries captions, or the
 * component says so.** `Lightbox` warns in development when a video with speech
 * arrives without a WebVTT track, because it cannot author captions and
 * WCAG 1.2.2 requires them. This template does not suppress that warning — a
 * gallery of departmental event footage is exactly where it gets skipped.
 *
 * **The lightbox opens where the reader clicked and returns them there.** Focus
 * moves into the dialogue and back to the tile on close; without that, closing
 * a lightbox on the fortieth photograph returns a keyboard user to the top of
 * the page.
 */
export function GalleryScreen({
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
  label,
  layout = "grid",
  onLayoutChange,
  page = 1,
  totalPages = 1,
  hrefForPage,
  onPageChange,
  onRetry,
  emptyAction,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: GalleryScreenProps): React.JSX.Element {
  const status = resolveScreenState({
    ...state,
    count: items.length,
    filtered: activeFilterCount > 0,
  });

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  /* Where focus returns when the lightbox closes. Without it a keyboard reader
     who opened the fortieth photograph is put back at the top of the page. */
  const triggers = React.useRef<Array<HTMLButtonElement | null>>([]);

  const close = React.useCallback(() => {
    const index = openIndex;
    setOpenIndex(null);
    if (index != null) triggers.current[index]?.focus();
  }, [openIndex]);

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} actions={actions} />

      <div className="sa-gallery__toolbar">
        {filters ? <div className="sa-gallery__filters">{filters}</div> : null}

        {onLayoutChange ? (
          <div className="sa-gallery__layout" role="group" aria-label="Layout">
            {(["grid", "list"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className="sa-gallery__layout-button"
                aria-pressed={layout === option}
                onClick={() => onLayoutChange(option)}
              >
                <Icon name={option === "grid" ? "grid_view" : "view_list"} size={20} aria-hidden />
                {option === "grid" ? "Grid" : "List"}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <ScreenBody
        status={status}
        copy={copy}
        skeleton="cards"
        onRetry={onRetry}
        onClearFilters={onClearFilters}
        emptyAction={emptyAction}
      >
        <div className="sa-gallery">
          <ul className="sa-gallery__items" data-layout={layout} aria-label={label}>
            {items.map((item, index) => (
              <li key={item.id} className="sa-gallery__item">
                <button
                  type="button"
                  ref={(node) => {
                    triggers.current[index] = node;
                  }}
                  className="sa-gallery__tile"
                  onClick={() => setOpenIndex(index)}
                >
                  {/* Plain `img`: the sources here are data-URLs and uploaded
                      assets of unknown dimensions, which is the case
                      `next/image` cannot serve without a width and height it
                      does not have. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail ?? item.poster ?? item.src}
                    alt={item.alt ?? item.caption ?? ""}
                    className="sa-gallery__thumb"
                    loading="lazy"
                  />
                  {item.type === "video" ? (
                    <Icon
                      name="play_circle"
                      size={32}
                      className="sa-gallery__play"
                      aria-label="Video"
                    />
                  ) : null}
                </button>

                <div className="sa-gallery__body">
                  {item.caption ? (
                    <p className="sa-gallery__caption">{item.caption}</p>
                  ) : null}
                  {item.meta ? <p className="sa-gallery__meta">{item.meta}</p> : null}
                  {item.actions ? (
                    <div className="sa-gallery__actions">{item.actions}</div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 ? (
            <div className="sa-gallery__pager">
              <Pagination
                page={page}
                totalPages={totalPages}
                hrefFor={hrefForPage}
                onPageChange={onPageChange}
                label="Gallery pages"
              />
            </div>
          ) : null}
        </div>
      </ScreenBody>

      <Lightbox
        open={openIndex != null}
        items={items}
        index={openIndex ?? 0}
        onClose={close}
        onIndexChange={setOpenIndex}
      />
    </div>
  );
}
