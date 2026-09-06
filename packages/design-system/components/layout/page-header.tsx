import * as React from "react";
import { cn } from "../../utils/cn";
import "./layout.css";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * A short uppercase kicker above the title — the scheme, the module, the
   * section this page sits in. It is not a heading and carries no level: it
   * qualifies the title rather than competing with it.
   */
  eyebrow?: React.ReactNode;
  /** The page title. Rendered as the page's `<h1>` unless `as` says otherwise. */
  title: string;
  /** Supporting line under the title — "Last updated: 27 Jan 2026, 03:05 pm". */
  meta?: React.ReactNode;
  /** Primary and secondary actions, aligned to the trailing edge. */
  actions?: React.ReactNode;
  /**
   * Heading level. Leave at 1: a portal page has exactly one `<h1>` and this is
   * it. Drop to 2 only when this sits inside a page that already has one.
   * @default 1
   */
  as?: 1 | 2;
  /** Set on the heading so a region can point `aria-labelledby` at it. */
  headingId?: string;
}

/**
 * PageHeader — the row every portal page opens with: title, meta line, actions.
 *
 * HUGS its content. It carries no height, because a two-line scheme name and a
 * one-line dashboard title are both correct and the row must fit either. On a
 * narrow viewport the actions wrap below the title rather than compressing it.
 *
 * Distinct from `SectionTitle`, which labels a section *inside* a page. If the
 * heading is not the page's subject, reach for that instead.
 */
export function PageHeader({
  eyebrow,
  title,
  meta,
  actions,
  as = 1,
  headingId,
  className,
  ...rest
}: PageHeaderProps): React.JSX.Element {
  const Heading = (as === 1 ? "h1" : "h2") as "h1" | "h2";
  return (
    <header className={cn("sa-page-header", className)} {...rest}>
      <div className="sa-page-header__text">
        {eyebrow ? <p className="sa-page-header__eyebrow">{eyebrow}</p> : null}
        <Heading id={headingId} className="sa-page-header__title">
          {title}
        </Heading>
        {meta ? <p className="sa-page-header__meta">{meta}</p> : null}
      </div>
      {actions ? <div className="sa-page-header__actions">{actions}</div> : null}
    </header>
  );
}
