"use client";

import * as React from "react";
import {
  isPlottable,
  normaliseGeo,
  type DeAddictionCentre,
} from "@/content/website/deaddiction-centres";

/**
 * The de-addiction centre register, fetched the first time a reader reaches the
 * locator.
 *
 * ── WHY IT IS FETCHED AND NOT IMPORTED ──────────────────────────────────────
 *
 * 487 centres weigh 27.5 KB gzipped (106 KB raw). Imported into the page they
 * sat in the CLIENT bundle of every surface that renders the locator — the home
 * page above all, where the section is several screens down and most readers
 * never reach it. As a public asset the page pays nothing until the reader
 * scrolls to the locator, which is the only honest way to carry a national
 * register onto a home page.
 *
 * The measurement, before the split: the rows were 114,392 of the constants
 * module's 118,639 bytes, and that module gzipped at 29,804. Without them it
 * gzips at 2,434.
 *
 * ── WHY THE GATE IS THE VIEWPORT AND NOT A KEYSTROKE ────────────────────────
 *
 * PM-AJAY's village index waits for the second character typed, because nothing
 * renders until somebody searches. This locator is different: the list and the
 * map ARE the section's content, so there is no keystroke to wait for. The
 * honest equivalent is arrival — `useNearViewport` fires when the section comes
 * within a screen of the fold. On `/website/de-addiction-centres`, where the
 * locator is the page, that is true on first paint and the fetch starts at once;
 * on the home page a reader who stops at the schemes section downloads nothing.
 * One mechanism, correct on both surfaces.
 *
 * ── WHAT IT CANNOT ANSWER, AND WHERE THAT IS SAID ───────────────────────────
 *
 * 487 of the 768 centres published nationally carry usable coordinates, and 8
 * of those 487 are published at a point outside India. Those 8 keep their place
 * in the LIST — they are real centres with real addresses — and are not drawn.
 * `normaliseGeo` and `isPlottable` own that, and they are applied here at unpack
 * time so no caller can forget them.
 */

/** The committed asset's shape. `asOn` is the day the feed was last mirrored. */
export interface CentresAsset {
  asOn: string;
  source: string;
  centres: DeAddictionCentre[];
}

/**
 * Module-scoped, so a second locator on the page does not refetch and a remount
 * does not either. A failed attempt is NOT cached — an error here is usually a
 * dropped connection, and a reader who presses "Try again" deserves a real
 * second attempt rather than the memory of the first failure.
 */
let cache: DeAddictionCentre[] | null = null;
let inflight: Promise<DeAddictionCentre[]> | null = null;

const ASSET_URL = "/website/data/deaddiction-centres.json";

/**
 * Every state of the fetch, because every one of them reaches the screen.
 *
 * `idle` is not "no centres" — it is "not asked yet", and rendering the two the
 * same way is what makes a locator look broken before it has been scrolled to.
 */
export type CentresStatus = "idle" | "loading" | "ready" | "error";

export interface CentresIndex {
  status: CentresStatus;
  centres: DeAddictionCentre[];
  /** Retry after an error. No-op in any other state. */
  retry: () => void;
}

/** Rows → the shape the UI reads, geo-corrected once, here. */
function unpack(body: CentresAsset | null): DeAddictionCentre[] {
  const rows = Array.isArray(body?.centres) ? body.centres : [];
  return rows
    .filter(
      (c): c is DeAddictionCentre =>
        !!c && typeof c.name === "string" && typeof c.state === "string",
    )
    .map(normaliseGeo);
}

