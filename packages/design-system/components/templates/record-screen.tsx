"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { TabPanel, Tabs, type TabDef } from "../navigation/tabs";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

/** A headline fact about the record — the strip under the title. */
export interface RecordFact {
  label: string;
  value: React.ReactNode;
}

/** One tab of the record, and its body. */
export interface RecordTab {
  /** Stable id. It is what a deep link carries, so do not renumber it. */
  id: string;
  label: string;
  icon?: string;
  /**
   * The tab's body.
   *
   * A function, not a node, so a tab nobody has opened costs nothing to render
   * — a record with a thousand-row history should not pay for it on arrival.
   */
  render: () => React.ReactNode;
}

export interface RecordScreenProps extends ScreenStateInput {
  /** Where this record sits. Omit only at the top of a section. */
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  /** The record's name, as the register holds it. */
  title: string;
  meta?: React.ReactNode;
  /** A status `Badge`, an SLA indicator — whatever states where the record is. */
  status?: React.ReactNode;
  /** Actions on the record. Omit the ones this role may not perform. */
  actions?: React.ReactNode;

  /**
   * Heading level for the page title. Leave at 1: a portal screen has exactly
   * one `<h1>` and this is it.
   *
   * Drop to 2 when the template is rendered INSIDE a page that already has one
   * — a documentation specimen, or a screen body embedded in another screen.
   * Same contract as `PortalLoginTemplate.headingLevel`, and the reason it
   * exists: measuring a documentation page found two `<h1>`s, because the
   * specimen is a live template rather than a picture of one.
   * @default 1
   */
  headingLevel?: 1 | 2;

  /** The headline facts. Four to six; beyond that it is a description list. */
  facts?: RecordFact[];

  /**
   * The tabs. Keep a tab whose content is empty — **show its empty state**.
   *
   * Removing it moves every tab to its right and breaks a link someone sent.
   */
  tabs: RecordTab[];
  /** The open tab's id. Drive it from the URL so a tab can be linked to. */
  activeTab?: string;
  onTabChange?: (id: string) => void;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * RecordScreen — one record, read-only.
 *
 * Reach for it when the reader is looking something up. If they are changing
 * the record's state, that is `DecisionScreen`; if they are editing its fields,
 * `FormScreen` or `WizardScreen`; if it has not been submitted yet,
 * `ReviewScreen`.
 *
 * **A value the register does not publish is omitted, never stubbed.** Do not
 * pass a fact whose value is "Not yet reported" — `live-data-fallback.md` bans
 * it, and a row that says nothing costs the reader a line and teaches them the
 * screen is padded.
 */
export function RecordScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  status,
  actions,
  facts,
  tabs,
  activeTab,
  onTabChange,
  onRetry,
  headingLevel = 1,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: RecordScreenProps): React.JSX.Element {
  const screenStatus = resolveScreenState({ ...state, count: tabs.length });

  /* Uncontrolled fallback, so a screen that has not wired its URL yet still
     works. Controlled is the intended use: a tab that cannot be linked to is a
     tab nobody can send anyone to. */
  const [internalTab, setInternalTab] = React.useState(tabs[0]?.id ?? "");
  const currentId = activeTab ?? internalTab;
  const currentIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === currentId),
  );

  const tabDefs: TabDef[] = React.useMemo(
    () => tabs.map((t) => ({ id: t.id, label: t.label, icon: t.icon })),
    [tabs],
  );

  /* One idBase, from `useId`, so the two halves of the ARIA relationship cannot
     drift apart AND cannot collide.
     
     It was derived from the TITLE until review caught what `\W` does to a
     non-Latin script: with no `u` flag every Devanagari character is a
     "non-word" character and is stripped, so "आवेदन विवरण" and "पंजीकरण विवरण"
     both slugged to `record--`. Two Hindi-titled records on one page would then
     share an id and `aria-controls` would resolve to the wrong panel — the exact
     defect the TabPanel change below fixed for the index case, reintroduced by
     the fix itself. GIGW requires this estate to be bilingual, so a title is
     never a safe id source. */
  const reactId = React.useId();
  const idBase = `record${reactId.replace(/:/g, "")}`;

  const handleChange = (index: number): void => {
    const next = tabs[index];
    if (!next) return;
    if (onTabChange) onTabChange(next.id);
    else setInternalTab(next.id);
  };

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? (
        <Breadcrumb items={breadcrumb} />
      ) : null}

      <PageHeader
        as={headingLevel}
        eyebrow={eyebrow}
        title={title}
        meta={meta}
        actions={
          status || actions ? (
            <>
              {status}
              {actions}
            </>
          ) : undefined
        }
      />

      <ScreenBody
        status={screenStatus}
        copy={copy}
        skeleton="detail"
        onRetry={onRetry}
      >
        <div className="sa-record">
          {facts && facts.length > 0 ? (
            <div className="sa-record__summary">
              {facts.map((fact) => (
                <div key={fact.label} className="sa-record__fact">
                  <span className="sa-record__fact-label">{fact.label}</span>
                  <span className="sa-record__fact-value">{fact.value}</span>
                </div>
              ))}
            </div>
          ) : null}

          <Tabs
            tabs={tabDefs}
            active={currentIndex}
            onChange={handleChange}
            idBase={idBase}
            ariaLabel={`${title} sections`}
            overflow
          />

          {/* Only the open tab renders — `render` is a function, so a tab nobody
              has opened costs nothing.

              `TabPanel` rather than a hand-rolled div: Tabs keys `aria-controls`
              by the tab's ID STRING, and an earlier version of this template
              built the panel's id from the index instead. `aria-controls` then
              pointed at `…-panel-details` while the panel was `…-panel-0`, so
              the relationship a screen reader follows did not resolve. Caught by
              reading what Tabs emits. */}
          <TabPanel idBase={idBase} tabId={tabs[currentIndex]?.id ?? ""}>
            {tabs[currentIndex]?.render()}
          </TabPanel>
        </div>
      </ScreenBody>
    </div>
  );
}
