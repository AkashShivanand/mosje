import * as React from "react";
import { cn } from "../../utils/cn";
import "./forms.css";
import "./document-tile.css";

export type DocumentTileState = "upcoming" | "uploaded" | "verified" | "invalid";

export interface DocumentTileProps {
  /** The document's name. */
  title: React.ReactNode;
  /** Mark the document mandatory. */
  required?: boolean;
  /**
   * `upcoming` — nothing chosen yet. `uploaded` — a file is attached. `verified` — an officer
   * or DigiLocker has verified it; an upload alone never is. `invalid` — it needs replacing.
   * @default "upcoming"
   */
  state?: DocumentTileState;
  /** The line under the title: the format and size limit, the file name and size, or the reason. */
  meta?: React.ReactNode;
  /** A leading icon — a file glyph on a review step. */
  icon?: React.ReactNode;
  /** Controls at the right: Browse File, Change and Remove, a Verified badge, View. */
  actions?: React.ReactNode;
  /** Content under the row that belongs to this document — an officer's remark, a version list. */
  children?: React.ReactNode;
  /** Render as a list item inside {@link DocumentTiles}. @default "li" */
  as?: "li" | "div";
  className?: string;
}

/**
 * MoSJE / SAMAVESH DocumentTile — one document on an upload or review step, as the handoff
 * draws it: title, one line of meta, controls at the right, in a two-column grid.
 */
export function DocumentTile({
  title,
  required,
  state = "upcoming",
  meta,
  icon,
  actions,
  children,
  as = "li",
  className,
}: DocumentTileProps) {
  const Tag = as;
  return (
    <Tag className={cn("ds-document-tile", className)} data-state={state}>
      {icon && <span className="ds-document-tile__icon" aria-hidden="true">{icon}</span>}
      <div className="ds-document-tile__copy">
        <p className="ds-document-tile__title">
          {title}
          {required && (
            <>
              <span className="ds-field__required" aria-hidden="true">*</span>
              <span className="ds-sr-only"> (required)</span>
            </>
          )}
        </p>
        {meta && <p className="ds-document-tile__meta">{meta}</p>}
      </div>
      {actions && <div className="ds-document-tile__actions">{actions}</div>}
      {children && <div className="ds-document-tile__detail">{children}</div>}
    </Tag>
  );
}

/** The two-column grid DocumentTiles sit in. */
export function DocumentTiles({ children, className, ...rest }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("ds-document-tiles", className)} {...rest}>
      {children}
    </ul>
  );
}
