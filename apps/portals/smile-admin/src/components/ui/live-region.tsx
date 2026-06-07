"use client";

import * as React from "react";

/**
 * Visually hidden live region for announcing dynamic updates to screen readers.
 * Mount once near the page root, then update its message via the returned ref.
 *
 * Example:
 *   const live = useLiveRegion();
 *   <LiveRegion ref={live.ref} />
 *   live.announce("3 records exported");
 */
export const LiveRegion = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
  />
));
LiveRegion.displayName = "LiveRegion";

export function useLiveRegion() {
  const ref = React.useRef<HTMLDivElement>(null);
  const announce = React.useCallback((msg: string) => {
    if (ref.current) {
      ref.current.textContent = msg;
    }
  }, []);
  return { ref, announce };
}
