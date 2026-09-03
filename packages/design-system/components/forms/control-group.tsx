"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import { Checkbox } from "./checkbox";
import { Radio } from "./radio";
import "./control-group.css";

export interface ControlGroupOption {
  value: string;
  label: React.ReactNode;
  /** Secondary line, shown by the `card` variant. */
  description?: React.ReactNode;
  disabled?: boolean;
}

interface ControlGroupBase {
  /**
   * The group's own question, rendered as a `<legend>`.
   *
   * This is the whole reason the component exists — see the note below. It is
   * required, and it is not decorative.
   */
  legend: React.ReactNode;
  options: ControlGroupOption[];
  /** Helper text, linked through `aria-describedby`. */
  hint?: React.ReactNode;
  /** Error message; sets the group's invalid state and is announced. */
  error?: React.ReactNode;
  /**
   * Sets the invalid state without a message, so spreading `FormField`'s
   * render-prop object onto a group degrades rather than breaks. Prefer `error`.
   */
  invalid?: boolean;
  required?: boolean;
  /** `card` renders each option as a selectable card. @default "default" */
  variant?: "default" | "card";
  /** @default "vertical" */
  orientation?: "vertical" | "horizontal";
  className?: string;
  id?: string;
}

export interface RadioGroupProps extends ControlGroupBase {
  /** Binds the options into one group. Required by the native control. */
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export interface CheckboxGroupProps extends ControlGroupBase {
  value: string[];
  onChange: (value: string[]) => void;
}

/**
 * THE THING BOTH OF THESE EXIST FOR, and why the singles are not enough.
 *
 * `Radio` and `Checkbox` each label THEMSELVES. Neither can label the QUESTION
 * they are answering, because the question is not inside either of them. So a
 * screen-reader user tabbing into a set of four radios hears "Scheduled Caste,
 * radio button, 1 of 4" and never hears "Category of the applicant" — the one
 * piece of information that makes the four options mean anything.
 *
 * `<fieldset>` + `<legend>` is the only construct in HTML that supplies it, and
 * it is what WCAG 1.3.1 and 3.3.2 are asking for on a grouped control. Every
 * government form on this estate asks grouped questions; until now every one of
 * them had to build the fieldset by hand, which is precisely why three portals
 * ship their own.
 *
 * A visually-hidden legend is still a legend — pass one and hide it with
 * `sa-sr-only` if the question is already asked by a nearby heading. What is
 * NOT acceptable is omitting it, so `legend` is required rather than optional.
 */
function GroupShell({
  legend,
  hint,
  error,
  invalid = false,
  required,
  orientation = "vertical",
  className,
  baseId,
  children,
}: {
  legend: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  required?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
  baseId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      className={cn("ds-control-group", error || invalid ? "is-invalid" : null, className)}
      aria-describedby={describedBy}
      aria-invalid={error || invalid ? true : undefined}
      aria-required={required || undefined}
    >
      <legend className="ds-control-group__legend">
        {legend}
        {required ? (
          <span className="ds-control-group__required" aria-hidden="true">
            {" *"}
          </span>
        ) : null}
      </legend>
      {hint ? (
        <p id={hintId} className="ds-control-group__hint">
          {hint}
        </p>
      ) : null}
      <div className={cn("ds-control-group__options", `is-${orientation}`)}>{children}</div>
      {/*
        `alert`, and AFTER the options. A message announced before the controls
        describes a failure the reader has not reached yet; announced after, it
        is the answer to what they just did.
      */}
      {error ? (
        <p id={errorId} role="alert" className="ds-control-group__error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/**
 * SAMAVESH RadioGroup — exactly one answer from a set.
 *
 * Use it wherever a form asks a question with mutually exclusive answers:
 * category of the applicant, type of disability, whether the household holds a
 * ration card. Use `CheckboxGroup` when more than one may be chosen, and a
 * single `Checkbox` for a lone declaration.
 *
 * The native radio's own keyboard model is left alone: one tab stop for the
 * group, arrow keys between options. Do not add `tabIndex` to the options — it
 * is a roving tabindex already, supplied by the browser, and re-implementing it
 * is how a group ends up with four tab stops.
 */
export function RadioGroup({
  legend,
  options,
  name,
  value,
  onChange,
  hint,
  error,
  invalid,
  required,
  variant = "default",
  orientation = "vertical",
  className,
  id,
}: RadioGroupProps): React.JSX.Element {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  return (
    <GroupShell
      legend={legend}
      hint={hint}
      error={error}
      invalid={invalid}
      required={required}
      orientation={orientation}
      className={className}
      baseId={baseId}
    >
      {options.map((o) => (
        <Radio
          key={o.value}
          id={`${baseId}-${o.value}`}
          name={name}
          value={o.value}
          checked={value === o.value}
          disabled={o.disabled}
          label={o.label}
          description={o.description}
          variant={variant}
          onChange={() => onChange(o.value)}
        />
      ))}
    </GroupShell>
  );
}

/**
 * SAMAVESH CheckboxGroup — any number of answers from a set, including none.
 *
 * The value is an array and the component never mutates it: an option toggles
 * by producing a new array, so a caller holding the previous value in state
 * still has it. Order follows `options`, not click order, because a set of
 * selections that reorders itself as the citizen clicks is unreadable on review.
 */
export function CheckboxGroup({
  legend,
  options,
  value,
  onChange,
  hint,
  error,
  invalid,
  required,
  orientation = "vertical",
  className,
  id,
}: CheckboxGroupProps): React.JSX.Element {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  const selected = new Set(value);
  return (
    <GroupShell
      legend={legend}
      hint={hint}
      error={error}
      invalid={invalid}
      required={required}
      orientation={orientation}
      className={className}
      baseId={baseId}
    >
      {options.map((o) => (
        <Checkbox
          key={o.value}
          id={`${baseId}-${o.value}`}
          value={o.value}
          checked={selected.has(o.value)}
          disabled={o.disabled}
          label={o.label}
          onChange={() => {
            const next = new Set(selected);
            if (next.has(o.value)) next.delete(o.value);
            else next.add(o.value);
            // Emit in OPTION order, never selection order.
            onChange(options.filter((x) => next.has(x.value)).map((x) => x.value));
          }}
        />
      ))}
    </GroupShell>
  );
}
