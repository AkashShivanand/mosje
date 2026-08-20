/**
 * A stored on/off switch — the shape every "is this widget shown?" setting has.
 *
 * Written when the SECOND one arrived (the demo dock and the cookie banner),
 * not speculatively for the first. What it exists to stop is the two
 * non-obvious rules below being copy-pasted and then diverging:
 *
 *  - `enabled` must be a REAL boolean. A stored string `"false"` is rejected,
 *    never coerced, because `Boolean("false")` is `true` and that coercion is
 *    exactly the bug that makes an admin toggle look like it does nothing.
 *  - An unknown `version` is refused outright rather than half-read. A config
 *    written by a future build must not be interpreted by an older one.
 *
 * The assistant's config is deliberately NOT built on this: it carries a
 * per-surface map as well as a master switch, so it is a different shape and
 * gets its own module rather than a generic one bent to fit.
 *
 * No Next.js import here, so this stays exercisable under the bare Node test
 * runner — the same split as `lib/registry/config.ts`.
 */

import { readSetting, type StoreDeps } from "./store.ts";

export const TOGGLE_CONFIG_VERSION = 1;

/** A flat boolean has no business being large. */
export const TOGGLE_CONFIG_MAX_BYTES = 1024;

export interface ToggleConfig {
  version: number;
  enabled: boolean;
}

export function toggleConfig(enabled: boolean): ToggleConfig {
  return { version: TOGGLE_CONFIG_VERSION, enabled };
}

/** Validate a stored value into a config, or null. Total: never throws. */
export function parseToggle(raw: unknown): ToggleConfig | null {
  if (typeof raw !== "string" || raw.length === 0) return null;
  if (new TextEncoder().encode(raw).length > TOGGLE_CONFIG_MAX_BYTES) return null;

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;

  const record = value as Record<string, unknown>;
  if (record.version !== TOGGLE_CONFIG_VERSION) return null;
  if (typeof record.enabled !== "boolean") return null;

  return toggleConfig(record.enabled);
}

export function serializeToggle(config: ToggleConfig): string {
  return JSON.stringify({ version: TOGGLE_CONFIG_VERSION, enabled: config.enabled });
}

/**
 * Read and validate a stored toggle. Null means "use the caller's default".
 *
 * Every failure — unconfigured store, timeout, HTTP error, malformed JSON,
 * oversized payload — resolves to null, because a settings row must never be
 * able to 500 a page.
 */
export async function readToggle(
  key: string,
  deps?: StoreDeps,
): Promise<ToggleConfig | null> {
  try {
    const raw = deps ? await readSetting(key, deps) : await readSetting(key);
    return parseToggle(raw);
  } catch (error) {
    console.warn(`[settings] toggle "${key}" read failed, using default:`, error);
    return null;
  }
}
