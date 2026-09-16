"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { IconButton } from "../actions/icon-button";
import { Menu, type MenuEntry } from "../actions/menu";
import { navLinkRoutes } from "../navigation/header/nav-link-tag";
import "./forms.css";
import "./document-row.css";

/**
 * The ten states a document can be in on an upload, review, correction or officer screen.
 *
 * `missing` a required document with no file · `optional` an optional one with none ·
 * `uploading` in flight (pass `progress`) · `failed` the upload did not arrive ·
 * `rejected` refused on the device before upload (wrong type, too large) · `checking` the
 * automatic check is running · `verified` the check found it right · `review` the check could
 * not be sure, so the reader is pointed at what it found · `invalid` the check found the wrong
 * document ·
 * `unavailable` the check could not run, the file is saved for a hand check.
 */
export type DocumentRowState =
  | "missing"
  | "optional"
  | "uploading"
  | "failed"
  | "rejected"
  | "checking"
  | "verified"
  | "review"
  | "invalid"
  | "unavailable";

export interface DocumentRowFile {
  /** The file's name, as uploaded. */
  name: string;
  /** "812 KB". */
  size?: string;
  /** "14 Sep 2026". */
  date?: string;
  /** Where the file opens. With `linkAs`, a same-site path routes through the app's link. */
  href?: string;
}

export interface DocumentRowProps {
  /** The document's name, as the scheme's checklist words it. */
  title: React.ReactNode;
  /** The title's element. A row that stands alone as a section — one correction — takes a heading. @default "p" */
  titleAs?: "p" | "h2" | "h3" | "h4";
  /** The position on the checklist, printed before the title. */
  number?: number;
  /** A red asterisk and a visually hidden "(required)". Optional documents are marked by state instead. */
  required?: boolean;
  /** One of the ten states. Decides the icon, the colour and the default words. */
  state: DocumentRowState;
  /**
   * The words beside the icon. Defaults to the applicant's words for the state — "Looks right",
   * "Check the details", "Doesn't match". An officer's screen passes its own ("Automatic check ·
   * Does not match · 95%"), because confidence is advice for an officer and noise for an applicant.
   */
  statusLabel?: React.ReactNode;
  /** 0–100, drawn as a bar while `state` is `uploading`. */
  progress?: number;
  /** A line under the title: a condition such as "Required when the building is rented". */
  hint?: React.ReactNode;
  /** The current file. Omit when nothing is uploaded. */
  file?: DocumentRowFile;
  /**
   * ONE sentence under the row saying what is wrong — shown only when the document needs
   * something. A row that needs nothing stays one line high.
   */
  reason?: React.ReactNode;
  /** A remark ABOVE the row — the Ministry's query on a correction screen. */
  remark?: React.ReactNode;
  /** The label before `remark`. @default "Ministry's remark" */
  remarkLabel?: string;
  /** The one primary control: Upload, Try Again, Replace, Choose Another File. */
  action?: React.ReactNode;
  /** The row menu — View, Replace, Check Again, Upload History, Remove. Omit for a read-only row with no commands. */
  menu?: { items: MenuEntry[]; onSelect: (id: string) => void };
  /** What the check found, revealed in place by a disclosure under the row. */
  findings?: React.ReactNode;
  /** The disclosure's label. @default "What we found" */
  findingsLabel?: string;
  /**
   * Draw the disclosure button under the row. @default true
   *
   * Turn it off for a row that needs nothing — a verified document stays one line high — and open
   * the findings from the row menu with `findingsOpen` instead.
   */
  showFindingsToggle?: boolean;
  /** Controlled disclosure state. */
  findingsOpen?: boolean;
  onFindingsOpenChange?: (open: boolean) => void;
  /**
   * The officer's own verdict. Beside the row on a wide row; under the title — with the status —
   * once the row is narrower than about 760px, so the title is never squeezed to a word a line.
   */
  aside?: React.ReactNode;
  /**
   * The row can fold to one line: icon, title, `summary`, the status words, the action and the
   * menu. The file, hint, reason, findings and `aside` sit behind a "Details" disclosure.
   *
   * For a document that needs nothing more from the reader — an officer's list where most
   * documents were verified by an earlier grade. A document still to review, or one that needs
   * correction, is not collapsible: what the reader must act on is never folded away.
   */
  collapsible?: boolean;
  /**
   * Row density. @default "default"
   *
   * `compact` is the REVIEWED-DOCUMENT row for an officer's list. From a 520px row it is two
   * lines — title, verdict (`aside`) and actions, with the file and the status as small print
   * beneath — and from 960px one line: icon · title · file · status · verdict · actions. Tighter
   * padding; the title and file cut to one line each (full text on hover and to a screen
   * reader); on a `collapsible` row the hint waits behind Details. It exists because a
   * 20-document review ran about 3,700px at 185px a row (e-Anudaan audit R-03). Below 520px it
   * stacks exactly like the default row. The `aside` should itself be compact — a segmented
   * verdict or a small select — for the first line to hold.
   */
  density?: "default" | "compact";
  /**
   * Cut `reason` to one line wherever the row is 640px or wider. @default false
   *
   * For a list where many rows carry the same reason: the sentence is still read in full by a
   * screen reader and on hover, and the whole of it belongs inside `findings` ("What we found").
   * Ten rows repeating one two-line sentence ran 1,600px (e-Anudaan audit D-03). On a phone the
   * reason wraps as before.
   */
  clampReason?: boolean;
  /** Controlled fold state for a `collapsible` row. Uncontrolled rows start folded. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** The line a folded row shows before the status — "Verified by ASO, 21 Jul 2026". */
  summary?: React.ReactNode;
  /** The app's router link (`next/link`), for `file.href`. Defaults to a plain anchor. */
  linkAs?: React.ElementType;
  /** Rendered on the row, so an ErrorSummary or a status message can point at it. */
  id?: string;
  /** `li` inside a DocumentChecklistGroup; `div` alone. @default "li" */
  as?: "li" | "div";
  className?: string;
}

