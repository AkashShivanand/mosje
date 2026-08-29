import * as React from "react";
import { cn } from "../../utils/cn";
import "./content-nav.css";

export interface ContentNavChild {
  label: string;
  href: string;
  /**
   * The destination is off this site — a file, or another domain. Renders a
   * plain `<a>` opening in a new tab, with the launch glyph and a
   * screen-reader note, rather than routing through `linkAs`.
   */
  external?: boolean;
  /** Marks a dedicated sub-page transition (renders a chevron indicator). */
  isSubpage?: boolean;
}

export interface ContentNavItem {
  label: string;
  href: string;
  /** Marks the section the reader is on. Renders as the filled pill. */
  current?: boolean;
  /** See `ContentNavChild.external`. */
  external?: boolean;
  /** Marks a dedicated sub-page transition (renders a chevron indicator). */
  isSubpage?: boolean;
  /** Sub-links rendered under the item, indented and always visible. */
  children?: ContentNavChild[];
}

export interface ContentNavGroup {
  /** Banded caps label above the group, e.g. "OUR WORK & IMPACT". */
  label?: string;
  items: ContentNavItem[];
}

export interface ContentNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  groups: ContentNavGroup[];
  /**
   * Names the landmark. Required: a page may carry several navs (masthead,
   * breadcrumb, this one) and an unnamed one is announced as just
   * "navigation", which tells a screen-reader user nothing about which.
   */
  ariaLabel: string;
  /** Stick to the viewport as the reader scrolls the sections. @default true */
  sticky?: boolean;
  /**
   * Render each link with this component instead of `<a>` — pass the router's
   * link (e.g. Next's `Link`) so in-app navigation is not a full page load.
   * @default "a"
   */
  linkAs?: React.ElementType;
}

/**
 * ContentNav — the grouped section index beside a long content page.
 *
 * NOT `SidebarNav`. That is a portal application rail: every item carries an
 * icon, it collapses to a strip, and it is `"use client"` because it owns
 * open/closed state. This is a table of contents for a *document* — a stack of
 * labelled groups of links, no icons, no state, no client bundle. Merging the
 * two would mean either an icon per heading on a website page (there is no
 * honest icon for "About the Scheme") or a collapsible rail on a scheme page
 * that nobody asked to collapse.
 *
 * THE ACTIVE ITEM IS A FILLED PILL, and only one item may carry `current`. The
 * pill also sets `aria-current="page"`, so the state is conveyed to assistive
 * technology and not by the blue fill alone (WCAG 1.4.1).
 *
 * GROUP LABELS ARE NOT HEADINGS. They render as a banded caps label inside the
 * nav landmark rather than as `<h*>`, because a page's heading outline should
 * describe its *content*, not its navigation. The list structure is what
 * carries the grouping to a screen reader.
 *
 * EXTERNAL ITEMS ANNOUNCE THEMSELVES. An index reads as a list of places on this
 * page, so an entry that is really a PDF on another host has to say so — or the
 * reader finds out when a download starts. `external` renders a real
 * `<a target="_blank">` with the launch glyph AND a screen-reader phrase; the
 * glyph on its own conveys the fact by icon only, which no assistive technology
 * is obliged to read.
 *
 * THIS COMPONENT IS NOT INTERACTIVE, and `current` is a prop rather than
 * something it works out. Highlighting the section in view needs scroll
 * listeners, which would make every page that renders an index ship client
 * JavaScript for it. A consumer that wants scroll-spy computes `current` itself
 * and stays the only client component involved.
 *
 * @example
 * <ContentNav
 *   ariaLabel="Sections of this page"
 *   linkAs={Link}
 *   groups={[
 *     { label: "About us", items: [{ label: "About the Scheme", href: "#about", current: true }] },
 *     { label: "Our work & impact", items: [{ label: "Circulars & Notifications", href: "#circulars" }] },
 *   ]}
 * />
 */
export function ContentNav({
  groups,
  ariaLabel,
  sticky = true,
  linkAs: Link = "a",
  className,
  ...rest
}: ContentNavProps): React.JSX.Element {
  /**
   * One renderer for both levels. `external` decides the element, not the depth:
   * an in-page anchor routes through `linkAs`, an off-site file gets a real
   * anchor with the new-tab affordances.
   */
  const renderLink = (
    entry: ContentNavItem | ContentNavChild,
    variant: "link" | "sublink",
  ) => {
    const base = `ds-content-nav__${variant}`;
    const current = "current" in entry ? entry.current : false;
    const isExternal = entry.external === true;
    const isSubpage =
      !isExternal &&
      (entry.isSubpage === true ||
        (entry.href.startsWith("/") && !entry.href.includes("#")));

    if (isExternal) {
      return (
        <a
          href={entry.href}
          className={cn(base, `${base}--external`, current === true && `${base}--current`)}
          target="_blank"
          rel="noreferrer noopener"
          aria-current={current === true ? "page" : undefined}
        >
          <span className="ds-content-nav__label">{entry.label}</span>
          <svg
            className="ds-content-nav__ext"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6.5 3H3v10h10V9.5M9.5 2.5H13.5V6.5M13 3l-5.5 5.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ds-sr-only"> (opens in a new tab)</span>
        </a>
      );
    }

    if (isSubpage) {
      return (
        <Link
          href={entry.href}
          className={cn(base, `${base}--subpage`, current === true && `${base}--current`)}
          aria-current={current === true ? "page" : undefined}
        >
          <span className="ds-content-nav__label">{entry.label}</span>
          <svg
            className="ds-content-nav__chevron"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 3.5L10.5 8L6 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      );
    }

    return (
      <Link
        href={entry.href}
        className={cn(base, current === true && `${base}--current`)}
        aria-current={current === true ? "page" : undefined}
      >
        <span className="ds-content-nav__label">{entry.label}</span>
      </Link>
    );
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn("ds-content-nav", sticky && "ds-content-nav--sticky", className)}
      {...rest}
    >
      {groups.map((group, gi) => (
        <div className="ds-content-nav__group" key={group.label ?? gi}>
          {group.label != null && (
            <p className="ds-content-nav__group-label">{group.label}</p>
          )}
          <ul className="ds-content-nav__list">
            {group.items.map((item) => (
              <li key={item.href + item.label}>
                {renderLink(item, "link")}
                {item.children != null && item.children.length > 0 && (
                  <ul className="ds-content-nav__sublist">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>{renderLink(child, "sublink")}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
