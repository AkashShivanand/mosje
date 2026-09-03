"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Loader } from "../feedback/loader";
import {
  resolveFieldStatus,
  type AutocompleteToken,
  type FieldSize,
  type FieldStatus,
} from "./field-types";
import "./forms.css";

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "prefix" | "autoComplete"
  > {
  /**
   * The condition the field is in. `error` blocks, `warning` does not, and
   * `success` means a real check passed. Takes precedence over `invalid`.
   */
  status?: FieldStatus;
  /**
   * Legacy alias for `status="error"`. Still honoured everywhere, including the
   * object `FormField` spreads onto its control, so no existing call site had
   * to change when `status` arrived. Prefer `status`.
   */
  invalid?: boolean;
  /** Control height. @default "md" (44px) */
  size?: FieldSize;
  /**
   * `autocomplete`, typed to the HTML autofill field names rather than to
   * `string`, so a token that does nothing fails the build instead of shipping.
   * WCAG 2.2 1.3.5 (Identify Input Purpose, AA) is met by putting the right one
   * on any field collecting information about the reader.
   */
  autoComplete?: AutocompleteToken;
  /**
   * Decorative icon rendered inside the field, before the text. Purely visual —
   * it is `aria-hidden`, so the field still needs a real label.
   */
  leftIcon?: React.ReactNode;
  /**
   * Trailing slot inside the field. Unlike `leftIcon` this is NOT hidden from
   * assistive tech, because it is commonly an interactive control (a
   * show/hide-password toggle, a clear button). Give that control its own
   * accessible name. For a plain password reveal, prefer `<PasswordInput>`.
   */
  rightIcon?: React.ReactNode;
  /**
   * Fixed text before the value — a currency symbol, a country code, a scheme
   * prefix. Drawn inside the field's border and **hidden from assistive tech**,
   * because a screen reader announcing "rupee sign" in the middle of a value is
   * noise. Its meaning reaches the reader through `prefixLabel` instead.
   */
  prefix?: React.ReactNode;
  /**
   * What the prefix MEANS, spoken. Appended to the field's description, so
   * "₹" is announced as "Amount in rupees" rather than as a symbol or not at
   * all. Falls back to the prefix itself when that is already a word; **always
   * pass this explicitly when the prefix is a symbol.**
   */
  prefixLabel?: string;
  /** Fixed text after the value — a unit, a domain suffix. Same rules as `prefix`. */
  suffix?: React.ReactNode;
  /** What the suffix means, spoken. Same rules as `prefixLabel`. */
  suffixLabel?: string;
  /**
   * The value is being checked against something — a PAN lookup, a pincode
   * resolving to a district. Renders a spinner in the trailing slot and sets
   * `aria-busy`. It does NOT disable the field: a reader who wants to correct a
   * value should not have to wait for a request they cannot see.
   */
  pending?: boolean;
}

/**
 * MoSJE / SAMAVESH Input atom.
 *
 * A native `<input>` styled on the token contract. Pair with `FormField` for an
 * accessible label, hint, status message and character count.
 *
 * **Height.** `md` is 44px — past the 24px Level AA minimum (SC 2.5.8) and
 * meeting the 44px Level AAA size (SC 2.5.5). The scale runs 40 / 44 / 48 / 56;
 * see `FieldSize` for why the smallest is 40 and not UX4G's 32.
 *
 * **Adornments.** With no icon, affix or spinner the component renders a bare
 * `<input>` and nothing else, so existing layouts are untouched. Give it any
 * adornment and the field becomes a bordered flex row with a borderless input
 * inside it — one path, not two, so a prefix and an icon cannot disagree about
 * where the border is.
 *
 * @example
 * <FormField label="Annual income" hint="As declared in your latest ITR">
 *   {(control) => (
 *     <Input {...control} prefix="₹" prefixLabel="Amount in rupees"
 *            inputMode="numeric" autoComplete="off" />
 *   )}
 * </FormField>
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      status,
      invalid,
      size = "md",
      leftIcon,
      rightIcon,
      prefix,
      prefixLabel,
      suffix,
      suffixLabel,
      pending = false,
      className,
      type = "text",
      readOnly,
      disabled,
      "aria-describedby": describedBy,
      ...rest
    },
    ref,
  ) {
    const affixId = React.useId();
    const resolved = resolveFieldStatus(status, invalid);

    // A symbol read aloud is worse than silence, so the affix is hidden and its
    // meaning is carried by a visually-hidden description instead. Fall back to
    // the affix text only when it is already a word.
    const spokenPrefix =
      prefixLabel ?? (typeof prefix === "string" && /[a-z]/i.test(prefix) ? prefix : undefined);
    const spokenSuffix =
      suffixLabel ?? (typeof suffix === "string" && /[a-z]/i.test(suffix) ? suffix : undefined);

    const prefixDescId = spokenPrefix != null ? `${affixId}-prefix` : undefined;
    const suffixDescId = spokenSuffix != null ? `${affixId}-suffix` : undefined;

    // MERGE, never replace. FormField composes hint + message + count into the
    // incoming value; the affix descriptions join it rather than overwrite it.
    const mergedDescribedBy =
      [describedBy, prefixDescId, suffixDescId].filter(Boolean).join(" ") || undefined;

    const hasAdornment =
      leftIcon != null || rightIcon != null || prefix != null || suffix != null || pending;

    const field = (
      <input
        ref={ref}
        type={type}
        readOnly={readOnly}
        disabled={disabled}
        className={cn(
          "ds-input",
          // The shell owns the height when there is one, so the size class goes
          // on whichever element is actually drawing the box.
          hasAdornment ? "ds-input--bare" : `ds-input--${size}`,
          className,
        )}
        data-status={resolved}
        data-size={hasAdornment ? undefined : size}
        data-readonly={readOnly || undefined}
        aria-invalid={resolved === "error" || undefined}
        aria-describedby={mergedDescribedBy}
        aria-busy={pending || undefined}
        {...rest}
      />
    );

    if (!hasAdornment) return field;

    return (
      <div
        className={cn("ds-input-shell", `ds-input-shell--${size}`)}
        data-status={resolved}
        data-size={size}
        data-readonly={readOnly || undefined}
        data-disabled={disabled || undefined}
      >
        {leftIcon != null && (
          <span className="ds-input-shell__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {prefix != null && (
          <span className="ds-input-shell__affix" aria-hidden="true">
            {prefix}
          </span>
        )}
        {field}
        {suffix != null && (
          <span className="ds-input-shell__affix" aria-hidden="true">
            {suffix}
          </span>
        )}
        {pending && (
          <span className="ds-input-shell__pending">
            <Loader size="sm" label="" aria-hidden="true" />
          </span>
        )}
        {rightIcon != null && (
          <span className="ds-input-shell__action">{rightIcon}</span>
        )}
        {prefixDescId != null && (
          <span id={prefixDescId} className="ds-sr-only">
            {spokenPrefix}
          </span>
        )}
        {suffixDescId != null && (
          <span id={suffixDescId} className="ds-sr-only">
            {spokenSuffix}
          </span>
        )}
      </div>
    );
  },
);
