"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Icon } from "../utilities/icon";
import { Chip } from "./chip";
import { ErrorSummary, type ErrorSummaryItem } from "./error-summary";
import { Modal } from "../feedback/modal";
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

/**
 * A verdict given to many documents at once, behind a confirmation — "Mark All Remaining as
 * Verified". For an officer's review, where most rows are automatically checked and the officer
 * would otherwise set twenty verdicts one by one (e-Anudaan audit R-01, R-03).
 *
 * The DS draws the affordance and the confirmation; the CALLER decides which documents count as
 * "remaining", records one verdict per document (so each stays individually auditable), and
 * never includes a document the automatic check flagged. `count` is that set's size, and the
 * control is not drawn when it is 0.
 */
export interface DocumentBulkActionProps {
  /** The button: "Mark All Remaining as Verified". The count is appended in brackets. */
  label: string;
  /** How many documents the action will record a verdict for. 0 draws nothing. */
  count: number;
  /** One line beside the button saying what "remaining" means: "12 not yet reviewed; the automatic check found nothing wrong with them." */
  description?: React.ReactNode;
  /** @default "Mark {count} Documents as Verified?" */
  confirmTitle?: string;
  /** The dialog body: what will be recorded, and that each verdict can still be changed. */
  confirmDescription?: React.ReactNode;
  /** @default "Mark as Verified" */
  confirmLabel?: string;
  /** @default "Cancel" */
  cancelLabel?: string;
  /** Called once, after the reader confirms. */
  onConfirm: () => void;
  /** Draws the button disabled with `disabledReason` beside it, e.g. while the file is read-only. */
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  className?: string;
}

/**
 * DocumentBulkAction — one button and one confirmation for a verdict given to many documents.
 * Drawn by `DocumentChecklist`'s `bulkAction`, or placed on its own (a decision aside).
 */
export function DocumentBulkAction({
  label,
  count,
  description,
  confirmTitle,
  confirmDescription,
  confirmLabel = "Mark as Verified",
  cancelLabel = "Cancel",
  onConfirm,
  disabled = false,
  disabledReason,
  className,
}: DocumentBulkActionProps) {
  const [open, setOpen] = React.useState(false);
  if (count <= 0) return null;
  const noun = count === 1 ? "Document" : "Documents";
  return (
    <div className={cn("ds-doccheck__bulk", className)}>
      {(disabled ? disabledReason : description) != null && (
        <p className="ds-doccheck__bulk-text">{disabled ? disabledReason : description}</p>
      )}
      <Button appearance="outlined" size="sm" disabled={disabled} onClick={() => setOpen(true)}>
        <Icon name="done_all" size={16} aria-hidden /> {`${label} (${count})`}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title={confirmTitle ?? `Mark ${count} ${noun} as Verified?`}
        footer={
          <>
            <Button appearance="outlined" onClick={() => setOpen(false)}>
              {cancelLabel}
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
            >
              {confirmLabel}
            </Button>
          </>
        }
      >
        {confirmDescription != null ? (
          typeof confirmDescription === "string" ? (
            <p className="ds-doccheck__bulk-confirm">{confirmDescription}</p>
          ) : (
            confirmDescription
          )
        ) : (
          <p className="ds-doccheck__bulk-confirm">
            {`A verdict of Verified will be recorded against each of the ${count} ${noun.toLowerCase()}, in your name. Each can still be changed one by one before the file is forwarded.`}
          </p>
        )}
      </Modal>
    </div>
  );
}

