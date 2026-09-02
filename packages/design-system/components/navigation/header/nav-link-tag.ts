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
