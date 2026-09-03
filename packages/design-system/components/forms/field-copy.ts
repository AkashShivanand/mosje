import type { FieldStatus } from "./field-types";
import type { NecessityIndicator } from "./field-policy-types";

/**
 * Every string the field stack speaks.
 *
 * A design system that hard-codes its own sentences is reusable in exactly one
 * language, and this estate is bilingual by statute — GIGW 3.0 requires Hindi
 * alongside English on a Government of India property. So none of these are
 * literals in a component: they are one object, with English defaults, replaced
 * whole or in part at the form, the portal or the app.
 *
 * The three that take an argument are functions rather than templates with
 * placeholders, because pluralisation is not the same shape in every language
 * and `{n} characters remaining` cannot express Hindi's agreement rules. A
 * translator is given the number and writes the sentence.
 */
export interface FieldCopy {
  /** Prefix a screen reader hears before a status message, naming the status. */
  statusPrefix: Record<FieldStatus, string>;
  /** The marker appended to a mandatory field's label. */
  requiredMarker: string;
  /** The words appended to an optional field's label, read aloud. */
  optionalSuffix: string;
  /** The sentence explaining the form's marking convention, per policy. */
  necessityLegend: Record<NecessityIndicator, string | null>;
  /** Accessible name for the contextual-help button, given the field's label. */
  helpToggleLabel: (label: string, open: boolean) => string;
  /** The static description of a field's limit, announced when focus arrives. */
  characterLimit: (max: number) => string;
  /** The running count, while inside the limit. */
  charactersRemaining: (remaining: number) => string;
  /** The running count, once past the limit. */
  charactersOver: (over: number) => string;
}

/**
 * English defaults, in the department's register.
 *
 * Sourced where a source exists: the two legend sentences follow UX4G's
 * required-fields legend, and the character-count wording follows the
 * [Problem] + [Solution] shape UX4G's content system sets for field copy.
 */
export const DEFAULT_FIELD_COPY: FieldCopy = {
  statusPrefix: {
    error: "Error: ",
    warning: "Warning: ",
    success: "Success: ",
  },
  requiredMarker: "*",
  optionalSuffix: " (optional)",
  necessityLegend: {
    required: "Fields marked with an asterisk (*) are mandatory.",
    optional: "All fields are mandatory unless marked optional.",
    none: null,
  },
  helpToggleLabel: (label, open) => `${open ? "Hide help for" : "Help for"} ${label}`,
  characterLimit: (max) => `You can enter up to ${max} characters`,
  charactersRemaining: (remaining) =>
    `You have ${remaining} character${remaining === 1 ? "" : "s"} remaining`,
  charactersOver: (over) => `You have ${over} character${over === 1 ? "" : "s"} too many`,
};

/**
 * An override of any part of the copy.
 *
 * Deliberately NOT `Partial<FieldCopy>`: that makes the two record members
 * optional but still demands every key inside them, so translating one legend
 * sentence would mean restating the other two. Here the records are partial
 * too, which is what "override only what you change" has to mean.
 */
export type FieldCopyOverride = Omit<Partial<FieldCopy>, "statusPrefix" | "necessityLegend"> & {
  statusPrefix?: Partial<FieldCopy["statusPrefix"]>;
  necessityLegend?: Partial<FieldCopy["necessityLegend"]>;
};

/**
 * Merges an override over the defaults, one level deep on the two record
 * members so a caller can replace a single status prefix without restating the
 * other two.
 */
export function resolveFieldCopy(override?: FieldCopyOverride): FieldCopy {
  if (override == null) return DEFAULT_FIELD_COPY;
  return {
    ...DEFAULT_FIELD_COPY,
    ...override,
    statusPrefix: { ...DEFAULT_FIELD_COPY.statusPrefix, ...override.statusPrefix },
    necessityLegend: { ...DEFAULT_FIELD_COPY.necessityLegend, ...override.necessityLegend },
  };
}
