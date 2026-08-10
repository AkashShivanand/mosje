/**
 * Estate registry overrides — the runtime layer over `DEFAULT_APPS`.
 *
 * `DEFAULT_APPS` is the seed and stays the only place entries are born. This
 * module applies a sparse patch on top of it, so the hub can change what the
 * estate advertises without a redeploy.
 *
 * Three properties the rest of the system leans on:
 *
 *  - **Pure.** No React, no CSS, no I/O. That is deliberate: the hub's proxy
 *    (middleware) imports this to decide whether a path is blocked, and a
 *    middleware bundle cannot pull in the component barrel. Import it from
 *    `@mosje/design-system/registry`, never from the package root.
 *  - **Total.** Every failure mode — null config, malformed JSON, unknown
 *    paths, bad statuses — resolves to "use the code defaults" rather than
 *    throwing. A settings row must never be able to 500 the estate.
 *  - **Sparse.** A path absent from `entries` renders exactly as code defines
 *    it, so a portal added to `DEFAULT_APPS` in a later commit needs no store
 *    edit to appear.
 */

import {
  DEFAULT_APPS,
  PORTAL_CATEGORIES,
  type AppEntry,
  // Explicit extension: this module is exercised by `node --test`, which does
  // not do extensionless ESM resolution the way the bundler does.
} from "./app-switcher-utils.ts";

// Re-exported so `@mosje/design-system/registry` is a single, component-free
// entry point that middleware can import without dragging in React.
export { DEFAULT_APPS, PORTAL_CATEGORIES };
export type { AppEntry };

/**
 * "live" and "planned" keep the meaning they already have in `AppEntry`.
 * "hidden" is the addition: the entry is dropped from every surface and its
 * path is blocked at the edge.
 */
export type RegistryStatus = "live" | "planned" | "hidden";

const STATUSES: readonly RegistryStatus[] = ["live", "planned", "hidden"];

/** The fields an admin may override. `path`, `group` and `newTab` are code-only. */
export interface RegistryOverride {
  status?: RegistryStatus;
  /** Dense sort key within the entry's bucket, ascending. */
  order?: number;
  name?: string;
  desc?: string;
  org?: string;
  abbr?: string;
  category?: string;
}

export interface RegistryConfig {
  version: 1;
  /** Keyed by `AppEntry.path` — the registry's stable id. */
  entries: Record<string, RegistryOverride>;
}

export const REGISTRY_CONFIG_VERSION = 1;

/**
 * Hard ceiling on the stored value. 23 entries of short strings is a few KB;
 * anything approaching this is a corrupt or hostile write, and parsing it on
 * the request hot path is not worth the risk.
 */
export const REGISTRY_CONFIG_MAX_BYTES = 32 * 1024;

/** The only string fields an override may carry. */
const LABEL_FIELDS = ["name", "desc", "org", "abbr", "category"] as const;

/** Longest a single override label may be — guards the UI and the store alike. */
const MAX_LABEL_LENGTH = 200;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function byteLength(value: string): number {
  return typeof TextEncoder === "function"
    ? new TextEncoder().encode(value).length
    : value.length;
}

/**
 * Validate one entry's override. Returns null when anything about it is wrong,
 * which the caller escalates to rejecting the whole config: a half-applied
 * patch is harder to reason about than no patch at all.
 */
function parseOverride(raw: unknown): RegistryOverride | null {
  if (!isPlainObject(raw)) return null;

  const parsed: RegistryOverride = {};

  if (raw.status !== undefined) {
    if (typeof raw.status !== "string") return null;
    if (!STATUSES.includes(raw.status as RegistryStatus)) return null;
    parsed.status = raw.status as RegistryStatus;
  }

  if (raw.order !== undefined) {
    if (typeof raw.order !== "number") return null;
    if (!Number.isInteger(raw.order) || raw.order < 0) return null;
    parsed.order = raw.order;
  }

  for (const field of LABEL_FIELDS) {
    const value = raw[field];
    if (value === undefined) continue;
    if (typeof value !== "string") return null;
    if (value.length > MAX_LABEL_LENGTH) return null;
    // A blank override means "no override" — the admin UI clears a field by
    // submitting an empty string, and that must restore the code value rather
    // than blanking the label everywhere.
    const trimmed = value.trim();
    if (trimmed) parsed[field] = trimmed;
  }

  return parsed;
}

