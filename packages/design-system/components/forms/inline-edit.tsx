"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Icon } from "../utilities/icon";
import "./inline-edit.css";

export interface InlineEditProps {
  /** What the value is. Always visible — a value with no label is a number on a page. */
  label: string;
  /** The stored value. The component never changes this itself. */
  value: string;
  /**
   * Called with the trimmed text when the reader commits. Return a promise and
   * the control stays busy until it settles; reject and the reader keeps what
   * they typed.
   */
  onSave: (value: string) => void | Promise<void>;
  /**
   * What to show when the value is empty.
   * @default "Not recorded"
   */
  emptyText?: string;
  /** One line under the field while editing. */
  hint?: string;
  /** Longest permitted value. */
  maxLength?: number;
  /** The field is present but cannot be edited — a decided record, say. */
  readOnlyReason?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A recorded value that can be corrected in place — Master Settings, a
 * beneficiary's district, a scheme's contact number.
 *
 * **The save is confirmed, never optimistic, and that is not configurable.**
 * An optimistic edit shows the new value the instant it is typed and quietly
 * reverts if the write fails. On a departmental record that is a data-integrity
 * problem wearing a performance improvement: an officer who saw the value change
 * has no reason to look again, and the register still holds the old one. So the
 * displayed value changes only after `onSave` resolves, and a rejection leaves
 * the reader's text in the field where they can try again.
 *
 * Three more rules:
 *
 * 1. **The trigger names its field** — "Edit district", not "Edit". A page of
 *    seventeen settings otherwise offers seventeen identical buttons to anyone
 *    moving between them by name.
 * 2. **Escape cancels and Enter saves**, because a single-line edit that can only
 *    be committed by finding a button is slower than the form it replaced.
 * 3. **A read-only value says WHY**, rather than simply not offering the control.
 *    "This application was approved on 4 September 2026" is an answer; a missing
 *    button is a puzzle.
 */
export function InlineEdit({
  label,
  value,
  onSave,
  emptyText = "Not recorded",
  hint,
  maxLength,
  readOnlyReason,
  disabled,
  className,
}: InlineEditProps): React.JSX.Element {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  // Focus has to move ACROSS a render in both directions: the input does not
  // exist until `editing` is true, and the trigger does not exist again until it
  // is false. Calling `.focus()` inside the handler focuses a node that is not
  // there yet — which is how the return path was silently broken until a
  // keyboard run caught it.
  const returnFocus = React.useRef(false);
  React.useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    } else if (returnFocus.current) {
      returnFocus.current = false;
      triggerRef.current?.focus();
    }
  }, [editing]);

  function open(): void {
    setDraft(value);
    setError(null);
    setEditing(true);
  }

  function cancel(): void {
    // Focus goes back to the control that opened the field, never to the top of
    // the document — see the effect above for why it cannot happen here.
    returnFocus.current = true;
    setEditing(false);
    setError(null);
  }

  async function commit(): Promise<void> {
    const next = draft.trim();
    if (next === value) {
      cancel();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSave(next);
      returnFocus.current = true;
      setEditing(false);
    } catch {
      // The typed text stays. Losing it on a failed write is the second defect
      // after losing the write itself.
      setError("The change could not be saved. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!editing) {
    return (
      <div className={cn("ds-inline", className)}>
        <span className="ds-inline__label">
          {label}
        </span>
        <span className={cn("ds-inline__value", !value && "is-empty")}>{value || emptyText}</span>
        {readOnlyReason ? (
          <span className="ds-inline__readonly">{readOnlyReason}</span>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            className="ds-inline__trigger"
            onClick={open}
            disabled={disabled}
          >
            <Icon name="edit" size={16} />
            <span className="ds-inline__sr">Edit {label}</span>
            <span aria-hidden="true">Edit</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("ds-inline", "ds-inline--editing", className)}>
      <label className="ds-inline__label" htmlFor={`${id}-input`}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={`${id}-input`}
        className="ds-inline__input"
        value={draft}
        maxLength={maxLength}
        disabled={busy}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            cancel();
          }
          if (event.key === "Enter") {
            event.preventDefault();
            void commit();
          }
        }}
      />
      <div className="ds-inline__actions">
        <Button size="sm" onClick={() => void commit()} loading={busy}>
          Save
        </Button>
        <Button size="sm" appearance="text" onClick={cancel} disabled={busy}>
          Cancel
        </Button>
      </div>
      {error || hint ? (
        <p
          id={`${id}-msg`}
          className={cn("ds-inline__msg", error && "is-error")}
          role={error ? "alert" : undefined}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
