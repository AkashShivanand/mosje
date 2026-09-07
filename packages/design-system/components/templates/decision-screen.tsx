"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Alert } from "../feedback/alert";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { RadioGroup } from "../forms/control-group";
import { ErrorSummary, type ErrorSummaryItem } from "../forms/error-summary";
import { Button } from "../actions/button";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

/** One verdict the officer may record. */
export interface DecisionOption {
  id: string;
  label: React.ReactNode;
  /** What recording this verdict does to the record and to the applicant. */
  description?: React.ReactNode;
  /**
   * Stated before the decision is made, never after.
   *
   * "A rejected application cannot be reopened; the applicant must apply again
   * in the next cycle." A consequence disclosed in a confirmation dialogue is
   * disclosed after the officer has already decided.
   */
  irreversibleNote?: React.ReactNode;
}

export interface DecisionScreenProps extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  /** The record being decided, named as the register holds it. */
  title: string;
  meta?: React.ReactNode;
  /** A status Badge, an SLA indicator. */
  status?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  /**
   * The record, read-only.
   *
   * Compose a `RecordScreen` body here, or a `DescriptionList`, or a
   * `ReviewScreen` at `headingLevel={2}`. **Bodies compose; chrome does not**
   * (`docs/design-system/screen-templates.md` §2b) — do not nest a second
   * `PortalPage` or a second h1.
   */
  record: React.ReactNode;

  /** @default "Record a Decision" */
  panelTitle?: string;
  /** The question the verdicts answer, as a legend. */
  legend: string;
  options: DecisionOption[];
  value?: string;
  onChange: (id: string) => void;

  /** The remarks field. Required by most schemes on anything but an approval. */
  remarks?: React.ReactNode;
  /** Anything else the decision needs — a sanctioned amount, a date. */
  extras?: React.ReactNode;

  errors?: ErrorSummaryItem[];
  onSubmit: () => void;
  /** @default "Record Decision" */
  submitLabel?: string;
  submitting?: boolean;
  onCancel?: () => void;
  /** @default "Cancel" */
  cancelLabel?: string;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * DecisionScreen — one record, and a decision to record against it.
 *
 * The distinction from `RecordScreen` is whether this reader changes the
 * record's state (`docs/design-system/screen-templates.md` §2a). An officer who
 * can only look is on a `RecordScreen`; an officer who can approve, return or
 * reject is here.
 *
 * **The record and the decision are side by side, and both scroll together.**
 * Putting the verdict behind a modal or a side sheet means an officer choosing
 * "Return for correction" cannot see the field they are returning it for. On a
 * phone the panel follows the record rather than floating over it, for the same
 * reason.
 *
 * **A decision that cannot be unmade says so before it is made**, on the option
 * itself. That is `irreversibleNote`, and it is the one piece of copy this
 * template will not let a caller put in a confirmation dialogue instead.
 *
 * **Verdicts this role may not record are omitted from `options`**, never passed
 * disabled — `.claude/rules/screen-templates.md` §4. A greyed-out "Approve"
 * announces as present-but-unavailable and explains nothing.
 */
export function DecisionScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  status,
  headingLevel = 1,
  record,
  panelTitle = "Record a Decision",
  legend,
  options,
  value,
  onChange,
  remarks,
  extras,
  errors,
  onSubmit,
  submitLabel = "Record Decision",
  submitting = false,
  onCancel,
  cancelLabel = "Cancel",
  onRetry,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: DecisionScreenProps): React.JSX.Element {
  /* The RECORD decides the state, not the options. A screen whose record failed
     to load has nothing to decide about, and offering a verdict form over an
     absent record is how a wrong decision gets recorded against the wrong
     application. `record` is a node and always truthy once passed, so the
     caller's own loading/error flags carry it. */
  const screenStatus = resolveScreenState({ ...state, count: 1 });

  const panelHeadingId = React.useId();
  const reactId = React.useId();
  const groupName = `decision${reactId.replace(/:/g, "")}`;

  const chosen = options.find((o) => o.id === value);

  const groupOptions = React.useMemo(
    () =>
      options.map((option) => ({
        value: option.id,
        label: option.label,
        description: option.description,
      })),
    [options],
  );

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader
        as={headingLevel}
        eyebrow={eyebrow}
        title={title}
        meta={meta}
        actions={status}
      />

      <ScreenBody status={screenStatus} copy={copy} skeleton="detail" onRetry={onRetry}>
        <div className="sa-decision">
          <div className="sa-decision__record">{record}</div>

          <section aria-labelledby={panelHeadingId} className="sa-decision__panel">
            <h2 id={panelHeadingId} className="sa-decision__panel-title">
              {panelTitle}
            </h2>

            {errors && errors.length > 0 ? <ErrorSummary errors={errors} headingLevel={3} /> : null}

            <RadioGroup
              name={groupName}
              legend={legend}
              options={groupOptions}
              value={value}
              onChange={onChange}
              variant="card"
              cardLayout="compact"
              required
            />

            {/* The warning appears with the choice, above the submit, so it is
                between the officer and the act rather than after it. */}
            {chosen?.irreversibleNote ? (
              <Alert status="warning">{chosen.irreversibleNote}</Alert>
            ) : null}

            {remarks ? <div className="sa-decision__remarks">{remarks}</div> : null}
            {extras ? <div className="sa-decision__extras">{extras}</div> : null}

            <div className="sa-decision__actions">
              {onCancel ? (
                <Button type="button" appearance="text" onClick={onCancel}>
                  {cancelLabel}
                </Button>
              ) : null}
              <Button type="button" onClick={onSubmit} disabled={submitting}>
                {submitting ? "Recording…" : submitLabel}
              </Button>
            </div>
          </section>
        </div>
      </ScreenBody>
    </div>
  );
}
