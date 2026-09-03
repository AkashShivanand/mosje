"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { resolveFieldStatus, type FieldSize, type FieldStatus } from "./field-types";
import "./forms.css";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** The condition the field is in. Takes precedence over `invalid`. */
  status?: FieldStatus;
  /** Legacy alias for `status="error"`. Prefer `status`. */
  invalid?: boolean;
  /**
   * Sets the resting height, matching the Input scale — 2, 4, 6 and 8 rows.
   * `md` is four rows, which is what this component has always rendered, so a
   * textarea that names no size is unchanged. An explicit `rows` still wins.
   * @default "md"
   */
  size?: FieldSize;
  /**
   * Grow to fit the value as it is typed, up to `maxRows`. Off by default,
   * because a field that changes height under a reader's cursor moves
   * everything below it — acceptable for a comment box, not for a field in the
   * middle of a long form.
   */
  autoResize?: boolean;
  /** Ceiling for `autoResize`, in rows. Beyond it the field scrolls. @default 12 */
  maxRows?: number;
}

/**
 * MoSJE / SAMAVESH Textarea atom.
 *
 * A native `<textarea>` styled on the token contract; vertically resizable.
 * Pair with `FormField` for the label, hint, status message and character
 * count.
 *
 * **On character limits.** When you show a count, prefer leaving `maxLength`
 * OFF. A hard `maxLength` silently swallows keystrokes, and a reader pasting a
 * prepared answer loses the end of it without being told. Let them go over and
 * let the count say so — that is what its over-limit state is for.
 */
/**
 * Rows per size. `min-height` alone cannot do this job: a textarea's height
 * comes from `rows`, and at the default of four rows every size below `xl`
 * measured the same 122px. The floor in the stylesheet still applies underneath.
 */
const ROWS_BY_SIZE: Record<FieldSize, number> = { sm: 2, md: 4, lg: 6, xl: 8 };

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      status,
      invalid,
      size = "md",
      autoResize = false,
      maxRows = 12,
      className,
      rows,
      readOnly,
      onChange,
      ...rest
    },
    ref,
  ) {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
    const resolved = resolveFieldStatus(status, invalid);

    // Merge the forwarded ref with the one autoResize needs to measure.
    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const fit = React.useCallback(() => {
      const el = innerRef.current;
      if (el == null || !autoResize) return;
      // Reset first: without it the scrollHeight only ever grows, so a field
      // that has been long once never shrinks again.
      el.style.height = "auto";
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
      const max = lineHeight * maxRows;
      el.style.height = `${Math.min(el.scrollHeight, max)}px`;
      el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
    }, [autoResize, maxRows]);

    // Fit on mount and whenever the value is driven from outside, not only on
    // keystrokes — a controlled field reset by its form would otherwise keep
    // the height of the value it no longer holds.
    React.useEffect(fit, [fit, rest.value, rest.defaultValue]);

    return (
      <textarea
        ref={setRefs}
        rows={rows ?? ROWS_BY_SIZE[size]}
        readOnly={readOnly}
        className={cn("ds-textarea", `ds-textarea--${size}`, className)}
        data-status={resolved}
        data-size={size}
        data-readonly={readOnly || undefined}
        aria-invalid={resolved === "error" || undefined}
        onChange={(event) => {
          fit();
          onChange?.(event);
        }}
        {...rest}
      />
    );
  },
);
