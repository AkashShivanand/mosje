import type { Ref } from "react";

/**
 * Combine several refs into one callback ref.
 *
 * A component that clones its child to attach a ref — `Tooltip` is the one in
 * this package — MUST merge rather than assign. `cloneElement(child, { ref })`
 * silently overwrites whatever ref the consumer already put on that child, and
 * the consumer's ref is often load-bearing: `Tabs` uses its per-tab refs to move
 * focus and to measure the sliding indicator, so a tooltip clobbering them would
 * break keyboard navigation for the exact tabs that needed the tooltip most.
 *
 * The failure is silent — the child still renders, the ref just never fires —
 * which is why this is a shared util and not a local closure.
 *
 * REACT 19: `ref` arrives as an ordinary prop — read `element.props.ref`. Do NOT
 * read `element.ref`: React 19 removed it, and touching it throws during render.
 * This accepts the `undefined`/`null` an absent ref prop produces.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      // `current` is readonly in the public RefObject type, but assigning it is
      // exactly what React itself does for an object ref.
      else (ref as { current: T | null }).current = node;
    }
  };
}
