"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { ErrorSummary, type ErrorSummaryItem } from "../forms/error-summary";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

export interface FormScreenProps extends ScreenStateInput {
  /** Where this form sits. Omit only at the top of a section. */
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  /** The page's h1. Title Case. */
  title: string;
  meta?: React.ReactNode;
  /**
   * Heading level for the page title. Leave at 1 — a portal screen has exactly
   * one h1 and this is it. Drop to 2 inside a documentation specimen.
   * @default 1
   */
  headingLevel?: 1 | 2;

  /**
   * The mandatory-fields sentence, above the first section.
   *
   * A prop rather than a constant because GIGW requires the estate to be
   * bilingual and a sentence baked into a template cannot be translated. Pass
   * `null` for a form with no mandatory fields — which is rare enough that the
   * default is the sentence, not its absence.
   * @default "Fields marked * are mandatory."
   */
  requiredNote?: React.ReactNode;

  /**
   * Validation failures, in the order the fields appear.
   *
   * Non-empty renders `ErrorSummary`, which takes focus. Do not ALSO render a
   * summary inside the body: two summaries means the second one silently steals
   * focus from the first.
   */
  errors?: ErrorSummaryItem[];

  /** Alerts above the form — a session notice, a scheme deadline. */
  notices?: React.ReactNode;

  /** The sections. `FormSection` for a field grid, `FormCard` for anything else. */
  children: React.ReactNode;

  onSubmit: () => void;
  /** @default "Save" */
  submitLabel?: string;
  onCancel?: () => void;
  /** @default "Cancel" */
  cancelLabel?: string;
  /** Extra controls in the action bar — "Save as draft". */
  secondaryActions?: React.ReactNode;
  /** The submit is in flight. Disables it and says so, rather than going quiet. */
  submitting?: boolean;

  /**
   * Whether the reader has unsaved edits.
   *
   * The template SHOWS this; it cannot GUARD it, because the guard belongs to
   * the router and the template does not own the router
   * (`.claude/rules/screen-templates.md` §4). Pair it with your own
   * `beforeunload` and route guard.
   */
  dirty?: boolean;
  /** When the form last saved, as a citizen would read it. */
  savedAt?: string;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * FormScreen — one record, editable, and it fits on one screen.
 *
 * The boundary with `WizardScreen` is a count, not a feeling: **more than eight
 * fields, or a statutory stage boundary, and it is a wizard**
 * (`docs/design-system/screen-templates.md` §2a). A twelve-field form that a
 * citizen must complete in one sitting is the shape that loses work.
 *
 * **The save is confirmed, never optimistic, and that is not this template's
 * decision to reverse.** `InlineEdit` reached the same conclusion for the same
 * reason: an officer who watched a value change has no reason to look again, and
 * a failed write leaves the register holding the old one. So `submitting` keeps
 * the control busy until the write settles.
 *
 * It owns: the seven states, the one h1, the mandatory-fields sentence, the
 * error summary's focus behaviour, and an action bar that stays reachable at
 * 375px. A descriptor never states any of those.
 */
export function FormScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  headingLevel = 1,
  requiredNote = "Fields marked * are mandatory.",
  errors,
  notices,
  children,
  onSubmit,
  submitLabel = "Save",
  onCancel,
  cancelLabel = "Cancel",
  secondaryActions,
  submitting = false,
  dirty = false,
  savedAt,
  onRetry,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: FormScreenProps): React.JSX.Element {
  /* A form is never "empty" — the fields are the content, and they are always
     there. `count: 1` says so, which leaves loading, error and ready as the
     three states this screen can actually be in. Resolved once, like every
     other template. */
  const status = resolveScreenState({ ...state, count: 1 });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (submitting) return;
    onSubmit();
  };

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} />

      {notices ? <div className="sa-screen__notices">{notices}</div> : null}

      <ScreenBody status={status} copy={copy} skeleton="form" onRetry={onRetry}>
        {/* `noValidate`: the browser's own bubbles appear one at a time, are not
            styled, vanish on scroll and are not announced by every screen
            reader. ErrorSummary is the estate's answer and it cannot do its job
            while the browser is intercepting the submit. */}
        <form className="sa-form" onSubmit={handleSubmit} noValidate>
          {errors && errors.length > 0 ? <ErrorSummary errors={errors} /> : null}

          {requiredNote ? (
            <p className="sa-form__required-note">{requiredNote}</p>
          ) : null}

          <div className="sa-form__sections">{children}</div>

          {/* Sticky at the foot on a phone, static on a desktop. A long
              government form is taller than any viewport, and an action bar
              that has scrolled away is an action bar the citizen believes is
              missing. */}
          <div className="sa-form__actions">
            <div className="sa-form__actions-state" aria-live="polite">
              {submitting
                ? "Saving…"
                : dirty
                  ? "You have unsaved changes."
                  : savedAt
                    ? `Saved ${savedAt}.`
                    : null}
            </div>
            <div className="sa-form__actions-buttons">
              {onCancel ? (
                <Button type="button" appearance="text" onClick={onCancel}>
                  {cancelLabel}
                </Button>
              ) : null}
              {secondaryActions}
              <Button type="submit" disabled={submitting}>
                {submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </ScreenBody>
    </div>
  );
}