/**
 * Parse a stored registry config.
 *
 * Accepts the raw string from the settings store (or an already-parsed object,
 * which is what the admin action validates before writing). Returns null for
 * every failure — absent, oversized, malformed, wrong version, bad field — and
 * logs one warning so a bad row is diagnosable without being fatal.
 */
export function parseRegistryConfig(raw: unknown): RegistryConfig | null {
  if (raw === null || raw === undefined) return null;

  let value: unknown = raw;

  if (typeof raw === "string") {
    if (!raw.trim()) return null;
    if (byteLength(raw) > REGISTRY_CONFIG_MAX_BYTES) {
      console.warn(
        `[registry] stored config rejected: ${byteLength(raw)} bytes exceeds the ${REGISTRY_CONFIG_MAX_BYTES}-byte ceiling`,
      );
      return null;
    }
    try {
      value = JSON.parse(raw);
    } catch {
      console.warn("[registry] stored config rejected: not valid JSON");
      return null;
    }
  }

  if (!isPlainObject(value)) {
    console.warn("[registry] stored config rejected: not an object");
    return null;
  }

  if (value.version !== REGISTRY_CONFIG_VERSION) {
    console.warn(
      `[registry] stored config rejected: unsupported version ${String(value.version)}`,
    );
    return null;
  }

  if (!isPlainObject(value.entries)) {
    console.warn("[registry] stored config rejected: entries is not an object");
    return null;
  }

  const entries: Record<string, RegistryOverride> = {};
  for (const [path, rawOverride] of Object.entries(value.entries)) {
    const override = parseOverride(rawOverride);
    if (!override) {
      console.warn(`[registry] stored config rejected: bad override for ${path}`);
      return null;
    }
    entries[path] = override;
  }

  return { version: REGISTRY_CONFIG_VERSION, entries };
}

/** Serialise a config for the settings store. */
export function serializeRegistryConfig(config: RegistryConfig): string {
  return JSON.stringify(config);
}

/** An empty, valid config — what "no overrides" looks like on the wire. */
export function emptyRegistryConfig(): RegistryConfig {
  return { version: REGISTRY_CONFIG_VERSION, entries: {} };
}

/**
 * The bucket an entry is ordered within: its category when it has one,
 * otherwise its group. Ordering is total inside a bucket and never crosses
 * one, so the Website block, each portal category and Resources keep their
 * relative positions no matter what an admin does.
 */
export function bucketKey(entry: AppEntry): string {
  return `${entry.group}\u0000${entry.category ?? ""}`;
}

/** The effective status of an entry once overrides are applied. */
export function effectiveStatus(
  entry: AppEntry,
  config: RegistryConfig | null,
): RegistryStatus {
  const override = config?.entries[entry.path];
  return override?.status ?? entry.status ?? "live";
}

/**
 * Warn once per distinct set of unknown paths. Without the guard a stale
 * override on a hot path would log on every render.
 */
let lastUnknownWarning = "";

function warnUnknownPaths(base: AppEntry[], config: RegistryConfig): void {
  const known = new Set(base.map((entry) => entry.path));
  const unknown = Object.keys(config.entries).filter((path) => !known.has(path));
  if (unknown.length === 0) return;

  const signature = unknown.sort().join(",");
  if (signature === lastUnknownWarning) return;
  lastUnknownWarning = signature;
  console.warn(
    `[registry] ignoring override(s) for path(s) not in DEFAULT_APPS: ${signature}`,
  );
}

/** Test seam — resets the once-per-signature warning guard. */
export function resetRegistryWarnings(): void {
  lastUnknownWarning = "";
}

function applyLabels(entry: AppEntry, override: RegistryOverride): AppEntry {
  const merged: AppEntry = { ...entry };
  for (const field of LABEL_FIELDS) {
    const value = override[field];
    if (value) merged[field] = value;
  }
  return merged;
}

