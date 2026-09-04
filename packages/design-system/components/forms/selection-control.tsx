"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import type { SelectionCardLayout, SelectionLabelPlacement, SelectionSize, SelectionVariant } from "./selection-types";
import "./selection-control.css";

/**
 * The ONE markup both selection controls render. Checkbox and Radio differ only in the
 * native `type`, the visual drawn beside the input, and what a change means — everything
 * else (label, description, error, required marker, read-only guard, size, placement, the
 * card tile, the hit area) is here once, so the two can never drift apart again.
 *
 * Anatomy, in DOM order:
 *
 *   <div class="ds-selection ds-<kind>" data-state data-size data-variant …>
 *     <span class="ds-selection__control">          the box/circle cell
 *       <input class="ds-selection__input">         the real, visually hidden control — and
 *                                                    the HIT AREA: target/* square, centred
 *       <visual aria-hidden>                         the drawn box or circle
 *     </span>
 *     [<span class="ds-selection__icon">]            card variant only
 *     <span class="ds-selection__body">
 *       <label for>label [*]</label>
 *       [<span id=…-description>description</span>] aria-describedby, NEVER in the name
 *     </span>
 *     [<p id=…-error role="alert">error</p>]         checkbox only
 *   </div>
 *
 * The description used to sit inside the card's `<label>`, so a screen reader read a
 * paragraph as the option's NAME. It is a sibling now, linked through `aria-describedby`,
 * which is what WCAG 1.3.1 and UX4G §6 both ask for.
 */

export interface SelectionCommonProps {
  label?: React.ReactNode;
  /** Keeps `label` as the accessible name but removes it from view. */
  hideLabel?: boolean;
  /** Secondary line, linked through `aria-describedby`. */
  description?: React.ReactNode;
  /** Invalid styling without a message — for a group that owns the message. */
  invalid?: boolean;
  /**
   * Announced as read-only and kept in the tab order, but cannot be changed. NOT
   * `disabled`: a disabled control leaves the tab order and the submitted form, and tells
   * the reader they did something wrong.
   */
  readOnly?: boolean;
  required?: boolean;
  /** @default "md" */
  size?: SelectionSize;
  /** @default "end" */
  labelPlacement?: SelectionLabelPlacement;
  /** @default "default" */
  variant?: SelectionVariant;
  /** Leading glyph, card variant only. Pass an `<Icon>` — `size={40}` in the detailed layout. */
  icon?: React.ReactNode;
  /** Card variant only. `detailed` is the scheme tile: icon tile, title, description, meta, control trailing. @default "compact" */
  cardLayout?: SelectionCardLayout;
  /** One fact to choose by — the target group, the fee, the timeline. Card variant; joins `aria-describedby`. */
  meta?: React.ReactNode;
}

interface SelectionControlProps extends SelectionCommonProps {
  kind: "checkbox" | "radio";
  inputId: string;
  /** Resolved checked state, for `data-state` and the card's selected styling. */
  state: "checked" | "unchecked" | "indeterminate";
  disabled?: boolean;
  /** Checkbox only: the message rendered after the control with `role="alert"`. */
  error?: React.ReactNode;
  /** The drawn box or circle. Rendered `aria-hidden` beside the input. */
  visual: React.ReactNode;
  /** Everything that goes on the `<input>`, already merged (ids, aria, handlers, rest). */
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef: React.Ref<HTMLInputElement>;
  className?: string;
}

/** Joins the ids a control describes itself with — its own, then the caller's. Never overwrites. */
export function joinIds(...ids: Array<string | undefined | null | false>): string | undefined {
  const out = ids.filter((x): x is string => typeof x === "string" && x.length > 0);
  return out.length ? out.join(" ") : undefined;
}

let warnedUnlabelled = false;

