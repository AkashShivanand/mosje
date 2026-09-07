"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { InlineEdit } from "../forms/inline-edit";
import { Link } from "../navigation/link";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

/** One configurable value. */
export interface SettingRow {
  id: string;
  label: string;
  /** The stored value. Empty renders `emptyText`, never a blank line. */
  value: string;
  /** One line under the field while editing. */
  hint?: string;
  maxLength?: number;
  /**
   * Present but not editable, and **why**.
   *
   * "Set by the Ministry; contact the nodal officer to change it." A missing
   * control is a puzzle; a stated reason is an answer — the rule `InlineEdit`
   * already enforces, restated here because a settings page is where the
   * temptation to simply omit the button is strongest.
   */
  readOnlyReason?: string;
  onSave: (value: string) => void | Promise<void>;
}

/** A named block of settings, and the anchor the index links to. */
export interface SettingsSection {
  id: string;
  title: string;
  description?: React.ReactNode;
  rows?: SettingRow[];
  /** Anything that is not a single editable value — a toggle list, a table. */
  children?: React.ReactNode;
}

export interface SettingsScreenProps extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  sections: SettingsSection[];
  /** @default "On This Page" */
  indexTitle?: string;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * SettingsScreen — configuration the reader administers.
 *
 * **Every save is confirmed, never optimistic, and this template will not offer
 * the alternative.** The catalogue recorded it as "blocked on the
 * optimistic-save decision"; it is not blocked, because on a departmental
 * register the decision is already made. An optimistic edit shows the new value
 * the instant it is typed and quietly reverts if the write fails — an officer
 * who saw the value change has no reason to look again, and the register still
 * holds the old one. `InlineEdit` states the same position and enforces it, so
 * this template inherits rather than re-argues it.
 *
 * **The index is a real list of links, not a sticky rail with scroll-spy.** A
 * settings page runs to a dozen sections; a reader looking for "Bank details"
 * should find it by name in one place. Anchor links survive with JavaScript
 * off, are shareable, and are what a keyboard user expects from a list of
 * headings.
 *
 * A row that is not a single value — a list of toggles, a table of delegates —
 * goes in `children`. Forcing everything through `InlineEdit` would be the
 * "God component" failure `design-system-architecture.md` §1 warns about.
 */
export function SettingsScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  actions,
  headingLevel = 1,
  sections,
  indexTitle = "On This Page",
  onRetry,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: SettingsScreenProps): React.JSX.Element {
  const status = resolveScreenState({ ...state, count: sections.length });
  const indexHeadingId = React.useId();

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} actions={actions} />

      <ScreenBody status={status} copy={copy} skeleton="form" onRetry={onRetry}>
        <div className="sa-settings">
          <nav aria-labelledby={indexHeadingId} className="sa-settings__index">
            <h2 id={indexHeadingId} className="sa-settings__index-title">
              {indexTitle}
            </h2>
            <ul className="sa-settings__index-list">
              {sections.map((section) => (
                <li key={section.id}>
                  <Link href={`#${section.id}`}>{section.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sa-settings__sections">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                /* The heading is the accessible name, so `aria-labelledby`
                   points at it rather than repeating the string in a label —
                   two copies of one name is two things to keep in step. */
                aria-labelledby={`${section.id}-heading`}
                className="sa-settings__section"
                /* Focusable target so a skip from the index lands ON the
                   section rather than merely scrolling it into view; without
                   it a keyboard reader's next Tab returns to the index. */
                tabIndex={-1}
              >
                <h2 id={`${section.id}-heading`} className="sa-settings__section-title">
                  {section.title}
                </h2>
                {section.description ? (
                  <p className="sa-settings__section-desc">{section.description}</p>
                ) : null}

                {section.rows && section.rows.length > 0 ? (
                  <div className="sa-settings__rows">
                    {section.rows.map((row) => (
                      <InlineEdit
                        key={row.id}
                        label={row.label}
                        value={row.value}
                        hint={row.hint}
                        maxLength={row.maxLength}
                        readOnlyReason={row.readOnlyReason}
                        onSave={row.onSave}
                      />
                    ))}
                  </div>
                ) : null}

                {section.children}
              </section>
            ))}
          </div>
        </div>
      </ScreenBody>
    </div>
  );
}
