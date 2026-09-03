/**
 * Shared vocabulary for the text-entry field stack.
 *
 * Input, Textarea, Select and FormField all speak these three types, so a field
 * behaves the same way whichever control is inside it.
 */

/**
 * The condition a field is in, beyond "nothing to report".
 *
 * Modelled on the UX4G 3.0 Figma library, whose `Input - Text Field` master
 * publishes Success and Warning alongside Error, and whose Caption carries the
 * same three plus Default.
 *
 * - `error` — the value is wrong and submission will fail. Blocking.
 * - `warning` — the value is accepted but unusual, and the reader should look
 *   again. **Never blocking**: a warning that stops submission is an error
 *   wearing the wrong colour.
 * - `success` — the value was checked against something and passed. Reserve it
 *   for a real verification (an OTP confirmed, an IFSC resolved), not for
 *   "you typed something".
 */
export type FieldStatus = "error" | "warning" | "success";

/**
 * Control height.
 *
 * | size | height | UX4G equivalent |
 * |---|---|---|
 * | `sm` | 40px | — (their S is 32px; see below) |
 * | `md` | **44px** (default) | between their M 40 and L 48 |
 * | `lg` | 48px | L, which they name "Mobile Default" |
 * | `xl` | 56px | XL |
 *
 * **We do not ship UX4G's 32px S.** The estate's floor is 44px — WCAG 2.2's AAA
 * target size (2.5.5), not merely the 24px AA minimum (2.5.8) — and a 32px
 * control drops below it for no gain a reader can feel. `sm` at 40px is the one
 * concession, and it matches what `[data-density="compact"]` already produced.
 *
 * `md` is deliberately 44 rather than UX4G's 40, so the default a developer
 * gets without thinking is the accessible one.
 */
export type FieldSize = "sm" | "md" | "lg" | "xl";

/**
 * The HTML autofill field names, as a union.
 *
 * WCAG 2.2 **1.3.5 Identify Input Purpose** (Level AA) is met by putting the
 * right `autocomplete` token on a field that collects information *about the
 * user*. It is the criterion most often claimed and least often checked,
 * because `autocomplete` is a plain string on every framework's input type —
 * `autoComplete="firstname"` compiles, does nothing, and passes review.
 *
 * Typing it turns that into a build error. `given-name` compiles;
 * `firstname` does not.
 *
 * Section and address modifiers are permitted through the template-literal
 * members, so `"shipping address-line1"` and `"section-primary tel"` are valid.
 *
 * @see https://www.w3.org/TR/WCAG22/#input-purposes
 */
export type AutocompleteFieldName =
  // Names
  | "name"
  | "honorific-prefix"
  | "given-name"
  | "additional-name"
  | "family-name"
  | "honorific-suffix"
  | "nickname"
  // Credentials
  | "username"
  | "new-password"
  | "current-password"
  | "one-time-code"
  // Organisation
  | "organization-title"
  | "organization"
  // Address
  | "street-address"
  | "address-line1"
  | "address-line2"
  | "address-line3"
  | "address-level4"
  | "address-level3"
  | "address-level2"
  | "address-level1"
  | "country"
  | "country-name"
  | "postal-code"
  // Payment
  | "cc-name"
  | "cc-given-name"
  | "cc-additional-name"
  | "cc-family-name"
  | "cc-number"
  | "cc-exp"
  | "cc-exp-month"
  | "cc-exp-year"
  | "cc-csc"
  | "cc-type"
  | "transaction-currency"
  | "transaction-amount"
  // Personal
  | "language"
  | "bday"
  | "bday-day"
  | "bday-month"
  | "bday-year"
  | "sex"
  | "url"
  | "photo"
  // Telephone
  | "tel"
  | "tel-country-code"
  | "tel-national"
  | "tel-area-code"
  | "tel-local"
  | "tel-local-prefix"
  | "tel-local-suffix"
  | "tel-extension"
  // Contact
  | "email"
  | "impp";

/** `autocomplete` values that switch autofill off rather than naming a purpose. */
export type AutocompleteOff = "off" | "on";

/**
 * Everything valid in an `autocomplete` attribute, including the grouping
 * prefixes the HTML specification allows.
 */
export type AutocompleteToken =
  | AutocompleteFieldName
  | AutocompleteOff
  | `section-${string} ${AutocompleteFieldName}`
  | `shipping ${AutocompleteFieldName}`
  | `billing ${AutocompleteFieldName}`
  | `home ${AutocompleteFieldName}`
  | `work ${AutocompleteFieldName}`
  | `mobile ${AutocompleteFieldName}`
  | `fax ${AutocompleteFieldName}`
  | `pager ${AutocompleteFieldName}`;

/** Maps a status to the CSS modifier suffix used across the forms stylesheet. */
export const FIELD_STATUS_CLASS: Record<FieldStatus, string> = {
  error: "error",
  warning: "warning",
  success: "success",
};

/**
 * Resolves the legacy `invalid` boolean against the newer `status`.
 *
 * `invalid` predates `status` and is still spread onto controls by
 * `FormField`'s render prop, so both have to keep working. `status` wins where
 * both are given; `invalid` alone still means `error`.
 */
export function resolveFieldStatus(
  status: FieldStatus | undefined,
  invalid: boolean | undefined,
): FieldStatus | undefined {
  if (status != null) return status;
  return invalid === true ? "error" : undefined;
}
