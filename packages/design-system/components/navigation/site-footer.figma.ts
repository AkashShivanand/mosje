// url=<SAMAVESH>?node-id=57800-1922
// source=packages/design-system/components/navigation/site-footer.tsx
// component=SiteFooter
//
// Code Connect template for the SAMAVESH statutory footer.
//
//   library : 3FF5l0SMNIwdpZrKkeyPTm  ·  page "Footer"  ·  section "1 · Site Footer"
//   set     : 57800:1922
//   axes    : Variant (Website | Portal) × Breakpoint (Desktop | Tablet | Mobile) = 6
//
// This file IS what the Figma MCP server hands an agent in Dev Mode, so it
// carries the usage rules as well as the snippet.
// See .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — both Figma properties are accounted for:
//   Variant    (variant) -> variant      Website -> omitted (the DEFAULT) ·
//                                        Portal  -> variant="portal"
//   Breakpoint (variant) -> DELIBERATELY OMITTED. It is the component's own
//                           media queries (1024 / 900 / 640), drawn at 1440, 768
//                           and 375 so a designer can see each layout. There is
//                           no prop, and there must not be one: a footer that
//                           took its layout from a prop would stop responding
//                           to the viewport.
//
// The master draws the estate's own content (Department columns, the lineage,
// the NeGD and Digital India credits). Those are DATA in code, not Figma
// properties, so the snippet names content constants rather than inlining
// strings a designer cannot edit.
//
// ─────────────────────────────────────────────────────────────────────────────
// RULES — the things an agent gets wrong from the geometry alone
//
// 1. ON A WEBSITE PAGE, IMPORT THE HUB WRAPPER. `@/components/website/SiteFooter`
//    carries the Department's columns, credits and lineage. Use this component
//    directly only for a portal or a new site.
// 2. `lineage`, `policyLinks`, `sitemap`, `help` AND `copyright` ARE REQUIRED on
//    BOTH variants — DBIM 5.6. Never list Sitemap or Help inside `policyLinks`:
//    on the portal variant each would render twice in one band.
// 3. THE FOOTER OWNS NO WIDTH. On `website` each band carries `.sa-container`
//    (the 1200 / 1320 / 1440 ladder, the 16 / 24 / 32 margin, the right-wall
//    gutter); on `portal` it is fluid and pads with `--sa-grid-margin-page`,
//    matching a portal masthead. Do not pass `maxWidth`, do not wrap it in a
//    container, and do not add `px-*`. The Figma master binds `container/page`
//    (Website only) and `grid/margin/page` the same way.
// 4. NEVER PASS A BACKGROUND THROUGH `className`. Every colour binds a mode-aware
//    semantic or `cmp/sitefooter/*` token, so the footer repaints for every
//    `data-brand` with no work here.
// 5. `lastUpdated` IS THE CURRENT PAGE'S DATE, passed down from the page — never
//    a site-wide build date.
// 6. PASS `linkAs={Link}` (next/link). Without it every footer link is a full
//    document load. `npm run check:link-as` gates this.
// 7. On `variant="portal"`, `emblem`, `address`, `social` and `columns` are ignored
//    rather than erroring, so one content object can drive both variants.
//    `organisation` is still REQUIRED by the type on portal, and is not drawn.
//
// TOKENS
//   ground        --sa-bg-brand-primary-boldest
//   lead ink      --sa-on-bg-brand-primary-boldest
//   links         --sa-cmp-sitefooter-ink-subtle     boilerplate  --sa-cmp-sitefooter-ink-subtler
//   rules         --sa-cmp-sitefooter-rule-base      policy row   --sa-cmp-sitefooter-rule-subtle
//   social chip   --sa-cmp-sitefooter-chip-default   hover        --sa-cmp-sitefooter-chip-hover
//   marks         --sa-cmp-sitefooter-mark-height    width        .sa-container
//   type          --sa-type-title-2 (column heads) · body-2 (links) · body-3 (lineage, colophon)

import figma from "figma";

const instance = figma.selectedInstance;

/*
 * `Website` is the component's default, so it emits nothing — a snippet that
 * spelled out `variant="website"` would teach an agent to pass the default.
 */
const variant = instance.getEnum("Variant", {
  Website: "",
  Portal: '\n  variant="portal"',
});

const websiteOnly = instance.getEnum("Variant", {
  Website: `
  emblem={EMBLEM}
  address={ADDRESS}
  social={SOCIAL}
  columns={COLUMNS}
  colophonSlot={<VisitorCounter />}`,
  Portal: "",
});

export default {
  example: figma.code`<SiteFooter${variant}
  linkAs={Link}
  organisation={ORGANISATION}${websiteOnly}
  lineage={LINEAGE}
  credits={CREDITS}
  policyLinks={POLICY_LINKS}
  sitemap={{ label: "Sitemap", href: "/website/sitemap" }}
  help={{ label: "Help & Support", href: "/website/contact-us" }}
  relatedLinks={RELATED_LINKS}
  copyright={COPYRIGHT}
  lastUpdated={page.lastUpdated}
/>`,
};
