// THE FIGMA COMPONENT LIVES IN THE SAMAVESH LIBRARY, not the handoff file.
//
//   library : 3FF5l0SMNIwdpZrKkeyPTm  ·  page "SAMAVESH Banner" (Section Templates)
//   set     : 56479:42386  key 11115436c68df8d7fe11c60949da9979bb4430b1
//   axes    : Tone (Light | Dark | Tint) × State (Closed | Open) = 6 variants
//
// It replaces the earlier target, node 7116:33784, which was a SECTION of screen
// mockups in the handoff file — Code Connect maps a COMPONENT, so that mapping
// could never have resolved and this file said so.
//
// STILL NOT PUBLISHABLE, for one remaining reason: the library has to be
// PUBLISHED before the key resolves for Code Connect, and publishing is a human
// action in the Figma UI. Run `npm run figma:connect` from the REPO ROOT with a
// FIGMA_ACCESS_TOKEN once that is done.
//
// The open variants hold real `Portal Card` instances (its own set, 56486:832).
//
// The CATEGORY FILTER row is still absent from Figma, matching what ships: the
// chips render only when the portals on show span more than one category, and
// every portal live today is a scheme portal. Draw them when the first
// commission or corporation goes live.
// url=<SAMAVESH>?node-id=56479-42386
// source=packages/design-system/components/navigation/samavesh-banner.tsx
// component=SamaveshBanner
//
// Code Connect template for the SAMAVESH banner and its portal discovery drawer.
// This file IS what the Figma MCP server hands an agent in Dev Mode, so it
// carries the usage rules as well as the snippet.
// See .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — every Figma property is mapped or its absence is explained.
//   Tone         (variant)  -> tone            Light -> "light" (the DEFAULT, and
//                              omitted from the snippet) · Dark -> "dark" ·
//                              Tint -> "tint". Exhaustive: the set has no fourth.
//   State        (variant)  -> defaultOpen     Closed -> omitted · Open -> set
//                              (uncontrolled; pass `isOpen` + `onToggle` instead
//                              when the page owns the state)
//   Title        (text)     -> title
//   Subline      (text)     -> subline
//   Explore      (text)     -> exploreLabel
//   Drawer title (text)     -> drawerTitle
//
// CODE PROPS WITH NO FIGMA PROPERTY, deliberately:
//   sticky       -> BEHAVIOUR, not appearance. The band pins under the masthead
//                   while its panel is open; Figma draws static states and has
//                   nothing to toggle. Defaults to `true` and only a specimen
//                   passes `false`, so the snippet must never emit it.
//   portals      -> DATA, not children. The component decides per item whether to
//                   render a link or a non-link, from the estate registry.
//                   Emitting the array would invite an agent to hand-write one and
//                   lose the decision that stops a 404 reaching a citizen.
//   viewAllHref  -> both default correctly (`/portals`, "Search and compare
//   viewAllLabel    every portal"). A designer editing them in Figma would be
//                   editing a route, which is not theirs to set.
//   allLabel     -> label on a chip row that does not render yet (see above).
//   logoSrc      -> the badge default is a 13 KB raster of the SAMAVESH mark.
//                   Nothing in Figma should repoint it.
//
// ─────────────────────────────────────────────────────────────────────────────
// RULES — the things an agent gets wrong from the geometry alone
//
// 1. THE DEFAULT TONE IS WHITE ON SAFFRON AND IT FAILS WCAG 2 AT 2.91:1. That is
//    a RECORDED DEVIATION, not a defect — do not "fix" it to a dark ink, and do
//    not change the default. On India Saffron #ff671f NO ink clears both WCAG 2
//    (4.5:1) and APCA (Lc 75) for 14px text; a scan of ~700,000 colours returned
//    zero, and still zero relaxed to Lc 60. White scores the best APCA available
//    on this ground (Lc 59.8) and matches the Figma reference. `tone="dark"`
//    (6.50:1) and `tone="tint"` (17.29:1, the only tone clearing BOTH standards
//    for body text) exist for an audit that challenges it. Full evidence: the
//    header of samavesh-banner.css and entry 8 in docs/guidelines/README.md.
// 2. NEVER SUBSTITUTE THE BRAND GREEN FOR THE DARK INK. `successStrong` measures
//    4.85:1 and APCA Lc 43.9 — below APCA's 45 headline floor, making it the
//    WORST of the credible dark inks despite reading as the most on-brand.
//    `tone="dark"` uses `--sa-text-neutral-bolder` for that reason.
// 3. THE EXPLORE CTA IS `--sa-brand-samavesh-green`, not the reference's #198754
//    (4.53:1) and not `--sa-color-status-success` (correct but far darker than
//    the design). It is 6.72:1 and it matches the reference's tone.
// 4. NEVER PASS A HAND-WRITTEN PORTAL LIST. Omit `portals` and the component
//    derives every LIVE portal from `DEFAULT_APPS`, so it cannot show one that
//    does not exist. Pass a list only for a story or a specimen.
// 5. MOUNT IT BETWEEN THE HEADER AND `<main>`, never inside `<main>`. The drawer
//    title is a `<p>` naming a `<nav>` — NOT an `<h2>`, which is what it used to
//    be: the banner renders before every page's `<h1>`, so a heading here inverts
//    the document outline, and moving it out of `<main>` does not fix that.
//    Heading order is a property of the document, not of the landmark.
// 6. THE BANNER OWNS NO WIDTH. Both rows carry `.sa-container`, which supplies
//    the container ladder (1200 / 1320 / 1440) and the right-wall gutter. Never
//    wrap it in a container of your own and never give it `max-width` or `px-*`.
// 7. THE DRAWER OVERLAYS THE PAGE. It is `position: absolute` off the band, so a
//    consumer that wraps the banner in `overflow: hidden` will clip it. The
//    documentation specimen reserves height below the band instead.
// 8. IT PINS UNDER THE MASTHEAD WHILE ITS PANEL IS OPEN, AND ONLY THEN, reading
//    `--sa-header-stuck` from `SiteHeader`. Never pin it to `--sa-header-pinned`
//    — that is the RESTING height, for `scroll-padding-top`, and using it left an
//    89–155px strip of page content between the two. Never make it pin always:
//    that forces a condense to stay affordable, and the condense costs the
//    subline, which is the one line explaining what SAMAVESH is. The subline is
//    present in every state. Pass `sticky={false}` for a specimen.
// 9. WHERE IT APPEARS ON THE WEBSITE IS AN ADMIN SETTING, not a prop. The hub
//    wrapper `@/components/website/SamaveshBanner` reads the placement context;
//    import THAT on website pages, and this one everywhere else.
//
// TOKENS
//   band ground   --sa-color-brand-saffron        band ink    --sa-color-text-onPrimary
//   (tone=dark and tone=tint re-point the ink and the ground; nothing else moves)
//   drawer ground --sa-color-brand-saffronLight   CTA         --sa-brand-samavesh-green
//   card ground   --sa-bg-neutral-base            card border --sa-color-brand-saffronDark
//   sticky offset --sa-header-stuck               type        --sa-type-headline-3 /
//                                                             headline-2 / body-2 /
//                                                             label-1 / title-1

