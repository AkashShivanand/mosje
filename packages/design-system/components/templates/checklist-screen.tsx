"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Badge, type BadgeStatus } from "../feedback/badge";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { Icon } from "../utilities/icon";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

/**
 * Where one required artefact stands.
 *
 * Four states, not two, and the middle two are the reason this template exists.
 * A departmental upload is received, then scanned, then checked by a person —
 * and "attached" said the instant a file leaves the citizen's machine is a
 * claim the department has not yet made. `FileList` reached the same conclusion
 * about `scanning` for the same reason.
 */
export type ChecklistItemState = "missing" | "attached" | "review" | "rejected";

const STATE_BADGE: Record<ChecklistItemState, { status: BadgeStatus; word: string }> = {
  missing: { status: "neutral", word: "Not attached" },
  attached: { status: "success", word: "Attached" },
  review: { status: "warning", word: "Being checked" },
  rejected: { status: "danger", word: "Not accepted" },
};

const STATE_ICON: Record<ChecklistItemState, string> = {
  missing: "radio_button_unchecked",
  attached: "check_circle",
  review: "hourglass_top",
  rejected: "cancel",
};

export interface ChecklistItem {
  id: string;
  /** What the department calls this document — "Income certificate". */
  label: string;
  /** What it must show, or which authority issues it. */
  description?: React.ReactNode;
  /** @default true — most documents on a statutory checklist are mandatory. */
  required?: boolean;
  state: ChecklistItemState;
  /** The attached file's name, as the citizen gave it. Never rewritten. */
  fileName?: string;
  /**
   * What the checker found, one line each.
   *
   * Shown only when `state` is `rejected` or `review`, and shown in full — a
   * finding the citizen cannot read is a finding they cannot act on, so these
   * are never truncated behind a "show more".
   */
  findings?: string[];
  /** Upload, replace, remove, view. Yours to make operable at 24x24. */
  actions?: React.ReactNode;
}

/** A named run of requirements — "Organisation documents", "Financial records". */
export interface ChecklistGroup {
  id: string;
  title: string;
  description?: React.ReactNode;
  items: ChecklistItem[];
}

export interface ChecklistScreenProps extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  /** A batch dropzone above the groups — `MediaUpload`, or the portal's own. */
  upload?: React.ReactNode;
  /** Alerts above the list — accepted formats, a size ceiling. */
  notices?: React.ReactNode;

  groups: ChecklistGroup[];

  /** The step's controls, when this is a wizard step. */
  footer?: React.ReactNode;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * ChecklistScreen — a required set of artefacts, each with its own state.
 *
 * A legal `WizardScreen` step as often as it is a screen of its own
 * (`docs/design-system/screen-templates.md` §2b), which is why it takes a
 * `footer` slot rather than owning a Continue button: the wizard already has
 * one, and two would be two.
 *
 * **The progress line counts what is REQUIRED, not what is present.** A citizen
 * who has attached six optional documents and none of the four mandatory ones
 * has attached nothing that lets them submit, and a count of "6 attached" would
 * tell them the opposite.
 *
 * Reach for it when each row has its own verdict. A flat list of files with one
 * shared state is `FileList` inside a `FormScreen`.
 */
export function ChecklistScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  headingLevel = 1,
  upload,
  notices,
  groups,
  footer,
  onRetry,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: ChecklistScreenProps): React.JSX.Element {
  const items = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const status = resolveScreenState({ ...state, count: items.length });

  /* Required only, and "done" means the department has accepted it — a document
     still being checked is not one the citizen can stop thinking about. */
  const required = items.filter((i) => i.required !== false);
  const done = required.filter((i) => i.state === "attached").length;

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} />

      {notices ? <div className="sa-screen__notices">{notices}</div> : null}

      <ScreenBody status={status} copy={copy} skeleton="cards" onRetry={onRetry}>
        <div className="sa-checklist">
          {required.length > 0 ? (
            <p className="sa-screen__count" aria-live="polite">
              {`${done.toLocaleString("en-IN")} of ${required.length.toLocaleString("en-IN")} required documents accepted.`}
            </p>
          ) : null}

          {upload ? <div className="sa-checklist__upload">{upload}</div> : null}

          {groups.map((group) => (
            <ChecklistGroupBlock key={group.id} group={group} />
          ))}

          {footer ? <div className="sa-checklist__footer">{footer}</div> : null}
        </div>
      </ScreenBody>
    </div>
  );
}

/** One named run of requirements. Split out so each gets its own heading id. */
function ChecklistGroupBlock({ group }: { group: ChecklistGroup }): React.JSX.Element {
  const headingId = React.useId();
  return (
    <section aria-labelledby={headingId} className="sa-checklist__group">
      <div className="sa-checklist__group-head">
        <h3 id={headingId} className="sa-checklist__group-title">
          {group.title}
        </h3>
        {group.description ? (
          <p className="sa-checklist__group-desc">{group.description}</p>
        ) : null}
      </div>

      {/* A real list, so a screen reader says how many requirements there are
          before the reader starts through them. */}
      <ul className="sa-checklist__items">
        {group.items.map((item) => {
          const badge = STATE_BADGE[item.state];
          return (
            <li key={item.id} className="sa-checklist__item" data-state={item.state}>
              <Icon
                name={STATE_ICON[item.state]}
                size={24}
                className="sa-checklist__item-icon"
                aria-hidden
              />

              <div className="sa-checklist__item-main">
                <p className="sa-checklist__item-label">
                  {item.label}
                  {item.required !== false ? (
                    <span className="sa-checklist__req" aria-hidden="true">
                      {" *"}
                    </span>
                  ) : (
                    <span className="sa-checklist__optional"> (optional)</span>
                  )}
                </p>
                {item.description ? (
                  <p className="sa-checklist__item-desc">{item.description}</p>
                ) : null}
                {item.fileName ? (
                  <p className="sa-checklist__item-file">{item.fileName}</p>
                ) : null}

                {/* Findings are shown, not hidden behind a disclosure. The
                    citizen cannot correct a rejection they have to go looking
                    for. */}
                {item.findings && item.findings.length > 0 ? (
                  <ul className="sa-checklist__findings">
                    {item.findings.map((finding) => (
                      <li key={finding}>{finding}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="sa-checklist__item-side">
                <Badge status={badge.status}>{badge.word}</Badge>
                {item.actions ? (
                  <div className="sa-checklist__item-actions">{item.actions}</div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
