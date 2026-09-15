"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Icon } from "../utilities/icon";
import { Chip } from "./chip";
import { ErrorSummary, type ErrorSummaryItem } from "./error-summary";
import "./forms.css";
import "./document-checklist.css";

export interface DocumentChecklistFilter {
  id: string;
  /** "Needs your attention". */
  label: string;
  count: number;
  /**
   * `danger` draws the chip in the error family while its count is above 0 — for the one filter
   * that lists what stops the reader. At 0 it falls back to the neutral chip.
   */
  tone?: "danger";
}

export interface DocumentChecklistProps {
  /** The accepted types and size, stated ONCE, where files are chosen: "PDF, JPG or PNG · up to 5 MB each". */
  formats?: React.ReactNode;
  /** Required documents that are ready. Progress counts READY, never "uploaded" — a rejected upload is not progress. */
  ready?: number;
  /** Required documents on the checklist. Omit both to hide the progress line. */
  required?: number;
  /** The words beside the bar. @default "{ready} of {required} required documents ready" */
  progressLabel?: string;
  /** The questions a reader has, each a filter chip with its count. Omit on a read-only list. */
  filters?: readonly DocumentChecklistFilter[];
  /** The selected chip. `null` shows every document. */
  activeFilter?: string | null;
  onFilterChange?: (id: string | null) => void;
  /** Called with the files dropped or chosen. Omit for a read-only list, and the drop zone is not drawn. */
  onFiles?: (files: File[]) => void;
  /** The file input's `accept`. */
  accept?: string;
  /** The drop zone's first line. @default "Drop all your documents here, or" */
  dropLabel?: React.ReactNode;
  /** The drop zone's second line. @default "We read each file and put it in the right place. You can move any we get wrong." */
  dropHint?: React.ReactNode;
  /** The keyboard route into the drop zone. @default "Choose Files" */
  chooseLabel?: string;
  /**
   * What the zone says on a touch screen or below 768px, where there is nothing to drag — the
   * whole line is the button. @default "Choose your documents"
   */
  touchLabel?: string;
  /** What stops the reader moving on, as links to the rows. Rendered as an ErrorSummary that takes focus. */
  errors?: readonly ErrorSummaryItem[];
  errorTitle?: React.ReactNode;
  /** Increment to move focus to the summary again when the same errors are raised twice. */
  errorsRevision?: number;
  /** Announced politely — a verdict arriving: "Budget Estimates: looks right". */
  politeMessage?: string;
  /** Announced at once — an upload failing. */
  assertiveMessage?: string;
  /** The placement tray, drawn between the drop zone and the list. */
  tray?: React.ReactNode;
  /** How many rows the current filter leaves. `0` with a filter selected draws the filtered-to-nothing state. */
  visibleCount?: number;
  /** Shown when the checklist itself has no documents. @default "No documents are asked for on this application." */
  emptyText?: React.ReactNode;
  /** Draw skeleton rows in the result's shape while the documents are being read. */
  loading?: boolean;
  /** The groups: DocumentChecklistGroup elements. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH DocumentChecklist — the header that answers "what do I have to do?" above a
 * grouped list of DocumentRows: progress counted as documents READY, filter chips for the
 * reader's three questions, one drop zone with a keyboard route, the ErrorSummary a blocked
 * Continue raises, and the live regions every verdict and failure is announced through.
 */
export function DocumentChecklist({
  formats,
  ready,
  required,
  progressLabel,
  filters,
  activeFilter = null,
  onFilterChange,
  onFiles,
  accept,
  dropLabel = "Drop all your documents here, or",
  dropHint = "We read each file and put it in the right place. You can move any we get wrong.",
  chooseLabel = "Choose Files",
  touchLabel = "Choose your documents",
  errors = [],
  errorTitle,
  errorsRevision = 0,
  politeMessage,
  assertiveMessage,
  tray,
  visibleCount,
  emptyText = "No documents are asked for on this application.",
  loading = false,
  children,
  className,
}: DocumentChecklistProps) {
  const reactId = React.useId();
  const progressId = `ds-doccheck-${reactId}-progress`;
  const input = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const depth = React.useRef(0);

  const hasProgress = ready != null && required != null && required > 0;
  const pct = hasProgress ? Math.round((Math.min(ready!, required!) / required!) * 100) : 0;
  const active = filters?.find((f) => f.id === activeFilter) ?? null;

  const take = (list: FileList | null) => {
    const files = list ? Array.from(list) : [];
    if (files.length > 0) onFiles?.(files);
  };

  return (
    <div className={cn("ds-doccheck", className)}>
      {errors.length > 0 && (
        <ErrorSummary key={errorsRevision} errors={[...errors]} title={errorTitle} className="ds-doccheck__errors" />
      )}

      {(hasProgress || formats != null) && (
        <div className="ds-doccheck__head">
          {/* The title and the formats share one line; the formats wrap under the title on a narrow screen. */}
          <div className="ds-doccheck__head-line">
            {hasProgress && (
              <p className="ds-doccheck__progress-label" id={progressId}>
                {progressLabel ?? `${Math.min(ready!, required!)} of ${required} required documents ready`}
              </p>
            )}
            {formats != null && <p className="ds-doccheck__formats">{formats}</p>}
          </div>
          {hasProgress && (
            <div className="ds-doccheck__progress">
              <span
                className="ds-doccheck__bar"
                role="progressbar"
                aria-labelledby={progressId}
                aria-valuemin={0}
                aria-valuemax={required}
                aria-valuenow={Math.min(ready!, required!)}
              >
                <span className="ds-doccheck__bar-fill" style={{ inlineSize: `${pct}%` }} />
              </span>
            </div>
          )}
        </div>
      )}

      {filters && filters.length > 0 && (
        <div className="ds-doccheck__filters" role="group" aria-label="Show documents">
          {filters.map((f) => (
            <Chip
              key={f.id}
              className={f.tone === "danger" && f.count > 0 ? "ds-doccheck__chip--danger" : undefined}
              selected={activeFilter === f.id}
              onSelectedChange={(on) => onFilterChange?.(on ? f.id : null)}
              count={f.count}
              countLabel="documents"
              disabled={f.count === 0 && activeFilter !== f.id}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      )}

      {onFiles && (
        <div
          className="ds-doccheck__drop"
          data-dragging={dragging || undefined}
          onDragEnter={(e) => {
            e.preventDefault();
            depth.current += 1;
            setDragging(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => {
            depth.current = Math.max(0, depth.current - 1);
            if (depth.current === 0) setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            depth.current = 0;
            setDragging(false);
            take(e.dataTransfer.files);
          }}
        >
          <Icon name="upload_file" size={24} aria-hidden />
          <div className="ds-doccheck__drop-copy">
            {/* Two wordings, one shown: a pointer can drag, a thumb cannot. The hidden one is display:none,
                so a screen reader meets only one. */}
            <p className="ds-doccheck__drop-label ds-doccheck__drop-label--pointer">
              {dropLabel}{" "}
              <Button appearance="text" size="sm" onClick={() => input.current?.click()}>
                {chooseLabel}
              </Button>
            </p>
            <p className="ds-doccheck__drop-label ds-doccheck__drop-label--touch">
              <button type="button" className="ds-doccheck__touch-choose" onClick={() => input.current?.click()}>
                {touchLabel}
              </button>
            </p>
            {dropHint != null && <p className="ds-doccheck__drop-hint">{dropHint}</p>}
          </div>
          <input
            ref={input}
            type="file"
            multiple
            accept={accept}
            className="ds-sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              take(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {tray}

      {loading ? (
        <div className="ds-doccheck__loading" role="status" aria-live="polite">
          <span className="ds-sr-only">Loading the documents…</span>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="ds-doccheck__skeleton" aria-hidden="true" />
          ))}
        </div>
      ) : visibleCount === 0 ? (
        <div className="ds-doccheck__empty">
          {active ? (
            <>
              <p>No documents are in “{active.label}”.</p>
              <Button appearance="outlined" size="sm" onClick={() => onFilterChange?.(null)}>
                Show All Documents
              </Button>
            </>
          ) : (
            <p>{emptyText}</p>
          )}
        </div>
      ) : (
        <div className="ds-doccheck__groups">{children}</div>
      )}

      <div className="ds-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {politeMessage}
      </div>
      <div className="ds-sr-only" role="alert" aria-live="assertive" aria-atomic="true">
        {assertiveMessage}
      </div>
    </div>
  );
}

export interface DocumentChecklistGroupProps {
  /** The group's name, as the scheme groups its documents: "Registration & Identity". */
  title: React.ReactNode;
  /** A line under the title: "Verified and remarked each year". */
  description?: React.ReactNode;
  /** A count or status at the right of the heading: "2 of 3 ready". */
  meta?: React.ReactNode;
  /** @default 3 */
  headingLevel?: 2 | 3 | 4;
  /** DocumentRow elements. */
  children?: React.ReactNode;
  className?: string;
}

/** One group of a DocumentChecklist: a heading and a divided list of rows. */
export function DocumentChecklistGroup({ title, description, meta, headingLevel = 3, children, className }: DocumentChecklistGroupProps) {
  const id = React.useId();
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <section className={cn("ds-doccheck__group", className)} aria-labelledby={`${id}-title`}>
      <div className="ds-doccheck__group-head">
        <div>
          <Heading className="ds-doccheck__group-title" id={`${id}-title`}>
            {title}
          </Heading>
          {description != null && <p className="ds-doccheck__group-desc">{description}</p>}
        </div>
        {meta != null && <p className="ds-doccheck__group-meta">{meta}</p>}
      </div>
      <ul className="ds-doccheck__rows">{children}</ul>
    </section>
  );
}