import figma from "figma";

const instance = figma.selectedInstance;

const title = instance.getString("Title");
const subline = instance.getString("Subline");
const exploreLabel = instance.getString("Explore");
const drawerTitle = instance.getString("Drawer title");

/*
 * Both variant axes, mapped exhaustively. `Light` and `Closed` are the component's
 * own defaults, so they emit nothing — a snippet that spelled out `tone="light"`
 * would teach an agent to pass the default explicitly everywhere.
 */
const tone = instance.getEnum("Tone", {
  Light: "",
  Dark: '\n  tone="dark"',
  Tint: '\n  tone="tint"',
});

const state = instance.getEnum("State", {
  Closed: "",
  Open: "\n  defaultOpen",
});

/*
 * `portals` is deliberately absent from the emitted snippet. Omitting it takes
 * DEFAULT_SAMAVESH_PORTALS, whose status each resolves from the estate registry
 * — which is the behaviour that stops a not-yet-built portal rendering as a
 * link. A snippet that spelled the array out would invite an agent to hand-write
 * one and lose that.
 */
export default {
  example: figma.code`{/* Site-wide chrome: mount BETWEEN <Header /> and <main>, never inside it. */}
<SamaveshBanner
  title="${title}"
  subline="${subline}"
  exploreLabel="${exploreLabel}"
  drawerTitle="${drawerTitle}"${tone}${state}
/>`,
};
