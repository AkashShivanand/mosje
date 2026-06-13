"use client";

import * as React from "react";
import { cn } from "../cn";
import "./controls.css";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Controlled checked state. */
  checked: boolean;
  /** Radio group name — required to bind options into one group. */
  name: string;
  /** This option's value. */
  value: string;
  /** Optional text label rendered beside the circle (associated via htmlFor/id). */
  label?: React.ReactNode;
  /**
   * Visual variant. "default" = inline circle + label.
   * "card" = a full selectable card (Portal DS Radio Card) with optional description.
   * @default "default"
   */
  variant?: "default" | "card";
  /** Secondary text shown under the label in the "card" variant. */
  description?: React.ReactNode;
  /** Change handler — receives the native input event. */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * MoSJE / UX4G Radio atom.
 *
 * A real `<input type="radio">` (visually hidden) paired with a styled circle,
 * keeping native keyboard/group semantics. Checked = primary ring + dot.
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    {
      checked,
      disabled = false,
      label,
      variant = "default",
      description,
      name,
      value,
      id,
      className,
      onChange,
      ...rest
    },
    ref,
  ) {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    if (variant === "card") {
      return (
        <label
          htmlFor={inputId}
          className={cn(
            "ds-radio-card",
            checked && "ds-radio-card--selected",
            disabled && "ds-radio-card--disabled",
            className,
          )}
        >
          <span className="ds-radio__control">
            <input
              ref={ref}
              id={inputId}
              type="radio"
              className="ds-radio__input"
              name={name}
              value={value}
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              {...rest}
            />
            <span className="ds-radio__circle" aria-hidden="true">
              <span className="ds-radio__dot" />
            </span>
          </span>
          <span className="ds-radio-card__body">
            {label != null && <span className="ds-radio-card__title">{label}</span>}
            {description != null && (
              <span className="ds-radio-card__desc">{description}</span>
            )}
          </span>
        </label>
      );
    }

    return (
      <span className={cn("ds-radio", disabled && "ds-radio--disabled", className)}>
        <span className="ds-radio__control">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            className="ds-radio__input"
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            {...rest}
          />
          <span className="ds-radio__circle" aria-hidden="true">
            <span className="ds-radio__dot" />
          </span>
        </span>
        {label != null && (
          <label htmlFor={inputId} className="ds-radio__label">
            {label}
          </label>
        )}
      </span>
    );
  },
);
