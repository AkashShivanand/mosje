import { Icon } from "@mosje/design-system";

/**
 * The redesign's one table frame for running text (issues MOB-03, ACC-16).
 *
 * A wide table scrolls inside a labelled, focusable region instead of pushing
 * the page sideways on a phone. `tabIndex={0}` lets a keyboard user scroll it;
 * the label is what a screen reader announces on arrival, so it names the table.
 */
export function TableWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="wn-table-wrap" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}

/**
 * A reference table a reader opens when they need it (issue LAY-12): long
 * statistical and allocation tables collapse behind their title so the page is
 * readable end to end.
 *
 * Native `<details>`, deliberately, not the DS `Accordion`: the Accordion
 * unmounts its content while closed, so a closed table would be absent from the
 * server HTML and from the browser's find-in-page. A reader searching the page
 * for their district must find it whether or not the table is open. `<summary>`
 * exposes its expanded state to assistive technology on its own.
 */
export function Collapsible({
  title,
  meta,
  children,
  id,
}: {
  title: string;
  /** One short line under the title, e.g. the reference date or the row count. */
  meta?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <details className="wn-disclosure" id={id}>
      <summary className="wn-disclosure__summary">
        <span className="wn-disclosure__title">{title}</span>
        {meta && <span className="wn-disclosure__meta">{meta}</span>}
        <span className="wn-disclosure__icon" aria-hidden="true">
          <Icon name="expand_more" size={24} />
        </span>
      </summary>
      <div className="wn-disclosure__body">{children}</div>
    </details>
  );
}
