/**
 * Resolving the assistant's configuration for rendering.
 *
 * Same shape, and the same reason, as `lib/registry/resolve.ts`: `readSetting`
 * caches for 60s inside a running process, which does nothing for a page Next
 * rendered at build time — that page holds whatever the config said when it was
 * built, forever. So the read is wrapped in `unstable_cache` with a tag, and the
 * admin action calls `updateTag(CHATBOT_TAG)` on save.
 *
 * This one matters more than the registry's, not less. The root layout reads it,
 * and the root layout is above every route in the estate — an uncached read here
 * would make every statically rendered page in the estate dynamic.
 */

import { unstable_cache } from "next/cache";
import type { AppEntry } from "@mosje/design-system/registry";
import { chatbotEnabledPaths, readChatbotConfig, type ChatbotConfig } from "./config.ts";

/** Cache tag the admin save invalidates. */
export const CHATBOT_TAG = "chatbot-config";

const cachedReadConfig = unstable_cache(() => readChatbotConfig(), ["chatbot-config"], {
  tags: [CHATBOT_TAG],
  /*
   * A ceiling, not the propagation mechanism — `updateTag` is. It only bounds
   * how stale a page can get when an invalidation never happens, which is what
   * a change made outside the admin page looks like (someone editing the row in
   * Supabase directly). 60s to match the settings store's own TTL, exactly as
   * the registry does.
   */
  revalidate: 60,
});

/** The stored config, cached and tag-invalidated. Null means "code defaults". */
export async function resolveChatbotConfig(): Promise<ChatbotConfig | null> {
  try {
    return await cachedReadConfig();
  } catch (error) {
    // A cache-layer failure must degrade the same way a store failure does.
    console.warn("[chatbot] cached config read failed, using code defaults:", error);
    return null;
  }
}

/** The surface paths the assistant is switched on for — what the layout passes down. */
export async function resolveChatbotPaths(apps: readonly AppEntry[]): Promise<string[]> {
  return chatbotEnabledPaths(apps, await resolveChatbotConfig());
}
