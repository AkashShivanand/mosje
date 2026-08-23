"use client";

import * as React from "react";
import "./live-region.css";

export interface LiveRegionProps {
  /**
   * How urgently assistive tech should announce updates.
   * `polite` waits for a pause; `assertive` interrupts. Prefer polite —
   * assertive is for genuine errors and time-critical alerts only.
   * @default "polite"
   */
  politeness?: "polite" | "assertive";
}

/**
 * MoSJE / SAMAVESH LiveRegion.
 *
 * A visually hidden ARIA live region for announcing changes that produce no
 * focus change — "3 records exported", "Filter applied, 12 results", "Saved".
 * Without one, screen-reader users get silence after an async action.
 *
 * Mount ONE per page (near the root) and drive it with `useLiveRegion()`.
 * The message is set via `textContent` on a ref rather than React state so an
 * announcement never triggers a re-render of the page that owns it.
 *
 * For toast-style feedback use `<ToastProvider>` instead — it announces itself.
 */
export const LiveRegion = React.forwardRef<HTMLDivElement, LiveRegionProps>(
  function LiveRegion({ politeness = "polite" }, ref) {
    return (
      <div
        ref={ref}
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className="ds-sr-only"
      />
    );
  },
);

export interface UseLiveRegionResult {
  /** Attach to a `<LiveRegion>`. */
  ref: React.RefObject<HTMLDivElement | null>;
  /** Announce a message to screen readers. */
  announce: (message: string) => void;
}

/**
 * Companion hook for `<LiveRegion>`.
 *
 * ```tsx
 * const live = useLiveRegion();
 * <LiveRegion ref={live.ref} />
 * live.announce(`${rows.length} records exported`);
 * ```
 */
export function useLiveRegion(): UseLiveRegionResult {
  const ref = React.useRef<HTMLDivElement>(null);

  const announce = React.useCallback((message: string) => {
    const node = ref.current;
    if (!node) return;
    /**
     * Screen readers ignore a live-region write when the text is byte-identical
     * to what is already there, so announcing the same message twice in a row
     * (e.g. "Filter applied" tapped repeatedly) would be silent the second time.
     * Clearing first, then setting on the next frame, forces a fresh diff.
     */
    node.textContent = "";
    requestAnimationFrame(() => {
      if (ref.current) ref.current.textContent = message;
    });
  }, []);

  return { ref, announce };
}
