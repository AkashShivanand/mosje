"use client";

import * as React from "react";

import { useControllableState } from "../../utils/use-controllable-state";
import { SelectionControl, readOnlyHandlers, type SelectionCommonProps } from "./selection-control";
import "./radio.css";

export interface RadioProps
  extends
    SelectionCommonProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "type" | "size" | "checked" | "defaultChecked" | "onChange" | "readOnly" | "required" | "value"
    > {
  /** Controlled state. Omit it to let the browser own the group's selection. */
  checked?: boolean;
  defaultChecked?: boolean;
  /** Binds the options into one native group. Required: without it there is no group. */
  name: string;
  /** This option's value. */
  value: string;
  /** Native change event, kept for every existing call site. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Fires with `true` when this option becomes the selection. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * SAMAVESH Radio — one option of a mutually exclusive set.
 *
 * A real `<input type="radio">`, so the browser supplies the group semantics: one tab stop
 * for the set, arrow keys between options, and `name` deciding who belongs together.
 *
 * Rules:
 * 1. Wrap a set in `RadioGroup`. A bare set has no accessible name for the QUESTION.
 * 2. There is no `error` on a single radio — the error belongs to the question, i.e. the
 *    group. `invalid` exists so the group can paint every circle.
 * 3. `description` is linked through `aria-describedby` in both variants; it is never part
 *    of the option's name.
 * 4. Do not add `tabIndex`. The roving tabindex is the browser's, and re-implementing it is
 *    how a group ends up with four tab stops.
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    checked,
    defaultChecked = false,
    disabled = false,
    readOnly = false,
    required = false,
    invalid,
    label,
    hideLabel,
    description,
    size,
    labelPlacement,
    variant,
    cardLayout,
    meta,
    icon,
    name,
    value,
    id,
    className,
    onChange,
    onCheckedChange,
    onClick,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const [isChecked, setChecked] = useControllableState<boolean>(checked, defaultChecked);
  const reactId = React.useId();
  const inputId = id ?? reactId;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (readOnly) return;
    onChange?.(event);
    setChecked(event.target.checked);
    onCheckedChange?.(event.target.checked);
  };

  return (
    <SelectionControl
      kind="radio"
      inputId={inputId}
      state={isChecked ? "checked" : "unchecked"}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      invalid={invalid}
      size={size}
      labelPlacement={labelPlacement}
      variant={variant}
      cardLayout={cardLayout}
      meta={meta}
      icon={icon}
      label={label}
      hideLabel={hideLabel}
      description={description}
      className={className}
      inputRef={ref}
      visual={
        <span className="ds-radio__circle">
          <span className="ds-radio__dot" />
        </span>
      }
      inputProps={{
        ...rest,
        name,
        value,
        checked: isChecked,
        onChange: handleChange,
        ...readOnlyHandlers(readOnly, onClick, onKeyDown),
      }}
    />
  );
});
