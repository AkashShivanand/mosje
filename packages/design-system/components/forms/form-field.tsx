"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { CharacterCount } from "./character-count";
import {
  FieldHelp,
  FieldHelpToggle,
  FieldHint,
  FieldLabel,
  FieldMessage,
  useFieldIds,
} from "./field-parts";
import type { FieldSize, FieldStatus } from "./field-types";
import "./forms.css";

/** Wiring passed to the control rendered inside a FormField. */
export interface FormFieldControlProps {
  id: string;
  /** The field's condition, derived from which message was supplied. */
  status?: FieldStatus;
  /** Legacy alias, true when `status` is `error`. Kept so old call sites work. */
  invalid: boolean;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  size?: FieldSize;
  "aria-describedby"?: string;
}

export interface FormFieldCharacterCount {
  /** The field's current value. The count is derived from it, so the field must be controlled. */
  value: string;
  /** The limit. */
  maxLength: number;
  /** Start announcing from this many characters used. @default 75% of `maxLength` */
  threshold?: number;
}

/**
 * Class names for the field's individual parts.
 *
 * The escape hatch that stops a consumer reaching for `.ds-field__label` in
 * their own stylesheet — a selector on an internal class is a dependency on an
 * implementation detail, and it breaks silently when the internals move. Every
 * part also carries `data-*` attributes, so a stylesheet can target
 * `[data-status="error"] [data-part="message"]` without knowing any class name
 * at all.
 */
export interface FormFieldClassNames {
  root?: string;
  labelRow?: string;
  label?: string;
  helpToggle?: string;
  labelAction?: string;
  help?: string;
  hint?: string;
  message?: string;
  count?: string;
}

export interface FormFieldProps {
  /** Visible field label (associated with the control via htmlFor). */
  label: React.ReactNode;
  /**
   * Plain-text form of the label, for the contextual-help button's accessible
   * name. Required only when `label` is not a string and `labelHelp` is set.
   */
  labelText?: string;
  /** Control id; auto-generated when omitted. */
  id?: string;
  /** Helper text rendered BELOW the control, linked via aria-describedby. */
  hint?: React.ReactNode;
  /**
   * Extra explanation, revealed by a small button beside the label. A
   * disclosure, not a tooltip: a tooltip cannot be opened by touch and cannot
   * be read at leisure.
   */
  labelHelp?: React.ReactNode;
  /**
   * A control at the FAR RIGHT of the label row — a recovery route, most often.
   * "Forgot Password?" beside the Password label is the case this exists for:
   * it is where a citizen looks BEFORE they have failed rather than after.
   *
   * **It is a SIBLING of the label, never a child of it.** Consumers used to
   * pass a `<span>` containing the label text and a floated `<a>` as `label`,
   * which put an interactive element inside a `<label>` — clicking near it
   * moves focus to the field instead of following the link, and the float never
   * reached the right edge anyway, because `.ds-field__label-row` is a flex row
   * and the `<label>` inside it shrink-wraps to its own text (186px in a 340px
   * field). That shipped on the portal login pages as "Password *Forgot
   * Password?", jammed together. Pass the action here instead.
   *
   * Keep it short and make it a real link or button. It is NOT a place for
   * instructions — those are `hint` or `labelHelp`.
   */
  labelAction?: React.ReactNode;
  /**
   * Hide the label visually while keeping it for assistive tech. Only correct
   * when a nearby heading already asks the question — never to save space.
   */
  labelHidden?: boolean;
  /** Error message. Blocks submission. Wins over `warning` and `success`. */
  error?: React.ReactNode;
  /** Warning message. Does NOT block. Wins over `success`. */
  warning?: React.ReactNode;
  /** Success message — a real check passed, not merely "you typed something". */
  success?: React.ReactNode;
  /** Replace the status glyph. `null` drops it. */
  messageIcon?: React.ReactNode;
  /** Mark the field as mandatory (adds `required` to the control). */
  required?: boolean;
  /** Mark the field as optional. Rendered only when the form's policy is `optional`. */
  optional?: boolean;
  /** Pass through to the control as a real `readonly`. */
  readOnly?: boolean;
  /** Pass through to the control. */
  disabled?: boolean;
  /** Pass through to the control, so a field's size is set in one place. */
  size?: FieldSize;
  /** Lay the label beside the control rather than above it. @default "stacked" */
  orientation?: "stacked" | "inline";
  /** Live character count. Its description and announcements are wired for you. */
  characterCount?: FormFieldCharacterCount;
  /**
   * Ids of elements elsewhere on the page that also describe this field. They
   * are MERGED into `aria-describedby`, never replaced.
   */
  describedBy?: string;
  /** Per-part class names — see `FormFieldClassNames`. */
  classNames?: FormFieldClassNames;
  /** Extra content rendered at the end of the field, after the count. */
  footer?: React.ReactNode;
  className?: string;
  /**
   * Render-prop receiving the wiring for the control. Spread it onto
   * Input/Select/Textarea.
   */
  children: (control: FormFieldControlProps) => React.ReactNode;
}

