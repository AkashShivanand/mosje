/**
 * Resolving demo-tool visibility for rendering.
 *
 * Same shape, and the same reason, as `lib/chatbot/resolve.ts`: `readSetting`
 * caches for 60s inside a running process, which does nothing for a page Next
 * rendered at build time. So the read is wrapped in `unstable_cache` with a
 * tag, and the admin action calls `updateTag(DEMO_TOOLS_TAG)` on save.
 *
 * This one is read by the ROOT LAYOUT, which sits above every route in the
 * estate — an uncached read here would make all of them dynamic.
 */

import { unstable_cache } from "next/cache";
import {
  demoToolsEnabled,
  readDemoToolsConfig,
  type DemoToolsConfig,
} from "./config.ts";

/** Cache tag the admin save invalidates. */
export const DEMO_TOOLS_TAG = "demo-tools-config";

const cachedReadConfig = unstable_cache(() => readDemoToolsConfig(), ["demo-tools-config"], {
  tags: [DEMO_TOOLS_TAG],
  // A ceiling, not the propagation mechanism — `updateTag` is. 60s to match
  // the settings store's own TTL, exactly as the registry and chatbot do.
  revalidate: 60,
});

/** The stored config, cached and tag-invalidated. Null means "code default". */
export async function resolveDemoToolsConfig(): Promise<DemoToolsConfig | null> {
  try {
    return await cachedReadConfig();
  } catch (error) {
    console.warn("[demo-tools] cached config read failed, using code default:", error);
    return null;
  }
}

/**
 * Whether the dock should render at all — what the layout passes down.
 *
 * The build-time flag is read HERE rather than in the client component,
 * because `process.env.NEXT_PUBLIC_*` is inlined at build time and a single
 * resolution point is easier to reason about than two.
 */
export async function resolveDemoToolsEnabled(): Promise<boolean> {
  return demoToolsEnabled(
    await resolveDemoToolsConfig(),
    process.env.NEXT_PUBLIC_DEMO_TOOLS,
  );
}