/**
 * Merge a stored config over the code registry.
 *
 * Hidden entries are removed, label overrides applied, and each bucket sorted
 * by its effective order. Buckets themselves stay in the order they first
 * appear in `base`, so the overall shape of the registry is code-owned.
 *
 * A null config returns a copy of `base` — a copy, not the array itself, so a
 * caller sorting the result cannot reorder `DEFAULT_APPS` in place.
 */
export interface ApplyOptions {
  /**
   * Keep hidden entries in the result. Only the admin editor wants this — it
   * has to list what is hidden in order to offer unhiding it. Every rendering
   * surface leaves it off.
   */
  includeHidden?: boolean;
}

export function applyRegistryOverrides(
  base: AppEntry[],
  config: RegistryConfig | null,
  options: ApplyOptions = {},
): AppEntry[] {
  if (!config) return [...base];

  warnUnknownPaths(base, config);

  // Bucket sequence comes from the CODE registry, before any override is
  // applied. Deriving it from the merged entries instead would let a single
  // `category` override hoist that whole category to the front of the page.
  const bucketOrder: string[] = [];
  for (const entry of base) {
    const key = bucketKey(entry);
    if (!bucketOrder.includes(key)) bucketOrder.push(key);
  }

  interface Placed {
    entry: AppEntry;
    order: number;
    /** Explicit orders beat positional ones on a tie. */
    explicit: boolean;
  }
  const buckets = new Map<string, Placed[]>();

  base.forEach((entry) => {
    if (!options.includeHidden && effectiveStatus(entry, config) === "hidden") {
      return;
    }

    const override = config.entries[entry.path];
    const merged = override ? applyLabels(entry, override) : { ...entry };
    // "hidden" never reaches here — those entries returned above — so the
    // narrowing is only to satisfy AppEntry's two-state `status`.
    if (override?.status && override.status !== "hidden") {
      merged.status = override.status;
    }

    // The bucket an entry lands IN is computed from the merged entry, because
    // `category` is overridable: moving an entry to another category must move
    // it in the grouping, not only in its label. An override naming a category
    // that does not exist in code appends a new bucket at the end.
    const key = bucketKey(merged);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = [];
      buckets.set(key, bucket);
      if (!bucketOrder.includes(key)) bucketOrder.push(key);
    }
    bucket.push({
      entry: merged,
      // Without an explicit order, an entry keeps its position among the
      // entries already placed in this bucket — i.e. code order.
      order: override?.order ?? bucket.length,
      explicit: override?.order !== undefined,
    });
  });

  const result: AppEntry[] = [];
  for (const key of bucketOrder) {
    const bucket = buckets.get(key);
    if (!bucket) continue;
    // Array.prototype.sort is stable, so entries that tie on both keys keep
    // code order.
    bucket.sort(
      (a, b) => a.order - b.order || Number(b.explicit) - Number(a.explicit),
    );
    for (const { entry } of bucket) result.push(entry);
  }
  return result;
}

/**
 * The entries an admin has hidden — what the proxy blocks.
 *
 * Returned from `base` rather than from the merged list, because the merged
 * list has already dropped them.
 */
export function hiddenEntries(
  base: AppEntry[],
  config: RegistryConfig | null,
): AppEntry[] {
  if (!config) return [];
  return base.filter((entry) => effectiveStatus(entry, config) === "hidden");
}

/**
 * Longest-prefix match of a request path against a set of hidden entries.
 * Returns the matching entry, or null when the path is not blocked.
 *
 * Longest-prefix rather than first-match: if both `/portals` and
 * `/portals/nmba` were ever hidden, the more specific one is the honest answer
 * to "why is this blocked".
 */
