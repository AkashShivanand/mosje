"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Checkbox } from "../forms/checkbox";
import "./transfer-list.css";

export interface TransferItem {
  id: string;
  label: string;
  /** A code or a count shown after the label — "SC-04", "12 blocks". */
  meta?: string;
  /** Present but not movable — a mapping fixed by the scheme. */
  disabled?: boolean;
}

export interface TransferListProps {
  /** Every item, on either side. The component splits them by `selectedIds`. */
  items: TransferItem[];
  /** The ids currently on the right. */
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  /** Names the pair as a whole — "Surveyor mappings". Required. */
  label: string;
  /** @default "Available" */
  availableLabel?: string;
  /** @default "Selected" */
  selectedLabel?: string;
  /** @default "Nothing left to add." */
  emptyAvailableText?: string;
  /** @default "Nothing selected yet." */
  emptySelectedText?: string;
  disabled?: boolean;
  className?: string;
}

function Panel({
  title,
  items,
  ticked,
  onTick,
  emptyText,
  disabled,
  describedById,
}: {
  title: string;
  items: TransferItem[];
  ticked: Set<string>;
  onTick: (id: string, on: boolean) => void;
  emptyText: string;
  disabled?: boolean;
  describedById: string;
}): React.JSX.Element {
  return (
    <fieldset className="ds-transfer__panel" disabled={disabled}>
      {/* The count lives in the legend, so it is part of the group's own name
          rather than a number floating beside it. */}
      <legend className="ds-transfer__legend" id={describedById}>
        {title} ({items.length})
      </legend>
      {items.length === 0 ? (
        <p className="ds-transfer__empty">{emptyText}</p>
      ) : (
        <ul className="ds-transfer__list">
          {items.map((item) => (
            <li key={item.id} className="ds-transfer__row">
              <Checkbox
                label={item.label}
                checked={ticked.has(item.id)}
                disabled={item.disabled}
                onCheckedChange={(on) => onTick(item.id, on)}
              />
              {item.meta ? <span className="ds-transfer__meta">{item.meta}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
}

/**
 * Two lists and the traffic between them — Surveyor Mappings, Roles &
 * Permissions.
 *
 * **Each side is a list of checkboxes, deliberately.** There is no WAI-ARIA
 * pattern for a transfer list, so the usual implementation invents a keyboard
 * model — a multi-select listbox with shift-ranges — that a reader has to learn
 * on the spot and that almost nobody implements completely. A checkbox is a
 * control every reader already knows, needs no new keys, and reports its own
 * state without help. The cost is a little more vertical space; the gain is that
 * the control works.
 *
 * Three more rules:
 *
 * 1. **The count is in the legend**, so it is part of the group's name — "Available
 *    (14)" — rather than a number floating beside it that a screen reader reads
 *    at some unrelated moment.
 * 2. **The move buttons say how many will move** and are disabled when nothing is
 *    ticked. "Add 3" is a promise; "Add" is a guess.
 * 3. **What moved is announced.** After a move a polite live region says "3 items
 *    added to Selected", because on a two-panel control the thing that changed is
 *    exactly the thing a screen-reader user cannot see.
 */
export function TransferList({
  items,
  selectedIds,
  onChange,
  label,
  availableLabel = "Available",
  selectedLabel = "Selected",
  emptyAvailableText = "Nothing left to add.",
  emptySelectedText = "Nothing selected yet.",
  disabled,
  className,
}: TransferListProps): React.JSX.Element {
  const id = React.useId();
  const chosen = React.useMemo(() => new Set(selectedIds), [selectedIds]);
  const [tickedLeft, setTickedLeft] = React.useState<Set<string>>(new Set());
  const [tickedRight, setTickedRight] = React.useState<Set<string>>(new Set());
  const [announcement, setAnnouncement] = React.useState("");

  const available = items.filter((item) => !chosen.has(item.id));
  const selected = items.filter((item) => chosen.has(item.id));

  const movableLeft = [...tickedLeft].filter((tid) => available.some((item) => item.id === tid));
  const movableRight = [...tickedRight].filter((tid) => selected.some((item) => item.id === tid));

  function add(): void {
    if (movableLeft.length === 0) return;
    onChange([...selectedIds, ...movableLeft]);
    setAnnouncement(`${movableLeft.length} ${movableLeft.length === 1 ? "item" : "items"} added to ${selectedLabel}`);
    setTickedLeft(new Set());
  }

  function remove(): void {
    if (movableRight.length === 0) return;
    const gone = new Set(movableRight);
    onChange(selectedIds.filter((sid) => !gone.has(sid)));
    setAnnouncement(`${movableRight.length} ${movableRight.length === 1 ? "item" : "items"} moved back to ${availableLabel}`);
    setTickedRight(new Set());
  }

  function tick(side: "left" | "right", itemId: string, on: boolean): void {
    const setter = side === "left" ? setTickedLeft : setTickedRight;
    setter((current) => {
      const next = new Set(current);
      if (on) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
  }

  return (
    <div className={cn("ds-transfer", className)} role="group" aria-label={label}>
      <Panel
        title={availableLabel}
        items={available}
        ticked={tickedLeft}
        onTick={(itemId, on) => tick("left", itemId, on)}
        emptyText={emptyAvailableText}
        disabled={disabled}
        describedById={`${id}-available`}
      />
      <div className="ds-transfer__controls">
        <Button size="sm" appearance="outlined" onClick={add} disabled={disabled || movableLeft.length === 0}>
          {movableLeft.length === 0 ? "Add" : `Add ${movableLeft.length}`}
        </Button>
        <Button size="sm" appearance="outlined" onClick={remove} disabled={disabled || movableRight.length === 0}>
          {movableRight.length === 0 ? "Remove" : `Remove ${movableRight.length}`}
        </Button>
      </div>
      <Panel
        title={selectedLabel}
        items={selected}
        ticked={tickedRight}
        onTick={(itemId, on) => tick("right", itemId, on)}
        emptyText={emptySelectedText}
        disabled={disabled}
        describedById={`${id}-selected`}
      />
      <p className="ds-transfer__sr" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