export interface DocumentChecklistProps {
  /**
   * The accepted types and size, stated ONCE, where files are chosen: "PDF, JPG or PNG · up to 5
   * MB each". Drawn INSIDE the drop zone when there is one, and in the header line otherwise.
   */
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
  /**
   * Draw the drop zone as one quiet line. @default false
   *
   * Pass it once documents are in: a first visit needs the full zone to learn that files can be
   * dropped together; a list that is mostly filled needs the documents, not a 90px box above them.
   */
  compactDrop?: boolean;
  /** What stops the reader moving on, as links to the rows. Rendered as an ErrorSummary that takes focus. */
  errors?: readonly ErrorSummaryItem[];
  errorTitle?: React.ReactNode;
  /** Increment to move focus to the summary again when the same errors are raised twice. */
  errorsRevision?: number;
  /** Announced politely — a verdict arriving: "Budget Estimates: looks right". */
  politeMessage?: string;
  /** Announced at once — an upload failing. */
  assertiveMessage?: string;
  /**
   * A verdict for many documents at once, drawn above the groups — see `DocumentBulkActionProps`.
   * Officer screens only. Omit, or pass `count: 0`, and nothing is drawn.
   */
  bulkAction?: DocumentBulkActionProps;
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
  compactDrop = false,
  errors = [],
  errorTitle,
  errorsRevision = 0,
  politeMessage,
  assertiveMessage,
  tray,
  bulkAction,
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
  // A chip that would filter to nothing is noise, and one chip filters nothing: the bar shows the
  // chips that have documents, and only when there is a choice to make (upload polish, 17 Sep 2026).
  const shownFilters = (filters ?? []).filter((f) => f.count > 0 || f.id === activeFilter);
  const showFilters = shownFilters.length > 1 || activeFilter != null;
  // The accepted types belong where the files are chosen. With a drop zone they move into it.
  const formatsInDrop = Boolean(onFiles) && formats != null;

  const take = (list: FileList | null) => {
    const files = list ? Array.from(list) : [];
    if (files.length > 0) onFiles?.(files);
  };

  return (
    <div className={cn("ds-doccheck", className)}>
      {errors.length > 0 && (
        <ErrorSummary key={errorsRevision} errors={[...errors]} title={errorTitle} className="ds-doccheck__errors" />
      )}

      {(hasProgress || (formats != null && !formatsInDrop)) && (
        <div className="ds-doccheck__head">
          {/* The title and the formats share one line; the formats wrap under the title on a narrow screen. */}
          <div className="ds-doccheck__head-line">
            {hasProgress && (
              <p className="ds-doccheck__progress-label" id={progressId}>
                {progressLabel ?? `${Math.min(ready!, required!)} of ${required} required documents ready`}
              </p>
            )}
            {formats != null && !formatsInDrop && <p className="ds-doccheck__formats">{formats}</p>}
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

      {showFilters && (
        <div className="ds-doccheck__filters" role="group" aria-label="Show documents">
          {shownFilters.map((f) => (
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
          className={cn("ds-doccheck__drop", compactDrop && "ds-doccheck__drop--compact")}
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
          <Icon name="upload_file" size={compactDrop ? 20 : 24} aria-hidden />
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
            {dropHint != null && !compactDrop && <p className="ds-doccheck__drop-hint">{dropHint}</p>}
            {formatsInDrop && <p className="ds-doccheck__drop-formats">{formats}</p>}
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

      {bulkAction && !loading ? <DocumentBulkAction {...bulkAction} /> : null}

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
  /**
   * Withhold the visible required asterisk on every row in this group. @default false
   *
   * For a group whose heading already says so — "Required Documents" — where an asterisk on
   * every title is the same fact ten times (e-Anudaan audit D-04). Each row keeps its visually
   * hidden "(required)". Leave it off for a mixed group.
   */
  hideRequiredMarks?: boolean;
  /** DocumentRow elements. */
  children?: React.ReactNode;
  className?: string;
}

/** One group of a DocumentChecklist: a heading and a divided list of rows. */
export function DocumentChecklistGroup({
  title,
  description,
  meta,
  headingLevel = 3,
  hideRequiredMarks = false,
  children,
  className,
}: DocumentChecklistGroupProps) {
  const id = React.useId();
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <section
      className={cn("ds-doccheck__group", hideRequiredMarks && "ds-doccheck__group--no-marks", className)}
      aria-labelledby={`${id}-title`}
    >
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
