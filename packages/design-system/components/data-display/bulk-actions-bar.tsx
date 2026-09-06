"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./bulk-actions-bar.css";

export interface BulkAction {
  id: string;
  label: string;
  /** Material Symbols name, drawn before the label. Decorative. */
  icon?: string;
  /** `danger` is for the one action that cannot be undone. @default "neutral" */
  tone?: "neutral" | "warning" | "danger";
  disabled?: boolean;
}

export interface BulkActionsBarProps {
  /** How many rows are selected. At `0` the bar renders nothing. */
  count: number;
  /**
   * The noun, singular — "application", "beneficiary". The bar pluralises it,
   * because "3 applications selected" and "3 records selected" are different
   * sentences and only the page knows which is true.
   */
  noun: string;
  /** Plural of `noun`, where adding "s" is wrong — "entries" for "entry". */
  pluralNoun?: string;
  actions: BulkAction[];
  onAction: (id: string) => void;
  /** Clears the selection. Always offered — a selection with no way out is a trap. */
  onClear: () => void;
  /**
   * How many rows exist in total. When given and larger than `count`, the bar
   * offers to extend the selection to all of them.
   */
  total?: number;
  onSelectAll?: () => void;
  className?: string;
}

/**
 * MoSJE / SAMAVESH Bulk actions bar.
 *
 * The strip that appears when rows are selected — *Withdrawn Applications*,
 * *Pending Approvals*, *Beneficiary List*.
 *
 * **The count is announced, not just drawn.** Selecting rows changes nothing a
 * screen reader would notice on its own: the checkbox says "checked" and the
 * page says nothing about how many are now selected or what can be done with
 * them. The bar is a polite live region, so the count and the fact that actions
 * have appeared are read out as the selection grows.
 *
 * **Clearing is always offered.** A reader who has selected forty rows by
 * accident — and on a long table with a shift-click that is easy — needs one
 * control to undo it, not forty.
 *
 * **It does not float.** A bar pinned over the bottom of the viewport covers the
 * last row of the table, which on a phone is the row the reader was about to
 * act on. This sits in the flow above the table, where the selection is.
 */
export function BulkActionsBar({
  count,
  noun,
  pluralNoun,
  actions,
  onAction,
  onClear,
  total,
  onSelectAll,
  className,
}: BulkActionsBarProps): React.JSX.Element | null {
  if (count <= 0) return null;

  const plural = pluralNoun ?? `${noun}s`;
  const word = count === 1 ? noun : plural;
  const canExtend = total !== undefined && onSelectAll !== undefined && total > count;

  return (
    <div
      className={cn("ds-bulk", className)}
      // Polite, not assertive: the reader is selecting rows deliberately, and an
      // assertive announcement would interrupt them on every click.
      role="status"
      aria-live="polite"
    >
      <span className="ds-bulk__count">
        {count} {word} selected
      </span>

      {canExtend ? (
        <button type="button" className="ds-bulk__link" onClick={onSelectAll}>
          Select all {total} {plural}
        </button>
      ) : null}

      <span className="ds-bulk__actions">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={cn("ds-bulk__action", `ds-bulk__action--${action.tone ?? "neutral"}`)}
            disabled={action.disabled}
            onClick={() => onAction(action.id)}
          >
            {action.label}
          </button>
        ))}
      </span>

      <button type="button" className="ds-bulk__clear" onClick={onClear}>
        Clear selection
      </button>
    </div>
  );
}
