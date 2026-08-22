#!/usr/bin/env node
/**
 * What the design system exports, and which of those exports are components.
 *
 * Shared by every gate that has to answer "what should be documented?" —
 * `check-storybook-coverage.mjs` and `check-design-context.mjs`. It lives here
 * rather than in either of them because the two gates MUST agree: a component
 * that Storybook is allowed to skip but design.md is not (or vice versa) is a
 * gate arguing with itself, and the first symptom is a confusing red build.
 *
 * Keeping one copy is also the point of the exercise. These lists drifting
 * apart in two files is the same class of defect the design-context gate
 * exists to catch — documentation quietly ceasing to describe the code.
 */

import { readFileSync } from "node:fs";

export const BARREL = process.env.DS_BARREL ?? "packages/design-system/index.ts";

/**
 * Exports that are not components and so cannot have a story. Anything not
 * listed here and starting with a capital letter is treated as a component —
 * the default is "needs a story", so a new component cannot slip through by
 * being forgotten.
 */
export const NOT_COMPONENTS = new Set([
  // Constants
  "COLOR_MODES", "COLOR_MODE_ATTR", "COLOR_MODE_COOKIE", "DEFAULT_COLOR_MODE",
  "DEFAULT_APPS", "PORTAL_CATEGORIES", "PAN_HOLDER_TYPES",
  "SLA_DEFAULT_THRESHOLDS", "UX4G_A11Y_WIDGET_SRC",
  // DEMO_ACCOUNTS is a pathname-keyed data registry (packages/design-system/
  // demo/demo-accounts.ts), not a component — same category as DEFAULT_APPS
  // above. It is exercised by DemoAccountsPanel.stories.tsx and DemoDock.stories.tsx.
  "DEMO_ACCOUNTS",
  // Numeric constants of the estate-registry override layer (packages/
  // design-system/components/navigation/registry-overrides.ts): the schema
  // version the settings row must declare, and the byte ceiling a stored
  // config may not exceed. Same category as the constants above — there is
  // nothing to render. The behaviour they govern is covered by
  // registry-overrides.test.ts.
  "REGISTRY_CONFIG_VERSION", "REGISTRY_CONFIG_MAX_BYTES",
  // Types (exported via `export type`, but belt and braces)
  "ColorMode", "ColorModeId", "ColorModeProviderProps", "ColorModeSwitcherProps",
]);

/**
 * Components that cannot have a STORY, but must still be documented.
 *
 * This set is why the exclusions are split rather than shared wholesale. These
 * are real components with real constraints — they simply cannot be rendered in
 * Storybook, which is a fact about Storybook, not about whether an agent needs
 * to know how they behave.
 *
 * Collapsing the two ideas into one list is not hypothetical harm: it is how
 * the design-context gate was first written, and `UX4GAccessibilityWidget` —
 * the exact component whose documentation went missing and prompted the gate —
 * was silently exempt from it. A gate that excuses the thing it was built to
 * catch is worse than no gate, because the green tick is now evidence of
 * nothing. Watched failing on precisely that case before being trusted.
 *
 * So: excluded from `check-storybook-coverage.mjs`, REQUIRED by
 * `check-design-context.mjs`.
 */
export const NOT_RENDERABLE_IN_STORYBOOK = new Set([
  // Renders the official MeitY widget from a CDN — cannot run in Storybook.
  // Its telemetry default, version pin and platform shortcut are all decisions
  // an agent must not change blind, so design.md documenting it is mandatory.
  "UX4GAccessibilityWidget",
  // Context providers and non-visual utilities: nothing to look at. Still
  // load-bearing — ColorModeProvider is how the brand axis is applied at all.
  "ColorModeProvider", "ToastProvider", "LiveRegion",
]);

/**
 * Sub-parts documented by their parent's story rather than their own, e.g.
 * CardHeader is shown inside the Card story. Keyed to the parent so a reviewer
 * can see the claim is real.
 */
export const DOCUMENTED_BY = {
  CardHeader: "Card", CardBody: "Card", CardFooter: "Card",
  CardTitle: "Card", CardSubtitle: "Card",
  TabPanel: "Tabs",
  ReviewSection: "Wizard", ReviewItem: "Wizard",
  SkeletonText: "Skeleton", SkeletonRow: "Skeleton",
  ChartTooltip: "Legend",
  AccordionItem: "Accordion", VerticalTimelineItem: "VerticalTimeline",
};

/**
 * PascalCase names re-exported from the design-system barrel, minus the
 * exports that are not components and the sub-parts documented by a parent.
 *
 * The default is "this needs documenting": anything capitalised that is not
 * explicitly excluded counts, so a new component cannot slip past a gate by
 * being forgotten.
 *
 * `includeNonRenderable` is what keeps the two gates honest about their
 * DIFFERENT questions. Storybook asks "can this be shown?" and passes `false`;
 * design.md asks "must this be explained?" and passes `true`. Everything in
 * `NOT_COMPONENTS` is excluded either way, because it is not a component at all.
 */
export function exportedComponents({
  barrel = BARREL,
  includeNonRenderable = false,
} = {}) {
  const src = readFileSync(barrel, "utf8");
  const names = new Set();
  for (const match of src.matchAll(/^export \{([^}]*)\} from/gms)) {
    for (let name of match[1].split(",")) {
      name = name.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop().trim();
      if (!name || !/^[A-Z]/.test(name)) continue;
      if (NOT_COMPONENTS.has(name)) continue;
      if (!includeNonRenderable && NOT_RENDERABLE_IN_STORYBOOK.has(name)) continue;
      if (name in DOCUMENTED_BY) continue;
      names.add(name);
    }
  }
  return names;
}
