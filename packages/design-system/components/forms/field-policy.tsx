"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import {
  DEFAULT_FIELD_COPY,
  resolveFieldCopy,
  type FieldCopy,
  type FieldCopyOverride,
} from "./field-copy";
import type { NecessityIndicator } from "./field-policy-types";
import "./forms.css";

export type { NecessityIndicator } from "./field-policy-types";

export interface FieldPolicy {
  /** How this form marks mandatory and optional fields. */
  necessity: NecessityIndicator;
  /** Every string the field stack speaks, already merged over the defaults. */
  copy: FieldCopy;
}

const DEFAULT_POLICY: FieldPolicy = {
  necessity: "required",
  copy: DEFAULT_FIELD_COPY,
};

const FieldPolicyContext = React.createContext<FieldPolicy>(DEFAULT_POLICY);

export interface FieldPolicyProviderProps {
  /**
   * How this form marks mandatory and optional fields.
   * @default "required"
   */
  necessity?: NecessityIndicator;
  /**
   * Replace any of the field stack's strings — for another language, or for a
   * portal whose register differs. Merged over the English defaults, so an
   * override supplies only what it changes.
   */
  copy?: FieldCopyOverride;
  children: React.ReactNode;
}

/**
 * Sets the marking convention and the wording for every field beneath it.
 *
 * **Necessity is a form-level decision, not a field-level one.** Systems that
 * put it on the field let one form mark half its fields required and the other
 * half optional, which reads as though the unmarked ones are a third category.
 * One provider per form removes the possibility.
 *
 * **Copy is an app-level decision.** Put one provider at the root of a portal to
 * translate the whole field stack at once, and a second inside a form only when
 * that form's register genuinely differs.
 *
 * @example
 * <FieldPolicyProvider
 *   necessity="optional"
 *   copy={{
 *     optionalSuffix: " (वैकल्पिक)",
 *     charactersRemaining: (n) => `${n} अक्षर शेष`,
 *   }}
 * >
 *   <RequiredFieldsLegend />
 *   <FormField label="पूरा नाम" required>…</FormField>
 * </FieldPolicyProvider>
 */
export function FieldPolicyProvider({
  necessity,
  copy,
  children,
}: FieldPolicyProviderProps): React.JSX.Element {
  const inherited = React.useContext(FieldPolicyContext);
  const value = React.useMemo<FieldPolicy>(
    () => ({
      // Nesting inherits rather than resets: a form inside a translated portal
      // that only changes `necessity` must not silently revert to English.
      necessity: necessity ?? inherited.necessity,
      copy: copy == null ? inherited.copy : resolveFieldCopy({ ...inherited.copy, ...copy }),
    }),
    [necessity, copy, inherited],
  );
  return (
    <FieldPolicyContext.Provider value={value}>{children}</FieldPolicyContext.Provider>
  );
}

/** Reads the form's marking convention and copy. Falls back to the defaults outside a provider. */
export function useFieldPolicy(): FieldPolicy {
  return React.useContext(FieldPolicyContext);
}

/** Reads just the copy. The common case in a component that renders a string. */
export function useFieldCopy(): FieldCopy {
  return React.useContext(FieldPolicyContext).copy;
}

export interface RequiredFieldsLegendProps {
  /** Override the form's policy for this legend alone. Rarely correct. */
  necessity?: NecessityIndicator;
  /** Replace the sentence outright, ignoring the policy's copy. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * The sentence that explains the form's marking convention, printed once above
 * the fields.
 *
 * A form that marks fields without explaining the mark leaves a reader to infer
 * it, and the inference is wrong as often as it is right — an asterisk means
 * "footnote" to a great many people. UX4G publishes this as its own component
 * in the Form Field Group; this is that component, reading the policy so the
 * sentence and the marks can never disagree.
 */
export function RequiredFieldsLegend({
  necessity,
  children,
  className,
}: RequiredFieldsLegendProps): React.JSX.Element | null {
  const policy = useFieldPolicy();
  const resolved = necessity ?? policy.necessity;
  const copy = children ?? policy.copy.necessityLegend[resolved];
  if (copy == null) return null;
  return (
    <p className={cn("ds-field-legend", className)} data-necessity={resolved}>
      {copy}
    </p>
  );
}
