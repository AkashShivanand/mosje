"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import { useControllableState } from "../../utils/use-controllable-state";
import { Checkbox } from "./checkbox";
import { nextCheckboxValue, nextSelectAllValue, selectAllState } from "./control-group-logic";
import { Radio } from "./radio";
import type { SelectionCardLayout, SelectionLabelPlacement, SelectionSize, SelectionVariant } from "./selection-types";
import "./control-group.css";

export interface ControlGroupOption {
  value: string;
  label: React.ReactNode;
  /** Secondary line under the label, linked through `aria-describedby`. Both groups honour it. */
  description?: React.ReactNode;
  disabled?: boolean;
  /** Leading glyph, card variant only. Pass an `<Icon>`. */
  icon?: React.ReactNode;
  /** Card variant: one fact to choose by, under the description. */
  meta?: React.ReactNode;
  /**
   * Content revealed beneath this option only while it is selected — a follow-up field, a
   * note (GOV.UK's conditional reveal). Always in the DOM, hidden with `hidden`, so the
   * option's `aria-controls` always resolves.
   */
  reveal?: React.ReactNode;
  /**
   * CheckboxGroup only: "none of the above". Selecting it clears the others and selecting
   * any other clears it. Rendered last, after an "or" divider.
   */
  exclusive?: boolean;
}

interface ControlGroupBaseProps {
  /**
   * The group's own question, rendered as a `<legend>`. Required, and not decorative —
   * see the note on `GroupShell`.
   */
  legend: React.ReactNode;
  /** Visually hides the legend. It is still a legend, and still the group's name. */
  hideLegend?: boolean;
  options: ControlGroupOption[];
  /** Helper text, linked through `aria-describedby`. */
  hint?: React.ReactNode;
  /** Error message; sets the invalid state and is announced after the options. */
  error?: React.ReactNode;
  /** Invalid state without a message, so `FormField`'s render-prop object degrades rather than breaks. Prefer `error`. */
  invalid?: boolean;
  required?: boolean;
  /** Native `<fieldset disabled>` — every option, no per-option plumbing. */
  disabled?: boolean;
  readOnly?: boolean;
  /** @default "md" */
  size?: SelectionSize;
  /** @default "end" */
  labelPlacement?: SelectionLabelPlacement;
  /** `card` renders each option as a selectable card. @default "default" */
  variant?: SelectionVariant;
  /** With `variant="card"`: `detailed` for scheme tiles, `compact` for a short list. @default "compact" */
  cardLayout?: SelectionCardLayout;
  /** @default "vertical" */
  orientation?: "vertical" | "horizontal";
  className?: string;
  id?: string;
}

export interface RadioGroupProps extends ControlGroupBaseProps {
  /** Binds the options into one group. Required by the native control. */
  name: string;
  /** `undefined` means nothing selected. The group never invents a default; see the docs. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export interface CheckboxGroupProps extends ControlGroupBaseProps {
  /** Posted on every box, so a plain `<form>` submit carries the selection. Also prefixes the option ids. */
  name?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /**
   * Label of a "select all" parent rendered above the options — checked when every enabled
   * option is, indeterminate when only some are.
   */
  selectAll?: React.ReactNode;
  /** Text of the divider before the exclusive option. @default "or" */
  exclusiveDivider?: React.ReactNode;
}

/**
 * THE THING BOTH OF THESE EXIST FOR, and why the singles are not enough.
 *
 * `Radio` and `Checkbox` each label THEMSELVES. Neither can label the QUESTION they are
 * answering, because the question is not inside either of them. So a screen-reader user
 * tabbing into a set of four radios hears "Scheduled Caste, radio button, 1 of 4" and never
 * hears "Category of the applicant" — the one piece of information that makes the four
 * options mean anything.
 *
 * `<fieldset>` + `<legend>` is the only construct in HTML that supplies it, and it is what
 * WCAG 1.3.1 and 3.3.2 are asking for on a grouped control. Every government form on this
 * estate asks grouped questions; until now every one of them had to build the fieldset by
 * hand, which is precisely why three portals ship their own.
 *
 * A visually-hidden legend is still a legend — `hideLegend` if a nearby heading already asks
 * the question. What is NOT acceptable is omitting it, so `legend` is required.
 */
