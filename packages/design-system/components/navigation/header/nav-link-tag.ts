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
  return (navLinkRoutes(item, linkAs) ? linkAs : "a") as NavTag;
}

/**
 * The same four rules as a PREDICATE — does this item route through `linkAs`?
 *
 * It exists because `react-hooks/static-components` reads
 * `const Tag = navLinkTag(item, linkAs)` followed by `<Tag …>` as a component
 * CONSTRUCTED during render. Nothing is constructed: the value is either the
 * string `"a"`/`"span"` or the `linkAs` prop, both stable. But the rule cannot
 * see through the call, and it is right to be conservative — a component really
 * created in render resets its state on every pass.
 *
 * The rule is satisfied when the tag's VALUE is traceable, even if the decision
 * behind it is a call. So call sites now read:
 *
 *   const Tag: React.ElementType = item.disabled
 *     ? "span"
 *     : navLinkRoutes(item, linkAs) ? linkAs! : "a";
 *
 * — a ternary over a prop and two literals, which the rule accepts, while the
 * four rules themselves stay here rather than being copied to ten call sites.
 * `navLinkTag` is kept and delegates to this, so nothing outside the masthead
 * has to change.
 */
export function navLinkRoutes(
  item: { disabled?: boolean; external?: boolean; href?: string },
  linkAs?: React.ElementType,
): boolean {
  if (item.disabled) return false;
  if (!linkAs || item.external) return false;
  const href = item.href;
  if (!href || href.startsWith("#")) return false;
  if (href.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(href)) return false;
  return true;
}
