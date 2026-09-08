/**
 * Whether the campaign band has been dismissed, shared by the band and the hero.
 *
 * ── WHY A STORE AND NOT A CONTEXT ───────────────────────────────────────────
 *
 * The two components are siblings rendered by a SERVER component: the band sits
 * in `afterBreadcrumb`, the badge inside `SitePageHeader`'s logo slot, and the
 * organisation route between them cannot hold client state. A provider would
 * mean wrapping the whole fold in a client boundary to pass one boolean, which
 * turns the hero, the fact strip and the page title into client components for
 * no other reason.
 *
 * `useSyncExternalStore` is the estate's own answer to this — the same shape
 * `DataModeProvider` uses, and for the same reason: it reads a value that lives
 * outside React without an effect, so the first paint is already correct.
 *
 * ── IN MEMORY, AND DELIBERATELY ─────────────────────────────────────────────
 *
 * Not `localStorage`, not `sessionStorage`. The band's own contract is that a
 * campaign the Department is running is not something a reader switches off
 * permanently by clicking one ×; it is something they push out of the way to
 * read the page underneath. The state dies with the page, and so does the badge.
 */

import { useSyncExternalStore } from "react";

let dismissed = false;
const listeners = new Set<() => void>();

export function dismissCampaign(): void {
  if (dismissed) return;
  dismissed = true;
  for (const l of listeners) l();
}

/** Reset between pages — a route change must not carry a dismissal with it. */
export function resetCampaignDismissal(): void {
  if (!dismissed) return;
  dismissed = false;
  for (const l of listeners) l();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

const getSnapshot = () => dismissed;
/** The server always renders the undismissed state; there is no other truth
 *  there, and hydrating to `false` is what makes the badge's entrance an
 *  entrance rather than a flash of something already present. */
const getServerSnapshot = () => false;

export function useCampaignDismissed(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
