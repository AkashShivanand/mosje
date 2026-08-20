/**
 * Which surfaces show the assistant — the half with no Next.js dependency.
 *
 * Split from `resolve.ts` for the same reason `lib/registry/config.ts` is:
 * resolve.ts imports `next/cache`, which only resolves inside Next, and this
 * half has to be exercisable under the bare Node test runner.
 *
 * The stored value is a SPARSE PATCH over the code defaults below, exactly like
 * the estate registry. That matters for one specific reason: a portal added to
 * `DEFAULT_APPS` next month must arrive with a sensible answer already, not
 * inherit whatever a stale stored blob happened to say about a path that did
 * not exist when it was written.
 *
 * Every function here is total. A missing row, an unconfigured store, a
 * timeout, malformed JSON and an oversized payload all mean the same thing —
 * use the code defaults — because a settings row must never be able to 500 the
 * estate, and least of all over a decorative widget.
 */

import type { AppEntry } from "@mosje/design-system/registry";
import { SETTING_CHATBOT, readSetting, type StoreDeps } from "../settings/store.ts";

export const CHATBOT_CONFIG_VERSION = 1;

/**
 * A ceiling on what may be stored. Far smaller than the registry's 32 kB
 * because this config is a flat map of paths to booleans — anything larger is
 * a bug or an attack, not a configuration.
 */
export const CHATBOT_CONFIG_MAX_BYTES = 8 * 1024;

export interface ChatbotConfig {
  version: number;
  /** Master switch. Off means the assistant renders nowhere, whatever else says. */
  enabled: boolean;
  /** Sparse per-surface overrides, keyed by hub-origin path. */
  surfaces: Record<string, boolean>;
}

/**
 * Surfaces the assistant is on for out of the box.
 *
 * The website only. It is the citizen-facing surface, where someone arrives
 * with a question and no account; the portals are authenticated workflow tools
 * whose users have a caseworker, not a chatbot. An admin can turn any of them
 * on, but the default should be the answer that is right if nobody ever visits
 * the admin page.
 */
export const CHATBOT_DEFAULT_ON: readonly string[] = ["/website"];

/**
 * Paths that are never a chatbot surface, whatever the stored config says.
 *
 * These are not portals a citizen is using — they are the estate's own
 * scaffolding, and an assistant offering to help with them is noise at best.
 * `/admin` in particular: it sits outside the gate as the recovery path, and
 * nothing decorative belongs on it.
 */
export const CHATBOT_EXCLUDED_PATHS: readonly string[] = [
  "/",
  "/gate",
  "/unavailable",
  "/admin",
  "/storybook",
  "/design-system",
  "/reports",
];

/** True when `pathname` is at or under `base`. */
export function pathMatches(pathname: string, base: string): boolean {
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(base + "/");
}

function isExcluded(path: string): boolean {
  return CHATBOT_EXCLUDED_PATHS.some((base) => pathMatches(path, base));
}

export function emptyChatbotConfig(): ChatbotConfig {
  return { version: CHATBOT_CONFIG_VERSION, enabled: true, surfaces: {} };
}

/**
 * Validate a stored value into a config, or null.
 *
 * Deliberately strict about shape and forgiving about content: an unknown
 * surface key is kept (a portal may be temporarily out of the registry and its
 * setting should survive), but a non-boolean value is dropped rather than
 * coerced, because `"false"` coercing to `true` is the exact bug that makes a
 * toggle appear not to work.
 */
export function parseChatbotConfig(raw: unknown): ChatbotConfig | null {
  if (typeof raw !== "string" || raw.length === 0) return null;
  if (new TextEncoder().encode(raw).length > CHATBOT_CONFIG_MAX_BYTES) return null;

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;

  const record = value as Record<string, unknown>;
  if (record.version !== CHATBOT_CONFIG_VERSION) return null;

  const surfaces: Record<string, boolean> = {};
  const rawSurfaces = record.surfaces;
  if (typeof rawSurfaces === "object" && rawSurfaces !== null && !Array.isArray(rawSurfaces)) {
    for (const [path, on] of Object.entries(rawSurfaces as Record<string, unknown>)) {
      if (typeof path !== "string" || !path.startsWith("/")) continue;
      if (typeof on !== "boolean") continue;
      surfaces[path] = on;
    }
  }

  return {
    version: CHATBOT_CONFIG_VERSION,
    // Absent means on: the master switch is an off-ramp, not something an
    // admin should have to set before any of the per-surface toggles work.
    enabled: record.enabled !== false,
    surfaces,
  };
}

