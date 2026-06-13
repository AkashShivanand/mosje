"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./controls.css";

export type ToggleSize = "default" | "small";

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Controlled on/off state. */
  checked: boolean;
  /** Optional text label rendered beside the switch (associated via htmlFor/id). */
  label?: React.ReactNode;
  /** Control size. @default "default" */
  size?: ToggleSize;
  /** Change handler — receives the native input event. */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * MoSJE / UX4G Toggle (switch) atom.
 *
 * A real `<input type="checkbox" role="switch">` (visually hidden) paired with
 * a styled pill track + sliding knob. On = primary track, white knob.
 */
export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  function Toggle(
    { checked, disabled = false, label, size = "default", id, className, onChange, ...rest },
    ref,
  ) {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    return (
      <span
        className={cn(
          "ds-toggle",
          `ds-toggle--${size}`,
          disabled && "ds-toggle--disabled",
          className,
        )}
      >
        <span className="ds-toggle__control">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            className="ds-toggle__input"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            aria-checked={checked}
            {...rest}
          />
          <span className="ds-toggle__track" aria-hidden="true">
            <span className="ds-toggle__knob" />
          </span>
        </span>
        {label != null && (
          <label htmlFor={inputId} className="ds-toggle__label">
            {label}
          </label>
        )}
      </span>
    );
  },
);
