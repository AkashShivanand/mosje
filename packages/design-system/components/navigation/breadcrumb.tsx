/*
 * NO "use client" — deliberately, and it is load-bearing, for the same reason
 * pagination.tsx has the same note at the top.
 *
 * The two shapes this component serves live on opposite sides of the RSC
 * boundary. A page trail is rendered by a SERVER component and passes `href`
 * strings; a drill trail is rendered by a CLIENT component and passes
 * `onSelect` functions. React cannot serialise a function across the boundary,
 * so claiming "use client" here would make every server-rendered trail throw
 * "Functions cannot be passed directly to Client Components" — which is exactly
 * what happened to Pagination on the search results page.
 *
 * Nothing here needs the client: no hooks, no browser API, no effect. Rendered
 * from a server component it stays server markup; imported by a client
 * component it is compiled into that bundle along with its `onSelect` handlers.
 */
import * as React from "react";
import { Icon } from "../utilities/icon";
import { cn } from "../../utils/cn";
import "./breadcrumb.css";

export interface BreadcrumbItem {
  /** The crumb's text. */
  label: string;
  /**
   * Where the crumb goes. Give this and the crumb renders a real `<a>` — the
   * DEFAULT and preferred shape for a trail that describes a page's place in a
   * site, because a link is shareable, middle-clickable, followed by a crawler
   * and works before hydration.
   */
  href?: string;
  /**
   * Handler for a crumb that changes CLIENT STATE rather than the URL — the
   * "India › Tamil Nadu" trail over a map that drills in place. Renders a
   * `<button>`. Ignored when `href` is given.
   */
  onSelect?: () => void;
  /**
   * Material Symbols name drawn before the label — `"home"` on the first crumb
   * of a site trail. Decorative: the label still carries the meaning, so the
   * glyph is `aria-hidden`.
   */
  icon?: string;
}

export interface BreadcrumbProps {
  /**
   * The trail, ancestor first. The LAST item is the page (or view) you are on:
   * it is never interactive, whatever it carries, and is the only one marked
   * `aria-current="page"`.
   */
  items: BreadcrumbItem[];
  /** Accessible name for the surrounding nav. @default "Breadcrumb" */
  label?: string;
  /**
   * Whether the trail may run onto a second line when it does not fit.
   *
   * `true` (the default) is right in a page-width container, where truncating a
   * long page title would hide the one crumb the reader most needs. Pass
   * `false` inside a FIXED-WIDTH rail, where a second line would change the
   * panel's height every time the reader drills.
   *
   * Either way the current crumb ellipsises rather than overflowing.
   */
  wrap?: boolean;
  /**
   * Router-aware link element for `href` crumbs — pass `next/link` inside a
   * Next app and the trail keeps soft navigation and prefetch. Defaults to a
   * plain `<a>`, which is what makes this component usable outside Next at all.
   *
   * Safe to pass from a SERVER component precisely because this file does not
   * claim `"use client"` (see the note at the top): the element type is
   * resolved during the server render rather than serialised across the
   * boundary.
   *
   * @default "a"
   */
  linkAs?: React.ElementType;
  className?: string;
}

/**
 * Breadcrumb — where this page, or this view, sits in the hierarchy.
 *
 * ── A CRUMB IS ONE OF FOUR THINGS ───────────────────────────────────────────
 *   `href`               a link to an ancestor page
 *   `onSelect`           a button that pops the drill state back to that level
 *   neither              a SECTION with no landing page of its own
 *   the last item        the page you are on — never interactive
 *
 * The third case is not an oversight, it is this estate's convention and 64
 * website pages rely on it: "Department", "Documents", "Connect", "Associated
 * Organisations" are mega-menu categories with no route behind them. Labelling
 * one is honest; linking it to somewhere it does not go is not.
 *
 * ── ACCESSIBILITY ───────────────────────────────────────────────────────────
 * A `<nav>` with an accessible name, an ordered list (the order is the meaning),
 * and `aria-current="page"` on the LAST crumb ONLY. `aria-current` marks exactly
 * one thing; the markup this replaced stamped it on every non-linked crumb, so
 * on all 64 of those pages a screen-reader user was told twice they were on the
 * current page — once about a section they were not on. Two is worse than none,
 * because the wrong one comes first.
 *
 * Separators are `chevron_right` glyphs and are `aria-hidden`, so the trail is
 * announced as a list of names rather than punctuated with "chevron right".
 * Every crumb clears 24px vertically (WCAG 2.2 AA §2.5.8).
 */
export function Breadcrumb({
  items,
  label = "Breadcrumb",
  wrap = true,
  linkAs: LinkAs = "a",
  className,
}: BreadcrumbProps): React.JSX.Element | null {
  if (items.length === 0) return null;

  return (
    <nav
      className={cn("ds-breadcrumb", !wrap && "ds-breadcrumb--nowrap", className)}
      aria-label={label}
    >
      <ol className="ds-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const glyph = item.icon ? (
            <Icon name={item.icon} size={16} className="ds-breadcrumb__icon" aria-hidden />
          ) : null;
          const text = <span className="ds-breadcrumb__text">{item.label}</span>;

          let content: React.JSX.Element;
          if (isLast) {
            content = (
              <span className="ds-breadcrumb__crumb ds-breadcrumb__current" aria-current="page">
                {glyph}
                {text}
              </span>
            );
          } else if (item.href) {
            content = (
              <LinkAs className="ds-breadcrumb__crumb ds-breadcrumb__link" href={item.href}>
                {glyph}
                {text}
              </LinkAs>
            );
          } else if (item.onSelect) {
            content = (
              <button
                type="button"
                className="ds-breadcrumb__crumb ds-breadcrumb__link"
                onClick={item.onSelect}
              >
                {glyph}
                {text}
              </button>
            );
          } else {
            /* A section with no landing page. Not a link, and NOT the current
               page — so it carries neither an href nor aria-current. */
            content = (
              <span className="ds-breadcrumb__crumb ds-breadcrumb__label">
                {glyph}
                {text}
              </span>
            );
          }

          return (
            <li key={`${item.label}-${index}`} className="ds-breadcrumb__item">
              {index > 0 && (
                <Icon
                  name="chevron_right"
                  size={16}
                  className="ds-breadcrumb__sep"
                  aria-hidden
                />
              )}
              {content}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
