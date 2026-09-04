/**
 * The vocabulary the two selection controls share, so `Checkbox`, `Radio`,
 * `CheckboxGroup` and `RadioGroup` cannot each spell a size differently.
 */

/**
 * Visible box or circle: sm 16 · md 20 · lg 24 (`--sa-control-selection-size-*`).
 * The row's HIT AREA follows the target ladder, not the box: sm → `target/min` (24),
 * md → `target/comfortable` (44), lg → `target/spacious` (48). The visually hidden native
 * input is what fills it, so a citizen tapping 12px beside a md box still hits it.
 */
export type SelectionSize = "sm" | "md" | "lg";

/** Where the label sits relative to the control. `end` (after) is the default and the norm. */
export type SelectionLabelPlacement = "end" | "start";

/** `card` renders the option as a selectable tile; the whole tile is the target. */
export type SelectionVariant = "default" | "card";

/** The three states a checkbox can be in. `indeterminate` is a "select all" parent's mixed state. */
export type CheckboxState = "checked" | "unchecked" | "indeterminate";
