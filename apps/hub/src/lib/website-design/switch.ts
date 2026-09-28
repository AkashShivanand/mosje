/**
 * Switching the website's design from the demo rail — by the Website tab or by shortcut —
 * and putting the reader back on the same section afterwards. Browser-only.
 *
 * The matching rules are in `section-anchor.ts`; this is the part that reads the page.
 */

import {
  WEBSITE_DESIGN_COOKIE,
  parseWebsiteDesign,
  type WebsiteDesign,
} from "./constants";
import { rankHeadings, resolveScroll, normaliseHeading, type HeadingPosition, type SectionAnchor } from "./section-anchor";

const ANCHOR_KEY = "sa-design-switch-anchor";
const PREVIOUS_KEY = "sa-design-switch-previous";
/** An anchor older than this belongs to a switch that never finished; ignore it. */
const ANCHOR_TTL_MS = 30_000;

export function readWebsiteDesign(): WebsiteDesign {
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${WEBSITE_DESIGN_COOKIE}=`));
  return parseWebsiteDesign(hit?.split("=")[1]);
}

/** The design the reader was on before the last switch, for the flip-back shortcut. */
export function previousWebsiteDesign(): WebsiteDesign | null {
  const raw = safeSession(() => sessionStorage.getItem(PREVIOUS_KEY));
  return raw ? parseWebsiteDesign(raw) : null;
}

/** Headings a reader would call a section: every visible h1 and h2 outside the demo tools. */
function pageHeadings(): Array<HeadingPosition & { el: Element }> {
  return Array.from(document.querySelectorAll("h1, h2"))
    .filter((el) => !el.closest("[data-sa-demo-tools]"))
    .map((el) => ({ el, rect: el.getBoundingClientRect(), text: el.textContent ?? "" }))
    .filter(({ rect }) => rect.width > 0 && rect.height > 0)
    .map(({ el, rect, text }) => ({ el, text: text.trim(), top: rect.top }));
}

/** Write the cookie and reload, remembering which section was on screen. */
export function switchWebsiteDesign(next: WebsiteDesign): void {
  const current = readWebsiteDesign();
  if (next === current) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const anchor: SectionAnchor = {
    path: window.location.pathname,
    headings: rankHeadings(
      pageHeadings().map(({ text, top }) => ({ text, top })),
      window.innerHeight,
    ),
    fraction: maxScroll > 0 ? window.scrollY / maxScroll : 0,
    at: Date.now(),
  };
  safeSession(() => {
    sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(anchor));
    sessionStorage.setItem(PREVIOUS_KEY, current);
  });
  // The browser would otherwise put back the old PIXEL offset first, and the page would
  // visibly jump twice. The restore below sets it back to auto.
  history.scrollRestoration = "manual";
  // A year, so a reviewer comparing designs is not reset between sessions.
  document.cookie = `${WEBSITE_DESIGN_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  window.location.reload();
}

/**
 * After a switch, scroll the new design to the section that was on screen. Returns a cleanup,
 * or null when no switch was pending — which is how the caller knows to name the new design.
 *
 * Applied at once, then again when the page finishes loading and once more after that,
 * because images and web fonts above the section still move it after hydration. The first
 * scroll, key or touch from the reader ends it: from then on the position is theirs.
 */
/**
 * The anchor this page load was opened with, read out of storage ONCE. Kept here rather than
 * re-read because an effect can run twice for one mount (React's development double-invoke):
 * the first run used to take the anchor out of storage and the second found nothing, so the
 * page stayed at the old pixel offset. `undefined` means not read yet.
 */
let pending: SectionAnchor | null | undefined;

function takeAnchor(): SectionAnchor | null {
  if (pending !== undefined) return pending;
  const raw = safeSession(() => sessionStorage.getItem(ANCHOR_KEY));
  safeSession(() => sessionStorage.removeItem(ANCHOR_KEY));
  pending = null;
  if (!raw) return null;
  try {
    const anchor = JSON.parse(raw) as SectionAnchor;
    if (anchor.path === window.location.pathname && Date.now() - anchor.at <= ANCHOR_TTL_MS) {
      pending = anchor;
    }
  } catch {
    // A malformed anchor is no anchor.
  }
  if (!pending) history.scrollRestoration = "auto";
  return pending;
}

export function restoreSectionAfterSwitch(): (() => void) | null {
  const anchor = takeAnchor();
  if (!anchor) return null;

  const apply = () => {
    const found = new Map<string, number>();
    for (const h of pageHeadings()) {
      const key = normaliseHeading(h.text);
      if (!found.has(key)) found.set(key, h.top + window.scrollY);
    }
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: resolveScroll(anchor, found, window.innerHeight, maxScroll), behavior: "instant" });
  };

  const timers: number[] = [];
  const detach = () => {
    timers.forEach((t) => window.clearTimeout(t));
    window.removeEventListener("load", onLoad);
    for (const type of ["wheel", "touchstart", "keydown", "pointerdown"] as const) {
      window.removeEventListener(type, finish, true);
    }
  };
  // Finished — restored, or the reader took over. Only now is the anchor spent.
  const finish = () => {
    detach();
    pending = null;
    history.scrollRestoration = "auto";
  };
  const onLoad = () => {
    apply();
    timers.push(
      window.setTimeout(() => {
        apply();
        finish();
      }, 400),
    );
  };

  apply();
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"] as const) {
    window.addEventListener(type, finish, { capture: true, passive: true });
  }
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad);
  // A page whose load never fires (a hung embed) still gets released.
  timers.push(window.setTimeout(finish, 4000));
  // Unmounting is not finishing: a remount of the same page picks the anchor up again.
  return detach;
}

/** sessionStorage throws in some private windows; a demo convenience must not. */
function safeSession<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch {
    return null;
  }
}
