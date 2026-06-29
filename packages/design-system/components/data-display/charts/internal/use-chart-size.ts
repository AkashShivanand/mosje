"use client";

import * as React from "react";

export interface Size {
  width: number;
  height: number;
}

/**
 * Observe an element's content box. Most charts scale via SVG `viewBox`, but
 * sparklines and responsive label-thinning need the real rendered width.
 */
export function useChartSize<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T | null>,
  Size,
] {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState<Size>({ width: 0, height: 0 });

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) setSize({ width: cr.width, height: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
}
