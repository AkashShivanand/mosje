import * as React from "react";
import { cn } from "../../utils/cn";
import { navLinkRoutes } from "../navigation/header/nav-link-tag";
import "./list-group.css";

export interface ListGroupProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  /** The rows. Use `ListRow`; anything else must render an `<li>` itself. */
  children: React.ReactNode;
  /** Hairline between rows. @default true */
  divided?: boolean;
  /** Border and radius around the whole list, making it a panel. */
  bordered?: boolean;
  /**
   * Pulls the list out by a row's own side padding, so the rows' TEXT lines up with whatever
   * sits above them and the hover band still reaches the container's inner edge.
   *
   * For a list inside a card beside other content. A row is inset so its hover and focus band
   * is not flush with the text, which is right for a standalone panel and wrong under a
   * heading or a set of readings — there the rows read as indented from everything else by
   * 16px. Do not use it on a `bordered` list, which owns its own edge.
   */
  flush?: boolean;
  /** @default "md" */
  size?: "md" | "sm";
  /**
   * The list's accessible name. Required when the list is not already under a
   * heading that names it — a bare list of rows announced as "list, 12 items"
   * tells a screen-reader user how many of what.
   */
  "aria-label"?: string;
}

/**
 * MoSJE / SAMAVESH List Group.
 *
 * A real `<ul>` of rows, with a leading slot, a title, an optional description
 * and a trailing slot. It is the surface behind "recent applications", "recent
 * searches", a notification list, a document list, and a page of search results.
 *
 * **It is not a DataTable.** A table is for records the reader compares across
 * columns — sorting, scanning down one field, exporting. A list is for records
 * the reader takes one at a time. Reaching for a table because the data has
 * fields produces twelve columns on a phone; reaching for a list because it
 * looks lighter produces a comparison the reader cannot make.
 */
export function ListGroup({
  children,
  divided = true,
  bordered = false,
  flush = false,
  size = "md",
  className,
  ...rest
}: ListGroupProps): React.JSX.Element {
  return (
    <ul
      className={cn(
        "ds-list",
        `ds-list--${size}`,
        divided && "ds-list--divided",
        bordered && "ds-list--bordered",
        flush && !bordered && "ds-list--flush",
        className,
      )}
      {...rest}
    >
      {children}
    </ul>
  );
}

export interface ListRowProps {
  /** The row's own line — the thing the reader is looking for. */
  title: React.ReactNode;
  /** One or two lines under the title. */
  description?: React.ReactNode;
  /** Small print above the title — a reference number, a date, a category. */
  eyebrow?: React.ReactNode;
  /** Icon, avatar or organisation mark before the text. Decorative. */
  leading?: React.ReactNode;
  /** Status, count or action at the end of the row. */
  trailing?: React.ReactNode;
  /**
   * Makes the whole row a link. A row is a link when it goes somewhere and a
   * button when it does something; it is never both, and a row that is neither
   * stays plain text rather than becoming a `div` with a click handler.
   */
  href?: string;
  /** Makes the whole row a button. Ignored when `href` is set. */
  onClick?: () => void;
  /**
   * The app's router link (`next/link`), for a row with an `href`. Defaults to a plain `<a>`.
   *
   * linkAs-gate(href-only): a row with no `href` navigates nowhere and needs no router link.
   *
   * PASS IT. Without it every row-click is a full document load — the bundle re-fetched, the
   * tree re-hydrated, the scroll position lost, no prefetch — and nothing looks broken, which is
   * why it goes unnoticed. The officer dashboard's figures became links and paid exactly that.
   * An external destination, a fragment and a disabled row stay a plain anchor by the estate's
   * usual four rules (`navLinkRoutes`).
   */
  linkAs?: React.ElementType;
  /** Marks the row as the current one. Sets `aria-current` on a link. */
  selected?: boolean;
  /** Present but not choosable. Keeps `aria-disabled` rather than removing the row. */
  disabled?: boolean;
  className?: string;
}

/**
 * One row of a `ListGroup`.
 *
 * A row with an `href` routes through `linkAs` when the app hands it one, so a row-click is a
 * navigation rather than a document load.
 *
 * The whole row is the target when `href` or `onClick` is given — not the title
 * inside it. A 40px-wide link inside a 600px row is a target most people miss
 * and everyone with a tremor misses, and WCAG 2.2 §2.5.8 is the floor, not the
 * goal. Where a row needs a *second* action as well as its own, that action goes
 * in `trailing` as its own control and the row itself stays plain.
 */
export function ListRow({
  title,
  description,
  eyebrow,
  leading,
  trailing,
  href,
  onClick,
  linkAs,
  selected = false,
  disabled = false,
  className,
}: ListRowProps): React.JSX.Element {
  const body = (
    <>
      {leading ? (
        <span className="ds-list__leading" aria-hidden>
          {leading}
        </span>
      ) : null}
      <span className="ds-list__text">
        {eyebrow ? <span className="ds-list__eyebrow">{eyebrow}</span> : null}
        <span className="ds-list__title">{title}</span>
        {description ? (
          <span className="ds-list__description">{description}</span>
        ) : null}
      </span>
      {trailing ? <span className="ds-list__trailing">{trailing}</span> : null}
    </>
  );

  const inner = cn(
    "ds-list__row",
    selected && "ds-list__row--selected",
    disabled && "ds-list__row--disabled",
    className,
  );

  if (href && !disabled) {
    const LinkTag: React.ElementType = navLinkRoutes({ href, disabled }, linkAs) ? linkAs! : "a";
    return (
      <li className="ds-list__item">
        <LinkTag
          href={href}
          className={cn(inner, "ds-list__row--interactive")}
          aria-current={selected ? "page" : undefined}
        >
          {body}
        </LinkTag>
      </li>
    );
  }

  if (onClick && !disabled) {
    return (
      <li className="ds-list__item">
        {/* raw-button-ok(primitive): the row IS the control — the button form of the .ds-list__row--interactive anchor above it */}
        <button
          type="button"
          className={cn(inner, "ds-list__row--interactive")}
          aria-pressed={selected || undefined}
          onClick={onClick}
        >
          {body}
        </button>
      </li>
    );
  }

  return (
    <li className="ds-list__item">
      <div className={inner} aria-disabled={disabled || undefined}>
        {body}
      </div>
    </li>
  );
}
