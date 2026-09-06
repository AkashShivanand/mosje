"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { useCornerRailOffset } from "../../foundations/corner-rail";
import "./back-to-top.css";

export interface BackToTopProps {
  /**
   * How far down the page it appears, in pixels. Below this the control is not
   * rendered at all — a control that does nothing is a control in the way.
   * @default 800
   */
  showAfter?: number;
  /** @default "Back to top" */
  label?: string;
  className?: string;
}

/**
 * The element this page actually scrolls.
 *
 * It is NOT always the window. This estate's shells put `overflow-y: auto` on
 * `<body>`, so `window.scrollY` stays at 0 on a 16,000px page and a control
 * watching it never appears — which is exactly what the first version of this
 * component did. Walk up from where the control is mounted, take the first
 * ancestor that genuinely scrolls, and fall back to the document's own scroller.
 */
function scrollerFor(node: HTMLElement | null): HTMLElement {
  const root = (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
  for (let n = node?.parentElement ?? null; n; n = n.parentElement) {
    const overflow = getComputedStyle(n).overflowY;
    if (/(auto|scroll)/.test(overflow) && n.scrollHeight > n.clientHeight + 1) return n;
  }
  return root;
}

/**
 * MoSJE / SAMAVESH Back to top.
 *
 * The control that returns a reader to the top of a long page. One MIS report on
 * this estate is 12,796px tall; without it, getting back to the filters is a
 * scroll a citizen on a phone will not make.
 *
 * **It sits at the TOP of the corner stack, and that is not arbitrary.** The
 * rail orders by permanence: the accessibility widget anchors the corner because
 * it is statutory and never goes away, the chat launcher sits above it, and this
 * — which appears and disappears as the reader scrolls — sits above both.
 * Putting it at the bottom would slide the two controls that most need to be
 * findable by muscle memory up and down the page on every scroll.
 *
 * **It moves focus, not just the scroll position.** Scrolling to the top leaves
 * a keyboard reader's focus where it was, half a page down, so the next Tab
 * takes them back to where they started and the button appears to have done
 * nothing. This moves focus to the page's main landmark as well.
 *
 * **It finds the element the page actually scrolls**, rather than assuming the
 * window. See `scrollerFor` above: this estate scrolls `<body>`, and a control
 * watching `window.scrollY` would never appear at all.
 */
export function BackToTop({
  showAfter = 800,
  label = "Back to top",
  className,
}: BackToTopProps): React.JSX.Element {
  const [shown, setShown] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);
  /** Always in the DOM, so the scroll container can be found before the control appears. */
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  // Writes --sa-corner-rail-bottom onto the element from live occupancy. Never
  // hard-code the offset: the chatbot panel's max-height subtracts it, and the
  // one time it was assumed the panel opened with its header off-screen.
  useCornerRailOffset(ref);

  /**
   * The scroller is resolved LAZILY, not once at mount.
   *
   * Resolving it in a mount effect looked right and was wrong: at that moment
   * the region may not have been laid out yet, so `scrollHeight > clientHeight`
   * is false, no scrolling ancestor is found, and the control spends the rest of
   * its life watching the wrong element. Measured on this component's own
   * documentation page, where the region reported a client height of 0 on mount
   * and 286 a frame later.
   *
   * Scroll events do not bubble, but a listener on `document` in the CAPTURE
   * phase receives them from every element — so one listener covers the window,
   * the body, and any panel the control happens to be inside.
   */
  const scrollerRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    const read = () => {
      if (!scrollerRef.current || scrollerRef.current.scrollHeight <= scrollerRef.current.clientHeight + 1) {
        scrollerRef.current = scrollerFor(anchorRef.current);
      }
      setShown((scrollerRef.current?.scrollTop ?? 0) > showAfter);
    };
    read();
    document.addEventListener("scroll", read, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", read, true);
  }, [showAfter]);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scroller = scrollerRef.current ?? scrollerFor(anchorRef.current);
    scroller.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    // Focus has to follow the scroll, or the next Tab returns the reader to
    // where they were and the control appears to have done nothing.
    const main = document.querySelector<HTMLElement>("main");
    if (main) {
      const had = main.hasAttribute("tabindex");
      if (!had) main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      if (!had) main.removeAttribute("tabindex");
    }
  };

  return (
    <>
      {/* A zero-size anchor that is always present, so the scroll container can
          be resolved even while the control itself is not rendered. */}
      <span ref={anchorRef} hidden />
      {shown ? (
    <button
      type="button"
      className={cn("ds-back-to-top", className)}
      // The corner rail measures live occupancy; this attribute is how the rail
      // knows the control is here, and it is added WITH the control rather than
      // after somebody reports an overlap.
      ref={ref}
      data-sa-corner-occupant=""
      aria-label={label}
      onClick={toTop}
    >
      <span aria-hidden>↑</span>
    </button>
      ) : null}
    </>
  );
}
