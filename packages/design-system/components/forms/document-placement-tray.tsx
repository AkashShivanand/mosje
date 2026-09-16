"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Icon } from "../utilities/icon";
import { Select } from "./select";
import "./forms.css";
import "./document-placement-tray.css";

export interface DocumentPlacement {
  id: string;
  fileName: string;
  /** "812 KB". */
  size?: string;
  /** The document it was put in, or `null` when it could not be placed. */
  targetId: string | null;
  /** The file it replaced in that document, which moved to the document's history. */
  replaces?: string;
  /** Why the file was refused before upload — "This file is 7.2 MB. The limit is 5 MB." Refused files are listed, never placed. */
  rejected?: React.ReactNode;
  /** Why an unplaced file is unplaced. @default "We couldn't tell what this is." */
  unplacedReason?: React.ReactNode;
}

export interface DocumentPlacementOption {
  id: string;
  label: string;
  /** Already holds a file. Listed after the empty ones. */
  filled?: boolean;
}

export interface DocumentPlacementTrayProps {
  /** One line per file dropped, in the order dropped. */
  items: readonly DocumentPlacement[];
  /** Every document a file can go to. */
  options: readonly DocumentPlacementOption[];
  /** A file was moved to another document, or (`null`) taken out of one. */
  onChange: (itemId: string, targetId: string | null) => void;
  /** Take an unplaced or refused file off the list. */
  onRemove?: (itemId: string) => void;
  /** Close the tray. The placements stand. */
  onDone: () => void;
  /** The heading. @default "We placed N of M files." */
  title?: React.ReactNode;
  /**
   * Beyond this many plainly placed files, they fold behind "Show N More Placed Files" and the
   * lines that need a look — unplaced, refused, replacing — lead. A 17-file drop otherwise pushes
   * the checklist a screen and a half down to report sixteen things that went right. @default 4
   */
  collapseAfter?: number;
  className?: string;
}

/**
 * MoSJE / SAMAVESH DocumentPlacementTray — what a batch drop did, shown line by line.
 *
 * Dropping files never replaces a document silently. Every file is listed with where it went and
 * a one-click way to change it; a file that could not be placed is listed with a "Choose a
 * document" select (empty documents first), never dropped; a file placed onto a document that
 * already had one says what it replaced, and that file moves to the document's history.
 */
export function DocumentPlacementTray({ items, options, onChange, onRemove, onDone, title, collapseAfter = 4, className }: DocumentPlacementTrayProps) {
  const headingId = React.useId();
  const [expanded, setExpanded] = React.useState(false);
  const needsLook = (i: DocumentPlacement) => !!i.rejected || i.targetId == null || !!i.replaces;
  const leading = items.filter(needsLook);
  const plain = items.filter((i) => !needsLook(i));
  const folded = !expanded && leading.length + plain.length > collapseAfter;
  const peek = Math.max(1, collapseAfter - leading.length);
  const shown = folded ? [...leading, ...plain.slice(0, peek)] : [...leading, ...plain];
  const hidden = plain.length - (folded ? Math.min(peek, plain.length) : 0);
  const placed = items.filter((i) => i.targetId != null).length;
  const heading =
    title ??
    (items.length === 1
      ? placed === 1
        ? "We placed your file."
        : "We couldn't place your file."
      : `We placed ${placed} of ${items.length} files.`);
  const ordered = [...options].sort((a, b) => Number(!!a.filled) - Number(!!b.filled));

  return (
    <section className={cn("ds-doctray", className)} aria-labelledby={headingId}>
      <div className="ds-doctray__head">
        <h3 className="ds-doctray__title" id={headingId}>
          {heading}
        </h3>
        <Button size="sm" onClick={onDone}>
          Done
        </Button>
      </div>
      <ul className="ds-doctray__list">
        {shown.map((item) => {
          const selectId = `${headingId}-${item.id}`;
          const status = item.rejected ? "rejected" : item.targetId ? "placed" : "unplaced";
          return (
            <li key={item.id} className="ds-doctray__item" data-status={status}>
              <span className="ds-doctray__icon" aria-hidden="true">
                <Icon name={status === "placed" ? "check_circle" : status === "rejected" ? "error" : "help"} size={20} fill={status !== "unplaced"} />
              </span>
              <span className="ds-doctray__file">
                <span className="ds-doctray__file-name">{item.fileName}</span>
                {item.size && <span className="ds-doctray__file-size">{item.size}</span>}
              </span>
              <span className="ds-doctray__arrow" aria-hidden="true">
                <Icon name="arrow_forward" size={16} />
              </span>
              <span className="ds-doctray__where">
                {status === "rejected" ? (
                  <span className="ds-doctray__note ds-doctray__note--error">{item.rejected}</span>
                ) : (
                  <>
                    {status === "unplaced" && (
                      <span className="ds-doctray__note">{item.unplacedReason ?? "We couldn't tell what this is."}</span>
                    )}
                    <label className="ds-sr-only" htmlFor={selectId}>
                      {status === "placed" ? `Document for ${item.fileName}` : `Choose a document for ${item.fileName}`}
                    </label>
                    <Select
                      id={selectId}
                      size="sm"
                      value={item.targetId ?? ""}
                      onChange={(e) => onChange(item.id, e.target.value || null)}
                    >
                      <option value="">{status === "placed" ? "Not placed" : "Choose a document"}</option>
                      {ordered.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                          {o.filled && o.id !== item.targetId ? " (has a file)" : ""}
                        </option>
                      ))}
                    </Select>
                    {item.replaces && item.targetId && (
                      <span className="ds-doctray__note">
                        Replaces {item.replaces}, which stays in this document&rsquo;s history.
                      </span>
                    )}
                  </>
                )}
              </span>
              {status !== "placed" && onRemove && (
                <span className="ds-doctray__remove">
                  <Button appearance="text" size="sm" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.fileName} from this list`}>
                    Remove
                  </Button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {leading.length + plain.length > collapseAfter && plain.length > Math.max(1, collapseAfter - leading.length) && (
        <div>
          <Button appearance="text" size="sm" aria-expanded={!folded} onClick={() => setExpanded((e) => !e)}>
            {folded ? `Show ${hidden} More Placed File${hidden === 1 ? "" : "s"}` : "Show Fewer"}
          </Button>
        </div>
      )}
    </section>
  );
}