export function SelectionControl({
  kind,
  inputId,
  state,
  disabled = false,
  readOnly = false,
  required = false,
  invalid = false,
  size = "md",
  labelPlacement = "end",
  variant = "default",
  cardLayout = "compact",
  meta,
  label,
  hideLabel = false,
  description,
  error,
  icon,
  visual,
  inputProps,
  inputRef,
  className,
}: SelectionControlProps): React.JSX.Element {
  const descriptionId = description != null ? `${inputId}-description` : undefined;
  const isCard = variant === "card";
  const metaId = isCard && meta != null ? `${inputId}-meta` : undefined;
  const errorId = error != null ? `${inputId}-error` : undefined;
  const isInvalid = invalid || error != null;

  // Warned once per session rather than per render, and not at all in production builds
  // (bundlers strip the branch when NODE_ENV is inlined; here the guard is the once-flag).
  if (!warnedUnlabelled) {
    const named =
      label != null || inputProps["aria-label"] != null || inputProps["aria-labelledby"] != null;
    if (!named) {
      warnedUnlabelled = true;
      console.warn(
        `[@mosje/design-system] <${kind === "checkbox" ? "Checkbox" : "Radio"}> rendered with no accessible name. ` +
          "Pass `label`, or `aria-label` / `aria-labelledby` when the label is elsewhere (WCAG 4.1.2, GIGW 5.2.45).",
      );
    }
  }

  return (
    <div
      className={cn(
        "ds-selection",
        kind === "checkbox" ? "ds-checkbox" : "ds-radio",
        isCard && "ds-selection--card",
        isCard && cardLayout === "detailed" && "ds-selection--card-detailed",
        className,
      )}
      data-state={state}
      data-size={size}
      data-variant={variant}
      data-card-layout={isCard ? cardLayout : undefined}
      data-label-placement={labelPlacement}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={isInvalid || undefined}
    >
      <span className="ds-selection__control">
        <input
          ref={inputRef}
          id={inputId}
          type={kind}
          className="ds-selection__input"
          disabled={disabled}
          required={required || undefined}
          aria-required={required || undefined}
          aria-invalid={isInvalid || undefined}
          // `aria-readonly` is permitted on `checkbox` and `radiogroup`, NOT on `radio` (ARIA 1.2;
          // axe aria-allowed-attr). A read-only radio is announced by its group instead.
          aria-readonly={readOnly && kind === "checkbox" ? true : undefined}
          {...inputProps}
          aria-describedby={joinIds(descriptionId, metaId, errorId, inputProps["aria-describedby"])}
        />
        <span className="ds-selection__visual" aria-hidden="true">
          {visual}
        </span>
      </span>
      {isCard && icon != null ? (
        <span className="ds-selection__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {label != null || description != null || metaId ? (
        <span className="ds-selection__body">
          {label != null ? (
            <label
              htmlFor={inputId}
              className={cn("ds-selection__label", hideLabel && "ds-sr-only")}
            >
              {label}
              {required ? (
                <span className="ds-selection__required" aria-hidden="true">
                  {" *"}
                </span>
              ) : null}
            </label>
          ) : null}
          {description != null ? (
            <span id={descriptionId} className="ds-selection__description">
              {description}
            </span>
          ) : null}
          {metaId ? (
            <span id={metaId} className="ds-selection__meta">
              {meta}
            </span>
          ) : null}
        </span>
      ) : null}
      {error != null ? (
        <p id={errorId} role="alert" className="ds-selection__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The read-only guard. Native `readonly` has NO effect on a checkbox or radio (the HTML
 * spec exempts them), so the change has to be refused by hand: a click, Space, and — on a
 * radio — the arrow keys that would move the selection.
 */
export function readOnlyHandlers(
  readOnly: boolean,
  onClick?: React.MouseEventHandler<HTMLInputElement>,
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>,
): Pick<React.InputHTMLAttributes<HTMLInputElement>, "onClick" | "onKeyDown"> {
  if (!readOnly) return { onClick, onKeyDown };
  return {
    onClick: (e) => {
      e.preventDefault();
      onClick?.(e);
    },
    onKeyDown: (e) => {
      if (e.key === " " || e.key.startsWith("Arrow")) e.preventDefault();
      onKeyDown?.(e);
    },
  };
}
