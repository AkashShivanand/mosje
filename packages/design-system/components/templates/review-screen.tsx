"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Link } from "../navigation/link";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { DeclarationCheckbox } from "../forms/declaration-checkbox";
import { ErrorSummary, type ErrorSummaryItem } from "../forms/error-summary";
import { ReviewItem } from "../forms/wizard";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

/** One answer the citizen gave, as it will be submitted. */
export interface ReviewPair {
  label: string;
  /**
   * What they entered. An unanswered optional field renders an em dash; do not
   * pass the string "Not provided", which reads as a value.
   */
  value?: string;
  /** Span the full row — an address, a list of beneficiaries. */
  wide?: boolean;
}

/** One section of the summary, matching one step of the wizard that filled it. */
export interface ReviewSectionDef {
  id: string;
  title: string;
  pairs: ReviewPair[];
  /**
   * Where "Edit" goes.
   *
   * **It must return the reader to the step AND back here** — a link that drops
   * them into step 2 with a Continue button walks them through every remaining
   * step again to reach a summary they were already reading. Carry a return
   * parameter; the template cannot, because it does not own the router.
   */
  editHref?: string;
  onEdit?: () => void;
  /** @default `Edit <title>` — never a bare "Edit". */
  editLabel?: string;
}

export interface ReviewScreenProps extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  /** A standfirst above the sections — what submitting will do. */
  intro?: React.ReactNode;
  notices?: React.ReactNode;

  sections: ReviewSectionDef[];

  /**
   * The certification text. Omit and no declaration is shown — which is correct
   * for a review embedded in a longer wizard whose final step carries it.
   */
  declaration?: React.ReactNode;
  declarationChecked?: boolean;
  onDeclarationChange?: (checked: boolean) => void;
  /** Shown when submit was attempted with the declaration unticked. */
  declarationError?: React.ReactNode;

  errors?: ErrorSummaryItem[];

  onSubmit: () => void;
  /** @default "Submit Application" */
  submitLabel?: string;
  onBack?: () => void;
  /** @default "Back" */
  backLabel?: string;
  submitting?: boolean;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * ReviewScreen — everything entered, nothing yet committed.
 *
 * The distinction from `RecordScreen` is whether the thing exists yet: a
 * committed record is read at `RecordScreen`, a pending one is confirmed here
 * (`docs/design-system/screen-templates.md` §2a). It is also the body the final
 * step of a `WizardScreen` embeds, which is why `headingLevel` and the
 * declaration are both optional.
 *
 * **Sections are numbered, and the numbers are the wizard's steps.** The
 * handoff's review frame carries 51 label/value pairs in one undifferentiated
 * grid; a citizen checking their bank details should not have to read the whole
 * application to find them. Numbering ties each block back to the step that
 * filled it, so "Edit" has an obvious destination.
 *
 * **Every "Edit" names its section.** A page of nine sections otherwise offers
 * nine identical links to anyone moving through by name — the same rule
 * `InlineEdit` states for its trigger.
 */
export function ReviewScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  headingLevel = 1,
  intro,
  notices,
  sections,
  declaration,
  declarationChecked = false,
  onDeclarationChange,
  declarationError,
  errors,
  onSubmit,
  submitLabel = "Submit Application",
  onBack,
  backLabel = "Back",
  submitting = false,
  onRetry,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: ReviewScreenProps): React.JSX.Element {
  const status = resolveScreenState({ ...state, count: sections.length });

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} />

      {notices ? <div className="sa-screen__notices">{notices}</div> : null}

      <ScreenBody status={status} copy={copy} skeleton="detail" onRetry={onRetry}>
        <div className="sa-review">
          {errors && errors.length > 0 ? <ErrorSummary errors={errors} /> : null}

          {intro ? <p className="sa-review__intro">{intro}</p> : null}

          {sections.map((section, index) => (
            <ReviewBlock key={section.id} section={section} index={index + 1} />
          ))}

          {declaration ? (
            <DeclarationCheckbox
              checked={declarationChecked}
              onChange={(next) => onDeclarationChange?.(next)}
              error={declarationError}
            >
              {declaration}
            </DeclarationCheckbox>
          ) : null}

          <div className="sa-review__actions">
            {onBack ? (
              <Button type="button" appearance="outlined" onClick={onBack}>
                {backLabel}
              </Button>
            ) : null}
            {/* Not disabled on an unticked declaration, for the reason
                ChooserScreen gives: a dead submit says nothing, and the error
                that appears when it is pressed says exactly what is missing. */}
            <Button type="button" onClick={onSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : submitLabel}
            </Button>
          </div>
        </div>
      </ScreenBody>
    </div>
  );
}

/** One numbered summary block, with the edit link that returns to its step. */
function ReviewBlock({
  section,
  index,
}: {
  section: ReviewSectionDef;
  index: number;
}): React.JSX.Element {
  const headingId = React.useId();
  const editLabel = section.editLabel ?? `Edit ${section.title}`;

  return (
    <section aria-labelledby={headingId} className="sa-review__section">
      <div className="sa-review__section-head">
        <h3 id={headingId} className="sa-review__section-title">
          <span className="sa-review__section-number" aria-hidden="true">
            {index}
          </span>
          {section.title}
        </h3>

        {section.editHref ? (
          <Link href={section.editHref} className="sa-review__edit">
            {editLabel}
          </Link>
        ) : section.onEdit ? (
          <Button type="button" appearance="text" size="sm" onClick={section.onEdit}>
            {editLabel}
          </Button>
        ) : null}
      </div>

      <dl className="sa-review__grid">
        {section.pairs.map((pair) => (
          <ReviewItem key={pair.label} label={pair.label} value={pair.value} wide={pair.wide} />
        ))}
      </dl>
    </section>
  );
}
