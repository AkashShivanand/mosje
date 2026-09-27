"use client";

import { BackToTop } from "@mosje/design-system";

/**
 * The reference's scroll-to-top control is the estate's `BackToTop` in the
 * reference's dress (a primary-800 circle, white arrow — chrome.css). It keeps the
 * design system's behaviour: it appears after 800px, sits at the top of the corner
 * rail, moves focus to <main> as well as the scroll, and yields over the cookie bar.
 */
export function DbimScrollToTop() {
  return <BackToTop className="db-totop" label="Move to top of the page" />;
}