/**
 * MoSJE / SAMAVESH FormField molecule.
 *
 * Wires a label, help, hint, status message and character count to any control,
 * and owns every accessibility decision the field stack makes. It is assembled
 * from the parts in `field-parts.tsx`, which are exported for the screen that
 * genuinely needs a different arrangement.
 *
 * **The four that are usually got wrong.**
 *
 * 1. **`aria-describedby` is composed, never replaced.** Hint, help, status
 *    message, count and anything the caller passes in `describedBy` are joined,
 *    in reading order, by one expression. Systems that assign the attribute per
 *    feature let the last one win, and a reader loses the hint the moment an
 *    error appears.
 * 2. **The error is not announced on first paint.** A server-rendered page
 *    carrying validation errors would, with a plain `role="alert"`, announce
 *    every one of them on load — out of reading order, detached from the field.
 *    Instead two live regions sit on the page from the first render holding
 *    nothing, and are filled only when the message changes away from the one the
 *    field was born with. An initially-present error belongs to `ErrorSummary`,
 *    which takes focus.
 * 3. **Read-only is a real `readonly`.** It stays focusable, its value stays
 *    selectable and copyable, and a screen reader says so. Rendering it as
 *    `disabled` instead takes it out of the tab order and tells the reader they
 *    got something wrong.
 * 4. **Necessity and wording are the form's decisions.** Both come from
 *    `FieldPolicyProvider`, so one form cannot mark half its fields one way and
 *    half the other, and a Hindi portal translates the whole stack in one place.
 *
 * @example
 * <FieldPolicyProvider necessity="optional">
 *   <RequiredFieldsLegend />
 *   <FormField label="Grievance" hint="Describe what happened, in your own words."
 *              characterCount={{ value, maxLength: 500 }} error={errors.grievance}>
 *     {(control) => <Textarea {...control} value={value} onChange={onChange} />}
 *   </FormField>
 * </FieldPolicyProvider>
 */
