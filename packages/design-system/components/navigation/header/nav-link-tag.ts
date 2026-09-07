import type * as React from "react";

/**
 * Which element a navigation item should render as.
 *
 * A DISABLED ITEM MUST NOT BE AN ANCHOR WITHOUT AN HREF. That is the shape five
 * of these components used to take, and it is the worst of both worlds: the
 * browser does not treat an href-less `<a>` as a link, so it is unfocusable and
 * a screen reader announces it as plain text — the option disappears for exactly
 * the people most helped by knowing it exists. `jsx-a11y/anchor-is-valid` flags
 * it, and the rule is right.
 *
 * Rendering a bare `<span>` satisfies the linter and loses the same
 * discoverability. So a disabled item renders as a `<span>` that is EXPLICITLY
 * a link — `role="link"`, `aria-disabled`, and a tab stop — which is announced
 * as a dimmed link and stays in the reading order, while never being navigable.
 *
 * The cast is deliberate and is the only thing this file exists to contain: the
 * union `"a" | "span"` cannot accept an `href` prop, and every call site passes
 * `href={disabled ? undefined : …}`, so the attribute is never actually emitted
 * onto a span.
 */
export type NavTag = "a";

export function navTag(disabled?: boolean): NavTag {
  return (disabled ? "span" : "a") as NavTag;
}

/** The ARIA a disabled navigation item needs to stay reachable. */
export function navDisabledAria(disabled?: boolean) {
  return disabled
    ? { role: "link" as const, tabIndex: 0, "aria-disabled": true as const }
    : {};
}

/**
 * Which element a navigation item should render as ONCE A ROUTER-AWARE LINK
 * COMPONENT IS AVAILABLE — the masthead's half of the estate's `linkAs` contract.
 *
 * WHY THIS EXISTS. Every row in the masthead rendered as a bare `<a href>`, so
 * every menu click was a FULL DOCUMENT LOAD: the whole JS bundle re-fetched, the
 * tree re-hydrated, the scroll position lost, and no prefetch to hide any of it.
 * Measured on the website home page, one click from "Department" to "About Us"
 * re-fetched 30 script files and took 1.9s to `loadEventEnd` — on localhost, with
 * a warm cache. `SiteFooter`, `ContentNav`, `Breadcrumb`, `Ticker` and
 * `Pagination` had all taken `linkAs` for exactly this reason; the masthead, the
 * one navigation surface on every page of every portal, was the one that never
 * got it, and nothing failed loudly enough for anyone to notice.
 *
 * FOUR HREFS MUST STAY A PLAIN ANCHOR, and the router component cannot be handed
 * any of them:
 *
 *   1. A DISABLED item — a `<span role="link">`, per `navTag` above.
 *   2. An EXTERNAL destination — the same rule `SiteFooter` states: a router link
 *      to another origin buys nothing and breaks `target="_blank"` semantics.
 *   3. `"#"` or any in-page fragment. A nav entry that OWNS A MENU carries
 *      `href="#"` and cancels its own click; routing that through a router link
 *      would ask it to navigate to a page that does not exist.
 *   4. Anything carrying a scheme (`mailto:`, `tel:`, `https:`) or a
 *      protocol-relative `//host` — off-site whatever the `external` flag says,
 *      because the flag is hand-set data and this is not.
 *
 * Everything else is an internal path and routes softly.
 */
export function navLinkTag(
  item: { disabled?: boolean; external?: boolean; href?: string },
  linkAs?: React.ElementType,
): NavTag {
  if (item.disabled) return navTag(true);
  if (!linkAs || item.external) return "a";
  const href = item.href;
  if (!href || href.startsWith("#")) return "a";
  if (href.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(href)) return "a";
  return linkAs as NavTag;
}
