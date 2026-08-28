"use client";

import * as React from "react";

/**
 * Whether the browser currently has a connection.
 *
 * WHY THIS EXISTS RATHER THAN A GUESS: a failed fetch and a lost connection
 * produce the same `catch` block and want opposite words. "This could not be
 * loaded" over a card whose real problem is aeroplane mode sends someone
 * looking for a fault in the service; "you are offline" tells them the one
 * thing that will fix it. `navigator.onLine` is the only signal that can tell
 * those apart, and it is free.
 *
 * `useSyncExternalStore` rather than an effect: the value is client-only, and
 * reconciling it in an effect would trigger a second render pass on every
 * mount. The server snapshot is `true` — a page rendered on the server is by
 * definition being served, so assuming a connection is the correct default and
 * it is corrected during hydration if wrong.
 *
 * `navigator.onLine` is honest about false negatives and optimistic about false
 * positives: `false` reliably means no network, `true` only means an interface
 * is up. Use it to EXPLAIN a failure that already happened, never to predict
 * one — do not gate a fetch on it.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

export function useOnlineStatus(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