export function matchHiddenEntry(
  hidden: AppEntry[],
  pathname: string,
): AppEntry | null {
  let best: AppEntry | null = null;
  let bestLength = -1;

  for (const entry of hidden) {
    // Normalise the trailing slash so "/storybook/" blocks "/storybook" too.
    const normalised = entry.path.replace(/\/+$/, "");
    if (!normalised) continue;
    const matches =
      pathname === normalised || pathname.startsWith(normalised + "/");
    if (matches && normalised.length > bestLength) {
      best = entry;
      bestLength = normalised.length;
    }
  }
  return best;
}

/** One row as the admin editor submits it: the intent, not the patch. */
export interface RegistryRowInput {
  path: string;
  status: RegistryStatus;
  name?: string;
  desc?: string;
  org?: string;
  abbr?: string;
  category?: string;
}

/**
 * Derive the smallest patch that reproduces the submitted rows.
 *
 * The editor sends what it is showing — every row, in display order, with
 * whatever the admin typed. This turns that into a sparse override, which
 * matters for one reason beyond tidiness: anything NOT written stays governed
 * by code, so a later commit that renames a portal or reorders a category
 * still takes effect. Writing every field unconditionally would silently pin
 * the registry to whatever it looked like the day someone last pressed Save.
 *
 * Rows whose path is not in `base` are dropped — the editor cannot invent
 * entries, and a stale form must not resurrect a deleted one.
 */
export function buildRegistryConfig(
  base: AppEntry[],
  rows: RegistryRowInput[],
): RegistryConfig {
  const byPath = new Map(base.map((entry) => [entry.path, entry]));
  const known = rows.filter((row) => byPath.has(row.path));

  const entries: Record<string, RegistryOverride> = {};

  for (const row of known) {
    const code = byPath.get(row.path)!;
    const override: RegistryOverride = {};

    if (row.status !== (code.status ?? "live")) override.status = row.status;

    for (const field of LABEL_FIELDS) {
      const value = row[field]?.trim();
      // Only a value that differs from code is an override. A field left at
      // the code value writes nothing, so editing the code later still wins.
      if (value && value !== code[field]) override[field] = value;
    }

    entries[row.path] = override;
  }

  // The bucket a row belongs to, honouring a category override.
  const rowBucket = (row: RegistryRowInput): string => {
    const code = byPath.get(row.path)!;
    const category = entries[row.path]?.category ?? code.category;
    return `${code.group} ${category ?? ""}`;
  };

  const submittedBuckets = new Map<string, string[]>();
  for (const row of known) {
    const key = rowBucket(row);
    const bucket = submittedBuckets.get(key) ?? [];
    bucket.push(row.path);
    submittedBuckets.set(key, bucket);
  }

  for (const [key, submitted] of submittedBuckets) {
    // The same bucket's membership in code order. Comparing against this — and
    // not against a stored order — means moving an entry back to where code
    // puts it REMOVES the override rather than pinning it there.
    const codeOrder = known
      .filter((row) => rowBucket(row) === key)
      .map((row) => ({ path: row.path, index: base.indexOf(byPath.get(row.path)!) }))
      .sort((a, b) => a.index - b.index)
      .map((r) => r.path);

    const unchanged =
      submitted.length === codeOrder.length &&
      submitted.every((path, i) => path === codeOrder[i]);
    if (unchanged) continue;

    submitted.forEach((path, index) => {
      entries[path] = { ...entries[path], order: index };
    });
  }

  // Drop the rows that ended up overriding nothing, so an untouched registry
  // serialises to `{}` rather than to 23 empty objects.
  for (const [path, override] of Object.entries(entries)) {
    if (Object.keys(override).length === 0) delete entries[path];
  }

  return { version: REGISTRY_CONFIG_VERSION, entries };
}

/**
 * Rewrite a bucket's `order` so it is dense (0..n-1) and matches the given
 * path sequence. The admin editor calls this after every move, so ordering
 * never depends on a mix of stored and code positions.
 */
export function withDenseOrder(
  config: RegistryConfig,
  orderedPaths: string[],
): RegistryConfig {
  const entries: Record<string, RegistryOverride> = { ...config.entries };
  orderedPaths.forEach((path, index) => {
    entries[path] = { ...entries[path], order: index };
  });
  return { version: REGISTRY_CONFIG_VERSION, entries };
}