export function serializeChatbotConfig(config: ChatbotConfig): string {
  // Keys sorted so an unchanged config serialises identically every time —
  // otherwise every save writes a "different" value and any future diffing
  // (or an eTag) becomes noise.
  const surfaces: Record<string, boolean> = {};
  for (const path of Object.keys(config.surfaces).sort()) {
    surfaces[path] = config.surfaces[path]!;
  }
  return JSON.stringify({
    version: CHATBOT_CONFIG_VERSION,
    enabled: config.enabled,
    surfaces,
  });
}

/** Read and validate the stored config. Null means "use the code defaults". */
export async function readChatbotConfig(deps?: StoreDeps): Promise<ChatbotConfig | null> {
  try {
    const raw = deps
      ? await readSetting(SETTING_CHATBOT, deps)
      : await readSetting(SETTING_CHATBOT);
    return parseChatbotConfig(raw);
  } catch (error) {
    console.warn("[chatbot] config read failed, using code defaults:", error);
    return null;
  }
}

export interface ChatbotSurface {
  /** Hub-origin path — the key the config stores against. */
  path: string;
  name: string;
  /** "Website" or "Portals", straight off the registry entry. */
  group: string;
  /** Whether the assistant shows here once defaults and overrides are applied. */
  enabled: boolean;
  /** True when no stored override applies and this is the code default. */
  isDefault: boolean;
}

/**
 * Every surface an admin may toggle, in registry order.
 *
 * Driven by the registry rather than a second hand-kept list, so a portal added
 * to `DEFAULT_APPS` shows up here automatically. `apps` should be the RESOLVED
 * registry — an entry an admin has hidden from the estate is already gone by
 * then, which is correct: you cannot configure a chatbot onto a portal nobody
 * can reach.
 */
export function chatbotSurfaces(
  apps: readonly AppEntry[],
  config: ChatbotConfig | null,
): ChatbotSurface[] {
  const surfaces: ChatbotSurface[] = [];
  for (const entry of apps) {
    if (entry.group !== "Website" && entry.group !== "Portals") continue;
    if (isExcluded(entry.path)) continue;

    const override = config?.surfaces[entry.path];
    const fallback = CHATBOT_DEFAULT_ON.includes(entry.path);
    surfaces.push({
      path: entry.path,
      name: entry.name,
      group: entry.group,
      enabled: override ?? fallback,
      isDefault: override === undefined,
    });
  }
  return surfaces;
}

/**
 * The paths the assistant is switched on for — the whole payload the client
 * needs.
 *
 * Only the ON surfaces travel, because absence already means off. That keeps
 * this to a handful of short strings in the root layout's payload rather than a
 * map of every portal in the estate, and it makes the client's job a single
 * prefix test with no default-resolution logic to keep in step with this file.
 */
export function chatbotEnabledPaths(
  apps: readonly AppEntry[],
  config: ChatbotConfig | null,
): string[] {
  if (config && !config.enabled) return [];
  return chatbotSurfaces(apps, config)
    .filter((surface) => surface.enabled)
    .map((surface) => surface.path);
}

/**
 * Whether the assistant renders at `pathname`, given the enabled paths.
 *
 * Pure, and shared by the client component and its tests. The exclusion list is
 * re-applied here rather than trusted from upstream: `/admin` must not be able
 * to acquire a chatbot because someone stored `{"/admin": true}` by hand.
 */
export function chatbotEnabledAt(
  pathname: string,
  enabledPaths: readonly string[],
): boolean {
  if (isExcluded(pathname)) return false;
  return enabledPaths.some((base) => pathMatches(pathname, base));
}
