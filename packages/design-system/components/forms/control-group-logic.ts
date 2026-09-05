import type { CheckboxState } from "./selection-types";

/**
 * The pure half of `CheckboxGroup`, kept apart from React so it can be tested without a DOM
 * and read without one.
 */

export interface SelectableOption {
  value: string;
  disabled?: boolean;
  /** "None of the above". Selecting it clears the others; selecting any other clears it. */
  exclusive?: boolean;
}

/**
 * The next value after `toggled` is clicked. Emits in OPTION order, never click order, and
 * never mutates the array it was given. An exclusive option and the ordinary ones cannot be
 * selected together (GOV.UK's "or" divider), in either direction.
 */
export function nextCheckboxValue(
  options: readonly SelectableOption[],
  value: readonly string[],
  toggled: string,
): string[] {
  const selected = new Set(value);
  const target = options.find((o) => o.value === toggled);
  if (selected.has(toggled)) {
    selected.delete(toggled);
  } else {
    if (target?.exclusive) {
      selected.clear();
    } else {
      for (const o of options) if (o.exclusive) selected.delete(o.value);
    }
    selected.add(toggled);
  }
  return options.filter((o) => selected.has(o.value)).map((o) => o.value);
}

/** What a "select all" parent shows for the current value. Disabled options do not count. */
export function selectAllState(
  options: readonly SelectableOption[],
  value: readonly string[],
): CheckboxState {
  const selectable = options.filter((o) => !o.disabled && !o.exclusive);
  if (selectable.length === 0) return "unchecked";
  const selected = new Set(value);
  const count = selectable.filter((o) => selected.has(o.value)).length;
  if (count === 0) return "unchecked";
  if (count === selectable.length) return "checked";
  return "indeterminate";
}

/**
 * The value after the "select all" parent is set. Selects (or clears) every ENABLED,
 * non-exclusive option and leaves a disabled option exactly as it was — a disabled choice
 * is one the citizen cannot make, so a parent must not make it for them.
 */
export function nextSelectAllValue(
  options: readonly SelectableOption[],
  value: readonly string[],
  checked: boolean,
): string[] {
  const selected = new Set(value);
  for (const o of options) {
    if (o.exclusive) {
      selected.delete(o.value);
      continue;
    }
    if (o.disabled) continue;
    if (checked) selected.add(o.value);
    else selected.delete(o.value);
  }
  return options.filter((o) => selected.has(o.value)).map((o) => o.value);
}