interface GroupShellProps {
  kind: "radio" | "checkbox";
  readOnly?: boolean;
  legend: React.ReactNode;
  hideLegend?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  orientation: "vertical" | "horizontal";
  variant: SelectionVariant;
  className?: string;
  baseId: string;
  children: React.ReactNode;
}

const GroupShell = React.forwardRef<HTMLFieldSetElement, GroupShellProps>(function GroupShell(
  { kind, legend, hideLegend, hint, error, invalid = false, required, disabled, readOnly, orientation, variant, className, baseId, children },
  ref,
) {
  const hintId = hint != null ? `${baseId}-hint` : undefined;
  const errorId = error != null ? `${baseId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const isInvalid = error != null || invalid;
  // A `<fieldset>` is role `group`, which permits `aria-describedby` but NOT `aria-invalid`
  // or `aria-required` (ARIA 1.2 — axe `aria-allowed-attr` fires). `radiogroup` permits all
  // three and is allowed on a fieldset, so the radio group takes that role and carries them.
  // A checkbox group has no ARIA host for "at least one of these": each box carries its own
  // `aria-invalid`, and "required" reaches the reader through the legend.
  const isRadioGroup = kind === "radio";
  return (
    <fieldset
      ref={ref}
      className={cn("ds-control-group", `ds-control-group--${variant}`, isInvalid && "is-invalid", className)}
      role={isRadioGroup ? "radiogroup" : undefined}
      aria-describedby={describedBy}
      aria-invalid={isRadioGroup && isInvalid ? true : undefined}
      aria-required={isRadioGroup && required ? true : undefined}
      aria-readonly={isRadioGroup && readOnly ? true : undefined}
      disabled={disabled || undefined}
      data-orientation={orientation}
      data-variant={variant}
    >
      <legend className={cn("ds-control-group__legend", hideLegend && "ds-sr-only")}>
        {legend}
        {required ? (
          <>
            <span className="ds-control-group__required" aria-hidden="true">
              {" *"}
            </span>
            {!isRadioGroup ? <span className="ds-sr-only"> (required)</span> : null}
          </>
        ) : null}
      </legend>
      {hint != null ? (
        <p id={hintId} className="ds-control-group__hint">
          {hint}
        </p>
      ) : null}
      <div className={cn("ds-control-group__options", `is-${orientation}`)}>{children}</div>
      {/* `alert`, and AFTER the options: a message announced before the controls describes a
          failure the reader has not reached yet; announced after, it answers what they did. */}
      {error != null ? (
        <p id={errorId} role="alert" className="ds-control-group__error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
});

function Reveal({ id, open, children }: { id: string; open: boolean; children: React.ReactNode }): React.JSX.Element {
  return (
    <div id={id} className="ds-control-group__reveal" hidden={!open}>
      {children}
    </div>
  );
}

/**
 * SAMAVESH RadioGroup — exactly one answer from a set.
 *
 * Use it wherever a form asks a question with mutually exclusive answers. Use
 * `CheckboxGroup` when more than one may be chosen, and a single `Checkbox` for a lone
 * declaration. The native radio's keyboard model is left alone: one tab stop, arrows
 * between options.
 *
 * `value` may be `undefined`. DBIM Annexure B.xi asks for a pre-selected default IN THE
 * FORM; that is the form's decision, made by passing `defaultValue`, not something the
 * component invents.
 */
export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  {
    legend, hideLegend, options, name, value, defaultValue, onChange, hint, error, invalid, required,
    disabled, readOnly, size, labelPlacement, variant = "default", cardLayout, orientation = "vertical", className, id,
  },
  ref,
) {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  const [current, setCurrent] = useControllableState<string | undefined>(value, defaultValue, (v) => {
    if (v !== undefined) onChange?.(v);
  });
  return (
    <GroupShell
      ref={ref}
      kind="radio"
      legend={legend}
      hideLegend={hideLegend}
      hint={hint}
      error={error}
      invalid={invalid}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      orientation={orientation}
      variant={variant}
      className={className}
      baseId={baseId}
    >
      {options.map((o) => {
        const optionId = `${baseId}-${o.value}`;
        const selected = current === o.value;
        const revealId = o.reveal != null ? `${optionId}-reveal` : undefined;
        return (
          <div key={o.value} className="ds-control-group__item">
            <Radio
              id={optionId}
              name={name}
              value={o.value}
              checked={selected}
              disabled={o.disabled}
              readOnly={readOnly}
              invalid={error != null || invalid}
              label={o.label}
              description={o.description}
              icon={o.icon}
              meta={o.meta}
              size={size}
              labelPlacement={labelPlacement}
              variant={variant}
              cardLayout={cardLayout}
              aria-controls={revealId}
              onChange={() => setCurrent(o.value)}
            />
            {revealId ? (
              <Reveal id={revealId} open={selected}>
                {o.reveal}
              </Reveal>
            ) : null}
          </div>
        );
      })}
    </GroupShell>
  );
});

/**
 * SAMAVESH CheckboxGroup — any number of answers from a set, including none.
 *
 * The value is an array and the component never mutates it; order follows `options`, not
 * click order, because a set of selections that reorders itself as the citizen clicks is
 * unreadable on review. `selectAll` adds the parent box a long list needs, and an
 * `exclusive` option is GOV.UK's "none of the above", separated by an "or" divider.
 */
export const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup(
  {
    legend, hideLegend, options, name, value, defaultValue, onChange, hint, error, invalid, required,
    disabled, readOnly, size, labelPlacement, variant = "default", cardLayout, orientation = "vertical", className, id,
    selectAll, exclusiveDivider = "or",
  },
  ref,
) {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  const [current, setCurrent] = useControllableState<string[]>(value, defaultValue ?? [], onChange);
  const selected = new Set(current);
  const isInvalid = error != null || invalid;
  const ordinary = options.filter((o) => !o.exclusive);
  const exclusive = options.filter((o) => o.exclusive);
  const parentState = selectAllState(options, current);

  const renderOption = (o: ControlGroupOption): React.JSX.Element => {
    const optionId = `${baseId}-${o.value}`;
    const isOn = selected.has(o.value);
    const revealId = o.reveal != null ? `${optionId}-reveal` : undefined;
    return (
      <div key={o.value} className="ds-control-group__item">
        <Checkbox
          id={optionId}
          name={name}
          value={o.value}
          checked={isOn}
          disabled={o.disabled}
          readOnly={readOnly}
          invalid={isInvalid}
          label={o.label}
          description={o.description}
          icon={o.icon}
          meta={o.meta}
          size={size}
          labelPlacement={labelPlacement}
          variant={variant}
          cardLayout={cardLayout}
          aria-controls={revealId}
          aria-expanded={revealId ? isOn : undefined}
          onChange={() => setCurrent(nextCheckboxValue(options, current, o.value))}
        />
        {revealId ? (
          <Reveal id={revealId} open={isOn}>
            {o.reveal}
          </Reveal>
        ) : null}
      </div>
    );
  };

  return (
    <GroupShell
      ref={ref}
      kind="checkbox"
      legend={legend}
      hideLegend={hideLegend}
      hint={hint}
      error={error}
      invalid={invalid}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      orientation={orientation}
      variant={variant}
      className={className}
      baseId={baseId}
    >
      {selectAll != null ? (
        <div className="ds-control-group__item ds-control-group__select-all">
          <Checkbox
            id={`${baseId}-select-all`}
            checked={parentState === "checked"}
            indeterminate={parentState === "indeterminate"}
            readOnly={readOnly}
            size={size}
            labelPlacement={labelPlacement}
            label={selectAll}
            onCheckedChange={(next) => setCurrent(nextSelectAllValue(options, current, next))}
          />
        </div>
      ) : null}
      {ordinary.map(renderOption)}
      {exclusive.length ? (
        <>
          <div className="ds-control-group__divider" role="presentation">
            <span className="ds-control-group__divider-text">{exclusiveDivider}</span>
          </div>
          {exclusive.map(renderOption)}
        </>
      ) : null}
    </GroupShell>
  );
});