const DEFAULT_WORDS: Record<DocumentRowState, string> = {
  missing: "Not uploaded",
  optional: "Optional",
  uploading: "Uploading",
  failed: "Upload failed",
  rejected: "Can't be uploaded",
  checking: "Checking…",
  verified: "Looks right",
  review: "Check the details",
  invalid: "Doesn't match",
  unavailable: "Saved — an officer will check it",
};

const ICON: Record<DocumentRowState, string | null> = {
  missing: "radio_button_unchecked",
  optional: null,
  uploading: "progress_activity",
  failed: "error",
  rejected: "error",
  checking: "progress_activity",
  verified: "check_circle",
  review: "warning",
  invalid: "report",
  unavailable: "info",
};

/**
 * MoSJE / SAMAVESH DocumentRow — one document as a compact row: status icon, title, the file,
 * the status in words, one primary action and a menu.
 *
 * Height follows need. A row that needs nothing is one line; a row that needs the reader grows by
 * one sentence saying why, and everything else — every reason, extracted fields, history — sits
 * behind "What we found" and the menu. Status is always WORDS with a distinct icon, never colour
 * alone; the icon is decorative.
 */
export function DocumentRow({
  title,
  titleAs = "p",
  number,
  required,
  state,
  statusLabel,
  progress,
  hint,
  file,
  reason,
  remark,
  remarkLabel = "Ministry's remark",
  action,
  menu,
  findings,
  findingsLabel = "What we found",
  showFindingsToggle = true,
  findingsOpen,
  onFindingsOpenChange,
  aside,
  collapsible = false,
  expanded,
  onExpandedChange,
  summary,
  density = "default",
  clampReason = false,
  linkAs,
  id,
  as = "li",
  className,
}: DocumentRowProps) {
  const reactId = React.useId();
  const baseId = id ?? `ds-docrow-${reactId}`;
  const titleId = `${baseId}-title`;
  const findingsId = `${baseId}-findings`;
  const [openState, setOpenState] = React.useState(false);
  const open = findingsOpen ?? openState;
  const setOpen = (next: boolean) => {
    if (findingsOpen === undefined) setOpenState(next);
    onFindingsOpenChange?.(next);
  };

  const [expandedState, setExpandedState] = React.useState(false);
  const isExpanded = expanded ?? expandedState;
  const setExpanded = (next: boolean) => {
    if (expanded === undefined) setExpandedState(next);
    onExpandedChange?.(next);
  };
  const folded = collapsible && !isExpanded;
  // Drawn in two places and shown in one: beside the status on a row with room, and after the
  // actions on a narrow one, where a line of its own made every folded row a line taller. The
  // hidden copy is display: none, so a screen reader meets exactly one.
  const expandToggle = (at: "status" | "actions") => (
    <button
      type="button"
      className={cn("ds-docrow__disclosure", "ds-docrow__expand", `ds-docrow__expand--${at}`)}
      aria-expanded={isExpanded}
      aria-label={titleText ? `${isExpanded ? "Hide" : "Show"} details of ${titleText}` : undefined}
      onClick={() => setExpanded(!isExpanded)}
    >
      {isExpanded ? "Hide Details" : "Details"}
      <Icon name={isExpanded ? "expand_less" : "expand_more"} size={20} aria-hidden />
    </button>
  );

  const Tag = as;
  const TitleTag = titleAs;
  const icon = ICON[state];
  const pct = Math.max(0, Math.min(100, Math.round(progress ?? 0)));
  const words = statusLabel ?? (state === "uploading" ? `${DEFAULT_WORDS.uploading} ${pct}%` : DEFAULT_WORDS[state]);
  const fileMeta = file ? [file.size, file.date].filter(Boolean).join(" · ") : "";
  const FileLink: React.ElementType | null = !file?.href ? null : navLinkRoutes({ href: file.href }, linkAs) ? linkAs! : "a";
  const titleText = typeof title === "string" ? title : undefined;

  return (
    <Tag
      id={baseId}
      className={cn(
        "ds-docrow",
        aside != null && "ds-docrow--aside",
        folded && "ds-docrow--folded",
        density === "compact" && "ds-docrow--compact",
        clampReason && "ds-docrow--clamp-reason",
        className,
      )}
      /* The ONE hook for the state, and deliberately the only one: the stylesheet draws the
         error accent, the icon colour and the status colour from it, and a consumer styling a
         row reads it too. A second `ds-docrow--attention` class was emitted here with no rule
         anywhere to match it; the list order it looked like it was for is decided in the
         page's data (`orderForAttention`), never in CSS. */
      data-state={state}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      {remark != null && (
        <p className="ds-docrow__remark">
          <span className="ds-docrow__remark-label">{remarkLabel}: </span>
          {remark}
        </p>
      )}

      <div className="ds-docrow__line">
        <span className="ds-docrow__icon" aria-hidden="true">
          {icon && <Icon name={icon} size={20} fill={state === "verified" || state === "failed" || state === "rejected"} />}
        </span>

        <div className="ds-docrow__main">
          <TitleTag className="ds-docrow__title" id={titleId} title={density === "compact" ? titleText : undefined}>
            {number != null && <span className="ds-docrow__number">{number}. </span>}
            {title}
            {required && (
              <>
                <span className="ds-field__required" aria-hidden="true">*</span>
                <span className="ds-sr-only"> (required)</span>
              </>
            )}
          </TitleTag>
          {hint != null && !folded && (density !== "compact" || !collapsible || isExpanded) && (
            <p className="ds-docrow__hint">{hint}</p>
          )}
        </div>

        {!folded && (
        <div className="ds-docrow__file">
          {file ? (
            <>
              {FileLink ? (
                <FileLink className="ds-docrow__file-name ds-docrow__file-link" href={file.href} title={file.name}>
                  <FileName name={file.name} />
                </FileLink>
              ) : (
                <span className="ds-docrow__file-name" title={file.name}>
                  <FileName name={file.name} />
                </span>
              )}
              {fileMeta && <span className="ds-docrow__file-meta">{fileMeta}</span>}
            </>
          ) : (
            <span className="ds-docrow__file-none" aria-hidden="true">—</span>
          )}
        </div>
        )}

        <div className="ds-docrow__status">
          {folded && summary != null && <span className="ds-docrow__summary">{summary}</span>}
          <span className="ds-docrow__status-words">{words}</span>
          {state === "uploading" && (
            <span
              className="ds-docrow__progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-label={titleText ? `Uploading ${titleText}` : "Upload progress"}
            >
              <span className="ds-docrow__progress-bar" style={{ inlineSize: `${pct}%` }} />
            </span>
          )}
          {collapsible && expandToggle("status")}
        </div>

        {/* Before the actions in reading order: what is wrong, then what to do about it. */}
        {!folded && (reason != null || (findings != null && showFindingsToggle)) && (
          <div className="ds-docrow__more">
            {reason != null && (
              <p className="ds-docrow__reason" title={clampReason && typeof reason === "string" ? reason : undefined}>
                {reason}
              </p>
            )}
            {findings != null && showFindingsToggle && (
              <button
                type="button"
                className="ds-docrow__disclosure"
                aria-expanded={open}
                aria-controls={findingsId}
                /* Named for its own document, as Replace, Try Again, Details and the menu already
                   are. Sixteen rows on the AVYAY upload step drew sixteen buttons whose accessible
                   name was the identical "What we found", so a screen reader's button list gave no
                   way to tell which document any of them opened. */
                aria-label={titleText ? `${findingsLabel}: ${titleText}` : undefined}
                onClick={() => setOpen(!open)}
              >
                {findingsLabel}
                <Icon name={open ? "expand_less" : "expand_more"} size={20} aria-hidden />
              </button>
            )}
          </div>
        )}

        {(action != null || menu || collapsible) && (
          <div className="ds-docrow__actions">
            {action}
            {menu && menu.items.length > 0 && (
              <Menu items={menu.items} onSelect={menu.onSelect} label={titleText ? `More actions for ${titleText}` : "More actions"}>
                <IconButton
                  appearance="text"
                  size="sm"
                  icon={<Icon name="more_horiz" size={20} aria-hidden />}
                  aria-label={titleText ? `More actions for ${titleText}` : "More actions"}
                />
              </Menu>
            )}
            {collapsible && expandToggle("actions")}
          </div>
        )}

        {aside != null && !folded && <div className="ds-docrow__aside">{aside}</div>}
      </div>

      {findings != null && !folded && (
        <div className="ds-docrow__findings" id={findingsId} hidden={!open}>
          {findings}
        </div>
      )}
    </Tag>
  );
}

/**
 * A file name that is cut in its STEM, never in its extension: "PAN_Card_of_the_Orga… .pdf", not
 * "PAN_Card_of_the_Organisation.pd / f" (e-Anudaan audit D-05). The extension is what tells a
 * reader which of two scans they are looking at, and a break inside it read as a broken name.
 * One text node to a screen reader — the two spans are presentational — and the full name is on
 * the parent's `title`.
 */
function FileName({ name }: { name: string }) {
  const dot = name.lastIndexOf(".");
  // No extension, a dotfile, or an "extension" too long to be one: draw the name whole.
  if (dot <= 0 || name.length - dot > 6) return <span className="ds-docrow__file-stem">{name}</span>;
  return (
    <>
      <span className="ds-docrow__file-stem">{name.slice(0, dot)}</span>
      <span className="ds-docrow__file-ext">{name.slice(dot)}</span>
    </>
  );
}
