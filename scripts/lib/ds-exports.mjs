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
  // The illustration set's own index — a string array naming every scene, used
  // by the specimen sheet and by anything that needs to enumerate them.
  "SCENE_NAMES",
  // How many categorical chart slots are actually distinguishable — a measured
  // number, not a component. `check:chart-palette` computes it from the token
  // file and fails if this constant and the measurement disagree, so the
  // documentation that matters is the gate, not a page.
  "CHART_CATEGORICAL_SAFE_CAP",
  // Constants
  "COLOR_MODES", "COLOR_MODE_ATTR", "COLOR_MODE_COOKIE", "DEFAULT_COLOR_MODE",
  "DEFAULT_APPS", "PORTAL_CATEGORIES", "PAN_HOLDER_TYPES", "PORTAL_LABELS",
  // The mark registry. Data and pure resolvers — the paths of every organisation
  // mark, the estate's own marks, and the route -> slug map. The COMPONENT that
  // renders them (OrgLogo) has its own story, and `Catalogue` in it renders every
  // entry of ORG_LOGOS, so the data is on screen even though the constant is not
  // a component. `check:org-logos` is what actually guards this registry.
  "ORG_LOGOS", "ORG_LOGO_FALLBACK", "PORTAL_ORG_LOGOS",
  "SAMAVESH_MARK", "SAMAVESH_MARK_VECTOR", "NATIONAL_EMBLEM", "NATIONAL_EMBLEM_INVERSE",
  "orgLogoSrc", "portalLogoSrc", "portalLabel", "portalSummary", "portalCategoriesIn",
  // The four portals SamaveshBanner features by default, and the helper that
  // reads each one's build status out of DEFAULT_APPS. A data array and a pure
  // function — same category as DEFAULT_APPS itself, and both are rendered by
  // SamaveshBanner.stories.tsx, which passes the array as `portals` and shows
  // the planned-portal treatment the resolver produces.
  "DEFAULT_SAMAVESH_PORTALS", "resolvePortalStatus",
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
  // BRAND_GLYPHS is the list of mark names BrandGlyph can draw (packages/
  // design-system/components/icon/brand-glyph.tsx) — a string array, so there
  // is nothing to render. It is exercised by BrandGlyph.stories.tsx, whose
  // TheSet and OpticalSizing stories iterate it, and documented in the
  // BrandGlyph section of design.md.
  "BRAND_GLYPHS",
  // The India map's geometry constants (packages/design-system/components/
  // data-display/charts/geo/india-projection.ts): the two degree ranges that
  // decide whether a coordinate is plausibly Indian, the default hex radius the
  // density lattice is built on, and the per-state bounding boxes derived from
  // the baked outlines at module load. Numbers and a Map — nothing to render.
  // They are exercised by IndiaPointMap.stories.tsx, which bins live PM-AJAY
  // coordinates through them, and the projection is verified against the
  // outlines it must agree with.
  "INDIA_LAT_RANGE", "INDIA_LON_RANGE", "INDIA_HEX_RADIUS", "INDIA_STATE_BOXES",
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
  // ChartExport is the download control ChartCard renders in its header when
  // `exportable`; it cannot stand alone (it reads the sibling chart's <svg> and
  // <table> from the DOM), so it is shown and documented through ChartCard.
  ChartExport: "ChartCard",
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
