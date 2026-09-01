"use client";

import * as React from "react";
import type { VillageName } from "./pmajay-map-reduce";

/**
 * The village-name index, fetched the first time somebody searches for one.
 *
 * ── WHY IT IS FETCHED AND NOT IMPORTED ──────────────────────────────────────
 *
 * 10,157 named villages weigh 83 KB gzipped. Imported into the page they took
 * PM-AJAY's mirrored data from 21 KB to 106 KB on every visit, for a lookup
 * most readers never run. As a public asset the page pays nothing until the
 * reader types, which is the only honest way to carry ten thousand rows onto a
 * government page.
 *
 * ── WHAT IT IS FOR ──────────────────────────────────────────────────────────
 *
 * One question, asked by one kind of reader: *is my village in this scheme?*
 * The coverage map answers "where is the scheme thickest"; nothing on the page
 * answered the citizen's own version of it until this existed.
 *
 * ── WHAT IT CANNOT ANSWER, AND SAYS SO ──────────────────────────────────────
 *
 * `village_name` is published for 10,157 of 19,768 records. Twenty-two states
 * name essentially every village; **West Bengal and Bihar name none at all** —
 * zero of 5,792 and zero of 2,853 — and those two are 44% of the programme.
 * `statesWithoutNames` carries that list so a fruitless search can say which
 * states the MIS does not name, rather than leaving a reader from Bankura to
 * conclude their village is not covered.
 */

/** Packed `[name, state, district]`, as the generated asset stores them. */
type PackedVillage = [string, string, string];

export interface VillagesAsset {
  asOn: string;
  villages: PackedVillage[];
}

/*
 * Module-scoped, so the second search on the page does not refetch and a
 * remount does not either. A failed attempt is NOT cached — an error here is
 * usually a dropped connection, and a reader who tries again deserves a real
 * second attempt rather than the memory of the first failure.
 */
let cache: VillageName[] | null = null;
let inflight: Promise<VillageName[]> | null = null;

/**
 * Where the index is fetched from.
 *
 * A default, not a constant, because there are two consumers with two roots.
 * The hub serves it from its own public folder; the standalone bundle is
 * dropped onto somebody else's server and must never reach back to a MoSJE
 * origin, so it points this at a file sitting beside itself.
 */
let assetUrl = "/website/data/pmajay-villages.json";

/**
 * Point the index somewhere else. Call before the first search.
 *
 * Ignored once the index has loaded — re-pointing a cache mid-session would
 * mean two answers to the same query depending on when it was asked.
 */
export function setVillageIndexSource(url: string): void {
  if (!cache) assetUrl = url;
}

/**
 * Every state of the fetch, because every one of them reaches the screen.
 *
 * `idle` is not "no data" — it is "not asked yet", and rendering the two the
 * same way is what makes a search box look broken before it has been used.
 */
export type VillageIndexStatus = "idle" | "loading" | "ready" | "error";

export interface VillageIndex {
  status: VillageIndexStatus;
  villages: VillageName[];
  /** Retry after an error. No-op in any other state. */
  retry: () => void;
}

/** Packed rows → the shape the UI reads. Shared by both entry points. */
function unpack(body: VillagesAsset | null): VillageName[] {
  const rows = Array.isArray(body?.villages) ? body.villages : [];
  return rows
    .filter(
      (v): v is PackedVillage =>
        Array.isArray(v) && typeof v[0] === "string" && typeof v[1] === "string",
    )
    .map(([name, state, district]) => ({ name, state, district: district ?? "" }));
}

/**
 * Fill the index from data already on the page, instead of fetching it.
 *
 * ── WHY A SECOND ENTRY POINT EXISTS ────────────────────────────────────────
 *
 * The single-file embed is ONE block of markup pasted into a page builder, so
 * there is no sibling file to fetch and no upload step to get one there. The
 * index travels inside the paste and arrives before the first search.
 *
 * The tradeoff is stated where it is chosen, not hidden here: inlined, every
 * reader downloads the index whether or not they search, which is exactly what
 * `load()` exists to avoid. That is the price of one paste, and the two-file
 * install remains the one to reach for when page weight matters.
 *
 * Ignored once the index is loaded — two answers to the same query depending on
 * when it was asked is worse than a stale one.
 */
export function primeVillageIndex(body: VillagesAsset | null): void {
  if (cache) return;
  const rows = unpack(body);
  // An empty parse is a BROKEN paste, not an empty register, and caching it
  // would turn a fixable error into a permanent "no matches" for the session.
  if (rows.length) cache = rows;
}

function load(signal: AbortSignal): Promise<VillageName[]> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch(assetUrl, { signal })
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status}`);
      return r.json() as Promise<VillagesAsset>;
    })
    .then((body) => {
      cache = unpack(body);
      return cache;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/**
 * Fetch the index once `enabled` turns true, and report every state on the way.
 *
 * The caller decides when to enable it — PM-AJAY waits for two characters, so
 * a reader who clicks the field and changes their mind downloads nothing.
 */
export function useVillageIndex(enabled: boolean): VillageIndex {
  const [state, setState] = React.useState<{
    status: VillageIndexStatus;
    villages: VillageName[];
  }>({ status: "idle", villages: [] });
  const [attempt, setAttempt] = React.useState(0);
  const retry = React.useCallback(() => setAttempt((n) => n + 1), []);

  React.useEffect(() => {
    // A cache filled by an earlier search needs no effect at all — it is read
    // on the render path below. Returning here also keeps this effect free of
    // a synchronous `setState`, which cascades a second render for nothing.
    if (!enabled || cache) return;

    const ac = new AbortController();
    let alive = true;
    const settle = (next: { status: VillageIndexStatus; villages: VillageName[] }) => {
      if (alive && !ac.signal.aborted) setState(next);
    };

    Promise.resolve()
      .then(() => settle({ status: "loading", villages: [] }))
      .then(() => load(ac.signal))
      .then((rows) => settle({ status: "ready", villages: rows }))
      .catch((err: unknown) => {
        // An abort is the component leaving, not a failure the reader caused.
        if ((err as { name?: string })?.name === "AbortError") return;
        settle({ status: "error", villages: [] });
      });

    return () => {
      alive = false;
      ac.abort();
    };
  }, [enabled, attempt]);

  // The cache wins over local state, so a second search on the same page is
  // answered without a flash of `loading` for data already in memory.
  if (cache) return { status: "ready", villages: cache, retry };
  return { status: state.status, villages: state.villages, retry };
}

/**
 * Villages whose name contains `query`, best matches first.
 *
 * A prefix match outranks a match in the middle, because someone typing
 * "kall" wants Kalluru before Thakkallu. Capped at 40: past that the answer to
 * "is my village here" is "narrow the search", and forty rows is already six
 * pages of the rail.
 */
export function matchVillages(villages: VillageName[], query: string): VillageName[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: { v: VillageName; rank: number }[] = [];
  for (const v of villages) {
    const at = v.name.toLowerCase().indexOf(q);
    if (at === -1) continue;
    hits.push({ v, rank: at === 0 ? 0 : 1 });
    if (hits.length > 400) break;
  }
  return hits
    .sort((a, b) => a.rank - b.rank || a.v.name.localeCompare(b.v.name))
    .slice(0, 40)
    .map((h) => h.v);
}
