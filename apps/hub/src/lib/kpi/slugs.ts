import type { PortalId } from "./types.ts";

/**
 * The portal dashboards' URL segments, on their own so a module that only needs the
 * addresses — the demo rail's data-mode routes, loaded on every page — does not pull in
 * the whole register. `model.test.ts` pins it to the register.
 */
export const PORTAL_SLUGS: readonly PortalId[] = ["smile-beggary", "nmba", "e-utthaan", "shreshta"];