function load(signal: AbortSignal): Promise<DeAddictionCentre[]> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch(ASSET_URL, { signal })
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status}`);
      return r.json() as Promise<CentresAsset>;
    })
    .then((body) => {
      const rows = unpack(body);
      // An empty parse is a BROKEN asset, not an empty register, and caching it
      // would turn a fixable error into a permanent "no centres" for the
      // session. Let it fall through to the error state, which offers a retry.
      if (!rows.length) throw new Error("empty");
      cache = rows;
      return cache;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/**
 * Fetch the register once `enabled` turns true, and report every state on the
 * way. The caller decides when to enable it — see `useNearViewport`.
 */
export function useCentres(enabled: boolean): CentresIndex {
  const [state, setState] = React.useState<{
    status: CentresStatus;
    centres: DeAddictionCentre[];
  }>({ status: "idle", centres: [] });
  const [attempt, setAttempt] = React.useState(0);
  const retry = React.useCallback(() => setAttempt((n) => n + 1), []);

  React.useEffect(() => {
    // A cache filled by an earlier visit to the section needs no effect at all —
    // it is read on the render path below. Returning here also keeps this effect
    // free of a synchronous `setState`, which cascades a render for nothing.
    if (!enabled || cache) return;

    const ac = new AbortController();
    let alive = true;
    const settle = (next: { status: CentresStatus; centres: DeAddictionCentre[] }) => {
      if (alive && !ac.signal.aborted) setState(next);
    };

    Promise.resolve()
      .then(() => settle({ status: "loading", centres: [] }))
      .then(() => load(ac.signal))
      .then((rows) => settle({ status: "ready", centres: rows }))
      .catch((err: unknown) => {
        // An abort is the reader scrolling away, not a failure they caused.
        if ((err as { name?: string })?.name === "AbortError") return;
        settle({ status: "error", centres: [] });
      });

    return () => {
      alive = false;
      ac.abort();
    };
  }, [enabled, attempt]);

  // The cache wins over local state, so a second locator on the same page is
  // answered without a flash of `loading` for data already in memory.
  if (cache) return { status: "ready", centres: cache, retry };
  return { status: state.status, centres: state.centres, retry };
}

/**
 * True once `ref`'s element is within a screen of the viewport, and true for
 * good after that.
 *
 * ONE-WAY ON PURPOSE. A gate that flipped back off when the reader scrolled past
 * would abort the fetch it just started, and the register is cached anyway —
 * "have they reached it" is a question that is only ever answered once.
 *
 * ── TWO MECHANISMS, AND THE FIRST ONE IS NOT REDUNDANT ─────────────────────
 *
 * A MEASUREMENT on mount, then an OBSERVER for the scroll. The measurement is
 * there because **browsers suspend IntersectionObserver callbacks while the
 * document is hidden**, which is correct of them and wrong for us: on
 * /website/de-addiction-centres the locator IS the page, so a tab opened in the
 * background — a middle-click, a restored session, an in-app webview, a
 * screenshotter — would sit in its loading skeleton with no fetch ever started.
 * That was not a hypothesis: it reproduced on the first attempt at this gate,
 * which used the observer alone and never fired until the tab was looked at.
 *
 * `getBoundingClientRect` is not throttled, so the measurement answers for the
 * surface where the locator is already on screen, and the observer answers for
 * the home page, where the reader has to travel to it — and by the time they
 * scroll, the document is visible by definition.
 *
 * The margin is one viewport height in both, so the fetch starts while the
 * section is still a screen away and the rows are usually there before the
 * reader arrives. With no `IntersectionObserver` at all (an old browser, a test
 * environment) the measurement still runs and the gate degrades to "load when
 * mounted": loading too eagerly is a smaller failure than never loading.
 */
export function useNearViewport(ref: React.RefObject<Element | null>): boolean {
  const [near, setNear] = React.useState(false);

  React.useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;

    let alive = true;
    /* Deferred to a microtask, never set inline: a synchronous setState in an
       effect body cascades a second render, and the estate's lint rule rejects
       it. Lazy initial state is not the alternative — the server has no layout
       to measure, so deciding at mount would hydrate to a different value than
       it rendered. */
    const arrive = () => {
      if (alive) setNear(true);
    };

    /**
     * Within a screen of the viewport — or unmeasurable, which counts as yes.
     *
     * A zero-height viewport is not "the locator is far away", it is "there is
     * no layout to ask". A hidden tab reports `innerHeight: 0`, and so do some
     * webviews, print contexts and headless renderers; treating that as "not
     * near" is how the gate can decide never to load at all. Verified, not
     * assumed: with the pane hidden this measured `innerHeight: 0` against a
     * skeleton at `top: 1789`, and the register never arrived.
     */
    const withinAScreen = () => {
      const h = window.innerHeight || 0;
      if (h === 0) return true;
      const r = el.getBoundingClientRect();
      return r.top < h * 2 && r.bottom > -h;
    };

    if (withinAScreen()) {
      Promise.resolve().then(arrive);
      return () => {
        alive = false;
      };
    }

    if (typeof IntersectionObserver === "undefined") {
      Promise.resolve().then(arrive);
      return () => {
        alive = false;
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          arrive();
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => {
      alive = false;
      io.disconnect();
    };
  }, [ref, near]);

  return near;
}

/** States present in the register, alphabetical. Derived, never hand-listed. */
export function statesOf(centres: DeAddictionCentre[]): string[] {
  return Array.from(new Set(centres.map((c) => c.state))).sort((a, b) => a.localeCompare(b));
}

/** Districts within one state, alphabetical. */
export function districtsOf(centres: DeAddictionCentre[], state: string): string[] {
  return Array.from(
    new Set(centres.filter((c) => c.state === state).map((c) => c.district)),
  ).sort((a, b) => a.localeCompare(b));
}

/** How many of the loaded centres the map can actually draw. */
export function plottableCount(centres: DeAddictionCentre[]): number {
  return centres.filter(isPlottable).length;
}
