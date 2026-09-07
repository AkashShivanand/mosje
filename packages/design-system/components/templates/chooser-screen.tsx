"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { RadioGroup } from "../forms/control-group";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

/** One of the mutually exclusive things the reader may pick. */
export interface ChooserOption {
  /** Stable id. It is what the URL carries, so do not renumber it. */
  id: string;
  label: React.ReactNode;
  /** What picking this means, in the department's words. */
  description?: React.ReactNode;
  /** A right-aligned fact — a deadline, an amount, a count. */
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  /**
   * Why this option is present but cannot be picked — "Applications for
   * 2026-27 close on 31 March".
   *
   * An option the reader may never pick is OMITTED from the array, not passed
   * with a reason (`.claude/rules/screen-templates.md` §4). This field is for
   * the other case: an option that is genuinely available to this reader and
   * temporarily closed, where the reason is the answer they came for.
   */
  unavailableReason?: string;
}

export interface ChooserScreenProps extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  /**
   * The question the options answer, as a `legend`.
   *
   * Required, and not decorative. Without it a screen reader announces
   * "SHRESHTA Mode 2, radio button, 3 of 4" and never says what is being
   * chosen — the note on `ControlGroup` explains why the estate makes this
   * non-optional.
   */
  legend: string;
  /** Hide the legend visually where the page title already asks the question. */
  hideLegend?: boolean;

  options: ChooserOption[];
  /** The chosen id. `undefined` means nothing is chosen — never invent a default. */
  value?: string;
  onChange: (id: string) => void;
  /** Shown under the group when the reader continues without choosing. */
  error?: React.ReactNode;

  onContinue: () => void;
  /** @default "Save and Continue" */
  continueLabel?: string;
  onBack?: () => void;
  /** @default "Back" */
  backLabel?: string;

  onRetry?: () => void;
  /** Offered from the empty state — "Notify me when applications open". */
  emptyAction?: React.ReactNode;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * ChooserScreen — a finite set of mutually exclusive options, and one Continue.
 *
 * **The handoff draws this screen three different ways under one name.** All
 * three frames are called `e-anudaan-select-scheme`; AVYAY and NAPDDR place a
 * 800px column with a 170px gutter and use `radio-card` instances, while
 * SHRESHTA runs 1068 full-bleed, shifts the column 24px, hand-builds four
 * frames with no component at all, and shrinks the CTA from 223 to 105
 * (`docs/audit/figma-handoff-defects-2026-09-06.md` §2.2). One of those is a
 * design; the other two are drift. This template ships the first.
 *
 * The options are `RadioGroup variant="card"` rather than a bespoke tile,
 * because a scheme chooser is a radio group and building it out of clickable
 * divs is how three portals ended up with a control that arrow keys do not
 * move through.
 *
 * Reach for it when the set is **finite, mutually exclusive and known**. A set
 * the reader narrows is `WorklistScreen`; a set they browse is
 * `CatalogueScreen`.
 */
export function ChooserScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  headingLevel = 1,
  legend,
  hideLegend = false,
  options,
  value,
  onChange,
  error,
  onContinue,
  continueLabel = "Save and Continue",
  onBack,
  backLabel = "Back",
  onRetry,
  emptyAction,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: ChooserScreenProps): React.JSX.Element {
  /* A chooser with nothing to choose from is a real state, and a common one:
     a scheme window that has closed publishes no options. It gets the empty
     branch rather than an empty fieldset. */
  const status = resolveScreenState({ ...state, count: options.length });

  const groupOptions = React.useMemo(
    () =>
      options.map((option) => ({
        value: option.id,
        label: option.label,
        description: option.unavailableReason ? (
          <>
            {option.description}
            {option.description ? " " : null}
            <strong>{option.unavailableReason}</strong>
          </>
        ) : (
          option.description
        ),
        meta: option.meta,
        icon: option.icon,
        disabled: option.unavailableReason != null,
      })),
    [options],
  );

  /* Stable across renders and unique on the page, so two choosers in one
     document — a specimen page renders several — cannot share a radio name and
     silently deselect each other. */
  const reactId = React.useId();
  const groupName = `chooser${reactId.replace(/:/g, "")}`;

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} />

      <ScreenBody
        status={status}
        copy={copy}
        skeleton="cards"
        onRetry={onRetry}
        emptyAction={emptyAction}
      >
        <div className="sa-chooser">
          <RadioGroup
            name={groupName}
            legend={legend}
            hideLegend={hideLegend}
            options={groupOptions}
            value={value}
            onChange={onChange}
            error={error}
            variant="card"
            cardLayout="detailed"
            required
          />

          <div className="sa-chooser__actions">
            {onBack ? (
              <Button type="button" appearance="outlined" onClick={onBack}>
                {backLabel}
              </Button>
            ) : null}
            {/* Not disabled while nothing is chosen. A dead Continue explains
                nothing; pressing it and being told which question is unanswered
                is how the estate handles every other required field, and WCAG
                2.2 §3.3.1 asks for the message rather than the absence. */}
            <Button type="button" onClick={onContinue}>
              {continueLabel}
            </Button>
          </div>
        </div>
      </ScreenBody>
    </div>
  );
}
