"use client";

import * as React from "react";

/**
 * Tells the host page how tall this embed currently is.
 *
 * ── WHY AN IFRAME NEEDS TELLING AT ALL ──────────────────────────────────────
 *
 * An iframe does not size to its content; the host sets a height and the frame
 * scrolls inside it. For a fixed block that is fine. This one is not fixed: the
 * coverage section changes height when the reader drills into a state, when the
 * hostel filters wrap onto a second row on a narrow screen, and when the
 * village list's empty state replaces ten rows with one sentence.
 *
 * Guessing a height therefore fails in both directions — a scrollbar inside the
 * article, or a band of white under the card. The frame measures itself and
 * says so, and the host resizes.
 *
 * ── WHAT IT SENDS, AND WHAT IT DOES NOT ─────────────────────────────────────
 *
 * One message shape, `{ type: "pmajay-embed:height", height }`, and nothing
 * else. No page data, no reader state, no analytics. `postMessage` is a channel
 * out of this document, so what goes down it is worth being deliberate about:
 * a height is a fact about a rectangle and reveals nothing about the person
 * looking at it.
 *
 * `targetOrigin` is `"*"` and that is the one considered exception. The host is
 * whichever page framed us, we do not know its origin from inside, and the
 * payload is a single integer — there is no confidentiality to protect. Never
 * widen this message to carry anything a reader would mind a third party
 * reading.
 */
const MESSAGE_TYPE = "pmajay-embed:height";

export function EmbedAutoHeight() {
  React.useEffect(() => {
    if (window.parent === window) return; // Not framed; nothing to report to.

    let last = 0;
    const send = () => {
      /*
       * `scrollHeight` on the element, not `innerHeight`: the viewport is
       * whatever the host allotted, which is the number we are trying to
       * correct. Rounded up, because a fractional height the host floors is a
       * one-pixel scrollbar.
       */
      const height = Math.ceil(document.documentElement.scrollHeight);
      // A pixel of jitter on every resize would post hundreds of messages
      // during a drag. Two is below what anyone can see and above the noise.
      if (Math.abs(height - last) < 2) return;
      last = height;
      window.parent.postMessage({ type: MESSAGE_TYPE, height }, "*");
    };

    send();

    /*
     * ResizeObserver over the document element catches everything that changes
     * the height from inside — a drill-down, a filter, a wrapped row. A window
     * `resize` listener would only catch the host resizing the frame, which is
     * the half that already works.
     */
    const ro = new ResizeObserver(send);
    ro.observe(document.documentElement);

    // Fonts land after first paint and move everything down a few pixels.
    document.fonts?.ready.then(send).catch(() => {});

    return () => ro.disconnect();
  }, []);

  return null;
}
