"use client";

import * as React from "react";

import { useControllableState } from "../../utils/use-controllable-state";
import { SelectionControl, readOnlyHandlers, type SelectionCommonProps } from "./selection-control";
import type { CheckboxState } from "./selection-types";
import "./checkbox.css";

export interface CheckboxProps
  extends
    SelectionCommonProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "type" | "size" | "checked" | "defaultChecked" | "onChange" | "readOnly" | "required"
    > {
  /** Controlled state. Omit it to let the control hold its own, seeded by `defaultChecked`. */
  checked?: boolean;
  /**
   * Initial state for the uncontrolled form. Never `true` for a consent or declaration —
   * UX4G §7 prohibits pre-checked consent boxes, and DBIM B.xii expects an explicit act.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The mixed state a "select all" parent shows when only some children are selected.
   * Orthogonal to `checked`: the DOM property is set, the box draws a dash, and a click
   * still yields `checked = true`, as the native control does.
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Error message. Rendered after the control with `role="alert"`, sets `aria-invalid`,
   * and joins `aria-describedby`. Write it as [Problem] + [Solution] (UX4G §7).
   */
  error?: React.ReactNode;
  /** Native change event, kept for every existing call site. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** The next checked value, after `onChange`. The convenience most callers actually want. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * SAMAVESH Checkbox — any number of items from a set, or one option on or off.
 *
 * A real `<input type="checkbox">`, visually hidden but sized to the touch target, beside a
 * drawn box. Nothing about keyboard, focus or grouping is re-implemented.
 *
 * Rules:
 * 1. Never pre-check a consent or declaration (`defaultChecked`/`checked` true) — UX4G §7.
 * 2. `description` is linked through `aria-describedby`; it is never part of the name.
 * 3. `readOnly` is not `disabled`: it keeps the tab stop and the submitted value.
 * 4. Several boxes answering ONE question go in `CheckboxGroup`, which supplies the
 *    `<fieldset>`/`<legend>` that names the question.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    indeterminate = false,
    disabled = false,
    readOnly = false,
    required = false,
    invalid,
    label,
    hideLabel,
    description,
    error,
    size,
    labelPlacement,
    variant,
    icon,
    id,
    className,
    onChange,
    onCheckedChange,
    onClick,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(forwardedRef, () => innerRef.current!, []);

  const [isChecked, setChecked] = useControllableState<boolean>(checked, defaultChecked);

  // `indeterminate` is a DOM property with no attribute. Setting it is what exposes the
  // `mixed` state to assistive technology — every current engine maps it — so there is no
  // `aria-checked` here: ARIA-in-HTML says authors must not set it on a native checkbox.
  React.useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const reactId = React.useId();
  const inputId = id ?? reactId;
  const state: CheckboxState = indeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked";

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (readOnly) return;
    onChange?.(event);
    setChecked(event.target.checked);
    onCheckedChange?.(event.target.checked);
  };

  return (
    <SelectionControl
      kind="checkbox"
      inputId={inputId}
      state={state}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      invalid={invalid}
      size={size}
      labelPlacement={labelPlacement}
      variant={variant}
      icon={icon}
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      className={className}
      inputRef={innerRef}
      visual={
        <span className="ds-checkbox__box">
          {indeterminate ? (
            <svg className="ds-checkbox__mark" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 8h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="ds-checkbox__mark" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13 4.5 6.5 11.5 3 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      }
      inputProps={{
        ...rest,
        checked: isChecked,
        onChange: handleChange,
        ...readOnlyHandlers(readOnly, onClick, onKeyDown),
      }}
    />
  );
});
