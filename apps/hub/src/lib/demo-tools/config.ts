/**
 * Whether the demo dock is shown.
 *
 * WHY THIS IS A SETTING AND NOT A DEPLOY FLAG. The demo tooling used to be
 * governed only by `NEXT_PUBLIC_DEMO_TOOLS`, on the assumption that it was
 * scaffolding you would eventually strip out of a real deployment. That is
 * backwards for this estate: the demo IS the product here, and the dock is how
 * anyone is shown around it. What is actually needed is the ability to hide it
 * for one audience — a ministry walkthrough, a screenshot, a recording — and
 * put it straight back, without a redeploy. That is a setting.
 *
 * The env var survives ABOVE this as a build-time hard off, for a deployment
 * that genuinely must not carry demo tooling at all.
 */

import { SETTING_DEMO_TOOLS, type StoreDeps } from "../settings/store.ts";
import { readToggle, type ToggleConfig } from "../settings/toggle.ts";

export type DemoToolsConfig = ToggleConfig;

/**
 * On, unless something says otherwise.
 *
 * A prototype whose whole purpose is being demonstrated should not need an
 * admin visit before it can be demonstrated.
 */
export const DEMO_TOOLS_DEFAULT_ENABLED = true;

export function readDemoToolsConfig(deps?: StoreDeps): Promise<DemoToolsConfig | null> {
  return readToggle(SETTING_DEMO_TOOLS, deps);
}

/**
 * The final answer, given the stored config and the build-time flag.
 *
 * Pure, so the precedence is testable without a store or a bundler. The env
 * value is passed in rather than read here because `process.env.NEXT_PUBLIC_*`
 * is inlined at build time and cannot be varied by a test.
 */
export function demoToolsEnabled(
  config: DemoToolsConfig | null,
  publicFlag: string | undefined,
): boolean {
  // Build-time hard off wins over everything. A deployment that was built
  // without demo tooling must not be able to acquire it from a database row.
  if (publicFlag === "false") return false;
  // Null covers every read failure, so an unreachable store degrades to
  // VISIBLE. A database outage must not silently strip the thing this
  // prototype exists to show.
  return config?.enabled ?? DEMO_TOOLS_DEFAULT_ENABLED;
}