export function FormField({
  label,
  labelText,
  id,
  hint,
  labelHelp,
  labelAction,
  labelHidden = false,
  error,
  warning,
  success,
  messageIcon,
  required = false,
  optional = false,
  readOnly = false,
  disabled = false,
  size,
  orientation = "stacked",
  characterCount,
  describedBy,
  classNames,
  footer,
  className,
  children,
}: FormFieldProps): React.JSX.Element {
  const ids = useFieldIds(id);

  // Precedence is fixed and not configurable: an error is the only one that
  // stops the form, so it is the only one worth the reader's attention while it
  // stands. Showing an error and a success at once has no reading.
  const status: FieldStatus | undefined =
    error != null ? "error" : warning != null ? "warning" : success != null ? "success" : undefined;
  const message = error ?? warning ?? success;

  const [helpOpen, setHelpOpen] = React.useState(false);

  // ONE expression. Every part of the field's description is composed here and
  // nowhere else, so no feature can displace another.
  const composedDescribedBy = ids.describedBy({
    hint: hint != null,
    help: labelHelp != null && helpOpen,
    message: message != null,
    count: characterCount != null,
    extra: describedBy,
  });

  // Announce a message only once it has CHANGED away from the one this field was
  // born with. The regions are rendered from the first paint holding empty
  // strings, because a live region added to the page later is announced
  // inconsistently across screen readers, while one present from the start never
  // announces its initial value.
  //
  // The guard compares against the FIRST message, not against "have I run
  // before". A ref set inside the effect looks equivalent and is not: React
  // double-invokes effects in development, and a remount replays them, so the
  // second pass saw the flag already lowered and announced the server-rendered
  // error after all. Found by reading the live regions of a rendered page —
  // seven of them held their error text on first paint.
  const [announcement, setAnnouncement] = React.useState("");
  const messageText = typeof message === "string" ? message : "";
  const bornWith = React.useRef(messageText);
  const hasChanged = React.useRef(false);
  React.useEffect(() => {
    if (!hasChanged.current) {
      if (messageText === bornWith.current) return;
      hasChanged.current = true;
    }
    setAnnouncement(messageText);
  }, [messageText]);

  const resolvedLabelText = labelText ?? (typeof label === "string" ? label : "this field");

  return (
    <div
      className={cn("ds-field", `ds-field--${orientation}`, classNames?.root, className)}
      data-part="root"
      data-status={status}
      data-orientation={orientation}
      data-required={required || undefined}
      data-readonly={readOnly || undefined}
      data-disabled={disabled || undefined}
      data-size={size}
    >
      <div className={cn("ds-field__label-row", classNames?.labelRow)} data-part="label-row">
        <FieldLabel
          htmlFor={ids.control}
          required={required}
          optional={optional}
          visuallyHidden={labelHidden}
          className={classNames?.label}
          data-part="label"
        >
          {label}
        </FieldLabel>

        {labelHelp != null && !labelHidden && (
          <FieldHelpToggle
            open={helpOpen}
            labelText={resolvedLabelText}
            aria-controls={ids.help}
            onClick={() => setHelpOpen((open) => !open)}
            className={classNames?.helpToggle}
            data-part="help-toggle"
          />
        )}

        {/* Last in the row and pushed right by `margin-left: auto`, so a help
            toggle still sits immediately beside the label. Rendered only when
            asked for, so no existing field's layout moves. */}
        {labelAction != null ? (
          <span className={cn("ds-field__label-action", classNames?.labelAction)} data-part="label-action">
            {labelAction}
          </span>
        ) : null}
      </div>

      {/* Rendered even when closed, and hidden with the `hidden` attribute, so
          the button's `aria-controls` always points at something real. A
          disclosure whose target does not exist until it opens is a broken
          reference for as long as it is shut. */}
      {labelHelp != null && (
        <FieldHelp
          id={ids.help}
          hidden={!helpOpen}
          className={classNames?.help}
          data-part="help"
        >
          {labelHelp}
        </FieldHelp>
      )}

      {children({
        id: ids.control,
        status,
        invalid: status === "error",
        required: required || undefined,
        readOnly: readOnly || undefined,
        disabled: disabled || undefined,
        size,
        "aria-describedby": composedDescribedBy,
      })}

      {/* Helper text sits BELOW the control so inputs align across grid rows.
          UX4G's Input master calls this the Caption and draws it here too. */}
      {hint != null && (
        <FieldHint id={ids.hint} className={classNames?.hint} data-part="hint">
          {hint}
        </FieldHint>
      )}

      {message != null && status != null && (
        <FieldMessage
          id={ids.message}
          status={status}
          icon={messageIcon}
          className={classNames?.message}
          data-part="message"
        >
          {message}
        </FieldMessage>
      )}

      {characterCount != null && (
        <CharacterCount
          id={ids.count}
          value={characterCount.value}
          maxLength={characterCount.maxLength}
          threshold={characterCount.threshold}
          className={classNames?.count}
        />
      )}

      {footer}

      {/* Two regions, because changing `aria-live` on a node already in the
          accessibility tree is honoured inconsistently. An error is assertive
          because the reader cannot submit; a warning or a success can wait. */}
      <span className="ds-sr-only" aria-live="polite">
        {status === "error" ? "" : announcement}
      </span>
      <span className="ds-sr-only" aria-live="assertive">
        {status === "error" ? announcement : ""}
      </span>
    </div>
  );
}
