/**
 * Whether the cookie consent banner is shown.
 *
 * DEFAULT OFF, AND THAT IS TEMPORARY. The banner is being redesigned, and it
 * is switched off until that lands rather than left up in a state nobody is
 * happy with.
 *
 * THE COMPLIANCE NOTE THAT GOES WITH THAT, recorded because turning this on
 * again is a decision someone will make later without this context:
 *
 * The banner's own copy claims compliance with GIGW 3.0 and DBIM, and
 * `.claude/rules/guidelines.md` classes consent behaviour as the kind of thing
 * adopted unconditionally rather than fitted in where convenient. Hiding it
 * therefore has a compliance dimension, not only a visual one. Two things make
 * that defensible for now and both are conditions, not excuses:
 *
 *  - this is a gated prototype, not a live public service, and
 *  - the site sets only `mosje_cookie_consent` in localStorage, which is a
 *    first-party functional value and not tracking.
 *
 * If either stops being true — real analytics, real users, an ungated
 * deployment — the banner goes back up BEFORE that happens, redesigned or not.
 */

import { SETTING_COOKIE_BANNER, type StoreDeps } from "../settings/store.ts";
import { readToggle, type ToggleConfig } from "../settings/toggle.ts";

export type CookieBannerConfig = ToggleConfig;

/** Off until the redesign lands. See the note above before changing this. */
export const COOKIE_BANNER_DEFAULT_ENABLED = false;

export function readCookieBannerConfig(
  deps?: StoreDeps,
): Promise<CookieBannerConfig | null> {
  return readToggle(SETTING_COOKIE_BANNER, deps);
}

/**
 * The final answer. Pure, so it is testable without a store.
 *
 * Note the failure direction is the OPPOSITE of the demo dock's: null means
 * every read failure, and here that resolves to HIDDEN. Falling back to
 * showing a banner the team has deliberately taken down — because a database
 * blipped — would be the surprising outcome.
 */
export function cookieBannerEnabled(config: CookieBannerConfig | null): boolean {
  return config?.enabled ?? COOKIE_BANNER_DEFAULT_ENABLED;
}
